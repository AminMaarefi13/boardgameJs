function handleChipWithdraw(chipsWithdrew, player, gameState) {
  // تنظیم فاز و داده‌های فاز
  // selectedList آرایه‌ای از آبجکت‌های { color, quantity } است
  // و player.chips آرایه‌ای از آبجکت‌های { color, quantity } است
  chipsWithdrew.forEach(({ color, quantity }) => {
    const chip = player.chips.find((c) => c.color === color);
    if (chip) {
      chip.quantity -= quantity;
    }
  });

  chipsWithdrew.forEach(({ color, quantity }) => {
    const chip = gameState.chipQuantities.find((c) => c.color === color);
    if (chip) {
      chip.quantity += quantity;
    }
  });

  gameState.logs.push({ type: "chip_withdraw", player, chipsWithdrew });
}

module.exports = handleChipWithdraw;
