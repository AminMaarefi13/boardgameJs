import React, { useState, useRef, useEffect } from "react";
import splendorImg from "../../../public/splendor.png";
import duelImg from "../../../public/splendorDuel.png";
import mineImg from "../../../public/mineSweeper.png";
import krakenImg from "../../../public/feedTheKraken.png";
import GAME_TYPES from "../../UI/gameTypes";

export default function GameTypeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = GAME_TYPES.find((g) => g.value === value) || GAME_TYPES[0];

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className="w-full flex items-center gap-3 bg-gray-800 text-white px-3 py-2 rounded shadow hover:bg-gray-700 transition"
        onClick={() => setOpen((o) => !o)}
      >
        <img
          src={selected.image}
          alt=""
          className="w-12 h-12 rounded object-cover block"
          style={{ aspectRatio: "1 / 1" }}
        />
        <span className="font-semibold">{selected.label}</span>
        <svg
          className="w-5 h-5 ml-auto"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 32 32"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={open ? "M19 15l-7-7-7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full bg-gray-900 rounded shadow-lg border border-gray-700">
          {GAME_TYPES.map((g) => (
            <button
              key={g.value}
              className={`flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-700 transition ${
                value === g.value ? "bg-gray-700" : ""
              }`}
              onClick={() => {
                onChange(g.value);
                setOpen(false);
              }}
              type="button"
            >
              <img
                src={g.image}
                alt=""
                className="w-20 h-20 rounded object-cover block"
                style={{ aspectRatio: "1 / 1" }}
              />
              <div className="flex w-full justify-between">
                <div className="font-semibold">{g.label}</div>
                <div className="font-semibold" style={{ direction: "rtl" }}>
                  {g.minNumPlayers === g.maxNumPlayers
                    ? `${g.minNumPlayers}`
                    : `${g.minNumPlayers} تا ${g.maxNumPlayers}`}{" "}
                  نفره
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
