const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

// Helper to handle static files
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    if (req.url === '/api/simulate' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // Write to io/input.json
            const inputPath = path.join(__dirname, 'io', 'input.json');
            const outputPath = path.join(__dirname, 'io', 'output.json');
            
            // Check multiple possible locations for the executable
            let extPath = null;
            const possiblePaths = [
                path.join(__dirname, 'build', 'Debug', 'simulator.exe'),  // MSVC Debug build
                path.join(__dirname, 'build', 'Release', 'simulator.exe'), // MSVC Release build
                path.join(__dirname, 'build', 'simulator.exe'),            // Standard cmake
                path.join(__dirname, 'simulator.exe'),                     // Root directory
                path.join(__dirname, 'build', 'simulator'),                // Linux/Mac
                path.join(__dirname, 'simulator')                          // Linux/Mac root
            ];
            
            for (const testPath of possiblePaths) {
                if (fs.existsSync(testPath)) {
                    extPath = testPath;
                    break;
                }
            }
            
            if (!extPath) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Executable not found. Please compile the C++ code. Expected locations: ./build/Debug/simulator.exe, ./build/simulator.exe, or ./simulator.exe' }));
                return;
            }

            fs.writeFile(inputPath, body, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error writing input file' }));
                    return;
                }

                // Execute C++ simulator
                const cmd = `"${extPath}" --input "${inputPath}" --output "${outputPath}"`;
                console.log(`Executing: ${cmd}`);
                
                exec(cmd, (execErr, stdout, stderr) => {
                    if (execErr) {
                        console.error('Execution Error:', stderr);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Simulation failed to run', details: stderr }));
                        return;
                    }

                    console.log('Simulation ran successfully:\n', stdout);

                    // Read Output
                    fs.readFile(outputPath, 'utf8', (readErr, data) => {
                        if (readErr) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Error reading output file' }));
                            return;
                        }

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(data);
                    });
                });
            });
        });
        return;
    }

    // Serve static files from 'ui' directory
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, 'ui', filePath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end("404 Not Found", 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Ensure you have compiled the C++ backend and placed simulator.exe in the 'build' directory.`);
});
