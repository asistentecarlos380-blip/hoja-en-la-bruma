import type { GameState, InventoryItem, Ally, Demon } from "./types";
import { DEMONS, BREATH_FORMS, ALLIES } from "./data";

export const DEFAULT_STATE: Omit<GameState, "id"> = {
  playerName: "Shinjo Ren",
  rank: "Mizunoto",
  breathingStyle: "Bruma Plateada",
  level: 1,
  xp: 0,
  hp: 150,
  maxHp: 150,
  attack: 35,
  defense: 20,
  speed: 30,
  focus: 100,
  maxFocus: 100,
  currentLocation: "monte_sagiri",
  storyChapter: 0,
  storyFlags: {},
  demonsSlain: 0,
  gachaPulls: 0,
  orbs: 5,
  inventory: [
    { id: "katana_inicial", name: "Katana Básica de Acero", type: "weapon", stat: "attack", value: 0, description: "Tu primera hoja Nichirin, de temple plateado.", quantity: 1, equipped: true },
  ],
  unlockedForms: [1],
  allies: [],
  relationships: {},
  notes: "",
};

export function xpForNextLevel(level: number) {
  return 80 + level * 60;
}

export function applyXp(state: GameState, xpGain: number): { state: GameState; leveledUp: boolean; levelsGained: number } {
  let s = { ...state };
  s.xp += xpGain;
  let levelsGained = 0;
  while (s.xp >= xpForNextLevel(s.level)) {
    s.xp -= xpForNextLevel(s.level);
    s.level += 1;
    s.maxHp += 22;
    s.hp = s.maxHp;
    s.attack += 6;
    s.defense += 4;
    s.speed += 2;
    s.maxFocus += 5;
    levelsGained += 1;
  }
  return { state: s, leveledUp: levelsGained > 0, levelsGained };
}

export function rollGacha(): { ally?: Ally; item?: InventoryItem; tier: "3★" | "4★" | "5★"; quote: string; color: string } {
  const roll = Math.random();
  let tier: "3★" | "4★" | "5★";
  if (roll < 0.05) tier = "5★";
  else if (roll < 0.28) tier = "4★";
  else tier = "3★";

  const pool = ALLIES.filter((a) => a.rarity === tier);
  const ally = pool[Math.floor(Math.random() * pool.length)];

  const QUOTES: Record<string, string[]> = {
    "3★": [
      "«Un eco lejano resuena en la penumbra... un cazador novato responde a tu señal.»",
      "«El viento frío arrastra hojas secas: una katana de acero común cae ante ti.»",
      "«Un cuervo Kasugai entrega una ración de viaje y un talismán desgastado.»",
    ],
    "4★": [
      "«¡Un destello plateado corta la bruma! Un espadachín veterano acude al llamado.»",
      "«¡Presagio favorable! Una hoja Nichirin forjada con mineral escarlata resplandece.»",
      "«El murmullo de la respiración ruge con disciplina: un oficial de alto rango toma posición.»",
    ],
    "5★": [
      "«¡¡LA BRUMA SE PARTE EN DOS ANTE UN FULGOR CELESTIAL!! ¡UN PILAR HA DESCENDIDO!»",
      "«¡¡RESONANCIA ESPIRITUAL MÁXIMA!! ¡LA SANGRE Y EL ACERO SE FUNDEN EN UN VÍNCULO LEGENDARIO!»",
      "«¡¡EL ECO DE LA LUZ SOLAR DESPIERTA UN DESTINO INQUEBRANTABLE!!»",
    ],
  };

  const COLORS: Record<string, string> = {
    "3★": "#67e8f9",
    "4★": "#d8b4fe",
    "5★": "#fbbf24",
  };

  return {
    ally,
    tier,
    quote: QUOTES[tier][Math.floor(Math.random() * QUOTES[tier].length)],
    color: COLORS[tier],
  };
}

export function getAvailableForms(state: GameState) {
  return BREATH_FORMS.filter((f) => state.unlockedForms.includes(f.formNumber));
}

