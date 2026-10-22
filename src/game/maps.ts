import { border, carve, fill, house, put, rect, scatter } from "./mapgen";
import type { MapDef } from "./types";

/* ------------------------------------------------------------------ */
/* 1. Interior: tu casa en la aldea                                    */
/* ------------------------------------------------------------------ */
function buildCasa(): MapDef {
  const rows = fill(13, 9, "W");
  border(rows, "H", 1);
  rect(rows, 2, 2, 4, 3, "M");
  put(rows, 9, 2, "k");
  put(rows, 10, 5, "p");
  put(rows, 6, 8, "D");
  return {
    id: "casa_ren",
    name: "Casa de la familia {lastName}",
    subtitle: "Aldea del Monte Kumotori · Noche de nieve",
    tint: "rgba(120,150,220,0.10)",
    rows,
    npcs: [],
    warps: [{ x: 6, y: 8, to: "kumotori", toX: 5, toY: 7, label: "Salir a la aldea" }],
    triggers: [{ x: 6, y: 4, nodeId: "p0_1", once: true, label: "Junto al irori" }],
  };
}

/* ------------------------------------------------------------------ */
/* 2. Aldea nevada del Monte Kumotori                                  */
/* ------------------------------------------------------------------ */
function buildKumotori(): MapDef {
  const rows = fill(26, 18, "S");
  border(rows, "P", 2);
  scatter(rows, 7, "s", 0.06, ["S"]);

  const miCasa = house(rows, 3, 3, 6, 4, 2);
  put(rows, miCasa.doorX, miCasa.doorY, "D");
  house(rows, 17, 3, 6, 4, 2);

  carve(rows, [
    [5, 7],
    [5, 12],
    [19, 12],
    [19, 7],
  ]);
  carve(rows, [
    [12, 12],
    [12, 15],
  ]);
  rect(rows, 9, 8, 4, 3, "~");
  for (const [x, y] of [[5, 9], [5, 11], [19, 9], [19, 11], [11, 14], [13, 14]] as [number, number][]) put(rows, x, y, "L");
  put(rows, 12, 15, "x");

  return {
    id: "kumotori",
    name: "Aldea del Monte Kumotori",
    subtitle: "Prólogo · La noche de la nieve roja",
    tint: "rgba(150,180,255,0.12)",
    rows,
    encounters: [],
    npcs: [
      {
        id: "tanjiro_aldea",
        name: "Tanjiro Kamado",
        emoji: "🎴",
        x: 6,
        y: 8,
        nodeId: "p0_2",
        lines: ["«¡Hace un frío terrible! Vamos, la montaña nos espera.»"],
      },
      {
        id: "giyu_aldea",
        name: "Tomioka Giyu",
        emoji: "🌊",
        x: 21,
        y: 7,
        nodeId: "p0_5",
        lines: ["«Entrenad. Los dos. Y no soltéis esa caja.»"],
      },
      {
        id: "saburo",
        name: "Viejo Saburo",
        emoji: "🧓",
        x: 10,
        y: 13,
        lines: [
          "«No subáis la montaña de noche. Nunca de noche.»",
          "«Los demonios son cuentos... hasta que dejan de serlo.»",
        ],
      },
      {
        id: "aldeana",
        name: "Aldeana",
        emoji: "👧",
        x: 14,
        y: 13,
        lines: ["«¿Ya habéis fijado la fecha de la boda? ¡Todo el pueblo apuesta por la primavera!»"],
      },
    ],
    warps: [
      { x: 5, y: 6, to: "casa_ren", toX: 6, toY: 7, label: "Entrar en tu casa" },
      { x: 12, y: 15, to: "sagiri", toX: 14, toY: 2, label: "Camino al Monte Sagiri", requiresChapters: 1 },
    ],
    triggers: [{ x: 19, y: 7, nodeId: "p0_3", once: true, label: "Casa de los Kamado" }],
  };
}

