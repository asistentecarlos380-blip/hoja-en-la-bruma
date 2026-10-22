import { PROLOGUE_CHAPTER } from "./prologueStory";
import { CANONICAL_ARCS } from "./canonicalStoryData";

export type MissionObjective = {
  id: string;
  label: string;
  completeOnNodeIds: string[];
};

export type StoryMission = {
  title: string;
  briefing: string;
  objectives: MissionObjective[];
};

export type StoryChapter = {
  id: string;
  number: number;
  title: string;
  location: string;
  synopsis: string;
  mission: StoryMission;
  nodes: StoryNode[];
};

export type StoryChoice = {
  text: string;
  nextNodeId: string;
  consequence?: string;
};

export type StoryNode = {
  id: string;
  speaker: string;
  title?: string;
  portraitEmoji?: string;
  speakerColor?: string;
  paragraphs: string[];
  choices?: StoryChoice[];
  nextNodeId?: string;
};

// ============================================================================
// KIMETSU NO YAIBA: HOJAS EN LA BRUMA — WHAT IF
// Premisa alternativa:
//   · Shinjo Ren (19 años) — protagonista, prometido de Nezuko.
//   · Nezuko Kamado (19 años) — prometida de Ren, amiga de la infancia.
//   · Tanjiro Kamado (21 años) — hermano mayor. La noche de la masacre NO
//     estaba en casa: bajó a la aldea a buscar a su futuro cuñado, Ren,
//     para ultimar los detalles de la boda.
// ============================================================================

