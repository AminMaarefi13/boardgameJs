import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

export default function LocationEffectResolvedPanel() {
  const { connectionState, userState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId } = connectionState;
  const { phaseData, captainId } = gameState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;
  const { phaseSeen } = phaseData || {};

  if (
    !phaseData ||
    gameState.currentPhase !== "location_effect_resolved" ||
    phaseData.noLocationEffect
  ) {
    return null;
  }

  if (!phaseData.noLocationEffect && phaseData.noPlayersLeft) {
    return (
      <div
        className="mb-6 p-0 rounded-2xl border border-gray-400 bg-gradient-to-br from-gray-50 to-gray-200 shadow-lg max-w-xl mx-auto text-right font-vazir"
        dir="rtl"
      >
        <h2 className="text-xl font-extrabold text-gray-700 flex flex-row-reverse items-center gap-2 justify-end bg-gray-100 border-b-2 border-gray-200 rounded-t-2xl px-4 py-3 shadow-sm">
          <span className="text-2xl">🚫</span>
          <span>هیچ بازیکنی برای انتخاب وجود ندارد</span>
        </h2>
        <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-gray-100 text-gray-800 shadow-inner leading-8 text-right text-lg">
          <span className="font-bold text-gray-600">
            بازیکنی برای انتخاب وجود نداشت
          </span>
          <br />
          <span className="text-indigo-700 font-semibold">
            مرحله بعدی: افکت کارت
          </span>
        </div>
        {phaseData?.type === "see" && !eliminated && (
          <div className="px-5 pb-5 pt-2 flex justify-center">
            <HoldToConfirmButton
              label="دیدم"
              onConfirm={() => {
                socket.emit("phase_seen", { gameId: gameState.gameId });
                setConfirmed(true);
              }}
              disabled={
                confirmed ||
                (Array.isArray(phaseSeen) && phaseSeen.includes(playerId))
              }
              className="w-32 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl py-2 shadow transition"
            />
          </div>
        )}
      </div>
    );
  }

  const { nodeType, targetPlayerName } = phaseData;

  // فقط در این دو حالت، کاپیتان هم باید ببیند و دکمه داشته باشد
  const showForAll =
    nodeType === "feed_the_kraken" || nodeType === "off_with_tongue";

  // در سایر حالت‌ها، فقط غیرکاپیتان‌ها ببینند
  if (!showForAll && playerId === captainId) {
    return null;
  }

  let content = null;
  let icon = null;
  let title = null;
  let borderColor = "border-blue-400";
  let headerBg = "bg-blue-100";
  let headerText = "text-blue-700";

  if (nodeType === "cabin_search") {
    icon = "🔍";
    title = "دیدن نقش کابین";
    content = (
      <>
        کاپیتان در حال دیدن نقش{" "}
        <span className="font-bold text-indigo-700">{targetPlayerName}</span>{" "}
        است...
        <br />
        <span className="text-indigo-700 font-semibold">
          مرحله بعد: اثر کارت
        </span>
      </>
    );
    borderColor = "border-indigo-400";
    headerBg = "bg-indigo-100";
    headerText = "text-indigo-700";
  } else if (nodeType === "off_with_tongue") {
    icon = "😶";
    title = "بریدن زبان";
    content = (
      <>
        😶 زبان{" "}
        <span className="font-bold text-red-700">{targetPlayerName}</span> بریده
        شد. دیگر نمی‌تواند صحبت کند یا کاپیتان شود.
      </>
    );
    borderColor = "border-pink-400";
    headerBg = "bg-pink-100";
    headerText = "text-pink-700";
  } else if (nodeType === "feed_the_kraken") {
    icon = "🦑";
    title = "قربانی کراکن";
    content = (
      <>
        🦑 بازیکن{" "}
        <span className="font-bold text-blue-700">{targetPlayerName}</span>{" "}
        قربانی کراکن شد.
      </>
    );
    borderColor = "border-blue-400";
    headerBg = "bg-blue-100";
    headerText = "text-blue-700";
  } else {
    return null;
  }

  return (
    <div
      className={`mb-6 p-0 rounded-2xl border ${borderColor} bg-gradient-to-br from-blue-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir`}
      dir="rtl"
    >
      <h2
        className={`text-xl font-extrabold ${headerText} flex flex-row-reverse items-center gap-2 justify-end ${headerBg} border-b-2 ${borderColor} rounded-t-2xl px-4 py-3 shadow-sm`}
      >
        <span className="text-2xl">{icon}</span>
        <span>{title}</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-blue-100 text-gray-800 shadow-inner leading-8 text-right text-lg">
        {content}
      </div>
      {showForAll && phaseData?.type === "see" && !eliminated && (
        <div className="px-5 pb-5 pt-2 flex justify-center">
          <HoldToConfirmButton
            label="متوجه شدم"
            onConfirm={() => {
              socket.emit("phase_seen", { gameId: gameState.gameId });
              setConfirmed(true);
            }}
            disabled={
              confirmed ||
              (Array.isArray(phaseSeen) && phaseSeen.includes(playerId))
            }
            className="w-32 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-2 shadow transition"
          />
        </div>
      )}
    </div>
  );
}
