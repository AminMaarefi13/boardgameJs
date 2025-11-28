import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";

export default function CultGunsDistributionPanel() {
  const [confirmed, setConfirmed] = useState(false);
  const { connectionState, userState } = useAppContext();
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const { selectablePlayers, cultLeaderId } = privatePhaseData;
  const isCultLeader = playerId === cultLeaderId;
  const [guns, setGuns] = useState(() =>
    selectablePlayers?.reduce((acc, player) => {
      acc[player.id] = 0;
      return acc;
    }, {})
  );

  if (!isCultLeader) return null;

  const totalGuns = Object.values(guns).reduce((sum, val) => sum + val, 0);

  const incrementGun = (playerId) => {
    if (confirmed) return;
    const player = selectablePlayers.find((p) => p.id === playerId);
    if (player.disabled) return;
    if (totalGuns >= 3) return;
    setGuns((prev) => ({
      ...prev,
      [playerId]: prev[playerId] + 1,
    }));
  };

  const decrementGun = (playerId) => {
    if (confirmed) return;
    if (guns[playerId] === 0) return;
    setGuns((prev) => ({
      ...prev,
      [playerId]: prev[playerId] - 1,
    }));
  };

  const handleConfirm = () => {
    if (totalGuns !== 3) return;

    setConfirmed(true);

    const payload = {
      data: { playerId, distribution: guns },
      type: "cult_guns_distributed",
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-500 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🔫</span>
        <span>توزیع تفنگ توسط رهبر فرقه</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-purple-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4 text-purple-700 font-bold">
          شما باید ۳ تفنگ را بین بازیکنان زنده توزیع کنید. می‌توانید همه را به
          یک نفر بدهید یا بین چند نفر پخش کنید. مجموع باید دقیقاً ۳ باشد.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {selectablePlayers.map((p) => (
            <div
              key={p.id}
              className={`p-3 rounded-xl border flex flex-col bg-white shadow-sm transition-all duration-200 ${
                p.disabled
                  ? "opacity-60 border-red-300 bg-red-50 text-red-700 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            >
              <div className="font-bold text-lg">{p.name}</div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => decrementGun(p.id)}
                  disabled={guns[p.id] === 0 || confirmed}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  -
                </button>
                <span className="text-lg">
                  {guns[p.id] > 0 ? "🔫".repeat(guns[p.id]) : "—"}
                </span>
                <button
                  onClick={() => incrementGun(p.id)}
                  disabled={totalGuns >= 3 || confirmed || p.disabled}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              {p.disabled && (
                <div className="text-xs text-red-600 mt-2">
                  نمی‌توانید به این بازیکن تفنگ بدهید
                  {p.disabledReason && <>: {p.disabledReason}</>}
                </div>
              )}
            </div>
          ))}
        </div>
        {!confirmed && (
          <div className="text-center">
            <HoldToConfirmButton
              label="تایید توزیع"
              onConfirm={handleConfirm}
              disabled={totalGuns !== 3}
            />
          </div>
        )}
        {confirmed && (
          <div className="text-center text-purple-600 mt-4">
            توزیع تفنگ‌ها ثبت شد.
          </div>
        )}
      </div>
    </div>
  );
}
