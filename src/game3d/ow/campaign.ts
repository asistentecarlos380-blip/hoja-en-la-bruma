import { at } from "./world";
import type { Look } from "./characters";
import { SLOPE_EDGE, CABIN_SPOTS } from "./prologue";

export type StepType = "reach" | "talk" | "kill" | "fall" | "shelter" | "sleep" | "exit" | "encounter" | "cinematic" | "training";
export type TrainingKind = "descent" | "boulder";
export type BossStyle = "shoot" | "rush" | "both";
export type Spawn = { demon: string; count?: number; boss?: boolean; hp?: number; style?: BossStyle };

export type Step = {
  type: StepType;
  label: string;
  zone: string;
  x: number;
  z: number;
  radius?: number;
  npc?: string;
  nodes?: string[];
  intro?: string[];
  after?: string[];
  spawns?: Spawn[];
  encounter?: string;
  training?: TrainingKind;
};

export type Mission = {
  id: string;
  chapter: number;
  title: string;
  briefing: string;
  combat: boolean;
  steps: Step[];
};

export type NpcDef = {
  id: string;
  name: string;
  emoji: string;
  kind?: "human" | "crow";
  look?: Look;
  x: number;
  z: number;
  from: number;
  to: number;
  lines: string[];
};

export type FollowerDef = { id: string; name: string; emoji: string; look: Look; from: number; lines: string[] };

export const LOOKS = {
  player: { uniform: "#1d2230", haori: "#76838c", haori2: "#a5aaa3", hair: "#2a1c1c", sword: true },
  tanjiro: { uniform: "#1d2230", haori: "#2f6b4a", haori2: "#141414", hair: "#5a1f1a", sword: true, character: "tanjiro" },
  nezuko: { uniform: "#d97aa2", haori: "#6a3424", hair: "#1a1010", longHair: true, muzzle: true, scale: 0.92, character: "nezuko" },
  zenitsu: { uniform: "#1d2230", haori: "#f2c94c", haori2: "#f7e08a", hair: "#f5d040", sword: true },
  inosuke: { uniform: "#3a3a4a", haori: "#c9a27a", hair: "#3a3a5a", boar: true, sword: true },
  giyu: { uniform: "#1d2230", haori: "#7a1f2a", haori2: "#3a6b3a", hair: "#151520", sword: true, character: "giyu" },
  urokodaki: { uniform: "#2a3550", haori: "#3a5f9a", hair: "#d8d8d8", mask: "#c0392b" },
  sabito: { uniform: "#3a3f52", haori: "#d98c4a", haori2: "#f0c27b", hair: "#e38a7a", sword: true, scale: 1.04 },
  makomo: { uniform: "#2a1f30", haori: "#b85d78", hair: "#1a242b", longHair: true, sword: true, scale: 0.94 },
  saburo: { uniform: "#4a4038", haori: "#5c5248", hair: "#d0d0d0" },
  aldeana: { uniform: "#a05050", haori: "#d9a0a0", hair: "#222", scale: 0.86 },
  kazumi: { uniform: "#5a4a3a", haori: "#7a6a4a", hair: "#222" },
  satoko: { uniform: "#8a5a7a", haori: "#c8a0b8", hair: "#222", scale: 0.88, longHair: true },
  muzan: { uniform: "#111", haori: "#1b1b1b", hair: "#111", hat: "#e8e8e8", skin: "#f1ddd0" },
  tamayo: { uniform: "#6a3a6a", haori: "#8a5a8a", hair: "#1a1010", longHair: true },
  yushiro: { uniform: "#e6e6e6", haori: "#2a2a2a", hair: "#ddd", scale: 0.9 },
  vendor: { uniform: "#3a3a4a", haori: "#e8e0d0", hair: "#222" },
  kagaya: { uniform: "#333", haori: "#e8e0d0", hair: "#222" },
  aoi: { uniform: "#2a3a5a", haori: "#f0f0f0", hair: "#222", scale: 0.9 },
  kakushi: { uniform: "#222", haori: "#222", hair: "#111" },
  kid: { uniform: "#5a6a8a", haori: "#8aa0c0", hair: "#222", scale: 0.7 },
  rengoku: { uniform: "#1d2230", haori: "#f5f0e8", haori2: "#e0602a", hair: "#f0a020", sword: true },
  shinobu: { uniform: "#1d2230", haori: "#e8d0f0", haori2: "#7ac0c0", hair: "#2a1a3a", sword: true, scale: 0.9 },
  sanemi: { uniform: "#1d2230", haori: "#e8e8e8", hair: "#f0f0f0", sword: true },
  muichiro: { uniform: "#1d2230", haori: "#2a3a4a", hair: "#2a3040", longHair: true, sword: true, scale: 0.88 },
  mitsuri: { uniform: "#1d2230", haori: "#f5f5f5", hair: "#f08ab0", longHair: true, sword: true },
} satisfies Record<string, Look>;

