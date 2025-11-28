import React, { useState } from "react";
import Chip from "./Chip";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { socket } from "../../network/socket";
import { useAppContext } from "../../context/AppContext";

const CHIP_COLORS = ["white", "blue", "red", "green", "black"];

export default function ChipSelectDrawer({
  open,
  onClose,
  availableChips,
  initialColor,
}) {
  console.log(availableChips);
  const { connectionState } = useAppContext();
  const { currentGameId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState(() => {
    const obj = {};
    CHIP_COLORS.forEach((color) => (obj[color] = 0));
    if (initialColor && CHIP_COLORS.includes(initialColor)) {
      obj[initialColor] = 1;
    }
    return obj;
  });

  // چیپ‌های موجود به صورت آبجکت
  const chipsByColor = {};
  CHIP_COLORS.forEach((color) => (chipsByColor[color] = 0));
  availableChips.forEach((chip) => {
    chipsByColor[chip.color] = chip.quantity;
  });

  // انتخاب چیپ
  const handleChipClick = (color) => {
    if (selected[color] === 2) return;
    if (selected[color] >= chipsByColor[color]) return;
    const total = CHIP_COLORS.reduce((sum, c) => sum + selected[c], 0);
    if (total >= 3 && selected[color] === 0) return;
    if (selected[color] === 1 && chipsByColor[color] > 3) {
      setSelected((prev) => {
        const obj = {};
        CHIP_COLORS.forEach((c) => (obj[c] = 0));
        obj[color] = 2;
        return obj;
      });
      return;
    }
    setSelected((prev) => ({
      ...prev,
      [color]: prev[color] + 1,
    }));
  };

  // حذف انتخاب با کلیک روی چیپ انتخاب‌شده
  const handleSelectedChipClick = (color) => {
    if (selected[color] > 0) {
      setSelected((prev) => ({
        ...prev,
        [color]: prev[color] - 1,
      }));
    }
  };

  // اعتبارسنجی انتخاب
  const isValid = (() => {
    const total = CHIP_COLORS.reduce((sum, c) => sum + selected[c], 0);
    const selectedColors = CHIP_COLORS.filter((c) => selected[c] > 0);
    if (
      total === 3 &&
      selectedColors.length === 3 &&
      selectedColors.every((c) => selected[c] === 1)
    ) {
      return true;
    }
    if (
      total === 2 &&
      selectedColors.length === 1 &&
      selected[selectedColors[0]] === 2 &&
      chipsByColor[selectedColors[0]] > 3
    ) {
      return true;
    }
    if (
      total === 2 &&
      selectedColors.length === 2 &&
      selectedColors.every((c) => selected[c] === 1)
    ) {
      return true;
    }
    if (
      total === 1 &&
      selectedColors.length === 1 &&
      selectedColors.every((c) => selected[c] === 1)
    ) {
      return true;
    }
    return false;
  })();

  const selectedList = CHIP_COLORS.filter((c) => selected[c] > 0).map((c) => ({
    color: c,
    quantity: selected[c],
  }));

  const handleConfirm = () => {
    console.log("انتخاب چیپ:", selectedList);
    // onClose?.();

    setConfirmed(true);

    const payload = {
      data: { selectedList },
      type: "chips_selected",
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    onClose?.();
  };

  if (!open) return null;

  // هندل کلیک روی بک‌دراپ برای بستن کشو
  const handleBackdropClick = (e) => {
    if (e.target.id === "chip-select-backdrop") {
      onClose?.();
    }
  };

  return (
    <div
      id="chip-select-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      style={{
        direction: "rtl",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="backdrop-blur-md bg-white/60 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center animate-fadeInChipDrawer relative mx-4"
        style={{ boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)" }}
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن هنگام کلیک روی کشو
      >
        {/* دکمه بستن */}
        <button
          className="absolute left-3 top-3 text-2xl text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-2 font-bold text-lg text-blue-800">انتخاب چیپ</div>
        <div className="mb-2 font-bold text-lg text-blue-800">
          3 چیپ از 3 رنگ مختلف انتخاب کنید.
        </div>
        <div className="mb-2 font-bold text-lg text-blue-800">
          2 چیپ از یک رنگ به شرطی که 4 چیپ از آن رنگ موجود باشد.
        </div>
        <div className="mb-2 font-bold text-lg text-blue-800">
          اگر نمیتوانید 3 چیپ بردارید، مجموعا 1 یا 2 چیپ به شرط برداشتن یکی از
          هر رنگ میتوانید بردارید.
        </div>
        <div className="mb-2 font-bold text-lg text-blue-800">
          در آخر هر نوبت حداکثر 10 چیپ میشه داشت!
        </div>
        {/* چیپ‌های موجود */}
        <div className="flex flex-row gap-2 mb-4">
          {CHIP_COLORS.map((color) => (
            <div key={color} className="flex flex-col items-center">
              <Chip
                color={color}
                quantity={chipsByColor[color] - selected[color]}
                disabled={chipsByColor[color] - selected[color] <= 0}
                onClick={() => handleChipClick(color)}
                className={`cursor-pointer ${
                  selected[color] > 0 ? "ring-2 ring-yellow-400" : ""
                }`}
              />
              <span className="text-xs mt-1 text-gray-500">
                {chipsByColor[color] - selected[color]}
              </span>
            </div>
          ))}
        </div>
        {/* چیپ‌های انتخابی */}
        <div className="flex flex-row-reverse gap-2 mb-4">
          {CHIP_COLORS.map((color) =>
            selected[color] > 0 ? (
              <div key={color} className="flex flex-col items-center">
                <Chip
                  color={color}
                  quantity={selected[color]}
                  className="opacity-80 cursor-pointer"
                  onClick={() => handleSelectedChipClick(color)}
                />
              </div>
            ) : null
          )}
        </div>
        {/* دکمه تایید */}
        <HoldToConfirmButton
          onConfirm={handleConfirm}
          label="تاییدانتخاب"
          disabled={!isValid || confirmed}
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
// import Chip from "./Chip";
// import HoldToConfirmButton from "../../UI/HoldToConfirmButton";

// const CHIP_COLORS = ["white", "blue", "red", "green", "black"];

// export default function ChipSelectDrawer({
//   open,
//   onClose,
//   availableChips, // [{color, quantity}]
//   initialColor, // رنگی که روش کلیک شده
// }) {
//   // state انتخابی کاربر
//   const [selected, setSelected] = useState(() => {
//     const obj = {};
//     CHIP_COLORS.forEach((color) => (obj[color] = 0));
//     if (initialColor && CHIP_COLORS.includes(initialColor)) {
//       obj[initialColor] = 1;
//     }
//     return obj;
//   });

//   // چیپ‌های موجود به صورت آبجکت
//   const chipsByColor = {};
//   CHIP_COLORS.forEach((color) => (chipsByColor[color] = 0));
//   availableChips.forEach((chip) => {
//     chipsByColor[chip.color] = chip.quantity;
//   });

//   // انتخاب چیپ
//   const handleChipClick = (color) => {
//     // اگر دو تا از یک رنگ انتخاب شده، بیشتر نشود
//     if (selected[color] === 2) return;
//     // اگر تعداد موجود کافی نیست، بیشتر نشود
//     if (selected[color] >= chipsByColor[color]) return;
//     // اگر مجموع انتخابی سه تا شده و این رنگ انتخاب نشده، نشود
//     const total = CHIP_COLORS.reduce((sum, c) => sum + selected[c], 0);
//     if (total >= 3 && selected[color] === 0) return;

//     // اگر دو تا از یک رنگ انتخاب شده، بقیه صفر شوند
//     if (selected[color] === 1 && chipsByColor[color] > 3) {
//       // حالت انتخاب دو تا از یک رنگ (فقط همین رنگ باید انتخاب شود)
//       setSelected((prev) => {
//         const obj = {};
//         CHIP_COLORS.forEach((c) => (obj[c] = 0));
//         obj[color] = 2;
//         return obj;
//       });
//       return;
//     }

//     // حالت عادی: یکی اضافه کن
//     setSelected((prev) => ({
//       ...prev,
//       [color]: prev[color] + 1,
//     }));
//   };

//   // حذف انتخاب
//   const handleRemove = (color) => {
//     if (selected[color] > 0) {
//       setSelected((prev) => ({
//         ...prev,
//         [color]: prev[color] - 1,
//       }));
//     }
//   };

//   // اعتبارسنجی انتخاب
//   const isValid = (() => {
//     const total = CHIP_COLORS.reduce((sum, c) => sum + selected[c], 0);
//     const selectedColors = CHIP_COLORS.filter((c) => selected[c] > 0);

//     // سه رنگ متفاوت و هرکدام یکی
//     if (
//       total === 3 &&
//       selectedColors.length === 3 &&
//       selectedColors.every((c) => selected[c] === 1)
//     ) {
//       return true;
//     }
//     // دو تا از یک رنگ (و بیشتر از یک چیپ از آن رنگ موجود باشد)
//     if (
//       total === 2 &&
//       selectedColors.length === 1 &&
//       selected[selectedColors[0]] === 2 &&
//       chipsByColor[selectedColors[0]] > 3
//     ) {
//       return true;
//     }
//     return false;
//   })();

//   // چیپ‌های انتخابی برای نمایش
//   const selectedList = CHIP_COLORS.filter((c) => selected[c] > 0).map((c) => ({
//     color: c,
//     quantity: selected[c],
//   }));

//   // تایید انتخاب
//   const handleConfirm = () => {
//     // فقط لاگ کن
//     console.log("انتخاب چیپ:", selectedList);
//     onClose?.();
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center animate-fadeInChipDrawer relative">
//         {/* دکمه بستن */}
//         <button
//           className="absolute left-3 top-3 text-2xl text-gray-400 hover:text-red-500"
//           onClick={onClose}
//         >
//           ×
//         </button>
//         <div className="mb-2 font-bold text-lg text-blue-800">انتخاب چیپ</div>
//         {/* چیپ‌های موجود */}
//         <div className="flex flex-row-reverse gap-2 mb-4">
//           {CHIP_COLORS.map((color) => (
//             <div key={color} className="flex flex-col items-center">
//               <Chip
//                 color={color}
//                 quantity={chipsByColor[color] - selected[color]}
//                 disabled={chipsByColor[color] - selected[color] <= 0}
//                 onClick={() => handleChipClick(color)}
//                 className={`cursor-pointer ${
//                   selected[color] > 0 ? "ring-2 ring-yellow-400" : ""
//                 }`}
//               />
//               <span className="text-xs mt-1 text-gray-500">
//                 {chipsByColor[color] - selected[color]}
//               </span>
//             </div>
//           ))}
//         </div>
//         {/* چیپ‌های انتخابی */}
//         <div className="flex flex-row-reverse gap-2 mb-4">
//           {CHIP_COLORS.map((color) =>
//             selected[color] > 0 ? (
//               <div key={color} className="flex flex-col items-center">
//                 <Chip
//                   color={color}
//                   quantity={selected[color]}
//                   disabled
//                   className="opacity-80"
//                 />
//                 <button
//                   className="text-xs text-red-500 mt-1"
//                   onClick={() => handleRemove(color)}
//                 >
//                   حذف
//                 </button>
//               </div>
//             ) : null
//           )}
//         </div>
//         {/* دکمه تایید */}
//         <HoldToConfirmButton
//           onConfirm={handleConfirm}
//           label="تایید انتخاب چیپ"
//           disabled={!isValid}
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
