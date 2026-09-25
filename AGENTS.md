# AGENTS.md — Contexto del proyecto

> Este archivo es la memoria del proyecto entre sesiones. Si eres un agente que retoma el
> trabajo: **lee esto primero** y actualízalo cuando cambies algo estructural.

## 1. Qué es esto

Sitio de una sola página (SPA) para **Gallos Dorados**, banda chilena de **nueva ranchera
chilena** de Maipú, con **agenda online**: calendario de disponibilidad real del grupo,
selección de bloques horarios y un asistente de reserva de 4 pasos que cotiza al instante.

- **Dueño / contacto:** Felipe (usuario) — voz principal del grupo.
- **Reemplaza a:** `https://losgallosdorados.wixsite.com/home` (sitio antiguo en Wix, 2018).
  **Decisión explícita del usuario: NO copiar la estructura ni el diseño del Wix.**
  Solo se reutiliza el **contenido y los assets reales** (logo, fotos, datos, integrantes).
- **Idioma del sitio y de los comentarios:** español de Chile.

## 2. Stack y comandos

Vite 8 · React 19 (JavaScript, sin TypeScript) · Tailwind CSS v4 (`@tailwindcss/vite`) ·
Three.js **puro** (sin `@react-three/fiber` ni `drei`, que se sacaron para aliviar el bundle).
Tipografías: **Fraunces** (títulos, `font-display`) + **Outfit** (texto, `font-sans`).
**Gestor de paquetes: pnpm** (no npm). El repo trae `pnpm-lock.yaml` y `packageManager` en
`package.json`; hay que mantener los dos (borrar `package-lock.json` si aparece).

```bash
pnpm install      # dependencias
pnpm dev          # servidor de desarrollo -> http://localhost:5173
pnpm build        # compila a dist/
pnpm preview      # sirve la compilación (ojo: si el puerto está ocupado, usa otro)
pnpm smoke        # render SSR en Node: detecta imports/props rotos sin navegador
pnpm verify       # Chrome headless: recorre la reserva completa, revisa errores de consola y guarda capturas/
```

**Flujo de verificación obligatorio antes de dar algo por terminado:**

1. `pnpm build` (debe compilar).
2. `pnpm smoke` (debe imprimir `OK: la app renderiza sin errores`).
3. `pnpm verify` con el servidor levantado → debe terminar en
   `✅ todas las comprobaciones pasaron` y `sin errores` en consola.
   - En Windows, `pnpm verify` con el build de producción:
     `pnpm exec vite preview --port 4180 --strictPort` y luego
     `$env:URL_WEB='http://localhost:4180/'; pnpm verify`.
   - Variables: `URL_WEB`, `SALIDA` (carpeta de capturas), `CHROME`, `PUERTO_CDP`.
4. Revisar visualmente 2-3 capturas de `capturas/` con la herramienta `read` (imágenes).

**Gotchas comprobados en esta máquina:**

- PowerShell 5.1 **no** soporta `&&`; usar `;` o comandos separados.
- Con `vite preview`, si el puerto está ocupado Vite cambia de puerto silenciosamente
  (`--strictPort` para evitarlo).
- Si se corre `pnpm verify` contra el **dev server** mientras se editan archivos, Vite
  recarga la página (HMR) y el test falla. Por eso el script inyecta helpers con
  `Page.addScriptToEvaluateOnNewDocument` y conviene verificar contra `preview`.
- En el servidor: `pnpm install --frozen-lockfile && pnpm build` y servir `dist/`. Si el
  hosting no permite enlaces simbólicos, un `.npmrc` con `node-linker=hoisted` lo resuelve.
- El navegador headless necesita `--enable-unsafe-swiftshader` para renderizar WebGL
  (Three.js) sin GPU.
- **Chrome no arranca si su perfil vive dentro de una carpeta sincronizada** (el
  Escritorio, con OneDrive, da `Multiple targets are not supported in headless mode`).
  Por eso `verificar-navegador.mjs` crea el perfil en la carpeta temporal del sistema y
  deja las capturas donde diga `SALIDA`.
- Solo hay Chrome/Edge instalados en `C:\Program Files\...` (el script los detecta solos).

## 3. Mapa del código

