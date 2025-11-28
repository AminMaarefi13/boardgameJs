import React from "react";

const PhaseIndicator = () => {
  return (
    <div className="text-xs text-blue-300 italic px-2 py-1 bg-gray-900 rounded-md shadow-sm w-fit mx-auto mt-2">
      ⏳ Current phase: <span className="text-white not-italic">Planning</span>
    </div>
  );
};

export default PhaseIndicator;
