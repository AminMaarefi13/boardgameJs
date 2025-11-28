import React from "react";
import { useGameContext } from "../../context/GameContext";

export default function GameOverPanel() {
  const { gameState } = useGameContext();
  const { phaseData } = gameState;

  if (!phaseData || gameState.currentPhase !== "game_over") return null;

  const { winner, winnerText } = phaseData;

  // رنگ و آیکون بر اساس برنده
  let color = "purple";
  let icon = "🏁";
  let winnerLabel = winnerText || winner;
  if (winner === "sailors") {
    color = "blue";
    icon = "🚢";
    winnerLabel = "ملوانان";
  } else if (winner === "pirates") {
    color = "red";
    icon = "🏴‍☠️";
    winnerLabel = "دزدان دریایی";
  } else if (winner === "cult") {
    color = "purple";
    icon = "🔮";
    winnerLabel = "فرقه";
  }

  return (
    <div
      className={`mb-6 p-0 rounded-2xl border border-${color}-600 bg-gradient-to-br from-${color}-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir`}
      dir="rtl"
    >
      <h2
        className={`text-2xl font-extrabold text-${color}-800 flex flex-row-reverse items-center gap-2 justify-end bg-${color}-100 border-b-2 border-${color}-200 rounded-t-2xl px-4 py-4 shadow-sm`}
      >
        <span className="text-3xl">{icon}</span>
        <span>پایان بازی</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-gray-100 text-gray-800 shadow-inner leading-8 text-right text-xl">
        {icon} بازی به پایان رسید.
        <br />
        جناح برنده:{" "}
        <span className={`font-extrabold text-${color}-700`}>
          {winnerLabel}
        </span>
      </div>
    </div>
  );
}
