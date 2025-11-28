import React, { useState } from "react";
import Chip from "./Chip";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";
import { useAppContext } from "../../context/AppContext";

const CHIP_COLORS = [
  "white",
  "blue",
  "red",
  "green",
  "black",
  "yellow",
  "pearl",
];

export default function ChipSelectDrawer({
  gameState,
  myIndex,
  open,
  onClose,
}) {
  const opponentIndex = myIndex === 1 ? 0 : 1;
  const availableChips = gameState.players.find(
    (player) => player.seat === opponentIndex
  ).chips;
  console.log(availableChips);
  const { connectionState } = useAppContext();
  const { currentGameId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState("");

  // چیپ‌های موجود به صورت آبجکت
  const chipsByColor = {};
  CHIP_COLORS.forEach((color) => (chipsByColor[color] = 0));
  availableChips.forEach((chip) => {
    chipsByColor[chip.color] = chip.quantity;
  });

  // انتخاب چیپ
  const handleChipClick = (color) => {
    if (color === "yellow") return;
    if (selected === "") {
      setSelected(color);
      return;
    }
  };

  // حذف انتخاب با کلیک روی چیپ انتخاب‌شده
  const handleSelectedChipClick = () => {
    setSelected("");
  };

  // اعتبارسنجی انتخاب
  const isValid = (() => {
    const chipsSum = CHIP_COLORS.reduce((sum, color) => {
      const chip = availableChips.find((chip) => chip.color === color);
      return sum + chip.quantity || 0;
    }, 0);
    console.log(chipsSum);
    if (chipsSum > 0) {
      if (selected) {
        return true;
      }
    } else {
      return true;
    }
  })();

  const handleConfirm = () => {
    console.log("انتخاب چیپ:", selected);
    // onClose?.();

    setConfirmed(true);

    const payload = {
      data: { stealSelected: selected },
      type: "steal_selected",
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
        <div className="mb-2 font-bold text-lg text-blue-800">انتخاب چیپ</div>
        <div className="mb-2 font-bold text-lg text-blue-800">
          یک چیپ از بازیکن حریف بردارید
        </div>
        <div className="mb-2 font-bold text-lg text-blue-800">
          چیپ زرد قابل انتخاب نیست!
        </div>
        {/* چیپ‌های موجود */}
        <div className="flex flex-row gap-2 mb-4">
          {CHIP_COLORS.map((color) => (
            <div key={color} className="flex flex-col items-center">
              <Chip
                color={color}
                quantity={
                  selected === color
                    ? chipsByColor[color] - 1
                    : chipsByColor[color]
                }
                disabled={selected !== "" || color === "yellow"}
                onClick={() => handleChipClick(color)}
                className={`cursor-pointer ${
                  selected[color] > 0 ? "ring-2 ring-yellow-400" : ""
                }`}
              />
              {/* <span className="text-xs mt-1 text-gray-500">
                {selected === color
                  ? chipsByColor[color] - 1
                  : chipsByColor[color]}
              </span> */}
            </div>
          ))}
        </div>
        {/* چیپ‌های انتخابی */}
        <div className="flex flex-row-reverse gap-2 mb-4">
          {CHIP_COLORS.map((color) =>
            selected === color ? (
              <div key={color} className="flex flex-col items-center">
                <Chip
                  color={color}
                  quantity={1}
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
