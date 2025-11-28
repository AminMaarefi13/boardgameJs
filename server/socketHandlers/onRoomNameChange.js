const { logAllUsers } = require("../utils/logAllusers");
const roomController = require("../controllers/roomController");
const connectionController = require("../controllers/connectionController");
const {
  rooms,
  connectionsArr,
  userSocketMap,
} = require("../utils/memoryStore");

async function onRoomNameChange(roomNameState, roomId, socket, io) {
  const room = rooms.get(roomId);
  room.roomName = roomNameState;
  if (!room) {
    socket.emit("error", { message: "Room not found" });
    return;
  }

  // بروزرسانی دیتابیس
  try {
    await roomController.updateRoom(roomId, {
      roomName: roomNameState,
    });
  } catch (err) {
    console.error("❌ Failed to update room in DB:", err);
    socket.emit("error", { message: "خطا در تغییر نام روم." });
    return;
  }

  io.to(roomId).emit("room_name_updated", {
    roomId,
    roomName: roomNameState,
  });

  room.players.forEach(async (player) => {
    const playerId = player.playerId;
    const socketId = userSocketMap.get(playerId);

    const connectionUser = connectionsArr.get(playerId);
    //  ||
    // (await connectionController.getConnectionByPlayerId(playerId));
    if (!connectionUser) return;

    const userRooms = connectionUser.userRooms.filter(
      (room) => room.roomId !== roomId
    );

    const userRoomsSet = new Set(userRooms || []);
    userRoomsSet.add({
      roomId,
      hostName: room.hostName,
      hostId: room.hostId,
      roomName: room.roomName,
      roomPlayers: room.players,
      chat: room.chat,
      seen: room.seen,
    });
    connectionUser.userRooms = [...userRoomsSet];

    console.log(connectionUser.userRooms);
    // لاگ برای بررسی
    logAllUsers(userSocketMap, rooms);

    const roomIds = new Set(
      Array.from(connectionUser?.userRooms || []).map((room) => room.roomId)
    );
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

    await connectionController.updateConnection(playerId, {
      currentRoomId: room.roomId,
      socketId: socketId,
      name: connectionUser.name,
      userRooms: userRoomsArr,
    });
  });
}

module.exports = {
  onRoomNameChange,
};
