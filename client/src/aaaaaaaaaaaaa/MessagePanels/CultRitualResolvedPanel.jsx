import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";

export default function CultRitualResolvedPanel() {
  const { gameState } = useGameContext();
  const { connectionState, userState } = useAppContext();
  const { phaseData } = gameState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const { eliminated, privatePhaseData } = userState;

  if (!phaseData || gameState.currentPhase !== "cult_ritual_resolved")
    return null;

  const { ritualType, phaseSeen, gunReceivers } = phaseData;
  let content = null;
  let icon = null;
  let title = null;

  if (ritualType === "cult_cabin_search") {
    icon = "👁️";
    title = "مشاهده نقش‌های کابین توسط رهبر فرقه";
    content = (
      <>
        👁️ رهبر فرقه نقش‌های کابین را مشاهده کرد.
        <br />
        <span className="text-indigo-700 font-semibold">
          مرحله بعد: تشکیل کابینه
        </span>
      </>
    );
  } else if (ritualType === "cult_guns_distributed") {
    icon = "🔫";
    title = "توزیع تفنگ توسط رهبر فرقه";
    content = (
      <>
        🔫 رهبر فرقه تفنگ‌ها را توزیع کرد:{" "}
        <span className="font-bold text-green-700">{gunReceivers}</span>
        <br />
        <span className="text-indigo-700 font-semibold">
          مرحله بعدی: تشکیل کابینه
        </span>
      </>
    );
  } else if (ritualType === "cult_conversion_target_selected") {
    icon = "🔮";
    title = "شناخت عضو جدید فرقه";
    // پیام مخفیانه برای عضو جدید فرقه
    if (
      privatePhaseData &&
      privatePhaseData.cultLeaderId &&
      privatePhaseData.cultLeaderName
    ) {
      content = (
        <div className="mb-4 p-4 bg-yellow-50 rounded border border-yellow-400 text-yellow-800 shadow-inner leading-8 text-right text-lg">
          🕯️ این پیام مخفیانه است. شما اکنون عضو فرقه هستید.
          <br />
          رهبر فرقه:{" "}
          <span className="font-bold">{privatePhaseData.cultLeaderName}</span>
        </div>
      );
    }
    // پیام مخفیانه برای رهبر فرقه
    else if (
      privatePhaseData &&
      privatePhaseData.targetId &&
      privatePhaseData.targetName
    ) {
      content = (
        <div className="mb-4 p-4 bg-yellow-50 rounded border border-yellow-400 text-yellow-800 shadow-inner leading-8 text-right text-lg">
          🕯️ این پیام مخفیانه است. شما{" "}
          <span className="font-bold">{privatePhaseData.targetName}</span> را به
          عضویت فرقه درآوردید.
        </div>
      );
    } else {
      content = <>🔮 رهبر فرقه و عضو جدید فرقه همدیگر را شناختند...</>;
    }
  } else {
    return null;
  }

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
        <span className="text-2xl">{icon}</span>
        <span>{title}</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-purple-100 text-gray-800 shadow-inner leading-8 text-right text-lg">
        {content}
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
