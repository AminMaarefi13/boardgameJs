import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";
import { useGameContext } from "../context/GameContext";
import SelectablePlayerCard from "../components/FeedTheKraken/SelectablePlayerCard";

export default function LocationEffectPanel() {
  const { userState, connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { privatePhaseData } = userState;
  const { currentPhase, captainId, phaseData } = gameState;
  const { playerId, currentGameId } = connectionState;
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { selectablePlayers } = privatePhaseData;

  console.log(gameState);
  console.log(userState);
  const effectType = currentPhase;
  console.log(currentPhase);
  console.log(privatePhaseData);
  console.log(selectablePlayers);
  console.log(phaseData);

  if (
    !phaseData ||
    playerId !== captainId ||
    !privatePhaseData ||
    !selectablePlayers
  )
    return null;

  const enabledPlayers = selectablePlayers.filter((p) => !p.disabled);
  const enabledCount = enabledPlayers.length;

  const handleSelect = (id) => {
    if (confirmed) return;
    setSelectedPlayerId(id);
  };

  const handleConfirm = () => {
    let payload;
    if (enabledCount === 0) {
      payload = { targetPlayerId: null, effectType };
    } else {
      if (!selectedPlayerId) {
        alert("لطفاً یک بازیکن را انتخاب کنید.");
        return;
      }
      payload = { targetPlayerId: selectedPlayerId, effectType };
    }
    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true);
  };

  const effectTag = {
    cabin_search: {
      text: "دیدن نقش",
      style: {
        background: "#dbeafe",
        color: "#1e40af",
        borderColor: "#60a5fa",
      },
    },
    off_with_tongue: {
      text: "بریدن زبان",
      style: {
        background: "#fbcfe8",
        color: "#be185d",
        borderColor: "#f472b6",
      },
    },
    flogging: {
      text: "شلاق",
      style: {
        background: "#fef9c3",
        color: "#ca8a04",
        borderColor: "#fde047",
      },
    },
    feed_the_kraken: {
      text: "قربانی کراکن",
      style: {
        background: "#e0e7ff",
        color: "#3730a3",
        borderColor: "#818cf8",
      },
    },
  };

  const effectTitles = {
    cabin_search: "🔍 جستجوی کابین",
    off_with_tongue: "😶 بریدن زبان",
    flogging: "💥 شلاق",
    feed_the_kraken: "🦑 قربانی کراکن",
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-500 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">✨</span>
        <span>{effectTitles[effectType] || "افکت مکان"}</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-purple-100 text-gray-800 shadow-inner text-base text-right">
        <ul className="flex flex-col gap-4 mb-4">
          {selectablePlayers.map((p) => (
            <li key={p.id}>
              <SelectablePlayerCard
                player={p}
                selected={selectedPlayerId === p.id}
                disabled={p.disabled}
                tag={effectTag[effectType]}
                onClick={() => !p.disabled && handleSelect(p.id)}
              />
            </li>
          ))}
        </ul>
        <HoldToConfirmButton
          label="تأیید نهایی"
          onConfirm={handleConfirm}
          disabled={confirmed || (enabledCount > 0 && !selectedPlayerId)}
        />
      </div>
    </div>
  );
}
