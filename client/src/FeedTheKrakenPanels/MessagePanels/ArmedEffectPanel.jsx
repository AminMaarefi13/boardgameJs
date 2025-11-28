import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

export default function ArmedEffectPanel() {
  const { gameState } = useGameContext();
  const { connectionState, userState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (
    !phaseData ||
    gameState.currentPhase !== "armed" ||
    phaseData?.noPlayersLeft
  )
    return null;

  const { navigatorName, phaseSeen } = phaseData;

  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-green-500 bg-gradient-to-br from-green-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-green-700 flex flex-row-reverse items-center gap-2 justify-end bg-green-100 border-b-2 border-green-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🔫</span>
        <span>ناوبر یک تفنگ دریافت کرد!</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-green-100 text-gray-800 shadow-inner leading-8 text-right text-lg">
        🔫 ناوبر{" "}
        <span className="font-bold text-green-700">{navigatorName}</span> یک
        تفنگ دریافت کرد.
      </div>
      {phaseData?.type === "see" && !eliminated && (
        <div className="px-5 pb-5 pt-2 flex justify-center">
          <HoldToConfirmButton
            label="دیدم"
            onConfirm={handleConfirm}
            disabled={
              confirmed ||
              (Array.isArray(phaseSeen) && phaseSeen.includes(playerId))
            }
            className="w-32 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl py-2 shadow transition"
          />
        </div>
      )}
    </div>
  );
}
