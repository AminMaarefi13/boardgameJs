import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";
import { useGameContext } from "../context/GameContext";
import FloggingRoleCard from "../components/FeedTheKraken/FloggingRoleCard";

export default function FloggingChoicePanel() {
  const { userState, connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { privatePhaseData } = userState;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [revealedCard, setRevealedCard] = useState(null);
  const { currentGameId, playerId } = connectionState;
  const isCaptain = playerId === gameState.captainId;
  if (!isCaptain) return null;

  const { options = [], targetPlayerId } = privatePhaseData || {};
  const cards = options;

  const handleSelect = (index) => {
    if (confirmed) return;
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    if (selectedIndex === null) return;
    const chosenCard = cards[selectedIndex];
    setRevealedCard(chosenCard);
    console.log(chosenCard);
    setConfirmed(true);
    const payload = {
      targetPlayerId,
      chosenCard,
    };
    setTimeout(() => {
      socket.emit("phase_confirm", { gameId: currentGameId, payload });
    }, 2000);
  };

  const targetName =
    gameState.players.find((p) => p.id === targetPlayerId)?.name || "بازیکن";

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-yellow-500 bg-gradient-to-br from-yellow-50 to-white shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-yellow-700 flex flex-row-reverse items-center gap-2 justify-end bg-yellow-100 border-b-2 border-yellow-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🪢</span>
        <span>انتخاب کارت شلاق</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-yellow-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4 text-yellow-700 font-bold">
          یکی از کارت‌های زیر را انتخاب کنید تا مشخص شود{" "}
          <span className="font-bold text-indigo-700">{targetName}</span> قطعاً
          چه نقشی ندارد.
        </div>
        <div className="flex gap-6 justify-center flex-wrap mb-6">
          {cards.map((card, index) => (
            <div key={index} onClick={() => handleSelect(index)}>
              {confirmed && selectedIndex === index ? (
                <FloggingRoleCard type={card} selected disabled />
              ) : (
                <div
                  className={`w-28 h-40 rounded-xl flex flex-col justify-center items-center font-vazir font-bold text-center select-none shadow-inner transition-all duration-200
                    ${
                      selectedIndex === index
                        ? "ring-4 ring-yellow-400 border-yellow-400 scale-105"
                        : "border-2 border-gray-400"
                    }
                    bg-gradient-to-br from-gray-200 to-gray-400 text-gray-500
                    ${
                      confirmed
                        ? "opacity-60 cursor-default"
                        : "cursor-pointer hover:scale-105"
                    }
                  `}
                >
                  <span className="text-base md:text-lg">کارت نقش</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {!confirmed && (
          <div className="mt-6 text-center">
            <HoldToConfirmButton
              label="تایید انتخاب"
              onConfirm={handleConfirm}
              disabled={selectedIndex === null}
            />
          </div>
        )}
        {confirmed && (
          <p className="mt-4 text-center text-sm text-yellow-600">
            کارت انتخاب شد و ارسال گردید.
          </p>
        )}
      </div>
    </div>
  );
}