```
src/
├─ config/site.js          ← MARCA: nombre, teléfonos, WhatsApp, redes, logo, eslogan
├─ data/
│  ├─ shows.js             ← formatos de show, precios por cantidad de músicos, extras, % abono
│  ├─ comunas.js           ← comunas de Chile + zonas de traslado y recargos
│  ├─ availability.js      ← bloques horarios, días cerrados, feriados, disponibilidad (MOCK)
│  └─ contenido.js         ← integrantes, hitos, presentaciones, galería, FAQ, marquee
├─ lib/
│  ├─ pricing.js           ← motor de cotización (todo el precio sale de acá)
│  ├─ date.js              ← fechas locales, formatos es-CL, generación de .ics
│  ├─ format.js            ← CLP, plurales, capitalizar
│  └─ storage.js           ← localStorage: 'gd:reservas' y 'gd:borrador'
├─ context/
│  ├─ BookingContext.jsx   ← estado de la reserva (fecha, bloque, músicos, comuna, extras…)
│  └─ ToastContext.jsx     ← avisos flotantes
├─ hooks/useUI.js          ← reveal on scroll, count-up, tilt, sección activa, scroll, reduced-motion
└─ components/
   ├─ booking/             Calendario, BloquesDelDia, Asistente + 4 Pasos, Resumen, Confirmacion, MisReservas
   ├─ three/               GuitarraHero.jsx (three.js puro: guitarra del hero, gira sola y se pausa fuera de pantalla)
   ├─ VistaHero3D.jsx      lazy() + Suspense + límite de error de la escena del hero
   ├─ EscenarioSVG.jsx     ilustración SVG que se rearma con la cantidad de músicos (sin WebGL)
   ├─ icons.jsx            iconos SVG propios (placeholder-friendly)
   ├─ ui.jsx               Placeholder, Reveal, SectionTitle, Badge, Stars, Equalizer
   └─ Navbar, Hero, Marquee, Band, ShowTypes, Musicians, Gallery, Presentaciones, FAQ, Footer, FloatingActions, Modal
scripts/
├─ smoke-ssr.jsx           render en Node (pnpm smoke)
└─ verificar-navegador.mjs test E2E con Chrome headless (pnpm verify)
```

### Orden de las secciones (App.jsx)
`Hero → Band (El grupo) → ShowTypes → Musicians (Formación) → BookingSection (Agenda) →
Gallery → Presentaciones → FAQ → Footer`. El `Marquee` va dentro del Hero y los anclajes
(`#grupo`, `#shows`, …) están en `NAV_LINKS` de `src/config/site.js`.

### Identidad visual (tema claro)

El sitio es **claro y cálido**, tipo cartel de fonda. Toda la paleta vive en el bloque
`@theme` de `src/index.css`:

| Familia | Rol |
| --- | --- |
| `crema-50…600` | Superficies y fondos (50 = papel casi blanco) |
| `tinta-300…900` | Texto y bordes (900 = café casi negro) |
| `gold-100…700` | Dorado de la marca (para texto sobre crema usar 600/700) |
| `crimson-400…700` | Rojo vino de acentos y marquesina |
| `agave-300…700` | Verde de estados "disponible / ok" |
| `tierra-700…950` | Bandas oscuras cálidas (pie de página) |

Reglas que hay que respetar al agregar UI:

- Las superficies son `bg-white`, `bg-crema-*` o el utility `.card`; nunca negro.
- El texto va de `text-tinta-500` (secundario) a `text-tinta-900` (títulos). Para acentos
  dorados sobre crema usar `text-gold-700`; sobre rellenos dorados usar `text-tinta-900`.
- Los **bordes sin color explícito** toman `--color-crema-200` (regla en `@layer base`):
  Tailwind v4 usa `currentColor` por defecto y sin esa regla los bordes salen oscuros.
- El pie de página (`bg-tierra-900`) y el `Marquee` (`bg-crimson-600`) son las **únicas
  bandas oscuras** del sitio: son el contraste intencional, no el tema.
- Nada de `backdrop-blur` masivo (cuesta rendimiento): solo navbar, drawer y toasts.
- Las dos escenas 3D antiguas (músicos con tres.js y `drei`) se reemplazaron por el SVG del
  escenario; solo queda la guitarra del hero, en `three.js` puro y con el render pausado
  cuando el canvas sale de pantalla (`IntersectionObserver` + `visibilitychange`).

## 4. Motor de reserva (lo más delicado)

