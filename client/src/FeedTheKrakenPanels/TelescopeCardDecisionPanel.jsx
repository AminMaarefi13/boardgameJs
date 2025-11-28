import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";
import { useGameContext } from "../context/GameContext";
import NavigationCard from "../components/FeedTheKraken/NavigationCard";

export default function TelescopeCardDecisionPanel() {
  const { userState, connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { privatePhaseData } = userState;
  const { phaseData } = gameState;
  const { currentGameId, playerId } = connectionState;
  const [decision, setDecision] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { card } = privatePhaseData;

  if (
    !phaseData ||
    gameState.currentPhase !== "telescope_choice" ||
    phaseData.targetPlayerId !== playerId
  )
    return null;

  const handleConfirm = () => {
    if (!decision) {
      alert("لطفاً تصمیم خود را انتخاب کنید.");
      return;
    }

    const payload = {
      playerId,
      decision, // "keep" or "discard"
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });

    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-500 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🔭</span>
        <span>تصمیم در مورد کارت تلسکوپ</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-purple-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4">
          شما کارت زیر را مشاهده کردید. آیا می‌خواهید آن را در بالای دسته نگه
          دارید یا به دریا بیندازید؟
        </div>
        <div className="flex justify-center mb-6">
          <NavigationCard type={card.type} color={card.color} />
        </div>
        <div className="flex gap-4 justify-center mb-6">
          <button
            className={`px-5 py-2 rounded-xl border font-bold transition-all duration-150 text-base shadow-sm
              ${
                decision === "keep"
                  ? "bg-green-500 text-white border-green-700 scale-105"
                  : "bg-white text-green-700 border-green-400 hover:bg-green-50 hover:scale-105"
              }
              ${confirmed ? "opacity-60 cursor-not-allowed" : ""}
            `}
            onClick={() => setDecision("keep")}
            disabled={confirmed}
          >
            نگه داشتن در بالای دسته
          </button>
          <button
            className={`px-5 py-2 rounded-xl border font-bold transition-all duration-150 text-base shadow-sm
              ${
                decision === "discard"
                  ? "bg-red-500 text-white border-red-700 scale-105"
                  : "bg-white text-red-700 border-red-400 hover:bg-red-50 hover:scale-105"
              }
              ${confirmed ? "opacity-60 cursor-not-allowed" : ""}
            `}
            onClick={() => setDecision("discard")}
            disabled={confirmed}
          >
            انداختن به دریا
          </button>
        </div>
        <HoldToConfirmButton
          label="تایید تصمیم"
          onConfirm={handleConfirm}
          disabled={!decision || confirmed}
        />
      </div>
    </div>
  );
}
