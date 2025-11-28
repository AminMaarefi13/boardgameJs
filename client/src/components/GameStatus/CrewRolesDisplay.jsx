import React from "react";

const CrewRolesDisplay = () => {
  return (
    <div className="bg-gray-800 text-white rounded-xl p-4 shadow-md">
      <h3 className="text-blue-400 font-semibold mb-2 text-sm">Crew Roles</h3>
      <div className="space-y-1 text-sm text-gray-300">
        <p>
          👨‍✈️ Captain: <span className="text-white">[unknown]</span>
        </p>
        <p>
          🧭 First Officer: <span className="text-white">[unknown]</span>
        </p>
        <p>
          🗺️ Navigator: <span className="text-white">[unknown]</span>
        </p>
      </div>
    </div>
  );
};

export default CrewRolesDisplay;
