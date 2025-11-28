import React, { useState } from "react";
import { useGameContext } from "../../context/GameContext";
import { socket } from "../../network/socket";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";

/**
 * پنل نمایش بازیکنان با بیشترین رأی قبل از شروع حذف (vote_tie_break_before_start)
 * همه بازیکنان باید دکمه "دیدم" را بزنند تا فاز حذف آغاز شود.
 */
export default function VoteTieBreakBeforeStartPanel() {
  const { gameState } = useGameContext();
  const { phaseData } = gameState;
  const [confirmed, setConfirmed] = useState(false);

  if (!phaseData || phaseData.currentPhase !== "vote_tie_break_before_start")
    return null;

  const topCandidates = phaseData.topCandidates || [];
  // پیدا کردن بیشترین رأی
  const maxVotes =
    topCandidates.length > 0
      ? Math.max(...topCandidates.map((p) => p.gunsUsed || p.votes || 0))
      : 0;

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-yellow-700 flex flex-row-reverse items-center gap-2 justify-end bg-yellow-100 border-b-2 border-yellow-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🟰</span>
        <span>تساوی در رأی‌گیری</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4 text-yellow-800 font-bold text-center">
          این بازیکنان بیشترین رأی را آورده‌اند و باید یکی حذف شود:
        </div>
        <div className="flex flex-col gap-2 items-end">
          {topCandidates.map((p, idx) => {
            const votes = p.gunsUsed ?? p.votes ?? 0;
            const isTop = votes === maxVotes && maxVotes > 0;
            return (
              <div
                key={p.name || p.nickname || idx}
                className={`w-full flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm border
                  ${
                    isTop
                      ? "bg-yellow-200 border-yellow-400"
                      : "bg-white border-yellow-100"
                  }`}
                style={{ minWidth: 0 }}
              >
                <span
                  className={`font-bold truncate flex-1 ${
                    isTop ? "text-yellow-900" : "text-blue-800"
                  }`}
                  style={{ minWidth: 0 }}
                >
                  {p.name || p.nickname}
                </span>
                <span className="text-gray-400">|</span>
                <span className="font-bold flex items-center gap-1 text-red-700">
                  <span>🔫</span>
                  <span>{votes}</span>
                  <span className="text-xs text-gray-500">رأی</span>
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
        <div className="mt-4 text-gray-700 text-center">
          پس از تأیید همه، کاپیتان یکی از این بازیکنان را حذف خواهد کرد.
        </div>
      </div>
      <div className="px-5 pb-5 pt-2">
        <HoldToConfirmButton
          label="دیدم"
          onConfirm={() => {
            socket.emit("phase_seen", { gameId: gameState.gameId });
            setConfirmed(true);
          }}
          disabled={confirmed}
        />
      </div>
    </div>
  );
}
