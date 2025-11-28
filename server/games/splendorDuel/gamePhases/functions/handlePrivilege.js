function handlePrivilege(player, gameState) {
  if (gameState.privileges > 0) {
    gameState.privileges -= 1;
    player.privilegeTokens += 1;
    gameState.logs.push({
      type: "privilege_ability",
      player,
      takenFrom: "board",
    });
  } else {
    const opponent = gameState.players.find(
      (item) => item.seat !== player.seat
    );
    if (opponent.privilegeTokens > 0) {
      opponent.privilegeTokens -= 1;
      player.privilegeTokens += 1;
      gameState.logs.push({
        type: "privilege_ability",
        player,
        takenFrom: "opponent",
      });
    } else {
      gameState.logs.push({
        type: "privilege_ability",
        player,
        takenFrom: "noPrivileges",
      });
    }
  }
}

module.exports = handlePrivilege;
