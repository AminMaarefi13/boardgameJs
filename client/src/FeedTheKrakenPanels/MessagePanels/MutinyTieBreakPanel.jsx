import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import { socket } from "../../network/socket";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";

// پنل تساوی شورش
export function MutinyTieBreakPanel() {
  const { gameState } = useGameContext();
  const { userState, connectionState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (!phaseData || phaseData.currentPhase !== "vote_tie_break_start")
    return null;
  const { phaseSeen, totalGuns, requiredGuns, topCandidates } = phaseData;

  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-yellow-700 flex flex-row-reverse items-center gap-2 justify-end bg-yellow-100 border-b-2 border-yellow-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🟰</span>
        <span>تساوی در شورش</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-2 text-yellow-700 font-bold">
          بین چند بازیکن بیشترین تفنگ استفاده شده و تساوی رخ داده است.
        </div>
        <div className="mb-2 font-bold">بازیکنان با بیشترین تفنگ:</div>
        {topCandidates &&
          topCandidates.map((c, idx) => (
            <div key={c.id || idx} className="mb-1 flex items-center gap-2">
              <span className="font-bold text-yellow-900">{c.nickname}</span>
              <span className="text-red-700 font-bold flex items-center gap-1">
                <span>🔫</span>
                <span>{c.gunsUsed}</span>
                <span className="text-xs text-gray-500">تفنگ</span>
              </span>
            </div>
          ))}
        <div className="mt-2">
          مجموع تفنگ‌های استفاده‌شده: <b>{totalGuns}</b>
        </div>
        <div>
          تعداد تفنگ‌های لازم برای موفقیت شورش: <b>{requiredGuns}</b>
        </div>
        <div className="mt-4 text-gray-700">
          مرحله بعد: کاپیتان یکی از این بازیکنان را حذف می‌کند و کاپیتان جدید
          انتخاب می‌شود.
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
