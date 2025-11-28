const { gameSocketHandlers } = require("../utils/gameSocketHandlers");
const { getValidGameAndRoom } = require("../utils/getValidGameAndRoom");
const { rooms, games, userSocketMap } = require("../utils/memoryStore");

async function onRequestGameState(gameId, socket, io) {
  console.log("onRequestGameState called with gameId:", gameId);
  console.log("onRequestGameStateeeeeeeeeeeeeeeeee");
  const { gameState } = getValidGameAndRoom({ gameId, games, rooms });
  const gameType = gameState.type;
  const handler = gameSocketHandlers[gameType];
  console.log("gameType", gameType);
  console.log("handler", handler);
  if (!handler) return; // هندلر تعریف نشده

  const playerId = [...userSocketMap.entries()].find(
    ([_, sId]) => sId === socket.id
  )?.[0];

  handler({ gameState, playerId, socket, io, gameId });
}

module.exports = { onRequestGameState };
