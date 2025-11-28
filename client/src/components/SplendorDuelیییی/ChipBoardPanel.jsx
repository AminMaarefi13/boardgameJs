import React, { useState } from "react";
import PlayerInfoPanel from "./PlayerInfoPanel";
import { useGameContext } from "../../context/GameContext";
import ChipBoard from "./ChipBoard";

export default function ChipBoardPanel({ myIndex, player }) {
  const [openPanel, setOpenPanel] = useState(null);
  const [closing, setClosing] = useState(false);
  const [privilegeUse, setPrivilegeUse] = useState(false);
  const { gameState } = useGameContext();

  const handleButtonClick = (privilege) => {
    if (privilege) {
      setPrivilegeUse(true);
    }
    if (!openPanel) {
      setOpenPanel(true);
      setClosing(false);
    }
  };

  // هندل کلیک روی پس‌زمینه برای بستن کشو
  const handleBackdropClick = (e) => {
    if (e.target.id === "player-panel-backdrop") {
      setClosing(true);
      setPrivilegeUse(false);
      setTimeout(() => {
        setOpenPanel(null);
        setClosing(false);
      }, 300);
    }
  };

  // دکمه بستن کشو
  const handleClosePanel = () => {
    setClosing(true);
    setPrivilegeUse(false);
    setTimeout(() => {
      setOpenPanel(null);
      setClosing(false);
    }, 300);
  };

  return (
    <>
      {/* دکمه‌ دایره ای پایین صفحه */}
      <div
      // className="fixed right-40 bottom-20 z-40 flex flex-col-reverse gap-2 items-end"
      >
        {!(
          (gameState.currentPhase === "yellow_select" ||
            gameState.currentPhase === "take_second_same") &&
          gameState.turn === myIndex
        ) && (
          <div className="flex items-center gap-4 justify-center text-white  text-lg font-bold shadow ">
            <button
              className={`
              w-12 h-12 flex items-center justify-center pt-0.5
              bg-blue-600 text-white font-bold shadow-lg border-2 border-blue-800
              transition group
              ${openPanel && !closing ? "ring-2 ring-yellow-400" : ""}
              rounded-full 
              hover:bg-blue-700
              relative
            `}
              onClick={() => handleButtonClick(true)}
            >
              <span className="w-10 h-10 flex items-center justify-center text-white  text-lg font-bold shadow ">
                {player.privilegeTokens}🎟
              </span>
            </button>
            <button
              className={`
              w-12 h-12 flex items-center justify-center pt-0.5
              bg-blue-600 text-white font-bold shadow-lg border-2 border-blue-800
              transition group
              ${openPanel && !closing ? "ring-2 ring-yellow-400" : ""}
              rounded-full 
              hover:bg-blue-700
              relative
            `}
              onClick={() => handleButtonClick()}
            >
              <span className="w-10 h-10 flex items-center justify-center text-white  text-lg font-bold shadow ">
                🎲
              </span>
            </button>
          </div>
        )}
      </div>

      {/* پنل بازشو وسط صفحه با انیمیشن و بک‌دراپ */}
      {(openPanel !== null ||
        closing ||
        ((gameState.currentPhase === "yellow_select" ||
          gameState.currentPhase === "take_second_same") &&
          gameState.turn === myIndex)) && (
        <div
          id="player-panel-backdrop"
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
          onClick={
            (gameState.currentPhase === "yellow_select" ||
              gameState.currentPhase === "take_second_same") &&
            gameState.turn === myIndex
              ? undefined
              : handleBackdropClick
          }
        >
          <div
            className={`
             backdrop-blur-md bg-white/60 rounded-2xl shadow-2xl  rounded-2xl shadow-2xl w-80 max-w-full p-6 flex flex-col items-center pointer-events-auto
              ${closing ? "animate-fadeOutScale" : "animate-fadeInScale"}
            `}
            style={{
              animationDuration: "0.3s",
              animationFillMode: "both",
            }}
          >
            <ChipBoard
              handleClosePanel={handleClosePanel}
              gameState={gameState}
              player={player}
              myIndex={myIndex}
              privilegeUse={privilegeUse}
              setPrivilegeUse={setPrivilegeUse}
            />{" "}
            {/* <div className="text-gray-600">اطلاعات بازیکن</div> */}
            {/* دکمه‌های بازیکنان و دکمه بستن داخل کشو */}
            <div className="flex flex-row-reverse gap-2 mt-4 mb-0 w-full items-center justify-center">
              {/* دکمه بستن کشو */}

              {!(
                (gameState.currentPhase === "yellow_select" ||
                  gameState.currentPhase === "take_second_same") &&
                gameState.turn === myIndex
              ) && (
                <button
                  className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center border border-gray-400 hover:bg-red-100 hover:text-red-600 transition text-xl"
                  onClick={handleClosePanel}
                  tabIndex={0}
                  aria-label="بستن"
                >
                  ×
                </button>
              )}
              {/* {players.map((player, idx) => (
                <button
                  key={player.id}
                  className={`
                    w-10 h-10 rounded-full bg-blue-600 text-white font-bold shadow flex flex-col items-center justify-center border-2 border-blue-800 hover:bg-blue-700 transition
                    ${
                      openPanel === player.id && !closing
                        ? "ring-2 ring-yellow-400"
                        : ""
                    }
                  `}
                  onClick={() => handleButtonClick(player.id)}
                  tabIndex={0}
                >
                  <span className="text-xs">
                    {" "}
                    {myIndex === idx ? "من" : idx + 1}
                  </span>
                </button>
              ))} */}
            </div>
          </div>
        </div>
      )}

      {/* انیمیشن سفارشی */}
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(40px);
          }
          80% {
            opacity: 1;
            transform: scale(1.05) translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fadeOutScale {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.7) translateY(40px);
          }
        }
        .animate-fadeInScale {
          animation-name: fadeInScale;
        }
        .animate-fadeOutScale {
          animation-name: fadeOutScale;
        }
      `}</style>
    </>
  );
}
