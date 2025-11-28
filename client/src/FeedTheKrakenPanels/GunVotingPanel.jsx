import React, { useState, useEffect } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";
import { useGameContext } from "../context/GameContext";

export default function GunVotingPanel() {
  const [guns, setGuns] = useState([]);
  const [selectedGunIds, setSelectedGunIds] = useState([]);
  const { userState, connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { currentPhase, players, currentVoteSessionId, captainId } = gameState;
  const { votes } = userState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);

  const player = players.find((p) => p.id === playerId);
  if (!player || currentPhase !== "start_voting") return null;

  // اگر کاپیتان هست، فقط پیام نمایش بده
  if (playerId === captainId || player.eliminated) {
    return (
      <div
        className="mb-6 p-0 rounded-2xl border border-red-400 bg-gradient-to-br from-red-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
        dir="rtl"
      >
        <h2 className="text-xl font-extrabold text-red-700 flex flex-row-reverse items-center gap-2 justify-end bg-red-100 border-b-2 border-red-200 rounded-t-2xl px-4 py-3 shadow-sm">
          <span className="text-2xl">🔫</span>
          <span>فاز شورش</span>
        </h2>
        <div className="p-6 rounded-b-2xl bg-gradient-to-br from-red-50 to-yellow-50 text-gray-800 shadow-inner text-base text-right">
          <p className="text-gray-700 font-vazir">
            اعضای کشتی در حال رأی‌گیری هستند. لطفاً منتظر بمانید...
          </p>
        </div>
      </div>
    );
  }

  const maxGuns = player.guns;
  useEffect(() => {
    const initialGuns = Array.from({ length: maxGuns }, (_, i) => ({
      id: i,
      rotate: 315,
    }));

    if (votes.length > 0) {
      if (votes[votes.length - 1].voteSessionId === currentVoteSessionId) {
        const initialSetSelectedGunIds = initialGuns
          .filter((gun) => gun.id < votes[votes.length - 1].gunsUsed)
          .map((gun) => gun.id);

        setGuns(initialGuns);
        setSelectedGunIds(initialSetSelectedGunIds);
        setConfirmed(true);
      } else {
        setGuns(initialGuns);
        setSelectedGunIds([]);
      }
    } else {
      setGuns(initialGuns);
      setSelectedGunIds([]);
    }
  }, [maxGuns, currentVoteSessionId, votes]);

  const handleSelectGun = (gun) => {
    if (confirmed) return;
    if (selectedGunIds.includes(gun.id)) return;
    setSelectedGunIds((prev) => [...prev, gun.id]);
  };

  const handleDeselectGun = (gun) => {
    if (confirmed) return;
    setSelectedGunIds((prev) => prev.filter((id) => id !== gun.id));
  };

  const handleSubmitVote = () => {
    const payload = {
      playerId,
      gunsUsed: selectedGunIds.length,
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-red-400 bg-gradient-to-br from-red-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-red-700 flex flex-row-reverse items-center gap-2 justify-end bg-red-100 border-b-2 border-red-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🔫</span>
        <span>فاز شورش</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-gradient-to-br from-red-50 to-yellow-50 text-gray-800 shadow-inner text-base text-right">
        <p className="mb-3 text-gray-700 font-vazir">
          روی تفنگ‌هایی که می‌خواهید در شورش استفاده کنید کلیک کنید.
        </p>

        {/* لیست کامل تفنگ‌ها (بالا) */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {guns.length === 0 ? (
            <div className="text-red-700 font-bold">
              تفنگی در این شورش ندارید!
            </div>
          ) : (
            guns.map((gun) => {
              const isSelected = selectedGunIds.includes(gun.id);

              return (
                <img
                  key={gun.id}
                  src="/gun.png"
                  alt="gun"
                  className={`w-10 h-10 transition cursor-pointer ${
                    isSelected
                      ? "opacity-20 pointer-events-none"
                      : "hover:opacity-80"
                  }`}
                  style={{ transform: `rotate(${gun.rotate}deg)` }}
                  onClick={() => handleSelectGun(gun)}
                />
              );
            })
          )}
        </div>

        {/* تفنگ‌های انتخاب‌شده (پایین) */}
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2 text-red-700">
            تفنگ‌های انتخاب‌شده:
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {guns
              .filter((gun) => selectedGunIds.includes(gun.id))
              .map((gun) => (
                <img
                  key={gun.id}
                  src="/gun.png"
                  alt="gun"
                  className="w-10 h-10 cursor-pointer hover:opacity-80 transition"
                  style={{ transform: `rotate(${gun.rotate}deg)` }}
                  onClick={() => handleDeselectGun(gun)}
                />
              ))}
          </div>
          <p className="text-center mt-2 text-gray-700 font-vazir">
            مجموع:{" "}
            <strong className="text-red-700">{selectedGunIds.length}</strong>{" "}
            تفنگ
          </p>
        </div>

        <HoldToConfirmButton
          label={`ارسال ${selectedGunIds.length} رأی`}
          onConfirm={handleSubmitVote}
          disabled={confirmed}
        />
      </div>
    </div>
  );
}