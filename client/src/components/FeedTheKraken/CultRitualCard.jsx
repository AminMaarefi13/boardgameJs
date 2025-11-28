import React from "react";

/**
 * کارت مراسم فرقه‌ای با استایل شخصی‌سازی‌شده برای سه نوع کارت
 * props:
 * - type: نوع کارت (cult_conversion | cult_guns_stash | cult_cabin_search)
 * - selected: آیا کارت انتخاب شده است؟
 * - onClick: تابع کلیک
 * - disabled: غیرفعال بودن کارت
 * - className: کلاس سفارشی
 */
const CARD_META = {
  cult_conversion: {
    label: "تبدیل به فرقه",
    icon: "🔮",
    bg: "bg-gradient-to-br from-purple-200 to-purple-400",
    border: "border-purple-500",
    text: "text-purple-900",
  },
  cult_guns_stash: {
    label: "انبار اسلحه",
    icon: "🔫",
    bg: "bg-gradient-to-br from-yellow-200 to-yellow-400",
    border: "border-yellow-500",
    text: "text-yellow-900",
  },
  cult_cabin_search: {
    label: "جستجوی کابین",
    icon: "🔍",
    bg: "bg-gradient-to-br from-blue-200 to-blue-400",
    border: "border-blue-500",
    text: "text-blue-900",
  },
};

export default function CultRitualCard({
  type,
  selected = false,
  onClick,
  disabled = false,
  className = "",
  children,
}) {
  const meta = CARD_META[type] || CARD_META.cult_conversion;

  return (
    <div
      className={`
        relative w-28 h-40 rounded-xl flex flex-col justify-center items-center
        font-vazir font-bold text-center select-none shadow-inner transition-all duration-200
        ${meta.bg} ${meta.border} ${meta.text}
        ${
          selected
            ? "ring-4 ring-purple-500 scale-110 shadow-2xl"
            : "border-2 hover:scale-105"
        }
        ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : 0}
      style={{
        boxShadow: selected
          ? "0 0 16px 4px rgba(139,92,246,0.25)"
          : "0 2px 8px 0 rgba(0,0,0,0.10)",
      }}
    >
      <span className="text-3xl mb-2">{meta.icon}</span>
      <span className="text-base md:text-lg">{meta.label}</span>
      {children}
      {selected && (
        <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full shadow font-bold">
          انتخاب شده
        </span>
      )}
    </div>
  );
}
