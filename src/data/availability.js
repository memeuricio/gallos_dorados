/* =========================================================================
   Agenda y disponibilidad.

   La disponibilidad de este demo es DETERMINISTA: se genera a partir de un
   hash de la fecha + bloque, así que el calendario se ve igual en cada carga
   (no hay servidor). Cuando exista backend, reemplaza `estadoBloque()` por la
   llamada real a la API/BBDD y el resto de la web funciona igual.
   ========================================================================= */

import { addDays, diaSemana, diffDias, esFinDeSemana, hoyISO } from '../lib/date'

/** Días de agenda que se generan hacia adelante. */
export const DIAS_DE_AGENDA = 90

/** Bloques horarios que ofrece el mariachi. */
export const BLOQUES = [
  {
    id: 'amanecer',
    inicio: '09:00',
    fin: '11:00',
    nombre: 'Mañanitas',
    recargo: 0,
    dias: [0, 1, 2, 3, 4, 5, 6],
    nota: 'Ideal para sorpresas al despertar',
  },
  {
    id: 'mediodia',
    inicio: '12:30',
    fin: '14:30',
    nombre: 'Almuerzo',
    recargo: 0,
    dias: [0, 2, 3, 4, 5, 6],
    nota: 'Almuerzos, aniversarios y oficinas',
  },
  {
    id: 'tarde',
    inicio: '16:00',
    fin: '18:00',
    nombre: 'Tarde',
    recargo: 0,
    dias: [0, 1, 2, 3, 4, 5, 6],
    nota: 'Ceremonias, matrimonios y eventos',
  },
  {
    id: 'noche',
    inicio: '19:00',
    fin: '21:00',
    nombre: 'Noche',
    recargo: 0,
    dias: [0, 1, 2, 3, 4, 5, 6],
    nota: 'El horario más pedido',
  },
  {
    id: 'trasnoche',
    inicio: '21:30',
    fin: '23:30',
    nombre: 'Trasnoche',
    recargo: 0.15,
    dias: [0, 2, 3, 4, 5, 6],
    nota: 'Recargo de 15% por horario',
  },
  {
    id: 'madrugada',
    inicio: '00:00',
    fin: '02:00',
    nombre: 'Madrugada',
    recargo: 0.25,
    dias: [0, 5, 6],
    nota: 'Solo viernes, sábado y vísperas',
  },
]

/* ------------------------------- Utilidades ------------------------------- */

function hash(texto) {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** RNG determinista (mulberry32) */
function rng(semilla) {
  let a = semilla
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Feriados de ejemplo (los días fuertes se agotan más rápido). */
export const FERIADOS = [
  '01-01',
  '05-01',
  '09-18',
  '09-19',
  '12-24',
  '12-25',
  '12-31',
]

function esFeriado(iso) {
  return FERIADOS.includes(iso.slice(5))
}

/** Un día está cerrado si es lunes (descanso del grupo) y no es feriado. */
export function diaCerrado(iso) {
  return diaSemana(iso) === 1 && !esFeriado(iso)
}

const ETIQUETA_ESTADO = {
  disponible: 'Disponible',
  ultimos: 'Últimos cupos',
  ocupado: 'Ocupado',
}

/* ------------------------------- Estado real ------------------------------ */

/**
 * Estado de un bloque puntual.
 * 'disponible' | 'ultimos' | 'ocupado'
 */
export function estadoBloque(iso, bloqueId) {
  const bloque = BLOQUES.find((b) => b.id === bloqueId)
  if (!bloque) return 'ocupado'

  const fecha = new Date(iso + 'T12:00:00')
  if (fecha < new Date(hoyISO() + 'T00:00:00')) return 'ocupado'
  if (diaCerrado(iso)) return 'ocupado'
  if (!bloque.dias.includes(diaSemana(iso))) return 'ocupado'

  // Mientras más cerca la fecha, más llena la agenda (sensación de urgencia real)
  const diasDeLejos = Math.max(0, diffDias(hoyISO(), iso))
  const ocupacion = esFeriado(iso) ? 0.55 : esFinDeSemana(iso) ? 0.42 : 0.28
  const presion = diasDeLejos <= 10 ? 0.2 : diasDeLejos <= 25 ? 0.1 : 0

  const r = rng(hash(`${iso}|${bloqueId}|agenda`))()
  if (r < ocupacion + presion) return 'ocupado'
  if (r < ocupacion + presion + 0.18) return 'ultimos'
  return 'disponible'
}

/** Lista de bloques con su estado para una fecha. */
export function bloquesDelDia(iso) {
  if (diaCerrado(iso)) return []
  return BLOQUES.map((b) => {
    const estado = estadoBloque(iso, b.id)
    return { ...b, estado, etiquetaEstado: ETIQUETA_ESTADO[estado] }
  })
}

/** Resumen de una fecha para pintar el calendario. */
export function resumenDia(iso) {
  if (diaCerrado(iso)) {
    return { iso, cerrado: true, libres: 0, total: 0, nivel: 'cerrado' }
  }
  const bloques = bloquesDelDia(iso)
  const libres = bloques.filter((b) => b.estado !== 'ocupado').length
  const nivel = libres === 0 ? 'lleno' : libres <= 2 ? 'pocos' : 'libre'
  return { iso, cerrado: false, libres, total: bloques.length, nivel }
}

/** Nivel de demanda del día (para el colorcito del calendario). */
export function nivelDia(iso) {
  return resumenDia(iso).nivel
}

/** Texto tipo "Quedan 3 bloques" para los tooltips. */
export function textoDisponibilidad(iso) {
  const r = resumenDia(iso)
  if (r.cerrado) return 'Cerrado (día de descanso)'
  if (r.libres === 0) return 'Sin cupos disponibles'
  if (r.libres <= 2) return `Últimos ${r.libres} bloques`
  return `${r.libres} bloques disponibles`
}

/** Genera la lista de fechas de la agenda (desde hoy). */
export function fechasDeAgenda(dias = DIAS_DE_AGENDA) {
  const inicio = hoyISO()
  return Array.from({ length: dias }, (_, i) => addDays(inicio, i))
}

/** Devuelve el próximo bloque disponible (para el CTA del hero). */
export function proximoBloque() {
  for (const iso of fechasDeAgenda(30)) {
    const bloque = bloquesDelDia(iso).find((b) => b.estado === 'disponible')
    if (bloque) return { iso, bloque }
  }
  return null
}

/** Marca de tiempo legible para los mensajes de confirmación. */
export function claveReserva(iso, bloqueId) {
  const semilla = hash(`${iso}|${bloqueId}`) % 46655
  return `MRC-${semilla.toString(36).toUpperCase().padStart(4, '0')}`
}

export const ESTADOS = ETIQUETA_ESTADO

/** Devuelve el ics-friendly "día siguiente" cuando el bloque cruza medianoche. */
export function cruzaMedianoche(bloque) {
  return Number(bloque.fin.slice(0, 2)) < Number(bloque.inicio.slice(0, 2))
}
