import React, { useState } from "react";
import Chip from "./Chip";
import DevCard from "./DevCard";
import NobleTileCard from "./NobleTileCard";

const COLORS = ["white", "blue", "green", "red", "black", "yellow"];

const COLOR_LABELS_FA = {
  white: "سفید",
  blue: "آبی",
  red: "قرمز",
  green: "سبز",
  black: "مشکی",
};
const MAX_STACK = 6; // حداکثر تعداد کارت زیرین که نمایش داده می‌شود

export default function PlayerInfoPanel({
  player,
  turn,
  myIndex,
  currentPhase,
  setDevCardDrawer,
}) {
  const [expandedColor, setExpandedColor] = useState(null);
  const [closingColor, setClosingColor] = useState(null);
  console.log(turn);
  console.log(myIndex);
  console.log(currentPhase);

  if (!player) return null;

  // گروه‌بندی کارت‌های توسعه بر اساس رنگ
  const devCardsByColor = {};
  COLORS.forEach((color) => (devCardsByColor[color] = []));
  (player.devCards || []).forEach((card) => {
    if (devCardsByColor[card.color]) devCardsByColor[card.color].push(card);
  });

  // چیپ‌ها را به صورت آبجکت {color: quantity} تبدیل کن
  const chipsByColor = {};
  COLORS.forEach((color) => (chipsByColor[color] = 0));
  (player.chips || []).forEach((chip) => {
    if (chip.color && typeof chip.quantity === "number")
      chipsByColor[chip.color] = chip.quantity;
  });

  // هندل کلیک روی کارت برای باز و بسته شدن با انیمیشن
  const handleDevCardClick = (color) => {
    if (expandedColor === color) {
      setClosingColor(color);
      setTimeout(() => {
        setExpandedColor(null);
        setClosingColor(null);
      }, 250);
    } else {
      setExpandedColor(color);
      setClosingColor(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center font-vazir">
      {/* شماره صندلی و نام */}
      <div className="flex flex-row-reverse items-center gap-2 mb-2">
        <span className="font-bold text-lg text-blue-700">{player.name}</span>
        <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-bold">
          صندلی {player.seat + 1}
        </span>
      </div>

      {/* امتیاز */}
      <div className="mb-2 text-yellow-700 font-extrabold text-xl">
        امتیاز: {player.prestigePoints}
      </div>

      {/* کارت‌های نوبل */}
      {player.nobleTilesOwned && player.nobleTilesOwned.length > 0 ? (
        <div className="flex flex-row-reverse gap-2 mb-2">
          {player.nobleTilesOwned.map((noble, idx) => (
            <NobleTileCard
              key={idx}
              cost={noble.cost}
              prestigePoints={noble.prestigePoints}
              className="w-14 h-20 sm:w-20 sm:h-28"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-row-reverse gap-2 mb-2">
          <div className="w-14 h-20 sm:w-20 sm:h-28 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs">
            نوبل
          </div>
        </div>
      )}

      {/* کارت‌های رزرو شده */}
      <div className="flex flex-row-reverse gap-2 w-full justify-center mb-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="w-14 h-24 sm:w-20 sm:h-32 flex items-center justify-center"
          >
            {player.reservedCards && player.reservedCards[idx] ? (
              <DevCard
                {...player.reservedCards[idx]}
                player={player}
                onClick={() =>
                  setDevCardDrawer({
                    open: true,
                    devCard: player.reservedCards[idx],
                    reserved: true,
                  })
                }
                disabled={
                  turn !== myIndex ||
                  turn !== player.seat ||
                  currentPhase === "noble_phase"
                }
                className="w-14 h-24 sm:w-20 sm:h-32 opacity-90"
              />
            ) : (
              <div className="w-14 h-24 sm:w-20 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                رزرو
              </div>
            )}
          </div>
        ))}
      </div>

      {/* نمایش همه کارت‌های یک رنگ در حالت باز شده با انیمیشن باز و بسته */}
      {(expandedColor || closingColor) &&
        devCardsByColor[expandedColor || closingColor].length > 0 && (
          <div
            className={`w-full flex flex-col-reverse items-center mb-3 ${
              closingColor
                ? "animate-fadeOutDevCards"
                : "animate-fadeInDevCards"
            }`}
          >
            {Array.from({
              length: Math.ceil(
                devCardsByColor[expandedColor || closingColor].length / 5
              ),
            }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="flex flex-row-reverse gap-2 justify-center mb-2"
              >
                {devCardsByColor[expandedColor || closingColor]
                  .slice(rowIdx * 5, rowIdx * 5 + 5)
                  .map((card, idx) => (
                    <DevCard
                      key={rowIdx * 5 + idx}
                      {...card}
                      className="w-14 h-24 sm:w-20 sm:h-32"
                    />
                  ))}
              </div>
            ))}
          </div>
        )}

      {/* کارت‌های توسعه (DevCards) */}
      <div className="flex flex-row-reverse gap-1 w-full justify-center mb-3">
        {["white", "blue", "red", "green", "black"].map((color) => {
          const cards = devCardsByColor[color];
          const lastCard = cards[cards.length - 1];
          const stackCount = Math.min(
            cards.length <= 1 ? 0 : cards.length - 1,
            MAX_STACK
          );

          return (
            <div
              key={color}
              className="flex flex-col items-center min-w-[56px] relative"
            >
              {/* تعداد کارت */}
              <span className="text-xs mb-1 text-gray-600 font-bold">
                {cards.length}
              </span>
              {/* استک کارت‌های زیرین */}
              <div className="relative">
                {[...Array(stackCount)].map((_, idx) => (
                  <div
                    key={idx}
                    className="absolute left-0 right-0 mb-1 mx-auto"
                    style={{
                      bottom: -idx * 2, // فاصله هر کارت زیرین
                      zIndex: idx,
                      filter: "brightness(0.92)",
                      opacity: 0.7 - idx * 0.08,
                    }}
                  >
                    <DevCard
                      color={color}
                      disabled
                      className="w-14 h-24 sm:w-20 sm:h-32 border border-gray-300"
                    />
                  </div>
                ))}
                {/* فقط آخرین کارت نمایش داده شود */}
                {lastCard ? (
                  <button
                    className="focus:outline-none relative z-10"
                    onClick={() => handleDevCardClick(color)}
                    tabIndex={0}
                  >
                    <DevCard
                      {...lastCard}
                      className={`w-14 h-24 sm:w-20 sm:h-32 transition-all duration-200 
                      `}
                      //  ${
                      //   expandedColor === color ? "ring-2 ring-yellow-400" : ""
                      // }
                    />
                  </button>
                ) : (
                  <div className="w-14 h-24 sm:w-20 sm:h-32 flex items-center justify-center text-gray-400 text-xs border border-dashed border-gray-200 rounded-lg">
                    {COLOR_LABELS_FA[color]}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* چیپ‌ها */}
      <div className="flex flex-row-reverse gap-2 w-full justify-center mb-2">
        {["white", "blue", "red", "green", "black", "yellow"].map((color) => (
          <Chip
            key={color}
            color={color}
            quantity={chipsByColor[color] ?? 0}
            className="w-8 h-8"
          />
        ))}
      </div>
      <style>{`
        .animate-fadeInDevCards {
          animation: fadeInDevCards 0.25s;
        }
        .animate-fadeOutDevCards {
          animation: fadeOutDevCards 0.25s;
        }
        @keyframes fadeInDevCards {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
        @keyframes fadeOutDevCards {
          from { opacity: 1; transform: scale(1);}
          to { opacity: 0; transform: scale(0.95);}
        }
      `}</style>
    </div>
  );
}
