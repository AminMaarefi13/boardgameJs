const { makePublicState } = require("../utils/makeStates");

module.exports = function onRequestGameState({
  gameState,
  playerId,
  socket,
  io,
  gameId,
}) {
  console.log("onRequestGameState");
  console.log(gameId);
  const publicState = makePublicState(gameState);
  console.log("publicState,privateState,gameId");
  io.to(socket.id).emit("game_state_requested", {
    publicState,
    gameId,
  });
};
