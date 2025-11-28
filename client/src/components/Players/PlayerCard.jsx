import React from "react";

const PlayerCard = ({ player, isPirate, isCabinetMember }) => {
  const showRole = isPirate && player.role === "Pirate"; // فقط اگر خودت Pirate هستی و بازیکن هم Pirate باشه

  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl shadow-md text-center space-y-3 transition hover:scale-105 duration-200">
      <p className="font-bold text-blue-300">{player.name}</p>

      {/* نمایش نقش‌های کابینه برای همه */}
      {player.cabinetRole && (
        <p className="text-sm text-yellow-200">
          🚢 Cabinet Role: {player.cabinetRole}
        </p>
      )}

      {/* نمایش نقش فقط اگر شرایط برقرار باشد */}
      {showRole && (
        <p className="text-sm text-blue-200">👻 Role: {player.role}</p>
      )}
    </div>
  );
};

export default PlayerCard;
