import type { GameLocation, Demon, BreathForm, Ally, StoryNode } from "./types";

// =============== DEMONIOLOGY ===============
export const DEMONS: Record<string, Demon> = {
  demon_ciego: {
    id: "demon_ciego", name: "Demonio Ciego", title: "Acechador de las Sombras",
    hp: 90, maxHp: 90, attack: 22, defense: 8, speed: 24, xpReward: 20, orbReward: 1, tier: "lower",
    dialogue: [
      "«¿Quién anda ahí? Puedo oler tu miedo...»",
      "«Grrr... ¡tus huesos crujirán entre mis dientes!»",
    ],
    deathQuote: "«Imposible... yo que creí ver la luz...»",
  },
  demon_aracnido: {
    id: "demon_aracnido", name: "Demonio Arácnido", title: "Tejedor de Telarañas Venenosas",
    hp: 130, maxHp: 130, attack: 28, defense: 12, speed: 32, xpReward: 35, orbReward: 1, tier: "mid",
    bloodArt: "Hilos de manipulación",
    dialogue: [
      "«¿Otra mosca para mi red?»",
      "«Mi familia siempre está hambrienta...»",
    ],
    deathQuote: "«Las hilos... se rompen...»",
  },
  demon_sangre: {
    id: "demon_sangre", name: "Demonio de Sangre Hirviente", title: "Vástago de la Sangre Impura",
    hp: 170, maxHp: 170, attack: 34, defense: 14, speed: 28, xpReward: 45, orbReward: 2, tier: "mid",
    bloodArt: "Sangre explosiva",
    dialogue: [
      "«¡Arderás desde dentro, cazador!»",
      "«Mi sangre es el infierno mismo...»",
    ],
    deathQuote: "«Mi sangre... se enfría...»",
  },
  demon_campanas: {
    id: "demon_campanas", name: "Demonio de las Campanas", title: "Heraldo del Tañido Fúnebre",
    hp: 150, maxHp: 150, attack: 30, defense: 10, speed: 36, xpReward: 40, orbReward: 2, tier: "mid",
    bloodArt: "Ilusiones acústicas",
    dialogue: [
      "«¿No oyes las campanas? ¿No oyes que tañen por ti?»",
      "«Ding dong... el fin del Cuerpo de Cazadores está cerca...»",
    ],
    deathQuote: "«Las campanas... enmudecen...»",
  },
  demon_bestial: {
    id: "demon_bestial", name: "Demonio Bestial", title: "Colmillo de la Montaña",
    hp: 200, maxHp: 200, attack: 40, defense: 18, speed: 26, xpReward: 60, orbReward: 2, tier: "mid",
    dialogue: [
      "«¡GRRRRRRRAAAAA!»",
      "«¡Carne! ¡Carne fresca!»",
    ],
    deathQuote: "«Aullido... lastimero...»",
  },
  demon_pantano: {
    id: "demon_pantano", name: "Demonio del Pantano", title: "Tres cuerpos bajo el lodo",
    hp: 160, maxHp: 160, attack: 30, defense: 12, speed: 26, xpReward: 50, orbReward: 2, tier: "mid",
    bloodArt: "Fango asfixiante y cuerpos divididos",
    dialogue: [
      "«Las chicas del pueblo son mías. Llegáis tarde, cazadores.»",
      "«Tres bocas, tres brazos... y un solo apetito.»",
    ],
    deathQuote: "«El lodo... me traga a mí también...»",
  },
  kyogai: {
    id: "kyogai", name: "Kyogai", title: "El demonio de los tambores",
    hp: 240, maxHp: 240, attack: 38, defense: 16, speed: 34, xpReward: 90, orbReward: 4, tier: "mid",
    bloodArt: "Tsuzumi: habitaciones giratorias y cortes de aire",
    isBoss: true,
    dialogue: [
      "«¡Mi escritura es perfecta! ¡Nadie puede rechazar mi obra!»",
      "«¡Un tambor por cada dirección! ¡Bailad en mi casa!»",
    ],
    deathQuote: "«Mis manuscritos... ¿alguien los leerá...?»",
  },
  spider_mother: {
    id: "spider_mother", name: "Madre Araña", title: "Tejedora de marionetas",
    hp: 210, maxHp: 210, attack: 32, defense: 14, speed: 30, xpReward: 80, orbReward: 3, tier: "mid",
    bloodArt: "Hilos de control corporal",
    isBoss: true,
    dialogue: [
      "«Rui-sama me obliga... si dejo de mover los dedos, me castiga.»",
      "«Bailad, cazadores. Bailad hasta que se os rompan los huesos.»",
    ],
    deathQuote: "«Gracias... por dejarme descansar...»",
  },
  spider_brother: {
    id: "spider_brother", name: "Hermano Araña", title: "Escupe-veneno de la seda",
    hp: 230, maxHp: 230, attack: 36, defense: 15, speed: 38, xpReward: 95, orbReward: 4, tier: "mid",
    bloodArt: "Rocío venenoso y capullos",
    isBoss: true,
    dialogue: [
      "«Mi veneno te hinchará hasta que no puedas respirar.»",
      "«¡La familia primero! ¡Rui me dio una familia!»",
    ],
    deathQuote: "«Hermana... madre... ¿por qué nadie me ayuda...?»",
  },
  spider_father: {
    id: "spider_father", name: "Padre Araña", title: "El bruto de la ladera",
    hp: 300, maxHp: 300, attack: 44, defense: 20, speed: 22, xpReward: 120, orbReward: 5, tier: "mid",
    bloodArt: "Fuerza bruta y caparazón endurecido",
    isBoss: true,
    dialogue: [
      "«¡GRRRRRRAAAAA!»",
      "«¡Aplastar! ¡Aplastar todo!»",
    ],
    deathQuote: "«...¿Padre... también puede morir...?»",
  },
  // Lower Moon cameos
  rui: {
    id: "rui", name: "Rui", title: "Luna Inferior Cinco",
    hp: 420, maxHp: 420, attack: 48, defense: 22, speed: 42, xpReward: 200, orbReward: 8, tier: "upper",
    bloodArt: "Hilos de acero cortante",
    isBoss: true,
    dialogue: [
      "«Únete a mi familia o muere, cazador.»",
      "«¡Tejeré tus entrañas en mi nueva red!»",
      "«¿Por qué... mi familia no me acepta...?»",
    ],
    deathQuote: "«Yo... solo quería... un vínculo real...»",
  },
  enmu: {
    id: "enmu", name: "Enmu", title: "Luna Inferior Uno",
    hp: 520, maxHp: 520, attack: 52, defense: 20, speed: 48, xpReward: 280, orbReward: 12, tier: "upper",
    bloodArt: "Sueño forzado y pesadillas",
    isBoss: true,
    dialogue: [
      "«¿Quién soy yo? ¿Acaso importa dentro de un sueño?»",
      "«Duerme, duerme... no despertarás jamás...»",
    ],
    deathQuote: "«Qué... pesadilla... tan hermosa...»",
  },
  kaigaku: {
    id: "kaigaku", name: "Kaigaku", title: "El Traidor de los Relámpagos",
    hp: 620, maxHp: 620, attack: 60, defense: 26, speed: 56, xpReward: 380, orbReward: 15, tier: "upper",
    bloodArt: "Respiración del Relámpago corrupta",
    isBoss: true,
    dialogue: [
      "«¿Tú también respiras un estilo derivado? Ríndete, los fuertes sobreviven.»",
      "«Los débiles no merecen ni ser recordados.»",
    ],
    deathQuote: "«¡Kokushibo-sama... me perdonará...! ¡Tiene que!»",
  },
  daki_gyutaro: {
    id: "daki_gyutaro", name: "Daki & Gyutaro", title: "Lunas Superiores Seis",
    hp: 850, maxHp: 850, attack: 72, defense: 32, speed: 58, xpReward: 520, orbReward: 22, tier: "upper",
    bloodArt: "Hojas de sangre guadaña",
    isBoss: true,
    dialogue: [
      "«Onii-chan, este cazador se cree elegante...»",
      "«¡¿Cómo te atreves a tocar a mi hermana?!»",
    ],
    deathQuote: "«Hermanita... vamos... volvamos a nacer juntos...»",
  },
  akaza: {
    id: "akaza", name: "Akaza", title: "Luna Superior Tres",
    hp: 1200, maxHp: 1200, attack: 90, defense: 44, speed: 72, xpReward: 900, orbReward: 40, tier: "upper",
    bloodArt: "Destrucción demoledora",
    isBoss: true,
    dialogue: [
      "«Huelo la voluntad indómita del Pilar de la Niebla... ¿pero tú?»",
      "«¡No te atrevas a mirarme con esos ojos a menos que luches con todo tu ser!»",
    ],
    deathQuote: "«Yukio... Koyuki... ya voy...»",
  },
  kokushibo: {
    id: "kokushibo", name: "Kokushibo", title: "Luna Superior Uno",
    hp: 1800, maxHp: 1800, attack: 120, defense: 60, speed: 90, xpReward: 1500, orbReward: 80, tier: "moon",
    bloodArt: "Respiración de la Luna (corrupta)",
    isBoss: true,
    dialogue: [
      "«Percibo en ti la fragancia de la niebla... curioso derivado del estilo del Viento.»",
      "«Los límites de tu espada... los conoceré ahora mismo.»",
    ],
    deathQuote: "«Yo solo... quería ser como mi hermano... ¡TSUGIKUNI YORIICHI!»",
  },
  muzan: {
    id: "muzan", name: "Muzan Kibutsuji", title: "El Rey Demonio",
    hp: 2800, maxHp: 2800, attack: 140, defense: 80, speed: 95, xpReward: 3000, orbReward: 200, tier: "muzan",
    bloodArt: "Sangre de Muzan: control biológico absoluto",
    isBoss: true,
    dialogue: [
      "«¿Crees que la niebla puede ocultarte de mí? Yo soy la oscuridad absoluta.»",
      "«¿Dónde está el usuario de la Respiración del Sol? ¿Por qué me persiguen sombras sin luz?»",
      "«¡Mueran! ¡Mueran todos los insectos que osan alzar la espada contra el rey!»",
    ],
    deathQuote: "«No... no quiero morir... no quiero desaparecer... ¡Yo soy el ser perfecto!»",
  },
};

