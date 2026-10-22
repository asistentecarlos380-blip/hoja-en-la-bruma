import type { Look } from "./characters";
import { LOOKS } from "./campaign";

export type FighterId = "player" | "tanjiro";

export type WordOption = {
  text: string;
  tanjiroText: string;
  delta: number;
  reply: string;
  tanjiroReply: string;
  effectSummary: string;
  tone: "calm" | "neutral" | "rage";
};

export type WordWindow = {
  phaseLabel: string;
  prompt: string;
  tanjiroPrompt: string;
  options: WordOption[];
};

export type ComboMove = {
  name: string;
  tanjiroName: string;
  meterGain: number;
  focusCost: number;
};

export type EncounterDef = {
  id: string;
  name: string;
  title: string;
  look: Look;
  color: string;
  playerHp: number;
  goal: number;
  startMeter: number;
  meterLabel: string;
  canAttack: boolean;
  enemyHp?: number;
  attackEvery: [number, number];
  parryWindow: number;
  guardBreak: number;
  counterDmg: number;
  dodgeCost: number;
  guardCost: number;
  lungeSpeed: number;
  telegraph: number;
  damage: number;
  wordsEvery: number;
  wordTime: number;
  comboChainNames: ComboMove[];
  envActions: { label: string; effectText: string; meterDelta: number }[];
  windows: WordWindow[];
  intro: string[];
  success: string;
  failure: string;
  dodgeHint: string;
  scale?: number;
};

const NEZUKO_COMBOS: ComboMove[] = [
  { name: "1º Esquive a ras de nieve", tanjiroName: "1º Paso protector de hermano", meterGain: 5, focusCost: 5 },
  { name: "2º Desvío suave de muñeca", tanjiroName: "2º Bloqueo con el cesto de carbón", meterGain: 6, focusCost: 6 },
  { name: "3º Abrazo contenedor contra el pecho", tanjiroName: "3º Sujeción firme de hombros", meterGain: 9, focusCost: 8 },
  { name: "4º ¡Destello de Recuerdo: Promesa de los Cerezos!", tanjiroName: "4º ¡Destello de Recuerdo: Canción de cuna de mamá!", meterGain: 15, focusCost: 12 },
];

const GIYU_COMBOS: ComboMove[] = [
  { name: "1º Finta rápida entre la ventisca", tanjiroName: "1º Tajo bajo con hacha de leñador", meterGain: 6, focusCost: 6 },
  { name: "2º Impulso contra tronco de pino", tanjiroName: "2º Giro evasivo en pendiente", meterGain: 7, focusCost: 8 },
  { name: "3º Cortina de nieve cegadora", tanjiroName: "3º Lanzamiento de hacha oculta", meterGain: 10, focusCost: 10 },
  { name: "4º ¡Intercepción de Guardia Cruzada!", tanjiroName: "4º ¡Cabezazo desesperado de los Kamado!", meterGain: 16, focusCost: 14 },
];

const SABITO_COMBOS: ComboMove[] = [
  { name: "1º Tajo ascendente de Bruma", tanjiroName: "1º Corte de Superficie (Agua)", meterGain: 6, focusCost: 6 },
  { name: "2º Giro de hoja en contrapaso", tanjiroName: "2º Rueda de Agua lateral", meterGain: 8, focusCost: 8 },
  { name: "3º Rebote aéreo sobre roca musgosa", tanjiroName: "3º Danza de las Corrientes", meterGain: 11, focusCost: 10 },
  { name: "4º ¡Ruptura de Guardia Relámpago!", tanjiroName: "4º ¡Golpe de Marea Implacable!", meterGain: 18, focusCost: 14 },
];

