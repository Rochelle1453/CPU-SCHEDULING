import React from "react";

export default function ProcessTable({ processes, removeProcess }) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <div className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        Process Queue
      </div>
      {processes.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No processes added yet</div>
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md border-collapse overflow-hidden">
          <thead>
            <tr className="bg-purple-500/20 border-1 border-purple-600/70 shadow-[0_0_10px_rgba(128,0,128,0.7)] text-purple-500 text-sm uppercase">
              <th className="py-3 px-2">Process ID</th>
              <th className="py-3 px-2">Arrival Time</th>
              <th className="py-3 px-2">Burst Time</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-3 px-2 font-semibold">{proc.id}</td>
                <td className="py-3 px-2">{proc.arrival}</td>
                <td className="py-3 px-2">{proc.burst}</td>
                <td className="py-3 px-2">
                  <button
                    className="bg-gray-500/20 border-1 border-gray-600/70 shadow-[0_0_10px_rgba(128,128,128,0.7)] text-gray-500 px-3 py-1 rounded-lg text-xs hover:bg-gray-600 hover:text-white"
                    onClick={() => removeProcess(index)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}