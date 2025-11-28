const { chatController } = require("../controllers/chatController");

async function updateChatInDB(chatId, chatState) {
  await chatController.updateChat(chatId, chatState);
}

module.exports = { updateChatInDB };