const NEZUKO_WINDOWS: WordWindow[] = [
  {
    phaseLabel: "FASE 1 (INICIO DEL COMBATE — DESCONCIERTO)",
    prompt: "Nezuko forcejea en tu abrazo entre la nieve. Sus pupilas dilatadas te miran sin reconocerte del todo.",
    tanjiroPrompt: "Nezuko ruge frente a Tanjiro, clavando las uñas en la nieve mientras intenta no morderlo.",
    options: [
      {
        text: "«¡Nezuko, soy {firstName}, tu prometido! ¡Mira el anillo de cordel en mi mano, despierta!»",
        tanjiroText: "«¡Nezuko, soy Tanjiro, tu hermano mayor! ¡Resiste, no dejes que el instinto te domine!»",
        delta: 32,
        reply: "Nezuko mira tu mano temblando. Sus colmillos dejan de rechinar y su agresividad baja.",
        tanjiroReply: "Nezuko escucha la voz quebrada de su hermano y detiene el zarpazo en el aire.",
        effectSummary: "EFECTO POSITIVO: La agresividad de Nezuko disminuye y empieza a reaccionar (+32 Calma | Ataques más lentos).",
        tone: "calm",
      },
      {
        text: "«¡Tranquila, respira despacio, solo quiero ayudarte!»",
        tanjiroText: "«¡Quédate quieta un momento, Nezuko, te vas a lastimar!»",
        delta: 10,
        reply: "Se detiene apenas un segundo, jadeando, pero el instinto vuelve a tensar sus músculos.",
        tanjiroReply: "Duda por un instante ante Tanjiro, aunque sigue en postura defensiva.",
        effectSummary: "EFECTO TEMPORAL: Lograste calmarla solo por un momento (+10 Calma | Agresividad sin cambios).",
        tone: "neutral",
      },
      {
        text: "«¡Sujétala fuerte contra el suelo, no dejes que se mueva!»",
        tanjiroText: "«¡Tenemos que atarla con una cuerda antes de que nos ataque!»",
        delta: -22,
        reply: "Sentirse acorralada dispara su pánico demoníaco y ruge con más fuerza.",
        tanjiroReply: "La amenaza de atarla hace que pierda el control y embista con más fuerza.",
        effectSummary: "EFECTO NEGATIVO: Tu respuesta molestó más a Nezuko (-22 Calma | ¡Su velocidad y agresividad aumentan!).",
        tone: "rage",
      },
    ],
  },
  {
    phaseLabel: "FASE 2 (MITAD DEL COMBATE — RECUERDOS FRAGMENTADOS)",
    prompt: "El combate avanza. Nezuko respira agitada tras tu último combo de evasión y abrazo; parece escuchar.",
    tanjiroPrompt: "El combate está a la mitad. Tanjiro la sujeta de los hombros buscándole la mirada.",
    options: [
      {
        text: "«Me prometiste que nos casaríamos en primavera bajo los cerezos. ¡No me dejes solo ahora!»",
        tanjiroText: "«¡Piensa en mamá y en los pequeños! ¡Solo nos quedamos tú, {firstName} y yo, somos tu familia!»",
        delta: 35,
        reply: "Un recuerdo nítido cruza sus ojos rosados. Suelta un gemido suave y afloja la fuerza de sus brazos.",
        tanjiroReply: "Al oír sobre su familia y su prometido, las venas de su frente empiezan a bajar.",
        effectSummary: "EFECTO POSITIVO: Nezuko reacciona al recuerdo y su agresividad cae drásticamente (+35 Calma | Ventana de guardia ampliada).",
        tone: "calm",
      },
      {
        text: "«No voy a sacar ningún arma contra ti, quédate conmigo.»",
        tanjiroText: "«No te haré daño, hermana, pero cálmate por favor.»",
        delta: 12,
        reply: "Retrocede un paso mirándote con confusión, calmándose solo por unos segundos.",
        tanjiroReply: "Baja un poco la cabeza, pero el hambre sigue nublando su juicio.",
        effectSummary: "EFECTO TEMPORAL: Se calmó solo por un breve instante (+12 Calma | El combate continúa igual).",
        tone: "neutral",
      },
      {
        text: "«¡¿Qué te pasa?! ¡Tú no eres este monstruo, reacciona de una vez!»",
        tanjiroText: "«¡Deja de atacarnos como una bestia, Nezuko!»",
        delta: -25,
        reply: "Escuchar que la llamas monstruo la hiere profundamente y desata su furia.",
        tanjiroReply: "El grito severo la altera y se lanza hacia adelante con un salto feroz.",
        effectSummary: "EFECTO NEGATIVO: La alteraste gravemente (-25 Calma | ¡Entra en estado de Furia!).",
        tone: "rage",
      },
    ],
  },
  {
    phaseLabel: "FASE 3 (CLÍMAX DEL COMBATE — DESPERTAR DEL CORAZÓN)",
    prompt: "Nezuko tiembla a pocos centímetros de ti. Está al borde de recuperar el control total.",
    tanjiroPrompt: "Nezuko cae de rodillas en la nieve frente a Tanjiro y a ti, luchando contra su propio instinto.",
    options: [
      {
        text: "Abrazarla sin guardia y acariciar su cabello: «Estoy aquí, mi amor. Siempre te voy a cuidar.»",
        tanjiroText: "Extenderle los brazos junto a {firstName}: «Ven con nosotros, Nezuko. Te devolveremos tu humanidad.»",
        delta: 40,
        reply: "Gruesas lágrimas caen sobre la nieve. Nezuko esconde el rostro en tu pecho, completamente calmada.",
        tanjiroReply: "Nezuko llora en silencio y se aferra al haori de ambos, venciendo su sed de sangre.",
        effectSummary: "EFECTO DECISIVO: ¡Nezuko ha recuperado sus recuerdos y su agresividad se ha disipado por completo! (+40 Calma).",
        tone: "calm",
      },
      {
        text: "«Ya casi termina, aguanta un poco más.»",
        tanjiroText: "«Ya pasó lo peor, respira hondo.»",
        delta: 14,
        reply: "Su respiración se pausa un momento, aunque todavía tiembla de miedo.",
        tanjiroReply: "Parpadea despacio, calmándose solo de forma pasajera.",
        effectSummary: "EFECTO TEMPORAL: La calmaste por un momento, pero aún necesita un último impulso (+14 Calma).",
        tone: "neutral",
      },
      {
        text: "Apartarla bruscamente por temor a un mordisco.",
        tanjiroText: "Empujarla hacia la nieve para poner distancia.",
        delta: -30,
        reply: "Sentir tu rechazo en el último momento rompe su calma y vuelve a atacar desesperada.",
        tanjiroReply: "El empujón reaviva su instinto defensivo y contraataca al instante.",
        effectSummary: "EFECTO NEGATIVO: Tu rechazo rompió su progreso (-30 Calma | ¡Contraataque inmediato!).",
        tone: "rage",
      },
    ],
  },
];

