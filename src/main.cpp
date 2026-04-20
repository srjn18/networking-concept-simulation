#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include "../include/nlohmann/json.hpp"

#include "Packet.h"
#include "FIFOScheduler.h"
#include "WFQScheduler.h"
#include "Router.h"

using json = nlohmann::json;

void processSimulation(const std::string& inputFile, const std::string& outputFile) {
    std::ifstream inFile(inputFile);
    if (!inFile.is_open()) {
        std::cerr << "Could not open input file: " << inputFile << std::endl;
        return;
    }

    json jInput;
    inFile >> jInput;
    inFile.close();

    std::vector<Packet> initialPackets;
    for (const auto& item : jInput["packets"]) {
        initialPackets.emplace_back(
            item["id"].get<int>(),
            item["size"].get<int>(),
            item["arrivalTime"].get<int>(),
            item["priority"].get<int>()
        );
    }

    FIFOScheduler fifo;
    WFQScheduler wfq;

    Router router(&fifo);
    std::vector<Packet> fifoResult = router.run(initialPackets);

    router.setStrategy(&wfq);
    std::vector<Packet> wfqResult = router.run(initialPackets);

    // Build Output JSON
    json jOutput;
    
    json fifoJson = json::array();
    for (const auto& p : fifoResult) {
        fifoJson.push_back({
            {"id", p.getId()},
            {"size", p.getSize()},
            {"arrivalTime", p.getArrivalTime()},
            {"priority", p.getPriority()}
        });
    }

    json wfqJson = json::array();
    for (const auto& p : wfqResult) {
        wfqJson.push_back({
            {"id", p.getId()},
            {"size", p.getSize()},
            {"arrivalTime", p.getArrivalTime()},
            {"priority", p.getPriority()}
        });
    }

    jOutput["fifo"] = fifoJson;
    jOutput["wfq"] = wfqJson;

    std::ofstream outFile(outputFile);
    if (!outFile.is_open()) {
        std::cerr << "Could not open output file: " << outputFile << std::endl;
        return;
    }

    outFile << jOutput.dump(4);
    outFile.close();
}

int main(int argc, char* argv[]) {
    std::string inputFile = "io/input.json";
    std::string outputFile = "io/output.json";

    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        if (arg == "--input" && i + 1 < argc) {
            inputFile = argv[++i];
        } else if (arg == "--output" && i + 1 < argc) {
            outputFile = argv[++i];
        }
    }

    std::cout << "Running Simulation..." << std::endl;
    std::cout << "Input: " << inputFile << std::endl;
    std::cout << "Output: " << outputFile << std::endl;

    processSimulation(inputFile, outputFile);

    std::cout << "Simulation completed. Output generated." << std::endl;

    return 0;
}
