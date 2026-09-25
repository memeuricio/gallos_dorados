/* =========================================================================
   Contenido real del grupo, extraído del sitio original de Gallos Dorados
   (losgallosdorados.wixsite.com/home) y de sus redes.
   Las descripciones están reescritas para este sitio: son datos reales
   (fechas, escenarios, integrantes), no copia del diseño original.
   ========================================================================= */

export const INTEGRANTES = [
  {
    id: 'hugo',
    nombre: 'Hugo Iván Olivares Brito',
    rol: 'Tecladista y Director Musical',
    foto: '/img/integrante-hugo.webp',
    detalle:
      'Fundador del grupo (11 de febrero de 2014) y compositor. Más de 20 años de trayectoria y el responsable de gran parte de la identidad musical de la banda.',
    destacado: 'Fundador',
  },
  {
    id: 'alan',
    nombre: 'Alan Gregori Gómez Valdebenito',
    rol: 'Baterista',
    foto: '/img/integrante-alan.webp',
    detalle:
      'La primera persona que se sumó al proyecto. Veinte años de trayectoria y un percusionista tan versátil en vivo como en el estudio.',
  },
  {
    id: 'nacho',
    nombre: 'Ignacio "El Nacho" Olivares Brito',
    rol: 'Guitarrista',
    foto: '/img/integrante-nacho.webp',
    detalle:
      'Está desde los inicios del grupo: hermano menor de Hugo, aprendió guitarra con él y hoy es una de las marcas sonoras de Gallos Dorados.',
  },
  {
    id: 'felipe',
    nombre: 'Felipe Andrés Figueroa Figueroa',
    rol: 'Voz principal',
    foto: '/img/integrante-felipe.webp',
    detalle:
      'Se integró el 2017 y viene del mundo del mariachi: su registro le dio a la banda esa fusión ranchera que la distingue. También compone.',
    destacado: 'Voz',
  },
  {
    id: 'yoyo',
    nombre: 'Rodrigo "Yoyo" Omar González Meneses',
    rol: 'Huira y baile',
    foto: '/img/integrante-yoyo.webp',
    detalle:
      'El encargado de contagiar al público desde el escenario. Viene del sound con Panamax y aporta también en el estudio.',
  },
]

/** Línea de tiempo para la sección "El grupo". */
export const HITOS = [
  {
    anio: '2014',
    titulo: 'Nace Gallos Dorados',
    texto:
      'El 11 de febrero, el músico y compositor Hugo Iván Olivares Brito forma el grupo. Ese mismo año graban su primera producción, "Gallos Dorados Parte 1", con el sello LM Producciones.',
  },
  {
    anio: '2015',
    titulo: 'Festival de Malloco',
    texto: 'Compartimos escenario con Los Jaivas, Noche de Brujas y Amar Azul.',
  },
  {
    anio: '2017',
    titulo: 'Fonda "La Oficial" de Maipú',
    texto:
      'Invitados por la Municipalidad de Maipú, tocamos ante cerca de 6.000 personas en la fonda más importante de la comuna.',
  },
  {
    anio: '2018',
    titulo: 'Firma con Mastermedia',
    texto:
      'Nuestros dos discos, "Parte 1" y "Parte 2", llegan al sello más importante de la música tropical y ranchera de Chile y aterrizan en Spotify, Deezer, iTunes, YouTube, Shazam y Portaldisc.',
  },
  {
    anio: '2018',
    titulo: 'Maipeluza y Día de la Madre',
    texto:
      'Compartimos cartel en Maipeluza con Konchetucumbia, Combo Tortuga y Viking\'s 5 ante unas 17.000 personas por noche, y celebramos el Día de la Madre en Quinta Normal con más de 2.000 vecinos.',
  },
  {
    anio: 'Cada año',
    titulo: 'Teletón Maipú',
    texto: 'Apoyamos la campaña solidaria desde los inicios de la banda.',
  },
]

