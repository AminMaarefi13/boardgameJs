const MineSweeperStats = require("../models/MineSweeperStatsModel");

async function updateStats(player1Id, player2Id, winnerId) {
  // همیشه playerA < playerB برای یکتا بودن رکورد
  const [playerA, playerB] = [player1Id, player2Id].sort();
  let update = {};
  if (winnerId === playerA) update = { $inc: { aWins: 1 } };
  else if (winnerId === playerB) update = { $inc: { bWins: 1 } };

  await MineSweeperStats.findOneAndUpdate({ playerA, playerB }, update, {
    upsert: true,
    new: true,
  });
}

async function getStats(player1Id, player2Id) {
  const [playerA, playerB] = [player1Id, player2Id].sort();
  return MineSweeperStats.findOne({ playerA, playerB });
}

module.exports = { updateStats, getStats };
