function handleSteal(stealSelected, player, gameState) {
  console.log("stealSelected", stealSelected);
  gameState.currentPhase === "chip_selected";
  if (stealSelected !== "") {
    const chip = player.chips.find((c) => c.color === stealSelected);
    if (chip) {
      chip.quantity += 1;
    } else {
      player.chips.push({ stealSelected, quantity: 1 });
    }

    const opponent = gameState.players.find(
      (item) => item.seat !== player.seat
    );

    const opponnetChip = opponent.chips.find((c) => c.color === stealSelected);
    opponnetChip.quantity -= 1;

    gameState.logs.push({ type: "steal_selected", player, stealSelected });
  }
}

module.exports = handleSteal;