/* ------------------------------------------------------------------ */
/* 3. Monte Sagiri                                                     */
/* ------------------------------------------------------------------ */
function buildSagiri(): MapDef {
  const rows = fill(28, 20, ".");
  border(rows, "T", 2);
  scatter(rows, 11, "T#F", 0.07, ["."]);
  rect(rows, 21, 3, 3, 6, "~");
  rect(rows, 20, 9, 5, 3, "~");

  const hut = house(rows, 5, 6, 6, 5, 2);
  put(rows, hut.doorX, hut.doorY, "D");

  carve(rows, [
    [14, 2],
    [14, 12],
    [7, 12],
  ]);
  carve(rows, [
    [14, 12],
    [24, 12],
    [24, 17],
  ]);
  rect(rows, 3, 15, 5, 3, ",");
  rect(rows, 17, 15, 6, 3, ",");
  put(rows, 24, 17, "x");

  return {
    id: "sagiri",
    name: "Monte Sagiri",
    subtitle: "Capítulo 1 · Dos años de entrenamiento",
    tint: "rgba(140,190,255,0.12)",
    rows,
    encounters: ["demon_ciego", "demon_bestial"],
    encounterRate: 0.16,
    npcs: [
      {
        id: "urokodaki",
        name: "Urokodaki Sakonji",
        emoji: "👺",
        x: 8,
        y: 12,
        nodeId: "c1_1",
        lines: [
          "«Respira. La montaña no tiene prisa, tú sí.»",
          "«Ese filo plateado... algún día lo entenderás.»",
        ],
      },
      {
        id: "makomo",
        name: "Makomo",
        emoji: "🌸",
        x: 5,
        y: 16,
        lines: ["«Tu respiración no fluye: se suspende. Eso también es un estilo.»"],
      },
      {
        id: "sabito",
        name: "Sabito",
        emoji: "🦊",
        x: 20,
        y: 16,
        lines: ["«No dejes que el miedo decida por ti. Yo lo dejé una vez.»"],
      },
    ],
    warps: [
      { x: 7, y: 10, to: "hut_sagiri", toX: 6, toY: 7, label: "Cabaña de Urokodaki" },
      {
        x: 24,
        y: 17,
        to: "fujikasane",
        toX: 12,
        toY: 13,
        label: "Monte Fujikasane · Selección Final",
        requiresAnyNode: ["c1_llave", "c1_silencio"],
      },
    ],
    triggers: [],
  };
}

/* ------------------------------------------------------------------ */
/* 4. Interior: cabaña de Urokodaki                                    */
/* ------------------------------------------------------------------ */
function buildHut(): MapDef {
  const rows = fill(13, 9, "W");
  border(rows, "H", 1);
  rect(rows, 2, 2, 4, 3, "M");
  put(rows, 9, 2, "k");
  put(rows, 10, 5, "p");
  put(rows, 6, 8, "D");
  return {
    id: "hut_sagiri",
    name: "Cabaña de Urokodaki",
    subtitle: "Capítulo 1 · El lazo que no duerme",
    tint: "rgba(255,190,120,0.10)",
    rows,
    npcs: [
      {
        id: "nezuko_caja",
        name: "Caja de madera",
        emoji: "📦",
        x: 3,
        y: 6,
        lines: ["Dentro, alguien respira muy despacio."],
      },
    ],
    warps: [{ x: 6, y: 8, to: "sagiri", toX: 7, toY: 11, label: "Salir al monte" }],
    triggers: [{ x: 4, y: 3, nodeId: "c1_2", once: true, label: "Junto a la caja de Nezuko" }],
  };
}

/* ------------------------------------------------------------------ */
/* 5. Monte Fujikasane — Selección Final                               */
/* ------------------------------------------------------------------ */
function buildFujikasane(): MapDef {
  const rows = fill(24, 16, ".");
  border(rows, "w", 1);
  scatter(rows, 23, "wF#", 0.08, ["."]);
  rect(rows, 4, 4, 6, 4, ",");
  rect(rows, 14, 5, 6, 4, ",");
  carve(rows, [
    [12, 13],
    [12, 7],
  ]);
  put(rows, 12, 14, "x");
  return {
    id: "fujikasane",
    name: "Monte Fujikasane",
    subtitle: "Capítulo 1 · Selección Final (7 días)",
    tint: "rgba(190,150,255,0.14)",
    rows,
    encounters: ["demon_ciego", "demon_aracnido"],
    encounterRate: 0.2,
    npcs: [
      {
        id: "hotaru",
        name: "Hotaru",
        emoji: "🏮",
        x: 11,
        y: 12,
        lines: ["«La glicinia florece para mantener a los demonios dentro. Qué flor tan extraña.»"],
      },
    ],
    warps: [{ x: 12, y: 14, to: "hq_wisteria", toX: 13, toY: 16, label: "Aldea de la Glicinia · Sede", requiresChapters: 2 }],
    triggers: [{ x: 12, y: 7, nodeId: "c1_seleccion", once: true, label: "Corazón del monte" }],
  };
}

