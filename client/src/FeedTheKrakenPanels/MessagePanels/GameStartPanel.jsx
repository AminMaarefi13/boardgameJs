import React, { useState } from "react";
import { socket } from "../../network/socket";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";

export default function GameStartPanel() {
  const { userState, connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { phaseData } = gameState;
  const { eliminated } = userState;
  const { role, knownRoles = [] } = userState;

  const handleConfirm = () => {
    socket.emit("phase_seen", {
      gameId: currentGameId,
    });
    setConfirmed(true);
  };

  // فقط در شروع بازی نمایش داده شود
  if (!phaseData || gameState.currentPhase !== "game_start") return null;
  const { phaseSeen } = phaseData;

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-indigo-500 bg-gradient-to-br from-indigo-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-indigo-700 flex flex-row-reverse items-center gap-2 justify-end bg-indigo-100 border-b-2 border-indigo-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🎲</span>
        <span>بازی شروع شد!</span>
      </h2>
      <div className="p-4 rounded-b-2xl bg-gradient-to-br from-indigo-50 to-yellow-50 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-1 px-3 py-2 rounded-xl bg-white border border-indigo-100 text-indigo-700 font-bold shadow-sm">
          نقش شما:{" "}
          <span className="font-extrabold text-indigo-800">{role}</span>
        </div>
        {Array.isArray(knownRoles) && knownRoles.length > 0 && (
          <div className="mt-2 px-3 py-1 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 shadow-sm">
            <div className="font-semibold mb-2">نقش‌هایی که می‌دانید:</div>
            <ul className="list-disc pr-5">
              {knownRoles.map((kr, idx) => (
                <li key={kr.id || idx}>
                  {kr.playerName}{" "}
                  <span className="text-sm text-gray-500">
                    (نقش: {kr.role})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {phaseData?.type === "see" && !eliminated && (
        <div className="px-5 pb-5 pt-0">
          <HoldToConfirmButton
            label="دیدم"
            onConfirm={handleConfirm}
            disabled={
              confirmed ||
              (Array.isArray(phaseSeen) && phaseSeen.includes(playerId))
            }
          />
        </div>
      )}
    </div>
  );
}