const p = (id: string, dx: number, dz: number) => at(id, dx, dz);

export const PLAYER_START = { ...p("kumotori", -12, 9), yaw: Math.PI };

/** Cabaña del viejo Saburo, a media ladera entre la aldea y la casa Kamado. */
export const SABURO_HILL = p("kumotori", 20, 22);
export const SABURO_DOOR = p("kumotori", 18, 27);

export const NPCS: NpcDef[] = [
  { id: "tanjiro_home", name: "Tanjiro Kamado", emoji: "🎴", look: LOOKS.tanjiro, ...p("kumotori", -5, 11), from: 0, to: 0, lines: ["«¡Hace un frío terrible, cuñado! ¿Subimos ya?»"] },
  { id: "saburo", name: "Viejo Saburo", emoji: "🧓", look: LOOKS.saburo, ...SABURO_DOOR, from: 0, to: 99, lines: ["«El viento baja de los Kamado y empuja hacia aquí. Por eso vivo en este recodo.»", "«No subáis de noche. Nunca de noche.»"] },
  { id: "aldeana", name: "Aldeana", emoji: "👧", look: LOOKS.aldeana, ...p("kumotori", 3, -8), from: 0, to: 99, lines: ["«¿Ya tenéis fecha para la boda? ¡Todo el pueblo apuesta por la primavera!»", "«Nezuko-chan siempre sonríe cuando te nombran, ¿lo sabías?»"] },
  { id: "urokodaki", name: "Urokodaki Sakonji", emoji: "👺", look: LOOKS.urokodaki, ...p("sagiri", 4, 3), from: 1, to: 99, lines: ["«El amor y las promesas de matrimonio no significan nada si su determinación es blanda como el barro.»", "«Si ambos pretenden proteger a Nezuko con sus propias manos, demuéstrenme que sus espíritus no se romperán en la montaña.»"] },
  { id: "nezuko_sleeping", name: "Nezuko · en la cabaña", emoji: "🌸", look: LOOKS.nezuko, ...p("sagiri", 2, 2), from: 1, to: 1, lines: ["Mmmph... (Nezuko se acomoda bajo la manta cuando le acaricias el cabello. A salvo de la luz, vuelve a cerrar los ojos.)", "Le hablas con cariño y velas su sueño. Nezuko apoya un instante la mejilla en tu mano y parece sonreír detrás del bambú.", "Antes de regresar a la montaña, compruebas que Nezuko está abrigada y que la cabaña sigue en penumbra. «Descansa. Pronto volveré», le susurras."] },
  { id: "makomo", name: "Makomo (20)", emoji: "🌸", look: LOOKS.makomo, ...p("sagiri", -5, 6), from: 1, to: 99, lines: ["«Hola. Soy Makomo. También practico con el señor Urokodaki. ¿Cómo te llamas?»", "«Llevo días repitiendo esta postura y aún fallo. ¿Quieres practicar a mi lado?»", "«Sabito me exige demasiado, pero creo que teme que me lastime.»"] },
  { id: "sabito", name: "Sabito (21)", emoji: "🦊", look: LOOKS.sabito, ...p("sagiri", 8, 10), from: 1, to: 99, lines: ["«Soy Sabito. Entreno aquí también. No confundas esfuerzo con técnica.»", "«Makomo, descansa. No pienso verte caer por repetir un movimiento agotada.»", "«Mañana seguiremos. Cada uno tiene que encontrar su propio ritmo.»"] },
  { id: "cuervo", name: "Cuervo Kasugai", emoji: "🐦‍⬛", kind: "crow", ...p("sede", 3, 11), from: 2, to: 99, lines: ["«¡GRAAAC! ¡Mira tu diario de misiones, cazador!»", "«¡CAAAW! ¡Al norte, al sur, a donde haga falta!»"] },
  { id: "aoi", name: "Kanzaki Aoi", emoji: "👧", look: LOOKS.aoi, ...p("sede", -7, 10), from: 2, to: 99, lines: ["«Si vuelves herido, pasas por la enfermería. Es una orden.»", "«Nezuko-san se portó muy bien. Bueno... mordió una almohada.»"] },
  { id: "kakushi", name: "Kakushi", emoji: "👤", look: LOOKS.kakushi, ...p("sede", 9, 15), from: 2, to: 99, lines: ["«Si caes en combate, te llevaremos a un lugar seguro. Es nuestro trabajo.»"] },
  { id: "kagaya", name: "Ubuyashiki Kagaya", emoji: "🪷", look: LOOKS.kagaya, ...p("jardin", 0, -4), from: 2, to: 99, lines: ["«Mis queridos niños... el amanecer llega para quien no deja de caminar.»"] },
  { id: "kazumi", name: "Kazumi", emoji: "🧣", look: LOOKS.kazumi, ...p("pantano", -11, 13), from: 2, to: 99, lines: ["«Satoko está a salvo gracias a vosotros. No lo olvidaré.»"] },
  { id: "satoko", name: "Satoko", emoji: "👧", look: LOOKS.satoko, ...p("pantano", -14, 15), from: 3, to: 99, lines: ["«Gracias... por no llegar tarde.»"] },
  { id: "muzan_hat", name: "Hombre del sombrero", emoji: "🩸", look: LOOKS.muzan, ...p("asakusa", 5, -3), from: 3, to: 3, lines: ["El olor a sangre antigua se pierde entre la multitud."] },
  { id: "tamayo", name: "Tamayo", emoji: "💉", look: LOOKS.tamayo, ...p("asakusa", -14, -4), from: 3, to: 99, lines: ["«Guardad una gota de cada demonio. La ciencia también es un filo.»"] },
  { id: "yushiro", name: "Yushiro", emoji: "👦", look: LOOKS.yushiro, ...p("asakusa", -12, -5), from: 3, to: 99, lines: ["«No mires a Tamayo-sama más de lo necesario, cazador.»"] },
  { id: "vendedor", name: "Vendedor de ramen", emoji: "🍜", look: LOOKS.vendor, ...p("asakusa", 6, 13), from: 3, to: 99, lines: ["«¡Ramen caliente! ¿Uno para el novio y otro para la novia?»"] },
  { id: "zenitsu_mansion", name: "Zenitsu Agatsuma", emoji: "⚡", look: LOOKS.zenitsu, ...p("mansion", 6, 13), from: 4, to: 4, lines: ["«¡Ahí dentro hay un demonio! ¡No quiero morir!»"] },
  { id: "inosuke_mansion", name: "Inosuke Hashibira", emoji: "🐗", look: LOOKS.inosuke, ...p("mansion", -6, 13), from: 4, to: 4, lines: ["«¡PELEA CONMIGO! ¡El gran Inosuke-sama te reta!»"] },
  { id: "teruko", name: "Teruko", emoji: "👧", look: LOOKS.kid, ...p("mansion", -2, 10), from: 4, to: 99, lines: ["«Mi hermano está dentro... por favor, sacadlo.»", "«¡Gracias por salvarnos!»"] },
  { id: "shinobu_nata", name: "Shinobu Kocho", emoji: "🦋", look: LOOKS.shinobu, ...p("natagumo", 4, 27), from: 6, to: 99, lines: ["«Ara ara~. Procurad no morir antes de la boda.»"] },
  { id: "giyu_nata", name: "Tomioka Giyu", emoji: "🌊", look: LOOKS.giyu, ...p("natagumo", -4, 27), from: 6, to: 99, lines: ["«...No está mal. Para ser un Mizunoto.»"] },
  { id: "sanemi", name: "Sanemi Shinazugawa", emoji: "🌪️", look: LOOKS.sanemi, ...p("jardin", -7, 3), from: 6, to: 99, lines: ["«Un demonio aliado... y encima prometida de un novato. Qué asco.»"] },
  { id: "rengoku_jardin", name: "Kyojuro Rengoku", emoji: "🔥", look: LOOKS.rengoku, ...p("jardin", 7, 3), from: 6, to: 6, lines: ["«¡YO APRUEBO ESTA BODA! ¡Y LA CUSTODIARÉ!»"] },
  { id: "muichiro", name: "Muichiro Tokito", emoji: "🌫️", look: LOOKS.muichiro, ...p("jardin", -8, -2), from: 6, to: 99, lines: ["«Ese plateado... ¿somos familia? Creo que sí. Creo...»"] },
  { id: "mitsuri", name: "Mitsuri Kanroji", emoji: "🍡", look: LOOKS.mitsuri, ...p("jardin", 8, -2), from: 6, to: 99, lines: ["«¡Una boda! ¡Qué emoción! ¿Puedo llevar el ramo?»"] },
  { id: "rengoku", name: "Kyojuro Rengoku", emoji: "🔥", look: LOOKS.rengoku, ...p("mugen", -6, 8), from: 7, to: 99, lines: ["«¡¡UMAAAI!! ¡Come algo antes del combate, muchacho!»", "«¡ARDE ENCENDIDO!»"] },
  { id: "tamayo_castle", name: "Tamayo", emoji: "💉", look: LOOKS.tamayo, ...p("castillo", 12, 20), from: 8, to: 99, lines: ["«La cura está lista. La decisión es de ella.»"] },
];

