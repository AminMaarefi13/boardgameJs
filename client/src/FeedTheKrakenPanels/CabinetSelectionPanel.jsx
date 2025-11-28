import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useGameContext } from "../context/GameContext";
import { useAppContext } from "../context/AppContext";

export default function CabinetSelectionPanel() {
  const [firstOfficerId, setFirstOfficerId] = useState(null);
  const [navigatorId, setNavigatorId] = useState(null);
  const { userState, connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);

  const isEmergency = privatePhaseData?.emergency === true;

  if (
    gameState.currentPhase !== "cabinet_formation" ||
    gameState.captainId !== playerId ||
    !privatePhaseData?.selectablePlayers
  ) {
    return null;
  }

  // تعداد بازیکنان قابل انتخاب
  const enabledPlayers =
    privatePhaseData?.selectablePlayers.filter((p) => !p.disabled) || [];
  const enabledCount = enabledPlayers.length;

  const handleSelect = (playerId, role) => {
    if (confirmed) return;
    if (role === "firstOfficer") {
      if (navigatorId === playerId) setNavigatorId(null);
      setFirstOfficerId(playerId);
    } else {
      if (firstOfficerId === playerId) setFirstOfficerId(null);
      setNavigatorId(playerId);
    }
  };

  const handleConfirmCabinet = () => {
    // ... همان منطق قبلی ...
    if (!isEmergency && enabledCount === 0) {
      socket.emit("phase_confirm", {
        gameId: currentGameId,
        payload: {
          emergency: false,
          navigatorId: null,
          firstOfficerId: null,
        },
      });
      setConfirmed(true);
      return;
    }
    if (!isEmergency && enabledCount === 1) {
      if (!navigatorId && !firstOfficerId) {
        alert("لطفاً این بازیکن را به عنوان افسر اول یا کشتیران انتخاب کنید.");
        return;
      }
      socket.emit("phase_confirm", {
        gameId: currentGameId,
        payload: {
          emergency: false,
          navigatorId: navigatorId || null,
          firstOfficerId: firstOfficerId || null,
        },
      });
      setConfirmed(true);
      return;
    }
    if (isEmergency && enabledCount === 0) {
      socket.emit("phase_confirm", {
        gameId: currentGameId,
        payload: {
          emergency: true,
          navigatorId: null,
          firstOfficerId: gameState.firstOfficerId,
        },
      });
      setConfirmed(true);
      return;
    }
    if (isEmergency) {
      if (!navigatorId) {
        alert("لطفاً یک کشتیران انتخاب کنید.");
        return;
      }
      socket.emit("phase_confirm", {
        gameId: currentGameId,
        payload: {
          emergency: true,
          navigatorId,
          firstOfficerId: gameState.firstOfficerId,
        },
      });
      setConfirmed(true);
      return;
    }
    if (!navigatorId || !firstOfficerId) {
      alert("لطفاً هر دو نقش را انتخاب کنید.");
      return;
    }
    const payload = {
      emergency: false,
      navigatorId,
      firstOfficerId,
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-5 rounded-2xl border border-black-400 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg max-w-xl mx-auto text-right"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold mb-4 text-yellow-700 flex flex-row-reverse items-center gap-2 justify-end">
        <span>📋</span> انتخاب کابینه
      </h2>
      {isEmergency && (
        <p className="text-sm text-red-600 mb-2">
          🚨 حالت اضطراری فعال است: فقط نیاز به انتخاب کشتیران دارید.
        </p>
      )}

      {!isEmergency && enabledCount === 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-xl text-red-700 text-sm shadow-inner">
          هیچ بازیکنی برای انتخاب وجود ندارد و کارت‌های مربوط به کشتیران و افسر
          اول بصورت رندوم تعیین می‌شود.
        </div>
      )}

      {!isEmergency && enabledCount === 1 && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-xl text-yellow-800 text-sm shadow-inner">
          فقط یک بازیکن برای انتخاب وجود دارد. در صورت انتخاب یکی از بین افسر
          اول یا کشتیران، کارت نقش دیگر بصورت رندوم تعیین می‌شود.
        </div>
      )}

      {isEmergency && enabledCount === 0 && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-xl text-yellow-800 text-sm shadow-inner">
          هیچ بازیکنی برای انتخاب وجود ندارد و کارت مربوط به کشتیران بصورت رندوم
          انتخاب می‌شود.
        </div>
      )}

      {enabledCount > 0 && (
        <ul className="flex flex-col gap-3">
          {privatePhaseData?.selectablePlayers.map((p) => {
            const isSelectedAsFirstOfficer = p.id === firstOfficerId;
            const isSelectedAsNavigator = p.id === navigatorId;

            return (
              <li
                key={p.id}
                className={
                  "flex flex-col gap-2 p-4 rounded-2xl border shadow bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-200" +
                  (p.disabled
                    ? " opacity-80 border-red-300 bg-red-50 text-red-700 cursor-not-allowed"
                    : " hover:shadow-md")
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-lg text-gray-800">
                    {p.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-300 shadow-sm text-xs">
                    صندلی #{p.seat + 1}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-medium mt-1">
                  {p.disabled && (
                    <span className="px-2 py-0.5 rounded-full bg-red-200 text-red-800 border border-red-400 shadow-sm">
                      {p.disabledReason || "غیرفعال"}
                    </span>
                  )}
                  {isSelectedAsFirstOfficer && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-400 shadow-sm">
                      👨‍✈️ افسر اول (انتخاب شما)
                    </span>
                  )}
                  {isSelectedAsNavigator && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-400 shadow-sm">
                      🧭 کشتیران (انتخاب شما)
                    </span>
                  )}
                </div>
                {!p.disabled && (
                  <div className="flex gap-2 mt-2 w-full">
                    {!isEmergency && (
                      <button
                        onClick={() => handleSelect(p.id, "firstOfficer")}
                        className={`w-1/2 px-3 py-1 text-base rounded-xl border font-bold transition ${
                          isSelectedAsFirstOfficer
                            ? "bg-green-500 text-white border-green-600 shadow"
                            : "border-green-400 text-green-700 bg-green-50 hover:bg-green-100"
                        }`}
                      >
                        افسر اول
                      </button>
                    )}
                    <button
                      onClick={() => handleSelect(p.id, "navigator")}
                      className={`${
                        isEmergency ? "w-full" : "w-1/2"
                      } px-3 py-1 text-base rounded-xl border font-bold transition ${
                        isSelectedAsNavigator
                          ? "bg-blue-600 text-white border-blue-700 shadow"
                          : "border-blue-400 text-blue-700 bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      کشتیران
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <HoldToConfirmButton
        label="تایید نهایی"
        onConfirm={handleConfirmCabinet}
        disabled={
          confirmed ||
          (isEmergency
            ? enabledCount === 0
              ? false
              : !navigatorId
            : enabledCount === 0
            ? false
            : enabledCount === 1
            ? !navigatorId && !firstOfficerId
            : !navigatorId || !firstOfficerId)
        }
      />
    </div>
  );
}