/* ------------------------------------------------------------------ */
/* 6. Sede del Cuerpo — Aldea de la Glicinia (nudo de caminos)         */
/* ------------------------------------------------------------------ */
function buildHq(): MapDef {
  const rows = fill(26, 18, "G");
  border(rows, "w", 1);
  scatter(rows, 37, "wF", 0.05, ["G"]);
  rect(rows, 9, 3, 8, 5, "H");
  rect(rows, 9, 3, 8, 1, "R");
  put(rows, 12, 7, "d");
  carve(rows, [
    [13, 16],
    [13, 10],
  ]);
  carve(rows, [
    [13, 10],
    [2, 10],
    [2, 12],
  ]);
  carve(rows, [
    [13, 10],
    [23, 10],
    [23, 12],
  ]);
  carve(rows, [
    [20, 10],
    [20, 3],
  ]);
  put(rows, 2, 12, "x");
  put(rows, 23, 12, "x");
  put(rows, 20, 2, "x");
  put(rows, 2, 9, "x");
  put(rows, 23, 9, "x");
  rect(rows, 5, 14, 4, 2, "F");

  return {
    id: "hq_wisteria",
    name: "Aldea de la Glicinia · Sede",
    subtitle: "Centro de misiones del Cuerpo de Cazadores",
    tint: "rgba(180,150,255,0.12)",
    rows,
    npcs: [
      {
        id: "cuervo",
        name: "Cuervo Kasugai",
        emoji: "🐦‍⬛",
        x: 11,
        y: 11,
        nodeId: "m1_1",
        lines: ["«¡GRAAAC! ¡Consulta el tablón de misiones, cazador!»"],
      },
      {
        id: "aoi",
        name: "Kanzaki Aoi",
        emoji: "👧",
        x: 15,
        y: 11,
        lines: [
          "«Si vuelves herido, pasa por la enfermería. Es una orden, no un favor.»",
          "«Nezuko-san te espera en la sala del ala este. No tardes.»",
        ],
      },
      {
        id: "oyakata",
        name: "Ubuyashiki Kagaya",
        emoji: "🪷",
        x: 12,
        y: 9,
        lines: ["«Mis queridos niños... el amanecer siempre llega para quien no deja de caminar.»"],
      },
      {
        id: "tanjiro_hq",
        name: "Tanjiro Kamado",
        emoji: "🎴",
        x: 14,
        y: 14,
        lines: [
          "«Nezuko está durmiendo, pero movió la caja cuando mencioné tu nombre.»",
          "«Huelo a glicinia... y a que se acerca algo grande.»",
        ],
      },
      {
        id: "kakushi",
        name: "Kakushi",
        emoji: "👤",
        x: 8,
        y: 12,
        lines: ["«Los heridos ya están evacuados. Podéis descansar.»"],
      },
    ],
    warps: [
      { x: 2, y: 12, to: "swamp", toX: 12, toY: 14, label: "Pueblo del noroeste · Pantano", requiresChapters: 2 },
      { x: 23, y: 12, to: "asakusa", toX: 14, toY: 16, label: "Asakusa (Tokio)", requiresChapters: 3 },
      { x: 20, y: 2, to: "hq_garden", toX: 10, toY: 12, label: "Jardín de los Pilares", requiresChapters: 6 },
      { x: 2, y: 9, to: "mugen", toX: 2, toY: 14, label: "Estación del Tren Mugen", requiresChapters: 7 },
      { x: 23, y: 9, to: "castle", toX: 13, toY: 15, label: "Castillo Infinito", requiresChapters: 8 },
    ],
    triggers: [],
  };
}

