/* =========================================================================
   Utilidades de fecha (siempre en horario local, sin líos de UTC)
   ========================================================================= */

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

export const DIAS_SEMANA_MIN = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

/** Date -> 'YYYY-MM-DD' usando la fecha local. */
export function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 'YYYY-MM-DD' -> Date local (mediodía, para evitar saltos por zona horaria). */
export function fromISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

export function hoyISO() {
  return toISO(new Date())
}

export function addDays(iso, dias) {
  const d = fromISO(iso)
  d.setDate(d.getDate() + dias)
  return toISO(d)
}

export function diffDias(isoA, isoB) {
  const a = fromISO(isoA)
  const b = fromISO(isoB)
  return Math.round((b - a) / 86400000)
}

/** 0 = domingo ... 6 = sábado */
export function diaSemana(iso) {
  return fromISO(iso).getDay()
}

export function esFinDeSemana(iso) {
  const d = diaSemana(iso)
  return d === 5 || d === 6
}

export function nombreDia(iso, corto = false) {
  const d = diaSemana(iso)
  return corto ? DIAS_CORTOS[d] : DIAS[d]
}

export function nombreMes(mes) {
  return MESES[mes]
}

/** '2026-09-24' -> 'jueves 24 de septiembre' */
export function formatFechaLarga(iso) {
  const d = fromISO(iso)
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`
}

/** '2026-09-24' -> 'jue 24 sep' */
export function formatFechaCorta(iso) {
  const d = fromISO(iso)
  return `${DIAS_CORTOS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`
}

/** '2026-09-24' -> '24/09/2026' */
export function formatFechaNumerica(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

/** Suma minutos a un 'HH:MM' y devuelve 'HH:MM' (da la vuelta a las 24h). */
export function sumarMinutos(hora, minutos) {
  const [h, m] = hora.split(':').map(Number)
  const total = (h * 60 + m + minutos + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

/** 'HH:MM' -> minutos desde medianoche */
export function horaAMinutos(hora) {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

/** 'HH:MM' -> '9:00 PM' (formato amable para mostrar) */
export function formatHora12(hora) {
  const [h, m] = hora.split(':').map(Number)
  const sufijo = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`
}

/** 'HH:MM' -> '21:30 hrs' */
export function formatHora(hora) {
  return `${hora} hrs`
}

/** Primer día (lunes) de la semana a la que pertenece la fecha, como Date. */
export function inicioSemana(date) {
  const d = new Date(date)
  const day = (d.getDay() + 6) % 7 // lunes = 0
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Devuelve la matriz de semanas (6x7) para pintar un calendario mensual. */
export function matrizMes(anio, mes) {
  const primero = new Date(anio, mes, 1)
  const inicio = inicioSemana(primero)
  const semanas = []
  for (let s = 0; s < 6; s++) {
    const fila = []
    for (let d = 0; d < 7; d++) {
      const fecha = new Date(inicio)
      fecha.setDate(inicio.getDate() + s * 7 + d)
      fila.push(fecha)
    }
    semanas.push(fila)
  }
  return semanas
}

/** Genera el contenido de un archivo .ics para agregar el evento al calendario. */
export function icsEvento({ titulo, descripcion, fechaISO, horaInicio, horaFin, lugar }) {
  const [y, m, d] = fechaISO.split('-')
  const [hi, mi] = horaInicio.split(':')
  const [hf, mf] = horaFin.split(':')
  const dt = `${y}${m}${d}T${hi}${mi}00`
  // Si el término es después de medianoche, el evento pasa al día siguiente
  const cruza = horaAMinutos(horaFin) < horaAMinutos(horaInicio)
  const diaFin = cruza ? fromISO(addDays(fechaISO, 1)) : fromISO(fechaISO)
  const dtFin = `${diaFin.getFullYear()}${String(diaFin.getMonth() + 1).padStart(2, '0')}${String(
    diaFin.getDate(),
  ).padStart(2, '0')}T${hf}${mf}00`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mariachi Luna de Plata//Agenda//ES',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@mariachilunadeplata.cl`,
    `DTSTAMP:${dt}`,
    `DTSTART:${dt}`,
    `DTEND:${dtFin}`,
    `SUMMARY:${titulo}`,
    `DESCRIPTION:${(descripcion || '').replace(/\n/g, '\\n')}`,
    `LOCATION:${lugar || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
