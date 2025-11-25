import React from "react";

export default function Results({ results, ganttBlocks }) {
  const pixelsPerUnit = 50;

  const minTime = 0;
  const maxTime = Math.max(...ganttBlocks.map(b => b.end));

  return (
    <div className="space-y-6">

      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="text-lg font-semibold text-gray-800 mb-4">📈 Execution Results</div>

        <table className="w-full bg-white rounded-lg shadow-md border-collapse overflow-hidden text-center">
          <thead>
            <tr className="bg-purple-500/20 border-1 border-purple-600/70 shadow-[0_0_10px_rgba(128,0,128,0.7)] text-purple-500 text-white text-sm uppercase">
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

      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="text-lg font-semibold text-gray-800 mb-4">⏱️ Gantt Chart</div>

        <div className="overflow-x-auto">

          <div className="flex items-end">
            {ganttBlocks.map((block, idx) => {
              const width = (block.end - block.start) * pixelsPerUnit;

              return (
                <div
                  key={idx}
                  className="h-16 flex items-center justify-center font-semibold text-gray-800 border-2 border-gray-800"
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
                  style={{ left: time * pixelsPerUnit }}
                >
                  {time}
                </div>
              ))}
          </div>

        </div>
      </div>
    </div>
  );
}
