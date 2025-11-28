// src/components/Chat/ChatToggleButton.jsx
import React from "react";

const ChatToggleButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-full shadow-md transition"
    >
      💬 Toggle Chat
    </button>
  );
};

export default ChatToggleButton;
