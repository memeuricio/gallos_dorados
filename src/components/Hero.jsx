import { useEffect, useMemo, useState } from 'react'
import { SITE, waLink } from '../config/site'
import { proximoBloque } from '../data/availability'
import { formatFechaLarga, formatHora12 } from '../lib/date'
import { useBooking } from '../context/BookingContext'
import { useToast } from '../context/ToastContext'
import { useCountUp, useReducedMotion, useReveal } from '../hooks/useUI'
import { Vista3DHero } from './VistaHero3D'
import Icon from './icons'
import { Equalizer, Reveal } from './ui'
import Marquee from './Marquee'

const PALABRAS = ['matrimonio', 'cumpleaños', 'fonda', 'evento municipal', '18 de septiembre']

function Stat({ valor, etiqueta, sufijo = '', decimales = 0 }) {
  const { ref, visible } = useReveal()
  const numero = useCountUp(valor, { decimales, activo: visible })
  return (
    <div ref={ref} className="text-center sm:text-left">
      <p className="font-display text-2xl text-gold-700 sm:text-3xl">
        {decimales ? numero.toFixed(decimales) : Math.round(numero).toLocaleString('es-CL')}
        {sufijo}
      </p>
      <p className="mt-1 text-[11px] tracking-[0.14em] text-tinta-400 uppercase">{etiqueta}</p>
    </div>
  )
}

export default function Hero() {
  const [indice, setIndice] = useState(0)
  const reducido = useReducedMotion()
  const { irAAgenda } = useBooking()
  const { toast } = useToast()
  const proximo = useMemo(() => proximoBloque(), [])
  const anios = new Date().getFullYear() - SITE.anioFundacion

  useEffect(() => {
    if (reducido) return
    const id = window.setInterval(() => setIndice((i) => (i + 1) % PALABRAS.length), 4200)
    return () => window.clearInterval(id)
  }, [reducido])

  const usarProximo = () => {
    if (!proximo) return
    irAAgenda({ fechaISO: proximo.iso, bloque: proximo.bloque })
    toast(`Bloque reservado: ${formatFechaLarga(proximo.iso)}, ${proximo.bloque.nombre}`, 'success')
  }

  return (
    <section id="inicio" className="relative overflow-hidden pt-28 pb-10 lg:pt-32">
      {/* Halos de fondo */}
      <div className="pointer-events-none absolute -top-40 -left-32 size-[36rem] rounded-full bg-gold-500/12 blur-[120px]" />
      <div className="pointer-events-none absolute top-10 -right-24 size-[30rem] rounded-full bg-agave-500/10 blur-[130px]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <div className="relative z-10">
          <Reveal className="flex flex-wrap items-center gap-2">
            <span className="chip border-gold-500/30 bg-gold-400/10 text-gold-700">
              <Equalizer />
              Agenda abierta {new Date().getFullYear()}
            </span>
            <span className="chip">
              <Icon name="pin" className="size-3.5" />
              {SITE.comunaBase}
            </span>
            <span className="chip">
              <Icon name="music" className="size-3.5" />
              {SITE.genero}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
              {SITE.genero} en vivo para tu{' '}
              {/* Todas las frases ocupan la misma celda del grid: así el ancho
                  reservado es el de la palabra más larga y el titular no salta
                  de línea cada vez que cambia la frase. */}
              <span className="relative inline-grid max-w-full">
                {PALABRAS.map((palabra, i) => {
                  const activa = i === indice
                  return (
                    <span
                      key={palabra}
                      aria-hidden={!activa}
                      className={`col-start-1 row-start-1 transition-opacity duration-500 ${
                        activa ? 'opacity-100' : 'pointer-events-none opacity-0'
                      }`}
                    >
                      <span
                        key={activa ? 'activa' : 'inactiva'}
                        className={`text-gradient-gold relative inline-block italic ${
                          activa ? 'animate-pop' : ''
                        }`}
                      >
                        {palabra}
                        <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-gold-500/70 to-transparent" />
                      </span>
                    </span>
                  )
                })}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-base text-tinta-500 sm:text-lg">
              Somos <strong className="font-semibold text-tinta-800">{SITE.nombre}</strong>, banda de
              Maipú con {anios} años de rancheras, cumbia y huirista en escena. Elige el día y el
              bloque en nuestra agenda real, define cuántos músicos quieres, tu comuna y el tipo de
              show: te mostramos el valor al instante y bloqueamos la fecha con un abono.
            </p>
          </Reveal>

          <Reveal delay={200} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#agenda" className="btn-gold">
              <Icon name="calendar" className="size-4" />
              Ver agenda y disponibilidad
            </a>
            <a href="#grupo" className="btn-ghost">
              <Icon name="users" className="size-4" />
              Conocer al grupo
            </a>
            <a
              href={waLink('Hola! Quiero cotizar un show de Gallos Dorados 🎺')}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              <Icon name="whatsapp" className="size-4" />
              WhatsApp
            </a>
          </Reveal>

          <Reveal delay={260} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-tinta-500">
            <span className="inline-flex items-center gap-2">
              <Icon name="shield" className="size-4 text-agave-600" />
              Abono 30% y saldo el día del show
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="speaker" className="size-4 text-gold-600" />
              Sonido e iluminación propios
            </span>
          </Reveal>

          <Reveal delay={320} className="mt-10 grid grid-cols-2 gap-6 border-t border-crema-200 pt-8 sm:grid-cols-4">
            <Stat valor={anios} etiqueta="Años de trayectoria" />
            <Stat valor={2} etiqueta="Discos editados" />
            <Stat valor={5} etiqueta="Integrantes en escena" />
            <Stat valor={17000} etiqueta="Asistentes (Maipeluza)" />
          </Reveal>
        </div>

        {/* Escena 3D */}
        <div className="relative">
          <Vista3DHero className="h-[22rem] w-full sm:h-[28rem] lg:h-[34rem]" reducido={reducido} />

          {/* Tarjeta: próximo bloque libre */}
          {proximo && (
            <div className="absolute -bottom-6 left-0 hidden w-64 rounded-3xl border border-crema-200 bg-white p-4 shadow-[var(--shadow-lifted)] sm:block lg:-left-6">
              <p className="text-[10px] tracking-[0.18em] text-gold-700 uppercase">
                Próximo bloque libre
              </p>
              <p className="mt-1 font-display text-lg text-tinta-900">{formatFechaLarga(proximo.iso)}</p>
              <p className="text-sm text-tinta-500">
                {proximo.bloque.nombre} · {formatHora12(proximo.bloque.inicio)} a{' '}
                {formatHora12(proximo.bloque.fin)}
              </p>
              <button type="button" onClick={usarProximo} className="btn-gold mt-3 w-full px-4 py-2 text-xs">
                Tomar este bloque
                <Icon name="arrowRight" className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-24 lg:mt-28">
        <Marquee />
      </div>
    </section>
  )
}
