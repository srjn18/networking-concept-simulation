#pragma once
#include "QueueingStrategy.h"
#include <queue>

class FIFOScheduler : public QueueingStrategy {
private:
    std::queue<Packet> packetQueue;

public:
    void addPacket(Packet p) override {
        packetQueue.push(p);
    }

    std::vector<Packet> processPackets() override {
        std::vector<Packet> processed;
        while (!packetQueue.empty()) {
            processed.push_back(packetQueue.front());
            packetQueue.pop();
        }
        return processed;
    }
};
