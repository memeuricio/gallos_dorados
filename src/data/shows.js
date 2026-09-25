/* =========================================================================
   Formatos de show, músicos en escena y extras.
   Los precios son de referencia (editables acá) y la web recalcula sola.
   La formación base real de Gallos Dorados son 5 músicos en escena.
   ========================================================================= */

export const TIPOS_SHOW = [
  {
    id: 'serenata',
    nombre: 'Serenata y mañanitas',
    icono: 'sunrise',
    duracion: 45,
    factor: 1,
    destacado: true,
    resumen:
      'Formato mariachi con nuestra voz principal: para sorprender al amanecer, bajo la ventana o en un aniversario.',
    incluye: ['45 min de música en vivo', 'Bloque de mariachi mexicano', 'Las Mañanitas y clásicos rancheros'],
    idealPara: 'Parejas, cumpleaños, sorpresas',
    color: 'from-gold-300 to-gold-600',
  },
  {
    id: 'cumpleanos',
    nombre: 'Cumpleaños y fiesta privada',
    icono: 'cake',
    duracion: 60,
    factor: 1.15,
    resumen:
      'Una hora de fiesta con la banda completa: rancheras, cumbia y todo lo que haga bailar a los invitados.',
    incluye: ['60 min de música en vivo', 'Bloque bailable con huira', 'Micrófono para brindis y saludos'],
    idealPara: 'Cumpleaños, reuniones familiares, asados',
    color: 'from-agave-400 to-gold-500',
  },
  {
    id: 'matrimonio',
    nombre: 'Matrimonio y ceremonia',
    icono: 'rings',
    duracion: 75,
    factor: 1.35,
    resumen:
      'Acompañamos la ceremonia, el brindis y el primer baile con repertorio romántico y ranchero.',
    incluye: ['75 min repartidos en ceremonia y fiesta', 'Entrada de los novios', 'Coordinación previa del repertorio'],
    idealPara: 'Matrimonios, renovación de votos, compromisos',
    color: 'from-gold-400 to-crimson-500',
  },
  {
    id: 'bailable',
    nombre: 'Show bailable con huira',
    icono: 'sparkles',
    duracion: 90,
    factor: 1.45,
    resumen:
      'Nuestra carta de presentación: cumbia ranchera, huirista en escena y un público que no se sienta.',
    incluye: ['90 min de música continua', 'Huirista y animación en vivo', 'Repertorio de los dos discos'],
    idealPara: 'Fiestas, galpones, clubes, aniversarios',
    color: 'from-crimson-400 to-gold-600',
  },
  {
    id: 'fonda',
    nombre: 'Fondas y Fiestas Patrias',
    icono: 'flag',
    duracion: 120,
    factor: 1.5,
    resumen:
      'Tenemos años de fondas encima: cueca, ranchera y cumbia para el 18 más largo del año.',
    incluye: ['120 min de música en vivo', 'Repertorio chileno y ranchero', 'Experiencia en escenarios masivos'],
    idealPara: 'Fondas, escuelas, condominios, municipios',
    color: 'from-crimson-500 to-agave-500',
  },
  {
    id: 'municipal',
    nombre: 'Eventos municipales y masivos',
    icono: 'users',
    duracion: 90,
    factor: 1.6,
    resumen:
      'Shows para escenarios grandes, con equipo propio y experiencia comprobada ante miles de personas.',
    incluye: ['90 min de show', 'Prueba de sonido y coordinación técnica', 'Animación para todo público'],
    idealPara: 'Municipios, festivales, celebraciones comunales',
    color: 'from-agave-500 to-tinta-700',
  },
  {
    id: 'corporativo',
    nombre: 'Eventos de empresa',
    icono: 'briefcase',
    duracion: 90,
    factor: 1.55,
    resumen: 'Presencia elegante para aniversarios, premiaciones y cenas de fin de año.',
    incluye: ['90 min de música en vivo', 'Vestuario formal de la banda', 'Sonido profesional disponible'],
    idealPara: 'Empresas, tiendas, lanzamientos, cenas',
    color: 'from-gold-600 to-tinta-600',
  },
  {
    id: 'homenaje',
    nombre: 'Homenajes y velorios',
    icono: 'dove',
    duracion: 45,
    factor: 1.2,
    resumen: 'Despedidas y recordatorios con respeto, puntualidad y un repertorio sobrio.',
    incluye: ['45 min de música en vivo', 'Canciones a elección de la familia', 'Coordinación discreta'],
    idealPara: 'Velorios, misas de recordatorio, honras',
    color: 'from-tinta-400 to-tinta-700',
  },
]

