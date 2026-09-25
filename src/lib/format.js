const CLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

/** 156000 -> '$156.000' */
export function formatCLP(valor) {
  return CLP.format(Math.round(valor || 0))
}

/** 156000 -> '$156k' (para etiquetas compactas) */
export function formatCompacto(valor) {
  const n = Math.round(valor || 0)
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1).replace('.0', '')}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}k`
  return `$${n}`
}

export function plural(n, singular, plural) {
  return n === 1 ? singular : plural
}

/** Redondea a los mil más cercanos. */
export function redondearMil(n) {
  return Math.round(n / 1000) * 1000
}

/** 'jueves 24 de septiembre' -> 'Jueves 24 de septiembre' (solo la primera letra). */
export function capitalizar(texto = '') {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
