export type Stats = {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  focus: number;
};

export type Demon = {
  id: string;
  name: string;
  title: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  xpReward: number;
  orbReward: number;
  tier: "lower" | "mid" | "upper" | "moon" | "muzan";
  bloodArt?: string;
  dialogue: string[];
  deathQuote: string;
  isBoss?: boolean;
};

export type GameLocation = {
  id: string;
  name: string;
  description: string;
  banner: string;
  chapterRequired: number;
  demonPool: string[];
  connections: string[];
  storyEvents: string[];
  shopAvailable: boolean;
  shrineAvailable: boolean;
  hashiraPresent?: string[];
  ambiance: string;
};

export type StoryNode = {
  id: string;
  chapter: number;
  location: string;
  speaker: string;
  speakerColor?: string;
  text: string[];
  choices?: { text: string; next: string; flag?: string; flagValue?: any; bossFight?: string }[];
  next?: string;
  reward?: { xp?: number; orbs?: number; item?: string; unlockForm?: number; maxHp?: number; attack?: number };
  bossFight?: string;
  isEnding?: boolean;
};

export type BreathForm = {
  id: string;
  name: string;
  formNumber: number;
  cost: number;
  multiplier: number;
  description: string;
  effect?: "normal" | "heal" | "buff" | "decapitate" | "mist_veil";
};

export type Ally = {
  id: string;
  name: string;
  title: string;
  rarity: "3★" | "4★" | "5★";
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  passive: string;
  color: string;
  quote: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  type: "weapon" | "armor" | "consumable" | "relic";
  stat?: keyof Stats;
  value?: number;
  description: string;
  quantity: number;
  equipped?: boolean;
};

export type GameState = {
  id?: number;
  playerName: string;
  rank: string;
  breathingStyle: string;
  level: number;
  xp: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  focus: number;
  maxFocus: number;
  currentLocation: string;
  storyChapter: number;
  storyFlags: Record<string, any>;
  demonsSlain: number;
  gachaPulls: number;
  orbs: number;
  inventory: InventoryItem[];
  unlockedForms: number[];
  allies: Ally[];
  relationships: Record<string, number>;
  notes: string;
  currentStoryNode?: string;
  inCombat?: boolean;
  combatLog?: string[];
};
