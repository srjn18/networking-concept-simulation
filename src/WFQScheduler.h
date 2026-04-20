#pragma once
#include "QueueingStrategy.h"
#include <queue>
#include <vector>

// Comparator for WFQ min-priority queue
// We want higher priority (lower priority numerical value means higher importance? Let's assume higher priority numerical value = processed first).
// The user asks for "Higher priority packets processed first". 
// Priority Queue in C++ outputs largest element first based on the comparator.
// So if priority is higher, it should appear larger.
struct ComparePacket {
    bool operator()(const Packet& p1, const Packet& p2) {
        if (p1.getId() == p2.getId()) return false;
        if (p1.getPriority() != p2.getPriority()) {
            // Smaller priority means it drops down. We want larger priority at top.
            return p1.getPriority() < p2.getPriority();
        }
        // If priorities are equal, the one that arrived earlier (smaller arrivalTime)
        // should be processed first.
        return p1.getArrivalTime() > p2.getArrivalTime();
    }
};

class WFQScheduler : public QueueingStrategy {
private:
    std::priority_queue<Packet, std::vector<Packet>, ComparePacket> pq;

public:
    void addPacket(Packet p) override {
        pq.push(p);
    }

    std::vector<Packet> processPackets() override {
        std::vector<Packet> processed;
        while (!pq.empty()) {
            processed.push_back(pq.top());
            pq.pop();
        }
        return processed;
    }
};
