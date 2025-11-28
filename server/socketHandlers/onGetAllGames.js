const roomController = require("../controllers/roomController");

async function onGetAllGames(roomId, callback) {
  try {
    // console.log("Fetching all games for room:", roomId.roomId);
    if (!roomId || !roomId.roomId) {
      console.error("Invalid roomId:", roomId);
      return callback({ error: "Invalid roomId" });
    }

    const roomData = await roomController.getAllGamesByRoomId(roomId.roomId);
    // ارسال اطلاعات بازی‌ها به کلاینت
    callback(roomData[0].games);
  } catch (err) {
    console.error("Error fetching all games:", err);
    callback({ error: "Error fetching all games" });
  }
}

module.exports = {
  onGetAllGames,
};
