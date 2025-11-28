import React, { useState } from "react";
import Chip from "./Chip";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import DevCard from "./DevCard";

const DEV_COLORS = ["white", "blue", "red", "green", "black"];

export default function JokerSelectDrawer({ open, onClose, player }) {
  const availableCards = player.devCards;
  console.log(availableCards);
  const { gameState } = useGameContext();
  const { connectionState } = useAppContext();
  const { currentGameId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState("");
  const selectedJokerCard = gameState.phaseData.selectedCard;
  console.log(selectedJokerCard);

  const devCounts = { white: 0, blue: 0, red: 0, green: 0, black: 0 };
  (player.devCards || []).forEach(({ bonus, color, newColor }) => {
    console.log("color: ", color);
    console.log("bonus: ", bonus);
    // if (bonus) {
    //   devCounts[color]++;
    // }
    // devCounts[color]++;
    if (color === "joker") {
      if (bonus) {
        devCounts[newColor]++;
      }
      devCounts[newColor]++;
    } else if (color === "points") {
      true;
    } else {
      if (bonus) {
        devCounts[color]++;
      }
      devCounts[color]++;
    }
  });

  // انتخاب چیپ
  const handleCardClick = (color) => {
    if (devCounts[color] === 0) return;
    if (selected === color) {
      setSelected("");
    } else {
      setSelected(color);
    }
  };

  const handleConfirm = () => {
    console.log("انتخاب چیپ:", selected);
    // onClose?.();

    setConfirmed(true);

    const payload = {
      data: { selected, selectedJokerCard },
      type: "joker_select",
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
        <div className="flex flex-row-reverse gap-4 mb-2">
          <DevCard {...selectedJokerCard} className="w-20 h-32" />
        </div>
        <div className="mb-2 font-bold text-lg text-blue-800 ">
          یک رنگ را برای این کارت انتخاب کنید
        </div>
        <div className="mb-2 font-bold text-lg text-blue-800">
          این کارت تا انتهای این بازی، این رنگ را خواهد داشت.
        </div>
        {/* چیپ‌های موجود */}
        <div className="flex flex-row-reverse gap-4 mb-4 ">
          {DEV_COLORS.map((color) => (
            <div
              key={color}
              className={`flex flex-col items-center w-10 h-16 rounded `}
              // bg-${color}-600
              style={{
                backgroundColor: `${color}`,
                color: color === "white" && "black",
              }}
            >
              <div
                color={color}
                quantity={devCounts[color]}
                disabled={devCounts[color] === 0 || selected.length === 1}
                onClick={() => handleCardClick(color)}
                className={`flex py-5 px-3.5 text-center justify-center items-center cursor-pointer ${
                  selected === color ? "ring-4 ring-yellow-400" : ""
                } ${
                  devCounts[color] === 0 || selected.length === 1
                    ? "opacity-70"
                    : ""
                }`}
              >
                {devCounts[color]}
              </div>
              {/* <span className="text-xs mt-1 text-gray-500">{selected}</span> */}
            </div>
          ))}
        </div>
        {/* دکمه تایید */}
        <HoldToConfirmButton
          onConfirm={handleConfirm}
          label="تاییدانتخاب"
          disabled={selected.length === 0 || confirmed}
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