/** Presentaciones destacadas (carrusel "Presentaciones"). */
export const PRESENTACIONES = [
  {
    id: 'maipeluza',
    etiqueta: '2018',
    titulo: 'Maipeluza',
    lugar: 'Maipú',
    texto:
      'La fonda más grande y concurrida del país: escenario compartido con Konchetucumbia, Combo Tortuga y Viking\'s 5, con un promedio de 17.000 personas por noche.',
    img: '/img/maipeluza-2018.webp',
  },
  {
    id: 'laoficial',
    etiqueta: '2017',
    titulo: 'Fonda "La Oficial"',
    lugar: 'Maipú',
    texto:
      'Invitados por la Municipalidad de Maipú: una noche con cerca de 6.000 personas cantando y bailando con la banda.',
    img: '/img/show-nocturno.webp',
  },
  {
    id: 'malloco',
    etiqueta: '2015',
    titulo: 'Festival de Malloco',
    lugar: 'Malloco',
    texto: 'Escenario compartido con Los Jaivas, Noche de Brujas y Amar Azul.',
    img: '/img/grupo-en-vivo-01.webp',
  },
  {
    id: 'quintanormal',
    etiqueta: '2018',
    titulo: 'Día de la Madre en Quinta Normal',
    lugar: 'Quinta Normal',
    texto: 'Más de 2.000 vecinos celebrando junto a Gallos Dorados.',
    img: null,
    icono: 'heart',
  },
  {
    id: 'masivos',
    etiqueta: 'Fondas y festivales',
    titulo: 'Escenarios masivos',
    lugar: 'Todo Chile',
    texto:
      'Tarimas con pantalla gigante, producción de luces y miles de personas: así se ve un show grande de Gallos Dorados.',
    img: '/img/galeria-01.webp',
  },
  {
    id: 'teleton',
    etiqueta: 'Cada año',
    titulo: 'Teletón Maipú',
    lugar: 'Maipú',
    texto: 'Acompañamos la campaña solidaria desde los inicios del grupo.',
    img: null,
    icono: 'heart',
  },
  {
    id: 'audiomusica',
    etiqueta: '3 capítulos',
    titulo: 'Audiomúsica: historia de la nueva ranchera',
    lugar: 'Santiago',
    texto:
      'La tienda de instrumentos más importante de Chile nos invitó a contar la historia y las influencias de este movimiento, instrumento por instrumento.',
    img: '/img/audiomusica-teclado.webp',
    enlaces: [
      { label: 'Cap. 1: teclado', url: 'https://www.facebook.com/audiomusica/videos/1796183997079075/' },
      { label: 'Cap. 2: batería', url: 'https://www.facebook.com/audiomusica/videos/1804267656270709/' },
      { label: 'Cap. 3: guitarra y acordeón', url: 'https://www.facebook.com/audiomusica/videos/1811983782165763/' },
    ],
  },
  {
    id: 'mastermedia',
    etiqueta: '2018',
    titulo: 'Firma con Mastermedia',
    lugar: 'Sello discográfico',
    texto:
      'Firmamos por nuestros dos discos, "Parte 1" y "Parte 2", que hoy están en Spotify, Deezer, Claro Música, iTunes, YouTube, Shazam y Portaldisc.',
    img: '/img/firma-mastermedia.webp',
  },
  {
    id: 'privados',
    etiqueta: 'Todo el año',
    titulo: 'Matrimonios, cumpleaños y empresas',
    lugar: 'Todo Chile',
    texto:
      'Shows privados con repertorio ranchero y bailable, sonido propio y la posibilidad de sumar un bloque de mariachi mexicano.',
    img: null,
    icono: 'rings',
  },
]

