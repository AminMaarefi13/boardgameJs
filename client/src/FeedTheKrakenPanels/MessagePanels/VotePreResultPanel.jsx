import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import { socket } from "../../network/socket";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";

export default function VotePreResultPanel() {
  const { gameState } = useGameContext();
  const { userState, connectionState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (
    !phaseData ||
    (phaseData.currentPhase !== "vote_pre_result" &&
      phaseData.phase !== "vote_pre_result")
  )
    return null;
  const { phaseSeen } = phaseData;
  const { result = [] } = phaseData;
  const sortedResult = [...result].sort((a, b) => b.gunsUsed - a.gunsUsed);

  // پیدا کردن بیشترین تعداد تفنگ
  const maxGuns = sortedResult.length > 0 ? sortedResult[0].gunsUsed : 0;

  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-blue-400 bg-gradient-to-br from-blue-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-blue-700 flex flex-row-reverse items-center gap-2 justify-end bg-blue-100 border-b-2 border-blue-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">📊</span>
        <span>نتیجه رأی‌گیری شورش</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-gradient-to-br from-blue-50 to-yellow-50 text-gray-800 shadow-inner text-base text-right">
        {sortedResult.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            اطلاعاتی برای نمایش وجود ندارد.
          </div>
        ) : (
          <div>
            <div className="mb-4 text-blue-700 font-bold text-lg text-center">
              تعداد تفنگ‌های استفاده‌شده توسط هر بازیکن:
            </div>
            <div className="flex flex-col gap-2">
              {sortedResult.map(({ nickname, gunsUsed }, idx) => {
                const isTop = gunsUsed === maxGuns && maxGuns > 0;
                return (
                  <div
                    key={idx}
                    className={
                      "flex flex-row-reverse items-center gap-2 justify-end rounded-xl px-4 py-2 shadow-sm border " +
                      (isTop
                        ? "bg-yellow-200 border-yellow-400"
                        : "bg-white border-blue-100")
                    }
                  >
                    <span
                      className={`font-bold ${
                        isTop ? "text-yellow-900" : "text-blue-800"
                      }`}
                    >
                      {nickname}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        isTop ? "text-red-700" : "text-red-600"
                      }`}
                    >
                      <span>🔫</span>
                      <span>{gunsUsed}</span>
                      <span className="text-xs text-gray-500">تفنگ</span>
                      {isTop && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-300 text-yellow-900 text-xs font-bold">
                          بیشترین رأی
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {phaseData?.type === "see" && !eliminated && (
        <div className="px-5 pb-5 pt-2">
          <HoldToConfirmButton
            label="دیدم"
            onConfirm={handleConfirm}
            disabled={
              confirmed ||
              (Array.isArray(phaseSeen) && phaseSeen.includes(playerId))
            }
          />
        </div>
      )}
    </div>
  );
}
