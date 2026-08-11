import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    const start = performance.now()
    const DURATION = 1900
    let raf
    let fontsReady = false

    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        const finish = () => {
          if (doneRef.current) return
          doneRef.current = true
          setTimeout(onDone, 250)
        }
        if (fontsReady) finish()
        else document.fonts?.ready.then(finish).catch(finish)
      }
    }
    raf = requestAnimationFrame(tick)
    document.fonts?.ready.then(() => {
      fontsReady = true
    }).catch(() => {})
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  const pct = String(progress).padStart(2, '0')

  return (
    <motion.div
      className="loader"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      initial={false}
    >
      <div className="loader-inner">
        <div className="loader-word">
          {'OMAR.'.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
        </div>
        <div className="loader-track">
          <motion.div
            className="loader-fill"
            style={{ scaleX: progress / 100 }}
          />
        </div>
      </div>
      <div className="loader-meta">
        <span>LOADING EXPERIENCE</span>
        <span className="loader-pct">{pct}%</span>
      </div>
    </motion.div>
  )
}
