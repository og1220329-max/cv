import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../SectionHeading'
import { SKILLS } from '../../data'
import { SkillIcon } from '../Icons'
import { useIsMobile, useInViewOnce } from '../../lib/hooks'

const Orb = lazy(() => import('../three/Orb'))

const EASE = [0.22, 1, 0.36, 1]

export default function Skills() {
  const mobile = useIsMobile()
  const [ref, inView] = useInViewOnce({ threshold: 0.15 })
  const [hovered, setHovered] = useState(null)

  return (
    <section className="section skills" id="skills">
      <SectionHeading index="02" label="CAPABILITIES" title="SKILLS" />
      <p className="section-intro">
        A toolset spanning engineering and design — hover the cards to inspect.
      </p>

      <div className="skills-stage" ref={ref}>
        {!mobile && (
          <Suspense fallback={null}>
            <Orb />
          </Suspense>
        )}
        {!mobile && <div className="orb-halo" />}

        <div className="skills-orbit">
          {SKILLS.map((s, i) => {
            const angle = (i / SKILLS.length) * Math.PI * 2
            return (
              <div
                key={s.name}
                className="skill-slot"
                style={mobile ? undefined : { '--a': `${angle}rad` }}
              >
                <motion.div
                  className={`skill-card glass ${hovered === i ? 'is-hovered' : ''}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.05 * i, ease: EASE }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  data-cursor="EXPLORE"
                >
                  <SkillIcon name={s.icon} />
                  <div className="skill-info">
                    <span className="skill-name">{s.name}</span>
                    <span className="skill-desc">{hovered === i ? s.desc : `${s.level}% proficiency`}</span>
                  </div>
                  <span className="skill-pct mono">{String(s.level).padStart(2, '0')}</span>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
