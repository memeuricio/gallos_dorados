import { useEffect, useRef } from 'react'
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  EquirectangularReflectionMapping,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  RingGeometry,
  SRGBColorSpace,
  Scene,
  Shape,
  ShapeGeometry,
  WebGLRenderer,
} from 'three'

/* =========================================================================
   Escena 3D del hero: una guitarra acústica sola.

   Es three.js "puro" (sin @react-three/fiber ni drei) para que el chunk sea
   lo más chico posible:

   - El cuerpo se extruye desde la silueta real de una guitarra (una sola
     geometría con bisel), no con lathe.
   - La tapa lleva una textura de madera con "sunburst" dibujada en un canvas
     al vuelo, así no se descarga ninguna imagen extra.
   - Los reflejos salen de un mapa equirectangular generado también en canvas
     (sin HDRI externo).
   - Sin sombras dinámicas ni partículas: una sombra falsa en el piso cuesta
     cero y el resultado pesa muchísimo menos.

   La guitarra gira sola, despacio (16 s de lado a lado). No hay interacción
   con el puntero: en el celular el canvas es decorativo y el scroll manda.

   El loop de render se pausa solo cuando el canvas sale de pantalla o la
   pestaña queda en segundo plano. Además la escena se monta UNA vez: el
   callback de "listo" se lee desde un ref para no reconstruir el WebGL en
   cada render del hero.
   ========================================================================= */

/* ------------------------------- Texturas -------------------------------- */

/** Tapa: degradado sunburst + vetas verticales finas. */
function texturaMadera() {
  const S = 512
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d')

  const centro = ctx.createRadialGradient(S / 2, S * 0.6, 12, S / 2, S * 0.6, S * 0.66)
  centro.addColorStop(0, '#f0b04a')
  centro.addColorStop(0.28, '#d0801f')
  centro.addColorStop(0.55, '#a0521a')
  centro.addColorStop(0.78, '#6d3110')
  centro.addColorStop(1, '#3d1c07')
  ctx.fillStyle = centro
  ctx.fillRect(0, 0, S, S)

  // vetas: líneas verticales apenas onduladas
  ctx.lineWidth = 1.2
  for (let i = 0; i < 150; i++) {
    const x = (i / 150) * S + Math.sin(i * 2.3) * 6
    ctx.strokeStyle = `rgba(60, 26, 6, ${0.04 + (i % 5) * 0.012})`
    ctx.beginPath()
    ctx.moveTo(x, 0)
    for (let y = 0; y <= S; y += 32) {
      ctx.lineTo(x + Math.sin((y + i * 40) * 0.02) * 3, y)
    }
    ctx.stroke()
  }

  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  // Las UV de ExtrudeGeometry vienen en coordenadas de la silueta (x,y),
  // así que llevamos ese rango a 0..1
  tex.repeat.set(1 / 2.1, 1 / 2.95)
  tex.offset.set(0.5, 0.5)
  tex.anisotropy = 4
  return tex
}

/** Mapa de reflejos: degradado cálido + una ventana de luz. Sin HDRI externo. */
function texturaEntorno() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 128
  const ctx = c.getContext('2d')

  const fondo = ctx.createLinearGradient(0, 0, 0, 128)
  fondo.addColorStop(0, '#fff8ea')
  fondo.addColorStop(0.42, '#f2ddbe')
  fondo.addColorStop(0.52, '#9c7a55')
  fondo.addColorStop(1, '#2a1a0c')
  ctx.fillStyle = fondo
  ctx.fillRect(0, 0, 256, 128)

  const ventana = ctx.createRadialGradient(72, 30, 4, 72, 30, 68)
  ventana.addColorStop(0, 'rgba(255,255,255,0.95)')
  ventana.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = ventana
  ctx.fillRect(0, 0, 256, 128)

  const tex = new CanvasTexture(c)
  tex.mapping = EquirectangularReflectionMapping
  tex.colorSpace = SRGBColorSpace
  return tex
}

