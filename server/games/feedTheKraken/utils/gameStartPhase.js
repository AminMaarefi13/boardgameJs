const { shuffle } = require("../../../utils/shuffle.js");
const {
  characterCards,
  roleDistribution,
  navigationCards,
  cultRitualCards,
  offDutyCards,
} = require("../gameSetupConfig.js");

function gameStartPhase(players, journeyType, roomId) {
  const numPlayers = players.length;

  if (!roleDistribution[numPlayers]) {
    throw new Error("Invalid player count for role distribution");
  }

  const roleOptions = roleDistribution[numPlayers];
  const roleSet = shuffle(roleOptions)[0];

  const roles = [];
  roles.push(...Array(roleSet.sailor).fill("sailor"));
  roles.push(...Array(roleSet.pirate).fill("pirate"));
  roles.push(...Array(roleSet.cultLeader).fill("cultLeader"));
  roles.push(...Array(roleSet.cultist || 0).fill("cultist"));

  const shuffledRoles = shuffle(roles);
  const shuffledPlayers = shuffle([...players]);

  // موقعیت‌دهی ساعتگرد
  shuffledPlayers.forEach((p, index) => {
    p.seat = index;
  });

  // انتخاب کاپیتان به صورت رندوم (در اینجا اولین نفر)
  const captainPlayer = shuffledPlayers[0];
  const captainId = captainPlayer.playerId;
  const captainName = captainPlayer.nickname;

  // حذف کارت captain از characterCard و شافل بقیه
  const validCharacterCards = characterCards.filter(
    (card) => card !== "captain"
  );
  const shuffledCharacterCards = shuffle(validCharacterCards).slice(
    0,
    numPlayers
  );

  const assignedCharacterCards = new Map();
  shuffledPlayers.forEach((player, i) => {
    assignedCharacterCards.set(player.playerId, shuffledCharacterCards[i]);
  });

  // ساخت نهایی بازیکنان
  const pirateIds = shuffledPlayers
    .map((player, index) => ({
      id: player.playerId,
      role: shuffledRoles[index],
    }))
    .filter((p) => p.role === "pirate")
    .map((p) => p.id);

  const finalPlayers = shuffledPlayers.map((player, index) => {
    const id = player.playerId;
    const name = player.nickname;
    const role = shuffledRoles[index];
    const isCaptain = id === captainId;
    const characterCard = assignedCharacterCards.get(id);

    const knownRoles =
      role === "pirate"
        ? pirateIds
            .filter((pid) => pid !== id)
            .map((pid) => ({
              playerId: pid,
              playerName: shuffledPlayers.find((p) => p.playerId === pid)
                .nickname,
              role: "pirate",
              phase: "game_init",
            }))
        : [];

    return {
      id,
      name,
      seat: index,
      role,
      isCaptain,
      knownRoles,
      characterCard,
      offDuty: false,
      guns: 3,
      votes: [],
      canJoinCult: role === "cultLeader" || role === "cultist" ? false : true,
      tongueOff: false,
      initialRole: null,
      eliminated: false,
      isNotARole: null,
      resume: [],
    };
  });
  // ساخت deckها
  const navigationDeck = shuffle([...navigationCards[journeyType]]); // draw با pop()
  const discardPile = []; // push → آخرین کارت‌ها در انتهای آرایه
  const cultRitualDeck = shuffle([...cultRitualCards]); // pop برای برداشتن مخفی

  // ساخت gameState نهایی
  const gameState = {
    journeyType,
    players: finalPlayers,
    roomId,
    captainId,
    firstOfficerId: null,
    navigatorId: null,
    offDutyIds: [],
    mapPosition: 0,
    currentPhase: "game_start",
    phaseData: {},
    nextPhaseData: {},
    logs: [
      {
        type: "event",
        text: `🎮 بازی با ${numPlayers} بازیکن شروع شد. 🎖️ کاپیتان: ${captainName}.`,
      },
    ],
    chat: [],
    seen: {},
    navigationDeck,
    discardPile,
    cultRitualDeck,
    playedNavCards: [],
    currentVoteSessionId: null,
    gameStatus: "onGoing",
    type: "feedTheKraken",
  };

  return gameState;
}

module.exports = {
  gameStartPhase,
};
