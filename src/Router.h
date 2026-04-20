#pragma once
#include "QueueingStrategy.h"
#include <vector>

class Router {
private:
    QueueingStrategy* strategy;

public:
    Router(QueueingStrategy* initialStrategy) : strategy(initialStrategy) {}

    void setStrategy(QueueingStrategy* newStrategy) {
        strategy = newStrategy;
    }

    std::vector<Packet> run(const std::vector<Packet>& packets) {
        // Load the packets into the queue
        for (const auto& p : packets) {
            strategy->addPacket(p);
        }
        
        // Process them
        return strategy->processPackets();
    }
};
