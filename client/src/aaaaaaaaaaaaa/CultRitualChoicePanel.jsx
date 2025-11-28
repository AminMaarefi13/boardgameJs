import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";
import { useGameContext } from "../context/GameContext";
import CultRitualCard from "../components/FeedTheKraken/CultRitualCard";

export default function CultRitualChoicePanel() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { connectionState, userState } = useAppContext();
  const { gameState } = useGameContext();
  const { privatePhaseData } = userState;
  const { captainId } = gameState;
  const { currentGameId, playerId } = connectionState;
  const { options = [] } = privatePhaseData;

  if (playerId !== captainId) return null;

  const handleSelect = (index) => {
    if (confirmed) return;
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    if (selectedIndex === null) return;
    setConfirmed(true);
    const chosenCard = options[selectedIndex];
    const payload = { chosenCard };
    setTimeout(() => {
      socket.emit("phase_confirm", { gameId: currentGameId, payload });
    }, 2000);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-500 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🔮</span>
        <span>انتخاب کارت مراسم فرقه‌ای</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-purple-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4 text-purple-700 font-bold">
          یکی از کارت‌های مخفی زیر را انتخاب کنید.
        </div>
        <div className="flex gap-6 justify-center flex-wrap mb-6">
          {options.map((card, index) => (
            <div key={index} onClick={() => handleSelect(index)}>
              {confirmed && selectedIndex === index ? (
                <CultRitualCard type={card} selected disabled />
              ) : (
                <div
                  className={`w-28 h-40 rounded-xl flex flex-col justify-center items-center font-vazir font-bold text-center select-none shadow-inner transition-all duration-200
                    ${
                      selectedIndex === index
                        ? "ring-4 ring-purple-400 border-purple-400 scale-105"
                        : "border-2 border-gray-400"
                    }
                    bg-gradient-to-br from-gray-200 to-gray-400 text-gray-500
                    ${
                      confirmed
                        ? // ? "opacity-60 cursor-default"
                          "cursor-pointer hover:scale-105"
                        : "cursor-pointer hover:scale-105"
                    }
                  `}
                >
                  <span className="text-base md:text-lg">کارت مراسم فرقه</span>
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
          <p className="mt-4 text-center text-sm text-purple-600">
            کارت انتخاب شد و ارسال گردید.
          </p>
        )}
      </div>
    </div>
  );
}
