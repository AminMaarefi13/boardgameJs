import React, { useState } from "react";
import { socket } from "../../network/socket";
import { useAppContext } from "../../context/AppContext";
import GameTypeSelect from "./GameTypeSelect";

const GAME_TYPES = [
  { value: "splendorDuel", label: "SplendorDuel" },
  { value: "splendor", label: "Splendor" },
  { value: "mineSweeper", label: "Minesweeper" },
  { value: "feedTheKraken", label: "Feed the Kraken" },
];

export default function CreateGameBox() {
  const { connectionState } = useAppContext();
  const { currentRoomId } = connectionState;
  const [gameType, setGameType] = useState(GAME_TYPES[0].value);
  const [loading, setLoading] = useState(false);

  if (!currentRoomId) return null;

  const handleCreateGame = () => {
    setLoading(true);
    socket.emit(
      "create_game",
      { roomId: currentRoomId, type: gameType },
      (res) => {
        setLoading(false);
        if (res?.success === false) {
          alert(res.message || "خطا در ایجاد بازی");
        }
      }
    );
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow mb-4 flex flex-col gap-3">
      <h3
        className="font-bold text-lg text-blue-400 mb-2"
        style={{ direction: "rtl" }}
      >
        ایجاد بازی جدید
      </h3>
      <GameTypeSelect value={gameType} onChange={setGameType} />
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
        onClick={handleCreateGame}
        disabled={loading}
      >
        {loading ? "در حال ایجاد..." : "ایجاد بازی"}
      </button>
    </div>
  );
}
