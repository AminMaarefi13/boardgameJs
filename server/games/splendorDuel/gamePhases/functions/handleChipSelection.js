const handlePrivilege = require("./handlePrivilege");

function handleChipSelection(
  selectedList,
  privilegeUse,
  player,
  gameState,
  updateAndBroadcastGame
) {
  if (
    gameState.currentPhase === "yellow_select" ||
    gameState.currentPhase === "take_second_same"
  ) {
    gameState.currentPhase === "chip_selected";
  }
  console.log("selectedList: ", selectedList);
  console.log("privilegeUse: ", privilegeUse);
  if (selectedList.length > 0) {
    if (privilegeUse) {
      player.privilegeTokens -= selectedList.length;
      gameState.privileges += selectedList.length;
    }
    const colorQuantityArr = [];
    selectedList.forEach(({ color }) => {
      console.log(color);
      const colorQuantityItem = colorQuantityArr.find(
        (colorQuantity) => colorQuantity.color === color
      );
      if (colorQuantityItem) {
        colorQuantityItem.quantity += 1;
      } else {
        colorQuantityArr.push({ color: color, quantity: 1 });
      }
    });
    console.log(colorQuantityArr);
    const sameThreeChips = colorQuantityArr.some((item) => item.quantity === 3);
    console.log(sameThreeChips);
    const twoPearlChips = colorQuantityArr.some(
      (item) => item.color === "pearl" && item.quantity === 2
    );
    console.log(twoPearlChips);
    gameState.logs.push({ type: "chip_selected", player, selectedList });
    if (sameThreeChips || twoPearlChips) {
      const opponent = gameState.players.find(
        (item) => item.seat !== player.seat
      );
      handlePrivilege(opponent, gameState);
    }

    selectedList.forEach(({ color, id, index }) => {
      const chip = player.chips.find((c) => c.color === color);
      if (chip) {
        chip.quantity += 1;
      } else {
        player.chips.push({ color, quantity: 1 });
      }
    });

    selectedList.forEach(({ color, id, index }) => {
      const chip = gameState.chipBoard.find((c) => c.id === id);
      if (chip) {
        chip.value = "";
      }
    });
  }
}

module.exports = handleChipSelection;
