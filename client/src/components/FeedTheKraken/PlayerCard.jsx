import React, { useState } from "react";
import { cn } from "../../utils/cn";

export default function PlayerCard({
  player,
  isMe,
  isCaptain,
  isFirstOfficer,
  isNavigator,
  knownRole,
}) {
  const [showGuns, setShowGuns] = useState(false);
  const [showResume, setShowResume] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-2xl border shadow bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-200",
        isMe && "border-green-600 bg-green-50 shadow-lg scale-[1.03]"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-extrabold text-lg text-gray-800">
          {player.name}
        </span>
        {isMe && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-400 ml-2 shadow">
            من
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-300 shadow-sm">
          صندلی #{player.seat + 1}
        </span>

        {/* تگ برای تعداد تفنگ */}
        <button
          type="button"
          onClick={() => setShowGuns((v) => !v)}
          className={cn(
            "px-2 py-0.5 rounded-full border shadow-sm flex items-center gap-1 bg-orange-100 text-orange-700 border-orange-300 transition hover:bg-orange-200 focus:outline-none",
            player.guns === 0 && "opacity-60"
          )}
          tabIndex={0}
        >
          <span>🔫</span>
          <span>{player.guns}</span>
        </button>
        {/* تگ برای تعداد کارت رزومه */}
        <button
          type="button"
          onClick={() => setShowResume((v) => !v)}
          className={cn(
            "px-2 py-0.5 rounded-full border shadow-sm flex items-center gap-1 bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 transition hover:bg-fuchsia-200 focus:outline-none",
            player.resume.length === 0 && "opacity-60"
          )}
          tabIndex={0}
        >
          <span>🃏</span>
          <span>{player.resume.length}</span>
        </button>
        {isCaptain && (
          <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-400 shadow-sm">
            🎖️ کاپیتان
          </span>
        )}
        {isFirstOfficer && (
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-400 shadow-sm">
            👨‍✈️ افسر اول
          </span>
        )}
        {isNavigator && (
          <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-400 shadow-sm">
            🧭 کشتیران
          </span>
        )}
        {knownRole && (
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-400 shadow-sm">
            🎭 {knownRole}
          </span>
        )}
        {player.isNotARole && (
          <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 border border-gray-300 shadow-sm">
            نیست {player.isNotARole}
          </span>
        )}
        {player.eliminated && (
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-400 shadow-sm">
            ❌ حذف شده
          </span>
        )}
        {player.tongueOff && (
          <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-400 shadow-sm">
            👅 زبان بریده
          </span>
        )}
      </div>
      {/* کشوی تفنگ */}
      {showGuns && (
        <div className="mt-1 flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-orange-50 border border-orange-200 shadow-inner animate-fade-in">
          <span className="text-orange-600 font-bold text-xs mb-1">
            تفنگ‌ها
          </span>
          {player.guns > 0 ? (
            <span className="text-lg tracking-tight">
              {Array(player.guns).fill("🔫").join("")}
            </span>
          ) : (
            <span className="text-gray-400">هیچ تفنگی ندارد</span>
          )}
        </div>
      )}
      {/* کشوی کارت رزومه */}
      {showResume && (
        <div className="mt-1 flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-fuchsia-50 border border-fuchsia-200 shadow-inner animate-fade-in">
          <span className="text-fuchsia-600 font-bold text-xs mb-1">
            کارت‌های رزومه
          </span>
          {player.resume.length > 0 ? (
            <span className="text-lg tracking-tight">
              {Array(player.resume.length).fill("🃏").join("")}
            </span>
          ) : (
            <span className="text-gray-400">هیچ کارتی ندارد</span>
          )}
        </div>
      )}
    </div>
  );
}
// import { cn } from "../../utils/cn";

