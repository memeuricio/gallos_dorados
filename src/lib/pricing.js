/* =========================================================================
   Motor de cotización: todo el precio se calcula acá y la UI solo lo muestra.
   ========================================================================= */

import { MUSICOS_POR_CANTIDAD, EXTRAS, SHOW_POR_ID, DESCUENTO_PAGO_TOTAL, PORCENTAJE_ABONO } from '../data/shows'
import { ZONAS, zonaDe } from '../data/comunas'
import { redondearMil } from './format'

/**
 * @param {object} p
 * @param {number} p.cantidadMusicos  3..12
 * @param {string} p.tipoShowId       id de TIPOS_SHOW
 * @param {string} p.comuna           nombre de comuna
 * @param {object} p.bloque           bloque elegido en la agenda (puede ser null)
 * @param {string[]} p.extras         ids de extras seleccionados
 * @param {boolean} p.pagoTotal       true = paga el 100% al reservar (5% dcto)
 */
export function cotizar({
  cantidadMusicos = 6,
  tipoShowId = 'serenata',
  comuna = '',
  bloque = null,
  extras = [],
  pagoTotal = false,
} = {}) {
  const musicos = MUSICOS_POR_CANTIDAD[cantidadMusicos] || MUSICOS_POR_CANTIDAD[6]
  const show = SHOW_POR_ID[tipoShowId] || SHOW_POR_ID.serenata
  const zona = (comuna && zonaDe(comuna)) || null

  const lineas = []

  // 1) Base según cantidad de músicos y tipo de show
  const baseMusicos = musicos.precioBase
  lineas.push({
    id: 'musicos',
    label: `${musicos.etiqueta} · ${cantidadMusicos} músicos`,
    detalle: `Show ${show.duracion} min`,
    valor: baseMusicos,
  })

  const ajusteShow = redondearMil(baseMusicos * (show.factor - 1))
  if (ajusteShow !== 0) {
    lineas.push({
      id: 'show',
      label: show.nombre,
      detalle: ajusteShow > 0 ? 'Ajuste por formato de show' : 'Formato con descuento',
      valor: ajusteShow,
    })
  }

  const subtotal = baseMusicos + ajusteShow

  // 2) Recargo por horario (bloques de trasnoche / madrugada)
  let recargoHorario = 0
  if (bloque?.recargo) {
    recargoHorario = redondearMil(subtotal * bloque.recargo)
    lineas.push({
      id: 'horario',
      label: `Horario ${bloque.inicio} a ${bloque.fin}`,
      detalle: `Recargo ${Math.round(bloque.recargo * 100)}%`,
      valor: recargoHorario,
    })
  }

  // 3) Extras elegidos
  const extrasElegidos = EXTRAS.filter((e) => extras.includes(e.id))
  extrasElegidos.forEach((extra) => {
    lineas.push({ id: `extra-${extra.id}`, label: extra.nombre, detalle: 'Extra', valor: extra.precio })
  })

  const valorExtras = extrasElegidos.reduce((acc, e) => acc + e.precio, 0)

  // 4) Traslado según zona
  const valorZona = zona ? zona.recargo : 0
  if (zona) {
    lineas.push({
      id: 'traslado',
      label: `Traslado · ${zona.nombre}`,
      detalle: zona.recargo === 0 ? 'Sin costo' : zona.detalle,
      valor: zona.recargo,
    })
  }

  // 5) Total
  const bruto = subtotal + recargoHorario + valorExtras + valorZona
  const descuento = pagoTotal ? redondearMil(bruto * DESCUENTO_PAGO_TOTAL) : 0
  if (descuento > 0) {
    lineas.push({
      id: 'descuento',
      label: 'Descuento por pago total',
      detalle: `${Math.round(DESCUENTO_PAGO_TOTAL * 100)}% al pagar el 100% hoy`,
      valor: -descuento,
    })
  }

  const total = redondearMil(bruto - descuento)
  const abono = redondearMil(total * PORCENTAJE_ABONO)

  return {
    lineas,
    musicos,
    show,
    zona,
    extrasElegidos,
    subtotal,
    recargoHorario,
    valorExtras,
    valorZona,
    descuento,
    total,
    abono,
    saldo: total - abono,
    precioPorMusico: cantidadMusicos ? Math.round(total / cantidadMusicos) : 0,
  }
}

/** Etiqueta de zona para mostrar en la selección de comuna. */
export function infoZona(comuna) {
  return zonaDe(comuna) || ZONAS.A
}
