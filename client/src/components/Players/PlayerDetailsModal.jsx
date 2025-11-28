import React from "react";

const PlayerDetailsModal = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg w-72">
        <h2 className="text-lg font-bold text-blue-400 mb-2">{player.name}</h2>
        <p className="text-sm mb-1">
          🔫 Guns: <span className="text-blue-200">{player.guns}</span>
        </p>
        <p className="text-sm mb-4">
          🎭 Revealed Role:{" "}
          <span className="text-blue-200">{player.role || "Unknown"}</span>
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PlayerDetailsModal;
