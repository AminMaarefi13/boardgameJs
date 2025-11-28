import React from "react";

/**
 * کارت نقش شلاق با استایل شخصی‌سازی‌شده برای سه نوع کارت
 * props:
 * - type: نوع کارت (sailor | pirate | cultist)
 * - selected: آیا کارت انتخاب شده است؟
 * - onClick: تابع کلیک
 * - disabled: غیرفعال بودن کارت
 * - className: کلاس سفارشی
 */
const CARD_META = {
  sailor: {
    label: "ملوان",
    icon: "🚢",
    bg: "bg-gradient-to-br from-blue-200 to-blue-400",
    border: "border-blue-500",
    text: "text-blue-900",
  },
  pirate: {
    label: "دزد دریایی",
    icon: "🏴‍☠️",
    bg: "bg-gradient-to-br from-red-200 to-red-400",
    border: "border-red-500",
    text: "text-red-900",
  },
  cultist: {
    label: "فرقه‌گرا",
    icon: "🔮",
    bg: "bg-gradient-to-br from-purple-200 to-purple-400",
    border: "border-purple-500",
    text: "text-purple-900",
  },
};

export default function FloggingRoleCard({
  type,
  selected = false,
  onClick,
  disabled = false,
  className = "",
  children,
}) {
  const meta = CARD_META[type] || CARD_META.sailor;

  return (
    <div
      className={`
        relative w-28 h-40 rounded-xl flex flex-col justify-center items-center
        font-vazir font-bold text-center select-none shadow-inner transition-all duration-200
        ${meta.bg} ${meta.border} ${meta.text}
        ${
          selected
            ? "ring-4 ring-yellow-400 scale-110 shadow-2xl"
            : "border-2 hover:scale-105"
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
      <span className="text-3xl mb-2">{meta.icon}</span>
      <span className="text-base md:text-lg">{meta.label}</span>
      {children}
      {selected && (
        <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full shadow font-bold">
          انتخاب شده
        </span>
      )}
    </div>
  );
}
