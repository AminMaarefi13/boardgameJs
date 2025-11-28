const { shuffle } = require("../../../../utils/shuffle");
const handlePrivilege = require("./handlePrivilege");

function handleReplenishBoard(player, gameState) {
  const COLORS = ["white", "yellow", "blue", "black", "red", "green", "pearl"];
  const chipsArr = [];
  console.log(gameState.chipQuantities);
  COLORS.forEach((color) => {
    console.log(
      Array.from({
        length: gameState.chipQuantities.find((chip) => chip.color === color)
          ?.quantity,
      }).map(() => color)
    );
    let arr = Array.from({
      length: gameState.chipQuantities.find((chip) => chip.color === color)
        ?.quantity,
    }).map(() => color);
    chipsArr.push(...arr);
  });
  console.log("chipsArr: ", chipsArr);
  const shuffledChipsArr = shuffle(chipsArr);
  let i = 0;
  while (shuffledChipsArr.length > 0) {
    const chipSlot = gameState.chipBoard.find((chip) => chip.id === i);
    if (chipSlot.value === "") {
      chipSlot.value = shuffledChipsArr[shuffledChipsArr.length - 1];
      shuffledChipsArr.pop();
    }
    i++;
  }
  gameState.chipQuantities.forEach(({ color, id, index }) => {
    const chip = gameState.chipQuantities.find((c) => c.color === color);
    if (chip) {
      chip.quantity = 0;
    }
  });
  const opponent = gameState.players.find((item) => item.seat !== player.seat);
  gameState.logs.push({
    type: "replenish_board",
    player,
  });
  handlePrivilege(opponent, gameState);
}

module.exports = handleReplenishBoard;
