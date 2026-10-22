/** Perfiles tácticos. No confundir interpretaciones narrativas con hechos del canon. */
export type CombatPersonalityId = "sabito" | "giyu" | "nezuko" | "makomo" | "tanjiro";
export type CombatPersonality = {
  preferredRange: number; approachSpeed: number; retreatSpeed: number;
  strafeSpeed: number; decisionEvery: number; evadeChance: number;
  feintChance: number; telegraphFactor: number; attackIntervalFactor: number;
  lungeFactor: number; description: string;
};
export const COMBAT_PERSONALITIES: Record<CombatPersonalityId, CombatPersonality> = {
  sabito: { preferredRange: 2.9, approachSpeed: 4.3, retreatSpeed: 1.3, strafeSpeed: 1.1,
    decisionEvery: 1.15, evadeChance: 0.12, feintChance: 0.22, telegraphFactor: 0.84,
    attackIntervalFactor: 0.82, lungeFactor: 1.08, description: "Presión disciplinada, técnica frontal y castigo de errores" },
  giyu: { preferredRange: 4.0, approachSpeed: 2.4, retreatSpeed: 3.4, strafeSpeed: 0.65,
    decisionEvery: 1.8, evadeChance: 0.34, feintChance: 0.08, telegraphFactor: 0.75,
    attackIntervalFactor: 1.28, lungeFactor: 1.18, description: "Defensa contenida, paciencia y respuesta precisa" },
  nezuko: { preferredRange: 2.0, approachSpeed: 4.7, retreatSpeed: 0.4, strafeSpeed: 0.5,
    decisionEvery: 0.7, evadeChance: 0.05, feintChance: 0, telegraphFactor: 1.05,
    attackIntervalFactor: 0.9, lungeFactor: 1.1, description: "Impulsos descontrolados; combate narrativo defensivo" },
  makomo: { preferredRange: 2.5, approachSpeed: 4.6, retreatSpeed: 2.2, strafeSpeed: 1.9,
    decisionEvery: 0.85, evadeChance: 0.28, feintChance: 0.07, telegraphFactor: 0.85,
    attackIntervalFactor: 0.72, lungeFactor: 1.0, description: "Interpretación: resolver pronto, sin crueldad, ante fuerza enemiga desconocida" },
  tanjiro: { preferredRange: 3.0, approachSpeed: 3.6, retreatSpeed: 1.8, strafeSpeed: 1.3,
    decisionEvery: 1.1, evadeChance: 0.17, feintChance: 0.12, telegraphFactor: 0.95,
    attackIntervalFactor: 0.92, lungeFactor: 1.05, description: "Tenacidad, lectura del rival y ofensiva adaptable" },
};
