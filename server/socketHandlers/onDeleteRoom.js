const { logAllUsers } = require("../utils/logAllusers");
const roomController = require("../controllers/roomController");
const connectionController = require("../controllers/connectionController");
let { rooms, connectionsArr, userSocketMap } = require("../utils/memoryStore");

async function onDeleteRoom(roomId, socket, io) {
  const playerId = socket.user._id.toString();
  const name = socket.user.name || "نامشخص";
  console.log(`🔗 Deleting room for player ${playerId} with name ${name}`);
  // console.log(rooms, connectionsArr, userSocketMap);
  // console.log("rooms, connectionsArr, userSocketMap");
  const connectionUser = connectionsArr.get(playerId);

  const room = rooms.get(roomId);

  const players = room.players;

  rooms.delete(roomId);

  connectionUser.currentRoomId = null;
  connectionUser.currentGameId = null;
  // ذخیره در دیتابیس
  try {
    await roomController.deleteRoom(roomId);
  } catch (err) {
    console.error("❌ Failed to persist room:", err);
    socket.emit("error", { message: "خطا در حذف روم." });
    return;
  }

  logAllUsers(userSocketMap, rooms);

  console.log("rooms: ", rooms);
  // console.log("userRoomsArr");
  // console.log(userRoomsArr);

  players.forEach(async (player) => {
    const playerId = player.playerId;
    const socketId = userSocketMap.get(playerId);

    const connectionUser = connectionsArr.get(playerId);
    //  ||
    // (await connectionController.getConnectionByPlayerId(playerId));
    if (!connectionUser) return;

    const userRoomsFiltered = connectionUser.userRooms.filter(
      (room) => room.roomId !== roomId
    );

    const userRoomsSet = new Set(userRoomsFiltered);

    connectionUser.userRooms = [...userRoomsSet];

    console.log("connectionUser.userRooms: ", connectionUser.userRooms);

    socket.emit("user_rooms_updated", connectionUser?.userRooms);

    // لاگ برای بررسی
    logAllUsers(userSocketMap, rooms);

    const roomIds = new Set(
      Array.from(connectionUser?.userRooms || []).map((room) => room.roomId)
    );
    console.log("roomIds: ", roomIds);
    const result = Array.from(roomIds)
      .map((id) => {
        const r = rooms.get(id);
        if (!r) return null;
        return {
          roomId: id,
          roomPlayers: r.players,
          roomName: r.roomName,
          hostName: r.players[0]?.nickname || "نامشخص",
          hostId: r.hostId,
          roomGames: r.games,
          chat: r.chat,
          seen: r.seen,
        };
      })
      .filter(Boolean);

    io.to(socketId).emit("user_rooms_updated", result);

    const userRoomsArr = Array.from(roomIds)
      .map((roomIdItem) => {
        const room = rooms.get(roomIdItem);
        if (!room) return null;

        return {
          roomId: roomIdItem,
          hostName: room.players[0]?.nickname || "نامشخص",
          hostId: room.hostId,
          roomName: room.roomName,
          roomPlayers: room.players,
          chat: room.chat,
          seen: room.seen,
        };
      })
      .filter(Boolean);

    await connectionController.updateConnection(playerId, {
      currentRoomId: room.roomId,
      socketId: socketId,
      name: connectionUser.name,
      userRooms: userRoomsArr,
    });
  });
}

module.exports = {
  onDeleteRoom,
};
