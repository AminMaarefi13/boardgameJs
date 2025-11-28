import React from "react";

export default function SelectablePlayerCard({
  player,
  selected,
  disabled,
  tag,
  onClick,
  className = "",
  children,
}) {
  return (
    <div
      className={
        `flex flex-col gap-2 p-4 rounded-2xl border shadow bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-200 text-right font-vazir
        ${
          selected
            ? "ring-4 ring-purple-400 border-purple-300 scale-[1.03]"
            : "border-gray-200"
        }
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:scale-105"
        }
        ` + className
      }
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : 0}
      dir="rtl"
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-extrabold text-lg text-gray-800 truncate">
          {player.name}
        </span>
        {selected && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-400 ml-2 shadow">
            انتخاب شده
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-300 shadow-sm">
          صندلی #{player.seat + 1}
        </span>
        {tag && (
          <span
            className="px-2 py-0.5 rounded-full border text-xs font-bold shadow-sm"
            style={tag.style}
          >
            {tag.text}
          </span>
        )}
        {disabled && player.disabledReason && (
          <span className="px-2 py-0.5 rounded-full border border-red-400 bg-red-100 text-xs text-red-700 font-bold shadow-sm">
            {player.disabledReason}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
// import React from "react";

// export default function SelectablePlayerCard({
//   player,
//   selected,
//   disabled,
//   tag,
//   onClick,
//   className = "",
//   children,
// }) {
//   return (
//     <div
//       className={
//         `flex items-center justify-between gap-3 p-3 rounded-2xl border shadow-sm transition-all duration-200
//         bg-white
//         ${
//           selected
//             ? "ring-4 ring-purple-400 border-purple-300 scale-105"
//             : "border-gray-200"
//         }
//         ${
//           disabled
//             ? "opacity-50 cursor-not-allowed"
//             : "cursor-pointer hover:scale-105"
//         }
//         ` + className
//       }
//       onClick={disabled ? undefined : onClick}
//       tabIndex={disabled ? -1 : 0}
//       style={{ minWidth: 0 }}
//     >
//       <div className="flex flex-col items-end flex-1 min-w-0">
//         <span className="font-bold truncate">{player.name}</span>
//         <span className="text-xs text-gray-500 mt-0.5">
//           صندلی #{player.seat + 1}
//         </span>
//         {tag && (
//           <span
//             className="inline-block mt-2 px-2 py-0.5 rounded-full border text-xs font-bold shadow-sm"
//             style={tag.style}
//           >
//             {tag.text}
//             {selected && <span className="ml-2 text-purple-700">✓</span>}
//           </span>
//         )}
//         {disabled && player.disabledReason && (
//           <span className="inline-block mt-2 px-2 py-0.5 rounded-full border border-red-400 bg-red-100 text-xs text-red-700 font-bold shadow-sm">
//             {player.disabledReason}
//           </span>
//         )}
//         {children}
//       </div>
//     </div>
//   );
// }
