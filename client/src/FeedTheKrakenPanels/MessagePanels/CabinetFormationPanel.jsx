import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";

export default function CabinetFormationPanel() {
  const { connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId } = connectionState;
  const { phaseData, captainId } = gameState;

  // فقط وقتی در فاز تشکیل کابینه هستیم و کاربر کاپیتان نیست نمایش بده
  if (
    gameState.currentPhase !== "cabinet_formation" ||
    playerId === captainId
  ) {
    return null;
  }

  const isEmergency = phaseData?.emergency === true;

  return (
    <div
      className="mb-6 p-5 rounded-2xl border border-cyan-100 bg-gradient-to-br from-gray-100 to-blue-200 shadow-lg max-w-xl mx-auto text-right"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold mb-4 text-yellow-700 flex flex-row-reverse items-center gap-2 justify-end">
        <span>👥</span>
        {isEmergency ? "تشکیل کابینه اضطراری" : "تشکیل کابینه"}
      </h2>
      <div className="mb-2 p-4 rounded-xl bg-white border border-gray-100 text-gray-800 shadow-inner text-base text-right">
        {isEmergency
          ? "کاپیتان در حال تشکیل کابینه اضطراری و انتخاب کشتیران است..."
          : "کاپیتان در حال انتخاب افسر اول و کشتیران است..."}
      </div>
    </div>
  );
}
