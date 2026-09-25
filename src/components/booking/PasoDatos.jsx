import { DESCUENTO_PAGO_TOTAL } from '../../data/shows'
import { formatCLP, redondearMil } from '../../lib/format'
import { useBooking } from '../../context/BookingContext'
import { useToast } from '../../context/ToastContext'
import Icon from '../icons'
import { Badge } from '../ui'

export default function PasoDatos({ onConfirmar }) {
  const {
    cliente,
    actualizarCliente,
    pagoTotal,
    setear,
    cotizacion,
    puedeConfirmar,
    fechaISO,
    bloque,
    cantidadMusicos,
    comuna,
  } = useBooking()
  const { toast } = useToast()

  const aviso = () => {
    const faltantes = []
    if (!fechaISO || !bloque) faltantes.push('día y bloque')
    if (!comuna) faltantes.push('comuna')
    if (cliente.nombre.trim().length < 3) faltantes.push('nombre')
    if (!/[\d+]{8,}/.test(cliente.telefono)) faltantes.push('teléfono válido')
    return faltantes
  }

  const ahorroPagoTotal = pagoTotal
    ? cotizacion.descuento
    : redondearMil(cotizacion.total * DESCUENTO_PAGO_TOTAL)

  const enviar = (e) => {
    e.preventDefault()
    const faltantes = aviso()
    if (faltantes.length) {
      toast(`Falta completar: ${faltantes.join(', ')}`, 'error')
      return
    }
    onConfirmar()
  }

  return (
    <form onSubmit={enviar} className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="space-y-4">
        <div>
          <h4 className="text-lg text-tinta-900">Tus datos de contacto</h4>
          <p className="text-sm text-tinta-400">
            Te confirmamos la reserva por WhatsApp y dejamos todo por escrito.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="nombre">
              Nombre y apellido *
            </label>
            <input
              id="nombre"
              className="field"
              value={cliente.nombre}
              onChange={(e) => actualizarCliente({ nombre: e.target.value })}
              placeholder="Ej: Camila Rojas"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="label" htmlFor="telefono">
              Teléfono / WhatsApp *
            </label>
            <input
              id="telefono"
              className="field"
              value={cliente.telefono}
              onChange={(e) => actualizarCliente({ telefono: e.target.value })}
              placeholder="+56 9 1234 5678"
              inputMode="tel"
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email (opcional)
            </label>
            <input
              id="email"
              type="email"
              className="field"
              value={cliente.email}
              onChange={(e) => actualizarCliente({ email: e.target.value })}
              placeholder="tucorreo@email.cl"
              autoComplete="email"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="direccion">
              Dirección del show
            </label>
            <input
              id="direccion"
              className="field"
              value={cliente.direccion}
              onChange={(e) => actualizarCliente({ direccion: e.target.value })}
              placeholder="Calle, número, depto y referencias"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="solicitudes">
              Canciones o pedidos especiales
            </label>
            <textarea
              id="solicitudes"
              rows={3}
              className="field resize-none"
              value={cliente.solicitudes}
              onChange={(e) => actualizarCliente({ solicitudes: e.target.value })}
              placeholder="Ej: El Padrecito para entrar, Amor Eterno dedicada a la mamá, sorpresa a las 20:00..."
            />
          </div>
        </div>

        {/* Pago */}
        <div>
          <p className="label">Forma de pago</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setear('pagoTotal', false)}
              aria-pressed={!pagoTotal}
              className={`cursor-pointer rounded-2xl border p-4 text-left transition ${
                !pagoTotal ? 'border-gold-500 bg-gold-400/20' : 'bg-crema-100 hover:border-gold-500/40'
              }`}
            >
              <p className="text-sm font-semibold text-tinta-900">Abono 30% ahora</p>
              <p className="mt-1 text-xs text-tinta-400">
                Bloqueas la fecha con {formatCLP(cotizacion.abono)} y pagas el saldo el día del show.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setear('pagoTotal', true)}
              aria-pressed={pagoTotal}
              className={`cursor-pointer rounded-2xl border p-4 text-left transition ${
                pagoTotal ? 'border-agave-400 bg-agave-500/10' : 'bg-crema-100 hover:border-agave-400/40'
              }`}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-tinta-900">
                Pago total con {Math.round(DESCUENTO_PAGO_TOTAL * 100)}% de descuento
                <Badge tono="verde">Ahorras {formatCLP(ahorroPagoTotal)}</Badge>
              </p>
              <p className="mt-1 text-xs text-tinta-400">
                Pagas {formatCLP(cotizacion.total - cotizacion.descuento)} ahora y te olvidas del saldo.
              </p>
            </button>
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-crema-200 p-4 text-xs text-tinta-500">
          <input type="checkbox" className="mt-0.5 size-4 accent-[color:var(--color-gold-400)]" required />
          Acepto que el bloque queda sujeto a confirmación del grupo y autorizo el contacto por
          WhatsApp para coordinar los detalles.
        </label>
      </div>

      {/* Resumen final + confirmar */}
      <div className="space-y-4">
        <div className="rounded-3xl border border-gold-500/25 bg-gradient-to-br from-gold-400/10 to-transparent p-5">
          <p className="text-[11px] tracking-[0.18em] text-gold-700 uppercase">Resumen del show</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-tinta-400">Músicos</span>
              <span className="text-tinta-800">{cantidadMusicos}</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-tinta-400">Show</span>
              <span className="text-right text-tinta-800">{cotizacion.show.nombre}</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-tinta-400">Comuna</span>
              <span className="text-tinta-800">{comuna || '—'}</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-tinta-400">Extras</span>
              <span className="text-right text-tinta-800">
                {cotizacion.extrasElegidos.length
                  ? cotizacion.extrasElegidos.map((e) => e.nombre).join(', ')
                  : 'Sin extras'}
              </span>
            </li>
          </ul>
          <div className="mt-4 flex items-end justify-between border-t border-crema-200 pt-4">
            <span className="text-sm text-tinta-500">Total</span>
            <span className="font-display text-2xl text-gold-700">{formatCLP(cotizacion.total)}</span>
          </div>
          <p className="mt-1 text-right text-xs text-tinta-400">
            {pagoTotal
              ? `Pagas ahora ${formatCLP(cotizacion.total)}`
              : `Abonas ahora ${formatCLP(cotizacion.abono)} · saldo ${formatCLP(cotizacion.saldo)}`}
          </p>
        </div>

        <button type="submit" className="btn-gold w-full py-4 text-base" disabled={!puedeConfirmar && false}>
          <Icon name="check" className="size-5" />
          Confirmar reserva
        </button>
        <p className="flex items-start gap-2 text-[11px] text-tinta-400">
          <Icon name="shield" className="mt-0.5 size-3.5 shrink-0" />
          Demo sin cobro real: al confirmar se genera un código de reserva, se bloquea el horario en
          este navegador y puedes descargar el evento a tu calendario.
        </p>
      </div>
    </form>
  )
}