export const FOLLOWERS: FollowerDef[] = [
  { id: "f_tanjiro", name: "Tanjiro", emoji: "🎴", look: LOOKS.tanjiro, from: 1, lines: ["«Huelo a glicinia... y a que se acerca algo grande.»", "«Gracias por cuidar de Nezuko, cuñado.»", "«¡Un hermano mayor no se rinde!»"] },
  { id: "f_nezuko", name: "Nezuko", emoji: "🌸", look: LOOKS.nezuko, from: 2, lines: ["Mmmph... (Nezuko te sujeta la manga y sonríe.)", "Mmm! (Te da un golpecito en la frente: no te distraigas.)", "Mmmph~ (Señala los cerezos. Quiere pasear contigo cuando todo termine.)"] },
  { id: "f_zenitsu", name: "Zenitsu", emoji: "⚡", look: LOOKS.zenitsu, from: 6, lines: ["«¡No te creas especial por ser su prometido! ...Vale, sí lo eres. ¡TE ODIO!»", "«Nezuko-san me ha mirado. ¡ME HA MIRADO!»"] },
  { id: "f_inosuke", name: "Inosuke", emoji: "🐗", look: LOOKS.inosuke, from: 6, lines: ["«¡Rival amoroso! ¡Echemos una carrera!»", "«¡El gran Inosuke-sama no necesita mapa!»"] },
];