/* ------------------------------------------------------------------ */
/* 7. Pantano del noroeste                                             */
/* ------------------------------------------------------------------ */
function buildSwamp(): MapDef {
  const rows = fill(24, 16, ".");
  border(rows, "T", 1);
  scatter(rows, 51, "T#F", 0.07, ["."]);
  rect(rows, 8, 2, 9, 5, "~");
  house(rows, 3, 10, 5, 4, 2);
  carve(rows, [
    [12, 14],
    [12, 8],
  ]);
  carve(rows, [
    [12, 9],
    [5, 9],
  ]);
  carve(rows, [
    [12, 9],
    [20, 9],
  ]);
  rect(rows, 16, 11, 5, 3, ",");
  put(rows, 12, 15, "x");
  // Zonas despejadas para los PNJs del pueblo.
  put(rows, 6, 8, ".");
  put(rows, 8, 8, ".");

  return {
    id: "swamp",
    name: "Pantano del noroeste",
    subtitle: "Capítulo 2 · Primera misión oficial",
    tint: "rgba(90,140,120,0.18)",
    rows,
    encounters: ["demon_pantano", "demon_ciego"],
    encounterRate: 0.18,
    npcs: [
      {
        id: "kazumi",
        name: "Kazumi",
        emoji: "🧣",
        x: 6,
        y: 8,
        nodeId: "m1_kazumi",
        lines: ["«Satoko está en casa. Todavía tiembla cuando se apagan las lámparas.»"],
      },
      {
        id: "satoko",
        name: "Satoko",
        emoji: "👧",
        x: 8,
        y: 8,
        lines: ["«Gracias... gracias por no llegar tarde.»"],
      },
    ],
    warps: [{ x: 12, y: 15, to: "hq_wisteria", toX: 2, toY: 11, label: "Volver a la Sede" }],
    triggers: [
      { x: 12, y: 13, nodeId: "m1_arrive", once: true, label: "Entrada del pueblo" },
      { x: 12, y: 8, nodeId: "m1_swamp_entry", once: true, label: "Orilla del pantano", battle: "demon_pantano" },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* 8. Asakusa                                                          */
/* ------------------------------------------------------------------ */
function buildAsakusa(): MapDef {
  const rows = fill(28, 18, "A");
  border(rows, "Q", 1);
  rect(rows, 4, 3, 6, 4, "Q");
  rect(rows, 18, 3, 6, 4, "Q");
  rect(rows, 4, 12, 6, 3, "N");
  rect(rows, 18, 12, 6, 3, "Q");
  scatter(rows, 61, "LN", 0.05, ["A"]);
  carve(rows, [
    [14, 16],
    [14, 2],
  ], "C");
  carve(rows, [
    [1, 9],
    [27, 9],
  ], "C");
  put(rows, 1, 9, "x");
  put(rows, 26, 9, "x");

  return {
    id: "asakusa",
    name: "Asakusa · Tokio",
    subtitle: "Capítulo 3 · El rastro del Rey Demonio",
    tint: "rgba(255,170,90,0.14)",
    rows,
    encounters: ["demon_sangre", "demon_campanas"],
    encounterRate: 0.12,
    npcs: [
      {
        id: "muzan",
        name: "Hombre del sombrero",
        emoji: "🩸",
        x: 16,
        y: 6,
        nodeId: "a1_muzan",
        lines: ["El olor a sangre antigua se desvanece entre la multitud."],
      },
      {
        id: "tamayo",
        name: "Tamayo",
        emoji: "💉",
        x: 8,
        y: 11,
        nodeId: "a1_tamayo",
        lines: ["«Guardad una gota de cada demonio. La ciencia también es un filo.»"],
      },
      {
        id: "yushiro",
        name: "Yushiro",
        emoji: "👦",
        x: 9,
        y: 11,
        lines: ["«No mires a Tamayo-sama más de lo necesario, cazador.»"],
      },
      {
        id: "vendedor",
        name: "Vendedor de ramen",
        emoji: "🍜",
        x: 12,
        y: 10,
        lines: ["«¡Ramen caliente! ¡El mejor de Asakusa! ¿Para el novio y la novia?»"],
      },
      {
        id: "nino",
        name: "Niña con un kimono rojo",
        emoji: "👧",
        x: 20,
        y: 10,
        lines: ["«Mi papá dice que por la noche no se sale. Pero hoy hay fiesta...»"],
      },
    ],
    warps: [
      { x: 1, y: 9, to: "hq_wisteria", toX: 23, toY: 11, label: "Volver a la Sede" },
      { x: 26, y: 9, to: "mansion", toX: 10, toY: 12, label: "Mansión de los Tambores", requiresAnyNode: ["a1_order"] },
    ],
    triggers: [{ x: 14, y: 15, nodeId: "a1_1", once: true, label: "Avenida iluminada" }],
  };
}

/* ------------------------------------------------------------------ */
/* 9. Mansión de los Tambores                                          */
/* ------------------------------------------------------------------ */
function buildMansion(): MapDef {
  const rows = fill(20, 14, "W");
  border(rows, "H", 1);
  ring2(rows, 5, 2, 10, 7);
  put(rows, 10, 8, "W");
  put(rows, 10, 13, "D");
  put(rows, 19, 7, "x");
  scatter(rows, 71, "M", 0.12, ["W"]);

  return {
    id: "mansion",
    name: "Mansión Tsuzumi",
    subtitle: "Capítulo 4 · La casa que gira",
    tint: "rgba(120,90,160,0.16)",
    rows,
    npcs: [
      {
        id: "zenitsu",
        name: "Zenitsu Agatsuma",
        emoji: "⚡",
        x: 8,
        y: 6,
        nodeId: "d1_zenitsu",
        lines: [
          "«¡Nezuko-san y yo somos amigos! ¡AMIGOS! ¡Tú solo eres su prometido, nada importante!»",
          "«Si muriera aquí, quiero que conste que morí siendo guapo.»",
        ],
      },
      {
        id: "inosuke",
        name: "Inosuke Hashibira",
        emoji: "🐗",
        x: 12,
        y: 6,
        lines: ["«¡PELEA CONMIGO, SEÑOR DE LOS ANILLOS! ¡El gran Inosuke-sama te reta!»"],
      },
      {
        id: "teruko",
        name: "Teruko",
        emoji: "👧",
        x: 7,
        y: 4,
        lines: ["«Mi hermano está dentro... por favor, sacadlo.»"],
      },
      {
        id: "shoichi",
        name: "Shoichi",
        emoji: "👦",
        x: 13,
        y: 4,
        lines: ["«¡La casa se mueve cuando suena el tambor!»"],
      },
    ],
    warps: [
      { x: 10, y: 13, to: "asakusa", toX: 25, toY: 9, label: "Volver a Asakusa" },
      { x: 19, y: 7, to: "natagumo", toX: 14, toY: 17, label: "Monte Natagumo", requiresChapters: 4 },
    ],
    triggers: [
      { x: 10, y: 12, nodeId: "d1_1", once: true, label: "Vestíbulo de la mansión" },
      { x: 10, y: 5, nodeId: "d1_phase1", once: true, label: "Sala del tambor", battle: "kyogai" },
    ],
  };
}

function ring2(rows: string[], x: number, y: number, w: number, h: number) {
  for (let i = 0; i < w; i++) {
    put(rows, x + i, y, "Y");
    put(rows, x + i, y + h - 1, "Y");
  }
  for (let j = 0; j < h; j++) {
    put(rows, x, y + j, "Y");
    put(rows, x + w - 1, y + j, "Y");
  }
}

/* ------------------------------------------------------------------ */
/* 10. Monte Natagumo                                                  */
/* ------------------------------------------------------------------ */
function buildNatagumo(): MapDef {
  const rows = fill(28, 20, ".");
  border(rows, "T", 2);
  scatter(rows, 31, "n#T", 0.14, ["."]);
  rect(rows, 11, 5, 7, 5, "n");
  carve(rows, [
    [14, 17],
    [14, 12],
  ]);
  carve(rows, [
    [14, 12],
    [6, 10],
  ]);
  carve(rows, [
    [14, 12],
    [22, 8],
  ]);
  carve(rows, [
    [14, 12],
    [22, 15],
  ]);
  carve(rows, [
    [14, 12],
    [14, 7],
  ]);
  put(rows, 14, 18, "x");
  rect(rows, 3, 14, 4, 3, ",");
  rect(rows, 20, 3, 4, 3, ",");

  return {
    id: "natagumo",
    name: "Monte Natagumo",
    subtitle: "Capítulo 5 · La familia de los hilos",
    tint: "rgba(60,90,80,0.28)",
    rows,
    encounters: ["demon_aracnido", "demon_bestial"],
    encounterRate: 0.22,
    npcs: [
      {
        id: "tanjiro_nata",
        name: "Tanjiro Kamado",
        emoji: "🎴",
        x: 13,
        y: 11,
        lines: ["«Los hilos huelen a tristeza. Esta familia nunca fue una familia.»"],
      },
      {
        id: "nezuko_nata",
        name: "Nezuko Kamado",
        emoji: "🌸",
        x: 15,
        y: 11,
        lines: ["Mmmph... (Nezuko aprieta tu manga y señala la telaraña del centro.)"],
      },
      {
        id: "zenitsu_nata",
        name: "Zenitsu Agatsuma",
        emoji: "⚡",
        x: 13,
        y: 13,
        lines: ["«¡Yo vigilo la retaguardia! ¡La retaguardia es importantísima! ¡No lloro!»"],
      },
      {
        id: "inosuke_nata",
        name: "Inosuke Hashibira",
        emoji: "🐗",
        x: 15,
        y: 13,
        lines: ["«¡Al monte se le gana a golpes! ¡Vamos, rival amoroso!»"],
      },
      {
        id: "shinobu_nata",
        name: "Shinobu Kocho",
        emoji: "🦋",
        x: 12,
        y: 16,
        nodeId: "c2_shinobu",
        lines: ["«Ara ara~. Procurad no morir antes de la boda.»"],
      },
      {
        id: "giyu_nata",
        name: "Tomioka Giyu",
        emoji: "🌊",
        x: 16,
        y: 16,
        lines: ["«...No está mal. Para ser un Mizunoto.»"],
      },
    ],
    warps: [{ x: 14, y: 18, to: "hq_wisteria", toX: 13, toY: 15, label: "Volver a la Sede" }],
    triggers: [
      { x: 14, y: 16, nodeId: "c2_1", once: true, label: "Ladera de seda" },
      { x: 6, y: 10, nodeId: "c2_mother_start", once: true, label: "Madre Araña", battle: "spider_mother" },
      { x: 22, y: 8, nodeId: "c2_brother_start", once: true, label: "Hermano Araña", battle: "spider_brother" },
      { x: 22, y: 15, nodeId: "c2_father_start", once: true, label: "Padre Araña", battle: "spider_father" },
      { x: 14, y: 7, nodeId: "c2_2", once: true, label: "Telaraña central · Rui", battle: "rui" },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* 11. Jardín de los Pilares (el juicio)                               */
/* ------------------------------------------------------------------ */
function buildGarden(): MapDef {
  const rows = fill(20, 14, "G");
  border(rows, "Y", 1);
  rect(rows, 3, 3, 4, 3, "~");
  rect(rows, 14, 10, 4, 2, "F");
  scatter(rows, 83, "wO", 0.05, ["G"]);
  carve(rows, [
    [10, 12],
    [10, 6],
  ]);
  put(rows, 10, 13, "x");

  return {
    id: "hq_garden",
    name: "Jardín del Patrimonio Ubuyashiki",
    subtitle: "Capítulo 6 · El juicio de los Nueve Pilares",
    tint: "rgba(255,230,180,0.12)",
    rows,
    npcs: [
      { id: "sanemi", name: "Sanemi Shinazugawa", emoji: "🌪️", x: 8, y: 5, lines: ["«Un demonio aliado... me da asco. Y un novato con anillo, más.»"] },
      { id: "giyu_garden", name: "Tomioka Giyu", emoji: "🌊", x: 12, y: 5, lines: ["«...Yo la traje hasta aquí. Respondo por ella.»"] },
      { id: "rengoku_garden", name: "Kyojuro Rengoku", emoji: "🔥", x: 13, y: 7, lines: ["«¡APRUEBO ESTA BODA! ¡Y LA CUSTODIARÉ!»"] },
      { id: "shinobu_garden", name: "Shinobu Kocho", emoji: "🦋", x: 7, y: 7, lines: ["«Si muerde a alguien, tendré que matarla. Espero que no ocurra.»"] },
      { id: "muichiro", name: "Muichiro Tokito", emoji: "🌫️", x: 14, y: 9, lines: ["«Ese plateado... ¿éramos familia? Creo que sí. Creo...»"] },
      { id: "mitsuri", name: "Mitsuri Kanroji", emoji: "🍡", x: 6, y: 9, lines: ["«¡Una boda! ¡Qué emoción! ¿Puedo llevar el ramo? ¿Puedo?»"] },
      { id: "gyomei", name: "Gyomei Himejima", emoji: "🪨", x: 9, y: 3, lines: ["«Namo Amida Butsu... qué niños tan valientes.»"] },
      { id: "obanai", name: "Obanai Iguro", emoji: "🐍", x: 11, y: 3, lines: ["«Si el Maestro lo permite, yo no opino. Pero os vigilaré.»"] },
      { id: "tengen", name: "Tengen Uzui", emoji: "💎", x: 10, y: 8, lines: ["«Una boda sin tres esposas es poco flashy, pero aceptable.»"] },
      { id: "kagaya_garden", name: "Ubuyashiki Kagaya", emoji: "🪷", x: 10, y: 4, lines: ["«Mis queridos niños... el juicio comienza cuando estéis listos.»"] },
    ],
    warps: [{ x: 10, y: 13, to: "hq_wisteria", toX: 20, toY: 3, label: "Volver a la Sede" }],
    triggers: [{ x: 10, y: 6, nodeId: "c3_1", once: true, label: "Centro del jardín" }],
  };
}

/* ------------------------------------------------------------------ */
/* 12. Estación y Tren Mugen                                           */
/* ------------------------------------------------------------------ */
function buildMugen(): MapDef {
  const rows = fill(26, 16, ".");
  border(rows, "T", 2);
  scatter(rows, 91, "T#", 0.06, ["."]);
  rect(rows, 2, 8, 22, 1, "r");
  rect(rows, 5, 4, 16, 3, "E");
  rect(rows, 4, 7, 18, 1, "I");
  // Pasos a nivel para subir al andén del tren.
  put(rows, 6, 8, "I");
  put(rows, 20, 8, "I");
  put(rows, 6, 9, "I");
  put(rows, 20, 9, "I");
  carve(rows, [
    [2, 14],
    [24, 14],
  ]);
  put(rows, 1, 14, "x");
  put(rows, 24, 14, "x");
  rect(rows, 8, 11, 8, 3, ",");

  return {
    id: "mugen",
    name: "Estación del Tren Mugen",
    subtitle: "Capítulo 7 · Sueños robados y amanecer",
    tint: "rgba(70,80,160,0.22)",
    rows,
    encounters: ["demon_campanas", "demon_sangre"],
    encounterRate: 0.14,
    npcs: [
      { id: "rengoku", name: "Kyojuro Rengoku", emoji: "🔥", x: 8, y: 7, nodeId: "c4_1", lines: ["«¡¡UMAAAI!! ¡Come algo antes del combate, muchacho!»"] },
      { id: "tanjiro_mugen", name: "Tanjiro Kamado", emoji: "🎴", x: 10, y: 10, lines: ["«Este tren huele a sueño... y a sangre vieja.»"] },
      { id: "nezuko_mugen", name: "Nezuko Kamado", emoji: "🌸", x: 9, y: 10, lines: ["Mmmph... (Nezuko mira el tren con el ceño fruncido.)"] },
      { id: "zenitsu_mugen", name: "Zenitsu Agatsuma", emoji: "⚡", x: 11, y: 11, lines: ["«¡No pienso subir! ¡Subid vosotros! ¡Yo vigilo el andén! ...Vale, subo.»"] },
      { id: "inosuke_mugen", name: "Inosuke Hashibira", emoji: "🐗", x: 12, y: 10, lines: ["«¡EL TREN ES UNA BESTIA! ¡VOY A PELEAR CON ÉL!»"] },
      { id: "akaza", name: "Akaza", emoji: "👹", x: 20, y: 10, nodeId: "c4_akaza", battle: "akaza", lines: ["«Conviértete en demonio. O muere siendo débil.»"] },
    ],
    warps: [
      { x: 1, y: 14, to: "hq_wisteria", toX: 3, toY: 9, label: "Volver a la Sede" },
      { x: 24, y: 14, to: "castle", toX: 13, toY: 15, label: "Castillo Infinito", requiresChapters: 8 },
    ],
    triggers: [{ x: 12, y: 7, nodeId: "c4_2", once: true, label: "Asiento del vagón", battle: "enmu" }],
  };
}

/* ------------------------------------------------------------------ */
/* 13. Castillo Infinito                                               */
/* ------------------------------------------------------------------ */
function buildCastle(): MapDef {
  const rows = fill(26, 18, "V");
  border(rows, "v", 2);
  scatter(rows, 41, "vb", 0.09, ["V"]);
  carve(rows, [
    [13, 16],
    [13, 4],
  ], "V");
  rect(rows, 6, 6, 3, 3, "v");
  rect(rows, 17, 6, 3, 3, "v");
  put(rows, 13, 16, "x");
  // El castillo se reconstruye solo: despeja el suelo donde esperan los aliados.
  for (const [x, y] of [[6, 14], [12, 6], [14, 9], [15, 7], [11, 7], [13, 4], [13, 11], [13, 15]] as [number, number][]) {
    put(rows, x, y, "V");
  }

  return {
    id: "castle",
    name: "Castillo Infinito",
    subtitle: "Capítulo 8 · El amanecer definitivo",
    tint: "rgba(150,40,80,0.25)",
    rows,
    encounters: ["demon_sangre", "kaigaku"],
    encounterRate: 0.2,
    npcs: [
      { id: "tamayo_castle", name: "Tamayo", emoji: "💉", x: 6, y: 14, nodeId: "c5_1", lines: ["«La cura está lista. La decisión es de ella.»"] },
      { id: "nezuko_castle", name: "Nezuko Kamado", emoji: "🌸", x: 12, y: 6, lines: ["Mmmph... (Sus ojos rosados no se apartan de ti.)"] },
      { id: "tanjiro_castle", name: "Tanjiro Kamado", emoji: "🎴", x: 14, y: 9, lines: ["«Hasta el final. Contigo.»"] },
      { id: "rengoku_castle", name: "Kyojuro Rengoku", emoji: "🔥", x: 15, y: 7, lines: ["«¡ARDE ENCENDIDO! ¡HOY NO MUERE NADIE!»"] },
      { id: "muichiro_castle", name: "Muichiro Tokito", emoji: "🌫️", x: 11, y: 7, lines: ["«Primo... cubre mi flanco. Recuerdo todo.»"] },
      { id: "muzan", name: "Muzan Kibutsuji", emoji: "🩸", x: 13, y: 4, nodeId: "c5_muzan", battle: "muzan", lines: ["«Insectos. Todos vosotros.»"] },
    ],
    warps: [{ x: 13, y: 16, to: "hq_wisteria", toX: 22, toY: 9, label: "Salir del castillo" }],
    triggers: [{ x: 13, y: 11, nodeId: "c5_castillo", once: true, label: "Sala de los pasillos imposibles" }],
  };
}

const BUILT: MapDef[] = [
  buildCasa(),
  buildKumotori(),
  buildSagiri(),
  buildHut(),
  buildFujikasane(),
  buildHq(),
  buildSwamp(),
  buildAsakusa(),
  buildMansion(),
  buildNatagumo(),
  buildGarden(),
  buildMugen(),
  buildCastle(),
];

export const MAPS: Record<string, MapDef> = Object.fromEntries(BUILT.map((m) => [m.id, m]));

export const START = { mapId: "casa_ren", x: 6, y: 6 };

/**
 * Nodos donde la conversación se interrumpe a propósito: la escena siguiente
 * ocurre en otro lugar del mundo y el jugador debe caminar hasta allí.
 */
export const STORY_BREAKS = new Set<string>([
  "p0_2",
  "p0_3",
  "p0_3b",
  "p0_5",
  "c1_2",
  "c1_seleccion",
  "m1_1",
  "m1_arrive",
  "m1_kazumi",
  "m1_swamp_entry",
  "a1_1",
  "a1_muzan",
  "a1_tamayo",
  "d1_1",
  "d1_zenitsu",
  "d1_phase1",
  "c2_1",
  "c2_mother_start",
  "c2_brother_start",
  "c2_father_start",
  "c2_2",
  "c2_shinobu",
  "c3_1",
  "c4_1",
  "c4_2",
  "c4_akaza",
  "c5_1",
  "c5_castillo",
  "c5_muzan",
]);
