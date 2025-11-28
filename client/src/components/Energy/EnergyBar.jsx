import React from "react";
import { useAppContext } from "../../context/AppContext";
import ConsumeEnergyButton from "./ConsumeEnergyButton";

export default function EnergyBar() {
  const { energy } = useAppContext();
  return (
    <div className="flex flex-col items-center justify-center gap-4 mb-4 w-full">
      <div className="flex items-center gap-4">
        <span className="font-bold text-indigo-700 text-lg">
          ⚡ {energy} / 10
        </span>
        <div className="relative w-40 h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300"
            style={{ width: `${(energy / 10) * 100}%` }}
          />
          <div className="absolute inset-0 border border-yellow-400 rounded-full pointer-events-none" />
        </div>
      </div>
      <ConsumeEnergyButton />
    </div>
  );
}
// import React from "react";
// import { useAppContext } from "../../context/AppContext";
// import ConsumeEnergyButton from "./ConsumeEnergyButton";

// export default function EnergyBar() {
//   const { energy } = useAppContext();
//   return (
//     <div className="flex items-center gap-4 mb-4">
//       <span className="font-bold text-indigo-700 text-lg">
//         ⚡ {energy} / 10
//       </span>
//       <div className="relative w-40 h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
//         <div
//           className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300"
//           style={{ width: `${(energy / 10) * 100}%` }}
//         />
//         <div className="absolute inset-0 border border-yellow-400 rounded-full pointer-events-none" />
//       </div>
//       <ConsumeEnergyButton />
//     </div>
//   );
// }
// // import React from "react";
// // import { useAppContext } from "../../context/AppContext";

// // export default function EnergyBar() {
// //   const { energy } = useAppContext();
// //   return (
// //     <div>
// //       <span>انرژی: {energy} / 10</span>
// //       <progress value={energy} max={10} style={{ width: 100 }} />
// //     </div>
// //   );
// // }
