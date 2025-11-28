import React, { useState } from "react";
import { socket } from "../../network/socket";

export default function EditRoomNameOverlay({ roomId }) {
  const [openPanel, setOpenPanel] = useState(null);
  const [closing, setClosing] = useState(false);
  const [roomNameState, setRoomNameState] = useState("");
  const onClose = () => {
    setClosing(true);
    setTimeout(() => {
      setOpenPanel(null);
      setClosing(false);
    }, 300);
  };

  const handleClick = () => {
    if (!roomNameState) return alert("همه فیلدها را پر کنید.");
    // localStorage.setItem("name", name);
    // localStorage.setItem("playerId", playerId);
    socket.emit("room_name_change", { roomNameState, roomId });
    onClose?.();
  };

  const handleButtonClick = () => {
    if (!openPanel) {
      setOpenPanel(true);
      setClosing(false);
    }
  };

  // هندل کلیک روی پس‌زمینه برای بستن کشو
  const handleBackdropClick = (e) => {
    if (e.target.id === "player-panel-backdrop") {
      setClosing(true);
      setTimeout(() => {
        setOpenPanel(null);
        setClosing(false);
      }, 300);
    }
  };

  // دکمه بستن کشو
  const handleClosePanel = () => {
    setClosing(true);
    setTimeout(() => {
      setOpenPanel(null);
      setClosing(false);
    }, 300);
  };

  return (
    <>
      <div
        className={`
              flex items-center
              justify-center
            `}
      >
        <button
          className={`
             w-12 h-12 flex items-center justify-center
             text-white font-bold text-xl
              transition group
              relative
            `}
          onClick={() => handleButtonClick(true)}
        >
          🖊
        </button>
      </div>

      {/* پنل بازشو وسط صفحه با انیمیشن و بک‌دراپ */}
      {(openPanel !== null || closing) && (
        <div
          id="player-panel-backdrop"
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleBackdropClick}
        >
          <div
            className={`
              bg-white rounded-2xl shadow-2xl w-80 max-w-full p-6 flex flex-col items-center pointer-events-auto
              ${closing ? "animate-fadeOutScale" : "animate-fadeInScale"}
            `}
            style={{
              animationDuration: "0.3s",
              animationFillMode: "both",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="w-full mt-3 px-4 py-3 rounded-md bg-gray-700 placeholder-gray-400 text-white"
                placeholder="نام جدید روم"
                value={roomNameState}
                onChange={(e) => setRoomNameState(e.target.value)}
              />
              <button
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-md font-bold"
                onClick={handleClick}
              >
                تایید
              </button>
            </div>
            {/* دکمه‌های بازیکنان و دکمه بستن داخل کشو */}
            <div className="flex flex-row-reverse gap-2 mt-4 mb-0 w-full items-center justify-center">
              {/* دکمه بستن کشو */}
              <button
                className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center border border-gray-400 hover:bg-red-100 hover:text-red-600 transition text-xl"
                onClick={handleClosePanel}
                tabIndex={0}
                aria-label="بستن"
              >
                ×
              </button>
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
