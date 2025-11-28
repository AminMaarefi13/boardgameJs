import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../network/socket";
import { useState } from "react";
import RoomInvite from "../components/Room/RoomInvite";
import RoomInvitesInbox from "../components/Room/RoomInvitesInbox";
import GameLobby from "../components/Room/GameLobby";
import CreateGameBox from "../components/Room/CreateGameBox";
import { getStatusIcon } from "../utils/getStatusIcon";
import { useGameContext } from "../context/GameContext";
import { useAppContext } from "../context/AppContext";
import GAME_TYPES from "../UI/gameTypes";
import GAME_STATUS_LABELS from "../UI/gameStatusLabels";
import EditRoomNameOverlay from "../components/Room/EditRoomNameOverlay";

function LobbyPage() {
  const [roomIdInputState, setRoomIdInputState] = useState("");
  const [visibleGamesCount, setVisibleGamesCount] = useState(5);

  const navigate = useNavigate();
  const { setUserState, connectionState, setConnectionState } = useAppContext();
  const { gameState, setGameState } = useGameContext();

  const {
    name,
    playerId,
    currentRoomId,
    currentGameId,
    currentGame,
    hostId,
    hostName,
    roomName,
    userRooms,
    roomGames,
    roomPlayers,
  } = connectionState;

  const deleteRoomHandler = () => {
    socket.emit("delete_room", {
      roomId: currentRoomId,
    });
    setConnectionState((prev) => ({
      ...prev,
      currentRoomId: null,
    }));
  };
  // بازیابی اطلاعات ذخیره شده
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedId = localStorage.getItem("playerId");
    if (savedName && !name)
      setConnectionState((prev) => ({ ...prev, name: savedName }));
    if (savedId && !playerId)
      setConnectionState((prev) => ({ ...prev, playerId: savedId }));

    if (!savedName && !name) {
      alert("لطفاً ابتدا وارد شوید.");
      navigate("/login");
      return;
    }
  }, [name, playerId, setConnectionState]);

  useEffect(() => {
    socket.on("game_created", ({ game }) => {
      console.log(game);
      setConnectionState((prev) => ({
        ...prev,
        currentGameId: game.gameId,
        currentGame: game,
      }));
    });

    return () => {
      socket.off("game_created");
    };
  }, []);

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
    function handleGamePlayersUpdated({ gameId, gamePlayers }) {
      console.log(handleGamePlayersUpdated);
      if (currentGame && currentGame.gameId === gameId) {
        setConnectionState((prev) => ({
          ...prev,
          currentGame: {
            ...prev.currentGame,
            players: gamePlayers,
          },
        }));
      }
    }
    socket.on("game_players_updated", handleGamePlayersUpdated);
    return () => {
      socket.off("game_players_updated", handleGamePlayersUpdated);
    };
  }, [currentGame, setConnectionState]);

  // ثبت بازیکن و دریافت روم‌ها و بازی‌ها
  useEffect(() => {
    const registerPlayer = () => {
      if (playerId && name) {
        console.log(playerId);
        console.log(name);
        socket.emit("register");
        socket.emit("get_user_rooms", (rooms) => {
          setConnectionState((prev) => ({ ...prev, userRooms: rooms }));
        });
        socket.emit("get_all_games", { roomId: currentRoomId }, (roomGames) => {
          setConnectionState((prev) => ({ ...prev, roomGames }));
        });
      }
    };

    if (socket.connected) {
      registerPlayer();
    }

    socket.on("connect", registerPlayer);

    return () => {
      socket.off("connect", registerPlayer);
    };
  }, [playerId, name, currentRoomId, currentGameId, setConnectionState]);

  useEffect(() => {
    const onRoomCreated = ({
      roomId,
      roomName,
      roomPlayers,
      hostName,
      hostId,
    }) => {
      localStorage.setItem("currentRoomId", roomId);
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
    };

    const onPlayersUpdated = ({ roomId, roomPlayers }) => {
      if (currentRoomId === roomId) {
        setConnectionState((prev) => ({
          ...prev,
          roomPlayers: roomPlayers,
          currentRoomId: roomId,
        }));
      }
    };

    const onRoomNameUpdated = ({ roomId, roomName }) => {
      if (currentRoomId === roomId) {
        setConnectionState((prev) => ({
          ...prev,
          roomName,
          currentRoomId: roomId,
        }));
      }
    };

    const onUserRoomsUpdated = (rooms) => {
      setConnectionState((prev) => ({ ...prev, userRooms: rooms }));
    };

    socket.on("room_created", onRoomCreated);
    socket.on("players_updated", onPlayersUpdated);
    socket.on("user_rooms_updated", onUserRoomsUpdated);
    socket.on("room_name_updated", onRoomNameUpdated);

    // socket.on("game_status_updated", onGameStatusUpdated);
    socket.on("game_started", (gameId, gamePlayer) => {
      console.log(gamePlayer);
      if (gamePlayer) {
        if (currentGameId === gameId || !currentGameId) {
          console.log(gameState);

          console.log("بازی شروع شد");
          console.log(gameId);
          handleStartGame(gameId);
        }
      } else {
        console.log(gameState);
        // alert("بازی شروع شد و شما عضو این بازی نیستید!");
        console.log(currentGameId === gameId);
        if (currentGameId === gameId) {
          setConnectionState((prev) => ({
            ...prev,
            currentGameId: null,
            currentGame: null,
          }));
          localStorage.removeItem("currentGameId");
          localStorage.removeItem("currentGame");
        }
      }
    });

    socket.on("gameState", (state) => {
      console.log("📦 gameState وضعیت بازی دریافت شد", state);
      console.log("currentGameId: ", currentGameId);
      console.log("state.publicState.gameId: ", state.publicState.gameId);
      // if (currentGameId !== state.publicState.gameId) return;
      if (currentGameId) return;
      if (state?.publicState.type === "feedTheKraken") {
        setGameState(state.publicState);
        setUserState((prev) => ({ ...prev, ...state.privateState }));
        // setConnectionState((prev) => ({
        //   ...prev,
        //   currentRoomId: state.publicState.roomId,
        //   currentGameId: state.publicState.gameId,
        // }));
        // localStorage.setItem("currentGameId", state.publicState.gameId);
      } else if (state?.publicState.type === "mineSweeper") {
        console.log("MineSweeper game state received:");
        setGameState(state.publicState);
        // setConnectionState((prev) => ({
        //   ...prev,
        //   currentRoomId: state.publicState.roomId,
        //   currentGameId: state.publicState.gameId,
        // }));
        // localStorage.setItem("currentGameId", state.publicState.gameId);
      } else if (state?.publicState.type === "splendor") {
        console.log("Splendor game state received:");
        setGameState(state.publicState);
        // setConnectionState((prev) => ({
        //   ...prev,
        //   currentRoomId: state.publicState.roomId,
        //   currentGameId: state.publicState.gameId,
        // }));
        // localStorage.setItem("currentGameId", state.publicState.gameId);
      } else if (state?.publicState.type === "splendorDuel") {
        console.log("Splendor Duel game state received:");
        setGameState(state.publicState);
        // setConnectionState((prev) => ({
        //   ...prev,
        //   currentRoomId: state.publicState.roomId,
        //   currentGameId: state.publicState.gameId,
        // }));
        // localStorage.setItem("currentGameId", state.publicState.gameId);
      }
      // navigate(`/game/${state.publicState.gameId}`);
    });

    socket.on("game_state_requested", (state) => {
      console.log("📦 game_state_requested lobby وضعیت بازی دریافت شد", state);
      console.log("currentGameId: ", currentGameId);
      console.log("state.publicState.gameId: ", state.publicState.gameId);
      // if (currentGameId) return;
      // if (currentGameId && currentGameId !== state.publicState.gameId) return;
      if (state?.publicState.type === "feedTheKraken") {
        setGameState(state.publicState);
        setUserState((prev) => ({ ...prev, ...state.privateState }));
        // setConnectionState((prev) => ({
        //   ...prev,
        //   currentRoomId: state.publicState.roomId,
        //   currentGameId: state.publicState.gameId,
        // }));
        // // navigate(`/game/${state.publicState.gameId}`);
        // localStorage.setItem("currentGameId", state.gameId);
      } else if (state?.publicState.type === "mineSweeper") {
        console.log("MineSweeper game state received:", state.publicState);
        setGameState(state.publicState);
        // setConnectionState((prev) => ({
        //   ...prev,
        //   currentRoomId: state.publicState.roomId,
        //   currentGameId: state.publicState.gameId,
        // }));
        // console.log(state.publicState.gameId);
        // console.log(state.publicState);
        // // navigate(`/game/${state.publicState.gameId}`);
        // localStorage.setItem("currentGameId", state.publicState.gameId);
      } else if (state?.publicState.type === "splendor") {
        console.log("Splendor game state received:", state.publicState);
        setGameState(state.publicState);
        // setConnectionState((prev) => ({
        //   ...prev,
        //   currentRoomId: state.publicState.roomId,
        //   currentGameId: state.publicState.gameId,
        // }));
        // console.log(state.publicState.gameId);
        // console.log(state.publicState);
        // // navigate(`/game/${state.publicState.gameId}`);
        // localStorage.setItem("currentGameId", state.publicState.gameId);
      } else if (state?.publicState.type === "splendorDuel") {
        console.log("Splendor Duel game state received:", state.publicState);
        setGameState(state.publicState);
        // setConnectionState((prev) => ({
        //   ...prev,
        //   currentRoomId: state.publicState.roomId,
        //   currentGameId: state.publicState.gameId,
        // }));
        // console.log(state.publicState.gameId);
        // console.log(state.publicState);
        // // navigate(`/game/${state.publicState.gameId}`);
        // localStorage.setItem("currentGameId", state.publicState.gameId);
      }

      // navigate("/game");
    });

    return () => {
      socket.off("room_created", onRoomCreated);
      socket.off("players_updated", onPlayersUpdated);
      socket.off("room_name_updated", onRoomNameUpdated);
      socket.off("user_rooms_updated", onUserRoomsUpdated);
      socket.off("game_state_requested");
    };
  }, [setGameState, setUserState, setConnectionState, currentRoomId]);

  const handleSelectGame = (gameId) => {
    console.log("🧩 انتخاب بازی:", gameId);
    console.log(playerId);
    console.log(currentRoomId);
    console.log(localStorage.getItem("playerId"));
    console.log(localStorage.getItem("currentRoomId"));
    localStorage.setItem("currentGameId", gameId);
    socket.emit(
      "enter_game_lobby",
      {
        gameId,
        roomId: currentRoomId,
      },
      (res) => {
        console.log("🥨 نتیجه ورود به بازی:", res);
        if (res?.success === false) {
          alert(res.message || "بازی پیدا نشد.");
          return;
        }
        if (res?.game) {
          console.log("res.game");
          setConnectionState((prev) => ({
            ...prev,
            currentGameId: res.game.gameId,
            currentGame: res.game,
          }));
        }
      }
    );
    // socket.emit("join_game", {
    //   gameId,
    //   roomId: localStorage.getItem("currentRoomId"),
    //   playerId: localStorage.getItem("playerId"),
    // });
    // console.log(gameId);
    // socket.emit("request_game_state", gameId);
  };

  const handleStartGame = (gameId) => {
    console.log("🍔 شروع بازی:", gameId);
    localStorage.setItem("currentGameId", gameId);
    socket.emit("request_game_state", gameId);
    navigate(`/game/${gameId}`);
  };

  const handleCreateRoom = () => {
    if (!name || !playerId) return alert("نام و آیدی را وارد کنید.");
    setConnectionState((prev) => ({ ...prev, isHost: true }));
    localStorage.setItem("name", name);
    localStorage.setItem("playerId", playerId);
    socket.emit("create_room");
  };

  const handleJoinRoom = () => {
    if (!name || !playerId || !roomIdInputState)
      return alert("همه فیلدها را پر کنید.");
    setConnectionState((prev) => ({ ...prev, isHost: false }));
    localStorage.setItem("name", name);
    localStorage.setItem("playerId", playerId);
    socket.emit("join_room", { roomId: roomIdInputState });
    socket.emit("request_room_state", { roomId: roomIdInputState });
  };

  const handleEnterRoom = (roomId) => {
    localStorage.setItem("currentRoomId", roomId);

    socket.emit("join_room", { roomId });

    socket.emit("get_room_state", roomId, (room) => {
      if (room) {
        console.log(room.roomGames);
        setConnectionState((prev) => ({
          ...prev,
          currentRoomId: roomId,
          roomPlayers: room.roomPlayers,
          hostId: room.hostId || "نامشخص",
          isHost: room.hostId === playerId,
          roomGames: room.roomGames,
          chat: room.chat,
          seen: room.seen,
        }));
      }
    });
    socket.emit("request_room_state", { roomId: roomId });
  };

  const handleBackToLobby = () => {
    setConnectionState((prev) => ({
      ...prev,
      currentRoomId: null,
      currentGameId: null,
      roomPlayers: [],
      hostName: null,
      hostId: null,
    }));
    localStorage.removeItem("currentRoomId");
    localStorage.removeItem("currentGameId");
    setVisibleGamesCount(5);
  };
  // console.log(roomGames);

  return (
    <div
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center mt-6 px-1 sm:px-2 md:px-4 py-4"
      style={{ direction: "rtl" }}
    >
      {!currentGameId && !currentGame && (
        <div className="w-full max-w-6xl bg-gray-800 p-2 sm:p-4 md:p-6 rounded-md shadow-2xl space-y-4">
          {/* <button
          className="w-full py-3 mb-4 bg-gray-500 hover:bg-gray-600 rounded-md font-semibold"
          onClick={() => window.location.reload()}
        >
          🔄 ریلود صفحه
        </button> */}
          {currentRoomId && !currentGameId && (
            <h2 className="text-2xl font-bold mb-4 text-center">
              🎮 ورود به بازی
            </h2>
          )}

          {currentRoomId && !currentGameId && (
            <div className="w-full h-16 flex justify-center items-center">
              <div className="w-70 h-8 flex justify-center items-center  text-center text-xl font-bold">
                {roomName}
              </div>
              {hostId === playerId && (
                <EditRoomNameOverlay lay roomId={currentRoomId} />
              )}
            </div>
          )}

          {/* <div className="mb-2">!{name} خوش اومدی</div>
        <div className="mb-4">{playerId} :آیدی</div> */}

          {!currentRoomId && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="w-full mt-3 px-4 py-3 rounded-md bg-gray-700 placeholder-gray-400 text-white"
                  placeholder="کد روم برای ورود"
                  value={roomIdInputState}
                  onChange={(e) => setRoomIdInputState(e.target.value)}
                />
                <button
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-md font-bold"
                  onClick={handleJoinRoom}
                >
                  ورود به روم
                </button>
              </div>
            </>
          )}

          {!currentRoomId && (
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-bold"
              onClick={handleCreateRoom}
            >
              ساخت روم
            </button>
          )}

          <RoomInvitesInbox />

          {userRooms?.length > 0 && !currentRoomId && (
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-3">📁 روم‌های شما:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {userRooms.map((room) => {
                  console.log(room);
                  return (
                    <li
                      key={room.roomId}
                      className="bg-gray-700 hover:bg-gray-600 p-3 rounded-md cursor-pointer transition flex justify-between items-center"
                      onClick={() => handleEnterRoom(room.roomId)}
                    >
                      <div className="text-lg text-blue-200">
                        {room.roomName}
                      </div>
                      <div className="text-lg text-blue-200">
                        {room.roomPlayers.length} بازیکن
                      </div>
                      <div>
                        <span className="text-xs text-gray-200">میزبان: </span>
                        <span className="text-xs text-blue-200">
                          {room.hostName}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {currentRoomId && !currentGameId && !currentGame && (
            <>
              <div className="pt-6" style={{ direction: "ltr" }}>
                <CreateGameBox />
              </div>
            </>
          )}
          {currentRoomId && !currentGameId && !currentGame && (
            <button
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-md font-bold"
              onClick={handleBackToLobby}
            >
              بازگشت به لابی
            </button>
          )}

          {roomGames.length > 0 &&
            currentRoomId &&
            !currentGameId &&
            !currentGame && (
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-3">
                  🎮 بازی‌های موجود:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {roomGames
                    .slice()
                    .reverse()
                    .slice(0, visibleGamesCount)
                    .map((game) => {
                      const isWaiting = game.gameStatus === "waiting";
                      const isPlayer =
                        Array.isArray(game.players) &&
                        game.players.some((p) => p.playerId === playerId);
                      const canClick =
                        isWaiting ||
                        (game.gameStatus === "onGoing" && isPlayer);
                      const gameType = GAME_TYPES.find((g) => {
                        return g.value === game.type;
                      });

                      return (
                        <div
                          key={game.gameId}
                          className={`p-3 rounded-md transition relative overflow-hidden ${
                            canClick
                              ? "bg-gray-700 hover:bg-gray-600 cursor-pointer"
                              : "bg-gray-600 text-gray-400 opacity-60 cursor-not-allowed"
                          }`}
                          onClick={
                            canClick
                              ? () => handleSelectGame(game.gameId)
                              : undefined
                          }
                          style={{
                            pointerEvents: canClick ? "auto" : "none",
                            backgroundImage: `url(${gameType.imageBanner})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {/* لایه مشکی نیمه شفاف فقط روی کارت */}
                          <div className="absolute inset-0 bg-black/50 rounded-md" />
                          {/* محتوای اصلی */}
                          <div className="relative z-10 flex flex-col text-lg">
                            <div className="flex justify-between">
                              <span>
                                {getStatusIcon(game.gameStatus)}{" "}
                                {gameType.label}
                              </span>
                              <span>
                                وضعیت: {GAME_STATUS_LABELS[game.gameStatus]}
                              </span>
                            </div>
                            <span className="ml-2 mr-4 mt-1 text-blue-200 flex justify-between items-center">
                              <span>
                                {game.players?.length || 0}{" "}
                                {game.gameStatus === "onGoing"
                                  ? "نفر در حال بازی"
                                  : game.gameStatus === "waiting"
                                  ? "نفر آماده بازی"
                                  : "نفر"}
                              </span>
                              <span className="text-xs text-blue-100">
                                ID: {game.gameId}
                              </span>
                              <span className="text-xs text-blue-100">
                                {game.gameCreatorName}
                              </span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
                {roomGames.length > visibleGamesCount && (
                  <div
                    className="flex justify-center mt-4"
                    style={{ direction: "rtl" }}
                  >
                    <button
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold text-white"
                      onClick={() => setVisibleGamesCount((c) => c + 5)}
                    >
                      دیدن بازی های بیشتر...
                    </button>
                  </div>
                )}
              </div>
            )}

          {currentRoomId && !currentGameId && (
            <RoomInvite roomId={currentRoomId} />
          )}
          {roomPlayers.length > 0 &&
            currentRoomId &&
            !currentGameId &&
            !currentGame && (
              <div className="pt-6">
                <h3 className="text-lg font-semibold mb-3">👥 اعضای روم:</h3>
                {hostName && (
                  <p className="mb-2 text-lg text-gray-300">
                    👑 میزبان: {hostName}
                  </p>
                )}
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {roomPlayers.map((p) => (
                    <li
                      key={p.playerId}
                      className="bg-gray-700 px-4 py-2 rounded-md flex justify-between items-center"
                    >
                      <span className="text-m text-gray-100">{p.nickname}</span>
                      <span className="text-xs text-blue-100">
                        ID: {p.playerId}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}
      {currentGameId && currentGame && <GameLobby />}
      {hostId === playerId && currentRoomId && !currentGameId && (
        <button
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-bold w-full h-12 my-2"
          onClick={deleteRoomHandler}
        >
          حذف روم
        </button>
      )}
    </div>
  );
}

export default LobbyPage;
