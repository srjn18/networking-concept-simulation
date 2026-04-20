<<<<<<< HEAD
# Network Packet Scheduler Simulation

A C++ and Node.js full-stack application simulating the scheduling differences between First In First Out (FIFO) and Weighted Fair Queuing (WFQ) mechanisms. The program features a beautifully modernized Graphical Web UI.

## File Structure
- `/src` -> Object-Oriented C++ core logic.
- `/ui` -> Modern glassmorphism HTML/CSS/JS interface.
- `server.js` -> A zero-dependency Node bridge routing REST API requests to the physical executable local File I/O.
- `CMakeLists.txt` -> Build structure file.

## Prerequisites
- Node.js installed locally.
- A C++ environment mapped properly. The instructions below use `CMake` and `G++/MSYS` or `MSVC`.

## Instructions

### Step 1. Compile the C++ Backend
Using command line `CMake` (or via your preferred IDE such as Visual Studio / CLion):

```bash
mkdir build
cd build
cmake ..
cmake --build .
```

*Note: Ensure the resulting executable is either located at `./simulator.exe` or `./build/simulator.exe` path relatively aligned.*

### Step 2. Launch Local Server
In the root directy (where `server.js` is located):

```bash
node server.js
```

### Step 3. Access Dashboard
Navigate to http://localhost:3000/ to view the simulation dashboard. Use the forms to generate queues and process via algorithms visualizing the timeline comparisons.
=======
# networking-concept-simulation
this is part of our project based learning course outcome for our c++ course. here we simulate the concept of fair queuing vs weighted-fair queuing using c++
>>>>>>> 41ba2ab82f0d5b225628fefb9ff84cdbaacd91f5
