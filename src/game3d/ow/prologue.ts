export const PROLOGUE_VERSION = 3 as const;
export const PROLOGUE = { INTRO: 0, TANJIRO: 1, CLIMB: 2, RESCUE: 3, SLEEP: 4, EXIT: 5, KAMADO: 6 } as const;
export const SLOPE_EDGE = { x: -94, z: 151 };
export const FALL_LANDING = { x: -106, z: 156 };
export const CABIN_ENTRY = { x: 0, z: 5.1 };
export const CABIN_WAKE = { x: -2.7, z: -0.6 };
export const CABIN_FLOOR = 0.18;
/** Muro de ventisca centrado en la entrada de la casa Kamado, activo durante la noche del prólogo. */
export const STORM_WALL = { inner: 10, outer: 17.2, sealed: 14.2 };
/** Escenas en las que no conviene salir de pantalla completa. */
export const IMPORTANT_NODES = new Set(["p0_slope", "p0_3b", "p0_sleep", "p0_morning", "p0_3", "p0_4", "p0_4_calm", "p0_5_arrive", "p0_5_stand", "p0_5", "c1_1", "c1_nezuko_care", "c1_sabito", "c1_sabito_pragmatico", "c1_sabito_defensa", "c1_sabito_equilibrio", "c1_sabito_duelo", "c1_night_care", "c2_2", "c4_akaza", "c5_muzan", "c5_final"]);

export type RefugeState = { location: "outdoors" | "saburo"; fallen: boolean; slept: boolean };
export const freshRefuge = (): RefugeState => ({ location: "outdoors", fallen: false, slept: false });
export type CabinAction = "tatami" | "exit" | "bed" | "bath" | "saburo" | "tanjiro";
export const CABIN_SPOTS: { id: CabinAction; x: number; z: number; radius: number; label: string }[] = [
  { id: "tatami", x: -2.8, z: -2.5, radius: 1.95, label: "Tatami con sábanas" },
  { id: "exit", x: 0, z: 5.8, radius: 1.7, label: "Puerta de la cabaña" },
  { id: "bed", x: -5.8, z: -3.4, radius: 1.8, label: "Cama de Saburo" },
  { id: "bath", x: 5.5, z: -2.9, radius: 1.7, label: "Baño · lavarse las manos" },
  { id: "saburo", x: -0.1, z: 1.8, radius: 1.7, label: "Hablar con Saburo" },
  { id: "tanjiro", x: 3.7, z: 4, radius: 1.7, label: "Hablar con Tanjiro" },
];

export function cabinSpot(x: number, z: number) {
  return CABIN_SPOTS.filter((s) => Math.hypot(x - s.x, z - s.z) <= s.radius)
    .sort((a, b) => Math.hypot(x - a.x, z - a.z) - Math.hypot(x - b.x, z - b.z))[0] ?? null;
}

/** La espada de entrenamiento llega después de Urokodaki; el rango, tras la Selección. */
export function canUseSword(mission: number, step: number) {
  return mission >= 2 || (mission === 1 && step >= 6);
}
export function hunterStatus(mission: number) {
  if (mission === 0) return "Civil · sin rango";
  if (mission === 1) return "Aprendiz · sin rango";
  return mission < 4 ? "Mizunoto" : mission < 6 ? "Mizunoe" : "Cazador veterano";
}

export type OWSave = {
  version?: number;
  missionIdx: number;
  stepIdx: number;
  queued: string | null;
  visited: string[];
  introPlayed: boolean;
  x: number;
  z: number;
  yaw: number;
  finished: boolean;
  refuge?: RefugeState;
  trainingDay?: number;
  trainingHour?: number;
  sideQuestDone?: string[];
  sideQuestActive?: string | null;
  playerXp?: number;
  nezukoLastVisitDay?: number;
  nezukoAwakeVisits?: number;
  nezukoBuff?: { kind: "speed" | "learning" | "strength"; remaining: number; magnitude: number } | null;
};

