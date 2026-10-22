import { MAPS, START, STORY_BREAKS } from "./maps";
import { tileAt } from "./tiles";
import type { MapDef, NpcDef } from "./types";
import { findNodeById } from "@/lib/storyData";
import { BREATH_FORMS, DEMONS } from "@/lib/game/data";
import type { Demon } from "@/lib/game/types";
import { chaptersCompleted, unlockedFormNumbers } from "@/lib/progress";

export type Facing = "up" | "down" | "left" | "right";
export type Phase = "title" | "world" | "dialogue" | "battle" | "menu";

export type Stats = {
  level: number;
  xp: number;
  hp: number;
  maxHp: number;
  focus: number;
  maxFocus: number;
  attack: number;
  defense: number;
  speed: number;
  demonsSlain: number;
};

export type DialogueLine = { speaker: string; color: string; portrait: string; text: string };

export type Dialogue = {
  lines: DialogueLine[];
  index: number;
  choices: { text: string; nextNodeId: string }[] | null;
  showChoices: boolean;
  pendingBattle: string | null;
  origin: string;
  nodeId: string | null;
};

export type Battle = {
  demon: Demon;
  log: string[];
  focus: number;
  result: "win" | "lose" | "flee" | null;
  xpGained: number;
};

export type GameState = {
  name: { first: string; last: string } | null;
  mapId: string;
  x: number;
  y: number;
  facing: Facing;
  steps: number;
  visited: string[];
  phase: Phase;
  dialogue: Dialogue | null;
  battle: Battle | null;
  pendingBattle: string | null;
  stats: Stats;
  toast: string | null;
  showMission: boolean;
  finished: boolean;
  saveId: number | null;
};

export type Action =
  | { type: "SET_NAME"; first: string; last: string }
  | { type: "HYDRATE"; state: Partial<GameState> }
  | { type: "MOVE"; dir: Facing }
  | { type: "INTERACT" }
  | { type: "DIALOGUE_ADVANCE" }
  | { type: "DIALOGUE_CHOOSE"; index: number }
  | { type: "DIALOGUE_CLOSE" }
  | { type: "TOGGLE_MISSION" }
  | { type: "OPEN_MENU" }
  | { type: "CLOSE_MENU" }
  | { type: "TOAST"; text: string | null }
  | { type: "SET_SAVE_ID"; id: number }
  | { type: "BATTLE_FORM"; index: number }
  | { type: "BATTLE_BREATHE" }
  | { type: "BATTLE_FLEE" }
  | { type: "BATTLE_CLOSE" }
  | { type: "RESET" };

export const BASE_STATS: Stats = {
  level: 1,
  xp: 0,
  hp: 120,
  maxHp: 120,
  focus: 100,
  maxFocus: 100,
  attack: 26,
  defense: 12,
  speed: 20,
  demonsSlain: 0,
};

export function initialState(): GameState {
  return {
    name: null,
    mapId: START.mapId,
    x: START.x,
    y: START.y,
    facing: "down",
    steps: 0,
    visited: [],
    phase: "title",
    dialogue: null,
    battle: null,
    pendingBattle: null,
    stats: { ...BASE_STATS },
    toast: null,
    showMission: false,
    finished: false,
    saveId: null,
  };
}

/* ---------------------------- utilidades ---------------------------- */

export function mapOf(state: GameState): MapDef {
  return MAPS[state.mapId] ?? MAPS[START.mapId];
}

export function fillName(text: string, name: GameState["name"]): string {
  if (!name) return text;
  return text
    .replaceAll("{firstName}", name.first)
    .replaceAll("{lastName}", name.last)
    .replaceAll("{fullName}", `${name.first} ${name.last}`);
}

export function availableForms(visited: string[]) {
  const nums = unlockedFormNumbers(visited);
  return BREATH_FORMS.filter((f) => nums.includes(f.formNumber));
}

function npcAt(map: MapDef, x: number, y: number): NpcDef | undefined {
  return map.npcs.find((n) => n.x === x && n.y === y);
}

function isBlocked(state: GameState, x: number, y: number): boolean {
  const map = mapOf(state);
  if (tileAt(map.rows, x, y).solid) return true;
  if (npcAt(map, x, y)) return true;
  return false;
}

const DELTA: Record<Facing, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

function facingTile(state: GameState): [number, number] {
  const [dx, dy] = DELTA[state.facing];
  return [state.x + dx, state.y + dy];
}

/* ---------------------------- diálogo ---------------------------- */

