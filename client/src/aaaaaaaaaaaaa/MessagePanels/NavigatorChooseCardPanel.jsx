import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";

// پنل فاز "navigator_choose_card"
export function NavigatorChooseCardPanel() {
  const { gameState } = useGameContext();
  const { connectionState } = useAppContext();
  const { phaseData, navigatorId } = gameState;
  const { playerId } = connectionState;

  if (!phaseData || phaseData.currentPhase !== "navigator_choose_card")
    return null;

  let message = (
    <div>
      کشتیران دو کارت از کاپیتان و افسر اول دریافت کرد و در حال انتخاب یکی از
      کارت‌ها است...
    </div>
  );

  if (playerId === navigatorId) {
    message = (
      <div>
        شما دو کارت از کاپیتان و افسر اول دریافت کردید.
        <br />
        حالا باید یکی از کارت‌ها را انتخاب کنید و کارت دیگر را در دریا
        بیاندازید.
        <br />
        <span className="text-red-600 font-bold">
          اگر هیچکدام را انتخاب نکنید، از بازی حذف می‌شوید و باید یک کشتیران
          جدید انتخاب شود.
        </span>
      </div>
    );
  }

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-blue-400 bg-gradient-to-br from-blue-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-blue-700 flex flex-row-reverse items-center gap-2 justify-end bg-blue-100 border-b-2 border-blue-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🧭</span>
        <span>انتخاب کارت توسط کشتیران</span>
      </h2>
      <div className="p-5 rounded-b-2xl bg-white border-t-0 border border-blue-100 text-gray-800 shadow-inner text-base text-right">
        {message}
      </div>
    </div>
  );
}