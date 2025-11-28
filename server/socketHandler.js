const { onRegister } = require("./socketHandlers/onRegister.js");
const { onCreateRoom } = require("./socketHandlers/onCreateRoom.js");
const { onJoinRoom } = require("./socketHandlers/onJoinRoom.js");
const { onGetUserRooms } = require("./socketHandlers/onGetUserRooms.js");
const { onGetRoomState } = require("./socketHandlers/onGetRoomState.js");
const { onToggleReady } = require("./socketHandlers/onToggleReady.js");
const { onStartGame } = require("./socketHandlers/onStartGame.js");
const {
  onRequestGameState,
} = require("./socketHandlers/onRequestGameState.js");
const { onGetAllGames } = require("./socketHandlers/onGetAllGames.js");
const { onGetGameStatus } = require("./socketHandlers/onGetGameStatus.js");
const { onReconnectPlayer } = require("./socketHandlers/onReconnectPlayer.js");
const {
  sendFriendRequest,
  getFriendsData,
  respondFriendRequest,
  cancelFriendRequest,
} = require("./socketHandlers/friends");

const {
  inviteFriendToRoom,
  getRoomInvites,
  respondRoomInvite,
  cancelRoomInvite,
} = require("./socketHandlers/roomInvite");

const { onDisconnect } = require("./socketHandlers/onDisconnect.js");
const {
  rooms,
  games,
  connectionsArr,
  userSocketMap,
} = require("./utils/memoryStore");

const gameController = require("./controllers/gameController");
const connectionController = require("./controllers/connectionController");

const {
  proceedToNextPhase,
} = require("./games/feedTheKraken/proceedToNextPhase.js");
const { getValidGameAndRoom } = require("./utils/getValidGameAndRoom.js");
const { updateAndBroadcastGame } = require("./utils/updateAndBroadcastGame.js");
const {
  initializeMemoryAndRedis,
} = require("./utils/initializeMemoryAndRedis.js");
const User = require("./models/UserModel.js");
const jwt = require("jsonwebtoken");
const { onLogout } = require("./socketHandlers/onLogout.js");
const { getPendingRoomInvites } = require("./socketHandlers/roomInvite.js");
const { onCreateGame } = require("./socketHandlers/onCreateGame.js");
const { onEnterGameLobby } = require("./socketHandlers/onEnterGameLobby.js");

const { gameControllers } = require("./utils/gameControllers.js");
const { phaseHandlerMap } = require("./utils/phaseHandlerMap.js");
const { onRoomNameChange } = require("./socketHandlers/onRoomNameChange.js");
const { onDeleteRoom } = require("./socketHandlers/onDeleteRoom.js");
const { onSendMessage } = require("./socketHandlers/onSendMessage.js");
const {
  onRequestRoomState,
} = require("./socketHandlers/onRequestRoomState.js");
const { onUpdateLastSeen } = require("./socketHandlers/onUpdateLastSeen.js");

initializeMemoryAndRedis(rooms, games).then(() => {
  console.log("Memory and Redis initialized from DB");
  // console.log("rooms", rooms);
  // console.log("games", games);
});

