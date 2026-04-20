#pragma once
#include <vector>
#include "Packet.h"

// Abstract Base Class
class QueueingStrategy {
public:
    virtual ~QueueingStrategy() = default;

    // Pure virtual functions
    virtual void addPacket(Packet p) = 0;
    virtual std::vector<Packet> processPackets() = 0;
};
