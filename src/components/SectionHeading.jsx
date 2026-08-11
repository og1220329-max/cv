import { motion } from 'framer-motion'
import { useInViewOnce } from '../lib/hooks'

function Words({ text, ...props }) {
  const words = text.split(' ')
  return (
    <motion.span
      {...props}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
      }}
    >
      {words.map((w, i) => (
        <span key={i} className="word" aria-hidden="true">
          <motion.span
            className="word-inner"
            variants={{
              hidden: { y: '110%', rotate: 4 },
              show: { y: '0%', rotate: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

export default function SectionHeading({ index, label, title, align = 'left' }) {
  const [ref, inView] = useInViewOnce()
  return (
    <div className={`section-head ${align === 'center' ? 'is-center' : ''}`} ref={ref}>
      <motion.div
        className="head-meta"
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <span className="head-index">{index}</span>
        <span className="head-line" />
        <span className="head-label">{label}</span>
      </motion.div>
      <h2 className="head-title">
        <Words
          text={title}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        />
      </h2>
    </div>
  )
}
