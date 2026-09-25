import { INSTRUMENTOS_MARQUEE } from '../data/contenido'
import Icon from './icons'

/** Cinta infinita con los instrumentos del grupo, estilo carátula de disco. */
export default function Marquee() {
  const lista = [...INSTRUMENTOS_MARQUEE, ...INSTRUMENTOS_MARQUEE]
  return (
    <div className="relative overflow-hidden border-y border-crimson-700/40 bg-crimson-600 py-4 text-crema-50">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-crimson-600 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-crimson-600 to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-10">
        {lista.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-3 text-sm tracking-[0.12em] uppercase">
            <Icon
              name={i % 3 === 0 ? 'guitar' : i % 3 === 1 ? 'trumpet' : 'violin'}
              className="size-4 text-gold-300"
            />
            {item}
            <span className="size-1 rounded-full bg-gold-300/70" />
          </span>
        ))}
      </div>
    </div>
  )
}
