// utils/gameUtils.js

function getValidGameAndRoom({ gameId, games, rooms }) {
  console.log("rooms");
  // console.log(rooms);
  console.log("games");
  // console.log(games);
  console.log("gameId");
  console.log(gameId);
  const game = games.get(gameId);
  console.log("getValidGameAndRoom");
  console.log("game");
  console.log(game);
  if (!game) {
    return null;
  }
  // console.log(game);
  const roomId = game.roomId;
  console.log("roomId");
  console.log(roomId);
  const room = rooms.get(roomId);
  console.log("room");
  // console.log(room);
  if (!room) {
    // socket.emit("error_message", "اتاق مورد نظر یافت نشد.");
    return null;
  }

  return { game, room, roomId, gameState: game };
}

module.exports = {
  getValidGameAndRoom,
};
