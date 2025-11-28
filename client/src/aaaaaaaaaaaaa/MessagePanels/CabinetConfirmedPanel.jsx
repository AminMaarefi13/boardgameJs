import React, { useState } from "react";
import { useGameContext } from "../../context/GameContext";
import { useAppContext } from "../../context/AppContext";
import { socket } from "../../network/socket";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";

export default function CabinetConfirmedPanel() {
  const [confirmed, setConfirmed] = useState(false);
  const { gameState } = useGameContext();
  const { userState, connectionState } = useAppContext();
  const { playerId, currentGameId } = connectionState;
  const { phaseData, players } = gameState;
  const { eliminated } = userState;

  if (
    !phaseData ||
    (phaseData.currentPhase !== "cabinet_confirmed" &&
      phaseData.currentPhase !== "emergency_cabinet_confirmed" &&
      phaseData.currentPhase !== "only_captain_cabinet_confirmed")
  ) {
    return null;
  }
  const { phaseSeen } = phaseData;

  const captain = players?.find((p) => p.id === gameState.captainId);
  const firstOfficer =
    players?.find((p) => p.id === gameState.firstOfficerId) || null;
  const navigator =
    players?.find((p) => p.id === gameState.navigatorId) || null;

  const isEmergency = phaseData.emergency === true;

  // تعیین نقش کاربر فعلی
  let userRoleMsg = "";
  if (playerId === captain?.id) {
    userRoleMsg = "شما به عنوان کاپیتان این کابینه را انتخاب کردید.";
  } else if (!isEmergency && playerId === firstOfficer?.id) {
    userRoleMsg = "شما به عنوان 👨‍✈️ افسر اول انتخاب شدید.";
  } else if (playerId === navigator?.id) {
    userRoleMsg = "شما به عنوان 🧭 کشتیران انتخاب شدید.";
  }

  // ساختار اطلاعات کابینه
  const roleBox = (icon, label, name, color) => (
    <div className="flex items-center gap-2 bg-gray-100 border border-gray-100 rounded-xl px-3 py-2 shadow-sm mb-2">
      <span className="text-xl">{icon}</span>
      <span className={`font-bold ${color}`}>{name}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-gray-00 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg max-w-xl mx-auto text-right"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-yellow-700 flex flex-row-reverse items-center gap-2 justify-end bg-gray-100  border-gray-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">✅</span>
        <span>
          {isEmergency ? "کابینه اضطراری انتخاب شد" : "کابینه انتخاب شد"}
        </span>
      </h2>
      <div className="p-5 rounded-b-2xl bg-gray border-t-0 border border-gray-100 text-gray-800 shadow-inner text-base text-right">
        {/* پیام نقش کاربر */}
        {userRoleMsg && (
          <div className="mb-4 px-3 py-2 rounded-xl bg-gray-100 border border-gray-100 text-indigo-700 font-bold shadow-sm">
            {userRoleMsg}
          </div>
        )}

        {/* اطلاعات کابینه */}
        <div className="mb-4">
          {captain && roleBox("🎖️", "کاپیتان", captain.name, "text-indigo-700")}
          {firstOfficer &&
            roleBox("👨‍✈️", "افسر اول", firstOfficer.name, "text-green-700")}
          {navigator &&
            roleBox("🧭", "کشتیران", navigator.name, "text-blue-700")}
        </div>

        {/* توضیحات مرحله */}
        <div className="mb-2">
          {!firstOfficer && !navigator && (
            <div className="mb-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-700 shadow-sm text-sm">
              افسر اول و کشتیران نداریم و یک کارت بصورت رندوم به جای افسر اول
              انتخاب خواهد شد.
              <br />
              از بین کارت انتخابی کاپیتان و کارت انتخابی افسر اول، یک کارت بصورت
              رندوم به عنوان انتخاب کشتیران انتخاب خواهد شد.
            </div>
          )}
          {!navigator && firstOfficer && (
            <div className="mb-2 px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-100 text-yellow-700 shadow-sm text-sm">
              کشتیران نداریم و کارت ناوبری پس از انتخاب کاپیتان و افسر اول بصورت
              رندوم انتخاب خواهد شد.
            </div>
          )}
          {!firstOfficer && navigator && (
            <div className="mb-2 px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-100 text-yellow-700 shadow-sm text-sm">
              افسر اول نداریم و یک کارت بصورت رندوم به جای افسر انتخاب خواهد شد.
            </div>
          )}
        </div>

        {/* پیام مرحله بعد */}
        <div className="mb-2">
          {isEmergency ? (
            <div className="px-3 py-2 rounded-xl bg-yellow-100 border border-yellow-200 text-yellow-800 shadow-sm text-sm">
              علیه کابینه اضطراری نمی‌شود شورش کرد. مرحله بعد کارت‌های ناوبری
              پخش خواهد شد.
            </div>
          ) : (
            (firstOfficer || navigator) && (
              <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 shadow-sm text-lg">
                🔫 حالا وقتشه تصمیم بگیرید که این کابینه رو قبول دارید یا نه.
              </div>
            )
          )}
        </div>
      </div>
      {phaseData?.type === "see" && !eliminated && (
        <div className="px-5 pb-5 pt-2">
          <HoldToConfirmButton
            label="دیدم"
            onConfirm={() => {
              socket.emit("phase_seen", { gameId: currentGameId });
              setConfirmed(true);
            }}
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
