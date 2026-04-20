#pragma once
#include <iostream>

class Packet {
public:
    int id;
    int size;
    int arrivalTime;
    int priority;

    Packet() : id(0), size(0), arrivalTime(0), priority(0) {}

    Packet(int id, int size, int arrivalTime, int priority)
        : id(id), size(size), arrivalTime(arrivalTime), priority(priority) {}

    int getId() const { return id; }
    int getSize() const { return size; }
    int getArrivalTime() const { return arrivalTime; }
    int getPriority() const { return priority; }
};
