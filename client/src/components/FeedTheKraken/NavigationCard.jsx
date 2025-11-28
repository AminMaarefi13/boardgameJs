import React from "react";

/**
 * کارت مسیر با پشتیبانی از ترکیب type و color
 * type: "drunk" | "mermaid" | "telescope" | "armed" | "disarmed" | "cult_uprising"
 * color: "red" | "blue" | "yellow"
 */

const BASE_META = {
  red: {
    bg: "bg-gradient-to-br from-red-400 to-red-700",
    border: "border-red-600",
    text: "text-red-50",
    colorLabel: "قرمز",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-400 to-blue-700",
    border: "border-blue-600",
    text: "text-blue-50",
    colorLabel: "آبی",
  },
  yellow: {
    bg: "bg-gradient-to-br from-yellow-300 to-yellow-500",
    border: "border-yellow-400",
    text: "text-yellow-900",
    colorLabel: "زرد",
  },
};

const TYPE_META = {
  drunk: {
    icon: "🍺",
    label: `مست`,
  },
  mermaid: {
    icon: "🧜‍♀️",
    label: "پری دریایی",
  },
  telescope: {
    icon: "🔭",
    label: "تلسکوپ",
  },
  armed: {
    icon: "🔫",
    label: "تفنگ + 1",
  },
  disarmed: {
    icon: "🛑",
    label: "تفنگ - 1",
  },
  cult_uprising: {
    icon: "🔮",
    label: "مراسم فرقه‌",
  },
};

export default function NavigationCard({
  type,
  color,
  selected = false,
  onClick,
  disabled = false,
  className = "",
  children,
}) {
  let meta = {
    type: TYPE_META[type],
    label: "کارت مسیر",
    color: BASE_META[color],
  };

  return (
    <div
      className={`
        relative w-24 h-36 rounded-xl flex flex-col justify-center items-center
        font-vazir font-bold text-center select-none shadow-inner transition-all duration-200
        ${meta.color.bg} ${meta.color.border} ${meta.color.text}
        ${
          selected
            ? "ring-4 ring-blue-400 scale-110 shadow-2xl"
            : "border-2 hover:scale-105"
        }
        ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : 0}
      style={{
        boxShadow: selected
          ? "0 0 16px 4px rgba(37,99,235,0.25)"
          : "0 2px 8px 0 rgba(0,0,0,0.10)",
      }}
    >
      <span className="text-2xl mb-2">{meta.type.icon}</span>
      <span className="text-lg md:text-xl">{meta.type.label}</span>
      {children}
      {selected && (
        <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full shadow font-bold">
          انتخاب شده
        </span>
      )}
    </div>
  );
}
// import React from "react";

// /**
//  * کارت مسیر مدرن و جذاب برای نمایش در پنل‌های انتخاب و نمایش کارت مسیر
//  * props:
//  * - type: نوع کارت (string: "blue" | "red" | "yellow")
//  * - color: رنگ کارت (red | blue | yellow)
//  * - selected: آیا کارت انتخاب شده است؟
//  * - onClick: تابع کلیک
//  * - disabled: غیرفعال بودن کارت
//  * - className: کلاس سفارشی
//  * - children: محتوای اضافی (اختیاری)
//  */

// const CARD_META = {
//   blue: {
//     label: "مسیر آبی",
//     icon: "🌊",
//     bg: "bg-gradient-to-br from-blue-400 to-blue-700",
//     border: "border-blue-600",
//     text: "text-blue-50",
//   },
//   red: {
//     label: "مسیر قرمز",
//     icon: "🔥",
//     bg: "bg-gradient-to-br from-red-400 to-red-700",
//     border: "border-red-600",
//     text: "text-red-50",
//   },
//   yellow: {
//     label: "مسیر زرد",
//     icon: "🌟",
//     bg: "bg-gradient-to-br from-yellow-300 to-yellow-500",
//     border: "border-yellow-400",
//     text: "text-yellow-900",
//   },
// };

// export default function NavigationCard({
//   type,
//   color,
//   selected = false,
//   onClick,
//   disabled = false,
//   className = "",
//   children,
// }) {
//   const meta = CARD_META[color];

//   return (
//     <div
//       className={`
//         relative w-24 h-36 rounded-xl flex flex-col justify-center items-center
//         font-vazir font-bold text-center select-none shadow-inner transition-all duration-200
//         ${meta.bg} ${meta.border} ${meta.text}
//         ${
//           selected
//             ? "ring-4 ring-blue-400 scale-110 shadow-2xl"
//             : "border-2 hover:scale-105"
//         }
//         ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}
//         ${className}
//       `}
//       onClick={disabled ? undefined : onClick}
//       tabIndex={disabled ? -1 : 0}
//       style={{
//         boxShadow: selected
//           ? "0 0 16px 4px rgba(37,99,235,0.25)"
//           : "0 2px 8px 0 rgba(0,0,0,0.10)",
//       }}
//     >
//       <span className="text-2xl mb-2">{meta.icon}</span>
//       <span className="text-lg md:text-xl">{type}</span>
//       {children}
//       {selected && (
//         <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full shadow font-bold">
//           انتخاب شده
//         </span>
//       )}
//     </div>
//   );
// }
// // import React from "react";

// // /**
// //  * کارت مسیر مدرن و جذاب برای نمایش در پنل‌های انتخاب و نمایش کارت مسیر
// //  * props:
// //  * - type: نوع کارت (string)
// //  * - color: رنگ کارت (red | blue | yellow)
// //  * - selected: آیا کارت انتخاب شده است؟
// //  * - onClick: تابع کلیک
// //  * - disabled: غیرفعال بودن کارت
// //  * - className: کلاس سفارشی
// //  * - children: محتوای اضافی (اختیاری)
// //  */
// // export default function NavigationCard({
// //   type,
// //   color,
// //   selected = false,
// //   onClick,
// //   disabled = false,
// //   className = "",
// //   children,
// // }) {
// //   // رنگ پس‌زمینه بر اساس نوع کارت
// //   const bgColor =
// //     color === "red"
// //       ? "bg-gradient-to-br from-red-500 to-red-700"
// //       : color === "blue"
// //       ? "bg-gradient-to-br from-blue-500 to-blue-700"
// //       : "bg-gradient-to-br from-yellow-400 to-yellow-600";

// //   // رنگ border بر اساس انتخاب
// //   const borderColor = selected
// //     ? "border-4 border-blue-600"
// //     : "border-2 border-gray-300";

// //   // افکت انتخاب
// //   const scale = selected ? "scale-110 shadow-2xl" : "hover:scale-105";

// //   return (
// //     <div
// //       className={`relative w-24 h-36 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-center items-center shadow-inner font-vazir text-white font-bold text-center select-none ${bgColor} ${borderColor} ${scale} ${className} ${
// //         disabled ? "opacity-50 pointer-events-none" : ""
// //       }`}
// //       onClick={disabled ? undefined : onClick}
// //       tabIndex={disabled ? -1 : 0}
// //       style={{
// //         boxShadow: selected
// //           ? "0 0 16px 4px rgba(37,99,235,0.25)"
// //           : "0 2px 8px 0 rgba(0,0,0,0.10)",
// //       }}
// //     >
// //       <span className="text-xs mb-1 opacity-80">کارت مسیر</span>
// //       <span className="text-lg md:text-xl">{type}</span>
// //       {children}
// //       {selected && (
// //         <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full shadow font-bold">
// //           انتخاب شده
// //         </span>
// //       )}
// //     </div>
// //   );
// // }
