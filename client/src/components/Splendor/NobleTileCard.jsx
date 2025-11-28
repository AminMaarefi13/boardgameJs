import React from "react";
import { canBuyNobleCard } from "./canBuyNobleCard";
import CardAnimatedBorder from "./CardAnimatedBorder";

/**
 * کارت نوبل برای Splendor
 * props:
 * - cost: { white, blue, green, red, black } (اختیاری)
 * - prestigePoints: عدد امتیاز
 * - selected, onClick, disabled, className: مشابه سایر کارت‌ها
 */
const COLOR_META = {
  white: {
    bg: "bg-gray-200",
    border: "border-gray-400",
    text: "text-gray-700",
    label: "سفید",
  },
  blue: {
    bg: "bg-blue-300",
    border: "border-blue-500",
    text: "text-blue-900",
    label: "آبی",
  },
  green: {
    bg: "bg-green-300",
    border: "border-green-500",
    text: "text-green-900",
    label: "سبز",
  },
  red: {
    bg: "bg-red-300",
    border: "border-red-500",
    text: "text-red-900",
    label: "قرمز",
  },
  black: {
    bg: "bg-black",
    border: "border-gray-700",
    text: "text-white",
    label: "مشکی",
  },
};

export default function NobleTileCard({
  cost = {},
  key,
  prestigePoints = 0,
  selected = false,
  onClick,
  disabled = false,
  className = "",
  player,
  children,
  log,
}) {
  console.log("key", key);
  const nobleCard = { cost, prestigePoints };
  const { canBuyNobleCardBoolean } = canBuyNobleCard(nobleCard, player);
  // فقط رنگ‌هایی که در cost وجود دارند
  const costColors = Object.keys(cost);
  // هزینه‌ها را از پایین به بالا قرار بده
  const costColorsBottomUp = [...costColors].reverse();

  // اگر دو تا هزینه بود، از پایین کارت شروع می‌شود و یکی فاصله بالا می‌ماند
  // اگر سه تا هزینه بود، هر سه از پایین به بالا با فاصله مساوی قرار می‌گیرند

  // اندازه کارت کوچک برای موبایل و مناسب برای دسکتاپ
  // هزینه‌ها را با absolute و bottom/right قرار می‌دهیم
  return (
    <div
      className={`
        relative w-14 h-20 sm:w-20 sm:h-28 rounded-lg flex flex-col justify-between items-stretch
        font-vazir font-bold text-center select-none shadow-inner transition-all duration-200
        bg-gradient-to-br from-gray-100 to-gray-300 border-2 border-gray-400 text-gray-800
        ${
          selected
            ? "ring-4 ring-yellow-400 scale-110 shadow-2xl"
            : "hover:scale-105"
        }
        ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : 0}
      style={{
        boxShadow: selected
          ? "0 0 16px 4px rgba(251,191,36,0.25)"
          : "0 2px 8px 0 rgba(0,0,0,0.10)",
        // direction: "rtl",
      }}
    >
      {/* امتیاز بالا سمت چپ */}
      {prestigePoints > 0 && (
        <span className="absolute top-1 left-1 text-lg pt-0.5 sm:text-xl font-bold text-yellow-300 select-none drop-shadow bg-yellow-600 rounded-full w-5 h-5 flex items-center justify-center">
          {prestigePoints}
        </span>
      )}
      {/* هزینه‌ها از پایین سمت راست به بالا */}
      <div className="absolute right-1 bottom-1 flex flex-col-reverse items-center gap-1 z-10 h-[100%] justify-start w-fit">
        {costColorsBottomUp.map((color) => (
          <div
            key={color}
            className={`flex items-center justify-center w-5 h-5 rounded px-1 border text-xs ${COLOR_META[color]?.bg} ${COLOR_META[color]?.border} ${COLOR_META[color]?.text} shadow`}
          >
            <span className="font-bold">{cost[color]}</span>
          </div>
        ))}
      </div>
      {/* آیکون یا تصویر نوبل (اختیاری) */}
      <div className="flex-1 flex flex-col justify-end items-center pb-2">
        {/* <span className="text-2xl">👑</span> */}
      </div>
      {children}
      {selected && (
        <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded-full shadow font-bold">
          انتخاب شده
        </span>
      )}
      {/* هاله و نوار چرخان */}
      {!log && canBuyNobleCardBoolean && (
        <span
          className={`
                  pointer-events-none absolute -inset-0  rounded-xl border-3
                  ${canBuyNobleCardBoolean && "border-white"}
                  z-20
                `}
          style={{
            boxShadow: canBuyNobleCardBoolean && "0 0 16px 1px #f18",
          }}
        ></span>
      )}
      {!log && canBuyNobleCardBoolean && (
        <CardAnimatedBorder
          color={canBuyNobleCardBoolean && "#f18"}
          glow={true}
          width={55} // یا عرض کارتت
          height={80} // یا ارتفاع کارتت
          borderRadius={12}
          strokeWidth={1.5}
          duration={2.5}
        />
      )}
    </div>
  );
}
