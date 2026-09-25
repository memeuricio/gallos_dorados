/* =========================================================================
   ICONOS PROVISORIOS (placeholder).
   Son SVG dibujados a mano con el trazo actual (currentColor), pensados para
   reemplazarse por el set definitivo cuando lleguen los archivos.

   Para cambiar un icono: reemplaza el contenido de su <path> acá abajo.
   ========================================================================= */

const TRAZO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const CAMINOS = {
  guitar: (
    <>
      <path {...TRAZO} d="M14.5 3.5 21 10" />
      <path {...TRAZO} d="M12 6l3 3" />
      <path {...TRAZO} d="M11.2 8.8c-1.6-.4-3.3.2-4.4 1.6-1.4 1.8-1 3.6-2 4.8-1 1.3-2.6 2-2.2 4 .5 2.5 3.2 5.2 5.7 5.7 2 .4 2.7-1.2 4-2.2 1.2-1 3-.6 4.8-2 1.4-1.1 2-2.8 1.6-4.4-.5-2-2.6-3.4-4.6-4.4-1.4-.7-2-2-2.9-3.1Z" />
      <circle {...TRAZO} cx="12.5" cy="17" r="2.4" />
    </>
  ),
  trumpet: (
    <>
      <path {...TRAZO} d="M3 10h11l4-3v10l-4-3H3z" />
      <path {...TRAZO} d="M16 10V7.5M16 14v2.5M18 12h3" />
      <circle {...TRAZO} cx="7" cy="10" r="1.4" />
    </>
  ),
  violin: (
    <>
      <path {...TRAZO} d="M4 20c1.6-.4 2.2-1.6 2.4-2.8.2-1.4 1.2-2 2.6-2.2 1.6-.2 2.4-1.2 3-2.6" />
      <path {...TRAZO} d="M11.6 8.6 15 5.2a2.4 2.4 0 0 1 3.4 3.4l-3.4 3.4" />
      <path {...TRAZO} d="M9 12.4c1.6-1.6 4.2-1.6 5.8 0 1.6 1.6 1.6 4.2 0 5.8-1.6 1.6-4.2 1.6-5.8 0" />
    </>
  ),
  mic: (
    <>
      <rect {...TRAZO} x="9" y="3" width="6" height="11" rx="3" />
      <path {...TRAZO} d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
    </>
  ),
  sunrise: (
    <>
      <path {...TRAZO} d="M12 3v4M5 8l2.5 2.5M19 8l-2.5 2.5M3 18h18M8 18a4 4 0 0 1 8 0" />
      <path {...TRAZO} d="M2 21h20" />
    </>
  ),
  cake: (
    <>
      <path {...TRAZO} d="M4 21h16v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z" />
      <path {...TRAZO} d="M4 17c1.5 1.5 3 1.5 4.5 0S11.5 15.5 13 17s3 1.5 4.5 0" />
      <path {...TRAZO} d="M8 13V9M12 13V9M16 13V9" />
      <path {...TRAZO} d="M8 6.5c0-1 1-1.5 1-2.5M12 6.5c0-1 1-1.5 1-2.5M16 6.5c0-1 1-1.5 1-2.5" />
    </>
  ),
  rings: (
    <>
      <circle {...TRAZO} cx="9" cy="14" r="5.5" />
      <circle {...TRAZO} cx="16" cy="14" r="5.5" />
      <path {...TRAZO} d="M12 4l1.6 2.6h-3.2z" />
    </>
  ),
  briefcase: (
    <>
      <rect {...TRAZO} x="3" y="7" width="18" height="13" rx="2.5" />
      <path {...TRAZO} d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18" />
    </>
  ),
  flag: (
    <>
      <path {...TRAZO} d="M6 21V4" />
      <path {...TRAZO} d="M6 5h11l-1.5 4L17 13H6z" />
    </>
  ),
  dove: (
    <>
      <path {...TRAZO} d="M4 15c4 0 6-2 8-5 1.4-2 3-3 5-3 2.4 0 3.6 1.8 3 4-.5 1.8-2 3-4 3-1 0-2 .4-2.6 1.2L12 18c-2.6 1-5.4.4-8-3Z" />
      <path {...TRAZO} d="M14.5 11.5h.01" />
    </>
  ),
  star: (
    <>
      <path {...TRAZO} d="M12 3.6l2.5 5.3 5.8.8-4.2 4 1 5.8-5.1-2.8-5.1 2.8 1-5.8-4.2-4 5.8-.8z" />
    </>
  ),
  pen: (
    <>
      <path {...TRAZO} d="M4 20l4-1 10-10a2.1 2.1 0 0 0-3-3L5 16z" />
      <path {...TRAZO} d="M14.5 6.5 17.5 9.5" />
    </>
  ),
  clock: (
    <>
      <circle {...TRAZO} cx="12" cy="12" r="8.5" />
      <path {...TRAZO} d="M12 7.5V12l3 2" />
    </>
  ),
  speaker: (
    <>
      <rect {...TRAZO} x="5" y="3" width="14" height="18" rx="2.5" />
      <circle {...TRAZO} cx="12" cy="8.5" r="2.5" />
      <circle {...TRAZO} cx="12" cy="16.5" r="3" />
    </>
  ),
  sparkles: (
    <>
      <path {...TRAZO} d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
      <path {...TRAZO} d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  users: (
    <>
      <circle {...TRAZO} cx="9" cy="8" r="3.2" />
      <path {...TRAZO} d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path {...TRAZO} d="M16 5.5a3.2 3.2 0 0 1 0 6.4M17.5 14.4c2 .8 3.5 2.9 3.5 5.6" />
    </>
  ),
  calendar: (
    <>
      <rect {...TRAZO} x="3.5" y="5" width="17" height="16" rx="3" />
      <path {...TRAZO} d="M3.5 10h17M8 3.5V6M16 3.5V6" />
      <path {...TRAZO} d="M8 14h3M8 17.5h6" />
    </>
  ),
  check: <path {...TRAZO} d="M5 13l4.5 4.5L19 7" />,
  alert: (
    <>
      <path {...TRAZO} d="M12 4.5 21 19.5H3z" />
      <path {...TRAZO} d="M12 10v4M12 16.8h.01" />
    </>
  ),
  bell: (
    <>
      <path {...TRAZO} d="M6.5 17V11a5.5 5.5 0 1 1 11 0v6" />
      <path {...TRAZO} d="M4.5 17h15M10 20h4" />
    </>
  ),
  arrowRight: <path {...TRAZO} d="M5 12h13m0 0-5-5m5 5-5 5" />,
  arrowLeft: <path {...TRAZO} d="M19 12H6m0 0 5-5m-5 5 5 5" />,
  chevronDown: <path {...TRAZO} d="M6 9.5l6 6 6-6" />,
  chevronLeft: <path {...TRAZO} d="M14.5 6l-6 6 6 6" />,
  chevronRight: <path {...TRAZO} d="M9.5 6l6 6-6 6" />,
  close: <path {...TRAZO} d="M6 6l12 12M18 6 6 18" />,
  menu: <path {...TRAZO} d="M4 7h16M4 12h16M4 17h16" />,
  search: (
    <>
      <circle {...TRAZO} cx="11" cy="11" r="6.5" />
      <path {...TRAZO} d="M16 16l4.5 4.5" />
    </>
  ),
  pin: (
    <>
      <path {...TRAZO} d="M12 21s6.5-6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21Z" />
      <circle {...TRAZO} cx="12" cy="10" r="2.4" />
    </>
  ),
  phone: (
    <path
      {...TRAZO}
      d="M6 3.5h3l1.6 4-2 1.4a11.5 11.5 0 0 0 5.5 5.5l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.7 2 2 0 0 1 6 3.5Z"
    />
  ),
  mail: (
    <>
      <rect {...TRAZO} x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path {...TRAZO} d="m4 7 8 6 8-6" />
    </>
  ),
  whatsapp: (
    <path
      {...TRAZO}
      d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.4-1.2A8.5 8.5 0 1 0 12 3.5Zm3 11.4c-.4 1-2 1.6-3.6.9a10 10 0 0 1-4-4c-.7-1.6-.1-3.2.9-3.6.4-.2.9 0 1.1.4l.6 1.2c.1.4 0 .7-.3 1l-.5.5a7 7 0 0 0 2.7 2.7l.5-.5c.3-.3.6-.4 1-.3l1.2.6c.4.2.6.7.4 1.1Z"
    />
  ),
  instagram: (
    <>
      <rect {...TRAZO} x="4" y="4" width="16" height="16" rx="5" />
      <circle {...TRAZO} cx="12" cy="12" r="3.6" />
      <path {...TRAZO} d="M17 7.2h.01" />
    </>
  ),
  facebook: <path {...TRAZO} d="M14.5 8.5H17V5h-2.5A3.5 3.5 0 0 0 11 8.5V11H8.5v3.5H11V21h3.5v-6.5H17l.5-3.5h-3v-2a1 1 0 0 1 1-1Z" />,
  youtube: (
    <>
      <rect {...TRAZO} x="3" y="6" width="18" height="12" rx="4" />
      <path {...TRAZO} d="m11 9.8 4 2.2-4 2.2z" />
    </>
  ),
  music: (
    <>
      <path {...TRAZO} d="M9 18V6l10-2v12" />
      <circle {...TRAZO} cx="6.5" cy="18" r="2.5" />
      <circle {...TRAZO} cx="16.5" cy="16" r="2.5" />
    </>
  ),
  shield: (
    <>
      <path {...TRAZO} d="M12 3.5 19 6v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" />
      <path {...TRAZO} d="m9 12 2 2 4-4" />
    </>
  ),
  heart: (
    <path {...TRAZO} d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20Z" />
  ),
  image: (
    <>
      <rect {...TRAZO} x="3.5" y="4.5" width="17" height="15" rx="3" />
      <path {...TRAZO} d="m5 17 4.5-5 3.5 3.5 2.5-2.5L20 17" />
      <circle {...TRAZO} cx="9" cy="9" r="1.4" />
    </>
  ),
  download: <path {...TRAZO} d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" />,
  plus: <path {...TRAZO} d="M12 5.5v13M5.5 12h13" />,
  trash: (
    <>
      <path {...TRAZO} d="M5 7h14M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path {...TRAZO} d="M7 7l1 12a2 2 0 0 0 2 1.8h4a2 2 0 0 0 2-1.8L17 7" />
    </>
  ),
}

export const NOMBRES_ICONOS = Object.keys(CAMINOS)

export default function Icon({ name, className = 'size-5', ...rest }) {
  const contenido = CAMINOS[name] || CAMINOS.sparkles
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {contenido}
    </svg>
  )
}
