const mongoose = require("mongoose");

const MineSweeperStatsSchema = new mongoose.Schema({
  playerA: { type: String, required: true }, // playerId
  playerB: { type: String, required: true }, // playerId
  aWins: { type: Number, default: 0 },
  bWins: { type: Number, default: 0 },
});

MineSweeperStatsSchema.index({ playerA: 1, playerB: 1 }, { unique: true });

module.exports = mongoose.model("MineSweeperStats", MineSweeperStatsSchema);
