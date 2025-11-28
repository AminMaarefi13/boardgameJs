import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";
import { useGameContext } from "../context/GameContext";
import NavigationCard from "../components/FeedTheKraken/NavigationCard";

export default function NavigationCardChoicePanel() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { userState, connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { navigatorId } = gameState;
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const [jumped, setJumped] = useState(false);

  const { cards, cabinRole } = privatePhaseData;

  const handleSelect = (index) => {
    if (confirmed || jumped) return;
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const handleConfirm = () => {
    if (selectedIndex === null) {
      alert("لطفاً یکی از کارت‌ها را انتخاب کنید.");
      return;
    }

    const chosenCard = cards[selectedIndex];
    const payload = {
      emergency: false,
      playerId,
      chosenCard,
      discardedCard: cards[1 - selectedIndex],
      cabinRole,
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true);
  };

  const handleJumpIntoSea = () => {
    const payload = {
      emergency: true,
      playerId,
      chosenCard: cards[0],
      discardedCard: cards[1],
      cabinRole: "navigator",
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });

    setJumped(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-blue-400 bg-gradient-to-br from-blue-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-blue-700 flex flex-row-reverse items-center gap-2 justify-end bg-blue-100 border-b-2 border-blue-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🧭</span>
        <span>انتخاب کارت مسیر</span>
      </h2>
      <div className="p-5 rounded-b-2xl bg-white border-t-0 border border-blue-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4 text-gray-700">
          یکی از کارت‌های زیر را برای ارسال به کشتیران انتخاب کنید. کارت دیگر
          دور ریخته خواهد شد.
        </div>
        <div className="flex gap-4 justify-center mb-6">
          {cards.map((card, index) => (
            <NavigationCard
              key={index}
              type={card.type}
              color={card.color}
              selected={selectedIndex === index}
              onClick={() => handleSelect(index)}
              disabled={confirmed || jumped}
            />
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center gap-4">
          <HoldToConfirmButton
            label="تایید انتخاب"
            onConfirm={handleConfirm}
            disabled={selectedIndex === null || confirmed || jumped}
          />
          {playerId === navigatorId && (
            <HoldToConfirmButton
              label="🏊 پریدن به آب"
              onConfirm={handleJumpIntoSea}
              disabled={confirmed || jumped}
            />
          )}
        </div>
      </div>
    </div>
  );
}
