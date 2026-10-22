"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import NameEntry from "@/components/NameEntry";
import Viewport from "@/components/game/Viewport";
import DialogueBox, { type DialogueHandle } from "@/components/game/DialogueBox";
import BattleScreen from "@/components/game/BattleScreen";
import TouchControls from "@/components/game/TouchControls";
import { Hud, MenuOverlay, MissionPanel } from "@/components/game/Hud";
import {
  deserialize,
  initialState,
  reducer,
  serialize,
  type Facing,
  type GameState,
} from "@/game/engine";
import { chaptersCompleted, playerRank, unlockedFormNumbers } from "@/lib/progress";

const LOCAL_KEY = "kd_save_v3";
const KEY_DIRS: Record<string, Facing> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

export default function GameRoot() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [booted, setBooted] = useState(false);
  const [victoryDismissed, setVictoryDismissed] = useState(false);
  const heldDir = useRef<Facing | null>(null);
  const dialogueRef = useRef<DialogueHandle | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  /* ------------------------- carga de partida ------------------------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = typeof window !== "undefined" ? window.localStorage.getItem(LOCAL_KEY) : null;
      if (local) {
        try {
          const restored = deserialize(JSON.parse(local));
          if (restored && !cancelled) {
            dispatch({ type: "HYDRATE", state: restored });
            setBooted(true);
            return;
          }
        } catch {
          /* partida local ilegible: se ignora */
        }
      }
      try {
        const res = await fetch("/api/load");
        const data = await res.json();
        const flags = data?.save?.storyFlags ?? null;
        if (flags && !cancelled) {
          const restored = deserialize({
            name: flags.name ?? null,
            mapId: data.save.currentLocation,
            x: flags.x,
            y: flags.y,
            visited: flags.visited ?? [],
            stats: {
              level: data.save.level,
              xp: data.save.xp,
              hp: data.save.hp,
              maxHp: data.save.maxHp,
              focus: data.save.focus,
              maxFocus: 100,
              attack: data.save.attack,
              defense: data.save.defense,
              speed: data.save.speed,
              demonsSlain: data.save.demonsSlain,
            },
            finished: !!flags.finished,
          });
          if (restored) {
            dispatch({ type: "HYDRATE", state: { ...restored, saveId: data.save.id } });
          }
        }
      } catch {
        /* sin servidor: se juega solo con almacenamiento local */
      } finally {
        if (!cancelled) setBooted(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ------------------------- guardado automático ------------------------- */
  const persist = useCallback(
    async (snapshot: GameState) => {
      const data = serialize(snapshot);
      try {
        window.localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      } catch {
        /* almacenamiento no disponible */
      }
      if (!snapshot.name) return;
      try {
        const res = await fetch("/api/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: snapshot.saveId ?? undefined,
            playerName: `${snapshot.name.first} ${snapshot.name.last}`,
            rank: playerRank(snapshot.visited, snapshot.stats.demonsSlain),
            breathingStyle: "Bruma Plateada",
            level: snapshot.stats.level,
            xp: snapshot.stats.xp,
            hp: snapshot.stats.hp,
            maxHp: snapshot.stats.maxHp,
            attack: snapshot.stats.attack,
            defense: snapshot.stats.defense,
            speed: snapshot.stats.speed,
            focus: snapshot.stats.focus,
            currentLocation: snapshot.mapId,
            storyChapter: chaptersCompleted(snapshot.visited),
            storyFlags: { x: snapshot.x, y: snapshot.y, visited: snapshot.visited, finished: snapshot.finished, name: snapshot.name },
            demonsSlain: snapshot.stats.demonsSlain,
            gachaPulls: 0,
            orbs: 0,
            inventory: [],
            unlockedForms: unlockedFormNumbers(snapshot.visited),
            allies: [],
            relationships: {},
            notes: "Partida de Hojas en la Bruma (modo mundo abierto).",
          }),
        });
        const json = await res.json();
        if (json?.save?.id && !stateRef.current.saveId) dispatch({ type: "SET_SAVE_ID", id: json.save.id });
      } catch {
        /* el servidor puede no estar disponible; la partida sigue en local */
      }
    },
    [],
  );

  useEffect(() => {
    if (!booted || state.phase === "title" || !state.name) return;
    const id = window.setTimeout(() => void persist(state), 900);
    return () => window.clearTimeout(id);
  }, [booted, state, persist]);

  /* ------------------------- acciones reutilizables ------------------------- */
  const doPrimary = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === "dialogue") {
      if (s.dialogue?.showChoices) return;
      if (dialogueRef.current?.advance()) return;
      dispatch({ type: "DIALOGUE_ADVANCE" });
      return;
    }
    if (s.phase === "battle") {
      if (s.battle?.result) dispatch({ type: "BATTLE_CLOSE" });
      return;
    }
    if (s.phase === "world") dispatch({ type: "INTERACT" });
  }, []);

  const doSecondary = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === "battle" && !s.battle?.result) {
      dispatch({ type: "BATTLE_BREATHE" });
      return;
    }
    if (s.showMission) {
      dispatch({ type: "TOGGLE_MISSION" });
      return;
    }
    if (s.phase === "menu") {
      dispatch({ type: "CLOSE_MENU" });
      return;
    }
    if (s.phase === "world") dispatch({ type: "TOGGLE_MISSION" });
  }, []);

  /* ------------------------- teclado ------------------------- */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const dir = KEY_DIRS[e.key];
      if (dir) {
        e.preventDefault();
        if (s.phase !== "world") return;
        if (heldDir.current !== dir) {
          heldDir.current = dir;
          dispatch({ type: "MOVE", dir });
        }
        return;
      }
      if (e.key === " " || e.key === "Enter" || e.key === "z" || e.key === "Z") {
        e.preventDefault();
        doPrimary();
        return;
      }
      if (e.key === "b" || e.key === "B" || e.key === "r" || e.key === "R") {
        if (s.phase !== "battle" || s.battle?.result) return;
        dispatch({ type: e.key.toLowerCase() === "b" ? "BATTLE_BREATHE" : "BATTLE_FLEE" });
        return;
      }
      if (e.key === "m" || e.key === "M") {
        if (s.phase === "world" || s.showMission) dispatch({ type: "TOGGLE_MISSION" });
        return;
      }
      if (e.key === "Escape") {
        if (s.showMission) dispatch({ type: "TOGGLE_MISSION" });
        else if (s.phase === "menu") dispatch({ type: "CLOSE_MENU" });
        else if (s.phase === "world") dispatch({ type: "OPEN_MENU" });
        return;
      }
      const num = Number(e.key);
      if (!Number.isNaN(num) && num >= 1 && num <= 9) {
        const idx = num - 1;
        if (s.phase === "dialogue" && s.dialogue?.showChoices && idx < (s.dialogue.choices?.length ?? 0)) {
          dispatch({ type: "DIALOGUE_CHOOSE", index: idx });
        } else if (s.phase === "battle" && !s.battle?.result) {
          dispatch({ type: "BATTLE_FORM", index: idx });
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const dir = KEY_DIRS[e.key];
      if (dir && heldDir.current === dir) heldDir.current = null;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [doPrimary]);

  /* ------------------------- bucle de movimiento continuo ------------------------- */
  useEffect(() => {
    const id = window.setInterval(() => {
      const dir = heldDir.current;
      if (!dir) return;
      if (stateRef.current.phase !== "world") return;
      dispatch({ type: "MOVE", dir });
    }, 135);
    return () => window.clearInterval(id);
  }, []);

  /* ------------------------- render ------------------------- */
  if (!booted) {
    return (
      <div className="min-h-screen bg-[#05070f] flex items-center justify-center text-yellow-200 font-serif">
        La bruma se está formando…
      </div>
    );
  }

  if (!state.name) {
    return (
      <NameEntry
        onConfirm={(first, last) => {
          dispatch({ type: "SET_NAME", first, last });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#05070f] px-2 py-3 md:py-5 flex flex-col items-center">
      <header className="mb-2 text-center font-serif">
        <h1 className="text-lg md:text-2xl font-bold text-yellow-200 tracking-wide">
          Kimetsu no Yaiba: <span className="text-slate-200">Hojas en la Bruma</span>
        </h1>
        <p className="text-[11px] text-slate-500 italic">What If · mundo abierto · promesa de los cerezos</p>
      </header>

      <Hud state={state} onMission={() => dispatch({ type: "TOGGLE_MISSION" })} onMenu={() => dispatch({ type: "OPEN_MENU" })} />

      <div className="relative w-full max-w-3xl flex justify-center">
        <Viewport state={state} />
        {state.phase === "dialogue" && state.dialogue && (
          <div className="absolute inset-x-0 bottom-0">
            <DialogueBox ref={dialogueRef} dialogue={state.dialogue} onChoose={(i) => dispatch({ type: "DIALOGUE_CHOOSE", index: i })} />
          </div>
        )}
      </div>

      <TouchControls
        disabled={state.phase !== "world"}
        onPress={(dir) => {
          heldDir.current = dir;
          if (stateRef.current.phase === "world") dispatch({ type: "MOVE", dir });
        }}
        onRelease={() => {
          heldDir.current = null;
        }}
        onA={doPrimary}
        onB={doSecondary}
      />

      <div className="mt-2 hidden md:block text-[11px] text-slate-500 font-sans text-center">
        Flechas/WASD caminar · Espacio hablar · M misión · Esc menú
      </div>

      {state.toast && (
        <button
          onClick={() => dispatch({ type: "TOAST", text: null })}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md rounded-lg border border-[#d4af37]/70 bg-black/90 px-4 py-2 text-xs text-yellow-200 font-sans cursor-pointer"
        >
          {state.toast}
        </button>
      )}

      {state.showMission && <MissionPanel state={state} onClose={() => dispatch({ type: "TOGGLE_MISSION" })} />}

      {state.phase === "menu" && (
        <MenuOverlay
          state={state}
          onClose={() => dispatch({ type: "CLOSE_MENU" })}
          onSave={() => {
            void persist(stateRef.current);
            dispatch({ type: "TOAST", text: "💾 Partida guardada." });
          }}
          onReset={() => {
            try {
              window.localStorage.removeItem(LOCAL_KEY);
            } catch {
              /* sin almacenamiento */
            }
            dispatch({ type: "RESET" });
            setVictoryDismissed(false);
          }}
        />
      )}

      {state.phase === "battle" && state.battle && (
        <BattleScreen
          state={state}
          onForm={(i) => dispatch({ type: "BATTLE_FORM", index: i })}
          onBreathe={() => dispatch({ type: "BATTLE_BREATHE" })}
          onFlee={() => dispatch({ type: "BATTLE_FLEE" })}
          onClose={() => dispatch({ type: "BATTLE_CLOSE" })}
        />
      )}

      {state.finished && !victoryDismissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 font-sans">
          <div className="max-w-lg rounded-xl border-2 border-[#d4af37] bg-gradient-to-b from-amber-950/60 to-[#101426] p-6 text-center shadow-2xl">
            <div className="text-4xl mb-2">🌸</div>
            <h2 className="text-2xl font-bold text-yellow-200 mb-2">El sol tras la bruma</h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Muzan ha caído y Nezuko vuelve a ser humana. Los Pilares viven. En esta línea temporal, la boda bajo los
              cerezos sí ocurrió.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <Stat label="Nivel" value={state.stats.level} />
              <Stat label="Demonios" value={state.stats.demonsSlain} />
              <Stat label="Capítulos" value={`${chaptersCompleted(state.visited)}/9`} />
            </div>
            <button
              onClick={() => setVictoryDismissed(true)}
              className="mt-5 px-5 py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold cursor-pointer"
            >
              Seguir explorando el mundo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-700 bg-slate-950/60 px-2 py-1.5">
      <div className="text-[10px] text-slate-400">{label}</div>
      <div className="text-base font-bold text-yellow-200">{value}</div>
    </div>
  );
}
