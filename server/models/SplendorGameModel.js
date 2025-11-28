const mongoose = require("mongoose");

const gamePlayerSchema = new mongoose.Schema({
  id: String,
  name: String,
  chips: [],
  devCards: { type: Array, default: [] },
  reservedCards: { type: Array, default: [] },
  nobleTilesOwned: { type: Array, default: [] },
  prestigePoints: { type: Number, default: 0 },
  seat: { type: Number, default: 0 },
});

const SplendorGameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true }, // اضافه شده
  roomId: { type: String, required: true },
  players: [gamePlayerSchema],
  gameStatus: {
    type: String,
    enum: ["waiting", "onGoing", "gameOver"],
    default: "waiting",
  },
  currentPhase: { type: String, default: "game_start" },
  devCardsDeck: [],
  devCardsVisible: [],
  nobleTilesDeck: [],
  chipQuantities: [],
  turn: { type: Number, default: 0 },
  finalRound: { type: Boolean, default: false },
  phaseData: {},
  nextPhaseData: {},
  logs: [],
  chat: [],
  seen: {},
  type: { type: String, default: "splendor" },
});

module.exports = mongoose.model("SplendorGame", SplendorGameSchema);
