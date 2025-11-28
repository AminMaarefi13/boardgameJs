import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

export default function CabinSearchResultCaptainPanel() {
  const { connectionState, userState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId, currentGameId } = connectionState;
  const { captainId } = gameState;
  const privatePhaseData = userState?.privatePhaseData;
  const phaseData = gameState.phaseData;
  const [confirmed, setConfirmed] = useState(false);

  // فقط برای کاپیتان زمانی که نقش بازیکن را می‌بیند
  if (
    gameState.currentPhase !== "location_effect_resolved" ||
    playerId !== captainId ||
    !privatePhaseData?.role
  ) {
    return null;
  }

  const { targetName, role, initialRole } = privatePhaseData;

  const handleConfirm = () => {
    const payload = {
      playerId,
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-indigo-500 bg-gradient-to-br from-indigo-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-indigo-700 flex flex-row-reverse items-center gap-2 justify-end bg-indigo-100 border-b-2 border-indigo-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🔍</span>
        <span>مشاهده نقش کابین</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-indigo-100 text-gray-800 shadow-inner leading-8 text-right text-lg">
        بازیکن <span className="font-bold text-indigo-700">{targetName}</span>{" "}
        نقش <span className="font-bold text-indigo-700">{role}</span> را دارد.
        {initialRole && (
          <>
            <br />
            <span className="text-gray-700">
              نقش اولیه:{" "}
              <span className="font-bold text-indigo-700">{initialRole}</span>
            </span>
          </>
        )}
      </div>
      <div className="px-5 pb-5 pt-2 flex justify-center">
        <HoldToConfirmButton
          label="دیدم"
          onConfirm={handleConfirm}
          disabled={confirmed}
          className="w-32 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-2 shadow transition"
        />
      </div>
    </div>
  );
}
