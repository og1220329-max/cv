import { useEffect, useRef, useState } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    setMatches(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 820px)')
export const useIsTouch = () => useMediaQuery('(pointer: coarse)')

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useCanvasInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, inView]
}

export function useInViewOnce(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: options.threshold ?? 0.2, rootMargin: options.rootMargin ?? '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, inView]
}

export function useScrollSpy(ids) {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-38% 0px -55% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}
