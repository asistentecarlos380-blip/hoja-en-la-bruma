"use client";

import { useGame } from "@/lib/game/context";
import { useState } from "react";

export default function ShrineScreen() {
  const { state, dispatch } = useGame();
  const g = state.game;
  const lastPulls = state.lastGacha ?? [];
  const [pulling, setPulling] = useState(false);

  const doPull = (times: 1 | 10) => {
    if (g.orbs < times) return;
    setPulling(true);
    setTimeout(() => {
      dispatch({ type: "GA_CHA", times });
      setPulling(false);
    }, 900);
  };

  return (
    <div className="space-y-3">
      <div className="ebf-frame relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950" />
        <div className="mist-overlay" />
        <div className="relative z-10 py-4 text-center">
          <h2 className="title-font text-3xl text-[#ffd700] drop-shadow-[0_2px_0_#000]">
            SANTUARIO DE LA BRUMA · PACTO ANCESTRAL
          </h2>
          <p className="text-slate-300 italic mt-1 max-w-2xl mx-auto">
            Ofrece tus orobras de jade para invocar el espíritu de los cazadores legendarios.
            Las alianzas que forjes aquí te acompañarán hasta el Castillo Infinito.
          </p>
        </div>
      </div>

      {pulling && (
        <div className="ebf-frame text-center py-10 text-[#ffd700] title-font text-xl animate-pulse">
          ✦ La bruma se arremolina... canalizando el eco de los antepasados ✦
        </div>
      )}

      {!pulling && lastPulls.length > 0 && (
        <div className="ebf-frame">
          <h3 className="title-font text-lg text-[#ffd700] mb-3">
            Resultado de la invocación ({lastPulls.length} tirada{lastPulls.length > 1 ? "s" : ""})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {lastPulls.map((p, i) => (
              <div
                key={i}
                className="ebf-frame text-center !p-3 animate-fade-in-up"
                style={{ borderColor: p.color, boxShadow: `0 0 12px ${p.color}55` }}
              >
                <div className="title-font text-lg" style={{ color: p.color }}>
                  {p.tier}
                </div>
                <div className="font-bold text-sm text-white mt-1">{p.ally?.name ?? "Reliquia"}</div>
                {p.ally && <div className="text-[10px] text-slate-400 italic">{p.ally.title}</div>}
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-300 italic">
            «{lastPulls[lastPulls.length - 1].quote}»
          </div>
        </div>
      )}

      <div className="ebf-frame">
        <h3 className="title-font text-lg text-[#ffd700] mb-2">Orobras disponibles</h3>
        <div className="text-3xl title-font text-cyan-200 mb-3">◈ {g.orbs}</div>

        <div className="flex flex-wrap gap-2">
          <button className="ebf-btn" disabled={g.orbs < 1 || pulling} onClick={() => doPull(1)}>
            Invocar x1 (1 orobra)
          </button>
          <button className="ebf-btn glow-pulse" disabled={g.orbs < 10 || pulling} onClick={() => doPull(10)}>
            Invocar x10 (10 orobras)
          </button>
          <button className="ebf-btn ebf-btn-danger ml-auto" onClick={() => dispatch({ type: "SET_PHASE", phase: state.previousPhase === "shrine" ? "location" : state.previousPhase })}>
            Volver
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          Tasas: 3★ 72% · 4★ 23% · 5★ 5% · Aliados duplicados: +2 ATQ, +10 HP máx.
        </div>
      </div>

      {g.allies.length > 0 && (
        <div className="ebf-frame">
          <h3 className="title-font text-lg text-[#ffd700] mb-2">Aliados invocados ({g.allies.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {g.allies.map((a) => (
              <div key={a.id} className="ebf-frame !p-3" style={{ borderColor: a.rarity === "5★" ? "#fbbf24" : a.rarity === "4★" ? "#d8b4fe" : "#67e8f9" }}>
                <div className={`font-bold title-font ${a.color}`}>
                  [{a.rarity}] {a.name}
                </div>
                <div className="text-xs text-slate-300 italic">{a.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">Pasiva: {a.passive}</div>
                <div className="text-[11px] text-slate-400 mt-1">{a.quote}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
