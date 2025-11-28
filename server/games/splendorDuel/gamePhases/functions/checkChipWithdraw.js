function checkChipWithdraw(player, gameState) {
  const CHIP_COLORS = ["white", "blue", "red", "green", "black", "yellow"];

  const chipsSum = CHIP_COLORS.reduce((sum, color) => {
    const chip = player.chips.find((chip) => chip.color === color);
    return sum + chip.quantity || 0;
  }, 0);
  console.log(chipsSum);
  if (chipsSum > 10) {
    gameState.currentPhase = "chips_withdraw";
    console.log("تغییر فاز به chips_withdraw");
    return true;
  } else {
    return false;
  }
}

module.exports = checkChipWithdraw;
