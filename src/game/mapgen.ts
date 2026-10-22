import type { Rows } from "./types";

/** Generador pseudoaleatorio determinista (mismas semillas => mismo mapa). */
export function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function fill(w: number, h: number, ch: string): Rows {
  return Array.from({ length: h }, () => ch.repeat(w));
}

export function put(rows: Rows, x: number, y: number, ch: string) {
  if (y < 0 || y >= rows.length) return;
  const row = rows[y];
  if (x < 0 || x >= row.length) return;
  rows[y] = row.slice(0, x) + ch + row.slice(x + 1);
}

export function rect(rows: Rows, x: number, y: number, w: number, h: number, ch: string) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(rows, x + i, y + j, ch);
}

export function ring(rows: Rows, x: number, y: number, w: number, h: number, ch: string) {
  for (let i = 0; i < w; i++) {
    put(rows, x + i, y, ch);
    put(rows, x + i, y + h - 1, ch);
  }
  for (let j = 0; j < h; j++) {
    put(rows, x, y + j, ch);
    put(rows, x + w - 1, y + j, ch);
  }
}

export function border(rows: Rows, ch: string, thickness = 1) {
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  for (let t = 0; t < thickness; t++) {
    for (let x = 0; x < w; x++) {
      put(rows, x, t, ch);
      put(rows, x, h - 1 - t, ch);
    }
    for (let y = 0; y < h; y++) {
      put(rows, t, y, ch);
      put(rows, w - 1 - t, y, ch);
    }
  }
}

/** Decora el mapa de forma determinista sustituyendo solo las losetas indicadas. */
export function scatter(rows: Rows, seed: number, chars: string, chance: number, only: string[]) {
  const rnd = mulberry32(seed);
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (!only.includes(rows[y][x])) continue;
      if (rnd() >= chance) continue;
      put(rows, x, y, chars[Math.floor(rnd() * chars.length)]);
    }
  }
}

/** Traza un sendero en L entre una lista de puntos. */
export function carve(rows: Rows, points: [number, number][], ch = "_") {
  for (let i = 0; i < points.length - 1; i++) {
    let [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    while (x0 !== x1) {
      put(rows, x0, y0, ch);
      x0 += Math.sign(x1 - x0);
    }
    while (y0 !== y1) {
      put(rows, x0, y0, ch);
      y0 += Math.sign(y1 - y0);
    }
    put(rows, x1, y1, ch);
  }
}

/** Edificio con tejado, muros y puerta. Devuelve la posición de la puerta. */
export function house(
  rows: Rows,
  x: number,
  y: number,
  w: number,
  h: number,
  doorOffset: number,
  wall = "H",
  roof = "R",
): { doorX: number; doorY: number } {
  rect(rows, x, y, w, h, wall);
  rect(rows, x, y, w, 1, roof);
  const doorX = x + doorOffset;
  const doorY = y + h - 1;
  put(rows, doorX, doorY, "d");
  return { doorX, doorY };
}
