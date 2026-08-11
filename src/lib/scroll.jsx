import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { usePrefersReducedMotion } from './hooks'

export const scrollState = { y: 0, progress: 0, limit: 1 }

const SmoothScrollContext = createContext({ scrollTo: () => {} })
export const useSmoothScroll = () => useContext(SmoothScrollContext)

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) {
      setReady(true)
      return undefined
    }
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    lenisRef.current = lenis

    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onScroll = (e) => {
      scrollState.y = e.scroll
      scrollState.limit = e.limit || 1
      scrollState.progress = e.limit > 0 ? Math.min(1, e.scroll / e.limit) : 0
    }
    lenis.on('scroll', onScroll)

    const updateSize = () => lenis.resize()
    window.addEventListener('resize', updateSize)

    setReady(true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', updateSize)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const scrollTo = (target, offset = 0) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.5 })
    } else if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    }
  }

  const lock = (locked) => {
    if (lenisRef.current) {
      if (locked) lenisRef.current.stop()
      else lenisRef.current.start()
    }
    document.documentElement.classList.toggle('no-scroll', locked)
  }

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, lock, ready }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
