function describeKnownRoles(knownRoles, gameState) {
  if (!knownRoles || knownRoles.length === 0)
    return "شما هنوز نقش هیچ بازیکنی را نمی‌دانید.";
  return knownRoles
    .map(({ playerId, role, phase }) => {
      const player = gameState.players.find((pl) => pl.id === playerId);

      return `شما می‌دانید ${player.name} نقش «${translateRole(
        role
      )}» دارد که این را در فاز «${translatePhase(phase)}» فهمیده‌اید.`;
    })
    .join("\n");
}

// اگر ترجمه اسم نقش‌ها یا فازها خواستی:
function translateRole(role) {
  const roles = {
    pirate: "دزد دریایی",
    cultist: "فرقه‌گرا",
    sailor: "ملوان",
    // ... بقیه نقش‌ها
  };
  return roles[role] || role;
}

function translatePhase(phase) {
  const phases = {
    game_init: "شروع بازی",
    vote_result: "نتیجه رأی‌گیری",
    cabinet_formation: "تشکیل کابینه",
    // ... بقیه فازها
  };
  return phases[phase] || phase;
}

module.exports = {
  describeKnownRoles,
};