/** Mancha suave para el piso (reemplaza a las sombras dinámicas). */
function texturaSombra() {
  const S = 256
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(S / 2, S / 2, 4, S / 2, S / 2, S / 2)
  g.addColorStop(0, 'rgba(74, 44, 14, 0.5)')
  g.addColorStop(0.5, 'rgba(74, 44, 14, 0.2)')
  g.addColorStop(1, 'rgba(74, 44, 14, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  return tex
}

/* -------------------------------- Piezas --------------------------------- */

/** Silueta del cuerpo: media guitarra simétrica (el resto se refleja). */
function contornoCuerpo() {
  const s = new Shape()
  s.moveTo(0, 1.24)
  s.bezierCurveTo(0.5, 1.24, 0.74, 0.94, 0.74, 0.5)
  s.bezierCurveTo(0.74, 0.16, 0.62, 0.1, 0.7, -0.2)
  s.bezierCurveTo(0.78, -0.52, 1.0, -0.68, 1.0, -1.02)
  s.bezierCurveTo(1.0, -1.38, 0.72, -1.66, 0, -1.66)
  s.bezierCurveTo(-0.72, -1.66, -1.0, -1.38, -1.0, -1.02)
  s.bezierCurveTo(-1.0, -0.68, -0.78, -0.52, -0.7, -0.2)
  s.bezierCurveTo(-0.62, 0.1, -0.74, 0.16, -0.74, 0.5)
  s.bezierCurveTo(-0.74, 0.94, -0.5, 1.24, 0, 1.24)
  return s
}

function materiales() {
  return {
    tapa: new MeshPhysicalMaterial({
      map: texturaMadera(),
      roughness: 0.32,
      metalness: 0.05,
      clearcoat: 0.65,
      clearcoatRoughness: 0.28,
    }),
    canto: new MeshStandardMaterial({ color: 0x4a2109, roughness: 0.45, metalness: 0.08 }),
    mastil: new MeshStandardMaterial({ color: 0x6b3a15, roughness: 0.5, metalness: 0.06 }),
    diapason: new MeshStandardMaterial({ color: 0x2c1608, roughness: 0.62, metalness: 0.05 }),
    negro: new MeshStandardMaterial({ color: 0x140b04, roughness: 0.85 }),
    hueso: new MeshStandardMaterial({ color: 0xf3e6cf, roughness: 0.4, metalness: 0.05 }),
    oro: new MeshStandardMaterial({ color: 0xd8a63c, metalness: 1, roughness: 0.28 }),
    cuerda: new MeshStandardMaterial({ color: 0xdcd2c0, metalness: 0.95, roughness: 0.16 }),
    golpeador: new MeshStandardMaterial({ color: 0x20110a, roughness: 0.35, metalness: 0.1, side: DoubleSide }),
  }
}

/** Alturas de referencia del modelo (todo se arma en un grupo centrado). */
const FRENTE_TAPA = 0.2

function Guitarra() {
  const m = materiales()
  const grupo = new Group()

  /* --- cuerpo: una sola extrusión con bisel (tapa + canto) --- */
  const cuerpo = new Mesh(
    new ExtrudeGeometry(contornoCuerpo(), {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.045,
      bevelSegments: 3,
      curveSegments: 26,
    }),
    [m.tapa, m.canto],
  )
  cuerpo.position.z = -0.245
  grupo.add(cuerpo)

  /* --- boca + roseta --- */
  const boca = new Mesh(new CircleGeometry(0.26, 40), m.negro)
  boca.position.set(0, 0.05, FRENTE_TAPA + 0.006)
  grupo.add(boca)

  const roseta = new Mesh(new RingGeometry(0.28, 0.34, 48), m.hueso)
  roseta.position.set(0, 0.05, FRENTE_TAPA + 0.004)
  grupo.add(roseta)

  const aro = new Mesh(new RingGeometry(0.36, 0.385, 48), m.oro)
  aro.position.set(0, 0.05, FRENTE_TAPA + 0.003)
  grupo.add(aro)

  /* --- puente + selleta + pines --- */
  const puente = new Mesh(new BoxGeometry(1.02, 0.17, 0.075), m.diapason)
  puente.position.set(0, -0.66, FRENTE_TAPA + 0.03)
  grupo.add(puente)

  const selleta = new Mesh(new BoxGeometry(0.88, 0.055, 0.05), m.hueso)
  selleta.position.set(0, -0.63, FRENTE_TAPA + 0.075)
  grupo.add(selleta)

  for (let i = 0; i < 6; i++) {
    const pin = new Mesh(new CylinderGeometry(0.018, 0.018, 0.05, 8), m.hueso)
    pin.position.set(-0.28 + i * 0.112, -0.75, FRENTE_TAPA + 0.05)
    grupo.add(pin)
  }

  /* --- golpeador (lado de las cuerdas agudas) --- */
  const forma = new Shape()
  forma.moveTo(0, 0)
  forma.bezierCurveTo(0.3, -0.1, 0.44, -0.44, 0.3, -0.76)
  forma.bezierCurveTo(0.22, -0.92, 0.12, -0.78, 0.1, -0.54)
  forma.bezierCurveTo(0.06, -0.32, 0.02, -0.14, 0, 0)
  const golpeador = new Mesh(new ShapeGeometry(forma), m.golpeador)
  golpeador.position.set(0.34, 0.24, FRENTE_TAPA + 0.006)
  grupo.add(golpeador)

  /* --- mástil + diapasón --- */
  const mastil = new Mesh(new BoxGeometry(0.25, 2.16, 0.16), m.mastil)
  mastil.position.set(0, 1.72, 0.11)
  grupo.add(mastil)

  const diapason = new Mesh(new BoxGeometry(0.27, 2.16, 0.07), m.diapason)
  diapason.position.set(0, 1.72, 0.205)
  grupo.add(diapason)

  for (let i = 0; i < 12; i++) {
    const traste = new Mesh(new BoxGeometry(0.27, 0.016, 0.012), m.hueso)
    traste.position.set(0, 0.82 + i * 0.155, 0.243)
    grupo.add(traste)
  }
  for (const y of [1.05, 1.36, 1.67]) {
    const punto = new Mesh(new CircleGeometry(0.028, 12), m.hueso)
    punto.position.set(0, y, 0.241)
    grupo.add(punto)
  }

  /* --- pala + clavijas --- */
  const pala = new Mesh(new BoxGeometry(0.34, 0.68, 0.13), m.mastil)
  pala.position.set(0, 3.09, 0.08)
  pala.rotation.x = -0.14
  grupo.add(pala)

  for (let i = 0; i < 3; i++) {
    for (const lado of [-1, 1]) {
      const eje = new Mesh(new CylinderGeometry(0.022, 0.022, 0.16, 10), m.oro)
      eje.position.set(lado * 0.2, 2.9 + i * 0.2, 0.04)
      eje.rotation.z = Math.PI / 2
      grupo.add(eje)

      const perilla = new Mesh(new CylinderGeometry(0.045, 0.04, 0.05, 12), m.oro)
      perilla.position.set(lado * 0.28, 2.9 + i * 0.2, 0.04)
      perilla.rotation.z = Math.PI / 2
      grupo.add(perilla)
    }
  }

  /* --- cejuela + cuerdas --- */
  const cejuela = new Mesh(new BoxGeometry(0.26, 0.05, 0.05), m.hueso)
  cejuela.position.set(0, 2.58, 0.24)
  grupo.add(cejuela)

  for (let i = 0; i < 6; i++) {
    const cuerda = new Mesh(new CylinderGeometry(0.006, 0.006, 3.3, 6), m.cuerda)
    cuerda.position.set(-0.2 + i * 0.08, 0.93, 0.268)
    grupo.add(cuerda)
  }

  return grupo
}

/* -------------------------------- Montaje -------------------------------- */

function montar(contenedor, { reducido, onListoRef }) {
  const escena = new Scene()
  const camara = new PerspectiveCamera(38, 1, 0.1, 60)
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const canvas = renderer.domElement
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  // Ojo: NO se toca touch-action. El canvas es decorativo y no debe
  // interceptar el scroll del celular.
  contenedor.appendChild(canvas)

  const pmrem = new PMREMGenerator(renderer)
  const entorno = texturaEntorno()
  escena.environment = pmrem.fromEquirectangular(entorno).texture
  escena.environmentIntensity = 0.9
  entorno.dispose()
  pmrem.dispose()

  escena.add(new HemisphereLight(0xfff1d6, 0x6b4a2a, 1.1))
  escena.add(new AmbientLight(0xffe8c4, 0.3))

  const clave = new DirectionalLight(0xfff3dc, 2.7)
  clave.position.set(3.5, 5, 4.5)
  escena.add(clave)

  const contra = new PointLight(0xffb066, 90, 22, 2)
  contra.position.set(-4.5, 1.5, -3)
  escena.add(contra)

  const relleno = new DirectionalLight(0xffd9a0, 0.75)
  relleno.position.set(-4, 1, 3)
  escena.add(relleno)

  const guitarra = Guitarra()
  guitarra.rotation.z = 0.09
  guitarra.position.y = -0.72

  const pivote = new Group()
  pivote.add(guitarra)
  escena.add(pivote)

  const sombra = new Mesh(
    new PlaneGeometry(4.4, 4.4),
    new MeshBasicMaterial({ map: texturaSombra(), transparent: true, depthWrite: false, opacity: 0.7 }),
  )
  sombra.rotation.x = -Math.PI / 2
  sombra.position.set(0, -2.3, 0)
  escena.add(sombra)

  /* ----------------------------- Redimensión ----------------------------- */
  const ajustar = () => {
    const ancho = contenedor.clientWidth || 1
    const alto = contenedor.clientHeight || 1
    renderer.setSize(ancho, alto, false)
    const aspecto = ancho / alto
    camara.aspect = aspecto
    // En pantallas angostas la cámara se aleja para no recortar la guitarra
    camara.position.set(0, 0.35, aspecto < 0.85 ? 9.9 : aspecto < 1.25 ? 8.7 : 7.9)
    camara.lookAt(0, 0.05, 0)
    camara.updateProjectionMatrix()
  }
  ajustar()

  const observador =
    typeof ResizeObserver !== 'undefined' ? new ResizeObserver(ajustar) : null
  observador?.observe(contenedor)
  window.addEventListener('resize', ajustar)

  /* -------------------------------- Loop -------------------------------- */
  let enPantalla = true
  let enPestana = document.visibilityState === 'visible'
  let animando = false
  let listo = false
  const reloj = { t: 0, previo: performance.now() }

  const dibujar = () => {
    const ahora = performance.now()
    const delta = Math.min(0.05, (ahora - reloj.previo) / 1000)
    reloj.previo = ahora
    reloj.t += delta

    // Giro automático lento (16 s por vuelta completa de lado a lado).
    // No llega a dar la espalda: de perfil el cuerpo es muy delgado y la
    // guitarra se perdería.
    const giro = reducido ? 0 : Math.sin((reloj.t * Math.PI * 2) / 16) * 0.62
    const inclinacion = reducido ? 0 : Math.sin((reloj.t * Math.PI * 2) / 23) * 0.06
    pivote.rotation.y += (giro - pivote.rotation.y) * Math.min(1, delta * 2.2)
    pivote.rotation.x += (inclinacion - pivote.rotation.x) * Math.min(1, delta * 2.2)
    pivote.position.y = reducido ? 0 : Math.sin(reloj.t * 0.6) * 0.05

    renderer.render(escena, camara)
    if (!listo) {
      listo = true
      onListoRef.current?.()
    }
  }

  const actualizar = () => {
    const deberia = enPantalla && enPestana
    if (deberia && !animando) {
      animando = true
      reloj.previo = performance.now()
      renderer.setAnimationLoop(dibujar)
    } else if (!deberia && animando) {
      animando = false
      renderer.setAnimationLoop(null)
    }
  }

  const io = new IntersectionObserver(
    ([entrada]) => {
      enPantalla = entrada.isIntersecting
      actualizar()
    },
    { threshold: 0.01 },
  )
  io.observe(contenedor)

  const alCambiarPestana = () => {
    enPestana = document.visibilityState === 'visible'
    actualizar()
  }
  document.addEventListener('visibilitychange', alCambiarPestana)

  // Primer frame (deja el canvas pintado aunque el observer aún no dispare)
  dibujar()

  return () => {
    renderer.setAnimationLoop(null)
    io.disconnect()
    observador?.disconnect()
    window.removeEventListener('resize', ajustar)
    document.removeEventListener('visibilitychange', alCambiarPestana)
    escena.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose()
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((mat) => {
          mat.map?.dispose()
          mat.dispose()
        })
      }
    })
    escena.environment?.dispose()
    renderer.dispose()
    canvas.remove()
  }
}

/* =========================================================================
   Componente: monta la escena. No tiene interacción: la guitarra gira sola
   y el contenedor no captura el puntero (en el celular el scroll manda).
   ========================================================================= */
export default function GuitarraHero({ reducido = false, onListo }) {
  const contenedorRef = useRef(null)
  const onListoRef = useRef(onListo)
  onListoRef.current = onListo

  useEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return undefined
    return montar(contenedor, { reducido, onListoRef })
  }, [reducido])

  return (
    <div
      ref={contenedorRef}
      className="pointer-events-none h-full w-full select-none"
      role="img"
      aria-label="Guitarra acústica en 3D girando lentamente."
    />
  )
}
