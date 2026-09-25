import { OPCIONES_MUSICOS } from '../../data/shows'
import { formatCLP } from '../../lib/format'
import { useBooking } from '../../context/BookingContext'
import Icon from '../icons'
import { Badge } from '../ui'

export default function PasoMusicos() {
  const { cantidadMusicos, setear } = useBooking()
  const activo = OPCIONES_MUSICOS.find((o) => o.cantidad === cantidadMusicos)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h4 className="text-lg text-tinta-900">¿Cuántos músicos quieres en el escenario?</h4>
          <p className="text-sm text-tinta-400">
            El valor base es un show de 45 minutos en formato compacto; el resto de los formatos y
            músicos se ajustan solos.
          </p>
        </div>
        <Badge tono="gold">
          <Icon name="users" className="size-3" />
          {cantidadMusicos} músicos
        </Badge>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {OPCIONES_MUSICOS.map((o) => {
          const activoEste = o.cantidad === cantidadMusicos
          return (
            <li key={o.cantidad}>
              <button
                type="button"
                onClick={() => setear('cantidadMusicos', o.cantidad)}
                aria-pressed={activoEste}
                className={`relative h-full w-full cursor-pointer rounded-2xl border p-4 text-left transition ${
                  activoEste
                    ? 'border-gold-500 bg-gold-400/20 shadow-[0_0_0_1px_rgb(193_134_26/0.5)]'
                    : 'bg-crema-100 hover:border-gold-500/45 hover:bg-crema-100'
                }`}
              >
                {o.popular && (
                  <span className="absolute -top-2 right-3 rounded-full bg-agave-500 px-2 py-0.5 text-[9px] font-bold tracking-wide text-tinta-900 uppercase">
                    Popular
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl text-tinta-900">{o.cantidad}</span>
                  <span className="text-xs text-tinta-400">músicos</span>
                </div>
                <p className="mt-1 text-sm text-tinta-500">{o.etiqueta}</p>
                <p className="mt-3 font-semibold text-gold-700">{formatCLP(o.precioBase)}</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-tinta-400">
                  <Icon name="music" className="size-3" />
                  {o.instrumentos.length} instrumentos
                </p>
              </button>
            </li>
          )
        })}
      </ul>

      {activo && (
        <div className="mt-5 rounded-2xl border border-crema-200 bg-crema-50/50 p-4">
          <p className="text-xs tracking-wide text-tinta-400 uppercase">
            {activo.etiqueta} · así suena tu grupo
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activo.instrumentos.map((i) => (
              <span key={i} className="chip">
                <Icon name="music" className="size-3" />
                {i}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
