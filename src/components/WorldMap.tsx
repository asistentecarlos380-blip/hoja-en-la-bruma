"use client";

import { useGame } from "@/lib/game/context";
import { LOCATIONS } from "@/lib/game/data";
import { useMemo } from "react";

// Positions roughly placed on a stylized map of Japan
const POSITIONS: Record<string, { x: number; y: number; col: string }> = {
  monte_sagiri: { x: 18, y: 72, col: "bg-emerald-600" },
  aldea_de_la_wisteria: { x: 30, y: 55, col: "bg-purple-500" },
  asakusa: { x: 72, y: 52, col: "bg-amber-600" },
  monte_natagumo: { x: 38, y: 78, col: "bg-slate-500" },
  tren_mugen: { x: 82, y: 45, col: "bg-rose-700" },
  distrito_entretenimiento: { x: 55, y: 82, col: "bg-fuchsia-600" },
  aldea_herradores: { x: 46, y: 40, col: "bg-orange-500" },
  sede_cazadores: { x: 25, y: 35, col: "bg-indigo-500" },
  castillo_infinito: { x: 60, y: 20, col: "bg-red-900" },
};

export default function WorldMap() {
  const { state, dispatch } = useGame();
  const g = state.game;
  const current = LOCATIONS[g.currentLocation];

  const availableConnections = useMemo(() => {
    return current.connections.filter((c) => LOCATIONS[c].chapterRequired <= g.storyChapter + 1);
  }, [current, g.storyChapter]);

  return (
    <div className="ebf-frame relative overflow-hidden" style={{ minHeight: "calc(100vh - 120px)" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="title-font text-2xl text-[#ffd700]">MAPA DE JAPÓN · Era Taisho</h2>
        <div className="text-sm text-slate-300">
          Capítulo actual: <span className="text-[#ffd700] font-bold">{g.storyChapter}</span>
        </div>
      </div>

      {/* Map background */}
      <div className="relative w-full h-[560px] rounded-lg overflow-hidden border-2 border-[#2d416e]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #1a2340, #0a0c18), radial-gradient(circle at 70% 80%, #231a3c, #0a0c18)",
        }}
      >
        {/* Stylized Japan shape silhouette */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-30">
          <path
            d="M20,85 Q30,78 38,72 Q44,64 38,55 Q35,48 45,38 Q50,28 58,22 Q66,16 74,14 Q82,14 88,20 Q92,30 88,42 Q86,54 80,62 Q72,72 62,82 Q50,90 38,88 Q28,88 20,85 Z"
            fill="#1e3a2b"
            stroke="#2d4a38"
            strokeWidth="0.4"
          />
          {/* Mountain lines */}
          <path d="M40,60 L44,52 L48,60 Z" fill="#556" opacity="0.6" />
          <path d="M55,40 L59,32 L63,40 Z" fill="#556" opacity="0.6" />
          <path d="M30,50 L34,42 L38,50 Z" fill="#556" opacity="0.6" />
        </svg>

        <div className="mist-overlay" />

        {/* Location nodes */}
        {Object.values(LOCATIONS).map((loc) => {
          const pos = POSITIONS[loc.id];
          if (!pos) return null;
          const isCurrent = loc.id === g.currentLocation;
          const isConnection = current.connections.includes(loc.id);
          const isLocked = loc.chapterRequired > g.storyChapter + 1;
          return (
            <button
              key={loc.id}
              disabled={!isCurrent && !isConnection}
              onClick={() => {
                if (isCurrent) {
                  dispatch({ type: "SET_PHASE", phase: "location" });
                } else if (isConnection) {
                  dispatch({ type: "TRAVEL", locationId: loc.id });
                }
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 ${isLocked ? "border-slate-600 bg-slate-800" : pos.col} ${
                  isCurrent ? "ring-4 ring-yellow-300/60 animate-pulse scale-125" : ""
                } ${isConnection ? "ring-2 ring-cyan-300/50 group-hover:ring-yellow-300 group-hover:scale-110 transition" : ""} shadow-lg`}
              />
              <div
                className={`mt-1 text-[10px] md:text-xs font-bold whitespace-nowrap px-1 py-0.5 rounded ${
                  isCurrent ? "bg-yellow-600/80 text-black" : isLocked ? "bg-slate-800/80 text-slate-500" : "bg-black/70 text-slate-200"
                }`}
              >
                {loc.name}
                {isLocked && " 🔒"}
              </div>
            </button>
          );
        })}

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {current.connections.map((c) => {
            const a = POSITIONS[g.currentLocation];
            const b = POSITIONS[c];
            if (!a || !b) return null;
            const locked = LOCATIONS[c].chapterRequired > g.storyChapter + 1;
            return (
              <line
                key={c}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={locked ? "#444" : "#67e8f9"}
                strokeWidth="0.3"
                strokeDasharray="1 1"
                opacity={locked ? 0.3 : 0.7}
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-4 ebf-frame p-3">
        <div className="text-xs text-slate-400 mb-1">Ubicación actual</div>
        <div className="title-font text-xl text-[#ffd700]">{current.name}</div>
        <div className="text-sm text-slate-300 mt-1">{current.ambiance}</div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button className="ebf-btn" onClick={() => dispatch({ type: "SET_PHASE", phase: "location" })}>
            Entrar en {current.name}
          </button>
        </div>
      </div>

      {state.notification && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/90 border border-[#d4af37] px-4 py-2 rounded text-[#ffd700] text-sm z-50">
          {state.notification}
        </div>
      )}
    </div>
  );
}
