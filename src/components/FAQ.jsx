import { useState } from 'react'
import { FAQS } from '../data/contenido'
import { SITE, waLink } from '../config/site'
import Icon from './icons'
import { Reveal, SectionTitle } from './ui'

export default function FAQ() {
  const [abiertas, setAbiertas] = useState(() => new Set([0]))

  const alternar = (i) => {
    setAbiertas((prev) => {
      const copia = new Set(prev)
      if (copia.has(i)) copia.delete(i)
      else copia.add(i)
      return copia
    })
  }

  return (
    <section id="faq" className="section">
      <SectionTitle
        kicker="Preguntas frecuentes"
        titulo="Todo lo que suelen preguntarnos"
        bajada="Si te queda alguna duda, escríbenos por WhatsApp: respondemos en minutos."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <ul className="space-y-3">
            {FAQS.map((f, i) => {
              const abierta = abiertas.has(i)
              return (
                <li key={f.p} className="card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => alternar(i)}
                    aria-expanded={abierta}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-crema-100"
                  >
                    <span className="font-display text-base text-tinta-900">{f.p}</span>
                    <Icon
                      name="chevronDown"
                      className={`size-5 shrink-0 text-gold-700 transition-transform duration-300 ${
                        abierta ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: abierta ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-tinta-500">{f.r}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </Reveal>

        {/* Tarjeta lateral de contacto */}
        <Reveal delay={80} className="lg:sticky lg:top-28 lg:self-start">
          <div className="card overflow-hidden p-6">
            <p className="text-[11px] tracking-[0.18em] text-gold-700 uppercase">Atención directa</p>
            <h3 className="mt-2 text-xl">¿Prefieres que te llamemos?</h3>
            <p className="mt-2 text-sm text-tinta-500">
              Cuéntanos fecha, comuna y cuántas personas habrá y te armamos una propuesta con
              repertorio incluido.
            </p>

            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl border border-gold-500/25 bg-crema-50/60 text-gold-700">
                  <Icon name="phone" className="size-4" />
                </span>
                <a href={`tel:${SITE.telefono.replace(/\s/g, '')}`} className="text-tinta-800 hover:text-gold-700">
                  {SITE.telefono}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl border border-gold-500/25 bg-crema-50/60 text-gold-700">
                  <Icon name="mail" className="size-4" />
                </span>
                <a href={`mailto:${SITE.email}`} className="text-tinta-800 hover:text-gold-700">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl border border-gold-500/25 bg-crema-50/60 text-gold-700">
                  <Icon name="clock" className="size-4" />
                </span>
                <span className="text-tinta-500">{SITE.horarioAtencion}</span>
              </li>
            </ul>

            <a
              href={waLink('Hola! Quiero cotizar un mariachi para una fecha específica.')}
              target="_blank"
              rel="noreferrer"
              className="btn-gold mt-6 w-full"
            >
              <Icon name="whatsapp" className="size-4" />
              Escribir por WhatsApp
            </a>

            <div className="mt-5 rounded-2xl border border-dashed border-gold-500/30 bg-gold-400/[0.06] p-4 text-xs text-tinta-600">
              <p>
                ¿Quieres ver al grupo antes de contratarnos? En YouTube están los capítulos que
                grabamos con Audiomúsica y parte de nuestros discos.
              </p>
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost mt-3 w-full px-4 py-2 text-xs"
              >
                <Icon name="youtube" className="size-4" />
                Ver videos del grupo
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
