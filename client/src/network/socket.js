import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_API_URL;
console.log("import.meta.env.VITE_MODE");
console.log(import.meta.env.VITE_MODE);
console.log("import.meta.env.VITE_API_URL");
console.log(import.meta.env.VITE_API_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  auth: {
    token: localStorage.getItem("token"),
  },
});

// توکن یا playerId رو از localStorage بخون
const playerId = localStorage.getItem("playerId");

// اتصال اولیه
socket.connect();

// وقتی اتصال برقرار شد یا مجدداً وصل شد
socket.on("connect", () => {
  console.log("Connected with socket ID:", socket.id);
  if (playerId) {
    socket.emit("reconnect-player");
  }
});

// برای بازیابی اتاق‌ها یا UI بعد از reconnect:
socket.on("player:rooms", (roomIds) => {
  console.log("Player is in rooms:", roomIds);
  // می‌تونی با این لیست UI رو مجدداً رندر کنی
});
