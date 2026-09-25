import { formatCLP, capitalizar } from '../../lib/format'
import { formatFechaLarga, formatHora12 } from '../../lib/date'
import { useBooking } from '../../context/BookingContext'
import { useToast } from '../../context/ToastContext'
import Icon from '../icons'

/** Reservas guardadas en este navegador (localStorage). */
export default function MisReservas() {
  const { reservas, eliminarReserva, reiniciar, setear } = useBooking()
  const { toast } = useToast()

  if (!reservas.length) return null

  const reusar = (r) => {
    setear('cantidadMusicos', r.cantidadMusicos)
    setear('tipoShowId', r.tipoShowId)
    setear('comuna', r.comuna)
    setear('extras', r.extras)
    reiniciar()
    toast('Datos cargados. Elige un nuevo bloque para repetir el show.', 'info')
    document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-base">
          <Icon name="calendar" className="size-4 text-gold-700" />
          Tus reservas en este dispositivo
        </h3>
        <span className="chip">{reservas.length}</span>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {reservas.map((r) => (
          <li key={r.codigo} className="rounded-2xl border border-crema-300 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base text-gold-700">{r.codigo}</p>
                <p className="text-sm text-tinta-700">{capitalizar(formatFechaLarga(r.fechaISO))}</p>
                <p className="text-xs text-tinta-400">
                  {r.bloque?.nombre} · {formatHora12(r.bloque?.inicio)} — {r.cantidadMusicos} músicos
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  eliminarReserva(r.codigo)
                  toast('Reserva eliminada', 'info')
                }}
                className="grid size-8 cursor-pointer place-items-center rounded-xl border border-crema-200 text-tinta-400 transition hover:border-crimson-500/50 hover:text-crimson-600"
                aria-label={`Eliminar reserva ${r.codigo}`}
              >
                <Icon name="trash" className="size-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="chip">{r.tipoShow}</span>
              <span className="font-semibold text-tinta-800">{formatCLP(r.total)}</span>
            </div>
            <button type="button" onClick={() => reusar(r)} className="btn-ghost mt-3 w-full px-4 py-2 text-xs">
              <Icon name="plus" className="size-3.5" />
              Repetir este show
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
