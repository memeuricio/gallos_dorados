import { useEffect, useRef } from 'react'
import { useBloquearScroll, useEscape } from '../hooks/useUI'
import Icon from './icons'

/** Modal accesible y reutilizable (galería, resumen de reserva, etc.). */
export default function Modal({ abierto, onCerrar, titulo, children, ancho = 'max-w-3xl' }) {
  const contenedor = useRef(null)

  useBloquearScroll(abierto)
  useEscape(abierto, onCerrar)

  useEffect(() => {
    if (abierto) contenedor.current?.focus()
  }, [abierto])

  if (!abierto) return null

  return (
    <div
      className="animate-fade fixed inset-0 z-[100] flex items-end justify-center bg-crema-50/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar()
      }}
    >
      <div
        ref={contenedor}
        tabIndex={-1}
        className={`animate-slide-up w-full ${ancho} max-h-[92vh] overflow-y-auto rounded-t-3xl border border-crema-200 bg-crema-100/95 shadow-[0_30px_90px_-30px_rgb(60_34_10/0.35)] sm:rounded-3xl scrollbar-thin-gold`}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-crema-200 bg-crema-100/95 px-6 py-4 backdrop-blur">
          <h3 className="text-lg">{titulo}</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="grid size-9 cursor-pointer place-items-center rounded-full border border-crema-300 text-tinta-700 transition hover:border-gold-500/50 hover:text-gold-700"
            aria-label="Cerrar"
          >
            <Icon name="close" className="size-4" />
          </button>
        </header>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
