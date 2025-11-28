const connectionController = require("../controllers/connectionController");
const gameController = require("../controllers/gameController");
const { logAllUsers } = require("../utils/logAllusers");
const {
  makePublicState,
  makePrivateState,
} = require("../games/feedTheKraken/utils/makeStates");
const {
  rooms,
  games,
  connectionsArr,
  userSocketMap,
} = require("../utils/memoryStore");

async function onRegister(socket, io) {
  const playerId = socket.user._id.toString();
  const name = socket.user.name || "نامشخص";
  console.log(`🔗 Registering player ${playerId} with name ${name}`);
  // console.log(rooms, games, connectionsArr, userSocketMap);
  // console.log("rooms, games, connectionsArr, userSocketMap");
  let connectionUser =
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
      name,
      socketId: socket.id,
      userRooms: new Set(),
      currentRoomId: null,
      currentGameId: null,
    };
    connectionsArr.set(playerId, connectionObject);
    connectionUser = connectionsArr.get(playerId);
  } else {
    connectionUser.socketId = socket.id;
  }

  connectionsArr.set(playerId, connectionUser);

  console.log("connectionUser onRegister");
  console.log(connectionUser);
  userSocketMap.set(playerId, socket.id);
  console.log(`📲 Player ${playerId} registered with socket ${socket.id}`);

  // فقط roomIdها را استخراج کن
  const roomIds = new Set(
    Array.from(connectionUser?.userRooms || []).map((room) => room.roomId)
  );
  // آپدیت socketId در room.players
  roomIds.forEach((roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      const player = room.players.find((p) => p.playerId === playerId);
      if (player) {
        player.socketId = socket.id;
        console.log(`🔁 Updated socketId in room ${roomId} for ${playerId}`);
      }
    }
  });

  const currentRoom = rooms.get(connectionUser.currentRoomId);
  if (!currentRoom) return;

  const userRoomsArr = Array.from(roomIds)
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

  socket.emit("user_rooms_updated", userRoomsArr);
  await connectionController.updateConnection(playerId, {
    userRooms: userRoomsArr,
  });

  logAllUsers(userSocketMap, rooms);
}

module.exports = {
  onRegister,
};
