import React from "react";

const COLORS = ["white", "blue", "red", "green", "black"];

export default function GameOver({ gameState, myIndex }) {
  console.log(gameState);
  const winner = gameState.phaseData.winner;
  const sortedPlayers = [];
  [...gameState.players].forEach((player) => {
    if (player.id === winner.id) {
      sortedPlayers[0] = player;
    } else {
      sortedPlayers[1] = player;
    }
  });
  console.log(sortedPlayers);
  console.log(myIndex);
  console.log(gameState.phaseData.winner);

  const playersColorSums = [];
  sortedPlayers.forEach((player) => {
    console.log(player.name);
    const colorSums = {};
    (player?.devCards || []).forEach((card) => {
      console.log(card);
      if (!colorSums[card.color]) {
        if (card.color === "joker") {
          if (!colorSums[card.newColor]) {
            colorSums[card.newColor] = card.prestigePoints || 0;
          } else {
            colorSums[card.newColor] += card.prestigePoints || 0;
          }
        } else if (card.color === "points") {
          true;
        } else {
          colorSums[card.color] = 0;
        }
      }
      if (card.color === "joker" || card.color === "points") {
        true;
      } else {
        colorSums[card.color] += card.prestigePoints || 0;
      }

      console.log(card.color);
      console.log(card.prestigePoints);
      console.log(colorSums[card.color]);
      console.log(colorSums[card?.newColor]);
    });
    console.log(colorSums);
    playersColorSums.push(colorSums);
  });
  console.log("playersColorSums: ", playersColorSums);
  return (
    <div
      style={{
        direction: "rtl",
      }}
    >
      {winner.seat === myIndex && <div>شما برنده شدید!</div>}
      <div>برنده: </div>
      <div>{winner.name}</div>
      {sortedPlayers.map((player, sortedIndex) => {
        return (
          <div key={player.seat}>
            <div>
              {player.name}: {player.prestigePoints} , 👑{player.crownsOwned}
            </div>
            <div className="flex justify-center items-center gap-4">
              {COLORS.map((color, index) => {
                return (
                  <div
                    key={index}
                    className={`flex justify-center items-center w-5 h-5 rounded `}
                    style={{
                      backgroundColor: color,
                      color: color === "white" && "black",
                    }}
                  >
                    {playersColorSums[sortedIndex][color]}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
