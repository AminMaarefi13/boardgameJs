import React from "react";
import { cn } from "../../utils/cn";
import PlayerCard from "./PlayerCard";

export default function PlayersAndSecretInfoPanel({
  players,
  playerId,
  captainId,
  firstOfficerId,
  navigatorId,
  knownRoles = [],
  role,
  characterCard,
}) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 w-full"
      dir="rtl"
    >
      <div className="bg-white shadow rounded-md p-2 sm:p-4 w-full text-right">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">👥 بازیکنان</h2>
        <div className="grid gap-3">
          {[...players]
            .sort((a, b) => a.seat - b.seat)
            .map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                isMe={p.id === playerId}
                isCaptain={p.id === captainId}
                isFirstOfficer={p.id === firstOfficerId}
                isNavigator={p.id === navigatorId}
                knownRole={
                  knownRoles.find((k) => k.playerId === p.id)?.role || null
                }
              />
            ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 shadow rounded-2xl p-4 w-full text-right border border-indigo-200">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-indigo-700 flex items-center gap-2">
          <span>🕵️</span> اطلاعات مخفی شما
        </h2>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 shadow-inner">
            <span className="font-bold text-indigo-700">نقش من:</span>
            <span className="text-indigo-800 font-extrabold">{role}</span>
          </div>
          {characterCard && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-200 shadow-inner">
              <span className="font-bold text-yellow-700">کارت‌ شخصیت:</span>
              <span className="text-yellow-800 font-extrabold">
                {characterCard}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* <div className="bg-white shadow rounded-md p-2 sm:p-4 w-full text-right">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          🕵️ اطلاعات مخفی شما
        </h2>
        <p>
          <strong>نقش من:</strong>{" "}
          <span className="text-indigo-700">{role}</span>
        </p>
        {characterCard && (
          <p className="mt-2">
            <strong>کارت‌ شخصیت:</strong> {characterCard}
          </p>
        )}
      </div> */}
    </div>
  );
}
// import React from "react";
// import { cn } from "../../utils/cn";

// export default function PlayersAndSecretInfoPanel({
//   players,
//   playerId,
//   captainId,
//   firstOfficerId,
//   navigatorId,
//   knownRoles = [],
//   role,
//   characterCard,
// }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 w-full">
//       <div className="bg-white shadow rounded-md p-2 sm:p-4 w-full">
//         <h2 className="text-lg sm:text-xl font-semibold mb-2">👥 بازیکنان</h2>
//         <ul className="space-y-2">
//           {[...players]
//             .sort((a, b) => a.seat - b.seat)
//             .map((p) => (
//               <li
//                 key={p.id}
//                 className={cn(
//                   "p-2 rounded-md border",
//                   p.id === playerId && "border-green-600 bg-green-50"
//                 )}
//               >
//                 <div className="font-medium">{p.name}</div>
//                 <div className="text-sm text-gray-600">
//                   صندلی #{p.seat + 1}
//                   {p.id === captainId && " | 🎖️ کاپیتان"}
//                   {p.id === firstOfficerId && " | 👨‍✈️ افسر اول"}
//                   {p.id === navigatorId && " | 🧭 کشتیران"}
//                   {(() => {
//                     const known = knownRoles.find((k) => k.playerId === p.id);
//                     return known ? ` | 🎭 ${known.role}` : null;
//                   })()}
//                   {p.isNotARole && ` | نیست ${p.isNotARole}`}
//                   {p.guns > 0 && (
//                     <div className="inline ml-2 text-red-500">
//                       {Array(p.guns).fill("🔫").join("")}
//                     </div>
//                   )}
//                   {p.resume.length > 0 && (
//                     <div className="inline ml-2 text-red-500">
//                       {Array(p.resume.length).fill("🃏").join("")}
//                     </div>
//                   )}
//                   {p.eliminated && " | ❌ از بازی حذف شد."}
//                   {p.tongueOff && " | 👅 زبانش بریده شده"}
//                 </div>
//               </li>
//             ))}
//         </ul>
//       </div>

//       <div className="bg-white shadow rounded-md p-2 sm:p-4 w-full">
//         <h2 className="text-lg sm:text-xl font-semibold mb-2">
//           🕵️ اطلاعات مخفی شما
//         </h2>
//         <p>
//           <strong>نقش من:</strong>{" "}
//           <span className="text-indigo-700">{role}</span>
//         </p>
//         {characterCard && (
//           <p className="mt-2">
//             <strong>کارت‌ شخصیت:</strong> {characterCard}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
