import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

export default function LocationEffectResolvedNoLocationEffectPanel() {
  const { gameState } = useGameContext();
  const { connectionState, userState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (
    !phaseData ||
    gameState.currentPhase !== "location_effect_resolved" ||
    !phaseData.noLocationEffect
  )
    return null;
  const { phaseSeen } = phaseData;

  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-gray-400 bg-gradient-to-br from-gray-50 to-gray-200 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-gray-700 flex flex-row-reverse items-center gap-2 justify-end bg-gray-100 border-b-2 border-gray-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🚫</span>
        <span>اثر مکانی وجود ندارد</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-gray border-t-0 border border-gray-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-2 font-bold text-gray-600">
          هیچ اثر مکانی برای این خانه فعال نشد.
        </div>
        <div className="mt-2 text-indigo-700 font-semibold">
          مرحله بعد: اثر کارت ناوبری اجرا خواهد شد.
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