const GIYU_WINDOWS: WordWindow[] = [
  {
    phaseLabel: "FASE 1 (CHOQUE INICIAL EN LA NIEVE)",
    prompt: "Tomioka Giyu detiene tu combo con la vaina de su katana. «Apártate del demonio, muchacho.»",
    tanjiroPrompt: "Tomioka mira a Tanjiro tras esquivar su tajo. «¿Por qué proteges a una criatura que te devorará?»",
    options: [
      {
        text: "«¡Es mi prometida! ¡Si quiere tocarla, tendrá que derrotarme a mí primero!»",
        tanjiroText: "«¡Es mi hermana menor y es todo lo que me queda! ¡Jamás ha herido a nadie!»",
        delta: 30,
        reply: "Giyu observa que no retrocedes ni un milímetro a pesar de no tener katana.",
        tanjiroReply: "Giyu nota la postura ofensiva de Tanjiro combinada con la tuya.",
        effectSummary: "EFECTO POSITIVO: Tomioka nota vuestra determinación y frena el filo de su espada (+30 Determinación).",
        tone: "calm",
      },
      {
        text: "«¡Escúchenos un segundo, podemos explicarlo!»",
        tanjiroText: "«¡En nuestra casa hubo otro olor, ella no fue quien los atacó!»",
        delta: 12,
        reply: "«Las explicaciones no cambian lo que es ahora», dice, aunque pausa su embestida un segundo.",
        tanjiroReply: "Giyu entrecierra los ojos al oír sobre el otro olor, dándoos un respiro breve.",
        effectSummary: "EFECTO TEMPORAL: Ganaste un segundo de atención, pero sigue al ataque (+12 Determinación).",
        tone: "neutral",
      },
      {
        text: "«¡Usted no tiene derecho a juzgarla!»",
        tanjiroText: "Arrodillarse en la nieve desarmado suplicando piedad sin pelear.",
        delta: -24,
        reply: "La mirada de Tomioka se endurece y acelera el paso para dejarte fuera de combate.",
        tanjiroReply: "«¡No le des a otros el poder sobre la vida de tu familia! ¡Levántate y pelea!»",
        effectSummary: "EFECTO NEGATIVO: Molestaste al Pilar del Agua (-24 Determinación | ¡Ataque relámpago!).",
        tone: "rage",
      },
    ],
  },
  {
    phaseLabel: "FASE 2 (CLÍMAX — LA PRUEBA DE PROTECCIÓN)",
    prompt: "Nezuko se suelta y se planta delante de ti y de Tanjiro, abriendo los brazos para defenderlos de Giyu.",
    tanjiroPrompt: "Nezuko protege el cuerpo herido de su prometido y de su hermano frente a la katana del Pilar.",
    options: [
      {
        text: "«¡Mírela! ¡Lleva horas sin comer y aun así arriesga su vida para protegerme a mí y a su hermano!»",
        tanjiroText: "«¡Mi hermana prefiere dar la vida antes que hacernos daño a su prometido o a mí! ¡Lo está viendo!»",
        delta: 38,
        reply: "Tomioka abre los ojos sorprendido, recordando las palabras de su maestro Urokodaki.",
        tanjiroReply: "El Pilar del Agua baja lentamente la punta de su katana Nichirin.",
        effectSummary: "EFECTO DECISIVO: ¡Tomioka ha reconocido el vínculo de Nezuko y decide perdonarles la vida! (+38 Determinación).",
        tone: "calm",
      },
      {
        text: "Cubrir a Nezuko con tu propio cuerpo esperando el golpe.",
        tanjiroText: "Sujetar el brazo de Nezuko para que no salte contra el Pilar.",
        delta: 15,
        reply: "Tomioka detiene el golpe en seco a un centímetro de tu hombro.",
        tanjiroReply: "Tomioka observa cómo ambos se protegen mutuamente.",
        effectSummary: "EFECTO TEMPORAL: Frenaste su golpe por un instante (+15 Determinación).",
        tone: "neutral",
      },
      {
        text: "Gritarle a Nezuko que embista al espadachín.",
        tanjiroText: "Lanzar piedras sin estrategia perdiendo la guardia.",
        delta: -30,
        reply: "Ordenarle atacar confirma los temores del Pilar.",
        tanjiroReply: "Tomioka desvía el ataque de un revés implacable.",
        effectSummary: "EFECTO NEGATIVO: Tu respuesta aumentó la hostilidad de Tomioka (-30 Determinación).",
        tone: "rage",
      },
    ],
  },
];

