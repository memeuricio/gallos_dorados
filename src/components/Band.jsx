import { HITOS, INTEGRANTES } from '../data/contenido'
import { SITE, waLink } from '../config/site'
import Icon from './icons'
import { Badge, Reveal, SectionTitle } from './ui'

const PLATAFORMAS = ['Spotify', 'Deezer', 'Claro Música', 'iTunes', 'YouTube', 'Shazam', 'Portaldisc']

function TarjetaIntegrante({ persona }) {
  return (
    <article className="group card overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgb(229_161_31/0.18),transparent_65%)]">
        <img
          src={persona.foto}
          alt={`${persona.nombre} — ${persona.rol}`}
          loading="lazy"
          className="size-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)] transition duration-500 group-hover:scale-[1.04]"
        />
        {persona.destacado && (
          <span className="absolute top-3 left-3">
            <Badge tono="gold">{persona.destacado}</Badge>
          </span>
        )}
      </div>
      <div className="border-t bg-crema-100 p-4">
        <p className="text-[11px] tracking-[0.16em] text-gold-700 uppercase">{persona.rol}</p>
        <h3 className="mt-1 text-base leading-snug text-tinta-900">{persona.nombre}</h3>
        <p className="mt-2 text-xs leading-relaxed text-tinta-400">{persona.detalle}</p>
      </div>
    </article>
  )
}

export default function Band() {
  const anios = new Date().getFullYear() - SITE.anioFundacion

  return (
    <section id="grupo" className="section">
      <SectionTitle
        kicker="El grupo"
        titulo={`${anios} años de nueva ranchera chilena`}
        bajada="Nacimos en Maipú el 11 de febrero de 2014 y desde entonces no paramos: fondas, festivales, matrimonios y escenarios municipales por todo Chile."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        {/* Foto del grupo */}
        <Reveal className="flex flex-col gap-4">
          <figure className="card overflow-hidden p-0">
            <img
              src={SITE.fotoGrupo}
              alt={`${SITE.nombre}: los cinco integrantes con traje de charro frente a un muro dorado`}
              className="h-full w-full object-cover"
            />
            <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-crema-200 px-5 py-4 text-xs text-tinta-400">
              <span className="inline-flex items-center gap-2">
                <Icon name="pin" className="size-3.5 text-gold-600" />
                {SITE.comunaBase} · desde {SITE.anioFundacion}
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="music" className="size-3.5 text-gold-600" />
                {SITE.eslogan}
              </span>
            </figcaption>
          </figure>

          {/* Discografía */}
          <div className="card flex flex-wrap items-center gap-5 p-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-gold-500/30 bg-crema-50/70 text-gold-700">
              <Icon name="music" className="size-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] tracking-[0.16em] text-gold-700 uppercase">Discografía</p>
              <h3 className="mt-1 text-lg text-tinta-900">“Parte 1” y “Parte 2”</h3>
              <p className="mt-1 text-xs text-tinta-400">
                Editados con Mastermedia y disponibles en las plataformas digitales:
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {PLATAFORMAS.map((p) => (
                  <span key={p} className="chip text-[11px]">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto">
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost px-4 py-2 text-xs"
              >
                <Icon name="youtube" className="size-4" />
                Ver en YouTube
              </a>
              <a href="#galeria" className="btn-dark px-4 py-2 text-xs">
                <Icon name="image" className="size-4" />
                Fotos de la firma
              </a>
            </div>
          </div>
        </Reveal>

        {/* Historia + hitos */}
        <Reveal delay={80} className="flex flex-col gap-6">
          <div className="card p-6">
            <h3 className="text-xl text-tinta-900">Nuestra historia</h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-tinta-500">
              <p>
                Gallos Dorados nació el <strong className="text-tinta-800">11 de febrero de 2014</strong>,
                cuando el músico y compositor{' '}
                <strong className="text-tinta-800">Hugo Iván Olivares Brito</strong> reunió a un grupo
                de músicos para darle forma a un sonido propio dentro de la{' '}
                <strong className="text-tinta-800">nueva ranchera chilena</strong>.
              </p>
              <p>
                Nuestra interpretación mezcla raíces mexicanas, cumbia y música chilena, con
                instrumentos de primera línea (Korg, Fender, Tama) y un huirista que contagia al
                público desde el primer acorde. Ese detalle nos diferencia del resto.
              </p>
              <p>
                Hoy llevamos dos producciones editadas y una agenda que combina{' '}
                <strong className="text-tinta-800">show privado, fonda y escenario masivo</strong>: desde
                un matrimonio en Ñuñoa hasta una fonda con 17.000 personas por noche.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href="#agenda" className="btn-gold px-5 py-2.5 text-xs">
                <Icon name="calendar" className="size-4" />
                Ver agenda
              </a>
              <a
                href={waLink('Hola! Quiero saber más de Gallos Dorados y cotizar un show.')}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost px-5 py-2.5 text-xs"
              >
                <Icon name="whatsapp" className="size-4" />
                Hablar con la banda
              </a>
            </div>
          </div>

          <ol className="relative space-y-4 border-l border-crema-200 pl-6">
            {HITOS.map((h) => (
              <li key={`${h.anio}-${h.titulo}`} className="relative">
                <span className="absolute top-2 -left-[31px] size-2.5 rounded-full bg-gold-400 ring-4 ring-crema-50" />
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tono="gold">{h.anio}</Badge>
                  <h4 className="text-base text-tinta-900">{h.titulo}</h4>
                </div>
                <p className="mt-1.5 text-sm text-tinta-400">{h.texto}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      {/* Integrantes */}
      <Reveal className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip border-gold-500/30 bg-gold-400/10 text-gold-700">
              <Icon name="users" className="size-3.5" />
              Integrantes
            </span>
            <h3 className="mt-3 text-2xl text-tinta-900">Quién es quién en el escenario</h3>
          </div>
          <p className="max-w-md text-sm text-tinta-400">
            Cinco músicos con más de 20 años de trayectoria cada uno. Para escenarios grandes se
            suman invitados: bajo, acordeón, percusión y vientos.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {INTEGRANTES.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <TarjetaIntegrante persona={p} />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
