import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import SectionHeading from '../SectionHeading'
import { EXPERIENCE } from '../../data'
import { useInViewOnce } from '../../lib/hooks'

const EASE = [0.22, 1, 0.36, 1]

function TimelineItem({ e, i }) {
  const [ref, inView] = useInViewOnce({ threshold: 0.3 })
  return (
    <motion.div
      ref={ref}
      className="tl-item"
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="tl-dot-wrap">
        <span className="tl-dot" />
        <span className="tl-dot-glow" />
      </div>
      <div className="tl-body">
        <span className="tl-period mono">{e.period}</span>
        <h3 className="tl-role">{e.role}</h3>
        <span className="tl-org mono">{e.org}</span>
        <p className="tl-desc">{e.desc}</p>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.45'] })
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section className="section experience" id="experience">
      <SectionHeading index="04" label="JOURNEY" title="EXPERIENCE" />
      <div className="timeline" ref={ref}>
        <motion.div className="tl-line" style={{ scaleY: lineScale }} />
        {EXPERIENCE.map((e, i) => (
          <TimelineItem key={e.role} e={e} i={i} />
        ))}
      </div>
    </section>
  )
}
