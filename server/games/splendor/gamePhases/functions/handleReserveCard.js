// کد مربوط به ساخت کارت توسعه

function handleReserveCard(reservedCard, player, gameState) {
  console.log("reservedCard: ", reservedCard);

  const levelIndex = reservedCard.level - 1;

  if (reservedCard.color === "unknown") {
    const newCard = gameState.devCardsDeck[levelIndex].pop();
    player.reservedCards.push(newCard);
    gameState.logs.push({
      type: "dev_card_reserved",
      player,
      reservedCard: newCard,
    });
  } else {
    player.reservedCards.push(reservedCard);
    gameState.logs.push({ type: "dev_card_reserved", player, reservedCard });
    const devCardIndex = gameState.devCardsVisible[levelIndex].findIndex(
      (card) => {
        console.log("card: ", card);
        return card.index === reservedCard.index;
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

  const yellowChips = gameState.chipQuantities.find(
    (c) => c.color === "yellow"
  );
  const playersYellowChips = player.chips.find((c) => c.color === "yellow");
  console.log(yellowChips);
  console.log(playersYellowChips);
  if (yellowChips.quantity > 0) {
    yellowChips.quantity -= 1;
    if (playersYellowChips) {
      playersYellowChips.quantity += 1;
    } else {
      player.chips.push({ color: "yellow", quantity: 1 });
    }
  }
}

module.exports = handleReserveCard;
