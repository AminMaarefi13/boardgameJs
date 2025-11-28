const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voteSessionId: Number, // آیدی یکتای این رأی‌گیری
  playerId: String,
  nickname: String,
  gunsUsed: Number,
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const gamePlayerSchema = new mongoose.Schema({
  id: String,
  name: String,
  seat: Number,
  isCaptain: Boolean,
  guns: Number,
  offDuty: Boolean,
  characterCard: String,
  role: String,
  knownRoles: [],
  votes: { type: [voteSchema], default: [] }, // تمام رأی‌های قبلی ذخیره شده
  canJoinCult: {
    type: Boolean,
    default: function () {
      return this.role === "cultLeader" || this.role === "cultist";
    },
  },
  tongueOff: { type: Boolean, default: false },
  initialRole: { type: String, default: null },
  eliminated: { type: Boolean, default: false },
  isNotARole: { type: String, default: null },
  resume: {
    type: [Object],
    default: [],
  },
  revealedRoles: [{}],
  privatePhaseData: {},
});

const FeedTheKrakenGameSchema = new mongoose.Schema(
  {
    gameId: { type: String, required: true, unique: true }, // اضافه شده
    roomId: { type: String, required: true },
    players: [gamePlayerSchema], // دیگه unique نیست
    gameStatus: {
      type: String,
      enum: ["waiting", "onGoing", "gameOver"],
      default: "waiting",
    },
    journeyType: String,
    captainId: String,
    firstOfficerId: String,
    navigatorId: String,
    offDutyIds: [String],
    mapPosition: Number,
    currentPhase: String,
    navigationDeck: {
      type: [Object],
      default: [],
    },
    discardPile: {
      type: [Object],
      default: [],
    },
    cultRitualDeck: {
      type: [Object],
      default: [],
    },
    currentVoteSessionId: {
      type: Number,
      default: null,
    }, // شناسه رأی‌گیری جاری

    voteSessionCount: {
      type: Number,
      default: 0,
    }, // شمارنده رأی‌گیری‌ها
    phaseSeen: {},
    voteResultHandled: {},
    playedNavCards: { type: [], default: [] },
    gunReloadUsed: { type: Boolean, default: false },
    phaseData: Object,
    nextPhaseData: Object,
    logs: [{}],
    chat: [],
    seen: {},
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeedTheKrakenGame", FeedTheKrakenGameSchema);
