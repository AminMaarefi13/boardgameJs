import React from "react";
import PlayerCard from "./PlayerCard";

const PlayerList = ({ isPirate, isCabinetMember }) => {
  const mockPlayers = [
    { name: "Alice", role: "Pirate", cabinetRole: "First Officer" },
    { name: "Bob", role: "Sailor", cabinetRole: "None" },
    { name: "Charlie", role: "Pirate", cabinetRole: "Captain" },
    { name: "Jack", role: "Sailor", cabinetRole: "None" },
    { name: "Daniel", role: "Kraken", cabinetRole: "None" },
    { name: "Mary", role: "Sailor", cabinetRole: "None" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockPlayers.map((player) => (
        <div key={player.name}>
          <PlayerCard
            player={player}
            isPirate={isPirate}
            isCabinetMember={isCabinetMember}
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
