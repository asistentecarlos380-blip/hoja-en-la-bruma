/** Cinco disciplinas, tres grados. El orden se intercala por ronda. */
const disciplines = [
  { name: "Esquiva y lectura", key: "X / K · esquiva", fraction: 0.18, required: 2, task: "Lee el tronco y esquiva en el instante correcto." },
  { name: "Guardia y desvío", key: "V / F · parada", fraction: 0.39, required: 3, task: "Desvía los bambúes cuando se acerquen." },
  { name: "Cortes encadenados", key: "G / J × 4 → E", fraction: 0.62, required: 5, task: "Encadena cuatro cortes y termina con E." },
  { name: "Coordinación con Tanjiro", key: "C / Tab · relevo", fraction: 0.82, required: 1, task: "Observa la señal y sincroniza el relevo." },
  { name: "Reflejos bajo presión", key: "X / K · esquiva", fraction: 0.18, required: 2, task: "Repite la esquiva con menos margen para reaccionar." },
] as const;
export const SAGIRI_STATIONS = Array.from({ length: 15 }, (_, index) => {
  const level = Math.floor(index / 5) + 1;
  const base = disciplines[index % 5];
  return { ...base, name: `${base.name} · nivel ${level}`, task: `Nivel ${level}/3 · ${base.task} Sin cronómetro global.`, required: base.required, level };
});
export const stationMechanic = (index: number) => [0, 1, 2, 3, 0][index % 5];
export const ROCK_TRAINING = {
  maxResistance: 100,
  chargeTarget: 100,
  comboLength: 4,
  parriesRequired: 1,
  pressureTelegraph: 0.85,
  parryWindow: 0.39,
  beatStart: 0.28,
  beatEnd: 0.72,
  focusedBeatStart: 0.16,
  focusedBeatEnd: 0.84,
  threadSeconds: 0.8,
  comboSeconds: 2.6,
} as const;

export const trainingStation = (index: number) => SAGIRI_STATIONS[Math.max(0, Math.min(SAGIRI_STATIONS.length - 1, index))];
export const withinWindow = (remaining: number, window: number) => remaining > 0 && remaining <= window;
export const beatIsClean = (marker: number, concentrated: boolean) =>
  marker >= (concentrated ? ROCK_TRAINING.focusedBeatStart : ROCK_TRAINING.beatStart) &&
  marker <= (concentrated ? ROCK_TRAINING.focusedBeatEnd : ROCK_TRAINING.beatEnd);
export const threadIsOpen = (remaining: number, ePressedAt: number, now: number, holdingE: boolean) =>
  withinWindow(remaining, ROCK_TRAINING.threadSeconds) && (holdingE || (ePressedAt > 0 && now - ePressedAt <= 800));
