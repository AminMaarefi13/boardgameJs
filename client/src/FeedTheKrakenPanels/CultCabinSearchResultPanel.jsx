import React, { useState } from "react";
import { socket } from "../network/socket";
import HoldToConfirmButton from "../UI/HoldToConfirmButton";
import { useAppContext } from "../context/AppContext";

export default function CultCabinSearchResultPanel() {
  const { connectionState, userState } = useAppContext();
  const [confirmed, setConfirmed] = useState(false);
  const { privatePhaseData } = userState;
  const { currentGameId, playerId } = connectionState;
  const { cabinInfo, cultLeaderId } = privatePhaseData;

  const isCultLeader = playerId === cultLeaderId;
  if (!isCultLeader) return null;

  const handleConfirm = () => {
    const payload = {
      gameId: currentGameId,
      data: { playerId },
      type: "cult_cabin_search",
    };
    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    setConfirmed(true);
  };

  return (
    <div
      className="mb-6 p-0 rounded-2xl border border-purple-500 bg-gradient-to-br from-purple-50 to-yellow-50 shadow-lg max-w-xl mx-auto text-right font-vazir"
      dir="rtl"
    >
      <h2 className="text-xl font-extrabold text-purple-700 flex flex-row-reverse items-center gap-2 justify-end bg-purple-100 border-b-2 border-purple-200 rounded-t-2xl px-4 py-3 shadow-sm">
        <span className="text-2xl">🕯️</span>
        <span>مشاهده اطلاعات کابینه (رهبر فرقه)</span>
      </h2>
      <div className="p-6 rounded-b-2xl bg-white border-t-0 border border-purple-100 text-gray-800 shadow-inner text-base text-right">
        <div className="mb-4 text-purple-700 font-bold">
          شما به عنوان رهبر فرقه، اطلاعات مربوط به سه عضو کابینه فعلی را مشاهده
          می‌کنید. این اطلاعات فقط برای شما قابل مشاهده است.
        </div>
        <div className="flex flex-col gap-4 mb-6">
          {cabinInfo.map((info, index) => (
            <div
              key={index}
              className="p-3 border rounded-xl bg-purple-50 border-purple-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p className="text-sm text-gray-500">نام بازیکن:</p>
                <p className="text-base font-semibold text-gray-800">
                  {info.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">نقش در کابینه:</p>
                <p className="text-base font-semibold text-purple-700">
                  {translateCabinRole(info.cabinRole)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">نقش در تیم:</p>
                <p className="text-base font-semibold text-purple-700">
                  {translateGameRole(info.role)}
                </p>
              </div>
              {translateGameRole(info.initialRole) !== "ندارد" && (
                <div>
                  <p className="text-sm text-gray-500">نقش اولیه:</p>
                  <p className="text-base font-semibold text-gray-800">
                    {translateGameRole(info.initialRole)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <HoldToConfirmButton
            label="دیدم"
            onConfirm={handleConfirm}
            disabled={confirmed}
            className="w-32 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-2 shadow transition"
          />
        </div>
      </div>
    </div>
  );
}

// تابع کمکی برای ترجمه نقش کابینه
function translateCabinRole(cabinRole) {
  switch (cabinRole) {
    case "captain":
      return "کاپیتان";
    case "firstOfficer":
      return "افسر اول";
    case "navigator":
      return "ناوبر";
    default:
      return "نامشخص";
  }
}

// تابع کمکی برای ترجمه نقش اولیه (بسته به بازی شما قابل گسترشه)
function translateGameRole(role) {
  switch (role) {
    case "cultLeader":
      return "رهبر فرقه";
    case "cultist":
      return "فرقه‌ای";
    case "sailor":
      return "ملوان";
    case "pirate":
      return "دزد  دریایی";
    default:
      return "ندارد";
  }
}
