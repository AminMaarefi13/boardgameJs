// utils/gameUtils.js
const { makePublicState } = require("./makeStates");

function broadcastGameStateToPlayers(io, gameState, userSocketMap) {
  for (const p of gameState.players) {
    const socketId = userSocketMap.get(p.id);
    if (!socketId) continue;

    const player = gameState.players.find((pl) => pl.id === p.id);
    if (!player) continue;

    const publicState = makePublicState(gameState);

    io.to(socketId).emit("gameState", { publicState });
  }
}

module.exports = {
  broadcastGameStateToPlayers,
};