1. `Calendario` → el usuario elige día (rango: hoy + 90 días, `DIAS_DE_AGENDA`).
2. `BloquesDelDia` → 6 bloques (Mañanitas 09:00, Almuerzo 12:30, Tarde 16:00, Noche 19:00,
   Trasnoche 21:30 con +15%, Madrugada 00:00 con +25% solo viernes/sábado/vísperas).
   Lunes cerrado salvo feriado.
3. `Asistente` (4 pasos): **músicos → lugar/comuna → tipo de show + extras → datos y pago**.
4. `Confirmacion`: código `MRC-XXXX`, `.ics` descargable, mensaje de WhatsApp, guardado en
   `localStorage` y bloqueo del horario en ese navegador.

**La disponibilidad es un MOCK determinista** (`hash(fecha|bloque)` en
`src/data/availability.js`): no hay backend. Para conectar la agenda real, basta reemplazar
`estadoBloque()` / `bloquesDelDia()` por fetch a una API manteniendo la forma
`{ id, inicio, fin, nombre, recargo, estado: 'disponible'|'ultimos'|'ocupado' }`.
El punto de guardado de una reserva es `confirmar()` en `src/context/BookingContext.jsx`.

**Precios:** todos son de referencia, definidos en `src/data/shows.js` y compuestos en
`src/lib/pricing.js` (base por músicos + factor del show + recargo horario + extras +
traslado por zona − 5% si paga total). Abono 30%.

## 5. Datos reales del grupo (fuente: sitio Wix antiguo + sus redes)

- **Nombre:** Gallos Dorados · **Eslogan:** “¡Que no paren de sonar!” · **Género:** nueva ranchera chilena.
- **Origen:** Maipú, Región Metropolitana · **Fundado:** 11 de febrero de 2014 por Hugo Iván Olivares Brito.
- **Contacto:** `losgallosdorados@gmail.com` · +56 9 3078 4760 · +56 9 7377 3136.
- **Redes:** instagram.com/gallosdorados · facebook.com/GallosDoradosChile · youtube.com/gallosdorados.
- **Discos:** “Parte 1” (LM Producciones) y “Parte 2” (Mastermedia, firmado el 4 de mayo de 2018);
  en Spotify, Deezer, Claro Música, iTunes, YouTube, Shazam y Portaldisc.
- **Integrantes (5):** Hugo Olivares (teclado y dirección musical, fundador) · Alan Gómez (batería) ·
  Ignacio “Nacho” Olivares (guitarra) · **Felipe Figueroa (voz principal, viene del mariachi)** ·
  Rodrigo “Yoyo” González (huira y baile).
