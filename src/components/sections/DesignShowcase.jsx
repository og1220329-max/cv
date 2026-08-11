import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SectionHeading from '../SectionHeading'
import { DESIGN_WORK } from '../../data'
import { useIsTouch } from '../../lib/hooks'

const EASE = [0.22, 1, 0.36, 1]

function Poster({ w, i }) {
  return (
    <div className={`poster poster-${w.hue}`} data-cursor="DRAG">
      <span className="poster-index mono">{String(i + 1).padStart(2, '0')}</span>
      <div className="poster-art" aria-hidden="true">
        <span className="poster-glyph">{String(i + 1).padStart(2, '0')}</span>
        <span className="poster-orbit" />
      </div>
      <h3 className="poster-title">{w.title}</h3>
      <p className="poster-tag mono">{w.tag}</p>
    </div>
  )
}

export default function DesignShowcase() {
  const touch = useIsTouch()
  const trackRef = useRef(null)
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-68%'])

  return (
    <section className="section design" id="design" ref={sectionRef}>
      <SectionHeading index="06" label="VISUAL WORK" title="DESIGN" />
      <p className="section-intro">
        {touch ? 'Swipe through the visual showcase.' : 'Drag through the visual showcase.'}
      </p>

      {touch ? (
        <div className="design-track design-track-touch" ref={trackRef}>
          {DESIGN_WORK.map((w, i) => (
            <Poster key={w.title} w={w} i={i} />
          ))}
        </div>
      ) : (
        <div className="design-viewport">
          <motion.div className="design-track" style={{ x }} ref={trackRef}>
            {DESIGN_WORK.map((w, i) => (
              <Poster key={w.title} w={w} i={i} />
            ))}
            <div className="poster poster-end">
              <span className="poster-end-title">MORE COMING SOON</span>
              <span className="mono">— the archive keeps growing —</span>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
