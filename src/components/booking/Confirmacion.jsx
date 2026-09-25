import { useMemo } from 'react'
import { formatCLP } from '../../lib/format'
import { formatFechaLarga, formatHora12, icsEvento } from '../../lib/date'
import { SITE, waLink } from '../../config/site'
import { useBooking } from '../../context/BookingContext'
import { useToast } from '../../context/ToastContext'
import { useReducedMotion } from '../../hooks/useUI'
import Icon from '../icons'
import { Badge } from '../ui'

const COLORES_CONFETI = ['#ffd977', '#e5a11f', '#12b981', '#e63950', '#f4f1ff']

function Confeti() {
  const piezas = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duracion: 2.6 + Math.random() * 1.6,
        color: COLORES_CONFETI[i % COLORES_CONFETI.length],
        size: 6 + Math.random() * 7,
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {piezas.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 rounded-[2px] animate-confetti"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duracion}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function Confirmacion({ onNuevaReserva }) {
  const { confirmada, reiniciar, eliminarReserva } = useBooking()
  const { toast } = useToast()
  const reducido = useReducedMotion()

  if (!confirmada) return null

  const { bloque, fechaISO, cliente, cantidadMusicos, tipoShow, comuna, extras, total, abono, pagoTotal, codigo } =
    confirmada

  const descargarICS = () => {
    const ics = icsEvento({
      titulo: `Mariachi Luna de Plata · ${tipoShow}`,
      descripcion: `Reserva ${codigo}\n${cantidadMusicos} músicos · ${tipoShow}\nTotal ${formatCLP(total)}\nContacto: ${SITE.telefono}`,
      fechaISO,
      horaInicio: bloque.inicio,
      horaFin: bloque.fin,
      lugar: `${comuna}${cliente.direccion ? ` · ${cliente.direccion}` : ''}`,
    })
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `reserva-mariachi-${codigo}.ics`
    a.click()
    URL.revokeObjectURL(url)
    toast('Evento descargado: ábrelo para agregarlo a tu calendario', 'success')
  }

  const mensaje = `Hola! Reservé el bloque ${bloque.nombre} (${formatHora12(bloque.inicio)} a ${formatHora12(bloque.fin)}) del ${formatFechaLarga(fechaISO)}.
Código: ${codigo}
Músicos: ${cantidadMusicos}
Show: ${tipoShow}
Comuna: ${comuna}
Extras: ${extras.length ? extras.join(', ') : 'sin extras'}
Total: ${formatCLP(total)}${pagoTotal ? ' (pago total)' : ` · abono ${formatCLP(abono)}`}
Nombre: ${cliente.nombre}`

  return (
    <div className="relative overflow-hidden rounded-3xl border border-agave-400/30 bg-gradient-to-br from-agave-500/10 to-transparent p-6 sm:p-8">
      {!reducido && <Confeti />}

      <div className="relative">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl border border-agave-400/40 bg-agave-500/15 text-agave-600">
            <Icon name="check" className="size-7" />
          </span>
          <div>
            <h3 className="text-2xl text-tinta-900">¡Bloque reservado!</h3>
            <p className="text-sm text-tinta-500">
              Código <strong className="text-gold-700">{codigo}</strong> · te escribimos a {cliente.telefono}
            </p>
          </div>
          <Badge tono="verde" className="ml-auto">
            Pendiente de confirmación del grupo
          </Badge>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: 'Fecha', v: formatFechaLarga(fechaISO) },
            { t: 'Bloque', v: `${bloque.nombre} · ${formatHora12(bloque.inicio)}` },
            { t: 'Músicos', v: `${cantidadMusicos} músicos` },
            { t: 'Show', v: tipoShow },
            { t: 'Comuna', v: comuna },
            { t: 'Extras', v: extras.length ? `${extras.length} seleccionados` : 'Sin extras' },
            { t: 'Total', v: formatCLP(total) },
            {
              t: pagoTotal ? 'Pagado' : 'Abono a pagar',
              v: pagoTotal ? formatCLP(total) : formatCLP(abono),
            },
          ].map((item) => (
            <div key={item.t} className="rounded-2xl border border-crema-200 bg-crema-50/50 p-3.5">
              <dt className="text-[10px] tracking-[0.16em] text-tinta-400 uppercase">{item.t}</dt>
              <dd className="mt-1 text-sm text-tinta-800">{item.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={descargarICS} className="btn-gold">
            <Icon name="download" className="size-4" />
            Agregar a mi calendario
          </button>
          <a
            href={waLink(mensaje)}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Icon name="whatsapp" className="size-4" />
            Enviar por WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              onNuevaReserva?.()
              reiniciar()
            }}
            className="btn-dark"
          >
            <Icon name="plus" className="size-4" />
            Reservar otro bloque
          </button>
          <button
            type="button"
            onClick={() => {
              eliminarReserva(codigo)
              toast('Reserva eliminada de este dispositivo', 'info')
              reiniciar()
            }}
            className="btn-dark"
          >
            <Icon name="trash" className="size-4" />
            Cancelar reserva
          </button>
        </div>

        <p className="mt-4 text-[11px] text-tinta-400">
          Guardamos la reserva en este navegador (demo sin base de datos). En producción, acá se
          envía el correo al grupo y se registra el pago del abono.
        </p>
      </div>
    </div>
  )
}
