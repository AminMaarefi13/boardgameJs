import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import { socket } from "../../network/socket";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";

// پنل شکست شورش
export function MutinyFailPanel() {
  const { gameState } = useGameContext();
  const { userState, connectionState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (!phaseData || phaseData.currentPhase !== "mutiny_fail") return null;
  const { phaseSeen, totalGuns, requiredGuns } = phaseData;

  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-red-400 bg-gradient-to-br from-red-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-red-700 flex flex-row-reverse items-center gap-2 justify-end bg-red-100 border-b-2 border-red-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">❌</span>
        <span>شورش شکست خورد</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-gradient-to-br from-red-50 to-yellow-50 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-2 text-red-700 font-bold">
          شورش با شکست مواجه شد و کاپیتان فعلی باقی می‌ماند.
        </div>
        <div className="mb-2">
          مجموع تفنگ‌های استفاده‌شده: <b>{totalGuns}</b>
        </div>
        <div className="mb-2">
          تعداد تفنگ‌های لازم برای موفقیت شورش: <b>{requiredGuns}</b>
        </div>
        <div className="mt-4 text-gray-700">
          مرحله بعد: تشکیل کابینه توسط کاپیتان فعلی
        </div>
      </div>
      {phaseData?.type === "see" && !eliminated && (
        <div className="px-5 pb-5 pt-2">
          <HoldToConfirmButton
            label="متوجه شدم"
            onConfirm={handleConfirm}
            disabled={
              confirmed ||
              (Array.isArray(phaseSeen) &&
                phaseSeen.includes(connectionState.playerId))
            }
          />
        </div>
      )}
    </div>
  );
}
