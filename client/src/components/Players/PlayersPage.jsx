import React from "react";
import { useGame } from "../context/GameContext";
import PlayerList from "../components/Players/PlayerList";

const PlayersPage = () => {
  const { player } = useGame();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Welcome, {player.name}</h2>
      <PlayerList
        isPirate={player.role === "pirate"}
        isCabinetMember={player.isCabinetMember}
        cabinetRole={player.cabinetRole}
      />
    </div>
  );
};

export default PlayersPage;
