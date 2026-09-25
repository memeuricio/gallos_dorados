/* Prueba rápida: renderiza la app completa en el servidor para detectar
   errores de ejecución (componentes mal importados, props inexistentes, etc.).
   Uso: npx vite build --ssr src/entry-ssr.jsx --outDir dist-ssr && node dist-ssr/entry-ssr.js */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from '../src/App'
import { BookingProvider } from '../src/context/BookingContext'
import { ToastProvider } from '../src/context/ToastContext'
import { BLOQUES } from '../src/data/availability'
import { addDays, hoyISO } from '../src/lib/date'

function render(estadoInicial) {
  return renderToString(
    <StrictMode>
      <ToastProvider>
        <BookingProvider estadoInicial={estadoInicial}>
          <App />
        </BookingProvider>
      </ToastProvider>
    </StrictMode>,
  )
}

let fallos = 0

function revisar(nombre, html, esperados) {
  const faltantes = esperados.filter((t) => !html.includes(t))
  if (faltantes.length) {
    console.error(`✗ ${nombre}: faltan textos ->`, faltantes)
    fallos++
  } else {
    console.log(`✓ ${nombre}: ${html.length} caracteres`)
  }
}

/* 1) Estado inicial: calendario visible, sin asistente abierto */
revisar('vista inicial', render(null), [
  'Gallos Dorados',
  'Calendario en vivo',
  'Elige el día',
  'Elige un día en el calendario',
  'Tu cotización',
  'Nuestra historia',
  'Formatos de show',
])

/* 2) Con bloque elegido: se abre el asistente de 4 pasos */
revisar(
  'asistente abierto',
  render({
    fechaISO: addDays(hoyISO(), 5),
    bloque: BLOQUES[3],
    comuna: 'Maipú',
    cantidadMusicos: 5,
    paso: 2,
    cliente: { nombre: 'Felipe Figueroa', telefono: '+56930784760', email: '', direccion: '', solicitudes: '' },
  }),
  ['Lugar · Comuna', '¿Dónde será el show?', 'Anterior', 'Tu bloque'],
)

/* 3) Paso final: datos y pago */
revisar(
  'paso datos',
  render({
    fechaISO: addDays(hoyISO(), 9),
    bloque: BLOQUES[3],
    comuna: 'Providencia',
    paso: 4,
    pagoTotal: true,
    extras: ['sonido', 'traje'],
  }),
  ['Tus datos de contacto', 'Forma de pago', 'Confirmar reserva', 'Resumen del show'],
)

if (fallos) {
  console.error(`\n${fallos} prueba(s) fallaron`)
  process.exit(1)
}
console.log('\nOK: la app renderiza sin errores')
