/* =========================================================================
   Zonas de desplazamiento y comunas.
   El recargo de la zona se suma a la cotización (ver src/lib/pricing.js).
   ========================================================================= */

export const ZONAS = {
  A: {
    id: 'A',
    nombre: 'Zona A',
    detalle: 'Centro y comunas cercanas (hasta 12 km)',
    recargo: 0,
  },
  B: {
    id: 'B',
    nombre: 'Zona B',
    detalle: 'Sector oriente y norte (12 a 25 km)',
    recargo: 12000,
  },
  C: {
    id: 'C',
    nombre: 'Zona C',
    detalle: 'Sector sur y poniente (12 a 30 km)',
    recargo: 22000,
  },
  D: {
    id: 'D',
    nombre: 'Zona D',
    detalle: 'Periferia y valles (30 a 60 km)',
    recargo: 38000,
  },
  G: {
    id: 'G',
    nombre: 'Gira regional',
    detalle: 'Otras regiones · sujeto a confirmación de agenda',
    recargo: 85000,
  },
}

/** comuna: nombre · region: región · zona: clave de ZONAS */
export const COMUNAS = [
  // ---------- Región Metropolitana ----------
  { comuna: 'Santiago', region: 'Región Metropolitana', zona: 'A' },
  { comuna: 'Providencia', region: 'Región Metropolitana', zona: 'A' },
  { comuna: 'Recoleta', region: 'Región Metropolitana', zona: 'A' },
  { comuna: 'Independencia', region: 'Región Metropolitana', zona: 'A' },
  { comuna: 'Estación Central', region: 'Región Metropolitana', zona: 'A' },
  { comuna: 'Quinta Normal', region: 'Región Metropolitana', zona: 'A' },
  { comuna: 'San Miguel', region: 'Región Metropolitana', zona: 'A' },
  { comuna: 'Ñuñoa', region: 'Región Metropolitana', zona: 'A' },
  { comuna: 'Macul', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'San Joaquín', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'La Reina', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'Las Condes', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'Vitacura', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'Lo Barnechea', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'Huechuraba', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'Conchalí', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'Quilicura', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'Peñalolén', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'La Florida', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'La Cisterna', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'Cerrillos', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'Lo Prado', region: 'Región Metropolitana', zona: 'B' },
  { comuna: 'Cerro Navia', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'Renca', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'Pudahuel', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'Maipú', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'Lo Espejo', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'Pedro Aguirre Cerda', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'San Ramón', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'El Bosque', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'La Pintana', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'San Bernardo', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'Puente Alto', region: 'Región Metropolitana', zona: 'C' },
  { comuna: 'Peñaflor', region: 'Región Metropolitana', zona: 'D' },
  { comuna: 'Talagante', region: 'Región Metropolitana', zona: 'D' },
  { comuna: 'Pirque', region: 'Región Metropolitana', zona: 'D' },
  { comuna: 'San José de Maipo', region: 'Región Metropolitana', zona: 'D' },
  { comuna: 'Buin', region: 'Región Metropolitana', zona: 'D' },
  { comuna: 'Colina', region: 'Región Metropolitana', zona: 'D' },
  { comuna: 'Lampa', region: 'Región Metropolitana', zona: 'D' },
  { comuna: 'Melipilla', region: 'Región Metropolitana', zona: 'D' },
  // ---------- Otras regiones (gira) ----------
  { comuna: 'Valparaíso', region: 'Región de Valparaíso', zona: 'G' },
  { comuna: 'Viña del Mar', region: 'Región de Valparaíso', zona: 'G' },
  { comuna: 'Quilpué', region: 'Región de Valparaíso', zona: 'G' },
  { comuna: 'Concón', region: 'Región de Valparaíso', zona: 'G' },
  { comuna: 'Rancagua', region: "Región de O'Higgins", zona: 'G' },
  { comuna: 'Talca', region: 'Región del Maule', zona: 'G' },
  { comuna: 'Chillán', region: 'Región de Ñuble', zona: 'G' },
  { comuna: 'Concepción', region: 'Región del Biobío', zona: 'G' },
  { comuna: 'Talcahuano', region: 'Región del Biobío', zona: 'G' },
  { comuna: 'Temuco', region: 'Región de La Araucanía', zona: 'G' },
  { comuna: 'Valdivia', region: 'Región de Los Ríos', zona: 'G' },
  { comuna: 'Puerto Varas', region: 'Región de Los Lagos', zona: 'G' },
  { comuna: 'La Serena', region: 'Región de Coquimbo', zona: 'G' },
]

export const REGIONES = [...new Set(COMUNAS.map((c) => c.region))]

export function buscarComuna(nombre) {
  return COMUNAS.find((c) => c.comuna === nombre) || null
}

export function zonaDe(nombreComuna) {
  const c = buscarComuna(nombreComuna)
  return c ? ZONAS[c.zona] : null
}
