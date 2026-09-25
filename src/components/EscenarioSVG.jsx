/* =========================================================================
   Escenario de la sección "Formación": una ilustración SVG que se rearma
   según la cantidad de músicos elegida. Reemplaza a la antigua escena 3D de
   los músicos: pesa unos pocos KB, es instantánea y se lee igual de bien en
   cualquier teléfono.
   ========================================================================= */

/** Familia de instrumento según el rol del músico (para dibujar la silueta). */
function familia(rol = '') {
  const r = rol.toLowerCase()
  if (r.includes('voz') || r.includes('animac')) return 'voz'
  if (r.includes('bater') || r.includes('percus') || r.includes('tarola')) return 'percu'
  if (r.includes('teclado') || r.includes('sonido')) return 'teclado'
  if (r.includes('trompeta') || r.includes('saxo') || r.includes('viento')) return 'viento'
  if (r.includes('huira')) return 'baile'
  return 'cuerda'
}

const COLORES = ['#7a530b', '#8a1b2c', '#2f5c4a', '#3a2b20', '#a92438', '#5f4a39', '#0b8f65', '#4a382b']

/** Instrumento que lleva cada figura, en su costado derecho. */
function Instrumento({ tipo }) {
  if (tipo === 'voz') {
    return (
      <g transform="translate(15 -50) rotate(14)">
        <rect x="-2.6" y="-10" width="5.2" height="15" rx="2.6" fill="#2a1e15" />
        <circle cx="0" cy="-10" r="4.8" fill="#3a2b20" />
        <path d="M0 5 L0 26" stroke="#2a1e15" strokeWidth="1.8" />
      </g>
    )
  }
  if (tipo === 'percu') {
    return (
      <g transform="translate(16 -32)">
        <rect x="-9.5" y="-10" width="19" height="20" rx="2.5" fill="#8a1b2c" />
        <ellipse cx="0" cy="-10" rx="9.5" ry="3.6" fill="#f3e6cf" />
        <ellipse cx="0" cy="10" rx="9.5" ry="3.6" fill="#6b1322" />
      </g>
    )
  }
  if (tipo === 'teclado') {
    return (
      <g transform="translate(17 -40)">
        <rect x="-12.5" y="-4.5" width="25" height="9" rx="1.8" fill="#2a1e15" />
        <rect x="-10.5" y="-3.4" width="21" height="5.6" rx="1" fill="#f3e6cf" />
        <path d="M-7 -3.4 L-7 2.2 M-2.5 -3.4 L-2.5 2.2 M2 -3.4 L2 2.2 M6.5 -3.4 L6.5 2.2" stroke="#2a1e15" strokeWidth="1.1" />
      </g>
    )
  }
  if (tipo === 'viento') {
    return (
      <g transform="translate(16 -56) rotate(-18)">
        <path d="M-1.2 -9 L1.2 -9 L3.4 16 L-3.4 16 Z" fill="#c1861a" />
        <path d="M-4.5 16 L4.5 16 L7 23 L-7 23 Z" fill="#7a530b" />
      </g>
    )
  }
  if (tipo === 'baile') {
    return (
      <g transform="translate(16 -48)">
        <path d="M0 0 Q11 -7 15 -20" stroke="#c1861a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="16" cy="-22" r="3.8" fill="#a92438" />
      </g>
    )
  }
  // cuerda (guitarra, vihuela, guitarrón, violín, bajo)
  return (
    <g transform="translate(16 -46) rotate(-20)">
      <ellipse cx="0" cy="7" rx="7.5" ry="9" fill="#8a5522" />
      <ellipse cx="0" cy="-4" rx="5.8" ry="7" fill="#8a5522" />
      <circle cx="0" cy="1.5" r="2.8" fill="#2a1e15" />
      <rect x="-1.6" y="-23" width="3.2" height="18" rx="1.2" fill="#3a2b20" />
      <rect x="-3.4" y="-26.5" width="6.8" height="4.5" rx="1.6" fill="#3a2b20" />
    </g>
  )
}

