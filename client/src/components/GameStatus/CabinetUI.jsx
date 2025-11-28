import React, { useState } from "react";

const CabinetUI = ({ isCaptain, captainId, onConfirmCabinet }) => {
  const [firstOfficer, setFirstOfficer] = useState(null);
  const [navigator, setNavigator] = useState(null);
  const players = ["amin", "aaa", "bbb"];
  const handleSelect = (role, playerId) => {
    if (!isCaptain) return;
    if (role === "firstOfficer") setFirstOfficer(playerId);
    if (role === "navigator") setNavigator(playerId);
  };

  const renderCard = (role, label, selectedId) => {
    let selectedPlayer = null;

    if (role === "captain") {
      selectedPlayer = players.find((p) => p.id === captainId);
      return (
        <div className="bg-gray-700 p-2 rounded-xl shadow-md w-[100px] h-[140px] flex flex-col justify-center items-center text-xs text-center">
          <h3 className="text-yellow-300 font-bold text-sm">{label}</h3>
          <p className="text-white mt-2 text-[0.7rem] leading-tight">
            {selectedPlayer?.name || "[نامشخص]"}
          </p>
        </div>
      );
    }

    selectedPlayer = players.find((p) => p.id === selectedId);

    return (
      <div className="bg-gray-700 p-2 rounded-xl shadow-md w-[100px] h-[140px] flex flex-col justify-between items-center text-xs text-center">
        <h3 className="text-yellow-300 font-bold text-sm">{label}</h3>
        {isCaptain ? (
          <select
            className="bg-gray-900 text-white text-xs px-1 py-1 rounded w-full mt-1"
            value={selectedId || ""}
            onChange={(e) => handleSelect(role, e.target.value)}
          >
            <option value="">- انتخاب -</option>
            {players
              .filter((p) => p.id !== captainId) // حذف ناخدا از لیست انتخاب
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        ) : (
          <p className="text-white mt-2 text-[0.7rem] leading-tight">
            {selectedPlayer?.name || "[انتخاب نشده]"}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-3 px-2">
      <div className="flex justify-center gap-2 w-full overflow-x-auto flex-nowrap">
        {renderCard("captain", "👨‍✈️", captainId)}
        {renderCard("firstOfficer", "🧭", firstOfficer)}
        {renderCard("navigator", "🗺️", navigator)}
      </div>

      {isCaptain && (
        <button
          onClick={() =>
            onConfirmCabinet({ captain: captainId, firstOfficer, navigator })
          }
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-sm rounded-xl shadow"
        >
          ✅ تأیید کابینه
        </button>
      )}
    </div>
  );
};

export default CabinetUI;
