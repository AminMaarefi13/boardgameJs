import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../network/socket";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [userState, setUserState] = useState({
    role: "",
    knownRoles: [],
    characterCard: "",
    privatePhaseData: {},
  });
  const [connectionState, setConnectionState] = useState({
    name: "",
    playerId: "",
    socketId: "",
    currentRoomId: "",
    currentGameId: "",
    currentGame: null,
    hostName: "",
    hostId: "",
    isHost: "",
    roomPlayers: [],
    userRooms: [], // list of { roomId, host, players, hostId }
    roomGames: [],
    chat: [],
    seen: {},
  });
  const [phaseDataState, setPhaseDataState] = useState({});
  const [energy, setEnergy] = useState(10);
  const [subscription, setSubscription] = useState(false);
  const [adSessionCount, setAdSessionCount] = useState(0);

  useEffect(() => {
    function handleRoomGamesUpdated({ games }) {
      console.log(games);
      setConnectionState((prev) => ({
        ...prev,
        roomGames: games,
      }));
    }
    socket.on("room_games_updated", handleRoomGamesUpdated);
    return () => {
      socket.off("room_games_updated", handleRoomGamesUpdated);
    };
  }, [setConnectionState]);

  useEffect(() => {
    if (playerId && name) {
      socket.emit("get_energy", (data) => {
        console.log(data);
        setEnergy(data.energy);
        setSubscription(data.subscription);
        if (typeof data.adSessionCount === "number")
          setAdSessionCount(data.adSessionCount);
      });
    }
  }, []);

  // تابع برای دریافت پاداش تبلیغ
  // rewardEnergy
  const rewardEnergy = (cb) => {
    socket.emit("reward_energy", (data) => {
      if (typeof data.energy === "number") setEnergy(data.energy);
      if (typeof data.adSessionCount === "number")
        setAdSessionCount(data.adSessionCount);
      if (cb) cb(data); // اگر نیاز داری کل آبجکت را به callback بده
    });
  };

  // تابع برای آپدیت سابسکریپشن (مثلاً بعد از خرید)
  const updateSubscription = (val) => {
    setSubscription(val);
    socket.emit("update_subscription", {
      subscription: val,
    });
  };
  const { playerId, name, currentRoomId, currentGameId } = connectionState;

  useEffect(() => {
    function handleError(msg) {
      alert(msg); // یا هر روش نمایش پیام دلخواه
    }
    socket.on("error_message", handleError);
    return () => {
      socket.off("error_message", handleError);
    };
  }, []);

  // ✅ هربار که اطلاعات هویت کامل شد
  useEffect(() => {
    if (playerId && name) {
      socket.emit("register");
      socket.emit("get_user_rooms", (rooms) => {
        setConnectionState((prev) => ({ ...prev, userRooms: rooms }));
      });
    }
    socket.emit("get_all_games", { roomId: currentRoomId }, (games) => {
      console.log(games);
      setConnectionState((prev) => ({ ...prev, roomGames: games }));
    });
  }, [playerId, name, currentRoomId]);

  // ✅ هربار که roomId و gameId ست شد، وضعیت بازی درخواست کن
  useEffect(() => {
    socket.on(
      "room_created",
      ({ roomId, roomName, roomPlayers, hostName, hostId }) => {
        setConnectionState((prev) => ({
          ...prev,
          roomPlayers: roomPlayers,
          currentRoomId: roomId,
          roomName: roomName,
          hostName: hostName,
          hostId: hostId,
          chat: [],
          seen: {},
        }));
      }
    );
    socket.on(
      "joined_room",
      ({
        roomId,
        roomName,
        roomPlayers,
        hostName,
        hostId,
        roomGames,
        chat,
        seen,
      }) => {
        setConnectionState((prev) => ({
          ...prev,
          roomPlayers: roomPlayers,
          roomName: roomName,
          currentRoomId: roomId,
          hostName: hostName,
          hostId: hostId,
          roomGames,
          chat,
          seen,
        }));
      }
    );

    socket.on("players_updated", ({ roomId, roomPlayers }) => {
      if (currentRoomId === roomId) {
        setConnectionState((prev) => ({
          ...prev,
          roomPlayers: roomPlayers,
          currentRoomId: roomId,
        }));
      }
    });

    socket.on("user_rooms_updated", (rooms) => {
      setConnectionState((prev) => ({
        ...prev,
        userRooms: rooms,
      }));
    });

    socket.on("room_updated", (room) => {
      console.log(room);
      console.log(room.games);

      setConnectionState((prev) => ({
        ...prev,
        roomPlayers: room.players,
        roomName: room.roomName,
        hostName: room.hostName,
        hostId: room.hostId,
        roomGames: room.games,
        chat: room.chat,
        seen: room.seen,
      }));
    });

    return () => {
      socket.off("room_created");
      socket.off("players_updated");
      socket.off("user_rooms_updated");
    };
  }, [currentGameId, currentRoomId, playerId, userState]);

  return (
    <AppContext.Provider
      value={{
        userState,
        setUserState,
        connectionState,
        setConnectionState,
        phaseDataState,
        setPhaseDataState,
        energy,
        setEnergy,
        subscription,
        setSubscription,
        adSessionCount,
        setAdSessionCount,
        rewardEnergy,
        updateSubscription,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
