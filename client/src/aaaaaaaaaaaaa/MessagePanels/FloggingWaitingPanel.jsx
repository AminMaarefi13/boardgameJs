import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";

export default function FloggingWaitingPanel() {
  const { gameState } = useGameContext();
  const { userState } = useAppContext();
  const { playerId } = userState;
  const { captainId, privatePhaseData, players } = gameState;

  // فقط برای غیرکاپیتان‌ها و فقط در فاز select_flogging_card
  if (
    gameState.currentPhase !== "select_flogging_card" ||
    playerId === captainId
  )
    return null;

  const targetName =
    players.find((p) => p.id === privatePhaseData?.targetPlayerId)?.name ||
    "بازیکن";

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-yellow-500 bg-gradient-to-br from-yellow-50 to-white shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-yellow-700 flex flex-row-reverse items-center gap-2 justify-end bg-yellow-100 border-b-2 border-yellow-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🪢</span>
        <span>انتظار برای شلاق</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-yellow-100 text-gray-800 shadow-inner leading-8 text-right text-lg">
        <div className="mb-2">
          کاپیتان در حال انتخاب تصادفی یکی از کارت‌های نقش{" "}
          <span className="font-bold text-indigo-700">{targetName}</span> است...
        </div>
        <div className="text-yellow-800 font-semibold text-sm mt-3">
          هر کدام را کاپیتان انتخاب کند، همه مطلع خواهند شد که{" "}
          <span className="font-bold text-indigo-700">{targetName}</span> آن نقش
          را قطعاً ندارد.
        </div>
      </div>
    </div>
  );
}
