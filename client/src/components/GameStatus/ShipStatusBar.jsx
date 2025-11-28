import React from "react";

const ShipStatusBar = () => {
  return (
    <div className="bg-blue-700 text-white text-sm text-center py-2 rounded-xl shadow-inner">
      🚢 Ship is currently in the{" "}
      <span className="font-semibold text-blue-200">central sea</span>
    </div>
  );
};

export default ShipStatusBar;
