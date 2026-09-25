# 🐓 Gallos Dorados — Web de agendamiento

Sitio de una sola página para la banda chilena de **nueva ranchera chilena** Gallos Dorados:
calendario de disponibilidad, selección de bloque horario y asistente de reserva de 4 pasos que
cotiza al instante.

Hecho con **Vite + React (JavaScript) + Tailwind CSS v4 + Three.js**. Se instala y ejecuta con
**pnpm** (el proyecto trae `pnpm-lock.yaml` y declara la versión en `packageManager`).

> Si eres un agente de IA trabajando en este repo, parte por **`AGENTS.md`**: ahí está el contexto
> completo (datos reales del grupo, pendientes, convenciones y cómo verificar).

---

## 🚀 Cómo ejecutarlo

Requisitos: **Node 20+** y **pnpm**. Si no tienes pnpm, se instala con
`corepack enable pnpm` (Corepack viene con Node) o `npm i -g pnpm`.

```bash
pnpm install     # dependencias
pnpm dev         # desarrollo -> http://localhost:5173
pnpm build       # compilar a dist/
pnpm preview     # probar la compilación
pnpm smoke       # chequeo rápido de render (Node)
pnpm verify      # test en Chrome headless del flujo de reserva + capturas en capturas/
```

> **Despliegue:** en el servidor basta con `pnpm install --frozen-lockfile && pnpm build` y servir
> `dist/`. Si el hosting no permite enlaces simbólicos (algunos paneles compartidos), crear un
> `.npmrc` con `node-linker=hoisted` y volver a instalar.

---

## ✨ Qué incluye

| Sección | Detalle |
| --- | --- |
| Hero + escena 3D | Una guitarra acústica modelada con geometría procedural (silueta extruida + veta *sunburst* generada en canvas). Gira sola, lento, y el render se pausa cuando sale de pantalla. |
| El grupo | Historia real (fundado el 11/02/2014 en Maipú), línea de tiempo con los hitos, discografía “Parte 1” y “Parte 2” y los 5 integrantes con foto. |
| Formatos de show | 8 formatos: serenata/mañanitas, cumpleaños, matrimonio, show bailable con huira, fondas, eventos municipales, empresas y homenajes. |
| Formación | Selector de 3 a 12 músicos con **escenario ilustrado en SVG** que se rearma: cada músico aparece con su instrumento según el rol. |
| Agenda | Calendario de 90 días con estado por bloque (disponible / últimos cupos / ocupado), lunes de descanso, feriados y recargos por horario. |
| Reserva | 4 pasos: **músicos → lugar (comuna) → show + extras → datos y pago**, con cotización en vivo en la barra lateral y barra fija en móvil. |
| Confirmación | Código de reserva, descarga `.ics`, envío por WhatsApp y guardado en `localStorage`. |
| Galería y presentaciones | Fotos reales del grupo, carrusel con fondas, festivales, la firma con Mastermedia y los capítulos de Audiomúsica. |
| FAQ / Footer | Preguntas con respuestas reales, contacto, redes y formatos. |

Extras: barra de progreso de lectura, menú activo por sección, contadores animados, animaciones al
hacer scroll, toasts, confeti al confirmar, botón flotante de WhatsApp y respeto por
`prefers-reduced-motion`.

---

## 🧮 Dónde se edita cada cosa

| Archivo | Qué contiene |
| --- | --- |
| `src/config/site.js` | Nombre, eslogan, teléfonos, WhatsApp, email, redes, logo. **Empieza por acá.** |
| `src/data/shows.js` | Formatos de show (duración, factor de precio, qué incluye), músicos en escena (3–12 con precios), extras, % de abono. |
| `src/data/comunas.js` | Comunas con región y zona de traslado + recargos por zona. |
| `src/data/availability.js` | Bloques horarios, días cerrados, feriados y disponibilidad (simulada, ver más abajo). |
| `src/data/contenido.js` | Integrantes, hitos, presentaciones, galería y preguntas frecuentes. |
| `src/lib/pricing.js` | Motor de cotización (base + show + horario + extras + traslado − descuentos). |

**Precios y disponibilidad son de ejemplo.** Los precios son editables en `shows.js` y la agenda es
determinista (`hash(fecha|bloque)`) para funcionar sin servidor. En `AGENTS.md` está el detalle de
cómo conectar una API real y qué datos falta confirmar con el grupo.

---

## 🖼️ Imágenes

Las fotos del grupo, el logo y el collage de la firma con Mastermedia se descargaron del sitio
original en Wix, se optimizaron a `.webp` y viven en `public/img/` (~1 MB en total). Los originales
pesados quedaron en `assets/originales/` por si se necesitan recortes nuevos.

- `public/favicon.png` se generó desde el logo.
- `public/img/og-gallos-dorados.jpg` es la imagen que se muestra al compartir el link en redes.
- Los iconos de la interfaz son SVG propios en `src/components/icons.jsx`.

---

## 📁 Estructura

```
src/
├─ components/
│  ├─ booking/     Calendario, bloques, asistente, pasos, resumen, confirmación
│  ├─ three/       GuitarraHero.jsx (escena three.js del hero)
│  ├─ EscenarioSVG.jsx  Escenario ilustrado de la sección Formación
│  └─ ...          Navbar, Hero, Marquee, Band, ShowTypes, Musicians, Gallery, Presentaciones, FAQ, Footer
├─ config/site.js  Datos de la marca
├─ context/        Estado de la reserva y toasts
├─ data/           shows, comunas, disponibilidad, contenido
├─ hooks/useUI.js  Reveal, contadores, tilt, sección activa, scroll, reduced-motion
└─ lib/            Fechas, formato CLP, cotización, localStorage
scripts/           smoke-ssr.jsx (render en Node) y verificar-navegador.mjs (test E2E)
capturas/          Capturas del test E2E (se regeneran con pnpm verify)
```
