import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";
import NavigationCard from "../../components/FeedTheKraken/NavigationCard";

export default function NavigationCardChosenPanel() {
  const { gameState } = useGameContext();
  const { userState, connectionState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated } = userState;

  if (!phaseData || phaseData.currentPhase !== "navigation_card_chosen")
    return null;

  const { phaseSeen, chosenCard } = phaseData;

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
        <span className="text-2xl">🧭</span>
        <span>کارت انتخابی کشتیران</span>
      </h2>
      <div className="p-5 rounded-b-2xl bg-white border-t-0 border border-blue-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4 flex justify-center">
          <NavigationCard type={chosenCard.type} color={chosenCard.color} />
        </div>
        <div className="mb-4 text-center text-gray-700">
          این کارت توسط کشتیران انتخاب شد و مسیر کشتی بر اساس آن تعیین می‌شود.
        </div>
        {phaseData?.type === "see" && !eliminated && (
          <HoldToConfirmButton
            label="دیدم"
            onConfirm={handleConfirm}
            disabled={
              confirmed ||
              (Array.isArray(phaseSeen) && phaseSeen.includes(playerId))
            }
          />
        )}
      </div>
    </div>
  );
}