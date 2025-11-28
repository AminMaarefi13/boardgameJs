import React from "react";
import { socket } from "../../network/socket";
import { useAppContext } from "../../context/AppContext";

export default function ConsumeEnergyButton({ amount = 1 }) {
  const { setEnergy } = useAppContext();

  const handleClick = () => {
    socket.emit("consume_energy", { amount }, (data) => {
      if (typeof data.energy === "number") setEnergy(data.energy);
    });
  };

  return (
    <button
      onClick={handleClick}
      className="
        mt-2
        px-3 py-1
        rounded-lg
        bg-gradient-to-r from-red-400 to-red-600
        text-white
        font-bold
        shadow
        border-2 border-red-500
        hover:from-red-500 hover:to-red-700
        transition
        duration-200
        text-base
      "
    >
      🔻 کاهش انرژی
    </button>
  );
}
// import React from "react";
// import { socket } from "../../network/socket";
// import { useAppContext } from "../../context/AppContext";

// export default function ConsumeEnergyButton({ amount = 1 }) {
//   const { setEnergy } = useAppContext();

//   const handleClick = () => {
//     socket.emit("consume_energy", { amount }, (data) => {
//       if (typeof data.energy === "number") setEnergy(data.energy);
//     });
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="mt-2 px-4 py-2 rounded bg-red-100 text-red-700 font-bold border border-red-300 hover:bg-red-200 transition"
//     >
//       کاهش انرژی (تست)
//     </button>
//   );
// }
