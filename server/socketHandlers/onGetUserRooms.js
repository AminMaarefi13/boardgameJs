const connectionController = require("../controllers/connectionController");
const { rooms, connectionsArr } = require("../utils/memoryStore");

async function onGetUserRooms(socket, callback) {
  const playerId = socket.user._id.toString();
  console.log(`🔍 Fetching rooms for player ${playerId}`);
  console.log(rooms, connectionsArr);
  console.log("rooms, connectionsArr");

  const connectionUser =
    connectionsArr.get(playerId) ||
    (await connectionController.getConnectionByPlayerId(playerId));

  // فقط roomIdها را استخراج کن
  const roomIds = new Set(
    Array.from(connectionUser?.userRooms || []).map((room) => room.roomId)
  );

  console.log("roomIds: ", roomIds);
  console.log(rooms);
  const result = Array.from(roomIds)
    .map((roomId) => {
      const room = rooms.get(roomId);
      if (!room) return null;

      return {
        roomId,
        hostName: room.players[0]?.nickname || "نامشخص",
        hostId: room.hostId,
        roomName: room.roomName,
        roomPlayers: room.players,
        chat: room.chat,
        seen: room.seen,
      };
    })
    .filter(Boolean);
  console.log("result");
  console.log(result);
  callback(result);
}

module.exports = {
  onGetUserRooms,
};
