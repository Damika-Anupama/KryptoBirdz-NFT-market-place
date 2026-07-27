// Demo dataset for the frontend-only showcase build.
// The real dApp reads these tokens from the KryptoBirdz ERC-721 contract on-chain;
// here we ship a static catalogue built from the bundled artwork so the marketplace
// renders instantly on any host without a wallet or blockchain connection.

import k1 from "../crypto-birdz/k1.png";
import k2 from "../crypto-birdz/k2.png";
import k3 from "../crypto-birdz/k3.png";
import k4 from "../crypto-birdz/k4.png";
import k5 from "../crypto-birdz/k5.png";
import k6 from "../crypto-birdz/k6.png";
import k7 from "../crypto-birdz/k7.png";
import k8 from "../crypto-birdz/k8.png";
import k9 from "../crypto-birdz/k9.png";
import k10 from "../crypto-birdz/k10.png";
import k11 from "../crypto-birdz/k11.png";
import k12 from "../crypto-birdz/k12.png";
import k13 from "../crypto-birdz/k13.png";
import k14 from "../crypto-birdz/k14.png";
import k15 from "../crypto-birdz/k15.png";

const IMAGES = [k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15];

// Rarity tiers drive the accent colour and the visual ribbon on each card.
export const RARITY = {
  Common: { label: "Common", color: "#7d8ba1", weight: 1 },
  Rare: { label: "Rare", color: "#3ba9ff", weight: 2 },
  Epic: { label: "Epic", color: "#a855f7", weight: 3 },
  Legendary: { label: "Legendary", color: "#f5b74a", weight: 4 },
};

const NAMES = [
  "Celestial Songbird", "Neon Nightjar", "Ember Falcon", "Frost Sparrow",
  "Solar Phoenix", "Void Raven", "Aurora Finch", "Cyber Kestrel",
  "Golden Oriole", "Storm Petrel", "Mystic Hummingbird", "Obsidian Owl",
  "Crimson Macaw", "Glacier Heron", "Prism Peacock",
];

const TRAITS = [
  ["Iridescent", "Skyborn", "Calm"], ["Glitchcore", "Nocturnal", "Electric"],
  ["Molten", "Fierce", "Winged"], ["Crystalline", "Serene", "Frostbound"],
  ["Radiant", "Reborn", "Blazing"], ["Shadow", "Ancient", "Silent"],
  ["Polar", "Gentle", "Luminous"], ["Chromed", "Swift", "Tactical"],
  ["Gilded", "Regal", "Melodic"], ["Tempest", "Bold", "Oceanic"],
  ["Enchanted", "Tiny", "Vivid"], ["Onyx", "Wise", "Nocturnal"],
  ["Scarlet", "Loud", "Tropical"], ["Glacial", "Patient", "Statuesque"],
  ["Spectral", "Proud", "Kaleidoscopic"],
];

// Deterministic pseudo-values so the catalogue is stable across reloads/builds.
const RARITY_BY_INDEX = [
  "Legendary", "Rare", "Epic", "Common", "Legendary",
  "Epic", "Common", "Rare", "Epic", "Rare",
  "Common", "Epic", "Rare", "Common", "Legendary",
];

const PRICES = [
  4.2, 1.15, 2.8, 0.65, 5.5, 3.1, 0.48, 1.7, 2.4, 1.32,
  0.55, 2.95, 1.6, 0.72, 6.1,
];

export const BIRDZ = IMAGES.map((image, i) => ({
  id: i + 1,
  tokenId: `#${String(i + 1).padStart(4, "0")}`,
  name: NAMES[i],
  image,
  rarity: RARITY_BY_INDEX[i],
  price: PRICES[i],
  traits: TRAITS[i],
  // A stable, human-looking owner handle.
  owner: `0x${(0x71c7 + i * 0x1f3d).toString(16)}…${(0x9a4 + i * 7)
    .toString(16)
    .padStart(3, "0")}`,
  likes: 40 + ((i * 37) % 260),
}));

export const STATS = {
  items: BIRDZ.length,
  owners: 9,
  floor: Math.min(...PRICES),
  volume: PRICES.reduce((a, b) => a + b, 0),
};