// export default function PlayerCard({
//   player,
//   isMe,
//   isCaptain,
//   isFirstOfficer,
//   isNavigator,
//   knownRole,
// }) {
//   return (
//     <div
//       className={cn(
//         "flex flex-col gap-3 p-4 rounded-2xl border shadow bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-200",
//         isMe && "border-green-600 bg-green-50 shadow-lg scale-[1.03]"
//       )}
//     >
//       <div className="flex items-center justify-between mb-1">
//         <span className="font-extrabold text-lg text-gray-800">
//           {player.name}
//         </span>
//         {isMe && (
//           <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-400 ml-2 shadow">
//             من
//           </span>
//         )}
//       </div>
//       <div className="flex flex-wrap gap-2 text-xs font-medium">
//         <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-300 shadow-sm">
//           صندلی #{player.seat + 1}
//         </span>
//         {isCaptain && (
//           <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-400 shadow-sm">
//             🎖️ کاپیتان
//           </span>
//         )}
//         {isFirstOfficer && (
//           <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-400 shadow-sm">
//             👨‍✈️ افسر اول
//           </span>
//         )}
//         {isNavigator && (
//           <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-400 shadow-sm">
//             🧭 کشتیران
//           </span>
//         )}
//         {knownRole && (
//           <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-400 shadow-sm">
//             🎭 {knownRole}
//           </span>
//         )}
//         {player.isNotARole && (
//           <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 border border-gray-300 shadow-sm">
//             نیست {player.isNotARole}
//           </span>
//         )}
//         {player.eliminated && (
//           <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-400 shadow-sm">
//             ❌ حذف شده
//           </span>
//         )}
//         {player.tongueOff && (
//           <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-400 shadow-sm">
//             👅 زبان بریده
//           </span>
//         )}
//       </div>
//       <div className="flex gap-2 mt-2">
//         <div className="flex-1 flex flex-col items-center justify-center px-2 py-2 rounded-xl bg-orange-50 border border-orange-200 min-h-[40px] shadow-inner">
//           <span className="text-orange-600 font-bold text-xs mb-1">تفنگ</span>
//           {player.guns > 0 ? (
//             <span className="text-lg tracking-tight">
//               {Array(player.guns).fill("🔫").join("")}
//             </span>
//           ) : (
//             <span className="text-gray-400">—</span>
//           )}
//         </div>
//         <div className="flex-1 flex flex-col items-center justify-center px-2 py-2 rounded-xl bg-fuchsia-50 border border-fuchsia-200 min-h-[40px] shadow-inner">
//           <span className="text-fuchsia-600 font-bold text-xs mb-1">
//             کارت رزومه
//           </span>
//           {player.resume.length > 0 ? (
//             <span className="text-lg tracking-tight">
//               {Array(player.resume.length).fill("🃏").join("")}
//             </span>
//           ) : (
//             <span className="text-gray-400">—</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// // import { cn } from "../../utils/cn";

// // export default function PlayerCard({
// //   player,
// //   isMe,
// //   isCaptain,
// //   isFirstOfficer,
// //   isNavigator,
// //   knownRole,
// // }) {
// //   return (
// //     <div
// //       className={cn(
// //         "flex flex-col gap-2 p-3 rounded-xl border shadow-sm bg-gray-50 transition",
// //         isMe && "border-green-600 bg-green-50 shadow-md"
// //       )}
// //     >
// //       <div className="flex items-center justify-between">
// //         <span className="font-bold text-lg text-gray-800">{player.name}</span>
// //         {isMe && (
// //           <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-400 ml-2">
// //             من
// //           </span>
// //         )}
// //       </div>
// //       <div className="flex flex-wrap gap-2 text-sm">
// //         <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-300">
// //           صندلی #{player.seat + 1}
// //         </span>
// //         {isCaptain && (
// //           <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-400">
// //             🎖️ کاپیتان
// //           </span>
// //         )}
// //         {isFirstOfficer && (
// //           <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 border border-indigo-400">
// //             👨‍✈️ افسر اول
// //           </span>
// //         )}
// //         {isNavigator && (
// //           <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-700 border border-cyan-400">
// //             🧭 کشتیران
// //           </span>
// //         )}
// //         {knownRole && (
// //           <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-400">
// //             🎭 {knownRole}
// //           </span>
// //         )}
// //         {player.isNotARole && (
// //           <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 border border-gray-300">
// //             نیست {player.isNotARole}
// //           </span>
// //         )}
// //         {player.eliminated && (
// //           <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-400">
// //             ❌ حذف شده
// //           </span>
// //         )}
// //         {player.tongueOff && (
// //           <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-700 border border-pink-400">
// //             👅 زبان بریده
// //           </span>
// //         )}
// //       </div>
// //       <div className="flex gap-2 mt-1">
// //         <div className="flex-1 flex items-center gap-1 px-2 py-1 rounded bg-orange-50 border border-orange-200 min-h-[32px]">
// //           <span className="text-orange-600 font-bold">تفنگ:</span>
// //           {player.guns > 0 ? (
// //             <span className="text-lg">
// //               {Array(player.guns).fill("🔫").join("")}
// //             </span>
// //           ) : (
// //             <span className="text-gray-400">—</span>
// //           )}
// //         </div>
// //         <div className="flex-1 flex items-center gap-1 px-2 py-1 rounded bg-fuchsia-50 border border-fuchsia-200 min-h-[32px]">
// //           <span className="text-fuchsia-600 font-bold">کارت رزومه:</span>
// //           {player.resume.length > 0 ? (
// //             <span className="text-lg">
// //               {Array(player.resume.length).fill("🃏").join("")}
// //             </span>
// //           ) : (
// //             <span className="text-gray-400">—</span>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