function Figura({ x, y, escala, color, rol, retraso, activo, onHover }) {
  const tipo = familia(rol)
  return (
    <g
      transform={`translate(${x} ${y}) scale(${escala})`}
      onMouseEnter={() => onHover?.(rol)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* La animación va en un grupo interno: si se aplicara al grupo de
          posición, el transform de CSS pisaría el atributo transform. */}
      <g
        className="animate-pop cursor-pointer"
        style={{
          animationDelay: `${retraso}ms`,
          transformBox: 'fill-box',
          transformOrigin: 'center bottom',
        }}
      >
        {/* sombra en la tarima */}
        <ellipse cx="0" cy="1" rx="16" ry="4.2" fill="#4a2c0e" opacity="0.16" />

        {/* halo del músico activo */}
        {activo && <ellipse cx="0" cy="-42" rx="28" ry="36" fill="#eab13a" opacity="0.2" />}

        {/* piernas */}
        <path d="M-6.5 -22 L-9 0 M6.5 -22 L9 0" stroke={color} strokeWidth="7" strokeLinecap="round" />

        {/* torso */}
        <path d="M-13 -20 Q-16 -58 0 -60 Q16 -58 13 -20 Q0 -15 -13 -20 Z" fill={color} />

        {/* brazos */}
        <path d="M-11 -50 Q-18 -40 -19 -30" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M11 -50 Q16 -46 16 -40" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />

        {/* cabeza */}
        <circle cx="0" cy="-66" r="8" fill="#f0d2b0" />

        {/* sombrero */}
        <ellipse cx="0" cy="-72" rx="16" ry="4" fill="#2a1e15" />
        <path d="M-9.5 -72 Q0 -86 9.5 -72 Z" fill="#2a1e15" />
        <path d="M-9.5 -72 Q0 -77.5 9.5 -72" fill="none" stroke="#c1861a" strokeWidth="1.5" />

        <Instrumento tipo={tipo} />
      </g>
    </g>
  )
}

export default function EscenarioSVG({ roles = [], hover = null, onHover }) {
  const n = roles.length
  const centro = (n - 1) / 2
  const ancho = Math.min(316, 40 * (n - 1) + 44)
  const escalaBase = n > 9 ? 0.76 : n > 7 ? 0.84 : n > 5 ? 0.94 : 1.06

  const figuras = roles.map((rol, i) => {
    const t = centro === 0 ? 0 : (i - centro) / centro // -1 .. 1
    return {
      rol,
      i,
      // Los extremos van un poco más atrás en el escenario
      x: 200 + t * (ancho / 2),
      y: 212 - (1 - Math.cos(t * 0.8)) * 12,
      escala: escalaBase * (1 - Math.abs(t) * 0.08),
      color: COLORES[i % COLORES.length],
      // Se dibuja primero el centro para que quede delante
      orden: Math.abs(i - centro),
    }
  })

  return (
    <svg
      viewBox="0 0 400 240"
      className="h-full w-full"
      role="img"
      aria-label={`Escenario con ${n} músicos: ${roles.join(', ')}`}
    >
      <defs>
        <radialGradient id="focoEscenario" cx="50%" cy="30%" r="56%">
          <stop offset="0%" stopColor="#eab13a" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#eab13a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tarima" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8a67c" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7a530b" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* foco + tarima */}
      <ellipse cx="200" cy="104" rx="156" ry="96" fill="url(#focoEscenario)" />
      <ellipse cx="200" cy="210" rx="152" ry="24" fill="url(#tarima)" />
      <ellipse
        cx="200"
        cy="210"
        rx="152"
        ry="24"
        fill="none"
        stroke="#c1861a"
        strokeWidth="1.5"
        opacity="0.55"
      />

      {figuras
        .slice()
        .sort((a, b) => b.orden - a.orden)
        .map((f) => (
          <Figura
            key={`${f.rol}-${f.i}`}
            x={f.x}
            y={f.y}
            escala={f.escala}
            color={f.color}
            rol={f.rol}
            retraso={f.i * 40}
            activo={hover === f.rol}
            onHover={onHover}
          />
        ))}
    </svg>
  )
}