import { useState } from "react";
import ProcessForm from "./components/ProcessForm";
import ProcessTable from "./components/ProcessTable";

export default function App() {
  const [processes, setProcesses] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [results, setResults] = useState(null);
  const [ganttBlocks, setGanttBlocks] = useState(null);

  const addProcess = (id, arrival, burst) => {
    setProcesses((prev) => [
      ...prev,
      { id, arrival, burst, order: prev.length },
    ]);

    setNextId((prev) => prev + 1);
    setResults(null);
  };

  const removeProcess = (index) => {
    const updated = [...processes];
    updated.splice(index, 1);
    setProcesses(updated);
    setResults(null);
  };

  const clearAll = () => {
    setProcesses([]);
    setNextId(1);
    setResults(null);
    setGanttBlocks(null);
  };

  const runScheduler = () => {
    if (processes.length === 0) {
      alert("Please add at least one process first!");
      return;
    }

    const sorted = [...processes].sort((a, b) => {
      if (a.arrival !== b.arrival) return a.arrival - b.arrival;
      return a.order - b.order;
    });

    let currentTime = 0;
    const res = [];
    const gantt = [];

    sorted.forEach((proc) => {
      if (currentTime < proc.arrival) {
        // Idle block
        gantt.push({
          id: "IDLE",
          start: currentTime,
          end: proc.arrival,
          isIdle: true,
        });
        currentTime = proc.arrival;
      }

      const startTime = currentTime;
      const completionTime = startTime + proc.burst;
      const turnaround = completionTime - proc.arrival;
      const waiting = startTime - proc.arrival;

      res.push({
        id: proc.id,
        arrival: proc.arrival,
        burst: proc.burst,
        start: startTime,
        completion: completionTime,
        turnaround,
        waiting,
      });

      gantt.push({
        id: proc.id,
        start: startTime,
        end: completionTime,
        isIdle: false,
      });

      currentTime = completionTime;
    });

    setResults(res);
    setGanttBlocks(gantt);
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-800 text-center p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="bg-transparent text-gray-800 text-center p-10" id="header-area">
          <h1 className="text-3xl font-bold mb-2">FCFS CPU Scheduling Simulator</h1>
          <p className="text-sm opacity-90">First Come First Served - Process Scheduling Visualization</p>
        </div>

        <div className="p-10 space-y-10  " id="content-area">

          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <ProcessForm
                addProcess={addProcess}
                nextId={nextId}
                runScheduler={runScheduler}
                clearAll={clearAll}
              />
            </div>
          </div>

          {!results && processes.length > 0 && (
            <div className="flex justify-center">
              <div className="w-full max-w-3xl">
                
                <ProcessTable processes={processes} removeProcess={removeProcess} />
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                <div>
                  
                  <ProcessTable processes={processes} removeProcess={removeProcess} />
                </div>

                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="text-lg font-semibold text-gray-800 mb-4">Execution Results</div>

                  <table className="w-full bg-white rounded-lg shadow-md border-collapse overflow-hidden text-center">
                    <thead>
                      <tr className="bg-purple-500/20 border-1 border-purple-600/70 shadow-[0_0_10px_rgba(128,0,128,0.7)] text-purple-500 text-sm uppercase">
                        <th className="py-3 px-2">Process</th>
                        <th className="py-3 px-2">AT</th>
                        <th className="py-3 px-2">BT</th>
                        <th className="py-3 px-2">CT</th>
                        <th className="py-3 px-2">TAT</th>
                        <th className="py-3 px-2">WT</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((r, idx) => (
                        <tr key={idx} className="hover:bg-gray-100">
                          <td className="py-3 px-2 font-semibold text-center">{r.id}</td>
                          <td className="py-3 px-2 text-center">{r.arrival}</td>
                          <td className="py-3 px-2 text-center">{r.burst}</td>
                          <td className="py-3 px-2 text-center">{r.completion}</td>
                          <td className="py-3 px-2 text-center">{r.turnaround}</td>
                          <td className="py-3 px-2 text-center">{r.waiting}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {ganttBlocks && (
              <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                  <div className="rounded-lg">

                    <div className="overflow-x-auto">

                      <div className="flex items-end">
                        {ganttBlocks.map((block, idx) => {
                          const width = (block.end - block.start) * 50;

                          return (
                            <div
                              key={idx}
                              className="h-10 flex items-center justify-center font-semibold bg-purple-500/20 border-1 border-purple-600/70 shadow-[0_0_10px_rgba(128,0,128,0.7)] text-purple-500 text-sm uppercase"
                              style={{ width }}
                              title={`${block.id}: ${block.start} → ${block.end}`}
                            >
                              {block.id}
                            </div>
                          );
                        })}
                      </div>

                      <div className="relative h-10 mt-2">
                        {Array.from(
                          new Set(ganttBlocks.flatMap(b => [b.start, b.end]))
                        )
                          .sort((a, b) => a - b)
                          .map((time, idx) => (
                            <div
                              key={idx}
                              className="absolute bottom-0 text-xs font-medium text-gray-800"
                              style={{ left: time * 50 }}
                            >
                              {time}
                            </div>
                          ))}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}