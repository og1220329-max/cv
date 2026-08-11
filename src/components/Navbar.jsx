import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS } from '../data'
import { useSmoothScroll } from '../lib/scroll'
import { useScrollSpy } from '../lib/hooks'

const EASE = [0.76, 0, 0.24, 1]

export default function Navbar({ visible }) {
  const { scrollTo, lock } = useSmoothScroll()
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(NAV_LINKS.map((l) => l.id))

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 90)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    lock(open)
  }, [open, lock])

  const go = (href) => {
    setOpen(false)
    setTimeout(() => scrollTo(href, -64), open ? 350 : 0)
  }

  return (
    <>
      <motion.header
        className={`nav ${compact ? 'is-compact' : ''} ${visible ? 'is-visible' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: EASE, delay: 0.3 }}
      >
        <button className="nav-logo" onClick={() => go('#home')} data-cursor="">
          ABDELMONEM<span className="nav-logo-dot">.</span>
        </button>

        <nav className="nav-links mono" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              className={`nav-link ${active === l.id ? 'is-active' : ''}`}
              onClick={() => go(l.href)}
              data-cursor=""
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button className="nav-cta mono" onClick={() => go('#contact')} data-cursor="SAY HI">
          LET'S TALK
        </button>

        <button
          className={`nav-burger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          data-cursor=""
        >
          <span />
          <span />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-overlay"
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="nav-overlay-inner">
              <nav className="nav-overlay-links" aria-label="Mobile">
                {NAV_LINKS.map((l, i) => (
                  <motion.button
                    key={l.id}
                    className="nav-overlay-link"
                    initial={{ y: 70, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: EASE }}
                    onClick={() => go(l.href)}
                  >
                    <span className="mono overlay-idx">0{i + 1}</span>
                    {l.label}
                  </motion.button>
                ))}
              </nav>
              <motion.div
                className="nav-overlay-meta mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span>Omar Abdelmonem</span>
                <span>— 2026 Portfolio</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
