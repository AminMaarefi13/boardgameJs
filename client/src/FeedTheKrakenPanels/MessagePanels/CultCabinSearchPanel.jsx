import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";

export default function CultCabinSearchPanel() {
  const { connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId } = connectionState;
  const { phaseData } = gameState;

  if (
    !phaseData ||
    gameState.currentPhase !== "cult_cabin_search_result" ||
    playerId === phaseData.cultLeaderId
  )
    return null;

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-500 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🔮</span>
        <span>مراسم فرقه‌ای - مشاهده کابین</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-purple-100 text-gray-800 shadow-inner leading-8 text-right text-lg">
        🔮 رهبر فرقه در حال مشاهده نقش اعضای کابین است...
      </div>
    </div>
  );
}
