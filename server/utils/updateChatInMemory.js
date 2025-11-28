// utils/gameUtils.js

function updateChatInMemory(chats, chatId, chatState) {
  chats.set(chatId, chatState);
}

module.exports = { updateChatInMemory };
