import type { StoryChapter } from "./storyData";

/** Arcos de misiones canónicas que anteceden a Natagumo en esta línea What If. */
export const CANONICAL_ARCS: StoryChapter[] = [
  {
    id: "cap_2",
    number: 2,
    title: "Capítulo 2: Primer encargo — El pantano del noroeste",
    location: "Pueblo del noroeste — una aldea que pierde a sus jóvenes",
    synopsis: "Tras la Selección Final, el Cuervo Kasugai asigna a Tanjiro y a ti una misión concreta: hallar a las muchachas desaparecidas, rescatar a Satoko y volver con un informe.",
    mission: {
      title: "Primera misión: demonio del pantano",
      briefing: "Sigue el rastro de las desapariciones, averigua qué ocurrió con Satoko y derrota al demonio antes del amanecer.",
      objectives: [
        { id: "swamp-orders", label: "Recibe la orden oficial del Cuervo Kasugai", completeOnNodeIds: ["m1_1"] },
        { id: "swamp-clue", label: "Habla con Kazumi y reúne pistas sobre las desapariciones", completeOnNodeIds: ["m1_kazumi", "m1_tracks"] },
        { id: "swamp-enter", label: "Sigue el rastro hasta la entrada del pantano", completeOnNodeIds: ["m1_swamp_entry"] },
        { id: "swamp-phase", label: "Resiste la emboscada de las copias del demonio", completeOnNodeIds: ["m1_swamp_phase2"] },
        { id: "swamp-rescue", label: "Rescata a Satoko y derrota al demonio del pantano", completeOnNodeIds: ["m1_swamp_end"] },
        { id: "swamp-report", label: "Entrega el informe y espera la siguiente orden", completeOnNodeIds: ["m1_report"] },
      ],
    },
    nodes: [
      {
        id: "m1_1",
        speaker: "Cuervo Kasugai",
        title: "Primera misión oficial",
        portraitEmoji: "🐦‍⬛",
        speakerColor: "text-yellow-300",
        paragraphs: [
          "«¡GRAAAC! ¡Kamado Tanjiro! ¡{fullName}! ¡Primera misión! ¡Pueblo del noroeste! ¡Mujeres jóvenes desaparecidas en noches sin luna! ¡Encontrad al demonio y regresad con informe antes del amanecer!»",
          "El cuervo deja caer un pequeño mapa sobre la mesa. Urokodaki insiste en que una misión no termina al cortar un cuello: hay que proteger a los vivos, confirmar que no quede una amenaza y comunicar el resultado.",
          "Tanjiro ajusta la correa de la caja de Nezuko. Tú compruebas el filo plateado. La primera salida como equipo comienza ahora."
        ],
        nextNodeId: "m1_arrive"
      },
      {
        id: "m1_arrive",
        speaker: "Narrador",
        title: "El pueblo sin canciones",
        portraitEmoji: "🏘️",
        speakerColor: "text-slate-300",
        paragraphs: [
          "Llegáis al pueblo cuando cae la tarde. Las puertas se cierran antes del crepúsculo y nadie deja faroles encendidos en las ventanas.",
          "Un joven llamado Kazumi espera en la plaza con las manos apretadas. Su prometida Satoko desapareció anoche. En el barro hay marcas que se hunden en la tierra y vuelven a salir varios metros más allá.",
          "Tanjiro se arrodilla para oler las huellas. «No es un solo rastro. El olor se divide y vuelve a unirse... como si algo entrara y saliera de debajo del suelo.»"
        ],
        nextNodeId: "m1_kazumi"
      },
      {
        id: "m1_kazumi",
        speaker: "Kazumi",
        title: "El prometido de Satoko",
        portraitEmoji: "🧣",
        speakerColor: "text-orange-200",
        paragraphs: [
          "«Todos dicen que debo olvidarla porque ya no está. No puedo. Íbamos a casarnos en otoño.» Kazumi baja la vista, avergonzado por llorar delante de cazadores.",
          "El dolor se te hace familiar. Tanjiro apoya una mano en el hombro de Kazumi y no le promete que todo saldrá bien; le promete que buscaréis hasta el último rastro.",
          "La caja de Nezuko golpea suavemente una vez contra la espalda de Tanjiro. Ella también ha oído hablar de otra pareja separada por la noche."
        ],
        choices: [
          {
            text: "«Cuéntanos exactamente dónde la viste por última vez. No perderemos la pista.»",
            nextNodeId: "m1_tracks",
            consequence: "Obtienes la última ruta conocida de Satoko."
          },
          {
            text: "Pedir a Kazumi que describa el olor y el sonido de la noche de la desaparición.",
            nextNodeId: "m1_tracks",
            consequence: "Combinas el testimonio del pueblo con el olfato de Tanjiro."
          }
        ]
      },
      {
        id: "m1_tracks",
        speaker: "Tanjiro Kamado",
        portraitEmoji: "🎴",
        speakerColor: "text-emerald-300",
        paragraphs: [
          "Tanjiro recorre el camino con los ojos cerrados. «Sangre demoníaca. Tierra mojada. Y miedo... muchísimo miedo.»",
          "Las huellas terminan junto a un campo anegado. Tú descubres algo que el olfato no alcanza: el barro forma tres depresiones circulares, como bocas abiertas bajo la superficie.",
          "El cuervo grazna desde un poste: «¡Objetivo localizado! ¡No os separéis sin acordar una señal!»"
        ],
        nextNodeId: "m1_swamp_entry"
      },
      {
        id: "m1_swamp_entry",
        speaker: "Demonio del Pantano",
        title: "Demonio de tres cuerpos",
        portraitEmoji: "🫧",
        speakerColor: "text-violet-300",
        paragraphs: [
          "El suelo se abre sin salpicar. Tres cuerpos de demonio emergen de charcos distintos, unidos a un pantano que parece no tener fondo.",
          "«Una chica más y me marcho. Los humanos siempre llegan tarde.» Una de las criaturas se hunde con Satoko atrapada bajo el brazo; las otras dos se lanzan hacia vosotros.",
          "Tanjiro quiere ir tras la víctima. Tú ves que las otras copias intentan obligarlo a abandonar el borde. Nezuko golpea desde dentro de la caja: sabe que el equipo está a punto de separarse."
        ],
        choices: [
          {
            text: "Cubrir a Tanjiro mientras se lanza al pantano por Satoko.",
            nextNodeId: "m1_swamp_phase2",
            consequence: "Priorizas el rescate y mantienes a raya a dos cuerpos del demonio."
          },
          {
            text: "Cortar las rutas de escape de las copias antes de que se hundan.",
            nextNodeId: "m1_swamp_phase2",
            consequence: "Priorizas impedir que el demonio desaparezca bajo tierra."
          }
        ]
      },
      {
        id: "m1_swamp_phase2",
        speaker: "Narrador",
        title: "Combate en tres frentes",
        portraitEmoji: "⚔️",
        speakerColor: "text-cyan-200",
        paragraphs: [
          "La primera copia ataca desde el suelo; la segunda surge a vuestra espalda y la tercera arrastra a Tanjiro y Satoko hacia un corredor de barro imposible.",
          "Tu Bruma Plateada marca las salidas del pantano como destellos en la niebla. Tanjiro usa la Respiración del Agua para mantener abierta una corriente de aire; tú sigues el reflejo de tu propia hoja hasta hallar el cuerpo verdadero.",
          "Una garra alcanza a Tanjiro. Nezuko rompe la tapa de la caja lo justo para patear la copia que se le aferra, y vuelve a cubrirse antes de que la luz de la luna toque su piel.",
          "El demonio pierde la ventaja de atacar desde todas partes. Ahora los tres cuerpos comparten un único ritmo: cuando uno respira, los otros dos se estremecen."
        ],
        nextNodeId: "m1_swamp_end"
      },
      {
        id: "m1_swamp_end",
        speaker: "Narrador",
        title: "Satoko vuelve a la superficie",
        portraitEmoji: "🌅",
        speakerColor: "text-amber-200",
        paragraphs: [
          "Tanjiro corta el agua alrededor de Satoko, tú atraviesas la raíz que alimenta las copias y Nezuko detona la última capa de barro con una patada envuelta en fuego rosa.",
          "Las tres formas se desploman al mismo tiempo. El cuello verdadero queda expuesto y Tanjiro lo corta con un tajo limpio. El demonio se deshace antes de que el cielo empiece a clarear.",
          "Kazumi abraza a Satoko en la orilla. No hay palabras que reparen la noche que han pasado; aun así, los dos están vivos y pueden decidir juntos qué harán con el mañana."
        ],
        nextNodeId: "m1_report"
      },
      {
        id: "m1_report",
        speaker: "Cuervo Kasugai",
        title: "Informe de misión",
        portraitEmoji: "🐦‍⬛",
        speakerColor: "text-yellow-300",
        paragraphs: [
          "«¡Misión cumplida! ¡Víctima rescatada! ¡Demonio eliminado! ¡Informe recibido!» El cuervo picotea el mapa hasta marcar una nueva ciudad con tinta roja.",
          "La siguiente orden es Asakusa. Allí se ha detectado una presencia demoníaca de enorme intensidad y el rastro apunta a un hombre de sombrero occidental.",
          "Tanjiro levanta la cabeza de golpe. «Ese olor... lo conozco. Es el mismo que quedó en la casa de mi familia.»"
        ],
        choices: [
          { text: "Partir hacia Asakusa siguiendo la nueva orden", nextNodeId: "a1_1" }
        ]
      }
    ]
  },
  {
    id: "cap_3",
    number: 3,
    title: "Capítulo 3: Asakusa — El rastro del Rey Demonio",
    location: "Asakusa — calles iluminadas por faroles de gas",
    synopsis: "La misión es investigar el rastro que dejó Muzan sin poner en peligro a los civiles. Tamayo y Yushiro ofrecen una posible ruta para investigar una cura para Nezuko.",
    mission: {
      title: "Rastreo en Asakusa",
      briefing: "Investiga el olor que sigue Tanjiro, protege a los civiles y consigue la ayuda de Tamayo antes de aceptar el próximo encargo.",
      objectives: [
        { id: "asakusa-arrive", label: "Llega a Asakusa e identifica el rastro demoníaco", completeOnNodeIds: ["a1_1"] },
        { id: "asakusa-muzan", label: "Averigua quién es el hombre del sombrero sin poner a los civiles en riesgo", completeOnNodeIds: ["a1_muzan", "a1_protect"] },
        { id: "asakusa-tamayo", label: "Encuentra a Tamayo y escucha su propuesta", completeOnNodeIds: ["a1_tamayo"] },
        { id: "asakusa-plan", label: "Acepta reunir muestras de sangre demoníaca", completeOnNodeIds: ["a1_samples"] },
        { id: "asakusa-order", label: "Recibe la siguiente misión del Cuervo Kasugai", completeOnNodeIds: ["a1_order"] },
      ],
    },
    nodes: [
      {
        id: "a1_1",
        speaker: "Narrador",
        title: "La capital de noche",
        portraitEmoji: "🏮",
        speakerColor: "text-slate-300",
        paragraphs: [
          "Asakusa os recibe con carruajes, escaparates eléctricos y gente que camina sin sospechar que los demonios existen. Para Nezuko, viajáis con la caja cerrada y cubierta por un haori.",
          "Tanjiro se queda inmóvil en medio de la multitud. Su olfato ha encontrado el mismo rastro de la noche de la masacre, más fuerte que nunca.",
          "Entre los faroles aparece un hombre de sombrero de copa, acompañado por una mujer y una niña. Muzan Kibutsuji parece un padre común. Solo su olor revela el monstruo."
        ],
        nextNodeId: "a1_muzan"
      },
      {
        id: "a1_muzan",
        speaker: "Muzan Kibutsuji",
        title: "El Rey Demonio entre humanos",
        portraitEmoji: "🩸",
        speakerColor: "text-red-500",
        paragraphs: [
          "Tanjiro da un paso, pero Muzan ya ha visto su hanafuda. Sus ojos se detienen en ti y en la caja que lleváis cubierta.",
          "«Qué coincidencia tan desagradable. Dos cazadores jóvenes y una presencia que no debería existir.» Muzan roza a un transeúnte al pasar; el hombre cae convulsionando, con sangre demoníaca invadiendo sus venas.",
          "No podéis desenvainar en una avenida llena de familias. Si atacáis sin pensar, Muzan usará a los civiles como escudo."
        ],
        choices: [
          {
            text: "Apartar a los civiles y ayudar al hombre transformado, aunque Muzan escape.",
            nextNodeId: "a1_protect",
            consequence: "Prioriza salvar una vida; Tanjiro conserva el rastro de Muzan."
          },
          {
            text: "Seguir a Muzan por los tejados mientras Tanjiro protege al transeúnte.",
            nextNodeId: "a1_protect",
            consequence: "Dividís la tarea para no dejar a los civiles indefensos."
          }
        ]
      },
      {
        id: "a1_protect",
        speaker: "Narrador",
        portraitEmoji: "🛡️",
        speakerColor: "text-cyan-200",
        paragraphs: [
          "La multitud huye cuando el hombre transformado se abalanza sobre su propia familia. Tanjiro lo contiene sin herirlo de gravedad; tú y Nezuko abrís un corredor para que la esposa y la niña escapen.",
          "Muzan desaparece entre los callejones. Su última mirada promete que volverá por vosotros, pero la familia está a salvo.",
          "Una mujer de cabello oscuro os observa desde una puerta lateral. A su lado, un joven de mirada severa parece desaparecer y reaparecer con cada parpadeo."
        ],
        nextNodeId: "a1_tamayo"
      },
      {
        id: "a1_tamayo",
        speaker: "Tamayo",
        title: "Médica y demonio renegada",
        portraitEmoji: "💉",
        speakerColor: "text-pink-300",
        paragraphs: [
          "«Me llamo Tamayo. Él es Yushiro. No servimos a Muzan.» La voz de Tamayo es serena, pero mantiene la distancia de quien sabe que cualquier error puede costarle la vida.",
          "«He observado a Nezuko. Dos años sin consumir humanos y todavía conserva vínculos, memoria y voluntad. No puedo prometer una cura, pero su sangre podría acercarnos a ella.»",
          "Nezuko asoma un ojo por la abertura de la caja. Tamayo no la mira como una amenaza: le habla como a una paciente y le ofrece un lugar seguro donde descansar."
        ],
        nextNodeId: "a1_samples"
      },
      {
        id: "a1_samples",
        speaker: "Tamayo",
        portraitEmoji: "🧪",
        speakerColor: "text-violet-300",
        paragraphs: [
          "«Necesito muestras de demonios con sangre más concentrada. No hace falta que los matéis si existe otra manera, pero no arriesguéis a Nezuko por una hipótesis mía.»",
          "Tanjiro acepta. Tú le pides a Tamayo que guarde también una muestra de la sangre de Nezuko, con su consentimiento, para entender por qué resiste la voluntad de Muzan.",
          "Tamayo asiente. «No será una cura inmediata. Será trabajo, paciencia y misiones bien cumplidas.»"
        ],
        nextNodeId: "a1_order"
      },
      {
        id: "a1_order",
        speaker: "Cuervo Kasugai",
        portraitEmoji: "🐦‍⬛",
        speakerColor: "text-yellow-300",
        paragraphs: [
          "El cuervo aterriza sobre un farol: «¡Nueva misión! ¡Mansión de los tambores! ¡Niños desaparecidos! ¡Ruidos de tsuzumi en una casa que cambia de forma!»",
          "Tamayo os entrega un pequeño frasco para cada demonio derrotado. «Una gota basta. Y, por favor... volved vivos.»",
          "Desde la caja, Nezuko golpea dos veces: la señal que inventasteis de niños para decir 'estoy contigo'."
        ],
        choices: [
          { text: "Dirigirse a la Mansión de los Tambores", nextNodeId: "d1_1" }
        ]
      }
    ]
  },
  {
    id: "cap_4",
    number: 4,
    title: "Capítulo 4: La Mansión de los Tambores — El primer aliado",
    location: "Mansión Tsuzumi — habitaciones que giran al ritmo de un tambor",
    synopsis: "La misión es encontrar a los hermanos Teruko y Shoichi y detener a Kyogai. En la casa conoces a Zenitsu, que pasa del pánico a los celos cuando descubre que Nezuko es tu prometida.",
    mission: {
      title: "Rescate en la Mansión Tsuzumi",
      briefing: "Localiza a los hermanos desaparecidos, derrota a Kyogai y protege a quienes no pueden luchar.",
      objectives: [
        { id: "drum-orders", label: "Recibe la misión de rescate y llega a la mansión", completeOnNodeIds: ["d1_1"] },
        { id: "drum-zenitsu", label: "Conoce a Zenitsu y deja claro el compromiso con Nezuko", completeOnNodeIds: ["d1_zenitsu"] },
        { id: "drum-children", label: "Encuentra a Teruko y Shoichi dentro de la casa cambiante", completeOnNodeIds: ["d1_house"] },
        { id: "drum-defend", label: "Ayuda a Zenitsu a proteger la caja y a los niños", completeOnNodeIds: ["d1_zenitsu_crush"] },
        { id: "drum-phase1", label: "Resiste la primera rotación de la mansión", completeOnNodeIds: ["d1_phase1"] },
        { id: "drum-phase2", label: "Reúne al equipo y encuentra el ritmo de Kyogai", completeOnNodeIds: ["d1_phase2"] },
        { id: "drum-finish", label: "Derrota a Kyogai y confirma que los niños están a salvo", completeOnNodeIds: ["d1_final"] },
        { id: "drum-report", label: "Entrega el informe y recibe la orden para Natagumo", completeOnNodeIds: ["d1_report"] },
      ],
    },
    nodes: [
      {
        id: "d1_1",
        speaker: "Cuervo Kasugai",
        title: "Encargo de rescate",
        portraitEmoji: "🐦‍⬛",
        speakerColor: "text-yellow-300",
        paragraphs: [
          "«¡Misión de rescate! ¡Dos menores vistos cerca de una mansión abandonada! ¡El sonido de tambores cambia la distribución de las habitaciones! ¡Localizad a los niños y eliminad la amenaza!»",
          "La casa está en medio de un bosque. A cada golpe grave, las puertas se deslizan y los pasillos se giran como una caja de rompecabezas.",
          "Un joven rubio con uniforme de cazador está arrodillado frente a una muchacha del pueblo, suplicándole que se case con él. Al veros, se agarra a Tanjiro como si fueran viejos amigos."
        ],
        nextNodeId: "d1_zenitsu"
      },
      {
        id: "d1_zenitsu",
        speaker: "Zenitsu Agatsuma",
        title: "El cazador del trueno",
        portraitEmoji: "⚡",
        speakerColor: "text-yellow-300",
        paragraphs: [
          "«¡Tanjiro! ¡Gracias a los cielos! Hay un demonio ahí dentro y yo no quiero morir, no quiero morir, no quiero morir...»",
          "Su mirada cae sobre la caja que Tanjiro lleva a la espalda. Tú explicas que dentro está Nezuko, tu amiga de la infancia y tu prometida. Zenitsu se queda inmóvil, como si acabara de recibir un rayo en pleno corazón.",
          "«¿Prometida? ¿TÚ ya tienes prometida? ¡Yo llevo toda la vida buscando esposa y tú tienes una esperándote desde la infancia!» Se gira hacia ti con lágrimas de indignación. «No te conozco y ya te odio, {lastName}. ¡Esto es injusto!»",
          "Tanjiro le recuerda que hay niños desaparecidos. Zenitsu traga saliva, tiembla entero y, aun así, no se marcha. «Está bien... pero que conste que te vigilaré, rival romántico.»"
        ],
        nextNodeId: "d1_house"
      },
      {
        id: "d1_house",
        speaker: "Narrador",
        title: "Los niños perdidos",
        portraitEmoji: "🏚️",
        speakerColor: "text-slate-300",
        paragraphs: [
          "Dentro de la mansión encontráis a Teruko, que busca a su hermano Shoichi. Cada golpe de tambor arroja a una persona a otra habitación; el demonio controla el espacio desde el centro de la casa.",
          "Inosuke Hashibira irrumpe por una ventana con una máscara de jabalí y dos katanas dentadas. No pregunta quién necesita ayuda: reta a todos a pelear.",
          "El plan queda dividido: Tanjiro y tú escoltáis a Teruko hacia el centro; Zenitsu y Shoichi buscan una salida segura; Inosuke se lanza solo tras el sonido del tambor. Nezuko permanece en la caja, lista para intervenir si los niños quedan en peligro."
        ],
        nextNodeId: "d1_phase1"
      },
      {
        id: "d1_phase1",
        speaker: "Kyogai",
        title: "El demonio de los tambores",
        portraitEmoji: "🥁",
        speakerColor: "text-red-300",
        paragraphs: [
          "Kyogai golpea un tambor incrustado en su torso. La habitación gira noventa grados. Tanjiro choca contra el techo; Teruko cae hacia una pared que ahora es suelo.",
          "Cada tambor tiene una dirección: el del pecho rota la sala, los de los hombros lanzan cortes de aire y el de la espalda os arroja a habitaciones distintas.",
          "No podéis derrotarlo a ciegas. Observas el ritmo entre golpes y ves que la habitación tarda un instante en girar: una ventana mínima para sacar a los niños y volver a formar el equipo."
        ],
        choices: [
          {
            text: "Marcar el ritmo de Kyogai con el filo y guiar a Tanjiro entre los giros.",
            nextNodeId: "d1_zenitsu_crush",
            consequence: "Creas una ruta para reunir al grupo sin dejar atrás a los niños."
          },
          {
            text: "Ordenar a todos que se anclen a las vigas antes del próximo tambor.",
            nextNodeId: "d1_zenitsu_crush",
            consequence: "Proteges al equipo del siguiente cambio brusco de gravedad."
          }
        ]
      },
      {
        id: "d1_zenitsu_crush",
        speaker: "Zenitsu Agatsuma",
        title: "Amor a primera vista… y rivalidad inmediata",
        portraitEmoji: "💛",
        speakerColor: "text-yellow-300",
        paragraphs: [
          "Un tambor abre una grieta en la caja. Nezuko sale de un salto justo cuando una garra iba a alcanzar a Shoichi. Aterriza delante del niño y desvía el golpe con una patada; el fuego rosado de su sangre demoníaca consume la garra sin quemar al pequeño.",
          "Zenitsu la ve por primera vez. Se queda completamente callado. Luego sus mejillas se encienden y sus ojos se convierten en dos corazones. «¡Es preciosa! ¡Nezuko-san, protegeré tu sonrisa hasta el fin de mis días!»",
          "Tanjiro le aclara, con una calma peligrosa, que ella sigue siendo tu prometida. Zenitsu gira hacia ti y su expresión cambia a una rivalidad teatral: «¡Lo sabía! ¡Por eso te odio, {fullName}! ¡Pero no voy a faltarle el respeto a Nezuko-san! La protegeré como amigo... aunque jamás te perdonaré tener tanta suerte.»",
          "Nezuko le ofrece una pequeña reverencia y después toma tu mano, dejando claro dónde está su corazón. Zenitsu cae de rodillas. «¡Me ha saludado! ¡Voy a proteger a mi futura amiga política!»"
        ],
        nextNodeId: "d1_phase2"
      },
      {
        id: "d1_phase2",
        speaker: "Narrador",
        title: "La cadencia del último tambor",
        portraitEmoji: "🎼",
        speakerColor: "text-cyan-200",
        paragraphs: [
          "El grupo vuelve a reunirse. Kyogai golpea los tambores a un ritmo cada vez más rápido, convirtiendo la sala en un molino de tatamis y paredes.",
          "Inosuke mantiene ocupadas las garras; Zenitsu, aterrorizado pero consciente, emplea su velocidad para sacar a Shoichi del pasillo de cortes. Nezuko protege a Teruko, y tú sigues el patrón de los golpes para señalar cuándo se abrirá la habitación central.",
          "Tanjiro reconoce los manuscritos desperdigados por el suelo: son las obras de Kyogai, rechazadas por la gente que él admiraba. No se burla de ellas. «Tu escritura es tuya. Nadie puede quitártela.»",
          "Por primera vez, Kyogai duda. El silencio dura solo un compás; es suficiente para que Tanjiro se acerque."
        ],
        nextNodeId: "d1_final"
      },
      {
        id: "d1_final",
        speaker: "Tanjiro Kamado",
        title: "Una muerte sin desprecio",
        portraitEmoji: "🎴",
        speakerColor: "text-emerald-300",
        paragraphs: [
          "Kyogai lanza un último corte de aire. Tú desvías la trayectoria con la plana de tu Nichirin; Inosuke golpea el tambor del suelo para desestabilizar la sala, y Tanjiro encuentra el ángulo que el demonio dejó abierto.",
          "La cabeza de Kyogai cae. Tanjiro se inclina ante él, respetando el valor que el demonio puso en sus escritos. Kyogai desaparece sin que nadie pisotee sus páginas.",
          "Teruko y Shoichi están a salvo. Inosuke declara que el equipo queda bajo su mando; Zenitsu responde que primero hay que elegir un nombre que no suene aterrador. Nezuko vuelve a la caja, aunque deja una mano fuera para sujetarte la manga."
        ],
        nextNodeId: "d1_report"
      },
      {
        id: "d1_report",
        speaker: "Cuervo Kasugai",
        title: "Siguiente destino: Natagumo",
        portraitEmoji: "🐦‍⬛",
        speakerColor: "text-yellow-300",
        paragraphs: [
          "«¡Misión cumplida! ¡Niños rescatados! ¡Demonio de los tambores eliminado!» El cuervo deja caer una orden nueva: varios escuadrones han desaparecido en el Monte Natagumo.",
          "Zenitsu mira a Nezuko y luego a ti. «Voy porque soy un cazador responsable. No porque quiera impresionarla. Y tampoco porque quiera demostrar que soy mejor que tú. Bueno... quizá un poco.»",
          "Inosuke ya corre montaña arriba. Tanjiro suspira. El equipo, por fin, está completo."
        ],
        choices: [
          { text: "Aceptar la misión de Natagumo con Tanjiro, Nezuko, Zenitsu e Inosuke", nextNodeId: "c2_1" }
        ]
      }
    ]
  }
];
