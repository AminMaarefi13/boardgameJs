import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

const EFFECT_PHASES = [
  "cabin_search_effect",
  "feed_the_kraken_effect",
  "off_with_tongue_effect",
  "flogging_effect",
];

export default function EffectsStartPanel() {
  const { gameState } = useGameContext();
  const { connectionState, userState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (!phaseData || !EFFECT_PHASES.includes(gameState.currentPhase))
    return null;

  const { effect, phaseSeen } = phaseData;

  const handleConfirm = () => {
    socket.emit("phase_seen", { gameId: currentGameId });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-500 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">✨</span>
        <span>افکت فعال شد</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-gray border-t-0 border border-purple-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-2 font-bold text-purple-700">
          ✨ افکت{" "}
          <span className="font-extrabold text-purple-900">{effect}</span> فعال
          شد.
        </div>
        <div className="mt-2 text-gray-700">
          کاپیتان باید یک نفر را برای اجرای افکت انتخاب کند.
        </div>
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
