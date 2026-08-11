import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import SectionHeading from '../SectionHeading'
import { PROJECTS } from '../../data'
import { ArrowUpRight } from '../Icons'
import { useInViewOnce } from '../../lib/hooks'

const EASE = [0.22, 1, 0.36, 1]

function Art({ variant, accent }) {
  return <div className={`art art-${variant}`} style={{ '--accent': accent }} />
}

function ProjectCard({ p, i }) {
  const [ref, inView] = useInViewOnce({ threshold: 0.15 })
  const cardRef = useRef(null)
  const [hovering, setHovering] = useState(false)

  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 })
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 })

  const onMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    rx.set(-py * 7)
    ry.set(px * 9)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    setHovering(false)
  }

  return (
    <motion.article
      ref={(el) => {
        ref.current = el
        cardRef.current = el
      }}
      className="project-card"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100, ['--accent' ]: p.accent }}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: (i % 2) * 0.12, ease: EASE }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={onLeave}
      data-cursor="VIEW"
    >
      <div className="project-art">
        <div className="art-zoom">
          <Art variant={p.art} accent={p.accent} />
        </div>
        <span className="project-index mono">{String(i + 1).padStart(2, '0')}</span>
        <span className="project-cat mono">{p.category}</span>
        <div className="project-shine" />
      </div>
      <div className="project-body">
        <h3 className="project-title">{p.title}</h3>
        <p className="project-desc">{p.desc}</p>
        <div className="project-tech mono">
          {p.tech.map((t) => (
            <span key={t} className="tech-chip">{t}</span>
          ))}
        </div>
        <span className={`project-link ${hovering ? 'is-on' : ''}`}>
          VIEW PROJECT <ArrowUpRight />
        </span>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  return (
    <section className="section projects" id="projects">
      <SectionHeading index="03" label="PORTFOLIO" title="SELECTED WORK" />
      <p className="section-intro">
        A curated selection of web, design and creative experiments.
      </p>
      <div className="projects-grid">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} p={p} i={i} />
        ))}
      </div>
    </section>
  )
}
