import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import { useAppContext } from "../context/AppContext";
import Tiles from "../components/MineSweeper/Tiles";
import getGradientClass from "../UI/getGradientClass";
import getScoreShadowClass from "../UI/getScoreShadowClass";
// import ProfileImage from "../components/MineSweeper/ProfileImage";

export default function MineSweeperPage() {
  const navigate = useNavigate();
  const { gameState, setGameState } = useGameContext();
  const { connectionState, setConnectionState } = useAppContext();
  const { playerId, currentRoomId, currentGameId } = connectionState;

  // جلوگیری از ورود بدون انتخاب بازی
  useEffect(() => {
    if (!currentGameId) {
      alert("لطفاً ابتدا یک بازی را انتخاب کنید.");
      navigate("/lobby");
      return;
    }

    if (currentRoomId && playerId && currentGameId) {
      socket.emit(
        "request_game_state",
        currentGameId,
        (gameStateFromServer) => {
          if (gameStateFromServer.publicState) {
            setGameState(gameStateFromServer.publicState);
            setConnectionState((prev) => ({
              ...prev,
              currentRoomId: gameStateFromServer.publicState.roomId,
              currentGameId: gameStateFromServer.publicState.gameId,
            }));
            localStorage.setItem(
              "currentGameId",
              gameStateFromServer.publicState.gameId
            );
          } else {
            alert("❌ دریافت اطلاعات بازی ممکن نشد.");
          }
        }
      );
    }
  }, [currentRoomId, currentGameId, playerId, navigate]);

  if (
    !gameState ||
    !gameState.players ||
    gameState.players.length < 2 ||
    !gameState.map
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        لطفاً ابتدا یک بازی را از لابی انتخاب کنید.
      </div>
    );
  }

  const {
    players,
    turn = 0,
    // score = [0, 0],
    allTime = [0, 0],
  } = gameState;
  const myIndex = players.findIndex((p) => p.id === playerId);

  return (
    <div className="flex-1 w-full bg-gray-900 flex flex-col items-center pt-4 pb-4 px-2">
      {/* All Time Score */}
      <div className="w-full max-w-lg bg-cyan-800 text-white rounded-lg shadow px-4 py-2 mb-3 flex justify-center font-mono text-sm sm:text-base">
        امتیاز کلی: {allTime[1]} : {allTime[0]}
      </div>

      {/* Remaining Bombs */}
      {players[0].score < 8 && players[1].score < 8 && (
        <div className="w-full max-w-md bg-white text-black rounded-lg shadow px-4 py-2 mb-3 flex justify-center items-center opacity-90 text-sm sm:text-base">
          {15 - players[0].score - players[1].score}{" "}
          <span className="text-2xl mx-2">💣</span>
          بمب باقی‌مانده
        </div>
      )}

      {/* Turn Banner */}
      {players[0].score < 8 && players[1].score < 8 && (
        <div
          className={`w-full max-w-md rounded-lg shadow px-4 py-2 mb-3 flex flex-col items-center
      ${getGradientClass({ type: "turn", myIndex, turnIndex: turn, playerId })}
    `}
        >
          <div className="font-bold text-xs sm:text-base">نوبت:</div>
          <div className="text-base sm:text-lg">{players[turn]?.name}</div>
        </div>
      )}

      {/* Score Banner */}
      <div className="w-full max-w-lg flex justify-between items-center rounded-lg shadow-lg px-4 py-3 mb-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
        <div className="flex flex-col items-center">
          {/* <ProfileImage src={players[0].photo} isBig={false} /> */}
          <span className="font-bold text-xs sm:text-base">
            {players[0].name}
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-mono font-bold">
          {players[0].score} : {players[1].score}
        </div>
        <div className="flex flex-col items-center">
          {/* <ProfileImage src={players[1].photo} isBig={false} /> */}
          <span className="font-bold text-xs sm:text-base">
            {players[1].name}
          </span>
        </div>
      </div>

      {/* Winner Banner */}
      {(players[0].score === 8 || players[1].score === 8) && (
        <div
          className="w-full max-w-md bg-gray-200 text-black rounded-lg shadow px-4 py-8 mb-3 flex flex-col items-center text-xl sm:text-2xl font-bold"
          style={{ direction: "rtl" }}
        >
          <div>
            {players[0].score === 8 ? players[0].name : players[1].name}
          </div>
          <div>برنده شد!</div>
          {/* <button
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
            onClick={rematchHandler}
          >
            بازی مجدد
          </button>
          <button
            className="mt-3 px-6 py-2 bg-gray-400 text-black rounded shadow hover:bg-gray-500 transition"
            onClick={() => navigate("/lobby")}
          >
            بازگشت به خانه
          </button> */}
        </div>
      )}

      {/* MineSweeper Board */}
      {players[0].score < 8 && players[1].score < 8 && (
        <div
          className={`
      flex justify-center items-center
      rounded-2xl
      transition
      mx-auto
      w-full
      max-w-xl
      ${getScoreShadowClass({ players, playerId })}
    `}
          style={{ transition: "box-shadow 0.3s" }}
        >
          <div className="w-full max-w-[420px] aspect-[7/8] flex items-center justify-center">
            <Tiles />
          </div>
        </div>
      )}

      {/* {players[0].score < 8 && players[1].score < 8 && (
        <div
          className={`
      flex justify-center items-center
      rounded-2xl
      transition
      mx-auto
      w-full
      max-w-xl
      ${(() => {
        const myIndex = players.findIndex((p) => p.id === playerId);
        const otherIndex = myIndex === 0 ? 1 : 0;
        if (players[myIndex].score > players[otherIndex].score) {
          return "shadow-[0_0_40px_8px_rgba(59,130,246,0.7)]";
        } else if (players[myIndex].score < players[otherIndex].score) {
          return "shadow-[0_0_40px_8px_rgba(236,72,153,0.7)]";
        } else {
          return "shadow-[0_0_32px_6px_rgba(34,211,238,0.5)]";
        }
      })()}
    `}
          style={{ transition: "box-shadow 0.3s" }}
        >
          <div className="w-full max-w-[420px] aspect-[7/8] flex items-center justify-center">
            <Tiles />
          </div>
        </div>
      )} */}
    </div>
  );
}
