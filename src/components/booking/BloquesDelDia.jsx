import { useMemo } from 'react'
import { bloquesDelDia, diaCerrado } from '../../data/availability'
import { formatFechaLarga, formatHora12, nombreDia } from '../../lib/date'
import { capitalizar } from '../../lib/format'
import { useBooking } from '../../context/BookingContext'
import { useToast } from '../../context/ToastContext'
import Icon from '../icons'
import { Badge } from '../ui'

const TONO_ESTADO = {
  disponible: { chip: 'verde', texto: 'Disponible' },
  ultimos: { chip: 'gold', texto: 'Últimos cupos' },
  ocupado: { chip: 'rojo', texto: 'Ocupado' },
}

export default function BloquesDelDia() {
  const { fechaISO, bloque: elegido, elegirBloque, esReservaPropia } = useBooking()
  const { toast } = useToast()

  const bloques = useMemo(() => (fechaISO ? bloquesDelDia(fechaISO) : []), [fechaISO])
  const libres = bloques.filter((b) => b.estado !== 'ocupado').length

  if (!fechaISO) {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <span className="grid size-12 place-items-center rounded-2xl border border-gold-500/25 bg-crema-50/60 text-gold-700">
          <Icon name="calendar" className="size-6" />
        </span>
        <p className="font-display text-lg text-tinta-800">Elige un día en el calendario</p>
        <p className="max-w-sm text-sm text-tinta-400">
          Al seleccionar una fecha verás los bloques de horario disponibles para ese día, con el
          detalle de cada uno.
        </p>
      </div>
    )
  }

  if (diaCerrado(fechaISO)) {
    return (
      <div className="card p-6">
        <h3 className="text-lg">{capitalizar(formatFechaLarga(fechaISO))}</h3>
        <p className="mt-2 text-sm text-tinta-500">
          Los lunes el grupo descansa (a menos que sea feriado). Elige otro día del calendario.
        </p>
      </div>
    )
  }

  const elegir = (bloque) => {
    if (bloque.estado === 'ocupado') return
    elegirBloque(bloque)
    toast(
      `Bloque ${bloque.nombre} · ${formatHora12(bloque.inicio)} guardado. Completa los 4 pasos.`,
      'success',
    )
    window.setTimeout(() => {
      document.getElementById('asistente')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }

  return (
    <div className="card p-5 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-gold-700 uppercase">Elige el horario</p>
          <h3 className="mt-1 text-xl">{capitalizar(formatFechaLarga(fechaISO))}</h3>
          <p className="text-sm text-tinta-400">
            {nombreDia(fechaISO)} · {libres} de {bloques.length} bloques disponibles
          </p>
        </div>
        <Badge tono={libres === 0 ? 'rojo' : 'verde'}>
          {libres === 0 ? 'Sin cupos' : 'Agenda abierta'}
        </Badge>
      </header>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {bloques.map((b) => {
          const ocupado = b.estado === 'ocupado'
          const activo = elegido?.id === b.id
          const propia = esReservaPropia(fechaISO, b.id)
          const tono = TONO_ESTADO[b.estado]

          return (
            <li key={b.id}>
              <button
                type="button"
                disabled={ocupado}
                onClick={() => elegir(b)}
                aria-pressed={activo}
                className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition ${
                  activo
                    ? 'border-gold-500 bg-gold-400/20 shadow-[0_0_0_1px_rgb(193_134_26/0.5)]'
                    : ocupado
                      ? 'cursor-not-allowed bg-crema-100 opacity-60'
                      : 'cursor-pointer bg-crema-100 hover:border-gold-500/50 hover:bg-crema-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-tinta-900">{b.nombre}</p>
                    <p className="mt-0.5 text-sm text-tinta-500">
                      {formatHora12(b.inicio)} — {formatHora12(b.fin)}
                    </p>
                  </div>
                  <Badge tono={tono.chip}>{propia ? 'Tu reserva' : tono.texto}</Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="chip">{b.nota}</span>
                  {b.recargo > 0 && (
                    <span className="chip border-crimson-500/30 bg-crimson-500/10 text-crimson-600">
                      <Icon name="clock" className="size-3" />
                      +{Math.round(b.recargo * 100)}% por horario
                    </span>
                  )}
                  {activo && (
                    <span className="chip border-gold-500/40 bg-gold-400/20 text-gold-700">
                      <Icon name="check" className="size-3" />
                      Seleccionado
                    </span>
                  )}
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
