"use client";

import { useGame } from "@/lib/game/context";
import { getAvailableForms } from "@/lib/game/engine";
import { useEffect, useRef } from "react";

export default function CombatScreen() {
  const { state, dispatch } = useGame();
  const g = state.game;
  const c = state.combat;
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [c?.log]);

  if (!c) {
    return (
      <div className="ebf-frame">
        <p>No hay combate activo.</p>
        <button className="ebf-btn mt-3" onClick={() => dispatch({ type: "SET_PHASE", phase: "worldmap" })}>
          Volver
        </button>
      </div>
    );
  }

  const forms = getAvailableForms(g);
  const battleOver = c.demon.hp <= 0 || g.hp <= 0;

  return (
    <div className="space-y-3">
      {/* Arena */}
      <div className="ebf-frame relative overflow-hidden" style={{ minHeight: 320 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-red-950/30 to-slate-950" />
        <div className="mist-overlay" />

        <div className="relative z-10 grid grid-cols-2 gap-6 p-4">
          {/* Player */}
          <div>
            <div className="title-font text-2xl text-cyan-300 drop-shadow-[0_2px_0_#000]">{g.playerName}</div>
            <div className="text-xs text-slate-300 mb-2">{g.breathingStyle} · Rango {g.rank}</div>
            <div className="space-y-2 max-w-xs">
              <StatBar label="HP" current={g.hp} max={g.maxHp} from="#8a1a16" to="#dc2d2d" />
              <StatBar label="O2" current={c.focus} max={g.maxFocus} from="#1e3a8a" to="#2896e6" />
            </div>
            {/* Stylized silhouette */}
            <div className="mt-6 flex justify-center">
              <div className="w-20 h-36 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-24 bg-slate-800 rounded-t-full border-2 border-cyan-400/40" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-300 rounded-full border-2 border-cyan-400/40" />
                <div className="absolute top-6 -right-4 w-24 h-1 bg-gradient-to-r from-cyan-200 to-transparent rotate-[20deg] origin-left" />
              </div>
            </div>
          </div>

          {/* Enemy */}
          <div className="text-right">
            <div className="title-font text-2xl text-[#ffd700] drop-shadow-[0_2px_0_#000]">
              {c.demon.name}
              {c.isBoss && <span className="text-red-400 ml-2 text-sm">★ JEFE</span>}
            </div>
            <div className="text-xs text-slate-300 mb-2 italic">{c.demon.title}</div>
            <div className="space-y-2 max-w-xs ml-auto">
              <StatBar label="HP" current={c.demon.hp} max={c.demon.maxHp} from="#4c0a08" to="#c81e1e" />
            </div>
            <div className="mt-6 flex justify-center">
              <div className="w-24 h-40 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-28 bg-red-950 rounded-t-lg border-2 border-red-500/60 shadow-[0_0_20px_rgba(220,45,45,0.4)]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-200/70 rounded-full border-2 border-red-500/80" />
                <div className="absolute top-4 left-6 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                <div className="absolute top-4 right-6 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                {c.demon.bloodArt && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-red-300 whitespace-nowrap">
                    {c.demon.bloodArt}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="ebf-frame" ref={logRef} style={{ maxHeight: 140, overflowY: "auto" }}>
        {c.log.map((line, i) => (
          <div key={i} className={`text-sm ${i === c.log.length - 1 ? "text-white" : "text-slate-400"}`}>
            <span className="text-[#ffd700] mr-1">»</span>
            {line}
          </div>
        ))}
      </div>

      {/* Commands */}
      <div className="ebf-frame">
        {battleOver ? (
          <div className="text-center py-4">
            <div className="title-font text-3xl text-[#ffd700] mb-3">
              {c.demon.hp <= 0 ? "¡VICTORIA!" : "HAS CAÍDO..."}
            </div>
            {c.demon.hp <= 0 && (
              <div className="text-sm text-slate-300 mb-3">
                +{c.reward?.xp} XP · +{c.reward?.orbs} orobras
              </div>
            )}
            <button className="ebf-btn" onClick={() => dispatch({ type: "COMBAT_END" })}>
              Continuar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {forms.map((f, i) => (
              <button
                key={f.id}
                className="ebf-btn !min-w-0 !text-left flex flex-col items-start"
                disabled={c.focus < f.cost}
                onClick={() => dispatch({ type: "COMBAT_ATTACK", formIndex: i })}
              >
                <span className="text-[#ffd700] text-xs">{f.name}</span>
                <span className="text-[10px] text-slate-300">
                  Coste O2: {f.cost} · x{f.multiplier.toFixed(1)} daño
                </span>
              </button>
            ))}
            <button
              className="ebf-btn !min-w-0"
              onClick={() => dispatch({ type: "COMBAT_BREATHE" })}
            >
              💨 Respiración profunda
              <div className="text-[10px] text-slate-300">+40 O2 (el demonio te ataca)</div>
            </button>
            <button
              className="ebf-btn ebf-btn-danger !min-w-0"
              onClick={() => dispatch({ type: "COMBAT_FLEE" })}
            >
              🌀 Huir
              <div className="text-[10px] text-slate-300">Solo si no es un jefe</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBar({ label, current, max, from, to }: { label: string; current: number; max: number; from: string; to: string }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-0.5">
        <span className="text-white">{label}</span>
        <span className="text-slate-200">{Math.floor(current)}/{max}</span>
      </div>
      <div className="h-5 bg-black/70 border border-[#d4af37] rounded-sm overflow-hidden relative">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${from}, ${to})` }}
        />
      </div>
    </div>
  );
}
