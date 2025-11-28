import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";
import { socket } from "../../network/socket";
import Chip from "./Chip";

export default function Tile({ id, value, index }) {
  const { connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId, currentGameId } = connectionState;
  const { turn } = gameState;
  const myIndex = gameState.players.findIndex((p) => p.id === playerId);

  const isMyTurn = gameState.players[turn]?.id === playerId;

  function clickHandler(e) {
    if (!isMyTurn) {
      alert("نوبت شما نیست!");
      return;
    }
  }

  // // رنگ‌بندی و استایل داینامیک
  // let bg = "bg-gray-300";
  // if (position !== "none") {
  //   if (tileVal === "bomb") {
  //     bg = position === myIndex ? "bg-green-400" : "bg-pink-400";
  //   }
  // } else {
  //   bg = "bg-gray-700";
  // }
  //${bg}
  // ${position === "none" ? "text-transparent" : "text-black"}
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
        "bg-gray-700"
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
      <Chip key={value} color={value} quantity={""} className="w-8 h-8" />
    </div>
  );
}
