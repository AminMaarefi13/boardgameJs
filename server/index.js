const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
// require("dotenv").config(); // Load .env vars
require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");

const path = require("path");
const connectDB = require("./config/db");

const { socketHandler } = require("./socketHandler");
const {
  rooms,
  games,
  // connectionsArr,
  // userSocketMap,
} = require("./utils/memoryStore");
const { startPeriodicDBSave } = require("./utils/startPeriodicDBSave");

const app = express();
const server = http.createServer(app);

const {
  restoreRoomsFromDB,
  restoreGamesFromDB,
} = require("./utils/restoreRoomAndGameFromDB");

startPeriodicDBSave(games, 1 * 60 * 1000); // هر ۵ دقیقه ذخیره می‌کند

// ------------------- Middleware -------------------

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: [
      "https://astonishing-sfogliatella-ac8304.netlify.app",
      "https://boardgamejs.onrender.com",
      "http://localhost:5173",
      "https://cdn.fontcdn.ir/Fonts/Vazir/3b2277e82a583c9f91de41aa9e198a14d7ef7f4ccd04828abdd623acd116a88b.woff2",
      "https://us08-fontserver-cdn.servr.org/Fonts/Vazir/3b2277e82a583c9f91de41aa9e198a14d7ef7f4ccd04828abdd623acd116a88b.woff2",
    ],
    credentials: true,
  })
);

// Session setup (optional - only if you use session-based auth)
app.use(
  session({
    secret: "your-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      sameSite: "lax",
    },
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/v1/users", userRouter);
// app.use("/", gameRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
  });
});

// ------------------- Socket.io Setup -------------------

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "https://astonishing-sfogliatella-ac8304.netlify.app",
      "https://boardgamejs.onrender.com",
      "http://localhost:5173",
      "https://cdn.fontcdn.ir/Fonts/Vazir/3b2277e82a583c9f91de41aa9e198a14d7ef7f4ccd04828abdd623acd116a88b.woff2",
      "https://us08-fontserver-cdn.servr.org/Fonts/Vazir/3b2277e82a583c9f91de41aa9e198a14d7ef7f4ccd04828abdd623acd116a88b.woff2",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ------------------- Start Server -------------------

async function main() {
  await connectDB();
  await restoreRoomsFromDB(rooms);
  await restoreGamesFromDB(games, rooms);
  socketHandler(io);

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`✅ SERVER RUNNING on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("❌ Error starting server:", err);
});
