const { makePublicState, makePrivateState } = require("../utils/makeStates");

module.exports = function onRequestGameState({
  gameState,
  playerId,
  socket,
  io,
  gameId,
}) {
  const player = gameState.players.find((p) => p.id === playerId);
  const publicState = makePublicState(gameState);
  const privateState = makePrivateState(player);
  console.log(publicState, privateState, gameId);
  console.log("publicState,privateState,gameId");
  io.to(socket.id).emit("game_state_requested", {
    publicState,
    privateState,
    gameId,
  });
};

// const { getValidGameAndRoom } = require("../utils/getValidGameAndRoom");
// const {
//   makePublicState,
//   makePrivateState,
// } = require("../games/feedTheKraken/utils/makeStates");
// const { rooms, games, userSocketMap } = require("../utils/memoryStore");
// async function onRequestGameState(gameId, socket, io) {
//   const { game, room, roomId, gameState } = getValidGameAndRoom({
//     gameId,
//     games,
//     rooms,
//   });
//   // console.log(rooms, games, userSocketMap);
//   // console.log("rooms, games, userSocketMap");
//   const publicState = makePublicState(gameState);

//   const playerId = [...userSocketMap.entries()].find(
//     ([_, sId]) => sId === socket.id
//   )?.[0];

//   const player = gameState.players.find((p) => p.id === playerId);

//   const privateState = makePrivateState(player);
//   io.to(socket.id).emit("game_state_requested", {
//     publicState,
//     privateState,
//     gameId,
//   });
// }

// module.exports = {
//   onRequestGameState,
// };
