import React from "react";
import { useGameContext } from "../../context/GameContext";
import { useAppContext } from "../../context/AppContext";

const EFFECT_PHASES = [
  "cabin_search",
  "feed_the_kraken",
  "off_with_tongue",
  "flogging",
];

export default function EffectCaptainChoosingPanel() {
  const { gameState } = useGameContext();
  const { connectionState } = useAppContext();
  const { playerId } = connectionState;
  const { phaseData, captainId } = gameState;
  console.log("phaseDatassssssssssssssssssssssss");

  console.log(phaseData);
  if (
    !phaseData ||
    // !EFFECT_PHASES.includes(gameState.currentPhase) ||
    playerId === captainId
  ) {
    return null;
  }

  const { effect } = phaseData;

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-400 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">✨</span>
        <span>افکت مکان</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-purple border-t-0 border border-purple-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-2 font-bold text-purple-700 text-lg flex items-center gap-2">
          ✨ اثر{" "}
          <span className="font-extrabold text-purple-900">{effect}</span>
        </div>
        <div className="mt-2 text-gray-700">
          کاپیتان در حال انتخاب یک نفر برای این اثر است...
        </div>
      </div>
    </div>
  );
}
