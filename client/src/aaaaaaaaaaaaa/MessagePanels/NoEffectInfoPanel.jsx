import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

export default function NoEffectInfoPanel() {
  const { connectionState, userState } = useAppContext();
  const { gameState } = useGameContext();
  const { currentGameId, playerId } = connectionState;
  const { eliminated } = userState;
  const { currentPhase } = gameState;
  const [confirmed, setConfirmed] = useState(false);

  const { phaseData } = gameState;
  const { phaseSeen } = phaseData;

  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  // فقط در فازهای مورد نظر نمایش بده
  if (
    !["drunk", "mermaid", "telescope"].includes(currentPhase) ||
    !phaseData?.noPlayersLeft
  ) {
    return null;
  }

  let message = "";
  if (currentPhase === "drunk") {
    message = (
      <>
        <span className="font-bold text-gray-700">
          بازیکن دیگری واجد کاپیتانی نبود و کاپیتان در پست خود باقی می‌ماند.
        </span>
        <br />
        <span className="text-indigo-700 font-semibold">
          این کارت در این دور تاثیری ندارد.
        </span>
      </>
    );
  } else if (currentPhase === "mermaid" || currentPhase === "telescope") {
    message = (
      <>
        <span className="font-bold text-gray-700">
          بازیکنی برای انتخاب وجود نداشت.
        </span>
        <br />
        <span className="text-indigo-700 font-semibold">
          این کارت در این دور تاثیری ندارد.
        </span>
      </>
    );
  }

  return (
    <div
      className="mb-6 p-4 border border-gray-400 rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 shadow-lg text-right"
      dir="rtl"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2">
        <span className="text-2xl">ℹ️</span>
        بدون تاثیر
      </h2>
      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-300 text-gray-800 shadow-inner leading-8 text-right text-lg">
        {message}
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
