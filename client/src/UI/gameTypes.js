import splendorImg from "../../public/splendor.png";
import duelImg from "../../public/splendorDuel.png";
import mineImg from "../../public/mineSweeper.png";
import krakenImg from "../../public/feedTheKraken.png";
import splendorImgBanner from "../../public/splendorBanner.png";
import duelImgBanner from "../../public/splendorDuelBanner.png";
import mineImgBanner from "../../public/mineSweeperBanner.png";
import krakenImgBanner from "../../public/feedTheKrakenBanner.png";

const GAME_TYPES = [
  {
    value: "splendorDuel",
    label: "Splendor Duel",
    image: duelImg,
    imageBanner: duelImgBanner,
    minNumPlayers: 2,
    maxNumPlayers: 2,
  },
  {
    value: "splendor",
    label: "Splendor",
    image: splendorImg,
    imageBanner: splendorImgBanner,
    minNumPlayers: 2,
    maxNumPlayers: 4,
  },

  {
    value: "mineSweeper",
    label: "Minesweeper",
    image: mineImg,
    imageBanner: mineImgBanner,
    minNumPlayers: 2,
    maxNumPlayers: 2,
  },
  {
    value: "feedTheKraken",
    label: "Feed the Kraken",
    image: krakenImg,
    imageBanner: krakenImgBanner,
    minNumPlayers: 5,
    maxNumPlayers: 11,
  },
];

export default GAME_TYPES;
