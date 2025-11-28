// کد مربوط به ساخت کارت توسعه

function handleNobleCardBuy(selectedNobleCard, player, gameState) {
  // فرض: devCardIndex ایندکس کارتی است که بازیکن می‌خواهد بخرد
  // فرض: player همان بازیکن است
  // فرض: gameState.devCardsVisible آرایه کارت‌های قابل مشاهده است
  // فرض: gameState.devCardsDeck آرایه کارت‌های مخفی (پشت رو) است

  console.log("selectedNobleCard: ", selectedNobleCard);

  const nobleCardIndex = gameState.nobleTilesDeck.findIndex((card) => {
    console.log("card: ", card);
    return card.index === selectedNobleCard.index;
  });

  console.log("nobleCardIndex: ", nobleCardIndex);
  player.nobleTilesOwned.push(selectedNobleCard);

  gameState.nobleTilesDeck.splice(nobleCardIndex, 1);

  player.prestigePoints += selectedNobleCard.prestigePoints;

  gameState.logs.push({ type: "noble_card_buy", player, selectedNobleCard });

  // const nextTurn = (gameState.turn + 1) % gameState.players.length;
  // gameState.turn = nextTurn;
  // console.log("تغییر نوبت به بازیکن بعدی:", nextTurn);
}

module.exports = handleNobleCardBuy;
