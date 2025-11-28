// src/components/Chat/MessageItem.jsx
import React from "react";

const MessageItem = ({ playerId, senderId, senderName, text, gameState }) => {
  // console.log(playerId, senderId, senderName, text);
  // ...existing code...
  return (
    <div className="flex w-full mb-1">
      {playerId === senderId ? (
        // پیام خود کاربر: سمت راست
        <div className="ml-auto max-w-[70%] flex flex-col items-end">
          <div
            className={`rounded-2xl ${
              gameState ? "bg-pink-600" : "bg-blue-500"
            }  text-white px-4 py-2 shadow-md text-sm`}
          >
            <span>{text}</span>
          </div>
        </div>
      ) : (
        // پیام دیگران: سمت چپ
        <div className="mr-auto max-w-[70%] flex flex-col items-start">
          <div
            className={`rounded-2xl ${
              gameState
                ? "bg-pink-200 text-pink-900"
                : "bg-gray-200 text-gray-900"
            } px-4 py-2 shadow text-sm`}
          >
            <span className="font-semibold text-blue-500">{senderName}:</span>{" "}
            <span>{text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
