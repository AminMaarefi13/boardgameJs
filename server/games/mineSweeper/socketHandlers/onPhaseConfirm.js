const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const { proceedToNextPhase } = require("../proceedToNextPhase");

async function onPhaseConfirm({
  gameId,
  socket,
  io,
  games,
  rooms,
  userSocketMap,
  payload,
}) {
  console.log("onPhaseConfirm");
  // console.log(gameId);
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  gameState.currentPhase = "confirm_move";
  console.log("payload");
  // console.log(payload);
  proceedToNextPhase({
    games,
    gameState,
    gameId,
    roomId,
    rooms,
    userSocketMap,
    io,
    eventSpecificData: payload,
  });
}

module.exports = {
  onPhaseConfirm,
};
