const mongoose = require("mongoose");

const chatPlayerSchema = new mongoose.Schema({
  nickname: String,
  playerId: { type: String, required: true },
  socketId: String,
});

const chatSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    gameId: { type: String, required: true, unique: true },
    chatId: { type: String, required: true, unique: true },
    hostId: { type: String },
    roomName: { type: String },
    hostName: { type: String },
    players: [chatPlayerSchema],
    messageList: [],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
