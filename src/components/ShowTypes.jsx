import { useMemo, useState } from 'react'
import { TIPOS_SHOW } from '../data/shows'
import { cotizar } from '../lib/pricing'
import { formatCLP } from '../lib/format'
import { SITE, waLink } from '../config/site'
import { useBooking } from '../context/BookingContext'
import { useToast } from '../context/ToastContext'
import { useTilt } from '../hooks/useUI'
import Icon from './icons'
import { Badge, Reveal, SectionTitle } from './ui'

function TarjetaShow({ show, activo, onElegir }) {
  const tilt = useTilt({ max: 6, escala: 1.015 })
  const desde = useMemo(
    () => cotizar({ cantidadMusicos: 6, tipoShowId: show.id, comuna: 'Santiago' }).total,
    [show.id],
  )

  return (
    <button
      type="button"
      onClick={onElegir}
      aria-pressed={activo}
      className={`group tilt-card relative overflow-hidden rounded-3xl border p-5 text-left transition ${
        activo
          ? 'border-gold-500/60 bg-gold-400/[0.08] shadow-[0_18px_40px_-24px_rgb(193_134_26/0.55)]'
          : 'bg-crema-100 hover:border-gold-500/35 hover:bg-crema-100'
      }`}
      ref={tilt}
    >
      <div className={`absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br ${show.color} opacity-20 blur-2xl transition group-hover:opacity-35`} />
      <div className="relative flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-2xl border border-gold-500/25 bg-crema-50/70 text-gold-700">
          <Icon name={show.icono} className="size-5" />
        </span>
        {show.destacado && <Badge tono="gold">Más pedido</Badge>}
      </div>
      <h3 className="relative mt-4 text-lg text-tinta-900">{show.nombre}</h3>
      <p className="relative mt-2 line-clamp-2 text-sm text-tinta-500">{show.resumen}</p>
      <div className="relative mt-4 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-tinta-400">
          <Icon name="clock" className="size-3.5" />
          {show.duracion} min
        </span>
        <span className="font-semibold text-gold-700">desde {formatCLP(desde)}</span>
      </div>
    </button>
  )
}

export default function ShowTypes() {
  const [activoId, setActivoId] = useState('serenata')
  const activo = TIPOS_SHOW.find((s) => s.id === activoId) || TIPOS_SHOW[0]
  const { irAAgenda } = useBooking()
  const { toast } = useToast()

  const { total, musica } = useMemo(() => {
    const cinco = cotizar({ cantidadMusicos: 5, tipoShowId: activo.id, comuna: 'Maipú' })
    const trio = cotizar({ cantidadMusicos: 3, tipoShowId: activo.id, comuna: 'Maipú' })
    return { total: cinco.total, musica: trio.total }
  }, [activo.id])

  const agendar = () => {
    irAAgenda({ tipoShowId: activo.id })
    toast(`Formato "${activo.nombre}" cargado en la agenda`, 'success')
  }

  return (
    <section id="shows" className="section">
      <SectionTitle
        kicker="Formatos de show"
        titulo="Elige el formato según tu celebración"
        bajada="Todos los shows incluyen vestuario formal de la banda, repertorio ranchero-bailable y la posibilidad de sumar un bloque de mariachi mexicano."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {TIPOS_SHOW.map((show, i) => (
            <Reveal key={show.id} delay={i * 45}>
              <TarjetaShow
                show={show}
                activo={show.id === activoId}
                onElegir={() => setActivoId(show.id)}
              />
            </Reveal>
          ))}
        </div>

        {/* Detalle del show seleccionado */}
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="card overflow-hidden">
            <div className={`h-1.5 w-full bg-gradient-to-r ${activo.color}`} />
            <div className="p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl border border-gold-500/30 bg-crema-50/70 text-gold-700">
                  <Icon name={activo.icono} className="size-6" />
                </span>
                <div>
                  <h3 className="text-xl text-tinta-900">{activo.nombre}</h3>
                  <p className="text-xs tracking-wide text-tinta-400 uppercase">
                    {activo.duracion} minutos en vivo
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-tinta-500">{activo.resumen}</p>

              <ul className="mt-5 space-y-2.5">
                {activo.incluye.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-tinta-700">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-agave-500/15 text-agave-600">
                      <Icon name="check" className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tono="neutro">
                  <Icon name="heart" className="size-3" />
                  {activo.idealPara}
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-crema-200 bg-crema-50/50 p-4">
                <div>
                  <p className="text-[11px] tracking-wide text-tinta-400 uppercase">
                    Formato compacto (3 mús.)
                  </p>
                  <p className="font-display text-lg text-tinta-900">{formatCLP(musica)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] tracking-wide text-tinta-400 uppercase">
                    Formación base (5 mús.)
                  </p>
                  <p className="font-display text-lg text-gold-700">{formatCLP(total)}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button type="button" onClick={agendar} className="btn-gold w-full">
                  <Icon name="calendar" className="size-4" />
                  Agendar {activo.nombre.toLowerCase()}
                </button>
                <a
                  href={waLink(`Hola! Quiero consultar por el formato "${activo.nombre}" para un evento en ${SITE.comunaBase}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost w-full"
                >
                  <Icon name="whatsapp" className="size-4" />
                  Consultar por WhatsApp
                </a>
              </div>
              <p className="mt-3 text-center text-[11px] text-tinta-400">
                Valores de referencia en {SITE.comunaBase} · se ajustan al elegir comuna en la agenda
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
