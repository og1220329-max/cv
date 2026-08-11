import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsTouch } from '../lib/hooks'

export default function Magnetic({ children, strength = 0.32, className = '' }) {
  const ref = useRef(null)
  const touch = useIsTouch()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 })

  const onMove = (e) => {
    if (touch) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={`magnetic ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.span>
  )
}
