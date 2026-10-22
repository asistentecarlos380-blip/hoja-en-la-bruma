"use client";

import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import type { GameState, Ally, InventoryItem, Demon } from "./types";
import { DEFAULT_STATE, applyXp, rollGacha, checkRankUp } from "./engine";
import { LOCATIONS } from "./data";

type GamePhase =
  | "menu"
  | "worldmap"
  | "story"
  | "combat"
  | "shrine"
  | "character"
  | "location"
  | "gameover"
  | "victory";

type CombatState = {
  demon: Demon;
  playerTurn: boolean;
  log: string[];
  focus: number;
  mistVeilTurns: number;
  isBoss: boolean;
  afterBattleNode?: string;
  reward?: { xp: number; orbs: number };
};

type GameAction =
  | { type: "LOAD_STATE"; payload: GameState }
  | { type: "NEW_GAME"; playerName?: string }
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "TRAVEL"; locationId: string }
  | { type: "START_STORY"; nodeId: string }
  | { type: "ADVANCE_STORY"; nextNode?: string; flagSet?: { key: string; value: any }; reward?: any }
  | { type: "START_COMBAT"; demonId: string; afterNode?: string; isBoss?: boolean; level?: number }
  | { type: "COMBAT_ATTACK"; formIndex: number }
  | { type: "COMBAT_BREATHE" }
  | { type: "COMBAT_FLEE" }
  | { type: "COMBAT_END" }
  | { type: "HEAL" }
  | { type: "GA_CHA"; times: 1 | 10 }
  | { type: "EQUIP_ITEM"; itemId: string }
  | { type: "USE_CONSUMABLE"; itemId: string }
  | { type: "SET_NOTES"; notes: string }
  | { type: "REST_AT_INN" };

type FullState = {
  game: GameState;
  phase: GamePhase;
  previousPhase: GamePhase;
  currentStoryNodeId?: string;
  combat?: CombatState;
  lastGacha?: any[];
  levelUpQueue: string[];
  notification?: string;
};

function initial(): FullState {
  return {
    game: { ...DEFAULT_STATE, id: undefined } as GameState,
    phase: "menu",
    previousPhase: "menu",
    levelUpQueue: [],
  };
}

