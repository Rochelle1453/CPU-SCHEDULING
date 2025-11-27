import React from "react";

export default function AlgorithmSelector({ onSelect }) {
  const algorithms = [
    {
      id: "fcfs",
      name: "First Come First Serve",
      description: "Processes are executed in the order they arrive",
    },
    {
      id: "sjf",
      name: "Shortest Job First",
      description: "Process with shortest burst time executes first",
    },
    {
      id: "rr",
      name: "Round Robin",
      description: "Each process gets a fixed time quantum",
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-gray-800 text-center p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-transparent text-gray-800 text-center p-6 sm:p-10" id="header-area">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">CPU Scheduling Simulator</h1>
          <p className="text-xs sm:text-sm opacity-90">Select a scheduling algorithm to simulate</p>
        </div>

        <div className="p-6 sm:p-10" id="content-area">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {algorithms.map((algo) => (
              <button
                key={algo.id}
                onClick={() => onSelect(algo.id)}
                className="bg-purple-500/20 border-2 border-purple-600/70 shadow-[0_0_10px_rgba(128,0,128,0.7)] p-6 sm:p-8 rounded-xl hover:bg-purple-500/30 transition-all text-left"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{algo.icon}</div>
                <h3 className="text-base sm:text-lg font-bold text-purple-600 mb-2">{algo.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{algo.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}