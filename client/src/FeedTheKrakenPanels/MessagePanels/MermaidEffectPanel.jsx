import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";

// پنل پری دریایی (mermaid)
export function MermaidEffectPanel() {
  const { connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId } = connectionState;
  const { phaseData, captainId } = gameState;

  if (
    !phaseData ||
    gameState.currentPhase !== "mermaid" ||
    playerId === captainId
  )
    return null;

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-blue-400 bg-gradient-to-br from-blue-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-blue-700 flex flex-row-reverse items-center gap-2 justify-end bg-blue-100 border-b-2 border-blue-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🧜‍♀️</span>
        <span>پری دریایی</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-blue-100 text-gray-800 shadow-inner leading-8 text-right text-lg">
        🧜‍♀️ کاپیتان در حال انتخاب یک بازیکن برای اثر پری دریایی است...
      </div>
    </div>
  );
}
