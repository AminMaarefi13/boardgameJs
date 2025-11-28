import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

export default function NavigatorDenialPanel() {
  const { gameState } = useGameContext();
  const { userState, connectionState } = useAppContext();
  const { phaseData } = gameState;
  const { playerId, currentGameId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (!phaseData || phaseData.currentPhase !== "navigator_denial") return null;
  const { phaseSeen, eliminatedId } = phaseData;

  const isNavigator = playerId === eliminatedId;

  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-red-500 bg-gradient-to-br from-red-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-red-700 flex flex-row-reverse items-center gap-2 justify-end bg-red-100 border-b-2 border-red-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🧭</span>
        <span>حذف کشتیران</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-red-100 text-gray-800 shadow-inner leading-7 text-base text-right">
        {isNavigator ? (
          <div>
            <div className="mb-2 font-bold text-red-700">
              شما هیچ کارتی انتخاب نکردید و از کشتی بیرون پریدید و از بازی حذف
              شدید.
            </div>
            <div className="mt-2 text-indigo-700 font-semibold">
              مرحله بعد: تشکیل کابینه اضطراری
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-2 font-bold text-red-700">
              کشتیران هیچ کارتی را انتخاب نکرد و خودش را به آب انداخت و حذف شد.
            </div>
            <div className="mt-2 text-indigo-700 font-semibold">
              مرحله بعد: تشکیل کابینه اضطراری
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