const SABITO_WINDOWS: WordWindow[] = [
  {
    phaseLabel: "PRUEBA FINAL DE UROKODAKI — DUELO EN EL CLARO",
    prompt: "Sabito (21) choca su bokken contra el tuyo haciendo saltar astillas. Makomo te anima desde atrás.",
    tanjiroPrompt: "Sabito bloquea el tajo de Tanjiro y os reta a ambos: «¡Demuéstrenme el peso de su promesa!»",
    options: [
      {
        text: "«¡Llevo a Nezuko en mi espalda y el apoyo de Makomo en mi espada! ¡No pienso caer!»",
        tanjiroText: "«¡Como hermano mayor y junto a mi cuñado {firstName}, partiremos esa roca hoy mismo!»",
        delta: 32,
        reply: "Sabito sonríe bajo la máscara de zorro: «¡Esa es la mirada de un verdadero espadachín!»",
        tanjiroReply: "Sabito asiente ante la sincronía de ambos cuñados.",
        effectSummary: "EFECTO POSITIVO: Tu espíritu de combate abre una brecha en la guardia de Sabito (+32 Dominio).",
        tone: "calm",
      },
      {
        text: "Regular la Respiración de Concentración Total para aguantar el embate.",
        tanjiroText: "Mantener la postura del Agua firme en el barro.",
        delta: 14,
        reply: "Aguantas el impacto sin retroceder, ganando un segundo para respirar.",
        tanjiroReply: "La postura resiste, aunque Sabito prepara otra serie de tajos.",
        effectSummary: "EFECTO TEMPORAL: Estabilizaste tu respiración por un momento (+14 Dominio).",
        tone: "neutral",
      },
      {
        text: "Quejarte del rigor del entrenamiento de Urokodaki.",
        tanjiroText: "Bajar la espada por agotamiento.",
        delta: -20,
        reply: "«¡¿Acaso te llamas a ti mismo un hombre?! ¡Nunca te quejes en mitad de un duelo!»",
        tanjiroReply: "«¡Si bajas los brazos aquí, no sobrevivirás en el Monte Fujikasane!»",
        effectSummary: "EFECTO NEGATIVO: Sabito se enfurece ante tu duda y redobla su velocidad (-20 Dominio).",
        tone: "rage",
      },
    ],
  },
];

