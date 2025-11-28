const Chat = require("../models/ChatModel");

async function createChat(chatState) {
  const chat = new Chat(chatState);
  await chat.save();
  return chat;
}

async function getChatByChatId(chatId) {
  return await Chat.findOne({ chatId });
}

async function getAllChats() {
  return await Chat.find();
}

async function updateChat(chatId, updates) {
  return await Chat.findOneAndUpdate({ chatId }, updates, { new: true });
}

// async function deleteChat(chatId) {
//   await updateChat(chatId, { gameStatus: "finished" });
// }

module.exports = {
  createChat,
  getChatByChatId,
  getAllChats,
  updateChat,
  // deleteChat,
};
