const connectionController = require("../controllers/connectionController");
const {
  rooms,
  connectionsArr,
  userSocketMap,
} = require("../utils/memoryStore");
async function onReconnectPlayer(socket, io) {
  const playerId = socket.user._id.toString();
  console.log(`🔗 Reconnecting player ${playerId} with socket ${socket.id}`);
  // console.log(rooms, connectionsArr, userSocketMap);
  // console.log("rooms, connectionsArr, userSocketMap");
  if (!playerId) return;

  const connectionUser =
    connectionsArr.get(playerId) ||
    (await connectionController.getConnectionByPlayerId(playerId));

  console.log(`🔁 Updated socketId in connection for ${playerId}`);
  if (!connectionUser) {
    try {
      await connectionController.createConnection(playerId, socket.id);
    } catch (err) {
      console.error("❌ Failed to create user:", err);
      socket.emit("error", { message: "خطا در ساختن کاربر." });
      return;
    }
    const connectionObject = {
      playerId,
      socketId: socket.id,
      userRooms: new Set(),
      currentRoomId: null,
      currentGameId: null,
    };
    connectionsArr.set(playerId, connectionObject);
  } else {
    connectionUser.socketId = socket.id;
  }
  connectionsArr.set(playerId, connectionUser);
  const previousSocketId = userSocketMap.get(playerId);

  if (previousSocketId && previousSocketId !== socket.id) {
    console.log(
      `Replacing old socket ${previousSocketId} with new one ${socket.id} for player ${playerId}`
    );
    const oldSocket = io.sockets.sockets.get(previousSocketId);
    if (oldSocket) oldSocket.disconnect(true);
  }

  userSocketMap.set(playerId, socket.id);
  // Join previous rooms again
  // فقط roomIdها را استخراج کن
  const roomIds = new Set(
    Array.from(connectionUser?.userRooms || []).map((room) => room.roomId)
  );

  const userRoomsArr = Array.from([...roomIds])
    .map((roomId) => {
      console.log("roomId", roomId);
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

  if (roomIds && roomIds.size > 0) {
    roomIds.forEach((roomId) => {
      socket.join(roomId);

      const room = rooms.get(roomId);
      if (room) {
        const player = room.players.find((p) => p.playerId === playerId);
        if (player) {
          player.socketId = socket.id;
        }
      }
    });
  }

  console.log("userRoomsArr ssssssssss", userRoomsArr);
  socket.emit("user_rooms_updated", userRoomsArr);
  // Optionally send the list of rooms the player is in
  // socket.emit("player_rooms", Array.from(roomIds || []));
}

module.exports = {
  onReconnectPlayer,
};
