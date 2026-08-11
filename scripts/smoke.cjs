const puppeteer = require('puppeteer-core')
const { spawn } = require('child_process')
const path = require('path')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT = 'C:\\Users\\LOQ\\AppData\\Local\\Temp\\opencode\\shots'

async function main() {
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4173', '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
  })
  await new Promise((r) => setTimeout(r, 2500))

  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
    defaultViewport: { width: 1440, height: 900 },
  })

  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
  page.on('requestfailed', (r) => errors.push(`[requestfailed] ${r.url()} :: ${r.failure()?.errorText}`))

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 2600))
  await page.screenshot({ path: path.join(OUT, '01-hero.png') })

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight * 0.22)
  })
  await new Promise((r) => setTimeout(r, 2200))
  await page.screenshot({ path: path.join(OUT, '02-about.png') })

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight * 0.38)
  })
  await new Promise((r) => setTimeout(r, 2200))
  await page.screenshot({ path: path.join(OUT, '03-skills.png') })

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight * 0.55)
  })
  await new Promise((r) => setTimeout(r, 2200))
  await page.screenshot({ path: path.join(OUT, '04-projects.png') })

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight * 0.82)
  })
  await new Promise((r) => setTimeout(r, 2200))
  await page.screenshot({ path: path.join(OUT, '05-contact.png') })

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page.reload({ waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 2800))
  await page.screenshot({ path: path.join(OUT, '06-mobile-hero.png') })
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight * 0.35)
  })
  await new Promise((r) => setTimeout(r, 2000))
  await page.screenshot({ path: path.join(OUT, '07-mobile-mid.png') })

  const webgl = await page.evaluate(() => {
    try {
      const c = document.createElement('canvas')
      return !!c.getContext('webgl2')
    } catch {
      return false
    }
  })

  console.log('WEBGL:', webgl)
  console.log('ERRORS:', errors.length ? JSON.stringify(errors, null, 2) : 'none')

  await browser.close()
  server.kill()
}

main().catch((e) => {
  console.error('FATAL', e)
  process.exit(1)
})
