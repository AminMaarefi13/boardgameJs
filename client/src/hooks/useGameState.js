import { useGameContext } from "../context/GameContext";

export const useGameState = () => {
  const game = useGameContext();
  if (!game) throw new Error("useGameState must be used within GameProvider");
  return game;
};
