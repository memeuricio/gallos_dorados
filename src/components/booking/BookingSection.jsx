import { useEffect, useState } from 'react'
import { useBooking } from '../../context/BookingContext'
import { Reveal, SectionTitle } from '../ui'
import Calendario from './Calendario'
import BloquesDelDia from './BloquesDelDia'
import Asistente from './Asistente'
import Resumen from './Resumen'
import MisReservas from './MisReservas'

export default function BookingSection() {
  const { pulso } = useBooking()
  const [destacado, setDestacado] = useState(false)

  // Cuando otra sección pre-carga datos (show, músicos, próximo bloque) brillamos
  useEffect(() => {
    if (!pulso) return
    setDestacado(true)
    const id = window.setTimeout(() => setDestacado(false), 2200)
    return () => window.clearTimeout(id)
  }, [pulso])

  return (
    <section id="agenda" className="section pb-36 lg:pb-28">
      <SectionTitle
        kicker="Agenda y disponibilidad"
        titulo="Calendario en vivo: elige día, bloque y arma tu show"
        bajada="Esta es la agenda real del grupo para los próximos 90 días. Los lunes descansamos, los fines de semana se llenan primero y la madrugada tiene recargo."
      />

      <div
        className={`mt-12 grid gap-6 rounded-[2rem] p-1 transition-all duration-700 lg:grid-cols-[1.6fr_1fr] lg:gap-8 ${
          destacado ? 'bg-gold-400/10 ring-2 ring-gold-500/40' : 'ring-0'
        }`}
      >
        <div className="space-y-6">
          <Reveal>
            <Calendario />
          </Reveal>
          <Reveal delay={60}>
            <BloquesDelDia />
          </Reveal>
          <Reveal delay={80}>
            <Asistente />
          </Reveal>
          <Reveal>
            <MisReservas />
          </Reveal>
        </div>

        <Resumen />
      </div>
    </section>
  )
}
