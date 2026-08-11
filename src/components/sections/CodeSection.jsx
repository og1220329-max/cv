import { motion } from 'framer-motion'
import SectionHeading from '../SectionHeading'
import { CODE_LINES, TERMINAL_TAGS } from '../../data'
import { useInViewOnce } from '../../lib/hooks'

const EASE = [0.22, 1, 0.36, 1]

export default function CodeSection() {
  const [ref, inView] = useInViewOnce({ threshold: 0.25 })

  return (
    <section className="section code" id="code">
      <SectionHeading index="05" label="DEV WORKSPACE" title="CODE & TECHNOLOGY" />
      <p className="section-intro">Where engineering meets design — my daily workspace.</p>

      <div className="code-stage" ref={ref}>
        <div className="code-grid-bg" />
        <div className="terminal glass" data-cursor="VIEW">
          <div className="terminal-bar">
            <span className="term-dot" />
            <span className="term-dot" />
            <span className="term-dot" />
            <span className="term-title mono">abdelmonem — zsh</span>
          </div>
          <div className="terminal-body mono">
            {CODE_LINES.map((line, i) => (
              <motion.div
                key={i}
                className={`code-line ${line.type}`}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.35 + i * 0.22, ease: 'easeOut' }}
              >
                <span className="code-line-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="code-indent" style={{ width: line.indent * 18 }} />
                {line.type === 'cmd' ? (
                  <>
                    <span className="code-prompt">➜</span> {line.text}
                  </>
                ) : line.type === 'string' ? (
                  <span className="code-str">{line.text}</span>
                ) : line.type === 'empty' ? (
                  <span>&nbsp;</span>
                ) : (
                  <span className="code-src">{line.text}</span>
                )}
                {i === CODE_LINES.length - 1 && <span className="term-cursor" />}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="term-tags" aria-hidden="true">
          {TERMINAL_TAGS.map((t, i) => (
            <motion.span
              key={t}
              className="term-tag mono"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.15, ease: EASE }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
