import React, { useEffect, useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useGameContext } from "../context/GameContext";
import { useAppContext } from "../context/AppContext";

export default function VoteTieBreakPanel() {
  const [selectedId, setSelectedId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [seenConfirmed, setSeenConfirmed] = useState(false);

  const { connectionState, userState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId, currentGameId } = connectionState;
  const { phaseData } = gameState;
  const { tiedPlayers = [], eliminatorId } = phaseData;
  const { eliminated } = userState;
  const { phaseSeen } = phaseData;

  // اگر فقط یک نفر باقی مانده، پیام انتخاب کاپیتان جدید را نمایش بده
  if (tiedPlayers.length === 1) {
    return (
      <div
        className="mb-6 p-0 rounded-2xl border border-green-500 bg-gradient-to-br from-green-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
        dir="rtl"
      >
        <h2 className="text-xl font-extrabold text-green-700 flex flex-row-reverse items-center gap-2 justify-end bg-green-100 border-b-2 border-green-200 rounded-t-2xl px-4 py-3 shadow-sm">
          <span className="text-2xl">👑</span>
          <span>کاپیتان جدید انتخاب شد</span>
        </h2>
        <div className="p-6 rounded-b-2xl bg-gradient-to-br from-green-50 to-yellow-50 text-gray-800 shadow-inner text-base text-right">
          بازیکن <b>{tiedPlayers[0].name}</b> به عنوان کاپیتان جدید انتخاب شد.
          <div className="mt-2 text-indigo-700 font-semibold">
            مرحله بعد: تشکیل کابینه توسط کاپیتان جدید
          </div>
        </div>

        {phaseData?.type === "see" && !eliminated && (
          <div className="px-5 pb-5 pt-2">
            <HoldToConfirmButton
              label="دیدم"
              onConfirm={() => {
                socket.emit("phase_seen", { gameId: currentGameId });
                setSeenConfirmed(true);
              }}
              disabled={
                seenConfirmed ||
                (Array.isArray(phaseSeen) && phaseSeen.includes(playerId))
              }
            />
          </div>
        )}
      </div>
    );
  }

  const isEliminator = playerId === eliminatorId;

  if (isEliminator) {
    const handleSelect = (id) => {
      if (confirmed) return;
      setSelectedId(id === selectedId ? null : id);
    };

    const handleConfirm = () => {
      if (!selectedId) {
        alert("لطفاً یکی از بازیکنان را انتخاب کنید.");
        return;
      }

      const payload = {
        eliminatedId: selectedId,
        tiedPlayers,
      };
      socket.emit("phase_confirm", { gameId: currentGameId, payload });

      setConfirmed(true);
    };

    return (
      <div
        className="mb-6 p-0 rounded-2xl border border-red-500 bg-gradient-to-br from-red-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
        dir="rtl"
      >
        <h2 className="text-xl font-extrabold text-red-700 flex flex-row-reverse items-center gap-2 justify-end bg-red-100 border-b-2 border-red-200 rounded-t-2xl px-4 py-3 shadow-sm">
          <span className="text-2xl">🟰</span>
          <span>تساوی در رأی‌گیری</span>
        </h2>
        <div className="p-6 rounded-b-2xl bg-gradient-to-br from-red-50 to-yellow-50 text-gray-800 shadow-inner text-base text-right">
          <div className="mb-4 text-red-700 font-bold">
            شما باید یکی از بازیکنان زیر را حذف کنید تا کاپیتان بعدی نباشد:
          </div>
          <ul className="flex flex-col gap-2">
            {tiedPlayers.map((p) => (
              <li
                key={p.id}
                className={`w-full flex items-center justify-between gap-2 rounded-xl px-4 py-2 shadow-sm border bg-white border-red-100`}
              >
                <span className="font-bold text-red-800">{p.name}</span>
                <button
                  onClick={() => handleSelect(p.id)}
                  className={`px-3 py-1 text-base rounded-xl border font-bold transition ${
                    selectedId === p.id
                      ? "bg-red-600 text-white border-red-700 shadow"
                      : "border-red-400 text-red-700 bg-red-50 hover:bg-red-100"
                  }`}
                  disabled={confirmed}
                >
                  حذف شود
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <HoldToConfirmButton
              label="تایید حذف"
              onConfirm={handleConfirm}
              disabled={!selectedId || confirmed}
            />
          </div>
        </div>
      </div>
    );
  }

  // سایر بازیکنان فقط لیست را می‌بینند و هیچ دکمه‌ای ندارند
  const eliminatorName = phaseData?.eliminatorName || "کاپیتان";

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-yellow-700 flex flex-row-reverse items-center gap-2 justify-end bg-yellow-100 border-b-2 border-yellow-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🟰</span>
        <span>حذف بازیکن از تساوی شورش</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-2 font-semibold text-yellow-700">
          {eliminatorName} در حال حذف یکی از این بازیکنان از شورش است:
        </div>
        <ul className="flex flex-col gap-2 mt-2">
          {tiedPlayers.map((p, idx) => (
            <li
              key={p.name || idx}
              className="w-full font-bold bg-white border border-yellow-100 rounded-xl px-4 py-2 shadow-sm"
            >
              {p.name}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-gray-700 text-center">
          لطفاً منتظر بمانید تا حذف انجام شود.
        </div>
      </div>
    </div>
  );
}
