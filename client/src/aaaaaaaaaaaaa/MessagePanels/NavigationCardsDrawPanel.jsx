import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";

// پنل فاز "navigation_cards_draw"
export function NavigationCardsDrawPanel() {
  const { gameState } = useGameContext();
  const { connectionState } = useAppContext();
  const { phaseData, captainId, firstOfficerId } = gameState;
  const { playerId } = connectionState;

  if (!phaseData || phaseData.currentPhase !== "navigation_cards_draw")
    return null;

  let message = (
    <div>
      کاپیتان و افسر اول هر کدام دو کارت مسیر دریافت کردند و در حال انتخاب یکی
      از آن‌ها هستند که به ناوبر بدهند...
    </div>
  );

  if (playerId === captainId) {
    message = (
      <div>
        شما به عنوان <span className="font-bold text-indigo-700">کاپیتان</span>{" "}
        باید از بین دو کارت مسیر، یکی را به ناوبر بدهید و کارت دیگر را در دریا
        بیاندازید.
      </div>
    );
  } else if (playerId === firstOfficerId) {
    message = (
      <div>
        شما به عنوان <span className="font-bold text-green-700">افسر اول</span>{" "}
        باید از بین دو کارت مسیر، یکی را به ناوبر بدهید و کارت دیگر را در دریا
        بیاندازید.
      </div>
    );
  }

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-blue-400 bg-gradient-to-br from-blue-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-blue-700 flex flex-row-reverse items-center gap-2 justify-end bg-blue-100 border-b-2 border-blue-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🃏</span>
        <span>انتخاب کارت مسیر</span>
      </h2>
      <div className="p-5 rounded-b-2xl bg-white border-t-0 border border-blue-100 text-gray-800 shadow-inner text-base text-right">
        {message}
      </div>
    </div>
  );
}