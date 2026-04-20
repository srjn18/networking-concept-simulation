let generatedPackets = [];

const generateBtn = document.getElementById('generateBtn');
const runBtn = document.getElementById('runBtn');
const packetCountInput = document.getElementById('packetCount');
const initialPacketsList = document.getElementById('initialPacketsList');

const fifoTimeline = document.getElementById('fifoTimeline');
const wfqTimeline = document.getElementById('wfqTimeline');
const fifoTotal = document.getElementById('fifoTotal');
const wfqTotal = document.getElementById('wfqTotal');
const fifoStatus = document.getElementById('fifoStatus');
const wfqStatus = document.getElementById('wfqStatus');

function getPriorityClass(p) {
    if (p <= 1) return 'pkt-low';
    if (p <= 3) return 'pkt-med';
    return 'pkt-high';
}

function createPacketElement(packet) {
    const el = document.createElement('div');
    el.className = `packet ${getPriorityClass(packet.priority)}`;
    el.innerHTML = `
        <span>ID:${packet.id}</span>
        <span class="size-badge">P${packet.priority}</span>
    `;
    return el;
}

generateBtn.addEventListener('click', () => {
    const count = parseInt(packetCountInput.value) || 10;
    generatedPackets = [];
    initialPacketsList.innerHTML = '';
    
    // Arrival time simulated sequentially
    let currentArrival = 0;

    for (let i = 1; i <= count; i++) {
        currentArrival += Math.floor(Math.random() * 3) + 1; // 1 to 3 ms gap
        
        const packet = {
            id: i,
            size: Math.floor(Math.random() * 1000) + 100, // 100 to 1100 bytes
            arrivalTime: currentArrival,
            priority: Math.floor(Math.random() * 5) + 1 // 1 to 5
        };
        
        generatedPackets.push(packet);
        initialPacketsList.appendChild(createPacketElement(packet));
    }

    runBtn.disabled = false;
    
    // Reset Views
    fifoTimeline.innerHTML = '<div class="empty-timeline">Awaiting execution...</div>';
    wfqTimeline.innerHTML = '<div class="empty-timeline">Awaiting execution...</div>';
    fifoTotal.innerText = '0';
    wfqTotal.innerText = '0';
    fifoStatus.innerText = 'Ready';
    wfqStatus.innerText = 'Ready';
});

runBtn.addEventListener('click', async () => {
    if (generatedPackets.length === 0) return;
    
    runBtn.disabled = true;
    generateBtn.disabled = true;
    
    fifoStatus.innerText = 'Running...';
    wfqStatus.innerText = 'Running...';

    initialPacketsList.style.opacity = '0.5';

    try {
        const payload = { packets: generatedPackets };
        
        const response = await fetch('/api/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Simulation Error: ${errorData.error}`);
            throw new Error(errorData.error);
        }

        const data = await response.json();
        
        // Animation
        animateTimeline(data.fifo, fifoTimeline, fifoTotal, fifoStatus);
        animateTimeline(data.wfq, wfqTimeline, wfqTotal, wfqStatus);

    } catch (err) {
        console.error(err);
        fifoStatus.innerText = 'Failed';
        wfqStatus.innerText = 'Failed';
    } finally {
        generateBtn.disabled = false;
        runBtn.disabled = false;
        initialPacketsList.style.opacity = '1';
    }
});

function animateTimeline(packets, container, totalCounter, statusEl) {
    container.innerHTML = '';
    let i = 0;
    
    statusEl.innerText = 'Processing';
    statusEl.style.color = 'var(--priority-med)';

    const interval = setInterval(() => {
        if (i >= packets.length) {
            clearInterval(interval);
            statusEl.innerText = 'Completed';
            statusEl.style.color = 'var(--priority-low)';
            return;
        }

        const pktEl = createPacketElement(packets[i]);
        container.appendChild(pktEl);
        totalCounter.innerText = i + 1;

        i++;
    }, 200); // 200ms delay between packets
}
