function checkGameOver(gameState) {
  if (gameState.finalRound) {
    console.log("turn", gameState.turn);
    if (gameState.turn === gameState.players.length - 1) {
      gameState.currentPhase = "game_over";
      const sortedPlayers = [...gameState.players].sort(
        (a, b) => b.prestigePoints - a.prestigePoints
      );

      // پیدا کردن بیشترین تعداد تفنگ
      const maxPrestigePoints =
        sortedPlayers.length > 0 ? sortedPlayers[0].prestigePoints : 0;
      let winners = sortedPlayers.filter(
        (player) => player.prestigePoints === maxPrestigePoints
      );
      if (winners.length > 1) {
        const sortedDevCards = winners.sort(
          (a, b) => b.devCards.length - a.devCards.length
        );
        const minDevCards = sortedDevCards[0].devCards.length || 0;
        winners = sortedPlayers.filter(
          (player) => player.devCards.length === minDevCards
        );
      }
      gameState.phaseData = { winners };

      return true;
    }
  } else {
    const isFinalRound = gameState.players.some(
      (player) => player.prestigePoints >= 15
    );
    if (isFinalRound) {
      gameState.finalRound = true;
    }
  }
  return false;
}

module.exports = checkGameOver;
