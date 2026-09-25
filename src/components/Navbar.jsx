import { useMemo, useState } from 'react'
import { NAV_LINKS, SITE } from '../config/site'
import { useBloquearScroll, useScrollProgreso, useSeccionActiva } from '../hooks/useUI'
import Icon from './icons'

function Logo() {
  return (
    <a href="#inicio" className="group flex items-center gap-3">
      {/* Logo real del grupo (descargado del sitio original) */}
      <img
        src={SITE.logo}
        alt={`${SITE.nombre} — logo`}
        className="size-11 object-contain transition group-hover:scale-105"
        width="88"
        height="88"
      />
      <span className="leading-tight">
        <span className="block font-display text-[15px] text-tinta-900">{SITE.nombre}</span>
        <span className="block text-[10px] tracking-[0.2em] text-gold-600/80 uppercase">
          {SITE.genero}
        </span>
      </span>
    </a>
  )
}

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const progreso = useScrollProgreso()
  const ids = useMemo(() => NAV_LINKS.map((l) => l.id), [])
  const activa = useSeccionActiva(ids)

  useBloquearScroll(abierto)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70]">
        <div className="border-b bg-crema-100 bg-crema-50/80 backdrop-blur-sm">
          <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
            <Logo />

            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`relative rounded-full px-3.5 py-2 text-sm transition ${
                      activa === link.id
                        ? 'text-gold-700'
                        : 'text-tinta-500 hover:bg-crema-100 hover:text-tinta-900'
                    }`}
                  >
                    {link.label}
                    {activa === link.id && (
                      <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <a href="#agenda" className="btn-gold hidden px-5 py-2.5 text-[13px] sm:inline-flex">
                <Icon name="calendar" className="size-4" />
                Agendar show
              </a>
              <button
                type="button"
                onClick={() => setAbierto(true)}
                className="grid size-10 cursor-pointer place-items-center rounded-2xl border border-crema-300 text-tinta-800 transition hover:border-gold-500/50 lg:hidden"
                aria-label="Abrir menú"
                aria-expanded={abierto}
              >
                <Icon name="menu" className="size-5" />
              </button>
            </div>
          </nav>
        </div>
        {/* barra de progreso de lectura */}
        <div className="h-[3px] w-full bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-gold-500 via-gold-300 to-agave-400 transition-[width] duration-150"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </header>

      {/* Drawer móvil */}
      {abierto && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-crema-50/80 backdrop-blur-sm"
            onClick={() => setAbierto(false)}
            aria-hidden="true"
          />
          <div className="animate-slide-up absolute inset-x-3 top-3 rounded-3xl border border-crema-200 bg-crema-100/97 p-5 shadow-[0_30px_80px_-30px_rgb(60_34_10/0.3)]">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-crema-300 text-tinta-700"
                aria-label="Cerrar menú"
              >
                <Icon name="close" className="size-4" />
              </button>
            </div>
            <ul className="mt-6 grid gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setAbierto(false)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base transition ${
                      activa === link.id
                        ? 'bg-gold-400/20 text-gold-700'
                        : 'text-tinta-700 hover:bg-crema-100'
                    }`}
                  >
                    {link.label}
                    <Icon name="arrowRight" className="size-4 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
            <a href="#agenda" onClick={() => setAbierto(false)} className="btn-gold mt-4 w-full">
              <Icon name="calendar" className="size-4" />
              Agendar show
            </a>
            <p className="mt-4 text-center text-xs text-tinta-400">{SITE.horarioAtencion}</p>
          </div>
        </div>
      )}
    </>
  )
}
