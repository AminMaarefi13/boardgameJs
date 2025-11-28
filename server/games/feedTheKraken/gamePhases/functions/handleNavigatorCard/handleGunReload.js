/**
 * شارژ تفنگ‌های همه بازیکنان تا ۳ عدد
 * @param {Object} gameState - وضعیت فعلی بازی
 */
function handleGunReload(gameState) {
  gameState.players.forEach((player) => {
    if (player.guns < 3) {
      player.guns = 3;
    }
  });
  gameState.logs.push({
    type: "gun_reload",
    text: `تفنگ های همه بازیکنان تا 3 عدد شارژ شد. 🔫 `,
  });
}

module.exports = handleGunReload;
