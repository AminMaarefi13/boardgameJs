import React from "react";
import { useGameContext } from "../../context/GameContext";
import { useAppContext } from "../../context/AppContext";

export default function TelescopeChoicePanel() {
  const { connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId } = connectionState;
  const { phaseData } = gameState;

  if (
    !phaseData ||
    gameState.currentPhase !== "telescope_choice" ||
    !phaseData.targetPlayerName ||
    phaseData.targetPlayerId === playerId
  )
    return null;

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-400 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🔭</span>
        <span>انتخاب تلسکوپ</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-purple-100 text-gray-800 shadow-inner leading-8 text-right text-lg">
        🔭 کاپیتان بازیکن{" "}
        <span className="font-bold text-purple-700">
          {phaseData.targetPlayerName}
        </span>{" "}
        را برای دیدن کارت بالای دسته انتخاب کرد. حالا بازیکن باید انتخاب کند این
        کارت را می‌خواهد به کارت‌های بازی‌ برگرداند یا به دریا بیاندازد...
      </div>
    </div>
  );
}