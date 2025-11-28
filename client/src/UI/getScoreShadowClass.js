export default function getScoreShadowClass({ players, playerId }) {
  const myIndex = players.findIndex((p) => p.id === playerId);
  const otherIndex = myIndex === 0 ? 1 : 0;

  if (players[myIndex].score > players[otherIndex].score) {
    return "shadow-[0_0_40px_8px_rgba(34,197,94,0.7)]"; // سبز (امتیاز بیشتر)
  } else if (players[myIndex].score < players[otherIndex].score) {
    return "shadow-[0_0_40px_8px_rgba(236,72,153,0.7)]"; // صورتی (امتیاز کمتر)
  } else {
    return "shadow-[0_0_32px_6px_rgba(148,163,184,0.5)]"; // خاکستری (مساوی)
  }
}
