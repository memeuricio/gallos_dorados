import { useMemo, useState } from 'react'
import {
  DIAS_DE_AGENDA,
  bloquesDelDia,
  diaCerrado,
  resumenDia,
} from '../../data/availability'
import {
  DIAS_SEMANA_MIN,
  addDays,
  formatFechaLarga,
  formatHora12,
  fromISO,
  hoyISO,
  matrizMes,
  nombreMes,
  toISO,
} from '../../lib/date'
import { useBooking } from '../../context/BookingContext'
import { capitalizar } from '../../lib/format'
import Icon from '../icons'
import { Badge, Equalizer } from '../ui'

const COLORES_NIVEL = {
  libre: 'text-agave-600',
  pocos: 'text-gold-700',
  lleno: 'text-crimson-600',
  cerrado: 'text-tinta-400',
}

export default function Calendario() {
  const { fechaISO, elegirFecha, esReservaPropia } = useBooking()
  const hoy = hoyISO()
  const limite = addDays(hoy, DIAS_DE_AGENDA)
  const [vista, setVista] = useState(() => {
    const d = fromISO(hoy)
    return { anio: d.getFullYear(), mes: d.getMonth() }
  })

  const semanas = useMemo(() => matrizMes(vista.anio, vista.mes), [vista])

  const irMes = (delta) => {
    setVista((v) => {
      const d = new Date(v.anio, v.mes + delta, 1)
      return { anio: d.getFullYear(), mes: d.getMonth() }
    })
  }

  const primerMes = { anio: fromISO(hoy).getFullYear(), mes: fromISO(hoy).getMonth() }
  const ultimoMes = { anio: fromISO(limite).getFullYear(), mes: fromISO(limite).getMonth() }
  const puedeAtras = vista.anio > primerMes.anio || (vista.anio === primerMes.anio && vista.mes > primerMes.mes)
  const puedeAdelante =
    vista.anio < ultimoMes.anio || (vista.anio === ultimoMes.anio && vista.mes < ultimoMes.mes)

  const diasConCupo = useMemo(() => {
    const todas = semanas.flat().filter((f) => {
      const iso = toISO(f)
      return iso >= hoy && iso <= limite
    })
    return todas.filter((f) => resumenDia(toISO(f)).nivel !== 'lleno' && !diaCerrado(toISO(f))).length
  }, [semanas, hoy, limite])

  return (
    <div className="card p-5 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-gold-700 uppercase">Elige el día</p>
          <h3 className="mt-1 flex items-center gap-3 text-xl">
            {capitalizar(`${nombreMes(vista.mes)} ${vista.anio}`)}
            <Equalizer barras={4} className="opacity-70" />
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVista(primerMes)}
            className="btn-dark px-4 py-2 text-xs"
            aria-label="Ir al mes actual"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => irMes(-1)}
            disabled={!puedeAtras}
            className="grid size-9 cursor-pointer place-items-center rounded-xl border border-crema-300 text-tinta-700 transition hover:border-gold-500/50 hover:text-gold-700 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Mes anterior"
          >
            <Icon name="chevronLeft" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => irMes(1)}
            disabled={!puedeAdelante}
            className="grid size-9 cursor-pointer place-items-center rounded-xl border border-crema-300 text-tinta-700 transition hover:border-gold-500/50 hover:text-gold-700 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Mes siguiente"
          >
            <Icon name="chevronRight" className="size-4" />
          </button>
        </div>
      </header>

      <div className="mt-5 grid grid-cols-7 gap-1.5 text-center">
        {DIAS_SEMANA_MIN.map((d) => (
          <span key={d} className="pb-1 text-[11px] font-semibold tracking-wide text-tinta-400 uppercase">
            {d}
          </span>
        ))}

        {semanas.flat().map((fecha) => {
          const iso = toISO(fecha)
          const delMes = fecha.getMonth() === vista.mes
          const dentro = iso >= hoy && iso <= limite
          const cerrado = dentro && diaCerrado(iso)
          const resumen = dentro && !cerrado ? resumenDia(iso) : null
          const bloques = dentro && !cerrado ? bloquesDelDia(iso) : []
          const propia = bloques.some((b) => esReservaPropia(iso, b.id))
          const seleccionado = iso === fechaISO
          const esHoy = iso === hoy

          return (
            <button
              key={iso}
              type="button"
              disabled={!dentro}
              onClick={() => elegirFecha(iso)}
              aria-pressed={seleccionado}
              aria-label={`${formatFechaLarga(iso)}${
                cerrado
                  ? ', día de descanso'
                  : resumen
                    ? `, ${resumen.libres} bloques disponibles`
                    : ', fuera de agenda'
              }`}
              className={`group relative aspect-square rounded-2xl border p-1.5 text-left transition ${
                !delMes ? 'opacity-30' : ''
              } ${
                seleccionado
                  ? 'border-gold-500 bg-gold-400/20 shadow-[0_0_0_1px_rgb(193_134_26/0.55)]'
                  : !dentro
                    ? 'cursor-not-allowed bg-crema-50 opacity-45'
                    : cerrado
                      ? 'cursor-not-allowed bg-crema-50 opacity-65'
                      : resumen.nivel === 'lleno'
                        ? 'cursor-not-allowed bg-crema-50 opacity-70'
                        : 'cursor-pointer bg-crema-100 hover:border-gold-500/60 hover:bg-crema-100'
              }`}
            >
              <span className="flex items-start justify-between">
                <span
                  className={`font-display text-sm ${
                    seleccionado ? 'text-gold-700' : esHoy ? 'text-agave-600' : 'text-tinta-700'
                  }`}
                >
                  {fecha.getDate()}
                </span>
                {esHoy && <span className="mt-1 size-1.5 rounded-full bg-agave-400" />}
              </span>

              {dentro && !cerrado && (
                <>
                  <span className="mt-1 flex flex-wrap gap-[3px]">
                    {bloques.map((b) => (
                      <span
                        key={b.id}
                        className={`h-[3px] w-1.5 rounded-full sm:h-1 sm:w-2.5 ${
                          b.estado === 'ocupado'
                            ? 'bg-crema-400'
                            : b.estado === 'ultimos'
                              ? 'bg-gold-400'
                              : 'bg-agave-400'
                        }`}
                      />
                    ))}
                  </span>
                  <span
                    className={`absolute right-1.5 bottom-1.5 hidden text-[9px] sm:block ${COLORES_NIVEL[resumen.nivel]}`}
                  >
                    {resumen.nivel === 'lleno' ? 'sin cupo' : `${resumen.libres} libres`}
                  </span>
                  {propia && (
                    <span className="absolute bottom-1 left-1.5 size-1.5 rounded-full bg-gold-300 ring-2 ring-gold-500/40" />
                  )}
                </>
              )}
              {cerrado && (
                <span className="absolute right-1.5 bottom-1 hidden text-[9px] text-tinta-400 sm:block">
                  descansa
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Leyenda */}
      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-crema-200 pt-4 text-xs text-tinta-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full bg-agave-400" /> Disponible
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full bg-gold-400" /> Últimos cupos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full bg-crema-400" /> Ocupado
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-gold-300" /> Tu reserva
          </span>
        </div>
        <Badge tono={diasConCupo > 0 ? 'verde' : 'rojo'}>
          {diasConCupo} días con cupos este mes
        </Badge>
      </footer>

      {fechaISO && (
        <>
          <p className="mt-3 flex items-center gap-2 text-xs text-tinta-500">
            <Icon name="pin" className="size-3.5 text-gold-600" />
            Día elegido:{' '}
            <strong className="font-semibold text-tinta-800">{formatFechaLarga(fechaISO)}</strong>
          </p>
          <p className="mt-1 text-[11px] text-tinta-400">
            Los bloques de madrugada ({formatHora12('00:00')}) aplican a viernes, sábado y vísperas
            de feriado.
          </p>
        </>
      )}
    </div>
  )
}
