import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../SectionHeading'
import { INFO } from '../../data'
import { useInViewOnce } from '../../lib/hooks'

const Globe = lazy(() => import('../three/Globe'))

const EASE = [0.22, 1, 0.36, 1]

const FACTS = [
  { k: 'AGE', v: '18' },
  { k: 'LOCATION', v: 'Egypt' },
  { k: 'EDUCATION', v: 'Computer Science' },
  { k: 'UNIVERSITY', v: 'MUST' },
]

function FactCard({ k, v, i }) {
  const [ref, inView] = useInViewOnce({ threshold: 0.3 })
  return (
    <motion.div
      ref={ref}
      className="fact-card glass"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
    >
      <span className="fact-key mono">{k}</span>
      <span className="fact-value">{v}</span>
    </motion.div>
  )
}

export default function About() {
  const [ref, inView] = useInViewOnce({ threshold: 0.25 })
  const [globeRef, globeIn] = useInViewOnce({ threshold: 0.2 })

  return (
    <section className="section about" id="about">
      <SectionHeading index="01" label="WHO I AM" title="ABOUT ME" />
      <div className="about-grid">
        <motion.div
          ref={ref}
          className="about-copy"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
        >
          <p className="about-lead">
            I'm <em>Omar Abdelmonem</em>, a Computer Science student and creative developer with a
            strong interest in building modern digital experiences.
          </p>
          <p className="about-text">
            I combine programming, web development, and graphic design to create websites and digital
            products that are both functional and visually impressive.
          </p>
          <div className="about-cta mono" data-cursor="">
            <span className="cta-dash">—</span> OPEN TO FREELANCE & COLLABORATIONS
          </div>
        </motion.div>

        <motion.div
          ref={globeRef}
          className="about-globe"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={globeIn ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <Suspense fallback={null}>
            <Globe />
          </Suspense>
          <div className="globe-badge glass mono">
            <span className="globe-dot" />
            {INFO.location} · {INFO.age} Y/O
          </div>
        </motion.div>
      </div>
      <div className="facts-grid">
        {FACTS.map((f, i) => (
          <FactCard key={f.k} k={f.k} v={f.v} i={i} />
        ))}
      </div>
    </section>
  )
}