/** Valida y migra las partidas anteriores sin perder los capítulos completados. */
export function normalizeSave(value: unknown): OWSave | null {
  if (!value || typeof value !== "object") return null;
  const s = value as Record<string, unknown>;
  const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
  if (!finite(s.missionIdx) || !finite(s.stepIdx) || !finite(s.x) || !finite(s.z)) return null;
  const missionIdx = Math.floor(Math.max(0, Math.min(9, s.missionIdx)));
  let stepIdx = Math.floor(Math.max(0, Math.min([10, 7, 4, 3, 3, 5, 2, 3, 3, 1][missionIdx] - 1, s.stepIdx)));
  const r = s.refuge as Partial<RefugeState> | undefined;
  let refuge = freshRefuge();
  if (missionIdx > 0) refuge = { location: "outdoors", fallen: true, slept: true };
  else if (s.version === PROLOGUE_VERSION && r) {
    refuge = { location: r.location === "saburo" ? "saburo" : "outdoors", fallen: r.fallen === true, slept: r.slept === true };
    if (!refuge.fallen) stepIdx = Math.min(stepIdx, PROLOGUE.CLIMB);
    if (refuge.location === "saburo") {
      refuge.fallen = true;
      stepIdx = refuge.slept ? PROLOGUE.EXIT : PROLOGUE.SLEEP;
    } else if (refuge.slept) stepIdx = Math.max(stepIdx, PROLOGUE.KAMADO);
    else stepIdx = Math.min(stepIdx, PROLOGUE.RESCUE);
  } else if (s.stepIdx >= 3) {
    // Antes hablar con Saburo adelantaba la noche. Ahora se retoma dentro, antes de dormir.
    refuge = { location: "saburo", fallen: true, slept: false };
    stepIdx = PROLOGUE.SLEEP;
  }
  const indoor = refuge.location === "saburo";
  const legacyIndoor = indoor && s.version !== PROLOGUE_VERSION;
  const x = legacyIndoor ? CABIN_ENTRY.x : Math.max(indoor ? -7.3 : -173, Math.min(indoor ? 7.3 : 173, s.x));
  const z = legacyIndoor ? CABIN_ENTRY.z : Math.max(indoor ? -5.8 : -173, Math.min(indoor ? 5.8 : 173, s.z));
  return {
    version: PROLOGUE_VERSION, missionIdx, stepIdx, refuge, x, z,
    yaw: finite(s.yaw) ? s.yaw : Math.PI,
    queued: typeof s.queued === "string" ? s.queued.slice(0, 80) : null,
    visited: Array.isArray(s.visited) ? s.visited.filter((id): id is string => typeof id === "string" && id.length < 90).slice(0, 500) : [],
    introPlayed: s.introPlayed === true, finished: missionIdx >= 9 && s.finished === true,
    trainingDay: finite(s.trainingDay) ? Math.max(1, Math.min(900, Math.floor(s.trainingDay))) : 1,
    trainingHour: finite(s.trainingHour) ? Math.max(0, Math.min(23, s.trainingHour)) : 7,
    sideQuestDone: Array.isArray(s.sideQuestDone) ? s.sideQuestDone.filter((v): v is string => typeof v === "string").slice(0, 20) : [],
    sideQuestActive: typeof s.sideQuestActive === "string" ? s.sideQuestActive : null,
    playerXp: finite(s.playerXp) ? Math.max(0, Math.floor(s.playerXp)) : 0,
    nezukoLastVisitDay: finite(s.nezukoLastVisitDay) ? Math.max(0, Math.floor(s.nezukoLastVisitDay)) : 0,
    nezukoAwakeVisits: finite(s.nezukoAwakeVisits) ? Math.max(0, Math.floor(s.nezukoAwakeVisits)) : 0,
    nezukoBuff: (() => {
      const b = s.nezukoBuff as Record<string, unknown> | null | undefined;
      if (!b || !["speed", "learning", "strength"].includes(String(b.kind)) || !finite(b.remaining) || !finite(b.magnitude)) return null;
      return { kind: b.kind as "speed" | "learning" | "strength", remaining: Math.max(0, Math.min(3, Math.floor(b.remaining))), magnitude: Math.max(1, Math.min(1.25, b.magnitude)) };
    })(),
  };
}
