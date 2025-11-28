import React from "react";
import { useGameContext } from "../../context/GameContext";
import { useAppContext } from "../../context/AppContext";

export default function CultConversionChoicePanel() {
  const { connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { phaseData } = gameState;
  const { playerId } = connectionState;

  if (
    !phaseData ||
    gameState.currentPhase !== "cult_conversion_choice" ||
    playerId === phaseData.cultLeaderId
  )
    return null;

  // بازیکنان قابل انتخاب برای تبدیل شدن به عضو فرقه

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-500 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🔮</span>
        <span>انتخاب عضو جدید فرقه</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-purple-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4 text-purple-700 font-bold text-lg">
          🔮 رهبر فرقه در حال انتخاب یک عضو جدید در فرقه است...
        </div>
      </div>
    </div>
  );
}
