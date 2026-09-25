import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

const ICONOS = {
  success: 'check',
  info: 'bell',
  error: 'alert',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const cerrar = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (mensaje, tipo = 'info', duracion = 3600) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev.slice(-2), { id, mensaje, tipo }])
      window.setTimeout(() => cerrar(id), duracion)
      return id
    },
    [cerrar],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-24 left-4 z-[90] flex flex-col items-start gap-2 sm:bottom-8 sm:left-8"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-slide-up pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-gold-500/30 bg-crema-100/95 px-4 py-3 text-sm shadow-[0_18px_50px_-20px_rgb(60_34_10/0.3)] backdrop-blur-sm"
          >
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                t.tipo === 'success'
                  ? 'bg-agave-500/20 text-agave-600'
                  : t.tipo === 'error'
                    ? 'bg-crimson-500/20 text-crimson-600'
                    : 'bg-gold-400/20 text-gold-700'
              }`}
              aria-hidden="true"
            >
              {t.tipo === 'success' ? '✓' : t.tipo === 'error' ? '!' : '♪'}
            </span>
            <p className="text-tinta-800">{t.mensaje}</p>
            <button
              type="button"
              onClick={() => cerrar(t.id)}
              className="ml-2 cursor-pointer text-tinta-400 transition hover:text-tinta-800"
              aria-label="Cerrar aviso"
            >
              ✕
            </button>
            <span className="sr-only">{ICONOS[t.tipo]}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
