const connectionController = require("../controllers/connectionController");
const { logAllUsers } = require("../utils/logAllusers");
const roomController = require("../controllers/roomController");
const {
  rooms,
  connectionsArr,
  userSocketMap,
} = require("../utils/memoryStore");

async function onRequestRoomState(socket, io, roomId) {
  const playerId = socket.user._id.toString();
  const name = socket.user.name || "نامشخص";
  console.log(
    `🔗 Player ${playerId} (${name}) has requested messages for room ${roomId}`
  );

  const room = rooms.get(roomId);
  console.log("roomssssssssssssss:", room);
  if (!room) {
    socket.emit("error", { message: "Room not found" });
    return;
  }

  io.to(socket.id).emit("room_state_requested", room);
}

module.exports = {
  onRequestRoomState,
};