export const MISSIONS: Mission[] = [
  {
    id: "m0", chapter: 0, combat: false,
    title: "Prólogo — Una noche bajo la nieve",
    briefing: "Nieva en Kumotori. Tú (20) y Tanjiro (21) aún sois civiles. Acompáñalo por la ladera, acepta refugio tras la caída y supera la prueba de Giyu Tomioka para llevar a Nezuko (19) en la cesta de bambú.",
    steps: [
      { type: "reach", label: "La víspera: escucha la historia junto a tu casa", zone: "kumotori", ...PLAYER_START, radius: 8, nodes: ["p0_1"] },
      { type: "talk", label: "Habla con Tanjiro frente a tu casa", zone: "kumotori", npc: "tanjiro_home", x: 0, z: 0, nodes: ["p0_2"] },
      { type: "fall", label: "Sube por el sendero nevado con Tanjiro", zone: "kumotori", ...SLOPE_EDGE, radius: 4, nodes: ["p0_slope"] },
      { type: "shelter", label: "Tras la caída, habla con Saburo para refugiaros", zone: "kumotori", npc: "saburo", ...SABURO_DOOR, nodes: ["p0_3b"] },
      { type: "sleep", label: "Explora la cabaña y duerme en el tatami", zone: "saburo", x: CABIN_SPOTS[0].x, z: CABIN_SPOTS[0].z, nodes: ["p0_sleep"] },
      { type: "exit", label: "Ha amanecido: sal por la puerta de la cabaña", zone: "saburo", x: CABIN_SPOTS[1].x, z: CABIN_SPOTS[1].z, nodes: ["p0_morning"] },
      { type: "reach", label: "Llega a casa de Nezuko por la mañana", zone: "kamado", ...p("kamado", 0, 6), radius: 7, nodes: ["p0_3"] },
      { type: "encounter", label: "Esquiva a Nezuko y cálmala con tus palabras", zone: "kamado", ...p("kamado", 0, 13), encounter: "nezuko", nodes: ["p0_4"], after: ["p0_4_calm"] },
      { type: "encounter", label: "Resiste al Pilar del Agua", zone: "kamado", ...p("kamado", 0, 13), encounter: "giyu", nodes: ["p0_5_arrive"], after: ["p0_5_stand"] },
      { type: "cinematic", label: "Cinemática: El bambú de Nezuko y la cesta de viaje", zone: "kamado", ...p("kamado", 0, 6), nodes: ["p0_5"] },
    ],
  },
  {
    id: "m1", chapter: 1, combat: true,
    title: "Capítulo 1 — El entrenamiento de Urokodaki",
    briefing: "Llegas con Nezuko (19) en la cesta al Monte Sagiri. A lo largo de semanas y meses, aprende con los demás discípulos: recibe la advertencia de Urokodaki, mima a Nezuko en la cabaña, entrena con Tanjiro (21), motiva a Makomo (20) y enfrenta a Sabito (21) como prueba final.",
    steps: [
      { type: "talk", label: "Llegada: enfrenta la prueba de determinación de Urokodaki", zone: "sagiri", npc: "urokodaki", x: 0, z: 0, nodes: ["c1_1"] },
      { type: "talk", label: "Primera noche: conoce el estado de Nezuko y acompáñala", zone: "sagiri", npc: "nezuko_sleeping", ...p("sagiri", 2, 2), nodes: ["c1_nezuko_care"] },
      { type: "training", label: "Primeras semanas: practica el descenso con Tanjiro", zone: "sagiri", ...p("sagiri", -2, 0), training: "descent", after: ["c1_descent_done"] },
      { type: "talk", label: "Semanas después: conoce a Makomo y practica con ella", zone: "sagiri", npc: "makomo", x: 0, z: 0, nodes: ["c1_makomo_support"] },
      { type: "encounter", label: "Más adelante: conoce a Sabito y participa en un duelo de práctica", zone: "sagiri", ...p("sagiri", 8, 10), encounter: "sabito", nodes: ["c1_sabito"], after: ["c1_sabito_win"] },
      { type: "training", label: "Tras meses de práctica: supera la roca y visita a Nezuko", zone: "sagiri", ...p("sagiri", 12, -6), training: "boulder", after: ["c1_night_care"] },
      { type: "kill", label: "Selección Final: derrota a los demonios del Monte Fujikasane", zone: "fujikasane", ...p("fujikasane", 0, 0), radius: 20, spawns: [{ demon: "demon_ciego", count: 3 }, { demon: "demon_aracnido", count: 2 }], after: ["c1_seleccion"] },
    ],
  },
  {
    id: "m2", chapter: 2, combat: true,
    title: "Capítulo 2 · El pantano del noroeste",
    briefing: "Primera misión oficial. Recibe la orden en la Sede, investiga las desapariciones y rescata a Satoko.",
    steps: [
      { type: "talk", label: "Recibe la orden del Cuervo Kasugai en la Sede", zone: "sede", npc: "cuervo", x: 0, z: 0, nodes: ["m1_1"] },
      { type: "reach", label: "Llega al pueblo del noroeste", zone: "pantano", ...p("pantano", -14, 4), radius: 9, nodes: ["m1_arrive"] },
      { type: "talk", label: "Habla con Kazumi sobre las desapariciones", zone: "pantano", npc: "kazumi", x: 0, z: 0, nodes: ["m1_kazumi"] },
      { type: "kill", label: "Sigue el rastro hasta el pantano y derrota al demonio", zone: "pantano", ...p("pantano", 10, -8), radius: 15, intro: ["m1_swamp_entry"], spawns: [{ demon: "demon_pantano", boss: true, hp: 10, style: "shoot" }, { demon: "demon_ciego", count: 2 }], after: ["m1_swamp_phase2"] },
    ],
  },
  {
    id: "m3", chapter: 3, combat: false,
    title: "Capítulo 3 · El rastro en Asakusa",
    briefing: "Investigación sin combate: sigue el olor de Muzan entre la multitud sin poner en peligro a los civiles.",
    steps: [
      { type: "reach", label: "Entra en la avenida principal de Asakusa", zone: "asakusa", ...p("asakusa", 0, 22), radius: 9, nodes: ["a1_1"] },
      { type: "talk", label: "Sigue el olor hasta el hombre del sombrero", zone: "asakusa", npc: "muzan_hat", x: 0, z: 0, nodes: ["a1_muzan"] },
      { type: "talk", label: "Busca a Tamayo en el callejón", zone: "asakusa", npc: "tamayo", x: 0, z: 0, nodes: ["a1_tamayo"] },
    ],
  },
  {
    id: "m4", chapter: 4, combat: true,
    title: "Capítulo 4 · La mansión de los tambores",
    briefing: "Unos niños han desaparecido en la Mansión Tsuzumi. Ahí conocerás a Zenitsu... que no te perdonará tener prometida.",
    steps: [
      { type: "reach", label: "Llega a la Mansión Tsuzumi", zone: "mansion", ...p("mansion", 0, 20), radius: 7, nodes: ["d1_1"] },
      { type: "talk", label: "Habla con Zenitsu en la entrada", zone: "mansion", npc: "zenitsu_mansion", x: 0, z: 0, nodes: ["d1_zenitsu"] },
      { type: "kill", label: "Entra al patio y derrota a Kyogai", zone: "mansion", ...p("mansion", 0, 0), radius: 10, intro: ["d1_phase1"], spawns: [{ demon: "kyogai", boss: true, hp: 14, style: "shoot" }], after: ["d1_final"] },
    ],
  },
  {
    id: "m5", chapter: 5, combat: true,
    title: "Capítulo 5 · Monte Natagumo",
    briefing: "Diez escuadrones han desaparecido. Derrota a toda la familia araña, uno por uno, y enfrenta a Rui.",
    steps: [
      { type: "reach", label: "Llega a la falda del Monte Natagumo", zone: "natagumo", ...p("natagumo", 0, 32), radius: 9, nodes: ["c2_1"] },
      { type: "kill", label: "Detén a la Madre Araña", zone: "natagumo", ...p("natagumo", -20, 12), radius: 12, intro: ["c2_mother_start"], spawns: [{ demon: "spider_mother", boss: true, hp: 12, style: "shoot" }, { demon: "demon_aracnido", count: 2 }], after: ["c2_mother_final"] },
      { type: "kill", label: "Rescata a Zenitsu del Hermano Araña", zone: "natagumo", ...p("natagumo", 22, 6), radius: 12, intro: ["c2_brother_start"], spawns: [{ demon: "spider_brother", boss: true, hp: 12, style: "shoot" }, { demon: "demon_aracnido", count: 1 }], after: ["c2_brother_final"] },
      { type: "kill", label: "Ayuda a Inosuke contra el Padre Araña", zone: "natagumo", ...p("natagumo", 18, -18), radius: 12, intro: ["c2_father_start"], spawns: [{ demon: "spider_father", boss: true, hp: 16, style: "rush" }], after: ["c2_father_final"] },
      { type: "kill", label: "Enfrenta a Rui en la telaraña central", zone: "natagumo", ...p("natagumo", -4, -22), radius: 14, intro: ["c2_2"], spawns: [{ demon: "rui", boss: true, hp: 22, style: "both" }, { demon: "demon_aracnido", count: 2 }], after: ["c2_rui_final"] },
    ],
  },
  {
    id: "m6", chapter: 6, combat: false,
    title: "Capítulo 6 · El juicio de los Pilares",
    briefing: "Sin combate: preséntate ante los Nueve Pilares y demuestra que Nezuko jamás ha probado sangre humana.",
    steps: [
      { type: "reach", label: "Preséntate en el Jardín de los Pilares", zone: "jardin", ...p("jardin", 0, 7), radius: 6, nodes: ["c3_1"] },
      { type: "talk", label: "Escucha el veredicto de Oyakata-sama", zone: "jardin", npc: "kagaya", x: 0, z: 0, nodes: ["c3_3"] },
    ],
  },
  {
    id: "m7", chapter: 7, combat: true,
    title: "Capítulo 7 · El Tren Mugen",
    briefing: "Acompaña a Rengoku, despierta del sueño de Enmu y cambia el destino del Pilar de la Llama frente a Akaza.",
    steps: [
      { type: "talk", label: "Encuentra a Rengoku en la estación", zone: "mugen", npc: "rengoku", x: 0, z: 0, nodes: ["c4_1"] },
      { type: "kill", label: "Derrota a Enmu, fusionado con el tren", zone: "mugen", ...p("mugen", 10, -4), radius: 13, spawns: [{ demon: "enmu", boss: true, hp: 22, style: "shoot" }, { demon: "demon_campanas", count: 2 }], after: ["c4_enmu"] },
      { type: "kill", label: "Resiste a Akaza en el campo hasta el amanecer", zone: "mugen", ...p("mugen", -18, -20), radius: 13, spawns: [{ demon: "akaza", boss: true, hp: 28, style: "rush" }], after: ["c4_whatif"] },
    ],
  },
  {
    id: "m8", chapter: 8, combat: true,
    title: "Capítulo 8 · El Castillo Infinito",
    briefing: "La batalla final. Abre paso en el castillo y enfrenta a Muzan antes del amanecer para cumplir la promesa de los cerezos.",
    steps: [
      { type: "talk", label: "Reúnete con Tamayo a las puertas del castillo", zone: "castillo", npc: "tamayo_castle", x: 0, z: 0, nodes: ["c5_1"] },
      { type: "kill", label: "Abre paso en la sala de los pasillos imposibles", zone: "castillo", ...p("castillo", 0, 4), radius: 14, intro: ["c5_castillo"], spawns: [{ demon: "kaigaku", boss: true, hp: 18, style: "both" }, { demon: "demon_sangre", count: 3 }] },
      { type: "kill", label: "Derrota a Muzan Kibutsuji antes del amanecer", zone: "castillo", ...p("castillo", -4, -14), radius: 12, intro: ["c5_muzan"], spawns: [{ demon: "muzan", boss: true, hp: 40, style: "both" }], after: ["c5_final"] },
    ],
  },
];

/** Nodos donde un diálogo se detiene: la escena siguiente ocurre en otro paso de la misión. */
export const BREAK_NODES = new Set<string>(
  MISSIONS.flatMap((m) => m.steps.flatMap((s) => [...(s.nodes ?? []), ...(s.intro ?? []), ...(s.after ?? [])])),
);

export function npcById(id: string) {
  return NPCS.find((n) => n.id === id);
}

export function stepTarget(step: Step) {
  if ((step.type === "talk" || step.type === "shelter") && step.npc) {
    const n = npcById(step.npc);
    if (n) return { x: n.x, z: n.z };
  }
  return { x: step.x, z: step.z };
}
