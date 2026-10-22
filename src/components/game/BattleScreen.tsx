"use client";

import type { GameState } from "@/game/engine";
import { availableForms } from "@/game/engine";

type Props = {
  state: GameState;
  onForm: (index: number) => void;
  onBreathe: () => void;
  onFlee: () => void;
  onClose: () => void;
};

export default function BattleScreen({ state, onForm, onBreathe, onFlee, onClose }: Props) {
  const b = state.battle;
  if (!b) return null;
  const forms = availableForms(state.visited);
  const over = b.result !== null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 p-3 font-sans">
      <div className="w-full max-w-3xl rounded-xl border-2 border-[#d4af37]/80 bg-gradient-to-b from-[#1c2440] to-[#101426] p-4 shadow-2xl">
        {/* Escenario */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-cyan-300 font-bold text-lg drop-shadow-[0_2px_0_#000]">{state.name?.first ?? "Cazador"}</div>
            <div className="text-[11px] text-slate-400 mb-2">Respiración de la Bruma Plateada · Nv. {state.stats.level}</div>
            <Bar label="PV" value={state.stats.hp} max={state.stats.maxHp} from="#8a1a16" to="#dc2d2d" />
            <Bar label="O₂" value={b.focus} max={state.stats.maxFocus} from="#1e3a8a" to="#2896e6" />
            <div className="mt-3 flex justify-center text-5xl">🥷</div>
          </div>
          <div className="text-right">
            <div className="text-[#ffd700] font-bold text-lg drop-shadow-[0_2px_0_#000]">
              {b.demon.name} {b.demon.isBoss && <span className="text-red-400 text-xs">★ JEFE</span>}
            </div>
            <div className="text-[11px] text-slate-400 italic mb-2">{b.demon.title}</div>
            <Bar label="PV" value={b.demon.hp} max={b.demon.maxHp} from="#4c0a08" to="#c81e1e" />
            {b.demon.bloodArt && <div className="text-[10px] text-red-300 mt-1">Arte de sangre: {b.demon.bloodArt}</div>}
            <div className="mt-3 flex justify-center text-5xl animate-pulse">
              {b.demon.tier === "muzan" ? "🩸" : b.demon.isBoss ? "👹" : "👺"}
            </div>
          </div>
        </div>

        {/* Registro */}
        <div className="mt-3 h-24 overflow-y-auto rounded-lg border border-slate-700 bg-black/50 p-2 text-xs space-y-0.5">
          {b.log.map((l, i) => (
            <div key={i} className={i === b.log.length - 1 ? "text-white" : "text-slate-400"}>
              <span className="text-[#ffd700] mr-1">»</span>
              {l}
            </div>
          ))}
        </div>

        {/* Comandos */}
        {over ? (
          <div className="mt-3 text-center">
            <div className={`title-font text-3xl mb-2 ${b.result === "win" ? "text-[#ffd700]" : b.result === "flee" ? "text-slate-300" : "text-red-500"}`}>
              {b.result === "win" ? "¡VICTORIA!" : b.result === "flee" ? "HUÍDA" : "DERROTA"}
            </div>
            {b.result === "win" && <div className="text-xs text-slate-300 mb-3">+{b.xpGained} XP · {state.stats.level} nivel</div>}
            <button onClick={onClose} className="px-6 py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold cursor-pointer">
              Continuar
            </button>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
            {forms.map((f, i) => (
              <button
                key={f.id}
                disabled={b.focus < f.cost}
                onClick={() => onForm(i)}
                className="text-left px-2.5 py-2 rounded-lg border border-[#d4af37]/60 bg-[#24345a] hover:bg-[#3a548c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-yellow-200 leading-tight">
                  <span className="text-yellow-500 mr-1">{i + 1}.</span>
                  {f.name}
                </div>
                <div className="text-[10px] text-slate-300">O₂ {f.cost} · ×{f.multiplier.toFixed(1)}</div>
              </button>
            ))}
            <button
              onClick={onBreathe}
              className="px-2.5 py-2 rounded-lg border border-cyan-500/60 bg-[#123a52] hover:bg-[#1b5470] text-cyan-100 text-[11px] font-bold transition-colors cursor-pointer"
            >
              💨 Respiración profunda
              <div className="text-[10px] font-normal text-cyan-200/70">+40 O₂ (recibes golpe)</div>
            </button>
            <button
              onClick={onFlee}
              className="px-2.5 py-2 rounded-lg border border-red-700/60 bg-[#3a1414] hover:bg-[#5a1e1e] text-red-100 text-[11px] font-bold transition-colors cursor-pointer"
            >
              🌀 Huir
              <div className="text-[10px] font-normal text-red-200/70">No funciona contra jefes</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Bar({ label, value, max, from, to }: { label: string; value: number; max: number; from: string; to: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className="mb-1.5">
      <div className="flex justify-between text-[10px] font-bold text-slate-200">
        <span>{label}</span>
        <span>{Math.max(0, Math.floor(value))}/{max}</span>
      </div>
      <div className="h-3 rounded-sm border border-[#d4af37]/70 bg-black/70 overflow-hidden">
        <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${from}, ${to})` }} />
      </div>
    </div>
  );
}
