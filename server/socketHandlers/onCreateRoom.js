const { logAllUsers } = require("../utils/logAllusers");
const roomController = require("../controllers/roomController");
const connectionController = require("../controllers/connectionController");
const chatController = require("../controllers/chatController");

const {
  rooms,
  connectionsArr,
  userSocketMap,
  chats,
} = require("../utils/memoryStore");

async function onCreateRoom(socket, io) {
  const playerId = socket.user._id.toString();
  const name = socket.user.name || "نامشخص";
  console.log(`🔗 Creating room for player ${playerId} with name ${name}`);
  // console.log(rooms, connectionsArr, userSocketMap);
  // console.log("rooms, connectionsArr, userSocketMap");
  const connectionUser =
    connectionsArr.get(playerId) ||
    (await connectionController.getConnectionByPlayerId(playerId));
  const roomId = Math.random().toString(36).substring(2, 8);

  const newPlayer = {
    nickname: name,
    playerId: playerId,
    socketId: socket.id,
    isReady: false,
  };

  const room = {
    roomId,
    players: [newPlayer],
    roomName: `روم ${roomId}`,
    hostName: name,
    hostId: playerId,
    games: [],
    chat: [],
    seen: {},
  };

  rooms.set(roomId, room);
  connectionUser.currentRoomId = roomId;
  connectionUser.currentGameId = null;
  // ذخیره در دیتابیس
  try {
    await roomController.createRoom(
      roomId,
      playerId,
      name,
      [
        {
          playerId,
          nickname: name,
          isReady: false,
          socketId: socket.id,
        },
      ],
      []
    );
  } catch (err) {
    console.error("❌ Failed to persist room:", err);
    socket.emit("error", { message: "خطا در ساختن روم." });
    return;
  }

  // const chat = {
  //   roomId,
  //   gameId: "",
  //   chatId: roomId,
  //   hostId: room.hostId,
  //   roomName: room.roomName,
  //   hostName: room.hostName,
  //   players: [newPlayer],
  //   messageList: [],
  // };

  // chats.set(roomId, chat);
  // // ذخیره در دیتابیس
  // try {
  //   await chatController.createChat(chat);
  // } catch (err) {
  //   console.error("❌ Failed to persist chat:", err);
  //   socket.emit("error", { message: "خطا در ساختن چت." });
  //   return;
  // }

  socket.join(roomId);
  socket.emit("room_created", {
    roomId,
    roomName: room.roomName,
    roomPlayers: room.players,
    hostName: room.hostName,
    hostId: room.hostId,
    games: room.games,
    chat: room.chat,
    seen: room.seen,
  });

  // اطمینان از وجود Set برای roomIds و اضافه کردن roomId جدید
  // تبدیل آرایه به Set موقت، افزودن roomId و تبدیل مجدد به آرایه
  const userRoomsSet = new Set(connectionUser.userRooms || []);
  userRoomsSet.add({
    roomId,
    hostName: name,
    hostId: playerId,
    roomName: room.roomName,
    roomPlayers: room.players,
    chat: room.chat,
    seen: room.seen,
  });
  connectionUser.userRooms = [...userRoomsSet];

  logAllUsers(userSocketMap, rooms);

  socket.emit("user_rooms_updated", connectionUser?.userRooms);
  // console.log("userRoomsArr");
  // console.log(userRoomsArr);
  await connectionController.updateConnection(playerId, {
    currentRoomId: connectionUser.currentRoomId,
    currentGameId: connectionUser.currentGameId,
    socketId: socket.id,
    userRooms: connectionUser?.userRooms,
    name: connectionUser.name,
  });
}

module.exports = {
  onCreateRoom,
};
