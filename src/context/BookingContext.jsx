import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { cotizar } from '../lib/pricing'
import { clavesReservadas, getReservas, guardarReserva, borrarReserva } from '../lib/storage'
import { claveReserva } from '../data/availability'
import { fromISO, toISO } from '../lib/date'

const BookingContext = createContext(null)

const ESTADO_INICIAL = {
  fechaISO: null,
  bloque: null,
  cantidadMusicos: 5,
  tipoShowId: 'serenata',
  comuna: '',
  extras: [],
  pagoTotal: false,
  cliente: { nombre: '', telefono: '', email: '', direccion: '', solicitudes: '' },
  paso: 1,
}

export function BookingProvider({ children, estadoInicial = null }) {
  const [estado, setEstado] = useState(() => ({ ...ESTADO_INICIAL, ...(estadoInicial || {}) }))
  const [reservas, setReservas] = useState([])
  const [reservadas, setReservadas] = useState([])
  const [confirmada, setConfirmada] = useState(null)
  const [pulso, setPulso] = useState(0) // cambia para animar la sección de agenda

  useEffect(() => {
    setReservas(getReservas())
    setReservadas(clavesReservadas())
  }, [])

  const actualizar = useCallback((parcial) => {
    setEstado((prev) => ({ ...prev, ...(typeof parcial === 'function' ? parcial(prev) : parcial) }))
  }, [])

  const setear = useCallback((clave, valor) => setEstado((prev) => ({ ...prev, [clave]: valor })), [])

  /** Cambia de fecha y limpia el bloque elegido si no aplica. */
  const elegirFecha = useCallback((iso) => {
    setEstado((prev) => {
      const mismoDia = prev.fechaISO === iso
      return {
        ...prev,
        fechaISO: iso,
        bloque: mismoDia ? prev.bloque : null,
        paso: 1,
      }
    })
  }, [])

  const elegirBloque = useCallback((bloque) => {
    setEstado((prev) => ({ ...prev, bloque, paso: 1 }))
  }, [])

  const agregarExtra = useCallback((id) => {
    setEstado((prev) => {
      const activo = prev.extras.includes(id)
      return {
        ...prev,
        extras: activo ? prev.extras.filter((e) => e !== id) : [...prev.extras, id],
      }
    })
  }, [])

  const actualizarCliente = useCallback((parcial) => {
    setEstado((prev) => ({ ...prev, cliente: { ...prev.cliente, ...parcial } }))
  }, [])

  /** Abre la agenda con valores precargados (lo usan las tarjetas de show/músicos). */
  const irAAgenda = useCallback((prefill = {}) => {
    setEstado((prev) => ({ ...prev, ...prefill }))
    setPulso((p) => p + 1)
    const destino = document.getElementById('agenda')
    if (destino) {
      const y = destino.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  const reiniciar = useCallback(() => {
    setEstado((prev) => ({ ...ESTADO_INICIAL, cantidadMusicos: prev.cantidadMusicos }))
    setConfirmada(null)
  }, [])

  const cotizacion = useMemo(
    () =>
      cotizar({
        cantidadMusicos: estado.cantidadMusicos,
        tipoShowId: estado.tipoShowId,
        comuna: estado.comuna,
        bloque: estado.bloque,
        extras: estado.extras,
        pagoTotal: estado.pagoTotal,
      }),
    [estado.cantidadMusicos, estado.tipoShowId, estado.comuna, estado.bloque, estado.extras, estado.pagoTotal],
  )

  const puedeConfirmar = Boolean(
    estado.fechaISO && estado.bloque && estado.comuna && estado.cliente.nombre.trim().length > 2 && /[\d+]{8,}/.test(estado.cliente.telefono),
  )

  const confirmar = useCallback(() => {
    const reserva = {
      codigo: claveReserva(estado.fechaISO, estado.bloque.id),
      fechaISO: estado.fechaISO,
      bloqueId: estado.bloque.id,
      bloque: estado.bloque,
      cantidadMusicos: estado.cantidadMusicos,
      tipoShowId: estado.tipoShowId,
      tipoShow: cotizacion.show.nombre,
      comuna: estado.comuna,
      zona: cotizacion.zona?.nombre || '',
      extras: estado.extras,
      cliente: estado.cliente,
      total: cotizacion.total,
      abono: cotizacion.abono,
      pagoTotal: estado.pagoTotal,
      creada: toISO(new Date()),
      creadaEn: new Date().toISOString(),
    }
    setReservas(guardarReserva(reserva))
    setReservadas(clavesReservadas())
    setConfirmada(reserva)
    return reserva
  }, [estado, cotizacion])

  const eliminarReserva = useCallback((codigo) => {
    setReservas(borrarReserva(codigo))
    setReservadas(clavesReservadas())
  }, [])

  /** Bloquea una fecha/hora reservada por el usuario en este navegador. */
  const esReservaPropia = useCallback(
    (iso, bloqueId) => reservadas.includes(`${iso}|${bloqueId}`),
    [reservadas],
  )

  const value = {
    ...estado,
    reservas,
    confirmada,
    cotizacion,
    puedeConfirmar,
    pulso,
    actualizar,
    setear,
    elegirFecha,
    elegirBloque,
    agregarExtra,
    actualizarCliente,
    irAAgenda,
    reiniciar,
    confirmar,
    eliminarReserva,
    esReservaPropia,
    fechaDate: estado.fechaISO ? fromISO(estado.fechaISO) : null,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking debe usarse dentro de <BookingProvider>')
  return ctx
}
