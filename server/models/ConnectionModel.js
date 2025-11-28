const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ارتباط با UserModel
  name: String,
  playerId: { type: String, required: true },
  socketId: String,
  currentRoomId: String,
  currentGameId: String,
  userRooms: [],
  // --- انرژی و تبلیغات ---
  energy: { type: Number, default: 10 },
  lastEnergyTime: { type: Number, default: Date.now },
  adSessionCount: { type: Number, default: 0 },
  subscription: { type: Boolean, default: false },
});

module.exports = mongoose.model("Connection", connectionSchema);
