import GAME_TYPES from "../UI/gameTypes";

const gamesNameArr = [
  "splendorDuel",
  "splendor",
  "mineSweeper",
  "feedTheKraken",
];

const HomePage = () => {
  return (
    <div
      className="flex flex-col w-full justify-center items-start pt-4"
      style={{ direction: "rtl" }}
    >
      <div className="max-w-md bg-white p-4 rounded-2xl shadow text-gray-800 text-center mx-4 font-vazir">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-700 flex flex-row-reverse items-center gap-2 justify-center">
          <span>🎲</span>
          <span>خوش آمدید!</span>
        </h1>
        <p className="text-lg mb-4 text-gray-700">
          برای ورود به بازی از منوی زیر ابتدا ثبت‌نام کنید یا وارد شوید.
        </p>
      </div>
      {
        <div className="flex flex-col justify-center items-center pt-4 w-full">
          <h3 className="text-lg font-semibold mb-3">لیست بازی ها :</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-5/6">
            {gamesNameArr.map((game) => {
              const gameType = GAME_TYPES.find((g) => {
                return g.value === game;
              });

              return (
                <div
                  key={game.gameId}
                  className={`p-3 h-24 rounded-md transition relative overflow-hidden "bg-gray-700 hover:bg-gray-600 cursor-pointer"`}
                  // overflow-hidden ${
                  //   canClick
                  //     ? "bg-gray-700 hover:bg-gray-600 cursor-pointer"
                  //     : "bg-gray-600 text-gray-400 opacity-60 cursor-not-allowed"
                  // }`}
                  // onClick={
                  //   canClick
                  //     ? () => handleSelectGame(game.gameId)
                  //     : undefined
                  // }
                  style={{
                    // pointerEvents: canClick ? "auto" : "none",
                    backgroundImage: `url(${gameType.imageBanner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* لایه مشکی نیمه شفاف فقط روی کارت */}
                  <div className="absolute inset-0 bg-black/10 rounded-md" />
                  {/* محتوای اصلی */}
                  <div className="relative z-10 flex flex-col text-lg">
                    <div className="flex justify-end text-blue-100">
                      <span>{gameType.label}</span>
                      <span></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      }
    </div>
  );
};

export default HomePage;