function buildDialogue(state: GameState, nodeId: string, origin: string, pendingBattle: string | null): Dialogue | null {
  const found = findNodeById(nodeId);
  if (!found) {
    return {
      lines: [{ speaker: "Narrador", color: "text-slate-300", portrait: "📜", text: "Esta escena aún no está disponible." }],
      index: 0,
      choices: null,
      showChoices: false,
      pendingBattle,
      origin,
      nodeId: null,
    };
  }
  const { node } = found;
  const lines: DialogueLine[] = node.paragraphs.map((p) => ({
    speaker: node.speaker,
    color: node.speakerColor ?? "text-amber-200",
    portrait: node.portraitEmoji ?? "📜",
    text: fillName(p, state.name),
  }));
  return {
    lines,
    index: 0,
    choices: node.choices ? node.choices.map((c) => ({ text: fillName(c.text, state.name), nextNodeId: c.nextNodeId })) : null,
    showChoices: false,
    pendingBattle,
    origin,
    nodeId,
  };
}

function plainDialogue(text: string, speaker = "…", portrait = "💬"): Dialogue {
  return {
    lines: [{ speaker, color: "text-slate-200", portrait, text }],
    index: 0,
    choices: null,
    showChoices: false,
    pendingBattle: null,
    origin: "charla",
    nodeId: null,
  };
}

function markVisited(state: GameState, nodeId: string): string[] {
  return state.visited.includes(nodeId) ? state.visited : [...state.visited, nodeId];
}

function missionToastBefore(visited: string[]): number {
  return chaptersCompleted(visited);
}

/* ---------------------------- combate ---------------------------- */

function startBattle(state: GameState, demonId: string): GameState {
  const base = DEMONS[demonId];
  if (!base) return state;
  const scale = 1 + Math.max(0, state.stats.level - 1) * 0.05;
  const demon: Demon = {
    ...base,
    maxHp: Math.floor(base.maxHp * scale),
    hp: Math.floor(base.maxHp * scale),
    attack: Math.floor(base.attack * scale),
    defense: Math.floor(base.defense * scale),
  };
  return {
    ...state,
    phase: "battle",
    dialogue: null,
    pendingBattle: null,
    battle: {
      demon,
      log: [`¡${demon.name} aparece!`, demon.dialogue[0] ?? ""],
      focus: state.stats.focus,
      result: null,
      xpGained: 0,
    },
  };
}

function xpForNext(level: number) {
  return 70 + level * 55;
}

function grantRewards(state: GameState, xp: number): { stats: Stats; notes: string[] } {
  const stats = { ...state.stats };
  stats.xp += xp;
  stats.demonsSlain += 1;
  const notes: string[] = [`+${xp} XP`];
  while (stats.xp >= xpForNext(stats.level)) {
    stats.xp -= xpForNext(stats.level);
    stats.level += 1;
    stats.maxHp += 20;
    stats.maxFocus += 6;
    stats.attack += 5;
    stats.defense += 3;
    stats.speed += 2;
    notes.push(`¡Nivel ${stats.level}!`);
  }
  stats.hp = Math.min(stats.maxHp, stats.hp + Math.floor(stats.maxHp * 0.2));
  return { stats, notes };
}

function demonCounter(state: GameState, demon: Demon, log: string[]): { hp: number; demonHp: number; log: string[] } {
  const nextLog = [...log];
  let demonHp = demon.hp;
  const regen = demon.tier === "lower" ? 0 : Math.floor(4 + Math.random() * 8);
  if (regen > 0 && demonHp < demon.maxHp) {
    demonHp = Math.min(demon.maxHp, demonHp + regen);
    nextLog.push(`${demon.name} regenera ${regen} PV con su sangre demoníaca.`);
  }
  const dodge = Math.max(0.12, 0.78 - state.stats.speed / 140);
  if (Math.random() > dodge) {
    nextLog.push(`¡Esquivas el ataque de ${demon.name}!`);
    return { hp: state.stats.hp, demonHp, log: nextLog };
  }
  const dmg = Math.max(2, Math.floor(demon.attack * (0.85 + Math.random() * 0.35) - state.stats.defense * 0.5));
  nextLog.push(`${demon.name} te golpea: -${dmg} PV.`);
  return { hp: Math.max(0, state.stats.hp - dmg), demonHp, log: nextLog };
}

function safeRespawn(state: GameState): { mapId: string; x: number; y: number } {
  if (chaptersCompleted(state.visited) >= 2) return { mapId: "hq_wisteria", x: 13, y: 16 };
  return { mapId: "kumotori", x: 5, y: 7 };
}

