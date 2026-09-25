import { formatCLP } from '../../lib/format'
import { formatFechaLarga, formatHora12 } from '../../lib/date'
import { useBooking } from '../../context/BookingContext'
import Icon from '../icons'
import { Badge, Equalizer } from '../ui'

function Fila({ ok, label, valor }) {
  return (
    <li className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2">
        <span
          className={`grid size-4 place-items-center rounded-full border ${
            ok ? 'border-agave-400 bg-agave-500/20 text-agave-600' : 'bg-crema-100 text-tinta-400'
          }`}
        >
          {ok ? <Icon name="check" className="size-2.5" /> : <span className="size-1 rounded-full bg-current" />}
        </span>
        <span className={ok ? 'text-tinta-500' : 'text-tinta-400'}>{label}</span>
      </span>
      <span className={`truncate text-right ${ok ? 'text-tinta-800' : 'text-crema-400'}`}>{valor || '—'}</span>
    </li>
  )
}

export default function Resumen() {
  const {
    fechaISO,
    bloque,
    cantidadMusicos,
    comuna,
    cotizacion,
    extras,
    paso,
    pagoTotal,
    reservas,
    confirmada,
    reiniciar,
  } = useBooking()

  const listo = Boolean(fechaISO && bloque && comuna)

  const irAlAsistente = () => {
    document.getElementById('asistente')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-crema-200 bg-gradient-to-r from-gold-400/12 to-transparent px-5 py-4">
            <h3 className="flex items-center gap-2 text-base">
              <Equalizer barras={4} />
              Tu cotización
            </h3>
            <Badge tono={listo ? 'verde' : 'neutro'}>{listo ? 'Lista' : 'Incompleta'}</Badge>
          </div>

          <div className="space-y-5 p-5">
            <ul className="space-y-2.5">
              <Fila
                ok={Boolean(fechaISO)}
                label="Día"
                valor={fechaISO ? formatFechaLarga(fechaISO) : ''}
              />
              <Fila
                ok={Boolean(bloque)}
                label="Bloque"
                valor={bloque ? `${bloque.nombre} · ${formatHora12(bloque.inicio)}` : ''}
              />
              <Fila ok label="Músicos" valor={`${cantidadMusicos} músicos`} />
              <Fila ok={Boolean(comuna)} label="Comuna" valor={comuna} />
              <Fila ok label="Show" valor={cotizacion.show.nombre} />
            </ul>

            <div className="rounded-2xl border border-crema-200 bg-crema-50/50 p-4">
              <ul className="space-y-2 text-xs">
                {cotizacion.lineas.map((l) => (
                  <li key={l.id} className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-tinta-700">{l.label}</span>
                      <span className="block text-[10px] text-tinta-400">{l.detalle}</span>
                    </span>
                    <span className={l.valor < 0 ? 'text-agave-600' : 'text-tinta-800'}>
                      {l.valor < 0 ? '-' : ''}
                      {formatCLP(Math.abs(l.valor))}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-crema-200 pt-3">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-tinta-500">Total</span>
                  <span className="font-display text-2xl text-gold-700">
                    {formatCLP(cotizacion.total)}
                  </span>
                </div>
                <p className="mt-1 text-right text-[11px] text-tinta-400">
                  {pagoTotal
                    ? 'Pago total (5% de descuento aplicado)'
                    : `Abono 30%: ${formatCLP(cotizacion.abono)} · saldo ${formatCLP(cotizacion.saldo)}`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] text-tinta-400">
              <span className="chip">{cotizacion.show.duracion} min en vivo</span>
              {extras.length > 0 && <span className="chip">{extras.length} extras</span>}
              {cotizacion.zona && (
                <span className="chip">
                  <Icon name="pin" className="size-3" />
                  {cotizacion.zona.nombre}
                </span>
              )}
              <span className="chip">
                <Icon name="users" className="size-3" />
                {formatCLP(cotizacion.precioPorMusico)} p/músico
              </span>
            </div>

            {confirmada ? (
              <div className="space-y-2">
                <p className="flex items-center gap-2 rounded-2xl border border-agave-400/35 bg-agave-500/10 p-3 text-xs text-agave-600">
                  <Icon name="check" className="size-4 shrink-0" />
                  Reserva {confirmada.codigo} registrada
                </p>
                <button type="button" onClick={irAlAsistente} className="btn-ghost w-full">
                  <Icon name="calendar" className="size-4" />
                  Ver comprobante
                </button>
                <button type="button" onClick={reiniciar} className="btn-dark w-full">
                  <Icon name="plus" className="size-4" />
                  Reservar otro bloque
                </button>
              </div>
            ) : bloque ? (
              <button type="button" onClick={irAlAsistente} className="btn-gold w-full">
                {paso === 4 ? 'Revisar y confirmar' : `Continuar · paso ${paso} de 4`}
                <Icon name="arrowRight" className="size-4" />
              </button>
            ) : (
              <p className="rounded-2xl border border-dashed border-gold-500/30 bg-gold-400/[0.06] p-3 text-center text-xs text-gold-700">
                Elige un bloque de horario para continuar con tu reserva.
              </p>
            )}

            {reservas.length > 0 && (
              <p className="text-center text-[11px] text-tinta-400">
                Tienes {reservas.length} reserva{reservas.length > 1 ? 's' : ''} guardada
                {reservas.length > 1 ? 's' : ''} en este dispositivo.
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Barra fija móvil */}
      {bloque && (
        <div className="fixed inset-x-0 bottom-0 z-[75] border-t border-crema-200 bg-crema-50/95 px-4 py-3 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] text-tinta-400">
                {cantidadMusicos} músicos · {cotizacion.show.nombre}
              </p>
              <p className="font-display text-lg text-gold-700">{formatCLP(cotizacion.total)}</p>
            </div>
            <button type="button" onClick={irAlAsistente} className="btn-gold px-5 py-2.5 text-xs">
              {confirmada ? 'Ver comprobante' : paso === 4 ? 'Confirmar' : `Continuar (${paso}/4)`}
              <Icon name="arrowRight" className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
