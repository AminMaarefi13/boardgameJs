import React from "react";

const CHIP_META = {
  red: {
    bg: "bg-gradient-to-br from-red-400 to-red-700",
    border: "border-red-700",
    text: "text-white",
    ring: "ring-red-300",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-400 to-blue-700",
    border: "border-blue-700",
    text: "text-white",
    ring: "ring-blue-300",
  },
  green: {
    bg: "bg-gradient-to-br from-green-400 to-green-700",
    border: "border-green-700",
    text: "text-white",
    ring: "ring-green-300",
  },
  black: {
    bg: "bg-gradient-to-br from-gray-800 to-black",
    border: "border-gray-700",
    text: "text-white",
    ring: "ring-gray-100",
  },
  white: {
    bg: "bg-gradient-to-br from-gray-100 to-gray-300",
    border: "border-gray-400",
    text: "text-gray-700",
    ring: "ring-gray-200",
  },
  yellow: {
    bg: "bg-gradient-to-br from-yellow-200 to-yellow-400",
    border: "border-yellow-500",
    text: "text-yellow-900",
    ring: "ring-yellow-200",
  },
};

export default function Chip({
  color = "red",
  key,
  quantity = 0,
  selected = false,
  onClick,
  disabled = false,
  className = "",
  children,
}) {
  console.log("key", key);
  const meta = CHIP_META[color] || CHIP_META.red;

  return (
    <div
      className={`
        relative w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
        font-vazir font-extrabold text-xl select-none shadow-inner transition-all duration-200
        ${meta.bg} ${meta.border} ${meta.text} border-4
        ${
          selected
            ? `${meta.ring} ring-4 scale-110 shadow-2xl`
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
      }}
    >
      <span className="drop-shadow text-2xl">{quantity}</span>
      {children}
    </div>
  );
}
