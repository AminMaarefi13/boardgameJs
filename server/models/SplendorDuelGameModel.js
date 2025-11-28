const mongoose = require("mongoose");

const gamePlayerSchema = new mongoose.Schema({
  id: String,
  name: String,
  chips: [],
  devCards: { type: Array, default: [] },
  reservedCards: { type: Array, default: [] },
  nobleTilesOwned: { type: Array, default: [] },
  prestigePoints: { type: Number, default: 0 },
  crownsOwned: { type: Number, default: 0 },
  privilegeTokens: { type: Number, default: 0 },
  seat: { type: Number, default: 0 },
});

const SplendorDuelGameSchema = new mongoose.Schema({
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
  privileges: { type: Number, default: 3 },
  chipBoard: [],
  phaseData: {},
  nextPhaseData: {},
  logs: [],
  chat: [],
  seen: {},
  type: { type: String, default: "splendorDuel" },
});

module.exports = mongoose.model("SplendorDuelGame", SplendorDuelGameSchema);
