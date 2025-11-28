import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../network/socket";
import { useAppContext } from "./AppContext";

const GameContext = createContext();
// gameState: { type: "feedTheKraken" | "mineSweeper" | ... , ...state }

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);
  const { setUserState, connectionState, setConnectionState } = useAppContext();

  const { playerId, currentRoomId, currentGameId, currentGame } =
    connectionState;

  const requestGameState = () => {
    if (
      socket.connected &&
      playerId &&
      currentRoomId &&
      currentGameId &&
      currentGame.gameStatus &&
      currentGame.gameStatus !== "waiting"
    ) {
      socket.emit("request_game_state", currentGameId);
    }
  };

  useEffect(() => {
    function handleError(msg) {
      alert(msg); // یا هر روش نمایش پیام دلخواه
    }
    socket.on("error_message", handleError);
    return () => {
      socket.off("error_message", handleError);
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      requestGameState();
    });

    // socket.on("gameState", (state) => {
    //   console.log("📦 gameState وضعیت بازی دریافت شد", state);
    //   // setGameState(state);
    //   // setConnectionState((prev) => ({
    //   //   ...prev,
    //   //   currentRoomId: state.roomId,
    //   //   currentGameId: state.gameId,
    //   // }));
    //   console.log("currentGameId: ", currentGameId);
    //   console.log("state.publicState.gameId: ", state.publicState.gameId);
    //   if (currentGameId !== state.publicState.gameId) return;

    //   if (state?.publicState.type === "feedTheKraken") {
    //     setGameState(state.publicState);
    //     setUserState((prev) => ({ ...prev, ...state.privateState }));
    //     // setConnectionState((prev) => ({
    //     //   ...prev,
    //     //   currentRoomId: state.publicState.roomId,
    //     //   currentGameId: state.publicState.gameId,
    //     // }));
    //     // localStorage.setItem("currentGameId", state.publicState.gameId);
    //   } else if (state?.publicState.type === "mineSweeper") {
    //     console.log("MineSweeper game state received:");
    //     setGameState(state.publicState);
    //     // setConnectionState((prev) => ({
    //     //   ...prev,
    //     //   currentRoomId: state.publicState.roomId,
    //     //   currentGameId: state.publicState.gameId,
    //     // }));
    //     // localStorage.setItem("currentGameId", state.publicState.gameId);
    //   } else if (state?.publicState.type === "splendor") {
    //     console.log("Splendor game state received:");
    //     setGameState(state.publicState);
    //     // setConnectionState((prev) => ({
    //     //   ...prev,
    //     //   currentRoomId: state.publicState.roomId,
    //     //   currentGameId: state.publicState.gameId,
    //     // }));
    //     // localStorage.setItem("currentGameId", state.publicState.gameId);
    //   }
    // });

    // socket.on("game_state_requested", (state) => {
    //   console.log("📦 game_state_requested وضعیت بازی دریافت شد", state);
    //   console.log("currentGameId: ", currentGameId);
    //   console.log("state.publicState.gameId: ", state.publicState.gameId);
    //   if (currentGameId !== state.publicState.gameId) return;

    //   if (state?.publicState.type === "feedTheKraken") {
    //     setGameState(state.publicState);
    //     setUserState((prev) => ({ ...prev, ...state.privateState }));
    //     // setConnectionState((prev) => ({
    //     //   ...prev,
    //     //   currentRoomId: state.publicState.roomId,
    //     //   currentGameId: state.publicState.gameId,
    //     // }));
    //     // localStorage.setItem("currentGameId", state.publicState.gameId);
    //   } else if (state?.publicState.type === "mineSweeper") {
    //     console.log("MineSweeper game state received:");
    //     setGameState(state.publicState);
    //     // setConnectionState((prev) => ({
    //     //   ...prev,
    //     //   currentRoomId: state.publicState.roomId,
    //     //   currentGameId: state.publicState.gameId,
    //     // }));
    //     // localStorage.setItem("currentGameId", state.publicState.gameId);
    //   } else if (state?.publicState.type === "splendor") {
    //     console.log("Splendor game state received:");
    //     setGameState(state.publicState);
    //     // setConnectionState((prev) => ({
    //     //   ...prev,
    //     //   currentRoomId: state.publicState.roomId,
    //     //   currentGameId: state.publicState.gameId,
    //     // }));
    //     // localStorage.setItem("currentGameId", state.publicState.gameId);
    //   }
    // });
    return () => {
      socket.off("connect");
      socket.off("gameState");
      socket.off("game_state_requested");
    };
  }, []);

  useEffect(() => {
    console.log(gameState);
    if (
      currentRoomId &&
      playerId &&
      currentGameId &&
      currentGame?.gameStatus &&
      currentGame?.gameStatus !== "waiting"
    ) {
      requestGameState();
    }
  }, [currentRoomId, currentGameId, playerId]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
