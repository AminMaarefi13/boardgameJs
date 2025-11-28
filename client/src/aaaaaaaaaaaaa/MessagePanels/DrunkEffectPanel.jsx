import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

export default function DrunkEffectPanel() {
  const { gameState } = useGameContext();
  const { connectionState, userState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (
    !phaseData ||
    gameState.currentPhase !== "drunk" ||
    phaseData?.noPlayersLeft
  )
    return null;

  const { newCaptainName, phaseSeen } = phaseData;

  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-yellow-700 flex flex-row-reverse items-center gap-2 justify-end bg-yellow-100 border-b-2 border-yellow-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🍺</span>
        <span>کاپیتان تغییر کرد!</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-yellow-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-2 font-bold text-yellow-700 text-lg flex items-center gap-2">
          🍺 کاپیتان جدید:{" "}
          <span className="font-extrabold text-yellow-900">
            {newCaptainName}
          </span>
        </div>
        <div className="mt-2 text-gray-700">
          مرحله بعد: کاپیتان جدید باید کابینه را تشکیل دهد.
        </div>
      </div>
      {phaseData?.type === "see" && !eliminated && (
        <div className="px-5 pb-5 pt-2">
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