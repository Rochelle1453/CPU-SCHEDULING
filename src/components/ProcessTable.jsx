import React from "react";

export default function ProcessTable({ processes, removeProcess }) {
  return (
    <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
      <div className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        Process Queue
      </div>
      {processes.length === 0 ? (
        <div className="text-center text-gray-400 py-8 sm:py-12 text-sm sm:text-base">
          No processes added yet
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="min-w-full bg-white rounded-lg shadow-md border-collapse overflow-hidden">
              <thead>
                <tr className="bg-purple-500/20 border-1 border-purple-600/70 shadow-[0_0_10px_rgba(128,0,128,0.7)] text-purple-500 text-xs sm:text-sm uppercase">
                  <th className="py-2 sm:py-3 px-2">Process ID</th>
                  <th className="py-2 sm:py-3 px-2">Arrival Time</th>
                  <th className="py-2 sm:py-3 px-2">Burst Time</th>
                  <th className="py-2 sm:py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((proc, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 sm:py-3 px-2 font-semibold text-xs sm:text-sm">{proc.id}</td>
                    <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">{proc.arrival}</td>
                    <td className="py-2 sm:py-3 px-2 text-xs sm:text-sm">{proc.burst}</td>
                    <td className="py-2 sm:py-3 px-2">
                      <button
                        className="bg-gray-500/20 border-1 border-gray-600/70 shadow-[0_0_10px_rgba(128,128,128,0.7)] text-gray-500 px-2 sm:px-3 py-1 rounded-lg text-xs hover:bg-gray-600 hover:text-white transition-colors"
                        onClick={() => removeProcess(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}