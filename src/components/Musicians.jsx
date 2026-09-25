import { useCallback, useState } from 'react'
import { MUSICOS_POR_CANTIDAD, OPCIONES_MUSICOS, EXTRAS } from '../data/shows'
import { cotizar } from '../lib/pricing'
import { formatCLP } from '../lib/format'
import { useBooking } from '../context/BookingContext'
import { useToast } from '../context/ToastContext'
import EscenarioSVG from './EscenarioSVG'
import Icon from './icons'
import { Badge, Reveal, SectionTitle } from './ui'

export default function Musicians() {
  const [cantidad, setCantidad] = useState(5)
  const [hover, setHover] = useState(null)
  const { irAAgenda } = useBooking()
  const { toast } = useToast()

  const opcion = MUSICOS_POR_CANTIDAD[cantidad]
  const cotizacion = cotizar({ cantidadMusicos: cantidad, tipoShowId: 'serenata', comuna: 'Maipú' })

  const alHover = useCallback((rol) => setHover(rol), [])

  const agendar = () => {
    irAAgenda({ cantidadMusicos: cantidad })
    toast(`${opcion.etiqueta} (${cantidad} músicos) cargado en la agenda`, 'success')
  }

  return (
    <section id="musicos" className="section">
      <SectionTitle
        kicker="Formación"
        titulo="De formato compacto a banda completa"
        bajada="Mueve el selector y mira cómo se arma el escenario. Nuestra formación base son 5 músicos; para escenarios grandes sumamos bajo, acordeón, percusión y vientos."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.05fr]">
        {/* Escenario ilustrado */}
        <Reveal className="relative">
          <div className="card overflow-hidden bg-gradient-to-b from-crema-50 to-crema-100 p-2">
            <div className="h-[20rem] w-full sm:h-[24rem]">
              <EscenarioSVG roles={opcion.instrumentos} hover={hover} onHover={alHover} />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-center justify-between gap-3">
            <span className="rounded-full border border-crema-200 bg-crema-50/80 px-3 py-1.5 text-xs text-tinta-700 backdrop-blur">
              {hover ? (
                <span className="text-gold-700">{hover}</span>
              ) : (
                'Pasa el mouse por un músico'
              )}
            </span>
            <span className="rounded-full border border-gold-500/30 bg-crema-50/80 px-3 py-1.5 text-xs text-gold-700 backdrop-blur">
              {cantidad} en escena
            </span>
          </div>
        </Reveal>

        {/* Selector */}
        <Reveal delay={100} className="flex flex-col gap-6">
          <div className="card p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-gold-700 uppercase">Cantidad</p>
                <p className="font-display text-3xl text-tinta-900">
                  {cantidad} <span className="text-lg text-tinta-500">músicos</span>
                </p>
                <p className="text-sm text-tinta-400">{opcion.etiqueta}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] tracking-wide text-tinta-400 uppercase">Show 45 min</p>
                <p className="font-display text-2xl text-gold-700">{formatCLP(cotizacion.total)}</p>
                <p className="text-xs text-tinta-400">
                  {formatCLP(cotizacion.precioPorMusico)} por músico
                </p>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={3}
              max={12}
              step={1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="mt-6 w-full cursor-pointer accent-[color:var(--color-gold-400)]"
              aria-label="Cantidad de músicos"
            />

            {/* Atajos */}
            <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
              {OPCIONES_MUSICOS.map((o) => (
                <button
                  key={o.cantidad}
                  type="button"
                  onClick={() => setCantidad(o.cantidad)}
                  aria-pressed={o.cantidad === cantidad}
                  className={`relative cursor-pointer rounded-xl border py-2 text-sm transition ${
                    o.cantidad === cantidad
                      ? 'border-gold-500/70 bg-gold-400/20 text-gold-700'
                      : 'bg-crema-100 text-tinta-500 hover:border-gold-500/40 hover:text-tinta-900'
                  }`}
                >
                  {o.cantidad}
                  {o.popular && (
                    <span className="absolute -top-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-agave-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {opcion.instrumentos.map((inst) => (
                <span
                  key={inst}
                  className={`chip ${
                    hover === inst ? 'border-gold-500/60 bg-gold-400/10 text-gold-700' : ''
                  }`}
                >
                  <Icon name="music" className="size-3" />
                  {inst}
                </span>
              ))}
            </div>
            {opcion.popular && (
              <p className="mt-4 text-xs text-agave-600">
                ★ La formación base (5 músicos) es la que más piden: voz principal, teclado, guitarra,
                batería y huira en escena.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={agendar} className="btn-gold flex-1">
                <Icon name="calendar" className="size-4" />
                Agendar con {cantidad} músicos
              </button>
              <a href="#agenda" className="btn-ghost flex-1">
                Ver agenda primero
              </a>
            </div>
          </div>

          {/* Extras */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-tinta-900">Suma extras a tu show</h3>
              <Badge tono="verde">Opcional</Badge>
            </div>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {EXTRAS.map((extra) => (
                <li
                  key={extra.id}
                  className="flex items-start gap-3 rounded-2xl border border-crema-200 p-3"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-gold-500/25 bg-crema-50/70 text-gold-700">
                    <Icon name={extra.icono} className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-tinta-800">{extra.nombre}</p>
                    <p className="text-xs text-tinta-400">{extra.descripcion}</p>
                    <p className="mt-1 text-xs font-semibold text-gold-700">
                      + {formatCLP(extra.precio)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-tinta-400">
              Los extras se activan en el paso 3 de la agenda, así ves el total actualizado al
              instante.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