- **Hitos:** Teletón Maipú (cada año) · Festival de Malloco 2015 (con Los Jaivas, Noche de Brujas,
  Amar Azul) · Fonda “La Oficial” de Maipú 2017 (~6.000 personas) · Día de la Madre en Quinta
  Normal 2018 (+2.000 vecinos) · Maipeluza 2018 (~17.000 personas por noche, con Konchetucumbia,
  Combo Tortuga y Viking's 5) · 3 capítulos con Audiomúsica (teclado, batería, guitarra).
- **Equipamiento mencionado:** Korg, Fender, Tama. · **Origen del sitio:** `©2018 Ignacio Olivares Brito`.

## 6. Assets (imágenes reales)

Optimizadas a `.webp` en `public/img/` (todas juntas pesan ~1 MB). Los originales descargados
del Wix (JPG/PNG pesados, ~22 MB) están en `assets/originales/` — se pueden borrar si no se
necesitan para recortes nuevos.

| Archivo en `public/img/` | Origen (Wix) | Uso |
| --- | --- | --- |
| `logo-gallos-dorados.webp` | `Untitled.png` (gallo dorado circular) | Navbar, Footer, favicon |
| `banner-gallos-dorados.webp` | banner 5 integrantes | sección “El grupo”, galería |
| `integrante-{hugo,alan,nacho,felipe,yoyo}.webp` | `*perfil.png` | grilla de integrantes |
| `galeria-01.webp` | foto de galería | tarima grande con pantalla LED |
| `grupo-en-vivo-01.webp` | foto “21616224…” | público masivo desde el escenario |
| `show-nocturno.webp` | fondo de la sección contacto | show en carpa (fonda) |
| `maipeluza-2018.webp` | `maipeluza foto.jpg` | tarjeta Maipeluza |
| `audiomusica-{teclado,bateria,guitarra}.webp` | portadas de los 3 capítulos | galería |
| `firma-mastermedia.webp` | `paramaster.png` (collage de la firma) | galería / presentaciones |
| `og-gallos-dorados.jpg` | recorte 1200×630 del banner | `og:image` para redes |

- `public/favicon.png` se generó desde el logo (el `favicon.svg` viejo ya no se usa).
- Los iconos de la UI son SVG propios en `src/components/icons.jsx` (no vienen de Wix).
- Herramienta de optimización usada: `sharp` (se instaló en un directorio temporal, **no** es
  dependencia del proyecto). Si hay que volver a optimizar, `pnpm add sharp` en un tmp y repetir.

## 7. Estado y pendientes

**Hecho:** marca real integrada, calendario + asistente + confirmación funcionando, galería y
presentaciones con fotos reales, `AGENTS.md`, `.gitignore`, README.

**Rediseño visual (sesión del 25-09-2026, pedido de Felipe: “la web va lenta y se ve
demasiado oscura, el 3D es excesivo”):**

- Tema **claro y cálido** (papel crema + tinta café + oro + vino) en reemplazo del negro
  morado; tipografías nuevas (Fraunces + Outfit). Ver “Identidad visual” en la sección 3.
- **Una sola escena 3D**: la guitarra acústica del hero, reescrita en `three.js` puro.
  Se eliminaron `@react-three/fiber` y `@react-three/drei` (‑96 KB gzip de JS) y la segunda
  escena WebGL (Formación) pasó a ser `EscenarioSVG.jsx`.
- El render 3D se pausa fuera de pantalla y con la pestaña en segundo plano; DPR tope 1.75;
  sin sombras dinámicas (sombra falsa dibujada en canvas).
- Se sacó el `backdrop-blur` generalizado y el fondo fijo con `background-attachment`.
- Arreglo chico pero visible: el badge “Ahorras” del pago total mostraba `$0` hasta que
  elegías esa opción (`PasoDatos.jsx`).

**Pendiente / a confirmar con Felipe (importante: NO inventar estos datos):**

1. **Precios reales** por formato y cantidad de músicos (hoy son de ejemplo) y % de abono.
2. **Reglas reales de agenda:** qué días descansan, horarios que realmente trabajan, feriados,
   anticipación mínima y si cobran recargo nocturno.
3. **Cobertura y traslado:** comunas que cubren y recargos reales (hoy hay 5 zonas inventadas).
4. **¿Ofrecen mariachi como servicio aparte?** Hoy aparece como extra (“Bloque de mariachi”) porque
   Felipe viene del mariachi; confirmar si es un set de 45 min, con cuántos músicos y a qué precio.
5. **Links de música:** URLs de Spotify / Deezer / Apple Music / YouTube del grupo (hoy solo chips
   sin link) y si quieren embed de un video propio.
6. **Fotos y video nuevos:** más material en alta (y permiso de uso de las fotos con terceros,
   p. ej. la de Maipeluza donde aparece la alcaldesa).
7. **Cobros:** ¿integración de pasarela (Transbank/Mercado Pago) o solo abono por transferencia
   + confirmación por WhatsApp? Datos bancarios y boleta/RUT si van a facturar.
8. **Avisos automáticos:** si quieren que la reserva llegue por correo/WhatsApp (requiere backend).
9. **Testimonios:** no hay opiniones reales todavía (el Wix no tenía); la sección de opiniones se
   reemplazó por “Presentaciones”. Si consiguen reseñas, se puede reactivar un carrusel de clientes.
10. **Analítica y SEO:** Google Analytics/Meta Pixel, dominio propio, textos legales (términos y
    política de privacidad por la ley chilena de datos personales).

## 8. Convenciones de código

- Componentes en **español** para nombres de negocio (`Resumen`, `BloquesDelDia`) y en inglés para
  utilidades genéricas (`useReveal`, `Modal`). Comentarios en español.
- Estilos: tema oscuro + dorado (`--color-night-*`, `--color-gold-*` en `src/index.css`); clases
  propias `card`, `btn-gold`, `btn-ghost`, `chip`, `field`, `section`, `reveal-*`, `glass` (definidas
  con `@utility`/`@layer components` para poder usar `@apply`).
- Nada de contenido inventado sobre el negocio (números, premios, precios): si falta un dato,
  dejar el placeholder visible y anotarlo en la sección 7.
- Placeholders: si vuelve a faltar una imagen, usar `<Placeholder label detalle />` de
  `src/components/ui.jsx` (deja el marco rayado y las medidas sugeridas).