// =============== FORMAS DE RESPIRACIÓN (Bruma Plateada = derivado de Niebla) ===============
export const BREATH_FORMS: BreathForm[] = [
  { id: "f1", name: "1ª Postura: Colmillo Suspendido de la Bruma", formNumber: 1, cost: 10, multiplier: 1.0, description: "Tajo rápido y preciso, fácil de encadenar.", effect: "normal" },
  { id: "f2", name: "2ª Postura: Nube Baja de Ocho Capas", formNumber: 2, cost: 18, multiplier: 1.5, description: "Serie de ocho cortes en un abanico horizontal.", effect: "normal" },
  { id: "f3", name: "3ª Postura: Velocidad del Vaho Matutino", formNumber: 3, cost: 22, multiplier: 1.8, description: "Ataque deslizante a alta velocidad. +precisión.", effect: "mist_veil" },
  { id: "f4", name: "4ª Postura: Corte del Resplandor Plateado", formNumber: 4, cost: 28, multiplier: 2.2, description: "Tajo ascendente que refleja la luz, ciega momentáneamente.", effect: "normal" },
  { id: "f5", name: "5ª Postura: Mar de Nubes Densas", formNumber: 5, cost: 32, multiplier: 2.5, description: "Giro en círculo que bloquea proyectiles y golpea a múltiples enemigos.", effect: "normal" },
  { id: "f6", name: "6ª Postura: Luna Difuminada en Niebla", formNumber: 6, cost: 40, multiplier: 3.0, description: "Carga pesada con paso ilusorio. Alta probabilidad de crítico.", effect: "normal" },
  { id: "f7", name: "7ª Postura: Bruma que Borra el Horizonte", formNumber: 7, cost: 55, multiplier: 3.8, description: "Forma definitiva: envuelve al enemigo en niebla imposible de rastrear y asesta un golpe mortal.", effect: "decapitate" },
];

