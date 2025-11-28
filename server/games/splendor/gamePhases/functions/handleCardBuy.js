// کد مربوط به ساخت کارت توسعه

function handleCardBuy(
  selectedCard,
  chipsNeeded,
  chipsDifference,
  reserved,
  player,
  gameState
) {
  // فرض: devCardIndex ایندکس کارتی است که بازیکن می‌خواهد بخرد
  // فرض: player همان بازیکن است
  // فرض: gameState.devCardsVisible آرایه کارت‌های قابل مشاهده است
  // فرض: gameState.devCardsDeck آرایه کارت‌های مخفی (پشت رو) است

  console.log("selectedCard: ", selectedCard);
  console.log("chipsNeeded: ", chipsNeeded);
  console.log("chipsDifference: ", chipsDifference);

  const chipsNeededArr = [
    { color: "white", quantity: chipsNeeded["white"] },
    { color: "blue", quantity: chipsNeeded["blue"] },
    { color: "black", quantity: chipsNeeded["black"] },
    { color: "red", quantity: chipsNeeded["red"] },
    { color: "green", quantity: chipsNeeded["green"] },
    { color: "yellow", quantity: chipsNeeded["yellow"] },
  ];

  const chipsDifferenceArr = [
    { color: "white", quantity: chipsDifference["white"] },
    { color: "blue", quantity: chipsDifference["blue"] },
    { color: "black", quantity: chipsDifference["black"] },
    { color: "red", quantity: chipsDifference["red"] },
    { color: "green", quantity: chipsDifference["green"] },
    { color: "yellow", quantity: chipsDifference["yellow"] },
  ];
  player.devCards.push(selectedCard);

  const levelIndex = selectedCard.level - 1;
  if (reserved) {
    const devCardIndex = player.reservedCards.findIndex((card) => {
      console.log("card: ", card);
      return card.index === selectedCard.index;
    });
    // اگر کارت پیدا نشد devCardIndex برابر -1 خواهد بود
    // ۱. کارت انتخاب شده را به devCards بازیکن اضافه کن
    console.log("devCardIndex: ", devCardIndex);
    // ۲. کارت انتخاب شده را از devCardsVisible حذف کن
    player.reservedCards.splice(devCardIndex, 1);
  } else {
    const devCardIndex = gameState.devCardsVisible[levelIndex].findIndex(
      (card) => {
        console.log("card: ", card);
        return card.index === selectedCard.index;
      }
    );
    // اگر کارت پیدا نشد devCardIndex برابر -1 خواهد بود
    // ۱. کارت انتخاب شده را به devCards بازیکن اضافه کن
    console.log("devCardIndex: ", devCardIndex);
    // ۲. کارت انتخاب شده را از devCardsVisible حذف کن
    gameState.devCardsVisible[levelIndex].splice(devCardIndex, 1);

    // ۳. اگر کارت جدیدی در devCardsDeck وجود دارد، آن را جایگزین کن
    if (gameState.devCardsDeck[levelIndex].length > 0) {
      const newCard = gameState.devCardsDeck[levelIndex].pop();
      gameState.devCardsVisible[levelIndex].splice(devCardIndex, 0, newCard);
    }
  }

  player.prestigePoints += selectedCard.prestigePoints;

  chipsNeededArr.forEach(({ color, quantity }) => {
    const playerChip = player.chips.find((c) => c.color === color);
    if (playerChip) {
      playerChip.quantity = Math.max(0, playerChip.quantity - quantity);
    }
  });
  // فرض: selectedList آرایه‌ای از { color, quantity } است
  // فرض: gameState.chipQuantities آرایه‌ای از { color, quantity } است
  console.log("player.chips", player.chips);

  chipsNeededArr.forEach(({ color, quantity }) => {
    const playerChip = player.chips.find((c) => c.color === color);
    const chip = gameState.chipQuantities.find((c) => c.color === color);
    const chipDiff = chipsDifferenceArr.find((c) => c.color === color);

    console.log("playerChip");
    console.log("chip");
    console.log(playerChip);
    console.log(chip);
    console.log(chipDiff);
    if (chip) {
      if (color === "yellow") {
        chip.quantity += quantity;
      } else {
        chip.quantity += quantity - chipDiff.quantity;
      }
    }
  });

  gameState.logs.push({ type: "dev_card_buy", player, selectedCard });
}

module.exports = handleCardBuy;
