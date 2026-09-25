import { NAV_LINKS, SITE, waLink } from '../config/site'
import { TIPOS_SHOW } from '../data/shows'
import Icon from './icons'

/* Pie de página: la única banda oscura del sitio, en tono "tierra"
   (café cálido) para cerrar la página sin volver al negro anterior. */
export default function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="relative mt-16 bg-tierra-900 text-crema-200">
      {/* hilo dorado superior */}
      <div className="h-1 w-full bg-gradient-to-r from-gold-600 via-gold-400 to-crimson-500" />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={SITE.logo}
              alt={`${SITE.nombre} — logo`}
              className="size-14 object-contain"
              loading="lazy"
            />
            <span>
              <span className="block font-display text-lg text-crema-50">{SITE.nombre}</span>
              <span className="block text-[10px] tracking-[0.2em] text-gold-400 uppercase">
                {SITE.genero} · {SITE.eslogan}
              </span>
            </span>
          </div>

          <p className="mt-5 max-w-sm text-sm text-crema-300/80">
            Banda de Maipú formada en {SITE.anioFundacion}. Dos discos editados con Mastermedia,
            experiencia en fondas y escenarios masivos, y una agenda abierta para shows privados en
            todo Chile.
          </p>

          <div className="mt-5 flex gap-2">
            {[
              { icon: 'whatsapp', href: waLink(), label: 'WhatsApp' },
              { icon: 'instagram', href: SITE.instagram, label: 'Instagram' },
              { icon: 'facebook', href: SITE.facebook, label: 'Facebook' },
              { icon: 'youtube', href: SITE.youtube, label: 'YouTube' },
            ].map((r) => (
              <a
                key={r.icon}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                aria-label={r.label}
                className="grid size-10 place-items-center rounded-2xl border border-crema-100/15 bg-crema-100/5 text-crema-200 transition hover:border-gold-400/60 hover:text-gold-300"
              >
                <Icon name={r.icon} className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Enlaces del sitio">
          <h3 className="text-sm tracking-[0.16em] text-gold-400 uppercase">Navegación</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="text-crema-300/85 transition hover:text-gold-300">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#agenda" className="text-crema-300/85 transition hover:text-gold-300">
                Agendar show
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-sm tracking-[0.16em] text-gold-400 uppercase">Formatos</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {TIPOS_SHOW.slice(0, 6).map((s) => (
              <li key={s.id}>
                <a href="#shows" className="text-crema-300/85 transition hover:text-gold-300">
                  {s.nombre}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 text-sm text-crema-300/85">
            <p className="flex items-center gap-2">
              <Icon name="pin" className="size-4 text-gold-400" />
              {SITE.comunaBase}
            </p>
            <p className="flex items-center gap-2">
              <Icon name="phone" className="size-4 text-gold-400" />
              <a href={`tel:${SITE.telefono.replace(/\s/g, '')}`} className="hover:text-gold-300">
                {SITE.telefono}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Icon name="phone" className="size-4 text-gold-400" />
              <a href={`tel:${SITE.telefono2.replace(/\s/g, '')}`} className="hover:text-gold-300">
                {SITE.telefono2}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Icon name="mail" className="size-4 text-gold-400" />
              <a href={`mailto:${SITE.email}`} className="hover:text-gold-300">
                {SITE.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-crema-100/10 px-5 py-6 sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 text-xs text-crema-300/60 sm:flex-row">
          <p>
            © {anio} {SITE.nombre}. Todos los derechos reservados · Sitio nuevo, hecho en Chile 🇨🇱
          </p>
          <p className="flex items-center gap-4">
            <span>React + Tailwind + Three.js</span>
            <a href="#inicio" className="transition hover:text-gold-300">
              Volver arriba
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
