import { Component, Suspense, lazy, useCallback, useState } from 'react'
import Icon from './icons'

/* Carga diferida: three.js viaja en su propio chunk y no bloquea el primer render. */
const GuitarraHero = lazy(() => import('./three/GuitarraHero'))

/** Si el navegador no soporta WebGL, mostramos un apunte en vez de romper. */
class Limite3D extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="placeholder-media grid h-full w-full place-items-center rounded-[2.5rem] border border-dashed border-gold-500/40">
          <div className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-gold-500/30 text-gold-600">
              <Icon name="guitar" className="size-6" />
            </span>
            <p className="mt-3 font-display text-sm text-tinta-700">La vista 3D no cargó</p>
            <p className="text-xs text-tinta-400">Tu navegador no tiene WebGL habilitado</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function Cargando3D() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="flex items-center gap-3 text-sm text-tinta-400">
        <span className="grid size-9 place-items-center rounded-full border border-gold-500/40 text-gold-600">
          <Icon name="guitar" className="size-4 animate-pulse" />
        </span>
        Preparando la guitarra...
      </div>
    </div>
  )
}

/**
 * Vista 3D del hero (guitarra acústica).
 * props:
 *  - reducido: respeta prefers-reduced-motion
 *  - className: clases de tamaño del contenedor
 */
export function Vista3DHero({ className = '', reducido = false }) {
  const [listo, setListo] = useState(false)
  const alListo = useCallback(() => setListo(true), [])

  return (
    <div className={`relative ${className}`}>
      {/* halo cálido + apoyo en el piso: puro CSS, no cuesta render */}
      <div
        className="pointer-events-none absolute inset-x-4 top-2 bottom-6 -z-10 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_45%,rgb(234_177_58/0.35),transparent_68%)] blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-16 bottom-4 -z-10 h-16 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(90_60_20/0.28),transparent_72%)] blur-xl"
        aria-hidden="true"
      />

      <Limite3D>
        <Suspense fallback={<Cargando3D />}>
          <GuitarraHero reducido={reducido} onListo={alListo} />
        </Suspense>
      </Limite3D>

      {!listo && (
        <div className="pointer-events-none absolute inset-0">
          <Cargando3D />
        </div>
      )}
    </div>
  )
}
