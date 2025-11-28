import React, { useEffect, useState, useRef } from "react";
import MessageItem from "./MessageItem";
import VoiceChatButton from "../VoiceChatButton";
import { socket } from "../../network/socket";
import { useAppContext } from "../../context/AppContext";
import { useGameContext } from "../../context/GameContext";

const ChatPanel = ({ roomId }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [lastSeenIdx, setLastSeenIdx] = useState();
  const [gameIdState, setGameIdState] = useState();
  const [chat, setChat] = useState();
  const [seen, setSeen] = useState();
  const [newMessageIndex, setNewMessageIndex] = useState();

  console.log("lastSeenIdx: ", lastSeenIdx);

  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasScrolledToLastSeen = useRef(false);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  const { connectionState } = useAppContext();
  const { gameState } = useGameContext();
  const { playerId, currentGameId } = connectionState;

  useEffect(() => {
    console.log("gameIdState: ", gameIdState);
    if (gameState) {
      if (gameIdState === null) {
        setGameIdState(gameState.gameId);
        setChat(gameState.chat);
        setSeen(gameState.seen);
        setMessageList(gameState.chat);
        setLastSeenIdx(gameState.seen[playerId]);
        setNewMessageIndex(gameState.seen[playerId]);
      }
    }
    if (!gameState) {
      socket.emit("get_room_state", roomId, (room) => {
        if (room) {
          console.log(room);
          setGameIdState(null);
          setChat(room.chat);
          setSeen(room.seen);
          setMessageList(room.chat);
          setLastSeenIdx(room.seen[playerId]);
          setNewMessageIndex(room.seen[playerId]);
        }
      });
    }
  }, [
    currentGameId,
    gameIdState,
    gameState,
    roomId,
    gameState?.gameId,
    playerId,
  ]);
  /// currentGameId, gameIdState, gameState, roomId, gameState?.gameId

  const lastSeenRef = useRef();
  useEffect(() => {
    lastSeenRef.current = lastSeenIdx;
  }, [lastSeenIdx]);

  useEffect(() => {
    return () => {
      // این کد اجرا میشه زمانی که key تغییر کنه یا ChatPanel از DOM حذف بشه
      console.log(lastSeenRef.current);
      socket.emit("update_last_seen", {
        roomId,
        gameId: gameIdState,
        lastSeenIdx: lastSeenRef.current,
      });
    };
  }, [roomId, gameIdState, gameState]);

  console.log("chat", chat);
  console.log("seen", seen);
  console.log("lastSeenIndex", seen);

  // // مقداردهی اولیه پیام‌ها
  useEffect(() => {
    console.log("gameState.gameId: ", gameState);

    if (gameState) {
      console.log("gameState.gameId: ", gameState.gameId);
      console.log("gameId: ", gameIdState);

      if (gameState.gameId === gameIdState) {
        // setMessageList(chat);
        // console.log("gameState", gameState);
        // console.log("gameSeen", seen);
        // console.log("gameSeen.playerId", seen[playerId]);
        // setLastSeenIdx(seen[playerId] || 0);
        /////////////
        setGameIdState(gameState.gameId);
        setChat(gameState.chat);
        setSeen(gameState.seen);
        setMessageList(gameState.chat);
        setLastSeenIdx(gameState.seen[playerId]);
        setNewMessageIndex(gameState.seen[playerId]);
      }
      // console.log("gameSeen.playerId", gameSeen.playerId);
      console.log("roomId: ", roomId);
    } else if (roomId && seen && chat) {
      console.log("roomSeen", seen);
      console.log("roomSeen.playerId", seen[playerId]);
      // setMessageList(chat);
      // setLastSeenIdx(seen[playerId] || 0);
      /////////////////////////
      setGameIdState(null);
      setChat(chat);
      setSeen(seen);
      setMessageList(chat);
      setLastSeenIdx(seen[playerId]);
      setNewMessageIndex(seen[playerId]);
    }
  }, [chat, roomId, gameIdState, gameState, playerId, seen]);

  // دریافت پیام جدید از سوکت
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log(gameState);
      console.log(gameState?.gameId);
      console.log(gameIdState);
      console.log(data);
      console.log(roomId);

      if (
        (data.type === "room" && !gameState && data.id === roomId) ||
        (data.type === "game" && gameState && data.id === gameIdState)
      ) {
        console.log(data);
        setMessageList(data.chat);
      }
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [gameState, gameIdState]);

  // اسکرول به پیام lastSeenIdx فقط یکبار هنگام باز شدن پنل یا تغییر lastSeenIdx (مگر کاربر اسکرول کند)
  useEffect(() => {
    console.log(
      "hasScrolledToLastSeen.current: ",
      hasScrolledToLastSeen.current
    );
    console.log("isUserScrolling: ", isUserScrolling.current);
    console.log("collapsed: ", collapsed);
    console.log("messageList.length > 0: ", messageList.length > 0);
    console.log(
      "total: ",
      !collapsed &&
        messageList.length > 0 &&
        !hasScrolledToLastSeen.current &&
        !isUserScrolling.current
    );
    if (
      !collapsed &&
      messageList.length > 0 &&
      !hasScrolledToLastSeen.current &&
      !isUserScrolling.current
    ) {
      const container = scrollContainerRef.current;
      if (container) {
        const target = container.querySelector(
          `[data-msg-idx="${lastSeenIdx}"]`
        );
        if (target) {
          target.scrollIntoView({ behavior: "auto", block: "center" });
          hasScrolledToLastSeen.current = true;
        }
      }
    }
  }, [collapsed, messageList, gameState, lastSeenRef]);

  // وقتی پنل یا lastSeenIdx تغییر می‌کند، اجازه اسکرول خودکار بعدی داده شود
  useEffect(() => {
    hasScrolledToLastSeen.current = false;
  }, [collapsed, lastSeenRef, gameState]);

  // اسکرول به آخر وقتی پیام جدید میاد و کاربر پایین صفحه است (نه وقتی اسکرول دستی انجام شده)
  useEffect(() => {
    if (!collapsed && messageList.length > 0) {
      const container = scrollContainerRef.current;
      if (container) {
        const isAtBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100;

        if (isAtBottom && !isUserScrolling.current) {
          const newIdx = messageList.length - 1;
          setLastSeenIdx(newIdx);
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }
      }
    }
  }, [messageList.length, collapsed]);

  // هندلر اسکرول کاربر (برای تشخیص اسکرول دستی و آپدیت lastSeenIdx)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      isUserScrolling.current = true;

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 1000); // بعد از 1 ثانیه توقف اسکرول، به حالت غیر اسکرول دستی برمی‌گردیم

      const messageDivs = Array.from(
        container.querySelectorAll("[data-msg-idx]")
      );
      let maxSeen = lastSeenIdx;

      const containerRect = container.getBoundingClientRect();

      for (let el of messageDivs) {
        const rect = el.getBoundingClientRect();
        // پیام کامل داخل دید باشد
        if (
          rect.top >= containerRect.top &&
          rect.bottom <= containerRect.bottom
        ) {
          const idx = parseInt(el.getAttribute("data-msg-idx"), 10);
          if (idx > maxSeen) maxSeen = idx;
        }
      }

      if (maxSeen !== lastSeenIdx) setLastSeenIdx(maxSeen);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [lastSeenIdx, messageList]);

  // تعداد پیام‌های دیده نشده
  const unseenCount = Math.max(0, messageList.length - 1 - lastSeenIdx);

  const toggleChat = () => setCollapsed(!collapsed);

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      const messageData = {
        roomId,
        gameId: gameIdState,
        type: gameState ? "game" : "room",
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  return (
    <div
      className={`${
        gameState ? "bg-pink-900" : "bg-gray-800"
      }  text-white shadow-inner transition-all duration-300 ease-in-out z-20`}
      key={gameState ? "game" : "room"}
    >
      <div
        className={`flex items-center justify-between px-4 py-1 ${
          gameState
            ? "bg-pink-900 border-y border-pink-500"
            : "bg-gray-900 border-y border-blue-500"
        } z-20`}
      >
        <span
          className={`text-sm font-semibold ${
            gameState ? "text-pink-200" : "text-blue-400"
          } `}
        >
          {gameState ? "چت بازی" : "چت روم"}
        </span>
        <div className="flex justify-center z-20">
          <VoiceChatButton />
        </div>
        <div className="relative">
          <button
            onClick={toggleChat}
            className={`text-xs ${
              gameState
                ? "text-pink-200 hover:text-pink-300"
                : "text-blue-400 hover:text-blue-300"
            }  transition z-20`}
          >
            {collapsed ? "💬 باز کردن" : "❌ بستن"}
            {unseenCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold shadow z-20">
                {unseenCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className={`transition-all duration-300 overflow-y-auto px-4 space-y-1 ${
          collapsed ? "max-h-0 opacity-0 p-0" : "max-h-48 py-1 opacity-100"
        } z-20`}
        style={{ scrollBehavior: "smooth" }}
      >
        {messageList.map((msg, index) => (
          <div
            key={index}
            data-msg-idx={index}
            className={
              index === messageList.length - 1
                ? "animate-[fadeInUp_0.4s_ease] will-change-transform"
                : ""
            }
            style={{
              animation:
                index === messageList.length - 1
                  ? "fadeInUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
                  : undefined,
            }}
          >
            <MessageItem
              playerId={playerId}
              senderId={msg.senderId}
              senderName={msg.senderName}
              text={msg.text}
              gameState={gameState}
            />
            {/* {index === lastSeenIdx &&
              lastSeenIdx !== messageList.length - 1 && (
                <div className="flex items-center justify-center">
                  ---New Messages---
                </div>
              )} */}
            {console.log(newMessageIndex)}
            {index === newMessageIndex &&
              newMessageIndex !== messageList.length - 1 && (
                <div className="flex items-center justify-center z-20">
                  ---پیام جدید---
                </div>
              )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {!collapsed && (
        <form
          onSubmit={sendMessage}
          className={`flex items-center gap-2 p-2 border-t ${
            gameState ? "border-pink-800" : "border-gray-700"
          }`}
        >
          <input
            type="text"
            className={`flex-1 p-2 rounded text-sm text-white placeholder-gray-400 focus:outline-none ${
              gameState ? "bg-pink-800" : "bg-gray-700"
            }`}
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button
            type="submit"
            className={`px-3 py-1  text-sm text-white rounded  transition ${
              gameState
                ? "bg-pink-700 hover:bg-pink-600"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            Send
          </button>
        </form>
      )}
      <style>{`
        @keyframes fadeInUp {
        from {
        opacity: 0;
        transform: translateY(24px) scale(0.97);
            }
        to {
        opacity: 1;
          transform: translateY(0) scale(1);
           }
        }
      `}</style>
    </div>
  );
};

export default ChatPanel;
