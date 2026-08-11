import { useEffect, useRef, useState } from 'react'
import { useIsTouch, usePrefersReducedMotion } from '../lib/hooks'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)
  const touch = useIsTouch()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (touch || reduced) return undefined
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return undefined

    let mx = -100, my = -100
    let rx = -100, ry = -100
    let raf

    const loop = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`
      ring.style.transform = `translate3d(${rx - 26}px, ${ry - 26}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      setVisible(true)
      const target = e.target.closest?.('[data-cursor], a, button, [role="button"], input, textarea, select')
      if (target) {
        const custom = target.getAttribute('data-cursor')
        const text = custom === '' || !custom ? 'OPEN' : custom
        setLabel(text)
        setActive(true)
      } else {
        setLabel('')
        setActive(false)
      }
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [touch, reduced])

  if (touch || reduced) return null

  return (
    <div className={`cursor ${visible ? 'is-visible' : ''} ${active ? 'is-active' : ''}`} aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-label">{label}</span>
      </div>
    </div>
  )
}
