export default function getGradientClass({
  players,
  type,
  myIndex,
  otherIndex,
  turnIndex,
}) {
  if (type === "score") {
    if (players[myIndex].score > players[otherIndex].score) {
      return "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white";
    } else if (players[myIndex].score < players[otherIndex].score) {
      return "bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 text-white";
    } else {
      return "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white";
    }
  }

  if (type === "turn") {
    return turnIndex === myIndex
      ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white"
      : "bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 text-white";
  }

  return "";
}
