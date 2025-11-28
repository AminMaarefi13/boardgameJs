import React, { useState } from "react";
import DevCard from "./DevCard";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { canBuyDevCard } from "./canBuyDevCard";
import Chip from "./Chip";
import { socket } from "../../network/socket";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";

const COLORS = ["white", "blue", "red", "green", "black", "yellow", "pearl"];
const COLORS_DEV = ["white", "blue", "red", "green", "black"];

export default function DevCardBuyDrawer({
  open,
  onClose,
  devCard,
  reserved,
  onConfirm,
  player, // بازیکن جاری را به این کامپوننت پاس بده
}) {
  const [confirmed, setConfirmed] = useState(false);
  const { connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { currentGameId } = connectionState;
  if (!open || !devCard) return null;

  // بررسی امکان خرید کارت
  // const { chipCounts, devCounts, chipsNeeded } = player
  //   ? canBuyDevCard(devCard, player)
  //   : false;
  console.log(devCard);
  console.log(player);
  const {
    chipCounts,
    devCounts,
    chipsNeeded,
    chipsDifference,
    chipsNeededSum,
    chipsDifferenceSum,
    hasEnoughChips,
    canBuyWithYellow,
    canBuyJokerCard,
  } = canBuyDevCard(devCard, player);
  // console.log(chipCounts);
  // console.log(devCounts);
  // console.log(chipsNeeded);
  // console.log(devCard.cost);
  // console.log(chipsDifference);
  // console.log(hasEnoughChips);
  // console.log(chipsDifferenceSum);
  // console.log(canBuyWithYellow);

  // هندل کلیک روی بک‌دراپ برای بستن کشو
  const handleBackdropClick = (e) => {
    if (e.target.id === "devcard-buy-backdrop") {
      onClose?.();
    }
  };

  const handleBuy = () => {
    setConfirmed(true);
    if (onConfirm) onConfirm(devCard);
    onClose?.();
    console.log("انتخاب کارت:", devCard);
    // onClose?.();

    setConfirmed(true);

    const payload = {
      data: { selectedCard: devCard, chipsNeeded, chipsDifference, reserved },
      type: "dev_card_built",
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    onClose?.();
  };

  const handleReserve = () => {
    setConfirmed(true);
    if (onConfirm) onConfirm(devCard);
    onClose?.();
    console.log("رزرو کارت:", devCard);
    // onClose?.();

    setConfirmed(true);

    const payload = {
      data: { reservedCard: devCard },
      type: "dev_card_reserved",
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    onClose?.();
  };

  return (
    <div
      id="devcard-buy-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={handleBackdropClick}
    >
      <div
        className="backdrop-blur-md bg-white/60 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center animate-fadeInChipDrawer relative mx-4"
        style={{ boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن */}
        <button
          className="absolute left-3 top-3 text-2xl text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-2 font-bold text-lg text-blue-800">
          خرید کارت توسعه
        </div>
        {/* نمایش کارت انتخاب شده */}
        <div className="flex flex-row-reverse gap-4 mb-2">
          <DevCard {...devCard} className="w-20 h-32" />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          {/* چیپ‌های بازیکن */}
          <div className="flex flex-row-reverse gap-2 items-center">
            <span className="text-xs text-gray-500 ml-2">چیپ‌های بازیکن:</span>
            {COLORS.map((color) => (
              <Chip
                key={color}
                color={color}
                quantity={chipCounts[color] || 0}
                className="w-8 h-8 sm:w-10 sm:h-10 text-base"
              />
            ))}
          </div>
          {/* devCards بازیکن */}
          <div className="flex flex-row-reverse gap-2 items-center">
            <span className="text-xs text-gray-500 ml-2">کارت‌های توسعه:</span>
            {COLORS_DEV.map((color) => (
              <div
                key={color}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center border-2"
                style={{
                  background:
                    color === "white"
                      ? "#f3f4f6"
                      : color === "black"
                      ? "#222"
                      : color,
                  borderColor:
                    color === "white"
                      ? "#d1d5db"
                      : color === "black"
                      ? "#444"
                      : color,
                  color: color === "white" ? "#222" : "#fff",
                }}
              >
                <span className="font-bold">{devCounts[color] || 0}</span>
              </div>
            ))}
          </div>
          {/* چیپ مورد نیاز برای خرید */}
          <div className="flex flex-row-reverse gap-2 items-center">
            <span className="text-xs text-gray-500 ml-2">چیپ مورد نیاز:</span>
            <span>{"  "}</span>
            {COLORS.map((color) => (
              <Chip
                key={color}
                color={color}
                quantity={chipsNeeded[color] || 0}
                className="w-8 h-8 sm:w-10 sm:h-10 text-base opacity-70"
              />
            ))}
          </div>
          {/* هزینه */}
          <div className="flex flex-row-reverse gap-2 items-center">
            <span className="text-xs text-gray-500 ml-2">هزینه خرید</span>
            <span>{""}</span>
            <span>{""}</span>
            <span> </span>
            {COLORS.map((color) => (
              <Chip
                key={color}
                color={color}
                quantity={devCard.cost[color] || 0}
                className="w-8 h-8 sm:w-10 sm:h-10 text-base opacity-70"
              />
            ))}
          </div>
          {/* هزینه */}
          <div className="flex flex-row-reverse gap-2 items-center">
            <span className="text-xs text-gray-500 ml-2">میزان مورد نیاز</span>
            <span>{""}</span>
            {COLORS.map((color) => (
              <Chip
                key={color}
                color={color}
                quantity={chipsDifference[color] || 0}
                className="w-8 h-8 sm:w-10 sm:h-10 text-base opacity-70"
              />
            ))}
          </div>
        </div>
        {/* دکمه خرید */}
        {devCard.color !== "unknown" && (
          <HoldToConfirmButton
            onConfirm={handleBuy}
            label={
              hasEnoughChips || canBuyWithYellow
                ? "خرید کارت"
                : "سنگ مورد نیاز برای خرید ندارید"
            }
            // disabled={!hasEnoughChips || !canBuyWithYellow || confirmed}
            disabled={
              ((devCard.color === "joker" && canBuyJokerCard) ||
                devCard.color !== "joker") &&
              hasEnoughChips
                ? false
                : !canBuyWithYellow || confirmed
            }
          />
          // ((color === "joker" && canBuyJokerCard) || color !== "joker") &&
        )}
        {/* دکمه رزرو */}
        {!reserved && (
          <HoldToConfirmButton
            onConfirm={handleReserve}
            label={"رزرو کارت"}
            disabled={
              confirmed ||
              player.reservedCards.length >= 3 ||
              !gameState.chipBoard.some((chip) => chip.value === "yellow")
            }
          />
        )}
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
