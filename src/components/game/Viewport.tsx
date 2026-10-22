"use client";

import { useEffect, useMemo, useState } from "react";
import { MAPS } from "@/game/maps";
import { TILES, tileAt } from "@/game/tiles";
import type { GameState } from "@/game/engine";

const VIEW_W = 15;
const VIEW_H = 11;

function useTileSize() {
  const [size, setSize] = useState(34);
  useEffect(() => {
    const compute = () => {
      const avail = Math.min(window.innerWidth - 24, 760);
      const byWidth = Math.floor(avail / VIEW_W);
      const byHeight = Math.floor((window.innerHeight - 250) / VIEW_H);
      setSize(Math.max(18, Math.min(40, Math.min(byWidth, byHeight))));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return size;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function Viewport({ state }: { state: GameState }) {
  const T = useTileSize();
  const map = MAPS[state.mapId] ?? MAPS.kumotori;
  const W = map.rows[0]?.length ?? 1;
  const H = map.rows.length;

  const camX = clamp(state.x - Math.floor(VIEW_W / 2), 0, Math.max(0, W - VIEW_W));
  const camY = clamp(state.y - Math.floor(VIEW_H / 2), 0, Math.max(0, H - VIEW_H));

  const tiles = useMemo(() => {
    const out: React.ReactNode[] = [];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const ch = map.rows[y][x];
        const def = TILES[ch] ?? TILES["#"];
        out.push(
          <div
            key={`${x}-${y}`}
            className="absolute flex items-center justify-center select-none"
            style={{
              left: x * T,
              top: y * T,
              width: T,
              height: T,
              backgroundColor: def.bg,
              fontSize: Math.floor(T * 0.72),
              lineHeight: 1,
            }}
          >
            {def.emoji ? <span style={{ opacity: 0.95 }}>{def.emoji}</span> : null}
          </div>,
        );
      }
    }
    return out;
  }, [map, H, W, T]);

  const facingNpc = useMemo(() => {
    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[state.facing];
    const tx = state.x + d[0];
    const ty = state.y + d[1];
    return map.npcs.find((n) => n.x === tx && n.y === ty);
  }, [map, state.x, state.y, state.facing]);

  const pendingTriggers = map.triggers.filter((t) => !(t.once && state.visited.includes(t.nodeId)));
  const pendingNpcs = map.npcs.filter((n) => n.nodeId && !state.visited.includes(n.nodeId));

  return (
    <div
      className="relative mx-auto overflow-hidden rounded-xl border-4 border-[#d4af37]/70 shadow-[0_0_0_2px_#101426,0_10px_40px_rgba(0,0,0,0.7)]"
      style={{ width: VIEW_W * T, height: VIEW_H * T, background: "#05070f" }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: W * T,
          height: H * T,
          transform: `translate(${-camX * T}px, ${-camY * T}px)`,
          transition: "transform 120ms linear",
        }}
      >
        {tiles}

        {/* Marcadores de objetivos pendientes */}
        {pendingTriggers.map((t) => (
          <div
            key={`tr-${t.x}-${t.y}`}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ left: t.x * T, top: t.y * T, width: T, height: T }}
          >
            <span className="animate-pulse text-yellow-200" style={{ fontSize: Math.floor(T * 0.5), textShadow: "0 0 8px #ffd700" }}>
              ◈
            </span>
          </div>
        ))}

        {/* PNJs */}
        {map.npcs.map((n) => {
          const isTarget = facingNpc?.id === n.id;
          const hasStory = n.nodeId && !state.visited.includes(n.nodeId);
          return (
            <div
              key={n.id}
              className="absolute flex flex-col items-center justify-end pointer-events-none"
              style={{ left: n.x * T, top: n.y * T, width: T, height: T }}
            >
              {hasStory && (
                <span className="absolute -top-1 text-red-400 font-bold animate-bounce" style={{ fontSize: Math.floor(T * 0.42) }}>
                  ❗
                </span>
              )}
              <span style={{ fontSize: Math.floor(T * 0.78), filter: isTarget ? "drop-shadow(0 0 6px #ffd700)" : "none" }}>
                {n.emoji}
              </span>
            </div>
          );
        })}

        {/* Jugador */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: state.x * T,
            top: state.y * T,
            width: T,
            height: T,
            transform: `scaleX(${state.facing === "left" ? -1 : 1})`,
            transition: "left 120ms linear, top 120ms linear",
            zIndex: 5,
          }}
        >
          <span style={{ fontSize: Math.floor(T * 0.82), filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.6))" }}>🥷</span>
        </div>
      </div>

      {/* Tinte ambiental y viñeta */}
      {map.tint && <div className="absolute inset-0 pointer-events-none" style={{ background: map.tint }} />}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.65)" }}
      />

      {/* Etiqueta de interacción */}
      {(facingNpc || pendingTriggers.some((t) => t.x === state.x && t.y === state.y)) && state.phase === "world" && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 border border-[#d4af37]/60 rounded px-2 py-1 text-[11px] text-yellow-200 font-sans whitespace-nowrap">
          [Espacio] {facingNpc ? `Hablar con ${facingNpc.name}` : "Examinar"}
        </div>
      )}

      {/* Aviso de PNJs con historia pendiente fuera de pantalla */}
      {pendingNpcs.length > 0 && (
        <div className="absolute top-2 right-2 bg-black/70 border border-red-500/50 rounded px-2 py-1 text-[10px] text-red-200 font-sans">
          ❗ {pendingNpcs.length} en espera
        </div>
      )}
    </div>
  );
}

export { VIEW_W, VIEW_H, tileAt };
