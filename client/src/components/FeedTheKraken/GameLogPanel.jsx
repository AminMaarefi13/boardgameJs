import React from "react";

export default function GameLogPanel({ logs }) {
  return (
    <div
      className="bg-gradient-to-br from-gray-50 to-gray-100 shadow rounded-2xl p-4 w-full border border-indigo-200"
      dir="rtl"
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-indigo-700 flex items-center gap-2">
        <span>📜</span> وقایع بازی
      </h2>
      <ul className="flex flex-col gap-1 text-sm text-gray-700 max-h-64 overflow-y-auto pr-1 text-right">
        {[...logs].reverse().map((log, idx) => (
          <li
            key={idx}
            className="px-3 py-1 rounded-lg bg-white/80 border border-gray-100 shadow-sm"
          >
            • {log.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
