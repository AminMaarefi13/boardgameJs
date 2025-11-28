import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

export default function FloggingResultPanel() {
  const { gameState } = useGameContext();
  const { connectionState, userState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (
    !phaseData ||
    gameState.currentPhase !== "location_effect_resolved" ||
    phaseData.nodeType !== "flogging" ||
    !phaseData.chosenCard
  ) {
    return null;
  }

  const { targetPlayerName, chosenCard, phaseSeen } = phaseData;

  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  // ترجمه نقش
  const translateRole = (role) => {
    switch (role) {
      case "sailor":
        return "ملوان";
      case "pirate":
        return "دزد دریایی";
      case "cultist":
        return "فرقه‌گرا";
      default:
        return role;
    }
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-yellow-500 bg-gradient-to-br from-yellow-50 to-white shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-yellow-700 flex flex-row-reverse items-center gap-2 justify-end bg-yellow-100 border-b-2 border-yellow-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🪢</span>
        <span>نتیجه شلاق</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-yellow-100 text-gray-800 shadow-inner leading-8 text-right text-lg">
        مشخص شد که:
        <br />
        <span className="font-bold text-indigo-700">
          {targetPlayerName} {translateRole(chosenCard)} نیست
        </span>
        <br />
        <span className="text-yellow-700 font-semibold">
          مرحله بعد: اثر کارت
        </span>
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
            className="w-32 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl py-2 shadow transition"
          />
        </div>
      )}
    </div>
  );
}
