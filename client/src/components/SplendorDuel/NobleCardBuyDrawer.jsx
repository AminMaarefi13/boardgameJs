import React, { useState } from "react";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import Chip from "./Chip";
import { socket } from "../../network/socket";
import { useAppContext } from "../../context/AppContext";
import NobleTileCard from "./NobleTileCard";
import { canBuyNobleCard } from "./canBuyNobleCard";

const COLORS = ["white", "blue", "red", "green", "black"];

export default function NobleCardBuyDrawer({
  open,
  onClose,
  nobleCard,
  onConfirm,
  player, // بازیکن جاری را به این کامپوننت پاس بده
}) {
  const [confirmed, setConfirmed] = useState(false);
  const { connectionState } = useAppContext();
  const { currentGameId } = connectionState;
  if (!open || !nobleCard) return null;

  // بررسی امکان خرید کارت
  // const { chipCounts, devCounts, chipsNeeded } = player
  //   ? canBuyDevCard(devCard, player)
  //   : false;
  console.log(nobleCard);
  console.log(player);
  const { canBuyNobleCardBoolean } = canBuyNobleCard(nobleCard, player);
  console.log(nobleCard.cost);

  // هندل کلیک روی بک‌دراپ برای بستن کشو
  const handleBackdropClick = (e) => {
    if (e.target.id === "devcard-buy-backdrop") {
      onClose?.();
    }
  };

  const handleBuy = () => {
    setConfirmed(true);
    if (onConfirm) onConfirm(nobleCard);
    onClose?.();
    console.log("انتخاب کارت نوبل:", nobleCard);
    // onClose?.();

    setConfirmed(true);

    const payload = {
      data: { selectedNobleCard: nobleCard },
      type: "noble_card_buy",
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    onClose?.();
  };

  return (
    <div
      id="devcard-buy-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={handleBackdropClick}
    >
      <div
        className="backdrop-blur-md bg-white/60 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center animate-fadeInChipDrawer relative mx-4"
        style={{ boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن */}
        <button
          className="absolute left-3 top-3 text-2xl text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-2 font-bold text-lg text-blue-800">
          خرید کارت نوبل
        </div>
        {/* نمایش کارت انتخاب شده */}
        <div className="flex flex-row-reverse gap-4 mb-6">
          <NobleTileCard {...nobleCard} className="w-20 h-32" />
        </div>

        {/* دکمه خرید */}
        <HoldToConfirmButton
          onConfirm={handleBuy}
          label={
            canBuyNobleCardBoolean
              ? "خرید کارت"
              : "کارت مورد نیاز برای خرید ندارید"
          }
          disabled={!canBuyNobleCardBoolean || confirmed}
        />
      </div>
      <style>{`
        .animate-fadeInChipDrawer {
          animation: fadeInChipDrawer 0.25s;
        }
        @keyframes fadeInChipDrawer {
          from { opacity: 0; transform: translateY(40px) scale(0.95);}
          to { opacity: 1; transform: translateY(0) scale(1);}
        }
      `}</style>
    </div>
  );
}
// import React, { useState } from "react";
// import DevCard from "./DevCard";
// import HoldToConfirmButton from "../../UI/HoldToConfirmButton";

// export default function DevCardBuyDrawer({
//   open,
//   onClose,
//   devCard, // آبجکت کارت انتخاب شده
//   onConfirm, // تابع خرید کارت
//   disabled = false, // آیا دکمه خرید غیرفعال باشد؟
// }) {
//   const [confirmed, setConfirmed] = useState(false);

//   if (!open || !devCard) return null;

//   // هندل کلیک روی بک‌دراپ برای بستن کشو
//   const handleBackdropClick = (e) => {
//     if (e.target.id === "devcard-buy-backdrop") {
//       onClose?.();
//     }
//   };

//   const handleBuy = () => {
//     setConfirmed(true);
//     if (onConfirm) onConfirm(devCard);
//     onClose?.();
//   };

//   return (
//     <div
//       id="devcard-buy-backdrop"
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
//       onClick={handleBackdropClick}
//     >
//       <div
//         className="backdrop-blur-md bg-white/60 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center animate-fadeInChipDrawer relative mx-4"
//         style={{ boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)" }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* دکمه بستن */}
//         <button
//           className="absolute left-3 top-3 text-2xl text-gray-400 hover:text-red-500"
//           onClick={onClose}
//         >
//           ×
//         </button>
//         <div className="mb-2 font-bold text-lg text-blue-800">
//           خرید کارت توسعه
//         </div>
//         {/* نمایش کارت انتخاب شده */}
//         <div className="flex flex-row-reverse gap-4 mb-6">
//           <DevCard {...devCard} className="w-20 h-32" />
//         </div>
//         {/* دکمه خرید */}
//         <HoldToConfirmButton
//           onConfirm={handleBuy}
//           label="خرید کارت"
//           disabled={disabled || confirmed}
//         />
//       </div>
//       <style>{`
//         .animate-fadeInChipDrawer {
//           animation: fadeInChipDrawer 0.25s;
//         }
//         @keyframes fadeInChipDrawer {
//           from { opacity: 0; transform: translateY(40px) scale(0.95);}
//           to { opacity: 1; transform: translateY(0) scale(1);}
//         }
//       `}</style>
//     </div>
//   );
// }
