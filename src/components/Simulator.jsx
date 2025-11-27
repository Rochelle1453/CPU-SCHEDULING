import { useState } from "react";
import ProcessForm from "./ProcessForm";
import ProcessTable from "./ProcessTable";

export default function Simulator({ algorithm, onBack }) {
  const [processes, setProcesses] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [results, setResults] = useState(null);
  const [ganttBlocks, setGanttBlocks] = useState(null);

  const algorithmNames = {
    fcfs: "FCFS CPU Scheduling Simulator",
    sjf: "SJF CPU Scheduling Simulator",
    rr: "Round Robin CPU Scheduling Simulator"
  };

  const algorithmDesc = {
    fcfs: "First Come First Served - Process Scheduling Visualization",
    sjf: "Shortest Job First - Process Scheduling Visualization",
    rr: "Round Robin - Process Scheduling Visualization"
  };

  const addProcess = (id, arrival, burst) => {
    setProcesses((prev) => [
      ...prev,
      { id, arrival, burst, order: prev.length, remainingBurst: burst },
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

  const runFCFS = () => {
    const sorted = [...processes].sort((a, b) => {
      if (a.arrival !== b.arrival) return a.arrival - b.arrival;
      return a.order - b.order;
    });

    let currentTime = 0;
    const res = [];
    const gantt = [];

    sorted.forEach((proc) => {
      if (currentTime < proc.arrival) {
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

  const runSJF = () => {
    const queue = [...processes].map((p) => ({ ...p }));
    let currentTime = 0;
    const res = [];
    const gantt = [];
    const completed = [];

    while (completed.length < processes.length) {
      const available = queue.filter(
        (p) => p.arrival <= currentTime && !completed.includes(p.id)
      );

      if (available.length === 0) {
        const nextArrival = Math.min(
          ...queue.filter((p) => !completed.includes(p.id)).map((p) => p.arrival)
        );
        gantt.push({
          id: "IDLE",
          start: currentTime,
          end: nextArrival,
          isIdle: true,
        });
        currentTime = nextArrival;
        continue;
      }

      available.sort((a, b) => {
        if (a.burst !== b.burst) return a.burst - b.burst;
        if (a.arrival !== b.arrival) return a.arrival - b.arrival;
        return a.order - b.order;
      });

      const proc = available[0];
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

      completed.push(proc.id);
      currentTime = completionTime;
    }

    setResults(res);
    setGanttBlocks(gantt);
  };

  const runRR = (quantum) => {
    const q = parseInt(quantum) || 2;
    const queue = [...processes]
      .sort((a, b) => {
        if (a.arrival !== b.arrival) return a.arrival - b.arrival;
        return a.order - b.order;
      })
      .map((p) => ({ ...p, remainingBurst: p.burst }));

    let currentTime = 0;
    const gantt = [];
    const readyQueue = [];
    let queueIndex = 0;
    const completionTimes = {};

    while (queueIndex < queue.length || readyQueue.length > 0) {
      while (queueIndex < queue.length && queue[queueIndex].arrival <= currentTime) {
        readyQueue.push(queue[queueIndex]);
        queueIndex++;
      }

      if (readyQueue.length === 0) {
        const nextArrival = queue[queueIndex].arrival;
        gantt.push({
          id: "IDLE",
          start: currentTime,
          end: nextArrival,
          isIdle: true,
        });
        currentTime = nextArrival;
        continue;
      }

      const proc = readyQueue.shift();
      const executeTime = Math.min(q, proc.remainingBurst);
      const startTime = currentTime;
      const endTime = startTime + executeTime;

      gantt.push({
        id: proc.id,
        start: startTime,
        end: endTime,
        isIdle: false,
      });

      proc.remainingBurst -= executeTime;
      currentTime = endTime;

      while (queueIndex < queue.length && queue[queueIndex].arrival <= currentTime) {
        readyQueue.push(queue[queueIndex]);
        queueIndex++;
      }

      if (proc.remainingBurst > 0) {
        readyQueue.push(proc);
      } else {
        completionTimes[proc.id] = currentTime;
      }
    }

    const res = processes.map((proc) => {
      const completion = completionTimes[proc.id];
      const turnaround = completion - proc.arrival;
      const waiting = turnaround - proc.burst;

      return {
        id: proc.id,
        arrival: proc.arrival,
        burst: proc.burst,
        completion,
        turnaround,
        waiting,
      };
    });

    setResults(res);
    setGanttBlocks(gantt);
  };

  const runScheduler = (quantum) => {
    if (processes.length === 0) {
      alert("Please add at least one process first!");
      return;
    }

    if (algorithm === "fcfs") runFCFS();
    else if (algorithm === "sjf") runSJF();
    else if (algorithm === "rr") runRR(quantum);
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-800 text-center p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        
        <div className="bg-transparent text-gray-800 text-center p-6 sm:p-10" id="header-area">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{algorithmNames[algorithm]}</h1>
          <p className="text-xs sm:text-sm opacity-90">{algorithmDesc[algorithm]}</p>
        </div>

        <div className="relative p-6 sm:p-10 space-y-6 sm:space-y-10" id="content-area">

          <button
  onClick={onBack}
  className="absolute bg-purple-500/20 border-purple-600/70 shadow-[0_0_10px_rgba(128,0,128,0.7)] text-purple-500 px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-colors"
  style={{
    left: "15px",
    bottom: "-20px",       
    fontSize: "12px",       
    display: "flex",       
    alignItems: "center",  
    
  }}
>
            ← Return
          </button>

          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <ProcessForm
                addProcess={addProcess}
                nextId={nextId}
                runScheduler={runScheduler}
                clearAll={clearAll}
                algorithm={algorithm}
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
            <div className="space-y-6 sm:space-y-10">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                <div>
                  <ProcessTable processes={processes} removeProcess={removeProcess} />
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
                    <div className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                      Execution Results
                    </div>

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                        <table className="min-w-full bg-white rounded-lg shadow-md border-collapse overflow-hidden text-center">
                          <thead>
                            <tr className="bg-purple-500/20 border-1 border-purple-600/70 shadow-[0_0_10px_rgba(128,0,128,0.7)] text-purple-500 text-xs sm:text-sm uppercase">
                              <th className="py-2 sm:py-3 px-2">Process</th>
                              <th className="py-2 sm:py-3 px-2">AT</th>
                              <th className="py-2 sm:py-3 px-2">BT</th>
                              <th className="py-2 sm:py-3 px-2">CT</th>
                              <th className="py-2 sm:py-3 px-2">TAT</th>
                              <th className="py-2 sm:py-3 px-2">WT</th>
                            </tr>
                          </thead>

                          <tbody>
                            {results.map((r, idx) => (
                              <tr key={idx} className="hover:bg-gray-100">
                                <td className="py-2 sm:py-3 px-2 font-semibold text-xs sm:text-sm">{r.id}</td>
                                <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">{r.arrival}</td>
                                <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">{r.burst}</td>
                                <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">{r.completion}</td>
                                <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">{r.turnaround}</td>
                                <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">{r.waiting}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

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
                              className="h-10 sm:h-12 flex items-center justify-center font-semibold bg-purple-500/20 border-1 border-purple-600/70 shadow-[0_0_10px_rgba(128,0,128,0.7)] text-purple-500 text-xs sm:text-sm uppercase"
                              style={{ width, minWidth: width }}
                              title={`${block.id}: ${block.start} → ${block.end}`}
                            >
                              {block.id}
                            </div>
                          );
                        })}
                      </div>

                      <div className="relative h-8 sm:h-10 mt-2">
                        {Array.from(new Set(ganttBlocks.flatMap((b) => [b.start, b.end])))
                          .sort((a, b) => a - b)
                          .map((time, idx) => (
                            <div
                              key={idx}
                              className="absolute -left-28 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700 text-sm flex items-center gap-2"
      
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

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
