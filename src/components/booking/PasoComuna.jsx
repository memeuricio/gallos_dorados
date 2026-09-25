import { useMemo, useState } from 'react'
import { COMUNAS, ZONAS, zonaDe } from '../../data/comunas'
import { formatCLP } from '../../lib/format'
import { SITE, waLink } from '../../config/site'
import { useBooking } from '../../context/BookingContext'
import { useToast } from '../../context/ToastContext'
import Icon from '../icons'
import { Badge } from '../ui'

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export default function PasoComuna() {
  const { comuna, setear } = useBooking()
  const { toast } = useToast()
  const [busqueda, setBusqueda] = useState('')

  const grupos = useMemo(() => {
    const q = normalizar(busqueda.trim())
    const filtradas = COMUNAS.filter(
      (c) => !q || normalizar(c.comuna).includes(q) || normalizar(c.region).includes(q),
    )
    return filtradas.reduce((acc, c) => {
      acc[c.region] = acc[c.region] || []
      acc[c.region].push(c)
      return acc
    }, {})
  }, [busqueda])

  const total = Object.values(grupos).reduce((acc, lista) => acc + lista.length, 0)
  const zona = comuna ? zonaDe(comuna) : null

  const elegir = (c) => {
    setear('comuna', c.comuna)
    const z = ZONAS[c.zona]
    toast(
      `Lugar: ${c.comuna} · ${z.nombre}${z.recargo ? ` (+${formatCLP(z.recargo)} de traslado)` : ' (sin costo de traslado)'}`,
      'success',
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h4 className="text-lg text-tinta-900">¿Dónde será el show?</h4>
          <p className="text-sm text-tinta-400">
            Elige la comuna y calculamos el traslado según la zona. La dirección exacta la pedimos al
            final.
          </p>
        </div>
        {zona && (
          <Badge tono={zona.recargo === 0 ? 'verde' : 'gold'}>
            <Icon name="pin" className="size-3" />
            {zona.nombre} · {zona.recargo === 0 ? 'sin costo' : `+${formatCLP(zona.recargo)}`}
          </Badge>
        )}
      </div>

      <div className="relative mt-5">
        <Icon name="search" className="pointer-events-none absolute top-3.5 left-4 size-4 text-tinta-400" />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Busca tu comuna o región (ej: Ñuñoa, Maipú, Valparaíso)"
          className="field pl-11"
          aria-label="Buscar comuna"
        />
      </div>

      <div className="mt-4 max-h-72 space-y-5 overflow-y-auto pr-1 scrollbar-thin-gold">
        {total === 0 && (
          <div className="rounded-2xl border border-crema-300 p-5 text-center">
            <p className="text-sm text-tinta-700">No encontramos "{busqueda}" en la lista.</p>
            <p className="mt-1 text-xs text-tinta-400">
              Escríbenos y coordinamos el traslado a tu comuna.
            </p>
            <a
              href={waLink(`Hola! Necesito mariachi en ${busqueda}. ¿Pueden trasladarse?`)}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-4 px-4 py-2 text-xs"
            >
              <Icon name="whatsapp" className="size-4" />
              Consultar por {busqueda}
            </a>
          </div>
        )}

        {Object.entries(grupos).map(([region, lista]) => (
          <div key={region}>
            <p className="sticky top-0 z-10 bg-crema-100/85 py-1 text-[11px] tracking-[0.16em] text-gold-700/90 uppercase backdrop-blur">
              {region}
            </p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {lista.map((c) => {
                const z = ZONAS[c.zona]
                const activo = comuna === c.comuna
                return (
                  <li key={c.comuna}>
                    <button
                      type="button"
                      onClick={() => elegir(c)}
                      aria-pressed={activo}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition ${
                        activo
                          ? 'border-gold-500 bg-gold-400/20 text-gold-700'
                          : 'bg-crema-100 hover:border-gold-500/45 hover:bg-crema-100'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-tinta-800">{c.comuna}</span>
                        <span className="block text-[11px] text-tinta-400">
                          {z.detalle}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-[10px] tracking-wide text-tinta-400 uppercase">
                          {z.nombre}
                        </span>
                        <span className={`block text-xs font-semibold ${z.recargo ? 'text-gold-700' : 'text-agave-600'}`}>
                          {z.recargo ? `+${formatCLP(z.recargo)}` : 'sin costo'}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[11px] text-tinta-400">
        <Icon name="pin" className="size-3.5" />
        Base del grupo: {SITE.comunaBase}. Fuera de la Región Metropolitana se coordina como gira.
      </p>
    </div>
  )
}
