import React, { useState } from "react";
import { useGameContext } from "../../context/GameContext";
import { useAppContext } from "../../context/AppContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

export default function NavigatorNoPlayerPanel() {
  const { gameState } = useGameContext();
  const { connectionState, userState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (
    !phaseData ||
    gameState.currentPhase !== "navigator_choose_card" ||
    !phaseData.noNavigator
  ) {
    return null;
  }

  const { phaseSeen } = phaseData;
  console.log(phaseData?.type);
  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-4 border border-blue-500 rounded bg-blue-50 shadow text-right"
      dir="rtl"
    >
      <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <span className="text-2xl">🧭</span>
        انتخاب کارت مسیر (بدون کشتیران)
      </h2>
      <div className="mb-4 p-4 bg-white rounded border border-gray-300 text-gray-800 shadow-inner leading-8 text-right text-lg">
        🧭 کشتیران نداریم پس یکی از کارت های انتخابی توسط کاپیتان و افسر اول
        بصورت رندوم انتخاب می شود.
      </div>
      {phaseData?.type === "see" && !eliminated && (
        <HoldToConfirmButton
          label="دیدم"
          onConfirm={handleConfirm}
          disabled={
            confirmed ||
            (Array.isArray(phaseSeen) && phaseSeen.includes(playerId))
          }
        />
      )}
    </div>
  );
}
