import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";
import { useGameContext } from "../context/GameContext";
import NavigationCard from "../components/FeedTheKraken/NavigationCard";

export default function MermaidCardsViewPanel() {
  const { userState, connectionState } = useAppContext();
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { gameState } = useGameContext();
  const { phaseData } = gameState;

  if (
    !phaseData ||
    gameState.currentPhase !== "mermaid_choice" ||
    phaseData.targetPlayerId !== playerId
  )
    return null;

  const { cards } = privatePhaseData;

  const handleConfirm = () => {
    const payload = {
      playerId,
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });

    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-cyan-500 bg-gradient-to-br from-cyan-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-cyan-700 flex flex-row-reverse items-center gap-2 justify-end bg-cyan-100 border-b-2 border-cyan-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🧜</span>
        <span>مشاهده کارت‌های انداخته‌شده</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-cyan-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4">
          شما به عنوان بازیکن انتخاب‌شده توسط کاپیتان، سه کارت آخر انداخته‌شده
          را می‌بینید. این اطلاعات را فقط شما مشاهده می‌کنید.
        </div>
        <div className="flex justify-center gap-4 mb-6">
          {cards.map((card, index) => (
            <NavigationCard key={index} type={card.type} color={card.color} />
          ))}
        </div>
        <HoldToConfirmButton
          label="دیدم"
          onConfirm={handleConfirm}
          disabled={confirmed}
        />
      </div>
    </div>
  );
}
