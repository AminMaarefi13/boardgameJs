const { rooms } = require("../utils/memoryStore");

async function onGetRoomState(roomId, callback) {
  const room = rooms.get(roomId);
  console.log("onGetRoomState");
  console.log(rooms);
  console.log("rooms onGetRoomState");
  if (!room) return callback(null);
  callback({
    roomId,
    roomPlayers: room.players,
    roomName: room.roomName,
    hostName: room.players[0]?.nickname || "نامشخص",
    hostId: room.hostId,
    roomGames: room.games || [],
    chat: room.chat,
    seen: room.seen,
  });
}

module.exports = {
  onGetRoomState,
};
