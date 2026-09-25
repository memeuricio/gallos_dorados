/* Persistencia simple en localStorage (reservas del usuario en este demo). */

const KEY_RESERVAS = 'gd:reservas'
const KEY_BORRADOR = 'gd:borrador'

function leer(clave, fallback) {
  try {
    if (typeof window === 'undefined') return fallback
    const raw = window.localStorage.getItem(clave)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function escribir(clave, valor) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* modo privado: ignoramos */
  }
}

export function getReservas() {
  return leer(KEY_RESERVAS, [])
}

export function guardarReserva(reserva) {
  const reservas = getReservas()
  const siguientes = [reserva, ...reservas.filter((r) => r.codigo !== reserva.codigo)]
  escribir(KEY_RESERVAS, siguientes)
  return siguientes
}

export function borrarReserva(codigo) {
  const siguientes = getReservas().filter((r) => r.codigo !== codigo)
  escribir(KEY_RESERVAS, siguientes)
  return siguientes
}

/** Bloquea los bloques que el usuario ya reservó en este navegador. */
export function clavesReservadas() {
  return getReservas().map((r) => `${r.fechaISO}|${r.bloqueId}`)
}

export function guardarBorrador(datos) {
  escribir(KEY_BORRADOR, datos)
}

export function getBorrador() {
  return leer(KEY_BORRADOR, null)
}
