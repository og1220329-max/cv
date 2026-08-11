const puppeteer = require('puppeteer-core')
const { spawn } = require('child_process')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const checks = []

function check(name, ok, extra = '') {
  checks.push({ name, ok, extra })
}

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
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle2', timeout: 60000 })

  // During loader
  const loaderShown = await page.evaluate(() => !!document.querySelector('.loader'))
  check('loader visible initially', loaderShown)

  await page.waitForFunction(() => !document.querySelector('.loader'), { timeout: 12000 }).catch(() => {})
  const loaderGone = await page.evaluate(() => !document.querySelector('.loader'))
  check('loader gone after ~3s', loaderGone)

  const state = await page.evaluate(() => {
    const q = (s) => document.querySelector(s)
    const heroTitle = q('.hero-title')
    const heroStyle = heroTitle ? getComputedStyle(heroTitle) : null
    return {
      canvases: document.querySelectorAll('canvas').length,
      heroOpacity: heroStyle ? heroStyle.opacity : null,
      navVisible: getComputedStyle(q('.nav')).opacity,
      navPos: q('.nav') ? q('.nav').getBoundingClientRect().top : null,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      cursor: !!q('.cursor'),
      sections: ['home', 'about', 'skills', 'projects', 'experience', 'code', 'design', 'contact'].map(
        (id) => {
          const el = document.getElementById(id)
          return el ? { id, h: Math.round(el.getBoundingClientRect().height) } : null
        }
      ),
    }
  })
  check('bg canvas + globe + orb rendered', state.canvases >= 3, `canvases=${state.canvases}`)
  check('hero title visible', state.heroOpacity === '1', `opacity=${state.heroOpacity}`)
  check('nav visible', Number(state.navVisible) > 0)
  check('no horizontal overflow', state.overflowX <= 0, `overflow=${state.overflowX}`)
  check('page has scrollable height', state.scrollHeight > 6000, `h=${state.scrollHeight}`)
  check('custom cursor present (desktop)', state.cursor)
  state.sections.forEach((s) => {
    check(`section #${s.id} has height`, s && s.h > 300, s ? `h=${s.h}` : 'MISSING')
  })

  // skill cards orbit positions (desktop)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.38))
  await new Promise((r) => setTimeout(r, 1800))
  const skillPos = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.skill-card')]
    const rects = cards.map((c) => {
      const r = c.getBoundingClientRect()
      return Math.round(r.left + r.width / 2)
    })
    return { count: cards.length, uniqueCenters: new Set(rects).size, first: rects[0] }
  })
  check('10 skill cards', skillPos.count === 10, `count=${skillPos.count}`)
  check('skill cards distributed in orbit', skillPos.uniqueCenters > 3, `unique=${skillPos.uniqueCenters}`)

  // mobile checks
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page.reload({ waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 3200))
  const mobileState = await page.evaluate(() => {
    const q = (s) => document.querySelector(s)
    return {
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      cursor: !!q('.cursor'),
      burger: getComputedStyle(q('.nav-burger')).display,
      navLinks: getComputedStyle(q('.nav-links')).display,
      skillGrid: getComputedStyle(q('.skills-orbit')).display,
      canvases: document.querySelectorAll('canvas').length,
    }
  })
  check('mobile: no horizontal overflow', mobileState.overflowX <= 0, `overflow=${mobileState.overflowX}`)
  check('mobile: custom cursor hidden', !mobileState.cursor)
  check('mobile: burger shown', mobileState.burger !== 'none', mobileState.burger)
  check('mobile: nav links hidden', mobileState.navLinks === 'none', mobileState.navLinks)
  check('mobile: skills stacked grid', mobileState.skillGrid === 'grid', mobileState.skillGrid)
  check('mobile: 3D canvases reduced (no orb)', mobileState.canvases <= 2, `canvases=${mobileState.canvases}`)

  console.log('\n==== RESULT ====')
  let fail = 0
  checks.forEach((c) => {
    const mark = c.ok ? 'PASS' : 'FAIL'
    if (!c.ok) fail++
    console.log(`${mark}  ${c.name}${c.extra ? '  [' + c.extra + ']' : ''}`)
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
