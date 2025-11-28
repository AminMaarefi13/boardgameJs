import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";
import SelectablePlayerCard from "../components/FeedTheKraken/SelectablePlayerCard";

export default function CultConversionPanel() {
  const { connectionState, userState } = useAppContext();
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const { selectablePlayers, cultLeaderId } = privatePhaseData;
  const isCultLeader = playerId === cultLeaderId;
  if (!isCultLeader) return null;
  const allDisabled = selectablePlayers.every((p) => p.disabled);

  const handleSelect = (playerId) => {
    if (confirmed) return;
    setSelectedPlayerId(playerId);
  };

  const handleConfirm = () => {
    const targetId = selectedPlayerId || null;
    setConfirmed(true);
    const payload = {
      data: { targetPlayerId: targetId },
      type: "cult_conversion_target_selected",
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-500 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🕯️</span>
        <span>دعوت به فرقه</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-purple-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4 text-purple-700 font-bold text-lg">
          یکی از بازیکنان زیر را برای دعوت به فرقه انتخاب کنید.
        </div>
        <ul className="flex flex-col gap-4 mb-4">
          {selectablePlayers.map((p) => (
            <li key={p.id}>
              <SelectablePlayerCard
                player={p}
                selected={selectedPlayerId === p.id}
                disabled={p.disabled}
                tag={{
                  text: p.disabled ? "غیرفعال" : "قابل انتخاب",
                  style: p.disabled
                    ? {
                        background: "#fee2e2",
                        color: "#b91c1c",
                        borderColor: "#fca5a5",
                      }
                    : {
                        background: "#ede9fe",
                        color: "#7c3aed",
                        borderColor: "#c4b5fd",
                      },
                }}
                onClick={() => !p.disabled && handleSelect(p.id)}
              />
            </li>
          ))}
        </ul>
        {!confirmed && (
          <div className="mt-6 text-center">
            <HoldToConfirmButton
              label="تایید انتخاب"
              onConfirm={handleConfirm}
              disabled={!allDisabled && !selectedPlayerId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