// =============== LOCALIZACIONES (mundo abierto) ===============
export const LOCATIONS: Record<string, GameLocation> = {
  monte_sagiri: {
    id: "monte_sagiri",
    name: "Monte Sagiri",
    description: "Territorio de entrenamiento del Pilar del Agua, Urokodaki Sakonji. Cascadas de agua helada, pinos centenarios y el aire cargado con la humedad de la nube baja. Aquí comenzaste tu camino.",
    banner: "from-emerald-900 via-slate-800 to-slate-900",
    chapterRequired: 0,
    demonPool: ["demon_ciego", "demon_bestial"],
    connections: ["aldea_de_la_wisteria", "asakusa"],
    storyEvents: ["intro_0", "prologo_1", "prologo_2", "despues_agua"],
    shopAvailable: true,
    shrineAvailable: false,
    hashiraPresent: ["giyu_tomioka"],
    ambiance: "El viento trae el sonido lejano de una cascada y el ulular de los cuervos kasugai.",
  },
  aldea_de_la_wisteria: {
    id: "aldea_de_la_wisteria",
    name: "Aldea de la Wisteria",
    description: "Refugio de cazadores. Los linternas de papel cuelgan de los glicinios en flor. Los Hayashi cuidan a los espadachines heridos y la Sede del Cuerpo envía misiones desde aquí.",
    banner: "from-purple-900 via-indigo-900 to-slate-900",
    chapterRequired: 0,
    demonPool: [],
    connections: ["monte_sagiri", "monte_natagumo", "distrito_entretenimiento", "sede_cazadores"],
    storyEvents: ["llegada_aldea", "mision_natagumo"],
    shopAvailable: true,
    shrineAvailable: true,
    ambiance: "Un arroyo cruje bajo un puente de madera y el aroma de las glicinias lo impregna todo. Ningún demonio se atreve a entrar.",
  },
  asakusa: {
    id: "asakusa",
    name: "Asakusa (Barrio de Tokio)",
    description: "La moderna capital iluminada por lámparas de gas. Aquí Muzan camina entre los humanos como uno más, y los rumores de desapariciones corren como pólvora.",
    banner: "from-amber-900 via-red-900 to-slate-900",
    chapterRequired: 2,
    demonPool: ["demon_ciego", "demon_sangre", "demon_campanas"],
    connections: ["monte_sagiri", "tren_mugen"],
    storyEvents: ["asakusa_llegada", "asakusa_muzan", "asakusa_tamayo"],
    shopAvailable: true,
    shrineAvailable: false,
    ambiance: "El ruido de los carruajes y los vendedores ambulantes oculta el siseo de los demonios en los callejones.",
  },
  monte_natagumo: {
    id: "monte_natagumo",
    name: "Monte Natagumo",
    description: "La montaña de la familia araña. El aire espeso con telarañas, los cadáveres de cazadores cuelgan de los árboles como marionetas rotas. El Pilar de los Insectos y el Pilar del Agua están cerca.",
    banner: "from-slate-700 via-slate-900 to-zinc-900",
    chapterRequired: 1,
    demonPool: ["demon_aracnido", "demon_ciego"],
    connections: ["aldea_de_la_wisteria"],
    storyEvents: ["natagumo_entrar", "natagumo_rui", "natagumo_shinobu", "natagumo_final"],
    shopAvailable: false,
    shrineAvailable: false,
    hashiraPresent: ["giyu_tomioka", "shinobu_kocho"],
    ambiance: "El silencio solo es roto por el repicar de hilos de seda y el llanto de los niños atrapados.",
  },
  tren_mugen: {
    id: "tren_mugen",
    name: "Tren Mugen (Locomotora del Infinito)",
    description: "Un tren de vapor que atraviesa la noche a toda velocidad. En su interior, más de 200 pasajeros duermen atrapados en pesadillas tejidas por un demonio de las Lunas Inferiores.",
    banner: "from-rose-900 via-zinc-900 to-black",
    chapterRequired: 3,
    demonPool: ["demon_campanas", "enmu"],
    connections: ["asakusa", "sede_cazadores"],
    storyEvents: ["tren_abordaje", "tren_rengoku", "tren_sueno", "tren_enmu", "tren_akaza_whatif"],
    shopAvailable: false,
    shrineAvailable: false,
    hashiraPresent: ["kyojuro_rengoku"],
    ambiance: "El traqueteo rítmico del tren te adormece. Los pasajeros sonríen dormidos, pero sus sombras se retuercen.",
  },
  distrito_entretenimiento: {
    id: "distrito_entretenimiento",
    name: "Distrito del Entretenimiento (Yoshiwara)",
    description: "Barrio rojo donde las cortesanas sonríen tras los barrotes de madera. Algo más siniestro que la lujuria acecha en los tejados: una Luna Superior que devora humanos por placer.",
    banner: "from-fuchsia-900 via-rose-900 to-slate-900",
    chapterRequired: 4,
    demonPool: ["demon_campanas", "demon_sangre", "daki_gyutaro"],
    connections: ["aldea_de_la_wisteria", "aldea_herradores"],
    storyEvents: ["yoshiwara_llegada", "yoshiwara_tengen", "yoshiwara_daki", "yoshiwara_gyutaro"],
    shopAvailable: true,
    shrineAvailable: false,
    hashiraPresent: ["tengen_uzui"],
    ambiance: "El shamisen y las risas se entremezclan con el olor a incienso y sangre seca.",
  },
  aldea_herradores: {
    id: "aldea_herradores",
    name: "Aldea de los Herradores de Espadas",
    description: "El pueblo escondido de los forjadores de Nichirin. Sus habitantes viven entre el humo de las fraguas y el sonido del martillo sobre el mineral escarlata. Un lugar sagrado.",
    banner: "from-orange-900 via-amber-900 to-zinc-900",
    chapterRequired: 5,
    demonPool: [],
    connections: ["distrito_entretenimiento", "castillo_infinito"],
    storyEvents: ["herradores_llegada", "herradores_muichiro_whatif", "herradores_kotetsu", "herradores_final"],
    shopAvailable: true,
    shrineAvailable: true,
    hashiraPresent: ["muichiro_tokito", "mitsuri_kanroji"],
    ambiance: "Las chispas vuelan al ritmo del metal, y una espesa niebla protectora cubre el valle.",
  },
  sede_cazadores: {
    id: "sede_cazadores",
    name: "Sede del Cuerpo de Cazadores",
    description: "Mansión del Patrimonio Ubuyashiki. Los Pilares se reúnen aquí. El jardín de glicinas rodea la casa del Maestro.",
    banner: "from-indigo-900 via-violet-900 to-slate-900",
    chapterRequired: 2,
    demonPool: [],
    connections: ["aldea_de_la_wisteria", "tren_mugen", "castillo_infinito"],
    storyEvents: ["sede_oyakata-sama", "sede_pilares", "sede_ultima_mision"],
    shopAvailable: true,
    shrineAvailable: true,
    hashiraPresent: ["giyu_tomioka", "shinobu_kocho", "kyojuro_rengoku", "tengen_uzui", "mitsuri_kanroji", "muichiro_tokito", "obanai_iguro", "sanemi_shinazugawa", "gyomei_himejima"],
    ambiance: "Un silencio reverente. El Maestro te sonríe desde el porche, y sus hijos custodian la entrada.",
  },
  castillo_infinito: {
    id: "castillo_infinito",
    name: "Castillo Infinito",
    description: "La dimensión de pesadilla de Muzan. Pasillos que se retuercen, escaleras sin fin, biomas imposibles. Aquí se decidirá el destino del mundo.",
    banner: "from-red-950 via-black to-purple-950",
    chapterRequired: 6,
    demonPool: ["kaigaku", "daki_gyutaro", "akaza", "kokushibo", "muzan"],
    connections: ["sede_cazadores", "aldea_herradores"],
    storyEvents: ["infinito_entrada", "infinito_kaigaku", "infinito_akaza", "infinito_kokushibo", "infinito_muzan", "final_bueno", "final_malo", "final_verdadero"],
    shopAvailable: false,
    shrineAvailable: false,
    ambiance: "El suelo y el techo cambian de sitio. Voces incorpóreas te susurran que abandones toda esperanza.",
  },
};