/* ---------------------------- casilla actual ---------------------------- */

function resolveTile(state: GameState, moved: boolean): GameState {
  const map = mapOf(state);
  const { x, y } = state;

  const trigger = map.triggers.find((t) => t.x === x && t.y === y);
  if (trigger && !(trigger.once && state.visited.includes(trigger.nodeId))) {
    const visited = markVisited(state, trigger.nodeId);
    const before = missionToastBefore(state.visited);
    const dialogue = buildDialogue({ ...state, visited }, trigger.nodeId, trigger.label ?? "Escena", trigger.battle ?? null);
    return withMissionToast({ ...state, visited, phase: "dialogue", dialogue }, before);
  }

  const warp = map.warps.find((w) => w.x === x && w.y === y);
  if (warp) {
    const done = chaptersCompleted(state.visited);
    const nodeOk = !warp.requiresAnyNode || warp.requiresAnyNode.some((n) => state.visited.includes(n));
    if ((warp.requiresChapters ?? 0) > done || !nodeOk) {
      return {
        ...state,
        toast: `El camino a «${warp.label}» sigue cerrado. Completa la misión actual.`,
      };
    }
    const target = MAPS[warp.to];
    if (!target) return state;
    return {
      ...state,
      mapId: warp.to,
      x: warp.toX,
      y: warp.toY,
      steps: 0,
      toast: `📍 ${fillName(target.name, state.name)}`,
    };
  }

  if (moved && tileAt(map.rows, x, y).grass && map.encounters?.length && state.steps > 2) {
    const rate = map.encounterRate ?? 0.16;
    if (Math.random() < rate) {
      const pick = map.encounters[Math.floor(Math.random() * map.encounters.length)];
      return startBattle(state, pick);
    }
  }
  return state;
}

function withMissionToast(state: GameState, chaptersBefore: number): GameState {
  const after = chaptersCompleted(state.visited);
  if (after > chaptersBefore) {
    const forms = availableForms(state.visited).length;
    return {
      ...state,
      toast: `✅ ¡Misión completada! Nueva forma de respiración disponible (${forms} en total).`,
      finished: state.visited.includes("c5_boda"),
    };
  }
  return state;
}

