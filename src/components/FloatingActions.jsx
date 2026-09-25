import { useEffect, useState } from 'react'
import { SITE, waLink } from '../config/site'
import Icon from './icons'

export default function FloatingActions() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 700)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className="fixed right-4 bottom-24 z-[80] flex flex-col items-end gap-3 lg:bottom-6">
      {visible && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="animate-pop grid size-11 cursor-pointer place-items-center rounded-2xl border border-crema-200 bg-crema-100/90 text-tinta-700 backdrop-blur transition hover:border-gold-500/50 hover:text-gold-700"
          aria-label="Volver arriba"
        >
          <Icon name="arrowRight" className="size-4 -rotate-90" />
        </button>
      )}

      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center gap-2 rounded-2xl border border-agave-400/40 bg-agave-600/90 px-3.5 py-3 text-sm font-semibold text-tinta-900 shadow-[0_18px_50px_-20px_rgb(18_185_129/0.9)] transition hover:brightness-110 sm:px-4"
      >
        <Icon name="whatsapp" className="size-5" />
        <span className="hidden sm:inline">Cotizar por WhatsApp</span>
        <span className="absolute -inset-1 animate-pulse-ring rounded-2xl border border-agave-400/40" aria-hidden="true" />
        <span className="sr-only sm:hidden">Cotizar por WhatsApp al {SITE.telefono}</span>
      </a>
    </div>
  )
}
