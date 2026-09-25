/* =========================================================================
   Verificación en navegador real (Chrome headless vía CDP).

   Qué hace:
     1. Abre la web, elige un día y un bloque de la agenda.
     2. Recorre los 4 pasos del asistente y confirma una reserva.
     3. Comprueba que la reserva quede en localStorage y que no haya errores
        de consola.
     4. Guarda capturas de pantalla en la carpeta `capturas/`.

   Requisitos: el servidor levantado (pnpm dev) y Chrome instalado.
   Uso:
     node scripts/verificar-navegador.mjs
     URL_WEB=http://localhost:4173/ node scripts/verificar-navegador.mjs
   ========================================================================= */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

const URL_WEB = process.env.URL_WEB || 'http://localhost:5173/'
const SALIDA = process.env.SALIDA || path.resolve('capturas')
const CHROME =
  process.env.CHROME ||
  ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].find(
    (ruta) => fs.existsSync(ruta),
  )
const PUERTO = Number(process.env.PUERTO_CDP || 9333)

if (!CHROME) {
  console.error('No encontré Chrome ni Edge. Define CHROME=/ruta/al/navegador')
  process.exit(1)
}

fs.mkdirSync(SALIDA, { recursive: true })
// Perfil limpio en cada corrida. Va en la carpeta temporal del sistema:
// Chrome no arranca si su perfil vive dentro de una carpeta sincronizada
// (por ejemplo el Escritorio con OneDrive), y así las capturas pueden
// quedar igualmente dentro del proyecto.
const PERFIL = path.join(os.tmpdir(), 'gd-verificar-perfil')
fs.rmSync(PERFIL, { recursive: true, force: true })

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PUERTO}`,
    '--user-data-dir=' + PERFIL,
    '--enable-unsafe-swiftshader',
    '--use-angle=swiftshader',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--mute-audio',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const dormir = (ms) => new Promise((r) => setTimeout(r, ms))

async function esperarDevtools() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PUERTO}/json/version`)
      if (r.ok) return await r.json()
    } catch {
      /* todavía no está listo */
    }
    await dormir(500)
  }
  throw new Error('El navegador no expuso el puerto de DevTools')
}

