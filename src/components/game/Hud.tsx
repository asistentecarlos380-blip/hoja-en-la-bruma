"use client";

import Link from "next/link";
import type { GameState } from "@/game/engine";
import { fillName, mapOf } from "@/game/engine";
import { WHAT_IF_STORY } from "@/lib/storyData";
import { activeChapter, chaptersCompleted, isChapterComplete, isObjectiveDone, playerRank } from "@/lib/progress";

export function Hud({
  state,
  onMission,
  onMenu,
}: {
  state: GameState;
  onMission: () => void;
  onMenu: () => void;
}) {
  const map = mapOf(state);
  const chapter = activeChapter(state.visited);
  const done = chapter.mission.objectives.filter((o) => isObjectiveDone(o, state.visited)).length;
  const total = chapter.mission.objectives.length;
  const s = state.stats;

  return (
    <div className="mx-auto mb-2 w-full max-w-3xl rounded-xl border-2 border-[#d4af37]/60 bg-[#101426]/90 px-3 py-2 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-bold text-yellow-200 truncate">📍 {fillName(map.name, state.name)}</div>
          <div className="text-[11px] text-slate-400 truncate">{fillName(map.subtitle, state.name)}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-slate-300">
            {state.name?.first} {state.name?.last} · Nv. {s.level} · <span className="text-yellow-300">{playerRank(state.visited, s.demonsSlain)}</span>
          </div>
          <div className="text-[10px] text-slate-500">Demonios: {s.demonsSlain} · Capítulos: {chaptersCompleted(state.visited)}/{WHAT_IF_STORY.length}</div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <MiniBar label="PV" value={s.hp} max={s.maxHp} from="#8a1a16" to="#dc2d2d" />
        <MiniBar label="O₂" value={s.focus} max={s.maxFocus} from="#1e3a8a" to="#2896e6" />
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span className="truncate">{chapter.mission.title}</span>
            <span className="text-yellow-300">{done}/{total}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-700 to-yellow-300 transition-all duration-500"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </div>
        </div>
        <button onClick={onMission} className="px-2.5 py-1 rounded border border-[#d4af37]/60 bg-[#24345a] text-[11px] text-yellow-200 hover:bg-[#3a548c] cursor-pointer">
          📜 Misión
        </button>
        <button onClick={onMenu} className="px-2.5 py-1 rounded border border-slate-600 bg-[#1c2440] text-[11px] text-slate-200 hover:bg-[#2d416e] cursor-pointer">
          ☰ Menú
        </button>
      </div>
    </div>
  );
}

