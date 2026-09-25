import { useEffect, useState } from 'react'
import { PRESENTACIONES } from '../data/contenido'
import Icon from './icons'
import { Badge, Reveal, SectionTitle } from './ui'

/** Cuántas tarjetas se ven según el ancho de pantalla. */
function usePorVista() {
  const [porVista, setPorVista] = useState(1)
  useEffect(() => {
    const calcular = () => {
      const w = window.innerWidth
      setPorVista(w >= 1024 ? 3 : w >= 640 ? 2 : 1)
    }
    calcular()
    window.addEventListener('resize', calcular)
    return () => window.removeEventListener('resize', calcular)
  }, [])
  return porVista
}

function Tarjeta({ p }) {
  return (
    <figure className="card flex h-full flex-col overflow-hidden p-0">
      {p.img ? (
        <img
          src={p.img}
          alt={p.titulo}
          loading="lazy"
          className="h-44 w-full shrink-0 object-cover"
        />
      ) : (
        <div className="grid h-44 w-full shrink-0 place-items-center bg-gradient-to-br from-gold-400/15 via-transparent to-transparent">
          <Icon name={p.icono || 'star'} className="size-12 text-gold-700/80" />
        </div>
      )}

      <div className="flex grow flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge tono="gold">{p.etiqueta}</Badge>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-tinta-400">
            <Icon name="pin" className="size-3.5" />
            {p.lugar}
          </span>
        </div>
        <h3 className="mt-3 text-lg leading-snug text-tinta-900">{p.titulo}</h3>
        <p className="mt-2 grow text-sm leading-relaxed text-tinta-500">{p.texto}</p>

        {p.enlaces && (
          <div className="mt-4 flex flex-wrap gap-2">
            {p.enlaces.map((e) => (
              <a
                key={e.url}
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="chip transition hover:border-gold-500/55 hover:text-gold-700"
              >
                {e.label}
                <Icon name="arrowRight" className="size-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </figure>
  )
}

export default function Presentaciones() {
  const porVista = usePorVista()
  const [indice, setIndice] = useState(0)
  const [pausa, setPausa] = useState(false)
  const total = PRESENTACIONES.length
  const maxIndice = Math.max(0, total - porVista)

  useEffect(() => {
    setIndice((i) => Math.min(i, maxIndice))
  }, [maxIndice])

  useEffect(() => {
    if (pausa) return
    const timer = window.setInterval(() => {
      setIndice((i) => (i >= maxIndice ? 0 : i + 1))
    }, 5200)
    return () => window.clearInterval(timer)
  }, [pausa, maxIndice])

  const desplazamiento = -(indice * (100 / porVista))

  return (
    <section id="presentaciones" className="section">
      <SectionTitle
        kicker="Presentaciones"
        titulo="Escenarios donde ya sonamos"
        bajada="Fondas masivas, festivales, campañas solidarias y programas de música. Estos son algunos de los lugares donde Gallos Dorados ya se subió."
      />

      <Reveal className="mt-12">
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setPausa(true)}
          onMouseLeave={() => setPausa(false)}
        >
          <ul
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(${desplazamiento}%)` }}
          >
            {PRESENTACIONES.map((p) => (
              <li key={p.id} className="w-full shrink-0 px-2 sm:w-1/2 lg:w-1/3">
                <Tarjeta p={p} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIndice((i) => Math.max(0, i - 1))}
            disabled={indice === 0}
            className="grid size-9 cursor-pointer place-items-center rounded-xl border border-crema-300 text-tinta-700 transition hover:border-gold-500/50 hover:text-gold-700 disabled:opacity-30"
            aria-label="Presentación anterior"
          >
            <Icon name="chevronLeft" className="size-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxIndice + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndice(i)}
                aria-label={`Ir a la presentación ${i + 1}`}
                className={`h-1.5 cursor-pointer rounded-full transition-all ${
                  i === indice ? 'w-6 bg-gold-400' : 'w-1.5 bg-crema-400 hover:bg-tinta-400'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIndice((i) => Math.min(maxIndice, i + 1))}
            disabled={indice >= maxIndice}
            className="grid size-9 cursor-pointer place-items-center rounded-xl border border-crema-300 text-tinta-700 transition hover:border-gold-500/50 hover:text-gold-700 disabled:opacity-30"
            aria-label="Siguiente presentación"
          >
            <Icon name="chevronRight" className="size-4" />
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-tinta-400">
          ¿Tienes fotos o videos de un show nuestro? Mándanoslos y los sumamos a la galería.
        </p>
      </Reveal>
    </section>
  )
}