/** Galería: fotos reales del grupo (todas en /public/img). */
export const GALERIA = [
  {
    id: 'g1',
    titulo: 'Gallos Dorados',
    tag: 'Oficial',
    ratio: 'wide',
    src: '/img/banner-gallos-dorados.webp',
    alt: 'Los cinco integrantes de Gallos Dorados con traje negro y sombrero',
  },
  {
    id: 'g2',
    titulo: 'Capítulo 1: teclado',
    tag: 'Audiomúsica',
    ratio: 'tall',
    src: '/img/audiomusica-teclado.webp',
    alt: 'Hugo Olivares tocando teclado en el capítulo 1 de Audiomúsica',
  },
  {
    id: 'g3',
    titulo: 'Maipeluza 2018',
    tag: 'Maipú',
    ratio: 'square',
    src: '/img/maipeluza-2018.webp',
    alt: 'La banda junto a asistentes en Maipeluza 2018',
  },
  {
    id: 'g4',
    titulo: 'Show en carpa',
    tag: 'En vivo',
    ratio: 'square',
    src: '/img/show-nocturno.webp',
    alt: 'Gallos Dorados tocando en una carpa iluminada durante una fonda',
  },
  {
    id: 'g5',
    titulo: 'Capítulo 2: batería',
    tag: 'Audiomúsica',
    ratio: 'tall',
    src: '/img/audiomusica-bateria.webp',
    alt: 'Alan Gómez en la batería durante el capítulo 2 de Audiomúsica',
  },
  {
    id: 'g6',
    titulo: 'Capítulo 3: guitarra',
    tag: 'Audiomúsica',
    ratio: 'square',
    src: '/img/audiomusica-guitarra.webp',
    alt: 'Ignacio Olivares con guitarra en el capítulo 3 de Audiomúsica',
  },
  {
    id: 'g7',
    titulo: 'Frente a miles de personas',
    tag: 'En vivo',
    ratio: 'wide',
    src: '/img/grupo-en-vivo-01.webp',
    alt: 'Vista desde el escenario de Gallos Dorados con el público en un festival',
  },
  {
    id: 'g9',
    titulo: 'Escenario principal',
    tag: 'Festival',
    ratio: 'wide',
    src: '/img/galeria-01.webp',
    alt: 'Gallos Dorados en una tarima grande con pantalla LED',
  },
  {
    id: 'g8',
    titulo: 'Firma con Mastermedia',
    tag: 'Discos',
    ratio: 'square',
    src: '/img/firma-mastermedia.webp',
    alt: 'Los integrantes firmando el contrato con Mastermedia junto a los logos del sello',
  },
]

export const FAQS = [
  {
    p: '¿Con cuánta anticipación debo reservar?',
    r: 'Para fines de semana, fiestas patrias y diciembre lo ideal son 3 a 4 semanas. Para fechas de semana hay cupos con 48 horas de anticipación: en el calendario ves los bloques realmente libres del grupo.',
  },
  {
    p: '¿Cómo funciona el pago?',
    r: 'Se paga un abono del 30% para bloquear la fecha y el saldo el mismo día del show, en efectivo o transferencia. Si pagas el 100% al reservar tienes 5% de descuento.',
  },
  {
    p: '¿Qué incluye el show?',
    r: 'La formación base son 5 músicos en escena: voz principal, teclado, guitarra, batería y huira y baile. Para escenarios grandes sumamos bajo, acordeón, percusión, vientos y hasta sonido profesional propio.',
  },
  {
    p: '¿Tocan mariachi mexicano?',
    r: 'Sí. Nuestra voz principal viene del mariachi, así que además del repertorio de nueva ranchera chilena podemos sumar un bloque de mariachi mexicano: serenatas, mañanitas y clásicos.',
  },
  {
    p: '¿Dónde se presentan?',
    r: 'El grupo está en Maipú y toca en toda la Región Metropolitana, además de regiones. Para eventos fuera de Santiago se coordina como gira (traslado y, según la distancia, alojamiento).',
  },
  {
    p: '¿Puedo pedir canciones específicas?',
    r: 'Por supuesto. Al reservar escríbenos hasta 5 canciones: armamos el repertorio con nuestra discografía ("Parte 1" y "Parte 2"), clásicos rancheros y cumbia bailable, y el público también puede pedir en vivo.',
  },
  {
    p: '¿Tienen discos editados?',
    r: '"Gallos Dorados Parte 1" (LM Producciones) y "Parte 2" (Mastermedia, 2018). Puedes escucharlos en Spotify, Deezer, Claro Música, iTunes, YouTube, Shazam y Portaldisc.',
  },
  {
    p: '¿Trabajan con municipios y eventos masivos?',
    r: 'Sí: tenemos experiencia en fondas y escenarios masivos como Maipeluza (17.000 personas por noche), la fonda "La Oficial" de Maipú y el Festival de Malloco, además de la Teletón Maipú desde los inicios del grupo.',
  },
  {
    p: '¿Qué pasa si llueve o debo reprogramar?',
    r: 'Puedes reprogramar sin costo avisando con 72 horas de anticipación, sujeto a disponibilidad de la nueva fecha. El abono se mantiene íntegro.',
  },
]

export const INSTRUMENTOS_MARQUEE = [
  'Nueva Ranchera Chilena',
  'Teclado Korg',
  'Batería Tama',
  'Guitarra Fender',
  'Voz principal',
  'Huira y baile',
  'Acordeón',
  'Bajo eléctrico',
  'Percusión',
  'Cumbia ranchera',
]