// Combat helpers
export function computePlayerDamage(
  state: GameState,
  formIdx: number,
  demon: Demon
): { damage: number; isCrit: boolean; isDecapitate: boolean; message: string; mistVeil?: boolean } {
  const forms = getAvailableForms(state);
  const form = forms[formIdx];
  const weaponBonus = state.inventory
    .filter((i) => i.equipped && i.stat === "attack")
    .reduce((acc, it) => acc + (it.value ?? 0), 0);
  const baseAtk = state.attack + weaponBonus;

  const critChance = 0.12 + (state.speed > demon.speed ? 0.08 : 0);
  const crit = Math.random() < critChance;
  const mult = form.multiplier * (crit ? 1.6 : 1) * (0.85 + Math.random() * 0.3);
  let rawDmg = Math.max(4, Math.floor(baseAtk * mult - demon.defense * 0.45));

  let isDecapitate = false;
  let mistVeil = false;
  let message = "";
  if (form.effect === "decapitate") {
    // 50% de probabilidad de decapitar si se usa y el demonio está por debajo del 35% de HP
    if (demon.hp < demon.maxHp * 0.45 || Math.random() < 0.35) {
      rawDmg = demon.hp + 999;
      isDecapitate = true;
      message = `¡¡${form.name} impacta en el cuello! Decapitación inmediata.`;
    } else {
      message = `${form.name} cae sobre ${demon.name}, pero el demonio se zafa parcialmente.`;
    }
  } else if (form.effect === "mist_veil") {
    mistVeil = true;
    message = `${form.name} te envuelve en una cortina de bruma plateada. Los ataques enemigos fallarán más.`;
  } else {
    message = `${form.name} conecta causando ${rawDmg} de daño${crit ? " ¡CRÍTICO!" : ""}.`;
  }
  return { damage: rawDmg, isCrit: crit, isDecapitate, message, mistVeil };
}

export function computeDemonDamage(
  state: GameState,
  demon: Demon,
  mistVeilActive: boolean
): { damage: number; message: string; demonHealed: number } {
  // Regeneración demoníaca
  const heal = demon.tier === "lower" ? 0 : Math.floor(6 + Math.random() * (demon.tier === "muzan" ? 30 : 12));
  const newHp = Math.min(demon.maxHp, demon.hp + heal);
  const actualHeal = newHp - demon.hp;

  const hitChance = Math.max(0.1, 0.75 - state.speed / 120 - (mistVeilActive ? 0.25 : 0));
  if (Math.random() > hitChance) {
    return { damage: 0, message: `¡Esquivas el zarpazo de ${demon.name}!`, demonHealed: actualHeal };
  }
  const armorBonus = state.inventory
    .filter((i) => i.equipped && i.stat === "defense")
    .reduce((acc, it) => acc + (it.value ?? 0), 0);
  const rawDmg = Math.max(
    1,
    Math.floor(demon.attack * (0.8 + Math.random() * 0.4) - (state.defense + armorBonus) * 0.55)
  );
  return {
    damage: rawDmg,
    message: `${demon.name} te golpea con sus garras${demon.bloodArt ? " usando " + demon.bloodArt : ""}: -${rawDmg} HP.`,
    demonHealed: actualHeal,
  };
}

export function clampDemon(id: string, hpOverrides?: number): Demon {
  const base = DEMONS[id];
  if (!base) throw new Error("Unknown demon: " + id);
  return { ...base, hp: hpOverrides ?? base.maxHp, maxHp: base.maxHp };
}

export const RANKS = [
  "Mizunoto",
  "Mizunoe",
  "Kinoto",
  "Kinoe",
  "Tsuguko",
  "Pilar",
];

export function checkRankUp(state: GameState): { newRank: string | null; state: GameState } {
  const s = { ...state };
  const thresholds: Record<string, number> = {
    Mizunoto: 0,
    Mizunoe: 150,
    Kinoto: 400,
    Kinoe: 900,
    Tsuguko: 1600,
    Pilar: 3000,
  };
  let newRank: string | null = null;
  const currentIdx = RANKS.indexOf(s.rank);
  for (let i = RANKS.length - 1; i > currentIdx; i--) {
    if (s.demonsSlain + s.level * 5 >= thresholds[RANKS[i]]) {
      newRank = RANKS[i];
      s.rank = newRank;
      break;
    }
  }
  return { newRank, state: s };
}
