import type { StoryChapter } from "./storyData";

export const PROLOGUE_CHAPTER: StoryChapter = {
  id: "cap_0", number: 0,
  title: "Prólogo: Una noche bajo la nieve",
  location: "Monte Kumotori — La promesa de los cerezos",
  synopsis: "Tú y Nezuko tenéis diecinueve años. Tanjiro, de veintiuno, ha bajado a buscarte. Aún sois dos jóvenes de la montaña: sin espadas, sin respiraciones y sin rango en el Cuerpo.",
  mission: {
    title: "Una noche bajo la nieve",
    briefing: "Camina con Tanjiro, busca refugio tras la caída y descansa en el tatami de Saburo. Solo al amanecer podréis llegar a la casa Kamado.",
    objectives: [
      { id: "meet-tanjiro", label: "Habla con Tanjiro frente a tu casa", completeOnNodeIds: ["p0_2"] },
      { id: "slope-fall", label: "Acompaña a Tanjiro por la ladera nevada", completeOnNodeIds: ["p0_slope"] },
      { id: "shelter-saburo", label: "Acepta el refugio del viejo Saburo después de la caída", completeOnNodeIds: ["p0_3b"] },
      { id: "sleep-tatami", label: "Descansa en el tatami hasta el amanecer", completeOnNodeIds: ["p0_morning"] },
      { id: "reach-kamado", label: "Sube a la casa Kamado por la mañana", completeOnNodeIds: ["p0_3"] },
      { id: "calm-nezuko", label: "Esquiva a Nezuko y encuentra las palabras que la calmen", completeOnNodeIds: ["p0_4_calm"] },
      { id: "face-giyu", label: "Resiste al Pilar del Agua sin ceder", completeOnNodeIds: ["p0_5_stand"] },
      { id: "giyu-referral", label: "Escucha a Giyu y parte hacia el Monte Sagiri", completeOnNodeIds: ["p0_5"] },
    ],
  },
  nodes: [
    {
      id: "p0_1", speaker: "Narrador", title: "Kumotori · 21:40", portraitEmoji: "❄️", speakerColor: "text-slate-200",
      paragraphs: [
        "Nieva con fuerza desde el atardecer. Los copos llenan la aldea, amortiguan los pasos y se amontonan sobre los tejados. Hay viento, pero todavía podéis caminar y distinguir las luces de las casas.",
        "Te llamas {fullName}, tienes diecinueve años y eres el prometido de Nezuko Kamado, tu amiga de la infancia. No llevas una katana ni uniforme de cazador. Tu vida, hasta esta noche, está hecha de leña, caminos conocidos y planes de boda.",
        "Alguien te llama junto al farol de la entrada. Es Tanjiro, el hermano mayor de Nezuko, con las mejillas rojas de frío. Ha bajado de la montaña para buscarte."
      ], nextNodeId: "p0_2",
    },
    {
      id: "p0_2", speaker: "Tanjiro Kamado", title: "Tu futuro cuñado · 21 años", portraitEmoji: "🎴", speakerColor: "text-emerald-300",
      paragraphs: [
        "«¡{firstName}! Mamá quería que habláramos de la boda. Nezuko ha preparado algo para ti, pero no me ha querido decir qué es.»",
        "Tanjiro se sacude el haori a cuadros. Él tampoco lleva espada. Solo una bolsa de viaje y el farol que ha protegido del viento durante la bajada.",
        "«Deberíamos subir juntos antes de que empeore. Iremos despacio. Si el camino se pone peligroso, buscamos un techo; no quiero que mi hermana me regañe por traer a su prometido hecho un carámbano.»"
      ],
      choices: [
        { text: "«Vamos juntos. Lleva el farol; yo seguiré tus huellas.»", nextNodeId: "p0_2_out", consequence: "Tanjiro te acompaña por el sendero de la ladera." },
        { text: "«Si la nieve empeora, nos refugiamos. Nada de arriesgarnos.»", nextNodeId: "p0_2_out", consequence: "Acordáis buscar refugio si la montaña no os deja pasar." },
      ],
    },
    {
      id: "p0_2_out", speaker: "Narrador", title: "El sendero de la colina", portraitEmoji: "🏮", speakerColor: "text-slate-200",
      paragraphs: ["Dejáis atrás la aldea. Tanjiro camina contigo, sin soltarte de vista. La nevada es intensa, pero no os arrastra: todavía elegís cada paso.", "Más arriba, el farol revela una franja de nieve nueva. Debajo, el borde del sendero ha perdido su apoyo."], nextNodeId: "p0_slope",
    },
    {
      id: "p0_slope", speaker: "Tanjiro Kamado", title: "La cornisa", portraitEmoji: "🌨️", speakerColor: "text-emerald-300",
      paragraphs: ["«Espera... el suelo suena hueco. ¡No apoyes ahí!»", "La nieve cede antes de que puedas retroceder. Tanjiro intenta sujetarte; el borde se rompe bajo sus pies también. Los dos perdéis el equilibrio y rodáis ladera abajo."], nextNodeId: "p0_3b",
    },
    {
      id: "p0_3b", speaker: "Viejo Saburo", title: "Al pie de la pendiente · 22:15", portraitEmoji: "🏮", speakerColor: "text-amber-200",
      paragraphs: [
        "Acabáis hundidos en un montón de nieve junto al recodo. Tanjiro se incorpora, dolorido, y comprueba que sigues a su lado. Estáis magullados, pero podéis caminar.",
        "Una puerta se abre. Saburo aparece con una lámpara: «¡He oído la caída! Venid, muchachos. No os quedéis ahí empapados.»",
        "«Podéis pasar la noche en mi casa. Hay un cuarto, un baño y un tatami con sábanas limpias. La cama es mía; he preparado sitio para vosotros junto a ella.»",
        "Tanjiro inclina la cabeza. «Gracias, señor Saburo. No volveremos a subir hasta que sea seguro.» El anciano os hace pasar y cierra la puerta contra la nieve."
      ], nextNodeId: "p0_sleep",
    },
    {
      id: "p0_sleep", speaker: "Narrador", title: "El tatami preparado", portraitEmoji: "🛏️", speakerColor: "text-amber-200",
      paragraphs: ["El cuarto huele a madera seca y a ropa limpia. Sobre el tatami, una sábana doblada, una almohada y una manta os esperan. Detrás de la puerta del baño hay agua para lavaros las manos.", "Afuera continúa nevando. No es hablar con Saburo lo que hará llegar la mañana: os queda decidir cuándo acostaros."],
      choices: [{ text: "Dormir en el tatami hasta el amanecer", nextNodeId: "p0_morning", consequence: "Pasan las horas. La tormenta termina mientras descansáis." }],
    },
    {
      id: "p0_morning", speaker: "Tanjiro Kamado", title: "Cabaña de Saburo · 06:15", portraitEmoji: "🌅", speakerColor: "text-emerald-300",
      paragraphs: ["«{firstName}... ya es de día. Escucha: el viento ha parado.»", "Una franja dorada cruza las sábanas. Al otro lado del shōji queda nieve sobre el suelo, pero ya no cae ningún copo. Habéis descansado toda la noche.", "«Demos las gracias a Saburo y salgamos por la puerta. Ahora sí podemos ir a casa. Nezuko estará preguntándose dónde nos metimos.»"], nextNodeId: "p0_3",
    },
    {
      id: "p0_3", speaker: "Narrador", title: "La casa de los Kamado", portraitEmoji: "🌄", speakerColor: "text-slate-200",
      paragraphs: ["Recorréis de nuevo la ladera, esta vez bajo la luz de la mañana. La nieve conserva las marcas de vuestra caída. Tanjiro te ofrece la mano en el tramo estrecho.", "Cerca de la casa, su expresión cambia. «...Sangre. {firstName}... huele a sangre.»", "Corréis hasta el alero. La familia Kamado yace inmóvil sobre la nieve. Nezuko está junto a la puerta, aferrada a su hermano pequeño. Todavía respira.", "Te arrodillas junto a tu prometida. Hay algo extraño en sus ojos rosados y en los colmillos que asoman entre sus labios, pero no vas a abandonarla."],
    },
    {
      id: "p0_4", speaker: "Nezuko Kamado", title: "Tu prometida", portraitEmoji: "🌸", speakerColor: "text-pink-300",
      paragraphs: ["Al intentar levantarla, Nezuko se revuelve con una fuerza que no conocéis. Lanza a Tanjiro contra la nieve de un solo empujón y se vuelve hacia ti.", "No es ella. Las venas le marcan la cara, los colmillos asoman, y el hambre le tiembla en la mandíbula. Pero todavía no ha mordido.", "No puedes golpearla. Jamás podrías. Solo puedes esquivarla... y buscar, entre embestida y embestida, las palabras que la traigan de vuelta."],
    },
    {
      id: "p0_4_calm", speaker: "Nezuko Kamado", title: "Un hilo de humanidad", portraitEmoji: "🌸", speakerColor: "text-pink-300",
      paragraphs: ["Nezuko cae de rodillas en la nieve. Se tapa la boca con las dos manos, temblando, como si quisiera encerrar los colmillos.", "Tanjiro se arrastra hasta vosotros con el labio partido. «Nos ha reconocido... {firstName}, nos ha reconocido.»", "Y entonces Nezuko levanta la cabeza hacia el bosque, se pone delante de los dos y gruñe. No a vosotros. A algo que viene entre los árboles."],
    },
    {
      id: "p0_5_arrive", speaker: "Tomioka Giyu", title: "Pilar del Agua", portraitEmoji: "🌊", speakerColor: "text-cyan-300",
      paragraphs: ["Un hombre de haori dividido emerge de los árboles con una katana desenvainada. Nezuko retrocede por instinto; él avanza sin prisa.", "«Apartaos del demonio.»", "Te pones delante de ella. Giyu no discute: la hoja silba hacia tu hombro. No pretende matarte todavía. Pretende apartarte. Si no te mueves, lo hará igual."],
    },
    {
      id: "p0_5_stand", speaker: "Narrador", title: "La hoja se detiene", portraitEmoji: "🌊", speakerColor: "text-slate-200",
      paragraphs: ["Giyu baja la espada. No porque hayas ganado: porque Nezuko lleva todo el combate temblando de hambre a dos pasos de ti y no ha mordido a nadie.", "El Pilar del Agua mira al demonio, luego al hermano, luego al prometido que no ha dejado de interponerse."],
    },
    {
      id: "p0_5",
      speaker: "Giyuu Tomioka",
      title: "Cinemática — El sello de bambú y la cesta",
      speakerColor: "text-sky-300",
      portraitEmoji: "🌊",
      paragraphs: [
        "El viento helado arremolina la nieve mientras Giyuu Tomioka observa en silencio cómo Ne\u007auko, a sus diecinueve años y recién transformada, se planta frente a ti y a Tanjiro para protegerlos a pesar de su agotamiento.",
        "Con un chasquido metálico, el Pilar del Agua envaina su katana mientras ella entra en un profundo letargo para recuperar sus energías. Tomioka se acerca en la nieve, toma un cilindro de bambú tradicional con un paño rojo y coloca el sello protector con cuidado.",
        "—Cuando despierte, ese sello de bambú evitará que pierda el control —dice Tomioka levantándose mientras tú la cubres con tu abrigo con ternura—. Preparen una cesta de bambú, cúbranla para protegerla del sol y llévenla al pie del Monte Sagiri. Busquen al maestro Sakonji Urokodaki y díganle que Giyuu Tomioka los envía.",
        "Tras reforzar una cesta de bambú recubierta con telas oscuras, acomodas a tu prometida para el viaje acariciando su mejilla. Te colocas las correas sobre los hombros, sintiendo su peso cálido en tu espalda, y emprendes la marcha junto a tu cuñado Tanjiro."
      ],
      choices: [{ text: "Partir hacia el Monte Sagiri con la cesta a la espalda", nextNodeId: "c1_1" }],
    },
  ],
};
