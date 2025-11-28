import React, { useRef, useState, useEffect } from "react";
import "./HoldToConfirmButton.css";

export default function HoldToConfirmButton({
  onConfirm,
  label,
  disabled = false,
}) {
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [shaking, setShaking] = useState(false);
  const intervalRef = useRef(null);
  const holdDuration = import.meta.env.VITE_MODE === "development" ? 30 : 1000; // میلی‌ثانیه
  const step = 10; // هر 10ms، progress افزایش می‌یابد

  const startHold = () => {
    if (disabled || confirmed) return;

    let currentProgress = 0;

    intervalRef.current = setInterval(() => {
      currentProgress += step;
      const percentage = (currentProgress / holdDuration) * 100;
      setProgress(percentage);

      if (currentProgress >= holdDuration) {
        clearInterval(intervalRef.current);
        setConfirmed(true);
        onConfirm?.();
      }
    }, step);
  };

  const cancelHold = () => {
    clearInterval(intervalRef.current);
    if (!confirmed && progress > 0) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
    setProgress(0);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      className={`
        relative w-full max-w-3xl mx-auto mt-4 h-14 rounded-xl overflow-hidden shadow-lg select-none
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-800 cursor-pointer"
        }
        ${shaking ? "shake" : ""}
      `}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
    >
      {/* لایه پرشدن */}
      <div
        className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-50 ease-linear"
        style={{ width: `${progress}%` }}
      />

      {/* متن روی دکمه */}
      <div className="relative z-10 w-full h-full flex items-center justify-center text-white font-bold text-lg">
        {confirmed ? "تأیید شد ✅" : label}
      </div>
    </div>
  );
}
