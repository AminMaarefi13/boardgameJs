import React, { useState } from "react";
import Chip from "./Chip";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";
import { useAppContext } from "../../context/AppContext";

const CHIP_COLORS = ["white", "blue", "red", "green", "black", "yellow"];

export default function ChipWithdrawDrawer({
  open,
  onClose,
  player,
  initialColor,
}) {
  const availableChips = player.chips;
  console.log(availableChips);
  const { connectionState } = useAppContext();
  const { currentGameId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState(() => {
    const obj = {};
    CHIP_COLORS.forEach((color) => (obj[color] = 0));
    if (initialColor && CHIP_COLORS.includes(initialColor)) {
      obj[initialColor] = 1;
    }
    return obj;
  });

  // چیپ‌های موجود به صورت آبجکت
  const chipsByColor = {};
  CHIP_COLORS.forEach((color) => (chipsByColor[color] = 0));
  availableChips.forEach((chip) => {
    chipsByColor[chip.color] = chip.quantity;
  });
  console.log(availableChips);
  console.log(chipsByColor);
  const chipsSum = CHIP_COLORS.reduce((sum, color) => {
    const chip = availableChips.find((chip) => chip.color === color);
    return sum + chip.quantity || 0;
  }, 0);
  console.log(chipsSum);

  // انتخاب چیپ
  const handleChipClick = (color) => {
    const total = CHIP_COLORS.reduce((sum, c) => sum + selected[c], 0);
    if (total > chipsSum) return;

    setSelected((prev) => ({
      ...prev,
      [color]: prev[color] + 1,
    }));
  };

  // حذف انتخاب با کلیک روی چیپ انتخاب‌شده
  const handleSelectedChipClick = (color) => {
    if (selected[color] > 0) {
      setSelected((prev) => ({
        ...prev,
        [color]: prev[color] - 1,
      }));
    }
  };

  // اعتبارسنجی انتخاب
  const isValid = (() => {
    const total = CHIP_COLORS.reduce((sum, c) => sum + selected[c], 0);

    if (total === chipsSum - 10) {
      return true;
    }

    return false;
  })();

  const chipsWithdrew = CHIP_COLORS.filter((c) => selected[c] > 0).map((c) => ({
    color: c,
    quantity: selected[c],
  }));

  const handleConfirm = () => {
    console.log("انتخاب چیپ:", chipsWithdrew);
    // onClose?.();

    setConfirmed(true);

    const payload = {
      data: { chipsWithdrew },
      type: "chips_withdraw",
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    onClose?.();
  };

  if (!open) return null;

  // هندل کلیک روی بک‌دراپ برای بستن کشو
  const handleBackdropClick = (e) => {
    if (e.target.id === "chip-select-backdrop") {
      onClose?.();
    }
  };

  return (
    <div
      id="chip-select-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      style={{
        direction: "rtl",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="backdrop-blur-md bg-white/60 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center animate-fadeInChipDrawer relative mx-4"
        style={{ boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)" }}
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن هنگام کلیک روی کشو
      >
        {/* دکمه بستن */}
        <button
          className="absolute left-3 top-3 text-2xl text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-2 font-bold text-lg text-blue-800 ">
          {chipsSum - 10} چیپ را باید پس بدهید!
        </div>
        <div className="mb-2 font-bold text-lg text-blue-800">
          در آخر هر نوبت حداکثر 10 چیپ میشه داشت!
        </div>
        {/* چیپ‌های موجود */}
        <div className="flex flex-row-reverse gap-2 mb-4">
          {CHIP_COLORS.map((color) => (
            <div key={color} className="flex flex-col items-center">
              <Chip
                color={color}
                quantity={chipsByColor[color] - selected[color]}
                disabled={chipsByColor[color] - selected[color] <= 0}
                onClick={() => handleChipClick(color)}
                className={`cursor-pointer ${
                  selected[color] > 0 ? "ring-2 ring-yellow-400" : ""
                }`}
              />
              <span className="text-xs mt-1 text-gray-500">
                {chipsByColor[color] - selected[color]}
              </span>
            </div>
          ))}
        </div>
        {/* چیپ‌های انتخابی */}
        <div className="flex flex-row-reverse gap-2 mb-4">
          {CHIP_COLORS.map((color) =>
            selected[color] > 0 ? (
              <div key={color} className="flex flex-col items-center">
                <Chip
                  color={color}
                  quantity={selected[color]}
                  className="opacity-80 cursor-pointer"
                  onClick={() => handleSelectedChipClick(color)}
                />
              </div>
            ) : null
          )}
        </div>
        {/* دکمه تایید */}
        <HoldToConfirmButton
          onConfirm={handleConfirm}
          label="تاییدانتخاب"
          disabled={!isValid || confirmed}
        />
      </div>
      <style>{`
        .animate-fadeInChipDrawer {
          animation: fadeInChipDrawer 0.25s;
        }
        @keyframes fadeInChipDrawer {
          from { opacity: 0; transform: translateY(40px) scale(0.95);}
          to { opacity: 1; transform: translateY(0) scale(1);}
        }
      `}</style>
    </div>
  );
}
