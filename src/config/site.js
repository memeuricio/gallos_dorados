/* =========================================================================
   Configuración general del sitio.
   Datos extraídos del sitio original (losgallosdorados.wixsite.com/home).
   Cambia aquí el nombre, teléfonos y redes: se usan en toda la web.
   ========================================================================= */

export const SITE = {
  nombre: 'Gallos Dorados',
  nombreCorto: 'Gallos Dorados',
  eslogan: '¡Que no paren de sonar!',
  genero: 'Nueva Ranchera Chilena',
  desde: 2014,
  anioFundacion: 2014,
  comunaBase: 'Maipú, Región Metropolitana',
  telefono: '+56 9 3078 4760',
  telefono2: '+56 9 7377 3136',
  whatsapp: '56930784760', // formato internacional, sin + ni espacios
  email: 'losgallosdorados@gmail.com',
  instagram: 'https://www.instagram.com/gallosdorados/',
  facebook: 'https://www.facebook.com/GallosDoradosChile/',
  youtube: 'http://www.youtube.com/gallosdorados',
  // Assets reales descargados del sitio original (ver AGENTS.md)
  logo: '/img/logo-gallos-dorados.webp',
  fotoGrupo: '/img/banner-gallos-dorados.webp',
  firmaSello: '/img/firma-mastermedia.webp',
  horarioAtencion: 'Lun a Dom · 09:00 a 02:00',
}

/** Arma el link de WhatsApp con un mensaje pre-escrito. */
export function waLink(mensaje = 'Hola! Quiero cotizar un show en vivo 🎺') {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensaje)}`
}

export const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'grupo', label: 'El grupo' },
  { id: 'shows', label: 'Shows' },
  { id: 'musicos', label: 'Formación' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'galeria', label: 'Galería' },
  { id: 'presentaciones', label: 'Presentaciones' },
  { id: 'faq', label: 'Preguntas' },
]