/* ---------------------------- reducer ---------------------------- */

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_NAME": {
      return {
        ...state,
        name: { first: action.first, last: action.last },
        phase: "world",
        toast: `Bienvenido al Cuerpo, ${action.first} ${action.last}.`,
      };
    }

    case "HYDRATE":
      return { ...state, ...action.state, phase: action.state.phase === "title" ? "world" : (action.state.phase ?? "world") };

    case "RESET":
      return { ...initialState(), phase: "world", name: state.name };

    case "TOAST":
      return { ...state, toast: action.text };

    case "SET_SAVE_ID":
      return { ...state, saveId: action.id };

    case "TOGGLE_MISSION":
      return { ...state, showMission: !state.showMission };

    case "OPEN_MENU":
      return state.phase === "world" ? { ...state, phase: "menu" } : state;

    case "CLOSE_MENU":
      return state.phase === "menu" ? { ...state, phase: "world" } : state;

    case "MOVE": {
      if (state.phase !== "world") return { ...state, facing: action.dir };
      const [dx, dy] = DELTA[action.dir];
      const nx = state.x + dx;
      const ny = state.y + dy;
      if (isBlocked(state, nx, ny)) {
        // Chocar contra un NPC permite hablarle directamente.
        const map = mapOf(state);
        const npc = npcAt(map, nx, ny);
        if (npc) return talkTo(state, npc);
        return { ...state, facing: action.dir };
      }
      const moved: GameState = { ...state, x: nx, y: ny, facing: action.dir, steps: state.steps + 1 };
      return resolveTile(moved, true);
    }

    case "INTERACT": {
      if (state.phase === "dialogue") return advanceDialogue(state);
      if (state.phase !== "world") return state;
      const map = mapOf(state);
      const [tx, ty] = facingTile(state);
      const npc = npcAt(map, tx, ty);
      if (npc) return talkTo(state, npc);
      const here = map.triggers.find((t) => t.x === state.x && t.y === state.y);
      if (here && !(here.once && state.visited.includes(here.nodeId))) return resolveTile(state, false);
      const tile = tileAt(map.rows, tx, ty);
      if (tile.emoji === "🚪") return { ...state, toast: "La puerta está cerrada." };
      return state;
    }

    case "DIALOGUE_ADVANCE":
      return state.phase === "dialogue" ? advanceDialogue(state) : state;

    case "DIALOGUE_CHOOSE": {
      const d = state.dialogue;
      if (state.phase !== "dialogue" || !d || !d.choices) return state;
      const choice = d.choices[action.index];
      if (!choice) return state;
      if (STORY_BREAKS.has(choice.nextNodeId)) return closeDialogue(state);
      const visited = markVisited(state, choice.nextNodeId);
      const before = missionToastBefore(state.visited);
      const dialogue = buildDialogue({ ...state, visited }, choice.nextNodeId, d.origin, d.pendingBattle);
      if (!dialogue) return closeDialogue(state);
      return withMissionToast({ ...state, visited, dialogue }, before);
    }

    case "DIALOGUE_CLOSE":
      return closeDialogue(state);

    case "BATTLE_FORM": {
      const b = state.battle;
      if (!b || b.result) return state;
      const forms = availableForms(state.visited);
      const form = forms[action.index];
      if (!form) return state;
      if (b.focus < form.cost) {
        return { ...state, battle: { ...b, log: [...b.log, "Te falta oxígeno: usa la Respiración profunda."].slice(-6) } };
      }
      const crit = Math.random() < 0.14;
      const raw = Math.max(
        3,
        Math.floor(state.stats.attack * form.multiplier * (crit ? 1.7 : 1) * (0.88 + Math.random() * 0.26) - b.demon.defense * 0.45),
      );
      const lethal = form.effect === "decapitate" && (b.demon.hp < b.demon.maxHp * 0.4 || Math.random() < 0.3);
      const dmg = lethal ? b.demon.hp + 999 : raw;
      const demonHp = Math.max(0, b.demon.hp - dmg);
      let log = [
        ...b.log,
        `${form.name}${crit ? " ¡CRÍTICO!" : ""} → ${lethal ? "¡DECAPITACIÓN!" : `${dmg} de daño`}`,
      ];

      if (demonHp <= 0) {
        log = [...log, `¡${b.demon.name} se desintegra!`, `«${b.demon.deathQuote}»`];
        const { stats, notes } = grantRewards(state, b.demon.xpReward);
        return {
          ...state,
          stats: { ...stats, focus: b.focus - form.cost },
          battle: { ...b, demon: { ...b.demon, hp: 0 }, log: log.slice(-8), result: "win", xpGained: b.demon.xpReward },
          toast: `⚔️ Victoria · ${notes.join(" · ")}`,
        };
      }

      const counter = demonCounter(state, { ...b.demon, hp: demonHp }, log);
      if (counter.hp <= 0) {
        return {
          ...state,
          stats: { ...state.stats, hp: 0 },
          battle: {
            ...b,
            demon: { ...b.demon, hp: counter.demonHp },
            log: [...counter.log, "Tus rodillas ceden... la bruma se cierra sobre ti."].slice(-8),
            focus: Math.max(0, b.focus - form.cost),
            result: "lose",
          },
        };
      }
      return {
        ...state,
        stats: { ...state.stats, hp: counter.hp },
        battle: {
          ...b,
          demon: { ...b.demon, hp: counter.demonHp },
          log: counter.log.slice(-8),
          focus: Math.max(0, b.focus - form.cost),
        },
      };
    }

    case "BATTLE_BREATHE": {
      const b = state.battle;
      if (!b || b.result) return state;
      const focus = Math.min(state.stats.maxFocus, b.focus + 40);
      const counter = demonCounter(state, b.demon, [...b.log, "Concentras el oxígeno: +40 de aliento."]);
      if (counter.hp <= 0) {
        return {
          ...state,
          stats: { ...state.stats, hp: 0 },
          battle: { ...b, focus, log: [...counter.log, "Has caído..."].slice(-8), result: "lose" },
        };
      }
      return {
        ...state,
        stats: { ...state.stats, hp: counter.hp },
        battle: { ...b, demon: { ...b.demon, hp: counter.demonHp }, focus, log: counter.log.slice(-8) },
      };
    }

    case "BATTLE_FLEE": {
      const b = state.battle;
      if (!b || b.result) return state;
      if (b.demon.isBoss) {
        return { ...state, battle: { ...b, log: [...b.log, "¡No puedes huir de una Luna Demoníaca!"].slice(-6) } };
      }
      const chance = state.stats.speed >= b.demon.speed ? 0.85 : 0.5;
      if (Math.random() < chance) {
        return {
          ...state,
          phase: "world",
          battle: null,
          stats: { ...state.stats, focus: b.focus, hp: Math.max(1, state.stats.hp - 6) },
          toast: "Te repliegas entre la niebla (-6 PV).",
        };
      }
      const counter = demonCounter(state, b.demon, [...b.log, "¡Fallaste la huida!"]);
      return {
        ...state,
        stats: { ...state.stats, hp: counter.hp },
        battle: {
          ...b,
          demon: { ...b.demon, hp: counter.demonHp },
          focus: b.focus,
          log: counter.hp <= 0 ? [...counter.log, "Has caído..."].slice(-8) : counter.log.slice(-8),
          result: counter.hp <= 0 ? "lose" : null,
        },
      };
    }

    case "BATTLE_CLOSE": {
      const b = state.battle;
      if (!b) return { ...state, phase: "world", battle: null };
      if (b.result === "lose") {
        const home = safeRespawn(state);
        const hp = Math.max(1, Math.floor(state.stats.maxHp * 0.5));
        return {
          ...state,
          phase: "world",
          battle: null,
          mapId: home.mapId,
          x: home.x,
          y: home.y,
          stats: { ...state.stats, hp, focus: state.stats.maxFocus },
          toast: "Los Kakushi te llevan a un lugar seguro. La misión sigue en pie.",
        };
      }
      return { ...state, phase: "world", battle: null, stats: { ...state.stats, focus: b.focus } };
    }

    default:
      return state;
  }
}

