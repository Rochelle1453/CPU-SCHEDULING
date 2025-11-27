import { useState, useEffect } from "react";

export default function ProcessForm({ addProcess, nextId, runScheduler, clearAll, algorithm }) {
  const [id, setId] = useState(`P${nextId}`);
  const [arrival, setArrival] = useState(0);
  const [burst, setBurst] = useState(0);
  const [quantum, setQuantum] = useState(2);

  useEffect(() => {
    setId(`P${nextId}`);
  }, [nextId]);

  const handleAdd = () => {
    if (arrival < 0) return alert("Arrival time must be non-negative!");
    if (burst <= 0) return alert("Burst time must be positive!");

    addProcess(id, parseInt(arrival), parseInt(burst));
    setId(`P${nextId + 1}`);
    setArrival(0);
    setBurst(0);
  };

  return (
    <div className="bg-gray-100 p-4 sm:p-6 rounded-lg space-y-4">
      <div className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
        Add New Process
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-semibold text-gray-600">Process ID</label>
          <input
            className="p-2 sm:p-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-semibold text-gray-600">Arrival Time</label>
          <input
            className="p-2 sm:p-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
            type="number"
            min="0"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-semibold text-gray-600">Burst Time</label>
          <input
            className="p-2 sm:p-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
            type="number"
            min="1"
            value={burst}
            onChange={(e) => setBurst(e.target.value)}
          />
        </div>
      </div>

      {algorithm === "rr" && (
        <div className="flex flex-col gap-1 max-w-xs">
          <label className="text-xs sm:text-sm font-semibold text-gray-600">Time Quantum</label>
          <input
            className="p-2 sm:p-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
            type="number"
            min="1"
            value={quantum}
            onChange={(e) => setQuantum(e.target.value)}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          className="bg-purple-500/20 border-1 border-purple-600/70 shadow-[0_0_10px_rgba(128,0,128,0.7)] text-purple-500 px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-colors"
          onClick={handleAdd}
        >
          Add Process
        </button>
        <button
          className="bg-green-500/20 border-1 border-green-600/70 shadow-[0_0_10px_rgba(0,128,0,0.7)] text-green-600 px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
          onClick={() => runScheduler(quantum)}
        >
          Run
        </button>
        <button
          className="bg-gray-500/20 border-1 border-gray-600/70 shadow-[0_0_10px_rgba(128,128,128,0.7)] text-gray-500 px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg font-semibold hover:bg-gray-600 hover:text-white transition-colors"
          onClick={clearAll}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}