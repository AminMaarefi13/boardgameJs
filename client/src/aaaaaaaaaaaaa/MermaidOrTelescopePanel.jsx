import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";
import { useGameContext } from "../context/GameContext";
import SelectablePlayerCard from "../components/FeedTheKraken/SelectablePlayerCard";

export default function MermaidOrTelescopePanel() {
  const { userState, connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { privatePhaseData } = userState;
  const { currentPhase, captainId } = gameState;
  const { currentGameId, playerId } = connectionState;

  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  if (playerId !== captainId) {
    return null;
  }
  const { selectablePlayers = [] } = privatePhaseData;

  const color = currentPhase === "mermaid" ? "indigo" : "purple";
  const icon = currentPhase === "mermaid" ? "🧜‍♀️" : "🔭";
  const typeLabel = currentPhase === "mermaid" ? "🧜‍♀️ پری دریایی" : "🔭 تلسکوپ";
  const title =
    currentPhase === "mermaid"
      ? "یک بازیکن را برای استفاده از اثر پری دریایی انتخاب کنید."
      : "یک بازیکن را برای استفاده از اثر تلسکوپ انتخاب کنید.";
  const buttonLabel =
    currentPhase === "mermaid" ? "قابلیت پری دریایی" : "قابلیت تلسکوپ";

  const effectTag = {
    mermaid: {
      text: "پری دریایی",
      style: {
        background: "#ede9fe",
        color: "#6366f1",
        borderColor: "#a5b4fc",
      },
    },
    telescope: {
      text: "تلسکوپ",
      style: {
        background: "#f3e8ff",
        color: "#86198f",
        borderColor: "#d8b4fe",
      },
    },
  };

  const handleConfirmChoice = () => {
    if (!selectedPlayerId) {
      alert("لطفاً یک بازیکن را انتخاب کنید.");
      return;
    }
    const payload = {
      targetPlayerId: selectedPlayerId,
      type: currentPhase,
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true);
  };

  return (
    <div
      className={`mb-6 p-0 rounded-2xl border border-${color}-500 bg-gradient-to-br from-${color}-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir`}
      dir="rtl"
    >
      <h2
        className={`text-xl font-extrabold text-${color}-700 flex flex-row-reverse items-center gap-2 justify-end
        bg-${color}-100 border-b-2 border-${color}-200 rounded-t-2xl px-4 py-3 shadow-sm`}
      >
        <span className="text-2xl">{icon}</span>
        <span>{typeLabel}</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-indigo-100 text-gray-800 shadow-inner text-base text-right">
        <div className={`mb-4 font-bold text-${color}-700`}>{title}</div>
        <ul className="flex flex-col gap-4 mb-4">
          {selectablePlayers.map((p) => (
            <li key={p.id}>
              <SelectablePlayerCard
                player={p}
                selected={selectedPlayerId === p.id}
                disabled={p.disabled}
                tag={effectTag[currentPhase]}
                onClick={() => !p.disabled && setSelectedPlayerId(p.id)}
              />
            </li>
          ))}
        </ul>
        <HoldToConfirmButton
          label="تأیید نهایی"
          onConfirm={handleConfirmChoice}
          disabled={!selectedPlayerId || confirmed}
        />
      </div>
    </div>
  );
}
