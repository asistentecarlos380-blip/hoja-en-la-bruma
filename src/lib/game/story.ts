import type { StoryNode } from "./types";

// =============== HISTORIA "WHAT IF" - HOJAS EN LA BRUMA ===============
// Divergencia: Shinjo Ren es un cazador con la Respiración de la Bruma Plateada (derivada
// propia, emparentada con la de Muichiro Tokito). En esta línea temporal, Ren
// entrelaza su destino con el de Tanjiro y compañía en momentos cruciales, alterando
// muertes canónicas y desembocando en un final donde la bruma plateada es clave
// contra Muzan.

export const STORY_NODES: Record<string, StoryNode> = {
  // ============ PRÓLOGO: MONTE SAGIRI ============
  intro_0: {
    id: "intro_0",
    chapter: 0,
    location: "monte_sagiri",
    speaker: "??",
    speakerColor: "text-amber-300",
    text: [
      "— La niebla se enrolla entre los pinos del Monte Sagiri como un ser vivo.",
      "— Desde hace dos años entrenas aquí, bajo la tutela indirecta de Urokodaki Sakonji.",
      "— Tu estilo no es la Respiración del Agua. Es algo propio, que has ido puliendo solo en la bruma: la Respiración de la Bruma Plateada.",
      "— Hoy, sin embargo, alguien ha venido a verte.",
    ],
    next: "prologo_1",
  },
  prologo_1: {
    id: "prologo_1",
    chapter: 0,
    location: "monte_sagiri",
    speaker: "Tomioka Giyu",
    speakerColor: "text-blue-300",
    text: [
      "«...Eres Shinjo Ren, ¿verdad? Urokodaki-san me habló de ti.»",
      "«Esta mañana he traído a dos hermanos: Kamado Tanjiro y su hermana Nezuko, que ahora es... un demonio. Pero no ataca a los humanos.»",
      "«No me has oído decir eso. Te recojo porque el Cuerpo te reclama. Hay misiones urgentes. Te espera una Mizunoe en la Aldea de las Wisterias.»",
      "«No dejes que la bruma te nuble el juicio. ¿Entendido?»",
    ],
    choices: [
      { text: "«Entendido, Tomioka-san. Seré digno de la confianza.»", next: "prologo_2", flag: "giyu_impressed", flagValue: true },
      { text: "«...Sí. Voy.» (asientes con frialdad)", next: "prologo_2" },
    ],
  },
  prologo_2: {
    id: "prologo_2",
    chapter: 0,
    location: "monte_sagiri",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— Giyu te entrega tu primera katana Nichirin y un uniforme oficial de Mizunoto.",
      "— Cuando tu mano toca la hoja, la hoja se vuelve de un plateado pálido —como la luna llena entre la niebla.",
      "— El cuervo kasugai grazna sobre tu hombro, llamándote por tu nombre.",
      "— Comienza la historia que nadie volverá a contar del mismo modo.",
    ],
    next: "llegada_aldea",
    reward: { xp: 20, orbs: 3, item: "Nichirin Plateada Inicial", maxHp: 20, attack: 5 },
  },
  llegada_aldea: {
    id: "llegada_aldea",
    chapter: 1,
    location: "aldea_de_la_wisteria",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— Atravesando el sendero de glicinias, llegas al pueblo donde los cazadores se curan y reúnen.",
      "— Las linternas de papel se balancean con el viento. El aire huele a arroz con umeboshi y a hierbas medicinales.",
      "— Una joven con el haori mariposa te sonríe desde un porche.",
    ],
    next: "mision_natagumo",
  },
  mision_natagumo: {
    id: "mision_natagumo",
    chapter: 1,
    location: "aldea_de_la_wisteria",
    speaker: "Kanzaki Aoi",
    speakerColor: "text-cyan-300",
    text: [
      "«¡Otro cazador recién llegado! Por favor —necesitamos refuerzos en el Monte Natagumo. Se han perdido contacto con diez equipos.»",
      "«Según informan, hay una familia de demonios arácnidos. Ten cuidado: hay un miembro de las Lunas Inferiores entre ellos.»",
      "«Ah... y otra cosa: el chico nuevo, Kamado Tanjiro, también va para allá. Si lo ves, por favor... no le dejes morir.»",
    ],
    choices: [
      { text: "«Iré al Natagumo ahora mismo.»", next: "natagumo_entrar" },
    ],
  },

  // ============ CAPÍTULO 1: MONTE NATAGUMO (WHAT IF) ============
  natagumo_entrar: {
    id: "natagumo_entrar",
    chapter: 1,
    location: "monte_natagumo",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— El Monte Natagumo está cubierto por una telaraña húmeda y fría.",
      "— Los cadáveres de cazadores cuelgan de los árboles como marionetas. Escuchas gritos a lo lejos.",
      "— Entre la bruma del bosque, ves a un chico de pelo rojo con una katana negra forcejeando contra un demonio que le lanza hilos cortantes.",
      "— El demonio lleva una piel de araña como capa. Sus ojos son placas óseas. Es Rui, la Luna Inferior Cinco.",
    ],
    next: "natagumo_rui",
  },
  natagumo_rui: {
    id: "natagumo_rui",
    chapter: 1,
    location: "monte_natagumo",
    speaker: "Rui",
    speakerColor: "text-red-300",
    text: [
      "«Otro cazador... ¿vienes a romper a mi familia?»",
      "«¿Quieres ser mi nuevo hermano? Tejeré tus huesos con hilos de acero, y así nunca más te sentirás solo.»",
      "«Pero si te niegas... te despedazaré con mi técnica de Demoníaca Sangre de los Hilos Cortantes.»",
    ],
    choices: [
      { text: "«No necesito una familia hecha de mentiras. Voy a detenerte.» (Entrar en combate con Rui)", next: "natagumo_combate", bossFight: "rui" },
    ],
  },
  natagumo_combate: {
    id: "natagumo_combate",
    chapter: 1,
    location: "monte_natagumo",
    speaker: "Sistema",
    text: [
      "— ¡Rui te ataca con hilos de acero! Usa tus formas de respiración para sobrevivir.",
      "— Tras el combate, la historia continuará...",
    ],
    next: "natagumo_shinobu",
  },
  natagumo_shinobu: {
    id: "natagumo_shinobu",
    chapter: 1,
    location: "monte_natagumo",
    speaker: "Shinobu Kocho",
    speakerColor: "text-purple-300",
    text: [
      "«Vaya, vaya... lo has derrotado tú solo. Impresionante, Shinjo-kun. Tu respiración es... curiosa. ¿Niebla? ¿Pero con un matiz plateado?»",
      "«Ah, Tomioka-san ha llegado justo detrás de mí, y también Tanjiro-kun está a salvo. Qué día tan ocupado.»",
      "«Venid a la aldea. El Maestro querrá saber que habéis sobrevivido. Y también...»",
      "«...hay algo extraño en la niebla de esta montaña. Olía a algo más que a demonio. Como si alguien más estuviera observando.»",
    ],
    next: "natagumo_final",
    reward: { xp: 80, orbs: 5, unlockForm: 4 },
  },
  natagumo_final: {
    id: "natagumo_final",
    chapter: 2,
    location: "aldea_de_la_wisteria",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— De vuelta en la aldea, tu cuervo kasugai te entrega un pergamino lacrado con el emblema del glicinia.",
      "— Es una citación directa del Maestro Ubuyashiki, en la Sede del Cuerpo.",
      "— Una reunión de Pilares. Y tú eres uno de los invitados.",
    ],
    next: "sede_oyakata-sama",
  },

  // ============ CAPÍTULO 2: SEDE - OYAKATA-SAMA ============
  sede_oyakata_sama: {
    id: "sede_oyakata-sama",
    chapter: 2,
    location: "sede_cazadores",
    speaker: "Ubuyashiki Kagaya",
    speakerColor: "text-amber-200",
    text: [
      "«Shinjo Ren. Qué alegría que hayas venido.»",
      "«Tu estilo de la Bruma Plateada es un derivado poco común... ¿Sabes que procede, en última instancia, de la Respiración de la Niebla, que es lo mismo que de la Luna?»",
      "«Eso hace que tu hoja sea una especie de pariente lejano de la Primera Respiración. Algo que Muzan Kibutsuji teme especialmente, incluso sin saberlo.»",
      "«Los Pilares y yo queremos que vayas a Asakusa. Hay rumores de que Muzan ha sido visto caminando entre los humanos. Ten mucho cuidado.»",
    ],
    next: "sede_pilares",
  },
  sede_pilares: {
    id: "sede_pilares",
    chapter: 2,
    location: "sede_cazadores",
    speaker: "Muichiro Tokito",
    speakerColor: "text-slate-300",
    text: [
      "— El Pilar de la Niebla te observa desde un pilar del jardín con expresión ausente. —",
      "«Hmm... Bruma Plateada... ¿Es una rama que salió de mi estilo? No recuerdo... hace poco que he despertado...»",
      "«Ten cuidado en Asakusa. La ciudad es grande. Si te pierdes, la niebla no te salvará. Bueno... tal vez sí lo haga. Adiós.»",
    ],
    choices: [
      { text: "«Lo tendré en cuenta, Tokito-sama. Espero que volvamos a encontrarnos.»", next: "asakusa_llegada", flag: "muichiro_bond", flagValue: 1 },
    ],
  },

  // ============ CAPÍTULO 3: ASAKUSA - ENCUENTRO CON MUZAN (WHAT IF: Ren lo ve de frente) ============
  asakusa_llegada: {
    id: "asakusa_llegada",
    chapter: 2,
    location: "asakusa",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— Asakusa bulle con el ruido de carruajes y vendedores de ramen. Las farolas de gas tiñen las calles de ámbar.",
      "— Tu cuervo grazna: «Busca al demonio vestido de occidental. No lo ataques sin refuerzos.»",
      "— Pero entre la multitud, una figura de traje negro y sombrero de copa se detiene. Te mira directamente.",
      "— Sientes como si la sangre se te helara: es Muzan Kibutsuji.",
    ],
    next: "asakusa_muzan",
  },
  asakusa_muzan: {
    id: "asakusa_muzan",
    chapter: 2,
    location: "asakusa",
    speaker: "Muzan Kibutsuji",
    speakerColor: "text-red-500",
    text: [
      "«...Qué mirada tan odiosa. Te pareces a alguien que maté hace mucho tiempo.»",
      "«¿Respiración de la Niebla? No... algo diferente. Plateada. Los ojos de Muzan se entrecierran.»",
      "«Ahora mismo no puedo mancharme las manos. Hay demasiados testigos. Pero te enviaré a uno de mis hijos... uno de los Doce Kizuki.»",
      "«Recibirás noticias mías pronto, cazador. Que tengas una noche agradable.»",
      "— Muzan se gira y desaparece entre la multitud, pero señala con un dedo a un hombre pálido de pelo negro en una esquina. Enmu, Luna Inferior Uno, le hace una reverencia.",
    ],
    next: "asakusa_tamayo",
  },
  asakusa_tamayo: {
    id: "asakusa_tamayo",
    chapter: 2,
    location: "asakusa",
    speaker: "Tamayo",
    speakerColor: "text-pink-300",
    text: [
      "— Una mujer de cabello recogido te hace una seña desde una callejuela. Es Tamayo, la demonio rebelde aliada de Tanjiro. —",
      "«Shinjo Ren... he oído hablar de ti. Muzan ha ordenado tu muerte y la de todos los que lleváis la hoja Nichirin derivada de la luna o el sol.»",
      "«La Luna Inferior Uno, Enmu, planea atacar un tren de pasajeros esta noche. Se hace llamar 'Tren Mugen'. Por favor... ve. Allí hay un Pilar.»",
      "«Si muere, la moral del Cuerpo caerá. Que la fortuna te acompañe.»",
    ],
    next: "tren_abordaje",
    reward: { xp: 60, orbs: 4 },
  },

  // ============ CAPÍTULO 3: TREN MUGEN - WHAT IF: Ren llega antes de que Akaza mate a Rengoku ============
  tren_abordaje: {
    id: "tren_abordaje",
    chapter: 3,
    location: "tren_mugen",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— Subes al Tren Mugen justo cuando el silbato anuncia la salida.",
      "— Dentro, un samurai de pelo llameante y sonrisa feroz devora once cuencos de udón de un solo tirón. Es Kyojuro Rengoku, el Pilar de la Llama.",
    ],
    next: "tren_rengoku",
  },
  tren_rengoku: {
    id: "tren_rengoku",
    chapter: 3,
    location: "tren_mugen",
    speaker: "Kyojuro Rengoku",
    speakerColor: "text-red-400",
    text: [
      "«¡¡UMEEEEEE!! ¡Qué sabor! ¿Quién eres, jovencito? ¿Un cazador? ¡Perfecto!»",
      "«¡Soy Kyojuro Rengoku, el Pilar de la Llama! ¡Come conmigo! ¡La Llama arde con más fuerza con el estómago lleno!»",
      "«Hay un demonio en este tren, dicen. ¡Protegeré a los 200 pasajeros con mi vida! ¡Y también a ti! ¡GHAHAHA!»",
      "— El tren arranca con un chirrido. Por la ventanilla ves cómo una niebla espesa se arremolina sobre las vías. No es niebla normal.",
    ],
    next: "tren_sueno",
  },
  tren_sueno: {
    id: "tren_sueno",
    chapter: 3,
    location: "tren_mugen",
    speaker: "Enmu",
    speakerColor: "text-indigo-300",
    text: [
      "— Una voz susurra en tus oídos. —",
      "«Bienvenidos... al Tren Mugen. Pobres diablillos... he puesto a todos los pasajeros a dormir. Vuestros sueños son míos.»",
      "«Morid sin despertar, por favor. No queremos molestar a Muzan-sama con ruidos innecesarios.»",
    ],
    next: "tren_enmu",
  },
  tren_enmu: {
    id: "tren_enmu",
    chapter: 3,
    location: "tren_mugen",
    speaker: "Sistema",
    text: [
      "— ¡Enmu ha fusionado su cuerpo con el tren! Tienes que luchar contra él.",
    ],
    choices: [
      { text: "¡Combatir a Enmu junto a Rengoku!", next: "tren_post_enmu", bossFight: "enmu" },
    ],
  },
  tren_post_enmu: {
    id: "tren_post_enmu",
    chapter: 3,
    location: "tren_mugen",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— Enmu cae atravesado por las llamas de Rengoku y tu tajo plateado. El tren descarrila en un bosque.",
      "— Los pasajeros sobreviven, pero Rengoku sangra por las heridas. Está débil. Y entonces, entre los árboles aparece una figura pálida de tatuajes rojos: Akaza, Luna Superior Tres.",
      "— En la línea temporal original, esta es la pelea en la que Rengoku muere. Pero aquí, ahora, TÚ ESTÁS.",
    ],
    next: "tren_akaza_whatif",
    reward: { xp: 100, orbs: 6 },
  },
  tren_akaza_whatif: {
    id: "tren_akaza_whatif",
    chapter: 3,
    location: "tren_mugen",
    speaker: "Akaza",
    speakerColor: "text-pink-400",
    text: [
      "«Vaya. El Pilar de la Llama... está débil. Pero tú —te señala con el dedo— hueles a niebla y a luz solar a la vez.»",
      "«No quiero pelear con dos personas cuando una está a medias... pero Muzan-sama me ha ordenado matar al de la hoja plateada. Así que será rápido.»",
      "«Levantaos, los dos. Qué honor luchar junto al Pilar de la Llama en su último momento... o NO.»",
    ],
    choices: [
      { text: "«¡No es su último momento! ¡Contigo acaba el reinado de las Lunas!» (Combate especial: sobrevive 5 turnos a Akaza)", next: "akaza_survive", bossFight: "akaza_escena" },
    ],
  },
  akaza_survive: {
    id: "akaza_survive",
    chapter: 4,
    location: "tren_mugen",
    speaker: "Kyojuro Rengoku",
    speakerColor: "text-red-400",
    text: [
      "— Juntos aguantáis hasta que sale el sol. Akaza ruge de frustración y escapa, malherido, sin haberte matado a ti ni a Rengoku. —",
      "«¡Lo conseguiste, Ren! ¡Tu bruma le ocultó la posición y no pudo asestar el golpe final! ¡Estoy vivo gracias a ti!»",
      "«¡El corazón de la Llama arde con más fuerza! No importan las heridas. ¡Esto es una victoria, muchacho!»",
      "— Rengoku aprieta tu hombro con fuerza, sangrando pero vivo. El what if se hace realidad: el Pilar de la Llama no muere en el Mugen. —",
    ],
    next: "yoshiwara_llegada",
    reward: { xp: 300, orbs: 20, maxHp: 50, attack: 12, unlockForm: 5 },
  },

  // ============ CAPÍTULO 4: YOSHIWARA - DAKI & GYUTARO ============
  yoshiwara_llegada: {
    id: "yoshiwara_llegada",
    chapter: 4,
    location: "distrito_entretenimiento",
    speaker: "Tengen Uzui",
    speakerColor: "text-fuchsia-300",
    text: [
      "— El Pilar del Sonido, Tengen Uzui, te recibe en Yoshiwara disfrazado de cortesana. —",
      "«¿Así que eres el chico del que todo el mundo habla? El que salvó a Rengoku. ¡FLASHY! Pero aquí la cosa es distinta: hay una Luna Superior en este distrito.»",
      "«Mis tres mujeres han sido capturadas. Vamos a infiltrarnos. Y por favor, nada de ataques a lo loco. En Yoshiwara el espectáculo lo es todo.»",
      "— Una cortesana de pelo blanco te observa desde un balcón. Se lame los labios. —",
    ],
    next: "yoshiwara_tengen",
  },
  yoshiwara_tengen: {
    id: "yoshiwara_tengen",
    chapter: 4,
    location: "distrito_entretenimiento",
    speaker: "Daki",
    speakerColor: "text-fuchsia-200",
    text: [
      "«¿Un nuevo cliente? Oh... pero si eres un cazador... ¡Onii-chan, mira qué bonito trae la hoja plateada!»",
      "«Voy a jugar con él un rato antes de comérmelo. ¿Te parece bien?»",
      "«¡Te voy a cortar en pedacitos tan pequeños que ni siquiera tu dios te reconocerá!»",
    ],
    next: "yoshiwara_daki",
  },
  yoshiwara_daki: {
    id: "yoshiwara_daki",
    chapter: 4,
    location: "distrito_entretenimiento",
    speaker: "Sistema",
    text: [
      "— Daki ataca con sus hojas de obi. Derrotarla despierta a Gyutaro. ¡Prepárate!",
    ],
    choices: [
      { text: "Combatir a las Lunas Superiores", next: "yoshiwara_gyutaro", bossFight: "daki_gyutaro" },
    ],
  },
  yoshiwara_gyutaro: {
    id: "yoshiwara_gyutaro",
    chapter: 4,
    location: "distrito_entretenimiento",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— Con la ayuda de Tengen y tu bruma plateada que confunde los sentidos de los hermanos demonio, lográis decapitarlos al mismo tiempo.",
      "— Tengen pierde su ojo izquierdo y una mano, pero sobrevive. Se retira como Pilar, pero promete ayudaros en la batalla final.",
      "— Antes de desvanecerse, Gyutaro susurra: «Onii-chan siempre estará con su hermanita...».",
    ],
    next: "herradores_llegada",
    reward: { xp: 220, orbs: 15, unlockForm: 6 },
  },

  // ============ CAPÍTULO 5: ALDEA DE LOS HERRADORES ============
  herradores_llegada: {
    id: "herradores_llegada",
    chapter: 5,
    location: "aldea_herradores",
    speaker: "Muichiro Tokito",
    speakerColor: "text-slate-300",
    text: [
      "— El Pilar de la Niebla te está esperando en la aldea. —",
      "«He recordado algo, Shinjo. Tu bruma plateada viene de la familia Tokito. Mi hermano y yo... tú eres descendiente de la rama que se separó hace tres generaciones.»",
      "«Eso significa que la tuya y la mía no solo son parecidas. Son familia. Y si entrenamos juntos, tal vez despertemos una nueva forma.»",
      "«Además... hay un demonio de las Lunas acechando en el bosque de detrás de la aldea. Y no es Gyokko. Es peor. Kaigaku, el antiguo alumno de Jigoro Kuwajima, que se convirtió por miedo a Kokushibo.»",
    ],
    next: "herradores_muichiro_whatif",
  },
  herradores_muichiro_whatif: {
    id: "herradores_muichiro_whatif",
    chapter: 5,
    location: "aldea_herradores",
    speaker: "Kotetsu",
    speakerColor: "text-yellow-200",
    text: [
      "«¡Eh, Ren! ¡Tokito-san! ¡Hay una muñeca mecánica ahí detrás que podría entrenaros! ¡Es la Yoriichi Type Zero!»",
      "«Si lucháis contra ella, puede que despertéis una séptima forma secreta de vuestra respiración!»",
    ],
    next: "herradores_kotetsu",
  },
  herradores_kotetsu: {
    id: "herradores_kotetsu",
    chapter: 5,
    location: "aldea_herradores",
    speaker: "Kaigaku",
    speakerColor: "text-yellow-400",
    text: [
      "— Un trueno oscuro cae del cielo. Kaigaku, con su katana relámpago ennegrecida, sonríe con suficiencia. —",
      "«El nieto del viejo Kuwajima... y dos niños que juegan con la niebla. Patético. Voy a mataros a los dos para ofrecéroselos a Kokushibo-sama.»",
      "«¡Respiración del Relámpago... Sexta Postura...!»",
    ],
    choices: [
      { text: "«¡No en nombre de todos los que confiaron en ti, Kaigaku!»", next: "herradores_final", bossFight: "kaigaku" },
    ],
  },
  herradores_final: {
    id: "herradores_final",
    chapter: 6,
    location: "aldea_herradores",
    speaker: "Muichiro Tokito",
    speakerColor: "text-slate-300",
    text: [
      "— Tras derrotar a Kaigaku, Muichiro te mira con lágrimas en los ojos. Sonríe por primera vez. —",
      "«Gracias, Ren. Me has recordado por qué soy un Pilar. El Pilar de la Niebla y la Bruma Plateada... dos estilos, un solo corazón.»",
      "— En ese momento, sientes una resonancia. La Séptima Postura de la Bruma Plateada despierta dentro de ti: Bruma que Borra el Horizonte. —",
      "«...El castillo de Muzan aparecerá pronto. Debemos reunir a todos los Pilares. La batalla final está cerca.»",
    ],
    next: "sede_ultima_mision",
    reward: { xp: 400, orbs: 30, unlockForm: 7, maxHp: 80, attack: 20 },
  },
  sede_ultima_mision: {
    id: "sede_ultima_mision",
    chapter: 6,
    location: "sede_cazadores",
    speaker: "Ubuyashiki Kagaya",
    speakerColor: "text-amber-200",
    text: [
      "— El Maestro tose sangre en su pañuelo, pero su sonrisa no flaquea. —",
      "«Ren... quiero que sepas algo. Tu bruma plateada tiene un componente que ninguna otra respiración tiene: refleja la luz solar. Es un espejo natural.»",
      "«Si logras cubrir a Muzan con ella durante el alba, los rayos de sol podrán atravesarla y quemarle sin que pueda protegerse.»",
      "«Los demás Pilares confían en ti. Hasta Tomioka-san, que nunca confía en nadie, dice que ve algo en ti.»",
      "«Ve. El Castillo Infinito ya ha sido localizado. ¡Que el destino te acompañe!»",
    ],
    next: "infinito_entrada",
  },

  // ============ CAPÍTULO 7: CASTILLO INFINITO - BATALLA FINAL ============
  infinito_entrada: {
    id: "infinito_entrada",
    chapter: 7,
    location: "castillo_infinito",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— El Castillo Infinito es un pesadilla viviente. Escalinatas que se tuercen, puertas al revés, ríos que corren por el techo.",
      "— Los Pilares se dispersan por el castillo, cada uno en busca de una Luna Superior. Tu misión es llegar a Muzan.",
      "— Pero antes... en uno de los corredores te encuentras con un espadachín de seis ojos y una hoja deforme que respira en la oscuridad. Kokushibo, la Luna Superior Uno.",
    ],
    next: "infinito_kaigaku",
  },
  infinito_kaigaku: {
    id: "infinito_kaigaku",
    chapter: 7,
    location: "castillo_infinito",
    speaker: "Kokushibo",
    speakerColor: "text-rose-400",
    text: [
      "«Mataste a Kaigaku, el muchacho débil que se atrevió a empuñar el Relámpago a mi lado. Bien. Era indigno.»",
      "«Pero tu respiración es un derivado de la Niebla... y, por tanto, de la Luna. Mi Luna. ¿Por qué empuñas una espada contra mí, jovencito? Podrías convertirte en un ser casi perfecto.»",
      "«Yo fui humano una vez. Fui un cazador. Pero Yoriichi me arrebató todo. ¡Únete a mí, o muere como todos los demás!»",
    ],
    choices: [
      { text: "«Eligiste ser un demonio. Ahora pagarás por ello. ¡Adelante, Séptima Postura!»", next: "infinito_kokushibo", bossFight: "kokushibo" },
    ],
  },
  infinito_kokushibo: {
    id: "infinito_kokushibo",
    chapter: 7,
    location: "castillo_infinito",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— Junto a Muichiro y Sanemi, derrotas a Kokushibo justo cuando el alba comienza a asomarse por entre las grietas del castillo.",
      "— La Luna Superior Uno, antes de desvanecerse, susurra el nombre de su hermano Yoriichi.",
      "— No hay tiempo para descanso. Tamayo y Shinobu han aplicado sus venenos. Muzan está comenzando a debilitarse, pero sigue siendo una amenaza.",
    ],
    next: "infinito_akaza",
    reward: { xp: 600, orbs: 50 },
  },
  infinito_akaza: {
    id: "infinito_akaza",
    chapter: 7,
    location: "castillo_infinito",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— En la siguiente sala ves a Giyu y a Kyojuro Rengoku luchando contra Akaza. Rengoku ya no tiene la mano izquierda, pero sigue en pie y ardiendo con más fuerza que nunca.",
      "— Giyu usa la forma de la Quietud. Tanjiro también está ahí. Con tu ayuda, Akaza es arrinconado contra un muro.",
      "— Antes de morir, Akaza recuerda su nombre humano: Hakuji. Se despide con una sonrisa.",
    ],
    next: "infinito_muzan",
    reward: { xp: 400, orbs: 40 },
  },
  infinito_muzan: {
    id: "infinito_muzan",
    chapter: 7,
    location: "castillo_infinito",
    speaker: "Muzan Kibutsuji",
    speakerColor: "text-red-500",
    text: [
      "— Llegáis a la sala del trono. Muzan, con su forma monstruosa de tentáculos y fauces, ruge. —",
      "«¡INSECTOS! ¡LLEVO MIL AÑOS VIVIENDO Y NADIE ME HA MATADO! ¡¿Por qué vosotros, insignificantes criaturas, os atrevéis?!»",
      "— Todos los Pilares supervivientes están a tu lado. Tanjiro ha despertado la Hinokami Kagura. Inosuke y Zenitsu también están ahí. Nezuko ya no es un demonio. —",
      "«¿Te crees especial por tu Bruma Plateada? ¡Yo soy el ser perfecto! ¡Yo soy MUZAN!»",
    ],
    choices: [
      { text: "«No eres perfecto. Eres un cobarde que le teme al sol. ¡TODOS JUNTOS!»", next: "final_bueno", bossFight: "muzan" },
    ],
  },
  final_bueno: {
    id: "final_bueno",
    chapter: 8,
    location: "castillo_infinito",
    speaker: "Narrador",
    speakerColor: "text-slate-300",
    text: [
      "— La batalla dura horas. Los Pilares caen uno a uno, malheridos, pero vivos (en esta línea temporal).",
      "— Cuando los primeros rayos del alba intentan entrar al castillo, Muzan se protege con sus tentáculos. Pero entonces tú desenvainas tu Nichirin plateada.",
      "— «¡SÉPTIMA POSTURA: BRUMA QUE BORRA EL HORIZONTE!»",
      "— Tu bruma no es niebla densa: es un manto translúcido y plateado que difracta la luz solar como mil espejos, inundando todo el castillo.",
      "— Muzan aúlla y se retuerce. La luz le quema la piel, los huesos, el alma. Antes de morir, maldice tu nombre. Pero luego se desvanece, convertido en ceniza.",
      "— Los Pilares sobreviven. Rengoku te abraza. Muichiro te sonríe. Tanjiro llora. Nezuko corre a abrazarle.",
      "— El Cuerpo de Cazadores de Demonios se disuelve oficialmente: ya no hay demonios que cazar.",
      "— Tu nombre, Shinjo Ren, el Cazador de la Bruma Plateada, se graba en la historia junto a los héroes que vivieron.",
      "— FINAL BUENO: Hojas en la Bruma — El Sol Tras la Plata.",
    ],
    isEnding: true,
    reward: { orbs: 999, xp: 3000, maxHp: 200, attack: 50 },
  },
};

export function getStoryNode(id: string | undefined): StoryNode | undefined {
  if (!id) return undefined;
  return STORY_NODES[id];
}

export const STARTING_NODE = "intro_0";