export const ENCOUNTERS: Record<string, EncounterDef> = {
  nezuko: {
    id: "nezuko",
    name: "Nezuko Kamado (19)",
    title: "Tu prometida — Combate sin armas (Evasión, Abrazos y Recuerdos)",
    look: LOOKS.nezuko,
    color: "#ff9ec4",
    playerHp: 6,
    goal: 100,
    startMeter: 10,
    meterLabel: "Calma y Recuerdos",
    canAttack: true,
    attackEvery: [1.5, 2.4],
    lungeSpeed: 17.5,
    telegraph: 0.72,
    damage: 1,
    parryWindow: 0.22,
    guardBreak: 3,
    counterDmg: 0,
    dodgeCost: 16,
    guardCost: 10,
    wordsEvery: 2,
    wordTime: 7.0,
    comboChainNames: NEZUKO_COMBOS,
    envActions: [
      { label: "Amortiguar en banco de nieve profunda", effectText: "Usas el ventisquero de nieve para frenar su embestida sin lastimarla (+10 Calma).", meterDelta: 10 },
      { label: "Impulsarse en el tronco de pino", effectText: "Rodeas el pino nevado para abrazarla por la espalda y susurrarle su nombre (+12 Calma).", meterDelta: 12 },
    ],
    windows: NEZUKO_WINDOWS,
    intro: ["p0_4"],
    success: "p0_4_calm",
    failure: "Nezuko os supera en fuerza. Cambia con Tanjiro (Tab/C) y usa los combos de abrazo y el entorno para calmarla.",
    dodgeHint: "Estilo Arena: Usa J para encadenar combos de esquive/abrazos/recuerdos, E para usar el entorno nevado y Tab/C para cambiar con Tanjiro.",
  },
  giyu: {
    id: "giyu",
    name: "Tomioka Giyu",
    title: "Pilar del Agua — Prueba de Supervivencia en Equipo",
    look: LOOKS.giyu,
    color: "#9fd6ff",
    playerHp: 5,
    goal: 100,
    startMeter: 0,
    meterLabel: "Determinación",
    canAttack: true,
    attackEvery: [1.0, 1.65],
    lungeSpeed: 23,
    telegraph: 0.52,
    damage: 2,
    parryWindow: 0.16,
    guardBreak: 2,
    counterDmg: 2,
    dodgeCost: 24,
    guardCost: 16,
    wordsEvery: 2,
    wordTime: 6.5,
    comboChainNames: GIYU_COMBOS,
    envActions: [
      { label: "Levantar cortina de nieve entre los árboles", effectText: "Usas la pendiente nevada para romper la línea de visión de Tomioka (+12 Determinación).", meterDelta: 12 },
      { label: "Trampa coordinada entre rocas y pinos", effectText: "Aprovechas los árboles del bosque como cobertura junto a Tanjiro (+14 Determinación).", meterDelta: 14 },
    ],
    windows: GIYU_WINDOWS,
    intro: ["p0_5_arrive"],
    success: "p0_5_stand",
    failure: "La hoja del Pilar del Agua fue más rápida. Alterna con Tanjiro (Tab/C) para repartir el daño y usa el bosque a tu favor.",
    dodgeHint: "Alterna entre {firstName} y Tanjiro (Tab/C), encadena maniobras evasivas (J) y usa los árboles/nieve (E) para sobrevivir.",
  },
  sabito: {
    id: "sabito",
    name: "Sabito (21 años)",
    title: "Prueba Final de Urokodaki — Combate de Espadas en el Claro",
    look: LOOKS.sabito,
    color: "#ffc48a",
    playerHp: 6,
    goal: 100,
    startMeter: 0,
    meterLabel: "Dominio de Combate",
    canAttack: true,
    enemyHp: 10,
    attackEvery: [1.1, 1.9],
    lungeSpeed: 20,
    telegraph: 0.58,
    damage: 1,
    parryWindow: 0.19,
    guardBreak: 4,
    counterDmg: 2,
    dodgeCost: 16,
    guardCost: 10,
    wordsEvery: 3,
    wordTime: 6.5,
    comboChainNames: SABITO_COMBOS,
    envActions: [
      { label: "Salto de impulso sobre la gran roca del claro", effectText: "Te impulsas en la roca sagrada para caer con un tajo descendente (+14 Dominio).", meterDelta: 14 },
      { label: "Redirigir golpe contra los troncos de práctica", effectText: "Desvías el bokken de Sabito contra un poste de entrenamiento (+12 Dominio).", meterDelta: 12 },
    ],
    windows: SABITO_WINDOWS,
    intro: ["c1_sabito"],
    success: "c1_sabito_win",
    failure: "Sabito te derriba. «¡Levántate! ¡Usa el terreno y coordínate con tu cuñado!»",
    dodgeHint: "Combate estilo Arena: Encadena combos de 4 golpes con J, usa las rocas/árboles con E y alterna con Tanjiro (Tab/C).",
  },
};

export const SKIPPABLE_CINEMATICS = new Set([
  "p0_5",
  "c1_1",
  "c1_nezuko_care",
  "c1_descent_done",
  "c1_makomo_support",
  "c1_makomo_motivated",
  "c1_sabito_win",
  "c1_night_care",
]);
