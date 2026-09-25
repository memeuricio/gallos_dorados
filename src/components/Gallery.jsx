import { useEffect, useState } from 'react'
import { GALERIA } from '../data/contenido'
import Icon from './icons'
import Modal from './Modal'
import { Reveal, SectionTitle } from './ui'

/** Clases de tamaño dentro del mosaico según la proporción de la foto. */
const SPANS = {
  wide: 'col-span-2 sm:col-span-2',
  tall: 'row-span-2 sm:row-span-2',
  square: '',
}

export default function Gallery() {
  const [abierto, setAbierto] = useState(false)
  const [indice, setIndice] = useState(0)

  const item = GALERIA[indice]

  useEffect(() => {
    if (!abierto) return
    const fn = (e) => {
      if (e.key === 'ArrowRight') setIndice((i) => (i + 1) % GALERIA.length)
      if (e.key === 'ArrowLeft') setIndice((i) => (i - 1 + GALERIA.length) % GALERIA.length)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [abierto])

  return (
    <section id="galeria" className="section">
      <SectionTitle
        kicker="Galería"
        titulo="Fotos reales del grupo"
        bajada="Material de nuestros shows, de la grabación de los discos y de los capítulos con Audiomúsica. Toca una foto para verla en grande."
      />

      <div className="mt-12 grid auto-rows-[minmax(190px,1fr)] grid-cols-2 gap-4 lg:grid-cols-4">
        {GALERIA.map((g, i) => (
          <Reveal key={g.id} delay={i * 40} className={`${SPANS[g.ratio] || ''} min-h-[190px]`}>
            <button
              type="button"
              onClick={() => {
                setIndice(i)
                setAbierto(true)
              }}
              className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-3xl"
              aria-label={`Ver ${g.titulo} en grande`}
            >
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-crema-50/80 via-crema-50/10 to-transparent opacity-80 transition group-hover:opacity-95" />

              <span className="absolute top-3 left-3 rounded-full border border-crema-200 bg-crema-50/80 px-3 py-1 text-[10px] tracking-wide text-gold-700 uppercase backdrop-blur">
                {g.tag}
              </span>

              <span className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-2 text-left">
                <span className="font-display text-sm text-tinta-900 drop-shadow">{g.titulo}</span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-gold-500/40 bg-crema-50/80 text-gold-700 opacity-0 transition group-hover:opacity-100">
                  <Icon name="search" className="size-4" />
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <Modal
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        titulo={item ? `${item.titulo} · ${item.tag}` : 'Galería'}
      >
        {item && (
          <div>
            <img
              src={item.src}
              alt={item.alt}
              className="max-h-[65vh] w-full rounded-2xl border border-crema-200 object-contain"
            />
            <p className="mt-4 text-center text-xs text-tinta-400">{item.alt}</p>

            <div className="mt-5 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setIndice((i) => (i - 1 + GALERIA.length) % GALERIA.length)}
                className="btn-ghost px-4 py-2 text-xs"
              >
                <Icon name="arrowLeft" className="size-4" />
                Anterior
              </button>
              <span className="text-xs text-tinta-400">
                {indice + 1} / {GALERIA.length}
              </span>
              <button
                type="button"
                onClick={() => setIndice((i) => (i + 1) % GALERIA.length)}
                className="btn-ghost px-4 py-2 text-xs"
              >
                Siguiente
                <Icon name="arrowRight" className="size-4" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
