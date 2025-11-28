// کد مربوط به ساخت کارت توسعه

function handleJokerSelect(selected, selectedJokerCard, player, gameState) {
  // فرض: devCardIndex ایندکس کارتی است که بازیکن می‌خواهد بخرد
  // فرض: player همان بازیکن است
  // فرض: gameState.devCardsVisible آرایه کارت‌های قابل مشاهده است
  // فرض: gameState.devCardsDeck آرایه کارت‌های مخفی (پشت رو) است

  console.log("selected: ", selected);
  console.log("selectedJokerCard: ", selectedJokerCard);

  const jokerCard = player.devCards.find(
    (card) => card.index === selectedJokerCard.index
  );
  jokerCard.newColor = selected;

  gameState.logs.push({
    type: "joker_select",
    player,
    selected,
    selectedJokerCard,
  });
}

module.exports = handleJokerSelect;