class CDP {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pendientes = new Map()
    this.esperas = new Map()
    this.consola = []
    this.errores = []
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data)
      if (msg.id && this.pendientes.has(msg.id)) {
        const { resolver, rechazar } = this.pendientes.get(msg.id)
        this.pendientes.delete(msg.id)
        msg.error ? rechazar(new Error(JSON.stringify(msg.error))) : resolver(msg.result)
        return
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        const texto = (msg.params.args || []).map((a) => a.value ?? a.description ?? a.type).join(' ')
        this.consola.push(`${msg.params.type}: ${texto}`)
        if (msg.params.type === 'error') this.errores.push(texto)
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        const d = msg.params.exceptionDetails
        this.errores.push(d.exception?.description || d.text)
      }
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        this.errores.push(msg.params.entry.text)
      }
      const lista = this.esperas.get(msg.method)
      if (lista?.length) lista.shift()()
    })
  }

  send(method, params = {}) {
    const id = ++this.id
    return new Promise((resolver, rechazar) => {
      this.pendientes.set(id, { resolver, rechazar })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }

  esperarEvento(method, timeout = 15000) {
    return new Promise((resolver) => {
      const lista = this.esperas.get(method) || []
      lista.push(resolver)
      this.esperas.set(method, lista)
      setTimeout(resolver, timeout)
    })
  }

  async eval(expression) {
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (r.exceptionDetails) {
      const d = r.exceptionDetails
      throw new Error('Error en la página: ' + (d.exception?.description || d.text))
    }
    return r.result?.value
  }
}

const abrirWs = (url) =>
  new Promise((resolver, rechazar) => {
    const ws = new WebSocket(url)
    ws.addEventListener('open', () => resolver(ws))
    ws.addEventListener('error', rechazar)
  })

const AYUDAS = `
  window.__clickTexto = (contenedor, texto) => {
    const raiz = document.querySelector(contenedor);
    if (!raiz) return 'no existe el contenedor ' + contenedor;
    const el = [...raiz.querySelectorAll('button')].find((b) =>
      (b.textContent || '').toLowerCase().includes(texto.toLowerCase()),
    );
    if (!el) return 'no encontrado: ' + texto;
    el.click();
    return (el.textContent || '').replace(/\\s+/g, ' ').slice(0, 60);
  };
  window.__setValor = (sel, valor) => {
    const el = document.querySelector(sel);
    if (!el) return 'no existe ' + sel;
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, valor);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return el.value;
  };
`

let fallos = 0
function revisar(nombre, condicion, detalle = '') {
  if (condicion) console.log(`✓ ${nombre}`)
  else {
    console.log(`✗ ${nombre} ${detalle}`)
    fallos++
  }
}

async function main() {
  await esperarDevtools()
  await dormir(800)
  const lista = await (await fetch(`http://127.0.0.1:${PUERTO}/json/list`)).json()
  const paginas = lista.filter((t) => t.type === 'page')
  const pagina = paginas.find((t) => t.url.includes('localhost')) || paginas[0]
  const ws = await abrirWs(pagina.webSocketDebuggerUrl)
  const cdp = new CDP(ws)

  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Log.enable')
  // Los helpers se inyectan en cada carga de documento (así sobreviven reloads de HMR)
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: AYUDAS })
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false })

  const carga = cdp.esperarEvento('Page.loadEventFired')
  await cdp.send('Page.navigate', { url: URL_WEB })
  await carga
  await dormir(6000) // deja cargar Three.js y las animaciones

  // Espera a que la agenda esté montada antes de interactuar
  for (let i = 0; i < 40; i++) {
    const listo = await cdp.eval(`Boolean(window.__clickTexto) && document.querySelectorAll('#agenda button').length > 5`)
    if (listo) break
    await dormir(500)
  }

  const capturar = async (nombre) => {
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(path.join(SALIDA, `${nombre}.png`), Buffer.from(shot.data, 'base64'))
  }
  const irA = async (selector) => {
    await cdp.eval(`document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({behavior:'instant', block:'start'})`)
    await dormir(1600)
  }

  await capturar('01-hero')
  await irA('#grupo')
  await capturar('02-grupo')
  await irA('#shows')
  await capturar('03-shows')
  await irA('#musicos')
  await capturar('04-formacion')
  await irA('#agenda')
  await capturar('05-agenda')

  /* ---------- Elegir día ---------- */
  const dia = await cdp.eval(`(() => {
    const b = [...document.querySelectorAll('#agenda button')].find((x) => !x.disabled && /disponibles/.test(x.getAttribute('aria-label') || ''));
    if (!b) return null;
    b.click();
    return b.getAttribute('aria-label');
  })()`)
  revisar('seleccionar día', Boolean(dia), JSON.stringify(dia))
  console.log('   día:', dia)
  await dormir(1200)

  /* ---------- Elegir bloque ---------- */
  const bloque = await cdp.eval(`(() => {
    const b = [...document.querySelectorAll('#agenda button')].find(
      (x) => !x.disabled && /(AM|PM)/.test(x.textContent) && /(Disponible|Últimos)/.test(x.textContent),
    );
    if (!b) return null;
    b.click();
    return b.textContent.replace(/\\s+/g, ' ').slice(0, 60);
  })()`)
  revisar('seleccionar bloque', Boolean(bloque), JSON.stringify(bloque))
  console.log('   bloque:', bloque)
  await dormir(2200)
  await irA('#asistente')
  await capturar('06-asistente-paso1')

  revisar(
    'asistente con los 4 pasos',
    await cdp.eval(`/Lugar · Comuna/.test(document.querySelector('#asistente')?.textContent || '')`),
  )

  /* ---------- Paso 1: músicos ---------- */
  await cdp.eval(`window.__clickTexto('#asistente', 'Octeto')`)
  await dormir(800)
  const filaMusicos = await cdp.eval(`(() => {
    const fila = [...document.querySelectorAll('aside li')].find((f) => /Músicos/.test(f.textContent));
    return fila ? fila.textContent.replace(/\\s+/g, ' ').trim() : 'sin fila';
  })()`)
  revisar('cambiar a 8 músicos (se refleja en el resumen)', /8 músicos/.test(filaMusicos), filaMusicos)

  /* ---------- Paso 2: comuna ---------- */
  await cdp.eval(`window.__clickTexto('#asistente', 'Siguiente')`)
  await dormir(1200)
  const eligio = await cdp.eval(`window.__clickTexto('#asistente', 'Providencia')`)
  revisar('elegir comuna', eligio !== 'no encontrado: Providencia', String(eligio))
  await dormir(900)
  await capturar('07-asistente-paso2')

  /* ---------- Paso 3: show + extra ---------- */
  await cdp.eval(`window.__clickTexto('#asistente', 'Siguiente')`)
  await dormir(1200)
  await cdp.eval(`window.__clickTexto('#asistente', 'Matrimonio y ceremonia')`)
  await dormir(500)
  await cdp.eval(`window.__clickTexto('#asistente', 'Sonido e iluminación')`)
  await dormir(500)
  await irA('#asistente')
  await capturar('08-asistente-paso3')

  /* ---------- Paso 4: datos y confirmación ---------- */
  await cdp.eval(`window.__clickTexto('#asistente', 'Siguiente')`)
  await dormir(1200)
  await cdp.eval(`window.__setValor('#nombre', 'Felipe Figueroa')`)
  await cdp.eval(`window.__setValor('#telefono', '+56930784760')`)
  await cdp.eval(`window.__setValor('#direccion', 'Av. Providencia 1234, depto 56')`)
  await cdp.eval(`window.__setValor('#solicitudes', 'El Rey y Amor eterno para la entrada')`)
  await dormir(600)
  await irA('#asistente')
  await capturar('09-asistente-paso4')

  await cdp.eval(`document.querySelector('#asistente input[type=checkbox]')?.click()`)
  await dormir(400)
  const confirmado = await cdp.eval(`(() => {
    const b = [...document.querySelectorAll('#asistente button')].find((x) => /Confirmar reserva/.test(x.textContent));
    if (!b) return 'sin botón';
    b.click();
    return 'click';
  })()`)
  revisar('confirmar reserva', confirmado === 'click', String(confirmado))
  await dormir(2500)
  await irA('#asistente')
  await capturar('10-confirmacion')

  const reserva = await cdp.eval(`JSON.parse(localStorage.getItem('gd:reservas') || '[]')[0]`)
  revisar('reserva guardada en localStorage', Boolean(reserva?.codigo), JSON.stringify(reserva)?.slice(0, 200))
  console.log('   reserva:', reserva?.codigo, reserva?.fechaISO, reserva?.tipoShow, reserva?.total)
  revisar(
    'código visible en la confirmación',
    await cdp.eval(`document.body.innerText.includes(${JSON.stringify(reserva?.codigo || 'XXX')})`),
  )

  /* ---------- Resto de secciones ---------- */
  for (const [sel, nombre] of [
    ['#galeria', '11-galeria'],
    ['#presentaciones', '12-presentaciones'],
    ['#faq', '13-faq'],
  ]) {
    await irA(sel)
    await capturar(nombre)
  }

  /* ---------- Móvil ---------- */
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
  await cdp.send('Page.navigate', { url: URL_WEB })
  await dormir(5000)
  await capturar('14-movil-hero')
  await irA('#grupo')
  await capturar('15-movil-grupo')
  await irA('#agenda')
  await capturar('16-movil-agenda')
  await cdp.eval(`document.querySelector('#inicio')?.scrollIntoView()`)
  await dormir(800)
  await cdp.eval(`document.querySelector('header button[aria-label="Abrir menú"]')?.click()`)
  await dormir(900)
  await capturar('17-movil-menu')

  console.log('\n--- errores de consola ---')
  if (cdp.errores.length) cdp.errores.forEach((e) => console.log('✗', e.slice(0, 500)))
  else console.log('sin errores')

  ws.close()
  chrome.kill()
  console.log(`\n${fallos || cdp.errores.length ? '❌ hubo problemas' : '✅ todas las comprobaciones pasaron'}`)
  process.exit(fallos || cdp.errores.length ? 2 : 0)
}

main().catch((e) => {
  console.error('FALLÓ:', e.message)
  chrome.kill()
  process.exit(1)
})
