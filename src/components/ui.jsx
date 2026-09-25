import { useReveal } from '../hooks/useUI'
import Icon from './icons'

/* ------------------------------------------------------------------ *
 * Placeholder de imágenes: se usa mientras llegan las fotos reales.
 * Reemplaza cada <Placeholder /> por <img src="..." alt="..." />.
 * ------------------------------------------------------------------ */
export function Placeholder({
  label = 'Imagen pendiente',
  detalle = 'Reemplazar por foto real',
  icono = 'image',
  className = '',
  children,
}) {
  return (
    <div
      className={`placeholder-media relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border border-dashed border-gold-500/30 bg-crema-100/60 text-center ${className}`}
    >
      <span className="grid size-12 place-items-center rounded-2xl border border-gold-500/25 bg-crema-50/60 text-gold-700">
        <Icon name={icono} className="size-6" />
      </span>
      <div className="px-4">
        <p className="font-display text-sm text-tinta-800">{label}</p>
        <p className="text-[11px] tracking-wide text-tinta-400 uppercase">{detalle}</p>
      </div>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Reveal: aparece al hacer scroll
 * ------------------------------------------------------------------ */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', ...rest }) {
  const { ref, visible } = useReveal({ delay })
  return (
    <Tag
      ref={ref}
      className={`reveal-base ${visible ? 'reveal-shown' : 'reveal-hidden'} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ *
 * Título de sección
 * ------------------------------------------------------------------ */
export function SectionTitle({ kicker, titulo, bajada, centrado = true, className = '' }) {
  return (
    <Reveal className={`${centrado ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}>
      {kicker && (
        <span className="chip border-gold-500/30 bg-gold-400/10 text-gold-700">
          <Icon name="sparkles" className="size-3.5" />
          {kicker}
        </span>
      )}
      <h2 className="mt-4 text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
        {titulo}
      </h2>
      {bajada && <p className="mt-4 text-base text-tinta-500 sm:text-lg">{bajada}</p>}
    </Reveal>
  )
}

/* ------------------------------------------------------------------ *
 * Ecualizador animado (detalle visual)
 * ------------------------------------------------------------------ */
export function Equalizer({ barras = 5, className = '' }) {
  return (
    <span className={`inline-flex h-5 items-end gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: barras }).map((_, i) => (
        <span
          key={i}
          className="animate-eq w-[3px] origin-bottom rounded-full bg-gold-400"
          style={{ height: `${8 + ((i * 7) % 12)}px`, animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Estrellas de evaluación
 * ------------------------------------------------------------------ */
export function Stars({ n = 5, className = '' }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          className={`size-4 ${i < n ? 'text-gold-600' : 'text-crema-400'}`}
          style={i < n ? { fill: 'currentColor', strokeWidth: 0.5 } : undefined}
        />
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Etiqueta pequeña de estado
 * ------------------------------------------------------------------ */
export function Badge({ children, tono = 'gold', className = '' }) {
  const tonos = {
    gold: 'border-gold-500/35 bg-gold-400/20 text-gold-700',
    verde: 'border-agave-400/35 bg-agave-500/12 text-agave-600',
    rojo: 'border-crimson-500/35 bg-crimson-500/12 text-crimson-600',
    neutro: 'bg-crema-100 text-tinta-500',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${tonos[tono]} ${className}`}
    >
      {children}
    </span>
  )
}