export const SHOW_POR_ID = Object.fromEntries(TIPOS_SHOW.map((s) => [s.id, s]))

/* --------------------------- Músicos en escena --------------------------- */

const INSTRUMENTOS_BASE = ['Voz principal', 'Teclado', 'Guitarra']
const EXTRAS_INSTRUMENTOS = [
  'Batería',
  'Huira y baile',
  'Bajo eléctrico',
  'Acordeón',
  'Percusión',
  'Trompeta',
  'Violín',
  'Saxofón',
  'Sonido e iluminación',
]

function instrumentosPara(n) {
  return [...INSTRUMENTOS_BASE, ...EXTRAS_INSTRUMENTOS.slice(0, n - 3)]
}

function etiquetaPara(n) {
  if (n === 3) return 'Formato compacto'
  if (n === 4) return 'Cuarteto'
  if (n === 5) return 'Formación base'
  if (n === 6) return 'Sexteto'
  if (n === 7) return 'Septeto'
  if (n === 8) return 'Octeto'
  if (n === 9) return 'Formación grande'
  if (n === 10) return 'Show completo'
  if (n === 11) return 'Show con vientos'
  return 'Producción completa'
}

/** Opciones de cantidad de músicos (3 a 12). Precio base de un show de 45 min. */
export const OPCIONES_MUSICOS = Array.from({ length: 10 }, (_, i) => {
  const n = i + 3
  return {
    cantidad: n,
    etiqueta: etiquetaPara(n),
    precioBase: 100000 + (n - 3) * 28000,
    instrumentos: instrumentosPara(n),
    popular: n === 5,
  }
})

export const MUSICOS_POR_CANTIDAD = Object.fromEntries(
  OPCIONES_MUSICOS.map((o) => [o.cantidad, o]),
)

/* -------------------------------- Extras -------------------------------- */

export const EXTRAS = [
  {
    id: 'sonido',
    nombre: 'Sonido e iluminación profesional',
    precio: 45000,
    descripcion: 'Amplificación, micrófonos inalámbricos, monitoreo y luces de escenario.',
    icono: 'speaker',
  },
  {
    id: 'mariachi',
    nombre: 'Bloque de mariachi mexicano',
    precio: 120000,
    descripcion: '45 minutos extra con mariachi: serenatas, mañanitas y clásicos mexicanos.',
    icono: 'guitar',
  },
  {
    id: 'horaExtra',
    nombre: 'Hora extra de show',
    precio: 50000,
    descripcion: 'Sumamos 60 minutos más de música al show contratado.',
    icono: 'clock',
  },
  {
    id: 'animacion',
    nombre: 'Animación y maestro de ceremonias',
    precio: 40000,
    descripcion: 'Un animador coordina brindis, saludos y dinámicas con el público.',
    icono: 'mic',
  },
  {
    id: 'pantalla',
    nombre: 'Pantalla LED con tu mensaje',
    precio: 30000,
    descripcion: 'Cortinilla y gráfica personalizada con el nombre del festejado o de la empresa.',
    icono: 'image',
  },
  {
    id: 'grabacion',
    nombre: 'Grabación del show',
    precio: 60000,
    descripcion: 'Registro en audio y video del show, editado para que lo compartas.',
    icono: 'star',
  },
]

/** Descuento por pagar el 100% al reservar (en vez del abono del 30%). */
export const DESCUENTO_PAGO_TOTAL = 0.05
export const PORCENTAJE_ABONO = 0.3