/* ---------------------------- helpers de diálogo ---------------------------- */

function talkTo(state: GameState, npc: NpcDef): GameState {
  if (npc.nodeId && !state.visited.includes(npc.nodeId)) {
    const visited = markVisited(state, npc.nodeId);
    const before = missionToastBefore(state.visited);
    const dialogue = buildDialogue({ ...state, visited }, npc.nodeId, npc.name, npc.battle ?? null);
    return withMissionToast({ ...state, visited, phase: "dialogue", dialogue }, before);
  }
  const line = npc.lines[Math.floor(Math.random() * npc.lines.length)] ?? "…";
  return { ...state, phase: "dialogue", dialogue: plainDialogue(fillName(line, state.name), npc.name, npc.emoji) };
}

function advanceDialogue(state: GameState): GameState {
  const d = state.dialogue;
  if (!d) return { ...state, phase: "world" };
  if (d.index < d.lines.length - 1) {
    return { ...state, dialogue: { ...d, index: d.index + 1 } };
  }
  if (d.choices && !d.showChoices) {
    return { ...state, dialogue: { ...d, showChoices: true } };
  }
  const nodeId = d.nodeId;
  if (nodeId) {
    const node = findNodeById(nodeId)?.node;
    const next = node?.nextNodeId;
    if (next && !STORY_BREAKS.has(next)) {
      const visited = markVisited(state, next);
      const before = missionToastBefore(state.visited);
      const dialogue = buildDialogue({ ...state, visited }, next, d.origin, d.pendingBattle);
      if (dialogue) return withMissionToast({ ...state, visited, dialogue }, before);
    }
  }
  return closeDialogue(state);
}



function closeDialogue(state: GameState): GameState {
  const pending = state.dialogue?.pendingBattle ?? state.pendingBattle;
  if (pending) {
    return startBattle({ ...state, dialogue: null, pendingBattle: null }, pending);
  }
  return { ...state, phase: "world", dialogue: null };
}

/* ---------------------------- persistencia ---------------------------- */

export type Serialized = {
  name: GameState["name"];
  mapId: string;
  x: number;
  y: number;
  visited: string[];
  stats: Stats;
  finished: boolean;
};

export function serialize(state: GameState): Serialized {
  return {
    name: state.name,
    mapId: state.mapId,
    x: state.x,
    y: state.y,
    visited: state.visited,
    stats: state.stats,
    finished: state.finished,
  };
}

export function deserialize(data: Partial<Serialized> | null): Partial<GameState> | null {
  if (!data || !data.name || !data.mapId || !MAPS[data.mapId]) return null;
  return {
    name: data.name,
    mapId: data.mapId,
    x: typeof data.x === "number" ? data.x : START.x,
    y: typeof data.y === "number" ? data.y : START.y,
    visited: Array.isArray(data.visited) ? data.visited : [],
    stats: { ...BASE_STATS, ...(data.stats ?? {}) },
    finished: !!data.finished,
    phase: "world",
  };
}