function MiniBar({ label, value, max, from, to }: { label: string; value: number; max: number; from: string; to: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div>
      <div className="flex justify-between text-[10px] font-bold text-slate-300">
        <span>{label}</span>
        <span>{Math.max(0, Math.floor(value))}/{max}</span>
      </div>
      <div className="h-2.5 rounded-sm border border-[#d4af37]/50 bg-black/60 overflow-hidden">
        <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${from},${to})` }} />
      </div>
    </div>
  );
}

export function MissionPanel({ state, onClose }: { state: GameState; onClose: () => void }) {
  const chapter = activeChapter(state.visited);
  const nextObjective = chapter.mission.objectives.find((o) => !isObjectiveDone(o, state.visited));

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-3 font-sans" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border-2 border-[#d4af37]/80 bg-[#101426] p-4 shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-yellow-500 font-bold">Cuervo Kasugai · {chapter.title}</div>
            <h2 className="text-lg font-bold text-yellow-100">{chapter.mission.title}</h2>
          </div>
          <button onClick={onClose} className="px-2 py-1 rounded border border-slate-600 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer">
            ✕
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400 italic">{chapter.mission.briefing}</p>

        <ol className="mt-3 space-y-2">
          {chapter.mission.objectives.map((o, i) => {
            const complete = isObjectiveDone(o, state.visited);
            return (
              <li key={o.id} className="flex items-start gap-2 text-xs">
                <span
                  className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-[10px] ${
                    complete ? "bg-emerald-900/60 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-700 text-slate-500"
                  }`}
                >
                  {complete ? "✓" : i + 1}
                </span>
                <span className={complete ? "text-emerald-200/70 line-through" : "text-slate-200"}>{o.label}</span>
              </li>
            );
          })}
        </ol>

        {nextObjective && (
          <div className="mt-3 rounded-lg border border-yellow-700/40 bg-yellow-950/20 p-2.5 text-xs text-yellow-100">
            <span className="font-bold text-yellow-400">Objetivo actual: </span>
            {nextObjective.label}. Busca el marcador ◈ o un PNJ con ❗ en el mapa.
          </div>
        )}

        <div className="mt-4 border-t border-slate-800 pt-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Capítulos</div>
          <div className="grid grid-cols-1 gap-1">
            {WHAT_IF_STORY.map((c) => {
              const complete = isChapterComplete(c, state.visited);
              const current = c.id === chapter.id;
              return (
                <div
                  key={c.id}
                  className={`text-[11px] px-2 py-1 rounded border ${
                    current ? "border-yellow-600 bg-yellow-950/30 text-yellow-200" : complete ? "border-emerald-900 bg-emerald-950/20 text-emerald-300/80" : "border-slate-800 bg-slate-950/50 text-slate-500"
                  }`}
                >
                  {complete ? "✓ " : current ? "▶ " : "🔒 "}
                  {c.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MenuOverlay({
  state,
  onClose,
  onSave,
  onReset,
}: {
  state: GameState;
  onClose: () => void;
  onSave: () => void;
  onReset: () => void;
}) {
  const s = state.stats;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 p-3 font-sans" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border-2 border-[#d4af37]/80 bg-[#101426] p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-yellow-100 mb-1">Diario del cazador</h2>
        <p className="text-xs text-slate-400 mb-3">
          {state.name?.first} {state.name?.last} · {playerRank(state.visited, s.demonsSlain)}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Row label="Nivel" value={s.level} />
          <Row label="Experiencia" value={s.xp} />
          <Row label="PV" value={`${s.hp}/${s.maxHp}`} />
          <Row label="Oxígeno" value={`${s.focus}/${s.maxFocus}`} />
          <Row label="Ataque" value={s.attack} />
          <Row label="Defensa" value={s.defense} />
          <Row label="Velocidad" value={s.speed} />
          <Row label="Demonios" value={s.demonsSlain} />
        </div>

        <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950/60 p-2.5 text-[11px] text-slate-300 leading-relaxed">
          <div className="text-yellow-400 font-bold mb-1">Controles</div>
          Flechas / WASD: caminar · Espacio o Enter: hablar y avanzar · 1-9: elegir opción o forma ·
          B: respirar en combate · R: huir · M: misión · Esc: menú
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={onSave} className="px-3 py-2 rounded-lg border border-[#d4af37]/60 bg-[#24345a] text-xs text-yellow-200 hover:bg-[#3a548c] cursor-pointer">
            💾 Guardar
          </button>
          <Link href="/historia" className="px-3 py-2 rounded-lg border border-slate-600 bg-[#1c2440] text-xs text-slate-200 hover:bg-[#2d416e]">
            📖 Modo lectura
          </Link>
          <button onClick={onReset} className="px-3 py-2 rounded-lg border border-red-800 bg-[#3a1414] text-xs text-red-200 hover:bg-[#5a1e1e] cursor-pointer">
            ↺ Reiniciar
          </button>
          <button onClick={onClose} className="ml-auto px-3 py-2 rounded-lg border border-slate-600 bg-[#1c2440] text-xs text-slate-200 hover:bg-[#2d416e] cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between rounded border border-slate-800 bg-slate-950/50 px-2 py-1">
      <span className="text-slate-400">{label}</span>
      <span className="text-yellow-200 font-bold">{value}</span>
    </div>
  );
}
