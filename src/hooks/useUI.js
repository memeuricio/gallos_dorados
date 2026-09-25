import { useEffect, useRef, useState } from 'react'

/** Revela un bloque cuando entra en pantalla (IntersectionObserver). */
export function useReveal({ threshold = 0.18, once = true, delay = 0 } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          if (delay) window.setTimeout(() => setVisible(true), delay)
          else setVisible(true)
          if (once) obs.unobserve(entrada.target)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(nodo)
    return () => obs.disconnect()
  }, [threshold, once, delay])

  return { ref, visible }
}

/** Cuenta de 0 a `valor` cuando el bloque se hace visible. */
export function useCountUp(valor, { duracion = 1600, decimales = 0, activo = true } = {}) {
  const [actual, setActual] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    if (!activo) return
    const inicio = performance.now()
    const tick = (ahora) => {
      const t = Math.min(1, (ahora - inicio) / duracion)
      const suavizado = 1 - Math.pow(1 - t, 3)
      setActual(Number((valor * suavizado).toFixed(decimales)))
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [valor, duracion, decimales, activo])

  return actual
}

/** Efecto tilt 3D siguiendo el mouse (se desactiva en pantallas táctiles). */
export function useTilt({ max = 10, escala = 1.02 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const mover = (e) => {
      const r = nodo.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        nodo.style.transform = `perspective(900px) rotateY(${x * max * 2}deg) rotateX(${-y * max * 2}deg) scale(${escala})`
      })
    }
    const salir = () => {
      cancelAnimationFrame(raf)
      nodo.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)'
    }

    nodo.addEventListener('mousemove', mover)
    nodo.addEventListener('mouseleave', salir)
    return () => {
      cancelAnimationFrame(raf)
      nodo.removeEventListener('mousemove', mover)
      nodo.removeEventListener('mouseleave', salir)
    }
  }, [max, escala])

  return ref
}

/** Id de la sección visible actualmente (para el menú). */
export function useSeccionActiva(ids) {
  const [activa, setActiva] = useState(ids[0])

  useEffect(() => {
    const secciones = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!secciones.length) return

    const obs = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiva(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    secciones.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [ids])

  return activa
}

/** Porcentaje de scroll de la página (0 a 100). */
export function useScrollProgreso() {
  const [progreso, setProgreso] = useState(0)

  useEffect(() => {
    const calcular = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight
      setProgreso(alto > 0 ? Math.min(100, (window.scrollY / alto) * 100) : 0)
    }
    calcular()
    window.addEventListener('scroll', calcular, { passive: true })
    window.addEventListener('resize', calcular)
    return () => {
      window.removeEventListener('scroll', calcular)
      window.removeEventListener('resize', calcular)
    }
  }, [])

  return progreso
}

/** Bloquea el scroll del body (modales / drawer). */
export function useBloquearScroll(bloqueado) {
  useEffect(() => {
    if (!bloqueado) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previo
    }
  }, [bloqueado])
}

/** Escucha la tecla Escape. */
export function useEscape(activo, handler) {
  useEffect(() => {
    if (!activo) return
    const fn = (e) => {
      if (e.key === 'Escape') handler()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [activo, handler])
}

/** Respeta prefers-reduced-motion. */
export function useReducedMotion() {
  const [reducido, setReducido] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducido(mq.matches)
    const fn = (e) => setReducido(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reducido
}
