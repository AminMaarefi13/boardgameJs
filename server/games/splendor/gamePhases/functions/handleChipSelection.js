function handleChipSelection(selectedList, player, gameState) {
  // تنظیم فاز و داده‌های فاز
  // selectedList آرایه‌ای از آبجکت‌های { color, quantity } است
  // و player.chips آرایه‌ای از آبجکت‌های { color, quantity } است
  selectedList.forEach(({ color, quantity }) => {
    const chip = player.chips.find((c) => c.color === color);
    if (chip) {
      chip.quantity += quantity;
    } else {
      player.chips.push({ color, quantity });
    }
  });
  // فرض: selectedList آرایه‌ای از { color, quantity } است
  // فرض: gameState.chipQuantities آرایه‌ای از { color, quantity } است

  selectedList.forEach(({ color, quantity }) => {
    const chip = gameState.chipQuantities.find((c) => c.color === color);
    if (chip) {
      chip.quantity = Math.max(0, chip.quantity - quantity);
    }
  });

  gameState.logs.push({ type: "chip_selected", player, selectedList });
}

module.exports = handleChipSelection;