function reducer(state: FullState, action: GameAction): FullState {
  switch (action.type) {
    case "LOAD_STATE": {
      return { ...state, game: action.payload, phase: "worldmap" };
    }
    case "NEW_GAME": {
      const name = action.playerName || "Shinjo Ren";
      return {
        ...state,
        game: { ...DEFAULT_STATE, playerName: name } as GameState,
        phase: "story",
        currentStoryNodeId: "intro_0",
        levelUpQueue: [],
      };
    }
    case "SET_PHASE": {
      return { ...state, previousPhase: state.phase, phase: action.phase };
    }
    case "TRAVEL": {
      const loc = LOCATIONS[action.locationId];
      if (!loc) return state;
      const currentLoc = LOCATIONS[state.game.currentLocation];
      if (currentLoc && !currentLoc.connections.includes(action.locationId) && action.locationId !== state.game.currentLocation) {
        return { ...state, notification: "No puedes viajar directamente a ese lugar." };
      }
      return {
        ...state,
        game: { ...state.game, currentLocation: action.locationId, hp: Math.min(state.game.maxHp, state.game.hp + 5) },
        phase: "location",
        notification: `Llegaste a: ${loc.name}`,
      };
    }
    case "START_STORY": {
      const { getStoryNode } = require("./story") as typeof import("./story");
      const node = getStoryNode(action.nodeId);
      const newGame = node && node.location ? { ...state.game, currentLocation: node.location } : state.game;
      return { ...state, game: newGame, phase: "story", currentStoryNodeId: action.nodeId };
    }
    case "ADVANCE_STORY": {
      let game = { ...state.game };
      let messages: string[] = [];
      if (action.flagSet) {
        game.storyFlags = { ...game.storyFlags, [action.flagSet.key]: action.flagSet.value };
      }
      // Advance chapter based on next node
      if (action.nextNode) {
        const { getStoryNode } = require("./story") as typeof import("./story");
        const nextN = getStoryNode(action.nextNode);
        if (nextN && nextN.chapter > game.storyChapter) {
          game.storyChapter = nextN.chapter;
          messages.push(`— Capítulo ${nextN.chapter} —`);
        }
      }
      if (action.reward) {
        const r = action.reward;
        if (r.xp) {
          const res = applyXp(game, r.xp);
          game = res.state;
          if (res.leveledUp) messages.push(`¡Subiste ${res.levelsGained} nivel(es)!`);
        }
        if (r.orbs) {
          game.orbs += r.orbs;
          messages.push(`+${r.orbs} orobras de la bruma.`);
        }
        if (r.maxHp) {
          game.maxHp += r.maxHp;
          game.hp = game.maxHp;
          messages.push(`HP máximo +${r.maxHp}`);
        }
        if (r.attack) {
          game.attack += r.attack;
          messages.push(`ATQ +${r.attack}`);
        }
        if (r.defense) {
          game.defense += r.defense;
          messages.push(`DEF +${r.defense}`);
        }
        if (r.speed) {
          game.speed += r.speed;
          messages.push(`VEL +${r.speed}`);
        }
        if (r.unlockForm) {
          if (!game.unlockedForms.includes(r.unlockForm)) {
            game.unlockedForms = [...game.unlockedForms, r.unlockForm].sort((a, b) => a - b);
            messages.push(`¡Desbloqueaste una nueva forma de respiración! (Forma ${r.unlockForm})`);
          }
        }
        if (r.item) {
          game.inventory = [
            ...game.inventory,
            { id: `item_${Date.now()}`, name: r.item, type: "relic", description: "Objeto obtenido en la historia.", quantity: 1, value: 0 },
          ];
          messages.push(`Obtenido: ${r.item}`);
        }
      }
      // Check rank up
      const rankCheck = checkRankUp(game);
      if (rankCheck.newRank) {
        game = rankCheck.state;
        messages.push(`¡Has ascendido al rango ${rankCheck.newRank}!`);
      }
      return {
        ...state,
        game,
        currentStoryNodeId: action.nextNode,
        phase: action.nextNode ? "story" : "worldmap",
        notification: messages.length ? messages.join(" | ") : state.notification,
        levelUpQueue: messages,
      };
    }
    case "START_COMBAT": {
      const { DEMONS } = require("./data") as typeof import("./data");
      const d = DEMONS[action.demonId];
      if (!d) return state;
      const loc = LOCATIONS[state.game.currentLocation];
      const levelFactor = action.level ?? Math.max(1, state.game.level - 1 + loc.chapterRequired);
      const scale = 1 + (levelFactor - 1) * 0.06;
      const demonInstance: Demon = {
        ...d,
        maxHp: Math.floor(d.maxHp * scale),
        hp: Math.floor(d.maxHp * scale),
        attack: Math.floor(d.attack * scale),
        defense: Math.floor(d.defense * scale),
        xpReward: Math.floor(d.xpReward * scale),
        orbReward: d.orbReward,
      };
      return {
        ...state,
        phase: "combat",
        combat: {
          demon: demonInstance,
          playerTurn: true,
          log: [`¡Un ${d.name} aparece!`, `"${d.dialogue[0]}"`],
          focus: state.game.focus,
          mistVeilTurns: 0,
          isBoss: !!action.isBoss || !!d.isBoss,
          afterBattleNode: action.afterNode,
          reward: { xp: demonInstance.xpReward, orbs: demonInstance.orbReward },
        },
      };
    }
    case "COMBAT_ATTACK": {
      if (!state.combat) return state;
      const { combat, game } = state;
      const forms = (require("./engine") as typeof import("./engine")).getAvailableForms(game);
      const form = forms[action.formIndex];
      if (!form) return state;
      if (combat.focus < form.cost) {
        return { ...state, combat: { ...combat, log: [...combat.log, "No tienes suficiente oxígeno. Respira profundo."].slice(-6) } };
      }
      const engine = require("./engine") as typeof import("./engine");
      const dmg = engine.computePlayerDamage(game, action.formIndex, combat.demon);
      const newDemonHp = Math.max(0, combat.demon.hp - dmg.damage);
      let newLog = [...combat.log, dmg.message];
      let newMist = combat.mistVeilTurns;
      if (dmg.mistVeil) newMist = 3;
      if (newDemonHp <= 0) {
        const updatedGame = { ...game };
        updatedGame.demonsSlain += 1;
        newLog.push(`¡Has derrotado a ${combat.demon.name}!`);
        newLog.push(`"${combat.demon.deathQuote}"`);
        const xpRes = applyXp(updatedGame, combat.reward!.xp);
        Object.assign(updatedGame, xpRes.state);
        updatedGame.orbs += combat.reward!.orbs;
        // Bonus heal on victory
        updatedGame.hp = Math.min(updatedGame.maxHp, updatedGame.hp + 20);
        const rankCheck = checkRankUp(updatedGame);
        let notif = `+${combat.reward!.xp} XP | +${combat.reward!.orbs} orobras.`;
        if (xpRes.leveledUp) notif += ` ¡Subiste a nivel ${updatedGame.level}!`;
        if (rankCheck.newRank) {
          Object.assign(updatedGame, rankCheck.state);
          notif += ` ¡Rango ${rankCheck.newRank}!`;
        }
        return {
          ...state,
          game: updatedGame,
          combat: { ...combat, demon: { ...combat.demon, hp: 0 }, log: newLog.slice(-8) },
          notification: notif,
        };
      }
      // Demon turn
      const demonAtk = engine.computeDemonDamage(game, { ...combat.demon, hp: newDemonHp }, newMist > 0);
      const newPlayerHp = Math.max(0, game.hp - demonAtk.damage);
      if (demonAtk.demonHealed > 0) {
        newLog.push(`${combat.demon.name} regenera ${demonAtk.demonHealed} HP por su sangre demoníaca.`);
      }
      newLog.push(demonAtk.message);
      const demonHpAfterHeal = Math.min(combat.demon.maxHp, newDemonHp + demonAtk.demonHealed);
      if (newPlayerHp <= 0) {
        newLog.push("Has caído en combate... La bruma te envuelve y te desvaneces.");
        return {
          ...state,
          game: { ...game, hp: 0 },
          combat: {
            ...combat,
            demon: { ...combat.demon, hp: demonHpAfterHeal },
            log: newLog.slice(-8),
            focus: combat.focus - form.cost,
            mistVeilTurns: Math.max(0, newMist - 1),
          },
        };
      }
      return {
        ...state,
        game: { ...game, hp: newPlayerHp },
        combat: {
          ...combat,
          demon: { ...combat.demon, hp: demonHpAfterHeal },
          log: newLog.slice(-8),
          focus: combat.focus - form.cost,
          mistVeilTurns: Math.max(0, newMist - 1),
          playerTurn: true,
        },
      };
    }
    case "COMBAT_BREATHE": {
      if (!state.combat) return state;
      const newFocus = Math.min(state.game.maxFocus, state.combat.focus + 40);
      const newLog = [...state.combat.log, "Concentras tu respiración: +40 O2."];
      // Demon gets a free hit
      const engine = require("./engine") as typeof import("./engine");
      const demonAtk = engine.computeDemonDamage(state.game, state.combat.demon, state.combat.mistVeilTurns > 0);
      const newPlayerHp = Math.max(0, state.game.hp - demonAtk.damage);
      if (demonAtk.demonHealed > 0) newLog.push(`${state.combat.demon.name} regenera ${demonAtk.demonHealed} HP.`);
      newLog.push(demonAtk.message);
      if (newPlayerHp <= 0) {
        newLog.push("Has caído...");
        return {
          ...state,
          game: { ...state.game, hp: 0 },
          combat: { ...state.combat, log: newLog.slice(-8), focus: newFocus },
        };
      }
      return {
        ...state,
        game: { ...state.game, hp: newPlayerHp },
        combat: { ...state.combat, log: newLog.slice(-8), focus: newFocus, mistVeilTurns: Math.max(0, state.combat.mistVeilTurns - 1) },
      };
    }
    case "COMBAT_FLEE": {
      if (!state.combat) return state;
      if (state.combat.isBoss) {
        return { ...state, combat: { ...state.combat, log: [...state.combat.log, "¡No puedes huir de un combate de jefe!"].slice(-6) } };
      }
      const success = state.game.speed >= state.combat.demon.speed ? Math.random() < 0.85 : Math.random() < 0.5;
      if (success) {
        return {
          ...state,
          phase: "location",
          combat: undefined,
          game: { ...state.game, hp: Math.max(1, state.game.hp - 10) },
          notification: "Huiste con éxito. Perdiste 10 HP por las heridas.",
        };
      }
      const engine = require("./engine") as typeof import("./engine");
      const demonAtk = engine.computeDemonDamage(state.game, state.combat.demon, state.combat.mistVeilTurns > 0);
      const newPlayerHp = Math.max(0, state.game.hp - demonAtk.damage);
      return {
        ...state,
        game: { ...state.game, hp: newPlayerHp },
        combat: {
          ...state.combat,
          log: [...state.combat.log, "¡Fallaste al huir!", demonAtk.message].slice(-8),
          mistVeilTurns: Math.max(0, state.combat.mistVeilTurns - 1),
        },
      };
    }
    case "COMBAT_END": {
      const afterNode = state.combat?.afterBattleNode;
      if (state.game.hp <= 0) {
        return {
          ...state,
          phase: "gameover",
          combat: undefined,
        };
      }
      return {
        ...state,
        phase: afterNode ? "story" : "location",
        currentStoryNodeId: afterNode,
        combat: undefined,
      };
    }
    case "HEAL": {
      // Full heal to full HP (for a cost? Free for now in town)
      return { ...state, game: { ...state.game, hp: state.game.maxHp, focus: state.game.maxFocus } };
    }
    case "GA_CHA": {
      const times = action.times;
      if (state.game.orbs < times) return { ...state, notification: "No tienes suficientes orobras." };
      const pulls: any[] = [];
      let game = { ...state.game, orbs: state.game.orbs - times, gachaPulls: state.game.gachaPulls + times };
      for (let i = 0; i < times; i++) {
        const pull = rollGacha();
        pulls.push(pull);
        if (pull.ally) {
          if (!game.allies.find((a) => a.id === pull.ally!.id)) {
            game.allies = [...game.allies, pull.ally];
          } else {
            // Duplicate: convert to stat bonus
            game.attack += 2;
            game.maxHp += 10;
            game.hp = Math.min(game.maxHp, game.hp + 10);
          }
        }
      }
      return { ...state, game, lastGacha: pulls, phase: "shrine" };
    }
    case "EQUIP_ITEM": {
      const items = state.game.inventory.map((it) =>
        it.id === action.itemId ? { ...it, equipped: !it.equipped } : it
      );
      return { ...state, game: { ...state.game, inventory: items } };
    }
    case "REST_AT_INN": {
      return {
        ...state,
        game: { ...state.game, hp: state.game.maxHp, focus: state.game.maxFocus },
        notification: "Has descansado. HP y O2 restaurados.",
      };
    }
    case "SET_NOTES": {
      return { ...state, game: { ...state.game, notes: action.notes } };
    }
    default:
      return state;
  }
}

type GameCtx = {
  state: FullState;
  dispatch: React.Dispatch<GameAction>;
  saveGame: () => Promise<void>;
};

const GameContext = createContext<GameCtx | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial());

  // Try to load from localStorage on mount
  useEffect(() => {
    fetch("/api/load")
      .then((r) => r.json())
      .then((data) => {
        if (data.save) {
          const mapped: GameState = {
            ...data.save,
            maxHp: data.save.maxHp,
            maxFocus: data.save.focus,
            inventory: data.save.inventory ?? [],
            unlockedForms: data.save.unlockedForms ?? [1],
            allies: data.save.allies ?? [],
            relationships: data.save.relationships ?? {},
            storyFlags: data.save.storyFlags ?? {},
          } as any;
          dispatch({ type: "LOAD_STATE", payload: mapped });
        }
      })
      .catch(() => {});
  }, []);

  const saveGame = useCallback(async () => {
    await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.game),
    });
  }, [state.game]);

  // Auto-save on game changes
  useEffect(() => {
    if (state.phase === "menu") return;
    const t = setTimeout(() => {
      saveGame();
    }, 800);
    return () => clearTimeout(t);
  }, [state.game, saveGame]);

  return <GameContext.Provider value={{ state, dispatch, saveGame }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}
