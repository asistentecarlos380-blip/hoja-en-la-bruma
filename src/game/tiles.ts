import type { TileDef } from "./types";

export const TILES: Record<string, TileDef> = {
  " ": { name: "Vacío", bg: "#05070f", solid: true },
  ".": { name: "Pradera", bg: "#3f7a45", solid: false },
  ",": { name: "Hierba alta", bg: "#2f6b3a", solid: false, grass: true, emoji: "🌿" },
  "_": { name: "Sendero", bg: "#8a6b45", solid: false },
  C: { name: "Empedrado", bg: "#6b6f7a", solid: false },
  G: { name: "Grava blanca", bg: "#dcdcd2", solid: false },
  A: { name: "Acera", bg: "#5c5a55", solid: false },
  S: { name: "Nieve", bg: "#dfe9f5", solid: false },
  s: { name: "Ventisquero", bg: "#c3d4e8", solid: true, emoji: "❄️" },
  P: { name: "Pino nevado", bg: "#1d3b2a", solid: true, emoji: "🌲" },
  T: { name: "Árbol", bg: "#1f4a2a", solid: true, emoji: "🌳" },
  w: { name: "Glicinia", bg: "#4c3a72", solid: true, emoji: "🌸" },
  z: { name: "Bambú", bg: "#2c5a34", solid: true, emoji: "🎋" },
  "#": { name: "Roca", bg: "#4a4f5c", solid: true, emoji: "🪨" },
  "~": { name: "Agua", bg: "#2a5f8f", solid: true, emoji: "🌊" },
  B: { name: "Puente", bg: "#7a5a34", solid: false },
  n: { name: "Telaraña", bg: "#5c5f6b", solid: false, emoji: "🕸️" },
  H: { name: "Muro de madera", bg: "#5b4634", solid: true },
  R: { name: "Tejado", bg: "#7c2d2d", solid: true },
  D: { name: "Puerta abierta", bg: "#3b2a1c", solid: false, emoji: "🚪" },
  d: { name: "Puerta cerrada", bg: "#3b2a1c", solid: true, emoji: "🚪" },
  W: { name: "Suelo de madera", bg: "#8a6a44", solid: false },
  M: { name: "Tatami", bg: "#b7a878", solid: false },
  Y: { name: "Shōji", bg: "#d9d2c0", solid: true },
  f: { name: "Valla", bg: "#6b5136", solid: true },
  F: { name: "Flores", bg: "#3f7a45", solid: false, emoji: "🌼" },
  L: { name: "Farol de papel", bg: "#3a3f4c", solid: true, emoji: "🏮" },
  O: { name: "Linterna de piedra", bg: "#4a4f5c", solid: true, emoji: "🗿" },
  X: { name: "Torii", bg: "#8c2f2f", solid: true, emoji: "⛩️" },
  x: { name: "Punto de viaje", bg: "#7a3030", solid: false, emoji: "⛩️" },
  E: { name: "Chapa del tren", bg: "#3d4550", solid: true },
  I: { name: "Suelo de vagón", bg: "#6a533c", solid: false },
  r: { name: "Raíl", bg: "#4a4a4a", solid: true, emoji: "🛤️" },
  V: { name: "Plataforma imposible", bg: "#2b1d3a", solid: false },
  v: { name: "Muro del castillo", bg: "#180f22", solid: true },
  b: { name: "Biwa de Nakime", bg: "#2b1d3a", solid: true, emoji: "🎻" },
  k: { name: "Irori", bg: "#6a533c", solid: true, emoji: "🔥" },
  p: { name: "Futón", bg: "#b7a878", solid: false, emoji: "🛏️" },
  Q: { name: "Edificio de Asakusa", bg: "#3a3550", solid: true, emoji: "🏮" },
  N: { name: "Letrero de neón", bg: "#2a2440", solid: true, emoji: "💡" },
};

export function tileAt(rows: string[], x: number, y: number): TileDef {
  if (y < 0 || y >= rows.length) return TILES["#"];
  const row = rows[y];
  if (x < 0 || x >= row.length) return TILES["#"];
  return TILES[row[x]] ?? TILES["#"];
}

export function tileCharAt(rows: string[], x: number, y: number): string {
  return rows[y]?.[x] ?? "#";
}
