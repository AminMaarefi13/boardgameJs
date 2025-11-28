import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import { socket } from "../../network/socket";

export default function Tile({
  index,
  tileVal,
  position,
  loadingTileIndex,
  setLoadingTileIndex,
}) {
  const { connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId, currentGameId } = connectionState;
  const { turn } = gameState;
  const myIndex = gameState.players.findIndex((p) => p.id === playerId);

  const isMyTurn = gameState.players[turn]?.id === playerId;
  const isThisLoading = loadingTileIndex === index;

  useEffect(() => {
    if (tileVal !== "none" && isThisLoading) {
      setLoadingTileIndex(null); // وقتی مقدار tile تغییر کرد و این همون تایل لود شده بود
    }
  }, [tileVal]);

  // function clickHandler(e) {
  //   if (!isMyTurn) {
  //     alert("نوبت شما نیست!");
  //     return;
  //   }

  //   if (loadingTileIndex !== null) return; // اگر لودینگ فعاله، هیچکس نتونه کلیک کنه

  //   if (position === "none") {
  //     e.preventDefault();
  //     setLoadingTileIndex(index); // این تایل در حال لودینگه
  //     const payload = { index };
  //     socket.emit("phase_confirm", { gameId: currentGameId, payload });
  //   }
  // }
  function clickHandler(e) {
    if (!isMyTurn) {
      alert("نوبت شما نیست!");
      return;
    }

    if (loadingTileIndex !== null) {
      alert("قبلاً یک خانه را انتخاب کرده‌اید. لطفاً منتظر بمانید!");
      return;
    }

    if (position === "none") {
      e.preventDefault();
      setLoadingTileIndex(index); // این تایل در حال لودینگه
      const payload = { index };
      socket.emit("phase_confirm", { gameId: currentGameId, payload });
    }
  }

  // رنگ‌بندی و استایل داینامیک
  let bg = "bg-gray-300";
  if (position !== "none") {
    if (tileVal === "bomb") {
      bg = position === myIndex ? "bg-green-400" : "bg-pink-400";
    }
  } else {
    bg = "bg-gray-700";
  }

  return (
    <div
      className={`
        flex items-center justify-center
        font-mono font-bold
        text-base sm:text-lg md:text-xl
        rounded
        select-none
        cursor-pointer
        transition
        duration-100
        active:scale-95
        ${bg}
        ${position === "none" ? "text-transparent" : "text-black"}
        relative
      `}
      style={{
        aspectRatio: "1/1",
        minHeight: "28px",
        minWidth: "28px",
        maxHeight: "48px",
        maxWidth: "48px",
      }}
      onClick={clickHandler}
    >
      {isThisLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : tileVal === "bomb" ? (
        "💣"
      ) : tileVal === 0 ? (
        ""
      ) : (
        tileVal
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useAppContext } from "../../context/AppContext";
// import { useGameContext } from "../../context/GameContext";
// import { socket } from "../../network/socket";

// export default function Tile({ index, tileVal, position }) {
//   const [isLoading, setIsLoading] = useState(false);

//   const { connectionState } = useAppContext();
//   const { gameState } = useGameContext();
//   const { playerId, currentGameId } = connectionState;
//   const { turn } = gameState;
//   const myIndex = gameState.players.findIndex((p) => p.id === playerId);

//   useEffect(() => {
//     if (tileVal !== "none") {
//       setIsLoading(false); // وقتی مقدار tile تغییر کرد، لودینگ برداشته شود
//     }
//   }, [tileVal]);

//   function clickHandler(e) {
//     const isMyTurn = gameState.players[turn]?.id === playerId;

//     if (isLoading) return; // جلوگیری از کلیک مجدد در حین لودینگ

//     if (!isMyTurn) {
//       alert("نوبت شما نیست!");
//       return;
//     }

//     if (position === "none") {
//       e.preventDefault();
//       setIsLoading(true); // شروع لودینگ
//       const payload = { index };
//       socket.emit("phase_confirm", { gameId: currentGameId, payload });
//     }
//   }
//   // function clickHandler(e) {
//   //   console.log(currentGameId);
//   //   const isMyTurn = gameState.players[turn]?.id === playerId;

//   //   if (position === "none" && isMyTurn) {
//   //     e.preventDefault();
//   //     console.log(index, tileVal, position, turn);
//   //     const payload = { index };
//   //     socket.emit("phase_confirm", { gameId: currentGameId, payload });
//   //   }
//   // }

//   // رنگ‌بندی و استایل داینامیک
//   let bg = "bg-gray-300";
//   if (position !== "none") {
//     if (tileVal === "bomb") {
//       console.log(myIndex);
//       console.log(position);
//       bg = position === myIndex ? "bg-green-400" : "bg-pink-400";
//     }
//   } else {
//     bg = "bg-gray-700";
//   }

//   return (
//     <div
//       className={`
//       flex items-center justify-center
//       font-mono font-bold
//       text-base sm:text-lg md:text-xl
//       rounded
//       select-none
//       cursor-pointer
//       transition
//       duration-100
//       active:scale-95
//       ${bg}
//       ${position === "none" ? "text-transparent" : "text-black"}
//       relative
//     `}
//       style={{
//         aspectRatio: "1/1",
//         minHeight: "28px",
//         minWidth: "28px",
//         maxHeight: "48px",
//         maxWidth: "48px",
//       }}
//       onClick={clickHandler}
//     >
//       {isLoading ? (
//         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//       ) : tileVal === "bomb" ? (
//         "💣"
//       ) : tileVal === 0 ? (
//         ""
//       ) : (
//         tileVal
//       )}
//     </div>
//   );

//   // return (
//   //   <div
//   //     className={`
//   //       flex items-center justify-center
//   //       font-mono font-bold
//   //       text-base sm:text-lg md:text-xl
//   //       rounded
//   //       select-none
//   //       cursor-pointer
//   //       transition
//   //       duration-100
//   //       active:scale-95
//   //       ${bg}
//   //       ${position === "none" ? "text-transparent" : "text-black"}
//   //       `}
//   //     style={{
//   //       aspectRatio: "1/1",
//   //       minHeight: "28px",
//   //       minWidth: "28px",
//   //       maxHeight: "48px",
//   //       maxWidth: "48px",
//   //     }}
//   //     onClick={clickHandler}
//   //   >
//   //     {tileVal === "bomb" ? "💣" : tileVal === 0 ? "" : tileVal}
//   //   </div>
//   // );
// }

// // import "./Tile.css";

// // export default function Tile({
// //   index,
// //   tileVal,
// //   position,
// //   turn,
// //   group,
// //   clickUp,
// //   currentPlayerHome,
// // }) {
// //   function clickHandler(e) {
// //     if (position === "none") {
// //       e.preventDefault();
// //       clickUp(index, tileVal, position, turn, group);
// //     }
// //     // setTileClass("tileContainer");
// //   }

// //   return (
// //     <>
// //       <div
// //         className={`tileContainer player${position} ${tileVal} ${
// //           currentPlayerHome ? "home" : "away"
// //         }`}
// //         onClick={clickHandler}
// //       >
// //         {tileVal === "bomb" ? "💣" : tileVal === 0 ? "" : tileVal}
// //       </div>
// //     </>
// //   );
// // }
