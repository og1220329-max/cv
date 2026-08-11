const puppeteer = require('puppeteer-core')
const { spawn } = require('child_process')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT = 'C:\\Users\\LOQ\\AppData\\Local\\Temp\\opencode\\shots'
const path = require('path')

const checks = []
const check = (name, ok, extra = '') => checks.push({ name, ok, extra })

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
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle2', timeout: 60000 })
  await page.waitForFunction(() => !document.querySelector('.loader'), { timeout: 12000 })

  // Nav click scrolls
  await page.evaluate(() => {
    document.querySelectorAll('.nav-link')[1].click()
  })
  await new Promise((r) => setTimeout(r, 1800))
  const scrolled = await page.evaluate(() => window.scrollY)
  check('nav link scrolls to about', scrolled > 600, `scrollY=${Math.round(scrolled)}`)

  // Cursor label on hover over project card
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight * 0.5)
  })
  await new Promise((r) => setTimeout(r, 1400))
  const label = await page.evaluate(async () => {
    const card = document.querySelector('.project-card')
    const rect = card.getBoundingClientRect()
    const e = new MouseEvent('mousemove', {
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      bubbles: true,
    })
    card.dispatchEvent(e)
    await new Promise((r) => setTimeout(r, 150))
    const cursor = document.querySelector('.cursor')
    return { active: cursor.classList.contains('is-active'), label: cursor.querySelector('.cursor-label').textContent }
  })
  check('cursor activates with label on project card', label.active && label.label === 'VIEW', JSON.stringify(label))

  // Skill hover reveals description
  const skillHover = await page.evaluate(() => {
    const card = document.querySelectorAll('.skill-card')[0]
    card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    return card.querySelector('.skill-desc').textContent
  })
  check('skill card hover shows description', skillHover.length > 5, skillHover)

  // Mobile menu
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page.reload({ waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.loader'), { timeout: 12000 })
  await page.evaluate(() => document.querySelector('.nav-burger').click())
  await new Promise((r) => setTimeout(r, 900))
  const overlayOpen = await page.evaluate(() => {
    const o = document.querySelector('.nav-overlay')
    return !!o && getComputedStyle(o).transform.includes('matrix(1') === false
  })
  const overlayShown = await page.evaluate(() => !!document.querySelector('.nav-overlay-links') && document.querySelectorAll('.nav-overlay-link').length === 6)
  check('mobile menu overlay opens with 6 links', overlayShown, `links=6 transform-cleanup=${overlayOpen}`)
  await page.screenshot({ path: path.join(OUT, '08-mobile-menu.png') })

  // Close menu via link click
  await page.evaluate(() => document.querySelectorAll('.nav-overlay-link')[1].click())
  await new Promise((r) => setTimeout(r, 1600))
  const menuClosed = await page.evaluate(() => !document.querySelector('.nav-overlay'))
  check('menu closes after link click', menuClosed)

  // Reduced motion — no errors, page still renders
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.setViewport({ width: 1440, height: 900 })
  await page.reload({ waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.loader'), { timeout: 12000 })
  await new Promise((r) => setTimeout(r, 800))
  const reducedOk = await page.evaluate(() => {
    const title = document.querySelector('.hero-title')
    return !!title && title.getBoundingClientRect().height > 50
  })
  check('reduced-motion: hero renders', reducedOk)
  await page.screenshot({ path: path.join(OUT, '09-final-hero.png') })

  console.log('\n==== INTERACTION RESULT ====')
  let fail = 0
  checks.forEach((c) => {
    if (!c.ok) fail++
    console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}${c.extra ? '  [' + c.extra + ']' : ''}`)
  })
  console.log(`\n${checks.length - fail}/${checks.length} passed | runtime errors: ${errors.length}`)
  errors.slice(0, 5).forEach((e) => console.log('  ERR:', e))

  await browser.close()
  server.kill()
  process.exit(fail ? 1 : 0)
}

main().catch((e) => {
  console.error('FATAL', e)
  process.exit(1)
})