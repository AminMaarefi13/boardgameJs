import React from "react";

export default function ProgressBar({ current = 0, total = 1 }) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-sm font-semibold text-gray-800 mb-2">
        <span className="tracking-wide">پیشرفت</span>
        <span className="text-indigo-700">
          {current}/{total}
        </span>
      </div>

      <div className="relative w-full h-5 bg-gray-200 rounded-full overflow-hidden shadow-md">
        <div
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{
            width: `${percentage}%`,
          }}
        >
          <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse rounded-full shadow-inner" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  );
}
