import { TIPOS_SHOW, EXTRAS } from '../../data/shows'
import { cotizar } from '../../lib/pricing'
import { formatCLP } from '../../lib/format'
import { useBooking } from '../../context/BookingContext'
import { useToast } from '../../context/ToastContext'
import Icon from '../icons'
import { Badge } from '../ui'

export default function PasoShow() {
  const { tipoShowId, setear, cantidadMusicos, comuna, bloque, extras, agregarExtra, cotizacion } =
    useBooking()
  const { toast } = useToast()

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h4 className="text-lg text-tinta-900">¿Qué tipo de show necesitas?</h4>
          <p className="text-sm text-tinta-400">
            Cada formato cambia la duración y el repertorio. El precio se recalcula al instante.
          </p>
        </div>
        <Badge tono="neutro">
          <Icon name="clock" className="size-3" />
          {cotizacion.show.duracion} min · {cotizacion.show.nombre}
        </Badge>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {TIPOS_SHOW.map((show) => {
          const activo = show.id === tipoShowId
          const total = cotizar({ cantidadMusicos, tipoShowId: show.id, comuna, bloque, extras }).total
          return (
            <li key={show.id}>
              <button
                type="button"
                onClick={() => {
                  setear('tipoShowId', show.id)
                  toast(`Show: ${show.nombre} (${show.duracion} min)`, 'success')
                }}
                aria-pressed={activo}
                className={`relative h-full w-full cursor-pointer overflow-hidden rounded-2xl border p-4 text-left transition ${
                  activo
                    ? 'border-gold-500 bg-gold-400/20 shadow-[0_0_0_1px_rgb(193_134_26/0.5)]'
                    : 'bg-crema-100 hover:border-gold-500/45 hover:bg-crema-100'
                }`}
              >
                <div className={`absolute -top-12 -right-10 size-28 rounded-full bg-gradient-to-br ${show.color} opacity-15 blur-2xl`} />
                <div className="relative flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-gold-500/25 bg-crema-50/70 text-gold-700">
                    <Icon name={show.icono} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-tinta-900">{show.nombre}</p>
                    <p className="text-[11px] text-tinta-400">{show.duracion} min · {show.idealPara}</p>
                  </div>
                </div>
                <p className="relative mt-3 line-clamp-2 text-xs text-tinta-400">{show.resumen}</p>
                <p className="relative mt-3 font-semibold text-gold-700">{formatCLP(total)}</p>
              </button>
            </li>
          )
        })}
      </ul>

      {/* Extras */}
      <div className="mt-8 rounded-3xl border border-crema-200 bg-crema-50/45 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-base text-tinta-900">Suma extras (opcional)</h4>
            <p className="text-xs text-tinta-400">Se agregan al total y aparecen en tu resumen.</p>
          </div>
          {extras.length > 0 && (
            <Badge tono="verde">
              {extras.length} extra{extras.length > 1 ? 's' : ''} · +
              {formatCLP(cotizacion.valorExtras)}
            </Badge>
          )}
        </div>

        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {EXTRAS.map((extra) => {
            const activo = extras.includes(extra.id)
            return (
              <li key={extra.id}>
                <button
                  type="button"
                  onClick={() => agregarExtra(extra.id)}
                  aria-pressed={activo}
                  className={`flex h-full w-full cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
                    activo
                      ? 'border-agave-400/60 bg-agave-500/10'
                      : 'bg-crema-100 hover:border-agave-400/40 hover:bg-crema-100'
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition ${
                      activo ? 'border-agave-400 bg-agave-500 text-tinta-900' : 'bg-crema-100'
                    }`}
                  >
                    {activo && <Icon name="check" className="size-3" />}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm text-tinta-800">
                      <Icon name={extra.icono} className="size-3.5 text-gold-700" />
                      {extra.nombre}
                    </span>
                    <span className="mt-1 block text-[11px] text-tinta-400">{extra.descripcion}</span>
                    <span className="mt-1 block text-xs font-semibold text-gold-700">
                      + {formatCLP(extra.precio)}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