// =============== ALIADOS / INVOCACIONES (GACHA) ===============
export const ALLIES: Ally[] = [
  // 3★
  { id: "makomo", name: "Makomo", title: "Espíritu del Monte Sagiri", rarity: "3★", hp: 80, attack: 26, defense: 12, speed: 34, passive: "Guía espiritual (+10% XP tras combate)", color: "text-cyan-300", quote: "«Tu espada debe ser ligera como la niebla, fuerte como la montaña.»" },
  { id: "sabito", name: "Sabito", title: "El discípulo más fuerte de Urokodaki", rarity: "3★", hp: 95, attack: 32, defense: 14, speed: 30, passive: "Tajo protector (20% probabilidad de bloquear un golpe mortal)", color: "text-orange-300", quote: "«¡No permitas que nadie te supere en el Monte Sagiri!»" },
  { id: "kanao", name: "Kanao Tsuyuri", title: "Tsuguko del Pilar de los Insectos", rarity: "3★", hp: 100, attack: 34, defense: 15, speed: 38, passive: "Ojo agudo (+15% de probabilidad de crítico)", color: "text-pink-300", quote: "«Si es una orden de Shinobu-sama... lo haré.»" },
  { id: "inosuke", name: "Inosuke Hashibira", title: "Rey de la Montaña", rarity: "3★", hp: 120, attack: 36, defense: 16, speed: 32, passive: "Barrera bestial (Regenera 10 HP por turno)", color: "text-emerald-400", quote: "«¡¡¡GRRRRRRRAAA!!! ¡Nadie le gana al gran Inosuke-sama!»" },
  { id: "zenitsu", name: "Zenitsu Agatsuma", title: "El Relámpago Dormido", rarity: "3★", hp: 85, attack: 40, defense: 10, speed: 44, passive: "Un solo filo (Primer ataque inflige +30% daño)", color: "text-yellow-300", quote: "«¿Por qué yo? ¡¿Por qué siempre tengo que pelear?! ¡Quiero a mi Nezuko-chan!»" },

  // 4★
  { id: "giyu_tomioka", name: "Giyu Tomioka", title: "Pilar del Agua", rarity: "4★", hp: 220, attack: 64, defense: 36, speed: 52, passive: "Respiración del Agua XI: Quietud (reduce daño un 25%)", color: "text-blue-300", quote: "«No bajes la guardia ni un segundo. A partir de este momento, tu vida y la mía están ligadas.»" },
  { id: "shinobu_kocho", name: "Shinobu Kocho", title: "Pilar de los Insectos", rarity: "4★", hp: 170, attack: 54, defense: 28, speed: 60, passive: "Veneno de glicina (envenena al demonio por 3 turnos)", color: "text-purple-300", quote: "«La vida es maravillosa, ¿verdad? Bueno... la vida de los humanos, claro.»" },
  { id: "tengen_uzui", name: "Tengen Uzui", title: "Pilar del Sonido", rarity: "4★", hp: 260, attack: 70, defense: 42, speed: 50, passive: "Estilo flashy (+20% daño a enemigos aturdidos)", color: "text-fuchsia-300", quote: "«Todo lo que haga este Tengen-sama tiene que ser FLASHY.»" },
  { id: "muichiro_tokito", name: "Muichiro Tokito", title: "Pilar de la Niebla", rarity: "4★", hp: 200, attack: 72, defense: 30, speed: 70, passive: "Niebla ofuscante (el enemigo falla 15% de ataques)", color: "text-slate-300", quote: "«Tu Respiración de la Bruma Plateada... es un derivado interesante. Me recuerda a algo... no sé qué.»" },
  { id: "tanjiro", name: "Tanjiro Kamado", title: "Portador de la Hinokami Kagura", rarity: "4★", hp: 230, attack: 66, defense: 34, speed: 54, passive: "Olfato de bondad (revela debilidad demoníaca; +20% daño)", color: "text-orange-400", quote: "¡Mi nariz no se equivoca! Este demonio está sufriendo... lo cortaré con misericordia." },

  // 5★ Leyendas
  { id: "kyojuro_rengoku", name: "Kyojuro Rengoku", title: "Pilar de la Llama (Destino Alternativo)", rarity: "5★", hp: 340, attack: 90, defense: 50, speed: 68, passive: "Corazón de fuego (no puede ser reducido a 0 HP una vez por batalla)", color: "text-red-400", quote: "«¡ARDE ENCENDIDO! ¡Nunca olvides tu promesa, incluso si eso te cuesta la vida!»" },
  { id: "mitsuri_kanroji", name: "Mitsuri Kanroji", title: "Pilar del Amor", rarity: "5★", hp: 320, attack: 84, defense: 54, speed: 60, passive: "Látigo de amor (ataque en área, cura al equipo un 10%)", color: "text-pink-400", quote: "«¡Quiero proteger a todos mis seres queridos con este cuerpo prodigioso que se me ha dado!»" },
  { id: "sanemi_shinazugawa", name: "Sanemi Shinazugawa", title: "Pilar del Viento", rarity: "5★", hp: 300, attack: 96, defense: 40, speed: 74, passive: "Sangre de mareo (los demonios tienen -20% ataque si él está en el equipo)", color: "text-green-300", quote: "«¡¿Que soy un bastardo?! ¡Tú eres el que está de pie frente a mí, pedazo de mierda!»" },
  { id: "gyomei_himejima", name: "Gyomei Himejima", title: "Pilar de la Roca (El más fuerte)", rarity: "5★", hp: 420, attack: 108, defense: 72, speed: 42, passive: "Muro de piedra (reducción de daño 40% para todo el equipo)", color: "text-stone-300", quote: "«Namo Amida Butsu... Namo Amida Butsu... que tus sufrimientos cesen.»" },
  { id: "yoriichi", name: "Yoriichi Tsugikuni", title: "El Espadachín Más Fuerte que Existió Jamás", rarity: "5★", hp: 380, attack: 130, defense: 60, speed: 100, passive: "Respiración del Sol Original (garantiza crítico cada 3 golpes; inflige daño solar inmenso)", color: "text-amber-300", quote: "«Yo solo quería una vida tranquila junto a mi familia... pero el destino me convirtió en una espada.»" },
];

export function getAllyById(id: string): Ally | undefined {
  return ALLIES.find((a) => a.id === id);
}
