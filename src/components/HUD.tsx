"use client";

import { useGame } from "@/lib/game/context";

export default function HUD() {
  const { state, dispatch, saveGame } = useGame();
  const g = state.game;
  const xpNeed = 80 + g.level * 60;

  return (
    <div className="ebf-frame mb-3 flex flex-wrap items-center justify-between gap-3 px-4 py-2">
      <div className="flex items-center gap-4">
        <div>
          <div className="title-font text-xl text-[#ffd700]">{g.playerName}</div>
          <div className="text-xs text-slate-300">
            Rango: <span className="text-[#ffd700]">{g.rank}</span> · Nv. {g.level} · {g.breathingStyle}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 min-w-[260px]">
        <div className="flex items-center gap-2">
          <span className="w-10 text-xs font-bold text-red-300">HP</span>
          <div className="stat-bar flex-1">
            <div className="stat-bar-fill" style={{ width: `${(g.hp / g.maxHp) * 100}%`, background: "linear-gradient(90deg, #8a1a16, #dc2d2d)" }} />
          </div>
          <span className="text-xs w-16 text-right">{g.hp}/{g.maxHp}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-10 text-xs font-bold text-cyan-300">XP</span>
          <div className="stat-bar flex-1">
            <div className="stat-bar-fill" style={{ width: `${(g.xp / xpNeed) * 100}%`, background: "linear-gradient(90deg, #d4af37, #ffef8c)" }} />
          </div>
          <span className="text-xs w-16 text-right">{g.xp}/{xpNeed}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <div className="px-3 py-1 rounded-md border border-[#d4af37] bg-[#101426]">
          <span className="text-[#ffd700]">◈</span> {g.orbs} <span className="text-xs text-slate-400">orobras</span>
        </div>
        <div className="px-3 py-1 rounded-md border border-slate-600 bg-[#101426]">
          <span className="text-red-400">⚔</span> {g.demonsSlain} <span className="text-xs text-slate-400">demonios</span>
        </div>
        <button
          onClick={() => dispatch({ type: "SET_PHASE", phase: "character" })}
          className="ebf-btn !py-1 !px-3 !text-xs !min-w-0"
        >
          ⚙ Personaje
        </button>
        <button onClick={() => saveGame()} className="ebf-btn !py-1 !px-3 !text-xs !min-w-0">
          💾 Guardar
        </button>
      </div>
    </div>
  );
}