function socketHandler(io) {
  console.log("Inside socket io");
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    console.log("token");
    console.log(token);
    if (!token) return next(new Error("Authentication error: No token"));
    try {
      console.log("token:", token);
      console.log("JWT_SECRET:", process.env.JWT_SECRET);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      process.env.JWT_SECRET;
      console.log(decoded);
      const user = await User.findById(decoded.id);
      console.log("user", user);

      if (!user) return next(new Error("Authentication error: User not found"));
      socket.user = user; // اطلاعات کاربر را روی سوکت ذخیره کن
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(
      "⚡ New socket connected:",
      socket.id,
      socket.user.name,
      socket.user._id
    );
    const playerId = socket.user._id.toString();
    userSocketMap.set(playerId, socket.id);

    // به دوستان اطلاع بده که این کاربر آنلاین شد
    const user = await User.findById(playerId).populate("friends", "_id");
    user.friends.forEach((friend) => {
      const friendSocketId = userSocketMap.get(friend._id.toString());
      if (friendSocketId) {
        io.to(friendSocketId).emit("friend_online", { playerId });
      }
    });

    socket.on("register", async () => {
      onRegister(socket, io);
    });

    socket.on("create_room", async () => {
      onCreateRoom(socket, io);
    });

    socket.on("join_room", async ({ roomId }) => {
      onJoinRoom(roomId, socket, io);
    });

    socket.on("room_name_change", async ({ roomNameState, roomId }) => {
      onRoomNameChange(roomNameState, roomId, socket, io);
    });

    socket.on("delete_room", async ({ roomId }) => {
      onDeleteRoom(roomId, socket, io);
    });

    socket.on("get_user_rooms", (callback) => {
      onGetUserRooms(socket, callback);
    });

    socket.on("get_room_state", (roomId, callback) => {
      onGetRoomState(roomId, callback);
    });

    socket.on("toggle_ready", ({ roomId, gameId }, callback) => {
      onToggleReady(socket, roomId, gameId, io, callback);
    });

    socket.on("reconnect-player", () => {
      onReconnectPlayer(socket, io);
    });

    socket.on("create_game", ({ roomId, type }, cb) => {
      onCreateGame(roomId, type, socket, io, cb);
    });

    socket.on("start_game", async ({ roomId, gameId }) => {
      onStartGame(roomId, gameId, socket, io);
    });
    socket.on("request_game_state", async (gameId) => {
      onRequestGameState(gameId, socket, io);
    });

    socket.on("get_all_games", async (roomId, callback) => {
      onGetAllGames(roomId, callback);
    });

    socket.on("get_game_status", async (roomId, callback) => {
      onGetGameStatus(roomId, callback);
    });

    socket.on("phase_seen", async ({ gameId }) => {
      const { gameState } = getValidGameAndRoom({ gameId, games, rooms });
      const type = gameState.type;
      const handler = phaseHandlerMap[type]?.onPhaseSeen;

      const controller = gameControllers[type];
      if (handler) {
        await handler({
          gameId,
          socket,
          io,
          games,
          rooms,
          userSocketMap,
          gameController: controller,
        });
      }
    });

    socket.on("phase_confirm", async ({ gameId, payload }) => {
      const { gameState } = getValidGameAndRoom({ gameId, games, rooms });
      console.log("gameId phase_confirm");
      console.log(gameId);
      console.log("payload phase_confirm");
      console.log(payload);
      const type = gameState.type;
      const handler = phaseHandlerMap[type]?.onPhaseConfirm;
      if (handler) {
        await handler({
          gameId,
          socket,
          io,
          games,
          rooms,
          userSocketMap,
          payload,
        });
      }
    });

    // هندل گرفتن انرژی
    socket.on("get_energy", async (callback) => {
      const playerId = socket.user._id.toString();
      const name = socket.user.name || "نامشخص";
      console.log(`🔗 Player ${playerId} (${name}) is requesting energy`);
      const data = await connectionController.getEnergyAndSubscription(
        playerId
      );
      callback(data);
    });

    // فایل: Server/socketHandler.js
    socket.on("consume_energy", async ({ amount }, callback) => {
      const playerId = socket.user._id.toString();
      const name = socket.user.name || "نامشخص";
      console.log(
        `🔗 Player ${playerId} (${name}) is consuming energy: ${amount}`
      );
      const user = await connectionController.consumeEnergy(playerId, amount);
      callback({ energy: user ? user.energy : null });
    });

    // هندل پاداش تبلیغ
    socket.on("reward_energy", async (callback) => {
      const playerId = socket.user._id.toString();
      const name = socket.user.name || "نامشخص";
      console.log(
        `🔗 Player ${playerId} (${name}) is requesting energy reward`
      );
      const result = await connectionController.rewardEnergy(playerId);
      callback(result); // مستقیماً آبجکت را برگردان
    });

    // هندل آپدیت سابسکریپشن
    socket.on("update_subscription", async ({ subscription }) => {
      const playerId = socket.user._id.toString();
      const name = socket.user.name || "نامشخص";
      console.log(
        `🔗 Player ${playerId} (${name}) is updating subscription: ${JSON.stringify(
          subscription
        )}`
      );
      await connectionController.updateSubscription(playerId, subscription);
    });

    socket.on("logout", async () => {
      // به دوستان اطلاع بده که این کاربر آفلاین شد
      const user = await User.findById(playerId).populate("friends", "_id");
      user.friends.forEach((friend) => {
        const friendSocketId = userSocketMap.get(friend._id.toString());
        if (friendSocketId) {
          io.to(friendSocketId).emit("friend_offline", { playerId });
        }
      });
      onLogout(socket, connectionsArr, rooms, userSocketMap);
    });

    socket.on("send_friend_request", (targetId, callback) =>
      sendFriendRequest(socket, targetId, callback)
    );
    socket.on("get_friends_data", (callback) =>
      getFriendsData(socket, callback)
    );
    socket.on("respond_friend_request", (data, callback) =>
      respondFriendRequest(socket, data, callback)
    );
    socket.on("cancel_friend_request", (targetId, callback) =>
      cancelFriendRequest(socket, targetId, callback)
    );

    socket.on("invite_friend_to_room", (data, cb) =>
      inviteFriendToRoom(socket, data, cb)
    );
    socket.on("get_room_invites", (cb) => getRoomInvites(socket, cb));
    socket.on("respond_room_invite", (data, cb) =>
      respondRoomInvite(socket, io, data, cb)
    );
    socket.on("cancel_room_invite", (data, cb) =>
      cancelRoomInvite(socket, data, cb)
    );
    socket.on("get_pending_room_invites", (data, cb) =>
      getPendingRoomInvites(socket, data, cb)
    );

    socket.on("enter_game_lobby", ({ roomId, gameId }, callback) => {
      onEnterGameLobby(socket, roomId, gameId, callback);
    });
    socket.on("disconnect", async () => {
      const user = await User.findById(playerId).populate("friends", "_id");
      user.friends.forEach((friend) => {
        const friendSocketId = userSocketMap.get(friend._id.toString());
        if (friendSocketId) {
          io.to(friendSocketId).emit("friend_offline", { playerId });
        }
      });

      userSocketMap.delete(playerId);
    });
    socket.on("send_message", ({ roomId, gameId, type, message, time }) => {
      onSendMessage(socket, io, roomId, gameId, type, message, time);
    });
    socket.on("update_last_seen", ({ roomId, gameId, lastSeenIdx }) => {
      onUpdateLastSeen(socket, io, roomId, gameId, lastSeenIdx);
    });

    // socket.on("request_room_state", ({ roomId }) => {
    //   console.log(roomId);
    //   onRequestRoomState(socket, io, roomId);
    // });
  });
}

module.exports = {
  socketHandler,
};
