import { useEffect } from 'react'
import { formatFechaLarga, formatHora12 } from '../../lib/date'
import { formatCLP, capitalizar } from '../../lib/format'
import { useBooking } from '../../context/BookingContext'
import { useToast } from '../../context/ToastContext'
import Icon from '../icons'
import { Badge } from '../ui'
import PasoMusicos from './PasoMusicos'
import PasoComuna from './PasoComuna'
import PasoShow from './PasoShow'
import PasoDatos from './PasoDatos'
import Confirmacion from './Confirmacion'

const PASOS = [
  { n: 1, label: 'Músicos', icon: 'users' },
  { n: 2, label: 'Lugar · Comuna', icon: 'pin' },
  { n: 3, label: 'Tipo de show', icon: 'music' },
  { n: 4, label: 'Datos y pago', icon: 'check' },
]

export default function Asistente() {
  const {
    bloque,
    fechaISO,
    paso,
    setear,
    comuna,
    confirmar,
    confirmada,
    reiniciar,
    cotizacion,
    cantidadMusicos,
  } = useBooking()
  const { toast } = useToast()

  // Al cambiar de paso, subimos al inicio del asistente
  useEffect(() => {
    document.getElementById('asistente')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [paso])

  if (!bloque) {
    return (
      <div className="card flex flex-col items-center gap-2 p-8 text-center">
        <span className="grid size-12 place-items-center rounded-2xl border border-gold-500/25 bg-crema-50/60 text-gold-700">
          <Icon name="music" className="size-6" />
        </span>
        <p className="font-display text-lg text-tinta-800">Selecciona un bloque de horario</p>
        <p className="max-w-md text-sm text-tinta-400">
          Después de elegir el bloque se abren los 4 pasos: cantidad de músicos, lugar (comuna), tipo
          de show y tus datos para confirmar.
        </p>
      </div>
    )
  }

  if (confirmada) {
    return (
      <div id="asistente" className="scroll-mt-28">
        <Confirmacion onNuevaReserva={() => setear('paso', 1)} />
      </div>
    )
  }

  const puedeAvanzar = paso === 2 ? Boolean(comuna) : true

  const siguiente = () => {
    if (!puedeAvanzar) {
      toast('Elige tu comuna para continuar', 'error')
      return
    }
    setear('paso', Math.min(4, paso + 1))
  }

  return (
    <div id="asistente" className="card scroll-mt-28 overflow-hidden">
      {/* Encabezado con el bloque elegido */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-crema-200 bg-gradient-to-r from-gold-400/10 to-transparent px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl border border-gold-500/30 bg-crema-50/70 text-gold-700">
            <Icon name="calendar" className="size-5" />
          </span>
          <div>
            <p className="text-[11px] tracking-[0.16em] text-gold-700 uppercase">Tu bloque</p>
            <p className="text-tinta-900">{capitalizar(formatFechaLarga(fechaISO))}</p>
            <p className="text-xs text-tinta-400">
              {bloque.nombre} · {formatHora12(bloque.inicio)} a {formatHora12(bloque.fin)} ·{' '}
              {cantidadMusicos} músicos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tono="gold">Estimado {formatCLP(cotizacion.total)}</Badge>
          <button
            type="button"
            onClick={() => {
              setear('bloque', null)
              setear('paso', 1)
              reiniciar()
            }}
            className="btn-dark px-4 py-2 text-xs"
          >
            Cambiar bloque
          </button>
        </div>
      </header>

      {/* Stepper */}
      <nav aria-label="Pasos de la reserva" className="border-b bg-crema-100 px-4 py-4 sm:px-6">
        <ol className="flex flex-wrap items-center gap-2 sm:gap-4">
          {PASOS.map((p, i) => {
            const activo = p.n === paso
            const completo = p.n < paso
            return (
              <li key={p.n} className="flex items-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => (completo ? setear('paso', p.n) : null)}
                  disabled={!completo && !activo}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition disabled:cursor-not-allowed ${
                    activo
                      ? 'border-gold-500 bg-gold-400/20 text-gold-700'
                      : completo
                        ? 'border-agave-400/40 bg-agave-500/10 text-agave-600'
                        : 'bg-crema-100 text-tinta-400'
                  }`}
                >
                  <span className="grid size-5 place-items-center rounded-full border border-current text-[10px] font-bold">
                    {completo ? <Icon name="check" className="size-3" /> : p.n}
                  </span>
                  <span className="hidden sm:inline">{p.label}</span>
                  <Icon name={p.icon} className="size-3.5 sm:hidden" />
                </button>
                {i < PASOS.length - 1 && <span className="hidden h-px w-6 bg-crema-100 sm:block" />}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Contenido del paso */}
      <div className="px-5 py-6 sm:px-6">
        {paso === 1 && <PasoMusicos />}
        {paso === 2 && <PasoComuna />}
        {paso === 3 && <PasoShow />}
        {paso === 4 && (
          <PasoDatos
            onConfirmar={() => {
              const reserva = confirmar()
              toast(`¡Reserva ${reserva.codigo} registrada! Revisa el resumen.`, 'success', 6000)
            }}
          />
        )}
      </div>

      {/* Navegación */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-crema-200 bg-crema-50/40 px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => setear('paso', Math.max(1, paso - 1))}
          disabled={paso === 1}
          className="btn-dark px-4 py-2 text-xs"
        >
          <Icon name="arrowLeft" className="size-4" />
          Anterior
        </button>

        <p className="order-last w-full text-center text-[11px] text-tinta-400 sm:order-none sm:w-auto">
          Paso {paso} de 4 · {cotizacion.show.duracion} min de música · {cotizacion.show.nombre}
        </p>

        {paso < 4 ? (
          <button
            type="button"
            onClick={siguiente}
            disabled={!puedeAvanzar}
            className="btn-gold px-5 py-2 text-xs"
          >
            Siguiente
            <Icon name="arrowRight" className="size-4" />
          </button>
        ) : (
          <span className="chip border-agave-400/35 bg-agave-500/10 text-agave-600">
            <Icon name="check" className="size-3" />
            Completa tus datos para confirmar
          </span>
        )}
      </footer>
    </div>
  )
}