export const WHAT_IF_STORY: StoryChapter[] = [
  PROLOGUE_CHAPTER,
  {
    id: "cap_1",
    number: 1,
    title: "Capítulo 1: Dos Años de Bruma y un Lazo Rosa",
    location: "Monte Sagiri — Cabaña de Urokodaki Sakonji",
    synopsis: "{firstName} y Tanjiro entrenan juntos bajo Urokodaki. De tu fracaso con la Respiración del Agua nace algo nuevo: la Respiración de la Bruma Plateada. Nezuko duerme... pero no para ti.",
    mission: {
      title: "Prueba de Urokodaki y Selección Final",
      briefing: "Completa el entrenamiento, comprende cómo el vínculo ayuda a Nezuko y sobrevive los siete días de la Selección Final.",
      objectives: [
        { id: "training", label: "Preséntate ante Urokodaki en el Monte Sagiri", completeOnNodeIds: ["c1_1"] },
        { id: "care", label: "Madrugada: cuida de Nezuko y escucha a Tanjiro", completeOnNodeIds: ["c1_nezuko_care"] },
        { id: "descent", label: "Mañana: baja la montaña sorteando las trampas", completeOnNodeIds: ["c1_descent_done"] },
        { id: "makomo", label: "Tarde: apoya a Makomo y entrena con ella", completeOnNodeIds: ["c1_makomo_motivated"] },
        { id: "sabito", label: "Atardecer: vence a Sabito con la espada de madera", completeOnNodeIds: ["c1_sabito_win"] },
        { id: "night", label: "Noche: corta la roca, cena con el grupo y vela el descanso de Nezuko", completeOnNodeIds: ["c1_night_care"] },
        { id: "nezuko-anchor", label: "Comparte un momento con Nezuko y comprende su ancla humana", completeOnNodeIds: ["c1_llave", "c1_silencio"] },
        { id: "final-selection", label: "Sobrevive los siete días de la Selección Final y recibe tu Nichirin", completeOnNodeIds: ["c1_seleccion"] },
      ],
    },
    nodes: [
      {
        id: "c1_1",
        speaker: "Sakonji Urokodaki",
        title: "El maestro del Monte Sagiri",
        speakerColor: "text-blue-300",
        portraitEmoji: "👺",
        paragraphs: [
          "El viento helado del monte Sagiri agita las nubes pintadas en el haori azul de Sakonji Urokodaki mientras camina sin hacer el menor ruido sobre la hojarasca. A pocos pasos de la entrada del templo, la figura enmascarada se detiene en seco.",
          "Sin previo aviso, Urokodaki se gira y descarga dos golpes correctivos secos, haciendo que tanto Tanjiro como tú retrocedan un paso. Detrás de la máscara roja de tengu, su voz resuena grave, rasposa e implacable.",
          "—Son demasiado lentos. Los dos. No fueron capaces de tomar una decisión firme antes del amanecer. ¿Por qué dudaron tanto? Su determinación es blanda como el barro.",
          "Sus pasos los rodean lentamente hasta quedar frente a la cesta de bambú en tu espalda, de donde asoma la figura de Ne\u007auko, ahora una joven adulta de diecinueve años que gruñe por lo bajo tras el bambú. Urokodaki dirige entonces toda su atención hacia ti, olfateando el aire con desaprobación.",
          "—Giyuu Tomioka me envió una carta hablándome del muchacho de los pendientes hanafuda y de su hermana... pero tú eres un peso con el que no contaba. Dime una cosa, muchacho, y respóndeme sin titubear: ¿qué harás si la mujer con la que prometiste casarte pierde el control frente a un ser humano?",
          "Antes de que puedas articular una respuesta cargada de promesas vacías, la mano callosa de Urokodaki se alza para cortarte el paso.",
          "—El amor y las promesas de matrimonio no significan nada cuando el instinto despierta. Si en algún momento pierde el control frente a un inocente, no solo el hermano tendrá que responder... tú también tendrás que asumir el mismo precio.",
          "—Si ella cruza esa línea, ustedes dos responderán de inmediato con su propio honor y su destino. Ese es el peso de traerla hasta mi montaña. Nunca olviden que perdonar esa falta es pisotear el dolor de las víctimas.",
          "—Lleven a la joven adentro de mi cabaña, lejos de la luz del sol, y luego síganme. Si ambos pretenden protegerla con sus propias manos, tendrán que demostrarme que sus cuerpos y sus espíritus no se romperán en la montaña. No se queden atrás."
        ]
      },
      {
        id: "c1_nezuko_care",
        speaker: "Tanjiro Kamado (21)",
        title: "Madrugada en la cabaña — Cariño y palabra de cuñado",
        speakerColor: "text-emerald-300",
        portraitEmoji: "🎴",
        paragraphs: [
          "La primera noche en Sagiri, Nezuko apenas responde. Urokodaki la examina mientras Tanjiro sostiene una lámpara lejos de la luz directa.",
          "—No está herida —dice Urokodaki—. Su cuerpo ha entrado en un sueño profundo. Ignoro cuánto durará. No intenten despertarla a la fuerza.",
          "Tanjiro se arrodilla junto al futón. —¿Y si no vuelve a abrir los ojos? —pregunta. Urokodaki tarda en responder: —Entonces la cuidaremos hasta que lo haga.",
          "Te sientas a su lado y le acomodas la manta. —Nezuko, no sé si puedes oírme. Voy a aprender a protegerte. No porque alguien me lo ordene, sino porque quiero volver a caminar contigo.",
          "Tanjiro te espera en la puerta. Ninguno está listo para dejarla sola, pero ambos saben que el entrenamiento comienza al amanecer."
        ],
        choices: [
          {
            text: "Acariciar la frente de tu prometida con ternura, abrigarla bien y salir con Tanjiro.",
            consequence: "Comienza el descenso matutino por la montaña de Urokodaki.",
            nextNodeId: "c1_descent_done"
          }
        ]
      },
      {
        id: "c1_descent_done",
        speaker: "Sakonji Urokodaki",
        title: "Mañana superada — Las pruebas del Monte Sagiri",
        speakerColor: "text-blue-300",
        portraitEmoji: "👺",
        paragraphs: [
          "Llegas de vuelta junto a Tanjiro sin aliento tras esquivar las cuerdas y troncos de entrenamiento de la montaña. Urokodaki los observa en silencio tras su máscara de tengu y asiente apenas un milímetro.",
          "—Tienen piernas fuertes y el peso de esa cesta te ha dado resistencia en la espalda, muchacho. Ahora tomen las espadas de madera y vayan al claro del bosque. Makomo los espera para la práctica de la tarde."
        ]
      },
      {
        id: "c1_makomo_support",
        speaker: "Makomo (20)",
        title: "Tarde de entrenamiento — Motivando a Makomo",
        speakerColor: "text-teal-200",
        portraitEmoji: "🌸",
        paragraphs: [
          "Varias semanas después, durante una práctica en el bosque, ves a una muchacha fallar por tercera vez un giro de espada. Se aparta para recuperar el aliento.",
          "—Perdona, ¿interrumpo? —preguntas. Ella sacude la cabeza. —No. Soy Makomo. También entreno con Urokodaki. ¿Tú eres el recién llegado?",
          "Le dices tu nombre. Makomo mira tu espada de madera: —Aún no domino este ejercicio. Me apresuro al cambiar de apoyo y pierdo el equilibrio. ¿A ti también te ocurre?",
          "Tanjiro se acerca con una cantimplora. —Podemos practicar los tres. No hace falta resolverlo hoy.",
          "Makomo sonríe apenas. —De acuerdo. Pero prométanme que me avisarán cuando vuelva a adelantar el pie demasiado."
        ],
        choices: [
          {
            text: "Tomar sus manos con respeto y motivarla: «No has fracasado, Makomo. Tu agilidad y tu forma de sentir la respiración son únicas; entrenemos juntos hoy y superemos esa barrera.»",
            consequence: "Makomo recupera la confianza y entrenan juntos toda la tarde con Tanjiro.",
            nextNodeId: "c1_makomo_motivated"
          },
          {
            text: "Ponerte en guardia a su lado: «Nadie en esta montaña está solo. Tú me enseñas a fluir como el agua y Tanjiro y yo te ayudaremos a recuperar tu confianza. ¡Hagámoslo los tres!»",
            consequence: "El ánimo de Makomo se enciende de nuevo.",
            nextNodeId: "c1_makomo_motivated"
          }
        ]
      },
      {
        id: "c1_makomo_motivated",
        speaker: "Makomo (20)",
        title: "Entrenamiento en equipo",
        speakerColor: "text-teal-200",
        portraitEmoji: "🌸",
        paragraphs: [
          "El rostro de Makomo se ilumina con una sonrisa sincera. Durante toda la tarde, entrenas codo a codo con ella y con Tanjiro: tú la animas en cada serie, Tanjiro marca el ritmo con firmeza de hermano mayor, y ella pule cada uno de tus movimientos.",
          "—Gracias por creer en mí, {firstName} —dice Makomo secándose el sudor mientras el cielo se tiñe de naranja—. Me has devuelto la confianza en mi espada. Pero prepárate... ahí viene Sabito. Él es la prueba final de Urokodaki-sensei."
        ]
      },
      {
        id: "c1_sabito",
        speaker: "Sabito (21)",
        title: "Primer encuentro — Una verdad incómoda",
        speakerColor: "text-orange-300",
        portraitEmoji: "🦊",
        paragraphs: [
          "Al atardecer, Makomo te presenta al joven de la máscara de zorro. —Él es Sabito. Entrena aquí desde antes que nosotros.",
          "Sabito guarda su espada de madera. —Sé lo de la hermana de Tanjiro. Un demonio sigue siendo peligroso, incluso cuando lleva el rostro de alguien querido.",
          "Tanjiro aprieta los puños. —Nezuko no ha hecho daño a nadie. Tomioka lo vio con sus propios ojos.",
          "—Eso no demuestra que nunca lo hará —responde Sabito—. Si pierde el control, una persona inocente podría morir. ¿Por qué la dejaron vivir?",
          "Sabito te mira directamente. —Eres su prometido. Tu respuesta me dirá si comprendes el riesgo que estás asumiendo."
        ],
        choices: [
          { text: "«Tal vez debería estar muerta. Pero no la mataré; asumiré la responsabilidad.»", nextNodeId: "c1_sabito_pragmatico", consequence: "Sabito respeta tu franqueza; Tanjiro se siente herido." },
          { text: "«Cállate. No la conoces y no tienes derecho a juzgarla.»", nextNodeId: "c1_sabito_defensa", consequence: "Tanjiro agradece tu defensa; Sabito desconfía de tu impulsividad." },
          { text: "«Entiendo tu temor. La vigilaremos y no permitiremos que nadie resulte herido.»", nextNodeId: "c1_sabito_equilibrio", consequence: "Respuesta prudente, sin cambios de afinidad." }
        ]
      },
      {
        id: "c1_sabito_pragmatico", speaker: "Sabito (21)", title: "Una promesa difícil", portraitEmoji: "🦊", speakerColor: "text-orange-300",
        paragraphs: ["Sabito asiente lentamente. —Al menos no finges que el peligro no existe. Me basta para tomarte en serio.", "Tanjiro baja la mirada. —Nezuko es mi hermana. Escucharte decir que debería estar muerta... duele. Aunque digas que la protegerás.", "Sabito toma su espada de madera. —Demuestra con tu guardia que tu promesa no es solo una frase."], nextNodeId: "c1_sabito_duelo"
      },
      {
        id: "c1_sabito_defensa", speaker: "Tanjiro Kamado (21)", title: "Defender a Nezuko", portraitEmoji: "🎴", speakerColor: "text-emerald-300",
        paragraphs: ["Tanjiro se coloca a tu lado. —Gracias. No dejaré que la condenen sin darle una oportunidad.", "Sabito no alza la voz. —Quererla no basta. Una reacción impulsiva puede costarle la vida a otro.", "Señala el claro con su espada de madera. —Si estás tan seguro, muéstrame cómo proteges sin perder la cabeza."], nextNodeId: "c1_sabito_duelo"
      },
      {
        id: "c1_sabito_equilibrio", speaker: "Sabito (21)", title: "Ni miedo ni ingenuidad", portraitEmoji: "🦊", speakerColor: "text-orange-300",
        paragraphs: ["Sabito estudia tu rostro y después mira a Tanjiro. —No estoy pidiéndoles que dejen de quererla. Les pido que no cierren los ojos.", "Tanjiro asiente con cautela. —No los cerraremos. Pero tampoco abandonaremos a Nezuko.", "Sabito desenfunda la espada de madera. —Entonces probemos su determinación en un duelo."], nextNodeId: "c1_sabito_duelo"
      },
      {
        id: "c1_sabito_duelo", speaker: "Makomo (20)", title: "El desafío de Sabito", portraitEmoji: "🌸", speakerColor: "text-teal-200",
        paragraphs: ["Makomo da un paso atrás para dejar libre el claro. —Es un entrenamiento, Sabito. No lo olvides.", "—Lo sé —contesta él—. Espadas de madera. Sin heridas graves. Quiero ver si sabe mantener la calma cuando se equivoca."], nextNodeId: "c1_2"
      },
      {
        id: "c1_2",
        speaker: "Narrador",
        title: "Nezuko no duerme para ti",
        portraitEmoji: "🌸",
        speakerColor: "text-pink-300",
        paragraphs: [
          "Desde aquella primera noche, Urokodaki ha vigilado el sueño de Nezuko. No ha encontrado una explicación definitiva ni una forma segura de despertarla.",
          "En ocasiones su respiración cambia cuando oye tu voz o la de Tanjiro. Son señales pequeñas, difíciles de interpretar.",
          "Urokodaki toma nota sin sacar conclusiones. —Es pronto para saber qué significan esas reacciones. No voy a prometerles algo que desconozco.",
          "Tú vuelves a sentarte junto al futón. Lo que te sostiene no es una profecía: es la promesa que le hiciste antes de que todo cambiara."
        ],
        choices: [
          {
            text: "«Urokodaki-san, ¿qué quiere decir con 'la llave'?»",
            nextNodeId: "c1_llave",
            consequence: "Urokodaki comparte su hipótesis sobre el vínculo de Nezuko."
          },
          {
            text: "Guardar silencio y apretar la mano de Nezuko.",
            nextNodeId: "c1_silencio",
            consequence: "Hay cosas que no necesitan palabras. El lazo se fortalece."
          }
        ]
      },
      {
        id: "c1_llave",
        speaker: "Urokodaki Sakonji",
        portraitEmoji: "👺",
        speakerColor: "text-blue-300",
        paragraphs: [
          "—He visto que Nezuko se tranquiliza cuando ustedes están cerca —dice Urokodaki—. Pero no sé por qué ocurre ni si bastará para ayudarla.",
          "—Entonces seguiremos buscando respuestas —respondes.",
          "—Sí. Aprendan a sobrevivir primero. No permitiré que una esperanza sin pruebas los haga descuidar su entrenamiento."
        ],
        nextNodeId: "c1_seleccion"
      },
      {
        id: "c1_silencio",
        speaker: "Narrador",
        portraitEmoji: "🤝",
        speakerColor: "text-slate-300",
        paragraphs: [
          "Tomas la mano de Nezuko entre las tuyas. Sus garras podrían abrirte la muñeca de un gesto; en cambio, sus dedos se cierran con la delicadeza de quien sostiene un pajarillo.",
          "Dormida, con el bambú en la boca, murmura algo ininteligible. Tanjiro jura desde la otra esquina que sonó como 'Men'. Tú sabes perfectamente qué intentó decir.",
          "Esa noche decides que no habrá Luna, Superior o Inferior, que se interponga entre Nezuko y el altar."
        ],
        nextNodeId: "c1_seleccion"
      },
      {
        id: "c1_seleccion",
        speaker: "Narrador",
        title: "La Selección Final — Monte Fujikasane",
        portraitEmoji: "⚔️",
        speakerColor: "text-amber-300",
        paragraphs: [
          "La Selección Final: siete días sobreviviendo entre demonios cautivos en el monte de las glicinias.",
          "Tanjiro y tú entráis juntos. El demonio morfológico que devoró a los discípulos de Urokodaki reconoce las máscaras de zorro... y comete el error de hablar de más sobre cómo saborearía 'a la mujer demonio que viaja con vosotros'.",
          "Nunca habías decapitado tan rápido. Tanjiro tuvo que sujetarte para que no siguieras cortando.",
          "Siete días después, ambos salís vivos. Os entregan el mineral para vuestras katanas. La tuya, al forjarse, no se tiñe de negro ni de azul: adquiere un plateado de luna llena que el herrero Haganezuka jamás había visto. «¡¿QUÉ COLOR ES ESTE?! ¡¿QUÉ CLASE DE RESPIRACIÓN USAS, MOCOSO?!»",
          "Respiración de la Bruma Plateada. La primera y única de su linaje."
        ],
        choices: [
          {
            text: "Recibir la primera misión oficial: el pueblo del noroeste",
            nextNodeId: "m1_1"
          }
        ]
      }
    ]
  },
  ...CANONICAL_ARCS,
  {
    id: "cap_5",
    number: 5,
    title: "Capítulo 5: Monte Natagumo — La familia de los hilos",
    location: "Monte Natagumo — Territorio de la familia araña",
    synopsis: "La misión de rescate exige localizar a los escuadrones desaparecidos y derrotar, uno por uno, a los miembros de la familia araña antes de enfrentar a Rui.",
    mission: {
      title: "Operación Natagumo: rescate y exterminio",
      briefing: "Sigue las órdenes del cuervo. Rescata a los cazadores atrapados, neutraliza a los cuatro miembros de la familia araña y reúne al equipo antes de enfrentarte a Rui.",
      objectives: [
        { id: "natagumo-arrival", label: "Llega a la montaña y localiza a los escuadrones perdidos", completeOnNodeIds: ["c2_1"] },
        { id: "mother", label: "Detén a la Madre Araña y libera a los cazadores controlados", completeOnNodeIds: ["c2_mother_final"] },
        { id: "brother", label: "Rescata a Zenitsu y derrota al Hermano Araña", completeOnNodeIds: ["c2_brother_final"] },
        { id: "father", label: "Apoya a Inosuke contra el Padre Araña", completeOnNodeIds: ["c2_father_final"] },
        { id: "rui", label: "Reúne al equipo y supera las fases del combate contra Rui", completeOnNodeIds: ["c2_rui_final"] },
        { id: "report-natagumo", label: "Entrega el informe a los Pilares y recibe la siguiente orden", completeOnNodeIds: ["c2_shinobu"] },
      ],
    },
    nodes: [
      {
        id: "c2_1",
        speaker: "Narrador",
        title: "La montaña de seda",
        portraitEmoji: "🕸️",
        speakerColor: "text-slate-300",
        paragraphs: [
          "El Cuervo Kasugai os deja al pie de Natagumo con una orden clara: encontrar a los escuadrones desaparecidos y sacar con vida a cualquiera que siga respirando.",
          "El bosque apesta a ácido y a seda húmeda. Cazadores cuelgan de las ramas, vivos pero controlados por hilos invisibles. Tanjiro, Zenitsu, Inosuke y tú avanzáis juntos; Nezuko viaja en la caja, aunque golpea la madera cada vez que percibe peligro.",
          "Un hilo corta el aire. Lo desvías con la Nichirin y ves que sube hasta una figura femenina entre los árboles. Más lejos, un chillido de Zenitsu responde desde la niebla; un rugido de Inosuke llega desde la ladera opuesta.",
          "Los hilos están separando al equipo. Antes de perseguir a Rui, tendréis que sobrevivir a los miembros de su familia y rescatar a los cazadores que controlan."
        ],
        nextNodeId: "c2_mother_start"
      },
      {
        id: "c2_mother_start",
        speaker: "Madre Araña",
        title: "La primera hija de Rui",
        portraitEmoji: "🕸️",
        speakerColor: "text-rose-300",
        paragraphs: [
          "Una mujer pálida cuelga de una rama, moviendo los dedos como si tocara un instrumento. Los cazadores controlados por sus hilos se vuelven contra vosotros, suplicando entre espasmos que los detengáis.",
          "La Madre Araña no parece orgullosa de la familia de Rui. «Me obliga a torturarlos. Si me niego, me tortura a mí. Por favor... si podéis hacerlo rápido...»",
          "Tanjiro baja la espada un instante. No quiere herir a los cazadores atrapados, pero los hilos ya les están rompiendo los huesos."
        ],
        choices: [
          {
            text: "Cortar los hilos de control primero, aunque la Madre pueda escapar.",
            nextNodeId: "c2_mother_phase",
            consequence: "Intentas liberar a los cazadores antes de terminar el combate."
          },
          {
            text: "Acercarte a la Madre mientras Tanjiro contiene a los cazadores.",
            nextNodeId: "c2_mother_phase",
            consequence: "Dividís el trabajo para detener a la controladora y proteger al escuadrón."
          }
        ]
      },
      {
        id: "c2_mother_phase",
        speaker: "Narrador",
        title: "La red de marionetas",
        portraitEmoji: "🕸️",
        speakerColor: "text-cyan-200",
        paragraphs: [
          "La Madre hace bailar a seis cazadores a la vez. Tanjiro desvía las katanas sin devolver golpes; tú sigues los hilos hasta sus puntos de anclaje y los cortas uno tras otro.",
          "La telaraña se tensa y los cuerpos caen. Dos cazadores quedan libres; un tercero permanece suspendido por un hilo que le aprieta el cuello.",
          "La Madre Araña deja de luchar. «Ya no puedo más. Por favor, no me obligues a regresar con Rui.» Tanjiro entiende la súplica que ella no consigue pronunciar del todo."
        ],
        nextNodeId: "c2_mother_final"
      },
      {
        id: "c2_mother_final",
        speaker: "Tanjiro Kamado",
        title: "Piedad en el filo",
        portraitEmoji: "🎴",
        speakerColor: "text-emerald-300",
        paragraphs: [
          "Tú cortas el último hilo y sostienes al cazador antes de que caiga. Tanjiro se acerca a la Madre Araña con una postura que no parece un ataque.",
          "«No volverás a sufrir por Rui.» Un corte limpio termina con su tormento. Antes de desaparecer, el rostro de la mujer se relaja por primera vez.",
          "Los supervivientes señalan dos gritos al otro lado del bosque: uno agudo y aterrorizado —Zenitsu— y otro que suena como un jabalí enfadado —Inosuke. La misión continúa."
        ],
        nextNodeId: "c2_brother_start"
      },
      {
        id: "c2_brother_start",
        speaker: "Zenitsu Agatsuma",
        title: "El veneno de la araña",
        portraitEmoji: "⚡",
        speakerColor: "text-yellow-300",
        paragraphs: [
          "Encontráis a Zenitsu atado a un árbol, con la piel hinchada y manchas oscuras subiéndole por el cuello. Delante de él, el Hermano Araña sonríe con colmillos húmedos.",
          "«¡No te acerques a Nezuko-san!» grita Zenitsu incluso envenenado. La caja ha quedado entre raíces; Nezuko golpea desde dentro al percibir que su amigo está en peligro.",
          "El demonio escupe una lluvia de hilos venenosos. No podéis acercaros en línea recta sin que el veneno alcance a todo el grupo."
        ],
        nextNodeId: "c2_brother_phase"
      },
      {
        id: "c2_brother_phase",
        speaker: "Narrador",
        title: "Relámpago entre los hilos",
        portraitEmoji: "⚡",
        speakerColor: "text-amber-200",
        paragraphs: [
          "El Hermano Araña muta: sus brazos se alargan y la seda cubre los árboles. Tú abres una brecha en la red; Nezuko salta de la caja y quema los filamentos que sujetan a Zenitsu sin tocar su piel.",
          "El veneno sigue avanzando. Zenitsu pierde el conocimiento, pero su respiración se vuelve regular. En el silencio de la inconsciencia, el miedo desaparece de su rostro.",
          "Un destello amarillo atraviesa la telaraña. «Respiración del Rayo, Primera Postura: Destello Relámpago.» Zenitsu corta al demonio antes de que pueda volver a escupir veneno.",
          "No es un golpe suficiente para terminarlo: la cabeza queda unida por una hebra de carne demoníaca. Nezuko y tú sostenéis los extremos de la red para que Tanjiro pueda mantener libre la trayectoria."
        ],
        nextNodeId: "c2_brother_final"
      },
      {
        id: "c2_brother_final",
        speaker: "Zenitsu Agatsuma",
        title: "El grito al despertar",
        portraitEmoji: "💛",
        speakerColor: "text-yellow-300",
        paragraphs: [
          "El Hermano Araña se deshace. Zenitsu despierta justo cuando Nezuko termina de quemar el veneno superficial de la seda y tú le haces un torniquete para retrasar la toxina restante.",
          "Lo primero que ve es a Nezuko inclinada sobre él. Se le llenan los ojos de lágrimas: «¡Nezuko-san me salvó! ¡{firstName}, eres mi rival, pero gracias por dejarme vivir para verla otra vez!»",
          "Nezuko le da una palmada amistosa en el hombro. Zenitsu la interpreta como una promesa de amistad eterna y se levanta demasiado rápido, mareándose de nuevo.",
          "Desde la ladera llega un estruendo. Inosuke ha encontrado al Padre Araña y está perdiendo terreno."
        ],
        nextNodeId: "c2_father_start"
      },
      {
        id: "c2_father_start",
        speaker: "Inosuke Hashibira",
        title: "El Padre Araña",
        portraitEmoji: "🐗",
        speakerColor: "text-emerald-400",
        paragraphs: [
          "El Padre Araña atraviesa una pared de árboles con los puños. Inosuke choca contra una roca y se levanta riendo, aunque el brazo izquierdo le cuelga entumecido.",
          "«¡No necesito ayuda!» grita. El demonio vuelve a golpear y el jabalí apenas alcanza a esquivar.",
          "Tomas posición a su lado. Inosuke te mira por encima de las espadas dentadas: «¡No te pedí que vinieras! Pero si vas a estorbar, hazlo golpeando fuerte.»"
        ],
        nextNodeId: "c2_father_phase"
      },
      {
        id: "c2_father_phase",
        speaker: "Narrador",
        title: "Tres asaltos contra el Padre Araña",
        portraitEmoji: "💥",
        speakerColor: "text-orange-300",
        paragraphs: [
          "Primer asalto: el Padre Araña carga en línea recta. Inosuke lo atrae y tú cortas las raíces que usa para impulsarse.",
          "Segundo asalto: el demonio endurece la piel y un golpe os separa. Inosuke adapta las articulaciones para seguir moviéndose; tú usas la Bruma Plateada para confundir su visión y ganar segundos.",
          "Tercer asalto: el Padre Araña os estrella contra el suelo. La caja rueda cuesta abajo. Nezuko corre a protegerla y Tanjiro cubre a los cazadores heridos.",
          "Cuando el demonio levanta el brazo para el golpe final, una figura de haori dividido aparece entre vosotros. Giyu Tomioka ha llegado."
        ],
        nextNodeId: "c2_father_final"
      },
      {
        id: "c2_father_final",
        speaker: "Tomioka Giyu",
        title: "Respiración del Agua, Undécima Postura: Calma",
        portraitEmoji: "🌊",
        speakerColor: "text-cyan-300",
        paragraphs: [
          "El Padre Araña cae antes de completar el golpe. Giyu no aparta la mirada de los cazadores a los que acabáis de proteger.",
          "Inosuke protesta que ya lo tenía vencido. Giyu no responde. Tanjiro ayuda a levantar a los heridos y Zenitsu, aún temblando por el veneno, se niega a soltar la manga de Nezuko.",
          "La bruma se abre sobre una telaraña gigantesca. En el centro aguarda Rui, la Quinta Luna Inferior. Los demás miembros de su familia han caído; ahora solo queda el demonio que dirige los hilos."
        ],
        nextNodeId: "c2_2"
      },
      {
        id: "c2_2",
        speaker: "Rui",
        title: "Luna Inferior Cinco",
        portraitEmoji: "🕷️",
        speakerColor: "text-red-400",
        paragraphs: [
          "«...Qué es eso. Ese olor entre vosotros dos. El humano y la demonio de la caja.»",
          "«Un lazo. Un lazo DE VERDAD.» Sus hilos vibran de ira. «Mi familia me obedece porque la torturo. Me teme. Pero vosotros... esa demonio dormiría al sol por ti, ¿verdad?»",
          "«Decidido. Ella será mi hermana mayor. Y tú serás el recuerdo que le arrancaré, hilo por hilo, hasta que solo me quiera a mí.»",
          "La caja de madera cruje. Desde dentro, Nezuko ha oído cada palabra. Y por primera vez desde la masacre... está furiosa."
        ],
        choices: [
          {
            text: "«Nezuko no pertenece a nadie. Ni a ti, ni a Muzan. ¡Ella eligió su familia y la eligió LIBRE!»",
            nextNodeId: "c2_combate",
            consequence: "Enfrentas a Rui con la verdad que más le duele: los lazos no se roban."
          },
          {
            text: "«Tanjiro, llévate la caja. Este 'niño' y yo tenemos que hablar de modales.»",
            nextNodeId: "c2_combate_solo",
            consequence: "Proteges a Nezuko alejándola del combate, cargando tú con todo el peso."
          }
        ]
      },
      {
        id: "c2_combate",
        speaker: "Narrador",
        title: "Primera fase: cortar la telaraña",
        portraitEmoji: "💥",
        speakerColor: "text-pink-400",
        paragraphs: [
          "Rui lanza una lluvia de hilos carmesí. Tú cortas los que amenazan a Tanjiro; Inosuke desvía los que cierran el camino y Zenitsu saca a dos cazadores de la zona de impacto.",
          "La caja se rompe cuando un hilo la atraviesa. Nezuko salta al claro y quema la seda alrededor del equipo con su Sangre Demoníaca Explosiva.",
          "No basta. Rui endurece sus hilos hasta volverlos más afilados que el acero. Uno abre un corte en tu hombro; otro empuja a Tanjiro contra el tronco de un árbol.",
          "«¡No podéis cortar los lazos que me pertenecen!» Rui se eleva sobre la red. No es el final del combate: apenas habéis conseguido acercaros."
        ],
        nextNodeId: "c2_rui_phase2"
      },
      {
        id: "c2_combate_solo",
        speaker: "Narrador",
        title: "Primera fase: un duelo en la bruma",
        portraitEmoji: "🌫️",
        speakerColor: "text-cyan-200",
        paragraphs: [
          "Tanjiro evacua la caja y a los cazadores heridos. Rui lanza hilos tras ellos; tú te quedas para cortar la persecución.",
          "Tu Tercera Postura —Velocidad del Vaho Matutino— deja siluetas falsas por todo el claro. Rui corta niebla una y otra vez, pero el esfuerzo te obliga a retroceder.",
          "Giyu llega y desvía el siguiente ataque. «Ya no tienes que sostenerlo solo.» Tanjiro vuelve con Nezuko, Zenitsu e Inosuke. El grupo se reúne para la segunda fase."
        ],
        nextNodeId: "c2_rui_phase2"
      },
      {
        id: "c2_rui_phase2",
        speaker: "Rui",
        title: "Segunda fase: los Hilos de Corte Rotatorio",
        portraitEmoji: "🕷️",
        speakerColor: "text-red-400",
        paragraphs: [
          "Rui contrae ambas manos. Una rueda de hilos rojos se cierra sobre el claro, cortando troncos, piedras y el aire entre vosotros.",
          "Inosuke bloquea un lado con sus dos katanas. Zenitsu, todavía afectado por el veneno, logra sacar a los últimos cazadores del alcance. Nezuko prende fuego a una sección de la red, pero Rui regenera cada hilo casi al instante.",
          "Un filamento atrapa a Tanjiro por el hombro y lo arrastra hacia Rui. Tú intentas alcanzarlo, pero la red te obliga a elegir entre perseguirlo o evitar que los hilos alcancen a Nezuko.",
          "Tanjiro oye el latido de su propia respiración debajo del dolor. Un recuerdo de su padre bailando bajo la nieve emerge de su memoria: la Danza del Dios del Fuego."
        ],
        nextNodeId: "c2_rui_hinokami"
      },
      {
        id: "c2_rui_hinokami",
        speaker: "Tanjiro Kamado",
        title: "Hinokami Kagura: Danza",
        portraitEmoji: "🔥",
        speakerColor: "text-orange-300",
        paragraphs: [
          "Tanjiro cambia el ritmo de su respiración. Su siguiente movimiento no es Agua: es una danza de fuego transmitida por su familia durante generaciones.",
          "La hoja negra corta los hilos de Rui. Tú cubres sus pasos con la Bruma Plateada y Nezuko quema la seda que amenaza su espalda; por primera vez, el demonio pierde su ventaja.",
          "Rui intenta detener el tajo separando su propia cabeza del cuello antes del impacto. Tanjiro cae agotado. La falsa decapitación no basta: el cuerpo del demonio aún se mueve y la red vuelve a tensarse.",
          "Entonces una superficie de agua quieta se abre entre vosotros y los hilos. Giyu Tomioka ha regresado del otro extremo de la montaña."
        ],
        nextNodeId: "c2_rui_final"
      },
      {
        id: "c2_rui_final",
        speaker: "Tomioka Giyu",
        title: "Cierre de la misión: el cuello de Rui",
        portraitEmoji: "🌊",
        speakerColor: "text-cyan-300",
        paragraphs: [
          "Giyu activa la Undécima Postura: Calma. Los hilos de Rui se deshacen en el silencio de una sola respiración.",
          "Esta vez, Tanjiro no está solo frente a la Luna Inferior: tú sujetas el último hilo de escape, Nezuko protege a los cazadores y Zenitsu con Inosuke mantienen despejado el claro.",
          "La espada de Giyu corta el cuello verdadero. Rui deja de regenerarse. Su rostro infantil se llena de una tristeza que no sabe nombrar; Tanjiro percibe el dolor detrás de su crueldad y no lo insulta mientras se convierte en ceniza.",
          "La familia araña ha caído. Los supervivientes son evacuados y cada equipo responde al recuento. Habéis completado la misión como escuadrón, no como cazadores aislados."
        ],
        nextNodeId: "c2_shinobu"
      },
      {
        id: "c2_shinobu",
        speaker: "Shinobu Kocho",
        title: "Pilar de los Insectos",
        portraitEmoji: "🦋",
        speakerColor: "text-purple-300",
        paragraphs: [
          "«Ara ara~. Así que vosotros sois el famoso trío: el hermano, el prometido... y la demonio que no come personas.»",
          "Shinobu sonríe, pero su mano no suelta la empuñadura. «Las reglas dicen que debo ejecutarla. Peeeero... el Maestro ha pedido veros a los tres vivos. Qué suerte tenéis.»",
          "«Dime una cosa, {lastName}-kun... en serio piensas casarte con ella, ¿verdad? Lo huelo en tu cara de tonto enamorado.» Su sonrisa se vuelve, por un instante, genuinamente triste. «...Procura que ese sueño no te haga lento. Los demonios devoran primero los sueños bonitos.»"
        ],
        choices: [
          {
            text: "«No, Kocho-sama. Ese sueño es exactamente lo que me hace rápido.»",
            nextNodeId: "c3_1"
          }
        ]
      }
    ]
  },
  {
    id: "cap_6",
    number: 6,
    title: "Capítulo 6: El Juicio de los Pilares y la Prueba del Sol",
    location: "Sede del Patrimonio Ubuyashiki — Jardín de Glicinas",
    synopsis: "Los Nueve Pilares juzgan a Nezuko. Sanemi la apuñala para provocarla... pero esta vez, el prometido está presente. Y Nezuko tiene una razón de 19 años para no morder.",
    mission: {
      title: "Comparecer ante los Pilares",
      briefing: "Sobrevive al juicio, demuestra que Nezuko puede resistir la sangre humana y obtén la autorización para viajar con el Cuerpo.",
      objectives: [
        { id: "trial-arrive", label: "Preséntate ante los Nueve Pilares", completeOnNodeIds: ["c3_1"] },
        { id: "trial-nezuko", label: "Acompaña a Nezuko durante la prueba de Sanemi", completeOnNodeIds: ["c3_2"] },
        { id: "trial-master", label: "Obtén el veredicto de Oyakata-sama y conoce a Muichiro", completeOnNodeIds: ["c3_3"] },
        { id: "trial-order", label: "Acepta la misión del Tren Mugen", completeOnNodeIds: ["c3_4"] },
      ],
    },
    nodes: [
      {
        id: "c3_1",
        speaker: "Sanemi Shinazugawa",
        title: "Pilar del Viento",
        portraitEmoji: "🌪️",
        speakerColor: "text-emerald-300",
        paragraphs: [
          "«¡¿Y encima el mocoso está PROMETIDO con el demonio?! ¡Esto es un maldito circo!»",
          "El jardín de guijarros blancos. Los Nueve Pilares en semicírculo. Tanjiro y tú, maniatados y de rodillas. La caja de Nezuko al sol, frente a todos.",
          "Sanemi desenvaina, se corta el brazo y deja gotear su sangre —sangre marechi, irresistible para los demonios— sobre la rendija de la caja.",
          "«¡Si de verdad no come humanos, que lo demuestre AHORA!»"
        ],
        nextNodeId: "c3_2"
      },
      {
        id: "c3_2",
        speaker: "Narrador",
        title: "La prueba",
        portraitEmoji: "🩸",
        speakerColor: "text-red-300",
        paragraphs: [
          "La caja se abre. Nezuko emerge parpadeando bajo la sombra parcial del alero. La sangre de Sanemi gotea a centímetros de su nariz. Sus pupilas se dilatan... el hambre de dos años sin probar un solo humano ruge en su interior.",
          "Y entonces te busca con la mirada.",
          "Te encuentra: de rodillas, maniatado, con el labio partido por los golpes... y aun así sonriéndole como un idiota, igual que en los festivales de verano.",
          "Nezuko cierra los ojos. Gira la cabeza. Y le da la espalda a la sangre con el mentón en alto, con la dignidad de una dama ofendida porque le ofrecieron comida de mala calidad.",
          "El silencio en el jardín es absoluto. Rengoku estalla en carcajadas: «¡¡GHAHAHA!! ¡QUÉ MUJER TAN FORMIDABLE! ¡YO APRUEBO ESTA BODA!»"
        ],
        nextNodeId: "c3_3"
      },
      {
        id: "c3_3",
        speaker: "Ubuyashiki Kagaya",
        title: "El Maestro (Oyakata-sama)",
        portraitEmoji: "🪷",
        speakerColor: "text-amber-200",
        paragraphs: [
          "«Mis queridos niños... ¿lo veis? Nezuko ha elegido. Su amor pesa más que la sangre de Muzan. Eso la convierte en la primera grieta del muro que llevamos mil años sin poder derribar.»",
          "{fullName}. Kamado Tanjiro. Desde hoy, el Cuerpo reconoce a Nezuko como aliada. Y {firstName}... he oído de tu Bruma Plateada. Muichiro, acércate.»",
          "El Pilar de la Niebla levanta la vista de las nubes, parpadea, y por primera vez en meses enfoca algo con total claridad: tu katana.",
          "Muichiro: «...Ese plateado. Mi abuela hablaba de una rama de la familia que se separó hace tres generaciones. Los que respiraban 'la niebla que refleja la luz'. Pensé que era un cuento... ¿Eres... familia?»"
        ],
        choices: [
          {
            text: "«Si la sangre lo dice, seremos familia dos veces, Tokito-sama: por la bruma... y porque estáis todos invitados a mi boda.»",
            nextNodeId: "c3_4",
            consequence: "Muichiro sonríe por primera vez en años. El vínculo de la familia Tokito con los {lastName} queda sellado."
          }
        ]
      },
      {
        id: "c3_4",
        speaker: "Ubuyashiki Kagaya",
        portraitEmoji: "🪷",
        speakerColor: "text-amber-200",
        paragraphs: [
          "«Entonces está decidido. Kyojuro, parte esta noche hacia el Tren Mugen: cuarenta personas han desaparecido en ese trayecto.»",
          "«{firstName}, Tanjiro... iréis con él. Y llevad a Nezuko.» El Maestro sonríe hacia un punto más allá de su propia ceguera. «Tengo el presentimiento... de que en ese tren dormirá mucha gente. Y nadie conoce mejor tus sueños que la mujer que aparece en todos ellos.»"
        ],
        choices: [
          {
            text: "Abordar el Tren Mugen",
            nextNodeId: "c4_1"
          }
        ]
      }
    ]
  },
  {
    id: "cap_7",
    number: 7,
    title: "Capítulo 7: El Tren Mugen — Sueños robados y amanecer",
    location: "Tren Mugen — Vía férrea nocturna",
    synopsis: "Enmu teje pesadillas a medida. Pero comete un error fatal: usar el sueño de la boda de {firstName} como jaula. Y en el amanecer, cuando Akaza venga por Rengoku, la bruma dirá basta.",
    mission: {
      title: "Proteger a los pasajeros del Tren Mugen",
      briefing: "Despierta del sueño de Enmu, ayuda a liberar a los pasajeros y sobrevive al encuentro con Akaza antes del amanecer.",
      objectives: [
        { id: "mugen-board", label: "Aborda el tren con Rengoku y el equipo", completeOnNodeIds: ["c4_1"] },
        { id: "mugen-wake", label: "Despierta de la pesadilla de Enmu", completeOnNodeIds: ["c4_despertar", "c4_rescate"] },
        { id: "mugen-enmu", label: "Derrota a Enmu y protege a los pasajeros", completeOnNodeIds: ["c4_enmu"] },
        { id: "mugen-akaza", label: "Ayuda a Rengoku a resistir a Akaza hasta el alba", completeOnNodeIds: ["c4_whatif"] },
        { id: "mugen-report", label: "Confirma que Rengoku sobrevivió y recibe el siguiente plan", completeOnNodeIds: ["c4_epilogo"] },
      ],
    },
    nodes: [
      {
        id: "c4_1",
        speaker: "Kyojuro Rengoku",
        title: "Pilar de la Llama",
        portraitEmoji: "🔥",
        speakerColor: "text-orange-400",
        paragraphs: [
          "«¡¡UMAAAI!! ¡¡UMAAAI!! ¡Jovencito {firstName}, come! ¡Un hombre que va a casarse necesita huesos fuertes! ¡¡GHAHAHA!!»",
          "Rengoku lleva catorce cajas de bento. Entre bocado y bocado, se pone serio por un instante:",
          "«Escuchad. Mi madre me enseñó que los fuertes nacen para proteger a los débiles. Tú, muchacho, proteges algo aún más frágil que una vida: proteges un futuro. No lo sueltes. Ni dormido.»",
          "Ninguno sabe aún lo literal que será ese consejo. El revisor ya perfora los boletos. El sello del sueño ya está echado."
        ],
        nextNodeId: "c4_2"
      },
      {
        id: "c4_2",
        speaker: "Narrador",
        title: "El sueño de {firstName}",
        portraitEmoji: "💤",
        speakerColor: "text-indigo-300",
        paragraphs: [
          "Caes en el sueño como una piedra en un estanque.",
          "Estás en la aldea. Es primavera. Los cerezos del sendero llueven pétalos. Nezuko —humana, de kimono blanco de novia, con el lazo rosa en el pelo— camina hacia ti sonriendo. Tu familia vive. La suya también. Kie llora de alegría; Tanjiro, de cuñado orgulloso, abraza a todo el mundo.",
          "Es perfecto.",
          "Es EXACTAMENTE lo que Enmu encontró en tu corazón y usó de cemento para tu jaula.",
          "La Nezuko del sueño te toma las manos ante el altar. Y entonces notas algo: no huele a nada. La verdadera Nezuko huele a bambú, a carbón y a flores de montaña. Esta... es papel en blanco."
        ],
        choices: [
          {
            text: "«Tú no eres ella. Mi Nezuko tiene las manos ásperas de trabajar... y ronca bajito. ¡DEVUÉLVEME MI SUEÑO, DEMONIO!»",
            nextNodeId: "c4_despertar",
            consequence: "Rompes la ilusión reconociendo a la Nezuko real, imperfecta y verdadera."
          },
          {
            text: "Quedarte un minuto más... solo un minuto, mirándole la cara.",
            nextNodeId: "c4_rescate",
            consequence: "La tentación casi te atrapa... pero alguien entra a buscarte al sueño."
          }
        ]
      },
      {
        id: "c4_despertar",
        speaker: "Narrador",
        portraitEmoji: "⚡",
        speakerColor: "text-amber-200",
        paragraphs: [
          "El sueño se agrieta como un espejo golpeado. La falsa Nezuko se deshace en tinta negra, chillando con la voz de Enmu: «¡¿CÓMO?! ¡ERA PERFECTO! ¡TE DI LA BODA PERFECTA!»",
          "«Por eso supe que era mentira», respondes desenvainando dentro de tu propio sueño. «Lo perfecto no existe. Existe ELLA.»",
          "Despiertas de golpe. A tu lado, la caja de Nezuko está abierta: ella lleva un buen rato mordiendo al revisor hipnotizado para que no vuelva a sellar a nadie, con cara de profundo fastidio."
        ],
        nextNodeId: "c4_enmu"
      },
      {
        id: "c4_rescate",
        speaker: "Nezuko Kamado",
        portraitEmoji: "🌸",
        speakerColor: "text-pink-300",
        paragraphs: [
          "Un minuto. Solo un minuto más mirando ese rostro...",
          "Y de pronto, la Nezuko del sueño sale volando de una patada voladora. Sobre ella, con el ceño fruncido y los brazos cruzados, está OTRA Nezuko: la real, que ha ardido su propia sangre para entrar a tu sueño a buscarte.",
          "Señala a la impostora, se señala a sí misma, e infla las mejillas con una indignación monumental: «¡Mmmph! ¡MMMPH!» (Traducción universal: '¡¿EN SERIO, REN?! ¡¿NO SABES DISTINGUIRME DE UNA FALSIFICACIÓN?!')",
          "Despiertas de golpe con ella dándote cabezazos suaves en el hombro. Nunca una bronca te supo tan dulce."
        ],
        nextNodeId: "c4_enmu"
      },
      {
        id: "c4_enmu",
        speaker: "Narrador",
        title: "El tren es el demonio",
        portraitEmoji: "🚂",
        speakerColor: "text-slate-300",
        paragraphs: [
          "Enmu, acorralado, fusiona su carne con los ocho vagones: doscientos rehenes dentro de un cuerpo de acero y músculo.",
          "La batalla se reparte sola: Tanjiro y Inosuke van a por el cuello en la locomotora; Rengoku y Zenitsu protegen a los pasajeros; y Nezuko y tú recorréis los vagones quemando los nervios del demonio —tu bruma localiza la carne oculta, su sangre explosiva la cauteriza.",
          "Trabajáis sin hablar, como un solo cuerpo. Catorce años de amistad y un compromiso hacen mejor coreografía que cualquier entrenamiento.",
          "La cabeza de Enmu cae. El tren descarrila entre chispas y vapor. Doscientos vivos. Cero muertos.",
          "Y entonces, con el cielo aún índigo... el suelo tiembla con pasos que no son humanos."
        ],
        nextNodeId: "c4_akaza"
      },
      {
        id: "c4_akaza",
        speaker: "Akaza",
        title: "Luna Superior Tres",
        portraitEmoji: "👹",
        speakerColor: "text-pink-400",
        paragraphs: [
          "«Qué espíritu de pelea tan magnífico... Kyojuro, ¿verdad? Conviértete en demonio. Los humanos fuertes como tú no merecen pudrirse.»",
          "Rengoku, herido del combate contra Enmu, sonríe y desenvaina: «Envejecer y morir es la belleza del ser humano. ¡Jamás!»",
          "En el relato original, este amanecer tiñe la pradera con la sangre del Pilar de la Llama.",
          "Pero esta vez hay dos factores que Akaza no conoce: un espadachín cuya bruma refleja la luz... y una demonio que no teme gastar hasta la última gota de su sangre ardiente por la familia que eligió."
        ],
        choices: [
          {
            text: "«¡Nezuko! ¡Plan del festival de Año Nuevo: tú las luces, yo la niebla! ¡PROTEGED A RENGOKU!»",
            nextNodeId: "c4_whatif",
            consequence: "EL MOMENTO QUE CAMBIA LA HISTORIA: Rengoku no luchará solo este amanecer."
          }
        ]
      },
      {
        id: "c4_whatif",
        speaker: "Narrador",
        title: "El amanecer plateado",
        portraitEmoji: "🌅",
        speakerColor: "text-amber-200",
        paragraphs: [
          "Séptima Postura: Bruma que Borra el Horizonte. La pradera entera desaparece bajo un mar de niebla plateada.",
          "Dentro de ella, Akaza pierde lo único en lo que confía: su percepción del espíritu de pelea. Donde debería haber tres presencias hay trescientas; cada gota de vapor refleja una silueta falsa.",
          "«¡¿DÓNDE?! ¡¿DÓNDE ESTÁIS?!»",
          "La respuesta llega en forma de sangre explosiva: Nezuko detona la bruma entera como un cielo de fuegos artificiales rosados. El fuego demoníaco no quema a los humanos... pero convierte cada partícula de niebla en una lente ardiente.",
          "Y el sol asoma por la cresta de la montaña.",
          "Mil espejos de bruma multiplican el primer rayo. Para Akaza, el amanecer llega desde TODAS las direcciones a la vez. Con un alarido, se arranca del cerco y huye hacia el bosque, humeando, dejando atrás un brazo carbonizado.",
          "Kyojuro Rengoku sigue en pie. Herido, tuerto... y gloriosamente VIVO."
        ],
        nextNodeId: "c4_epilogo"
      },
      {
        id: "c4_epilogo",
        speaker: "Kyojuro Rengoku",
        portraitEmoji: "🔥",
        speakerColor: "text-orange-400",
        paragraphs: [
          "El Pilar de la Llama os mira largamente: al prometido cubierto de rocío plateado y a la demonio que ahora duerme agotada en brazos de él, con el lazo rosa chamuscado en las puntas.",
          "«...Muchacho. Esta mañana debí morir. Lo sentí en los huesos: era mi hora. Y vosotros dos la habéis cambiado con un truco de festival.» Se ríe con el pecho entero, y luego, muy serio, apoya su mano en la cabeza de Nezuko, como un hermano mayor.",
          "«¡He decidido! ¡Cuando esa joven recupere su humanidad, YO custodiaré vuestra boda! ¡Y si Muzan quiere impedirla... TENDRÁ QUE PASAR SOBRE LA LLAMA, LA BRUMA Y EL AGUA JUNTAS!»",
          "«¡¡ARDE ENCENDIDO, {fullName}!! ¡¡TU CORAZÓN YA LO HACE!!»"
        ],
        choices: [
          {
            text: "Continuar: rumbo a la cura y a la batalla final",
            nextNodeId: "c5_1"
          }
        ]
      }
    ]
  },
  {
    id: "cap_8",
    number: 8,
    title: "Capítulo 8: El Castillo Infinito y la Promesa de los Cerezos",
    location: "Castillo Infinito → Aldea del Monte Kumotori",
    synopsis: "Con Rengoku vivo, Tamayo completa la cura antes de tiempo. El asalto final a Muzan tiene un arma que ningún universo tuvo: una novia que eligió ser humana... y un novio cuya bruma trae el sol.",
    mission: {
      title: "Operación amanecer: derrotar a Muzan",
      briefing: "Reúne al Cuerpo, atraviesa el Castillo Infinito, derrota a Muzan y acompaña a Nezuko durante la cura y el regreso a casa.",
      objectives: [
        { id: "final-plan", label: "Acuerda con Nezuko el plan para la batalla final", completeOnNodeIds: ["c5_1"] },
        { id: "final-castle", label: "Reúne al equipo y alcanza el salón de Muzan", completeOnNodeIds: ["c5_castillo"] },
        { id: "final-muzan", label: "Enfrenta al Rey Demonio y coordina el amanecer", completeOnNodeIds: ["c5_muzan", "c5_final"] },
        { id: "final-cure", label: "Acompaña a Nezuko mientras recupera su humanidad", completeOnNodeIds: ["c5_nezuko"] },
        { id: "final-epilogue", label: "Completa el regreso a la aldea y la promesa de los cerezos", completeOnNodeIds: ["c5_boda"] },
      ],
    },
    nodes: [
      {
        id: "c5_1",
        speaker: "Tamayo",
        title: "La médica demonio",
        portraitEmoji: "💉",
        speakerColor: "text-violet-300",
        paragraphs: [
          "«La sangre de Nezuko es extraordinaria. Dos años resistiendo a Muzan sin devorar a nadie... y un factor que no logro cuantificar: cada muestra que tomo cuando está cerca de ti, {firstName}, muestra células humanas regenerándose solas.»",
          "Tamayo alza la jeringa con el suero ámbar: la cura. Terminada meses antes que en cualquier otra línea temporal, gracias a los datos de la sangre de Nezuko... y de Rengoku vivo escoltando cada entrega de muestras.",
          "«Podéis administrarla ahora y ella será humana esta misma noche... o podéis esperar. Porque si entra al Castillo Infinito siendo demonio, su sangre explosiva podría ser la diferencia entre la victoria y el exterminio. La decisión... no es mía.»",
          "Nezuko os mira a todos. Luego toma tu mano, se la lleva a su propia mejilla... y niega con la cabeza, señalando la jeringa y después la oscuridad del horizonte. Lo ha decidido ella: primero la guerra. Después la boda."
        ],
        choices: [
          {
            text: "«...Está bien. Terminemos esto juntos, como empezó: tú y yo. Pero me debes un paseo bajo los cerezos.»",
            nextNodeId: "c5_castillo",
            consequence: "Respetas la decisión de Nezuko. Ella pelea la batalla final a vuestro lado."
          }
        ]
      },
      {
        id: "c5_castillo",
        speaker: "Narrador",
        title: "El asalto",
        portraitEmoji: "🏯",
        speakerColor: "text-red-400",
        paragraphs: [
          "El Castillo Infinito se traga al Cuerpo entero. Pero esta vez las cuentas son otras:",
          "Rengoku VIVO pelea junto a Akaza... y sus palabras sobre la belleza de la vida mortal, repetidas por segunda vez, quiebran algo en la memoria del demonio: 'Hakuji... el que protegía el dojo de su maestro'. Akaza decapita su propio pasado y se deja consumir por el alba llorando el nombre de Koyuki.",
          "Muichiro, con la memoria intacta y su primo de la bruma cubriéndole el flanco, derrota a Kokushibo sin perder un solo miembro: dos nieblas de la misma sangre, una antigua y una plateada, enredando los seis ojos de la Luna Uno.",
          "Y al final de todos los pasillos... el salón del trono. Muzan Kibutsuji."
        ],
        nextNodeId: "c5_muzan"
      },
      {
        id: "c5_muzan",
        speaker: "Muzan Kibutsuji",
        title: "El Rey Demonio",
        portraitEmoji: "🩸",
        speakerColor: "text-red-600",
        paragraphs: [
          "«Así que tú eres el anómalo. El humano cuyo olor está impregnado en la sangre de la demonio que se niega a obedecerme.»",
          "Muzan emerge de su crisálida, tentáculos dorsales batiendo el aire a velocidad de látigo. Sus ojos carmesí se fijan en Nezuko con un odio biológico, celular:",
          "«Dos años. DOS AÑOS mi sangre gritándole que devore, y esa cosa eligió... ¿QUÉ? ¿Un leñador? ¿Una BODA?» Su voz se astilla en siete tonos. «¡LOS LAZOS HUMANOS SON UNA ENFERMEDAD! ¡Y ESTA NOCHE LOS CURARÉ A TODOS DE GOLPE!»",
          "Nezuko da un paso al frente. Se arranca el bambú de la boca ella misma. Y por primera vez en dos años, su voz —ronca, oxidada, hermosa— llena el salón del trono:",
          "«{firstName}... los cerezos... ya casi... florecen.»"
        ],
        choices: [
          {
            text: "«Lo sé. Acabemos rápido. ¡¡TODOS: EL AMANECER ES NUESTRO!!»",
            nextNodeId: "c5_final",
            consequence: "La última batalla de la era de los demonios comienza."
          }
        ]
      },
      {
        id: "c5_final",
        speaker: "Narrador",
        title: "El alba definitiva",
        portraitEmoji: "✨",
        speakerColor: "text-amber-200",
        paragraphs: [
          "La batalla devora la noche entera. Agua, Llama, Viento, Piedra, Serpiente, Amor, Niebla: todos los estilos tejen un muro de acero alrededor del Rey Demonio mientras los venenos de Tamayo y Shinobu le pudren los siglos por dentro.",
          "Y cuando el cielo del este empieza a palidecer, Muzan intenta lo de siempre: huir, enterrarse, esperar otro milenio.",
          "Pero el cielo se cierra sobre él: Bruma que Borra el Horizonte, más vasta que nunca, alimentada por el oxígeno de los nueve Pilares respirando a la vez.",
          "Y dentro de la niebla, Nezuko Kamado abraza al Rey Demonio por la espalda... y detona TODA su sangre de una sola vez.",
          "La bruma entera se vuelve un sol. No un reflejo: un sol de verdad, nacido de mil millones de lentes de vapor ardiente. Muzan Kibutsuji, el hombre que huyó de la luz durante mil años, muere dentro de un amanecer fabricado por los lazos que juró que eran enfermedad.",
          "Sus últimas células se preguntan, hasta el final, por qué la demonio sonreía mientras ardía con él."
        ],
        nextNodeId: "c5_nezuko"
      },
      {
        id: "c5_nezuko",
        speaker: "Narrador",
        title: "La cura",
        portraitEmoji: "🌸",
        speakerColor: "text-pink-300",
        paragraphs: [
          "La encuentras entre los escombros del castillo que se deshace, humeante, con el pelo blanqueado por su propia detonación... y viva. La sangre de Muzan ardió; la suya, la que la hacía ELLA, resistió.",
          "Tamayo, sostenida por Yushiro, se arrastra hasta vosotros con la última jeringa intacta.",
          "«Es la hora, niña.»",
          "Nezuko no mira la jeringa. Te mira a ti. Extiende su brazo sin dejar de mirarte, y cuando el suero entra en su sangre y las venas demoníacas se apagan una a una como farolillos al amanecer, lo único que queda son sus ojos. Los mismos ojos rosados de la niña que te cambiaba sonrisas por castañas.",
          "Sus primeras palabras como humana, con la voz entera y el sol de verdad saliendo detrás de la montaña:",
          "{firstName}... llegas tarde... a nuestra boda... desde hace dos años.»"
        ],
        nextNodeId: "c5_boda"
      },
      {
        id: "c5_boda",
        speaker: "Narrador",
        title: "Epílogo: Hanami",
        portraitEmoji: "🌸",
        speakerColor: "text-pink-300",
        paragraphs: [
          "Primavera. Aldea del Monte Kumotori. Los cerezos del sendero llueven pétalos de verdad.",
          "Rengoku, tal y como juró, custodia la ceremonia con su haori llameante y llora sin ningún disimulo. Muichiro —tu primo de bruma— sostiene los anillos sin perderse en las nubes ni una sola vez. Zenitsu solloza de envidia, Inosuke intenta comerse las ofrendas, y Shinobu sonríe sin tristeza por primera vez en años.",
          "Tanjiro, cuñado al fin, abraza a todo el que se deja. Su olfato jura que hoy la montaña entera huele a felicidad.",
          "Nezuko Kamado —desde hoy, Nezuko {lastName}— camina hacia ti de kimono blanco, con un lazo rosa nuevo en el pelo y las manos ásperas de quien sobrevivió a mil noches. Reales. Tibias. Humanas.",
          "La bruma baja del monte como cada atardecer. Ya no esconde monstruos. Solo envuelve, suave y plateada, la promesa que ningún demonio pudo romper.",
          "— FIN DE 'HOJAS EN LA BRUMA: LA PROMESA DE LOS CEREZOS' (LÍNEA WHAT IF) —"
        ],
        choices: [
          {
            text: "Releer desde el Prólogo",
            nextNodeId: "p0_1"
          }
        ]
      }
    ]
  }
];

export function findNodeById(nodeId: string): { node: StoryNode; chapter: StoryChapter } | null {
  for (const chap of WHAT_IF_STORY) {
    for (const node of chap.nodes) {
      if (node.id === nodeId) {
        return { node, chapter: chap };
      }
    }
  }
  return null;
}
