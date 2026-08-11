import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSmoothScroll } from '../../lib/scroll'
import { INFO } from '../../data'
import Magnetic from '../Magnetic'
import { ArrowUpRight } from '../Icons'
import { usePrefersReducedMotion } from '../../lib/hooks'

const EASE = [0.22, 1, 0.36, 1]

function downloadCV() {
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const W = doc.internal.pageSize.getWidth()
    let y = 90

    doc.setFillColor(10, 13, 25)
    doc.rect(0, 0, W, doc.internal.pageSize.getHeight(), 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.text('OMAR ABDELMONEM', 50, y)
    y += 26

    doc.setFontSize(11)
    doc.setTextColor(110, 140, 255)
    doc.text('COMPUTER SCIENCE STUDENT / DEVELOPER / GRAPHIC DESIGNER', 50, y)
    y += 18

    doc.setFontSize(9.5)
    doc.setTextColor(160, 170, 195)
    doc.text(`${INFO.email}  |  Egypt  |  ${INFO.linkedin}`, 50, y)
    y += 34

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('PROFILE', 50, y)
    doc.setDrawColor(79, 124, 255)
    doc.line(50, y + 6, W - 50, y + 6)
    y += 22
    doc.setFontSize(10)
    doc.setTextColor(200, 208, 228)
    const profile = "Computer Science student and creative developer who combines programming, web development and graphic design to build digital products that are functional and visually impressive."
    const lines = doc.splitTextToSize(profile, W - 100)
    doc.text(lines, 50, y)
    y += lines.length * 14 + 24

    const section = (title) => {
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.text(title, 50, y)
      doc.setDrawColor(79, 124, 255)
      doc.line(50, y + 6, W - 50, y + 6)
      y += 22
    }
    const entry = (left, right, sub) => {
      doc.setTextColor(240, 243, 255)
      doc.setFontSize(10.5)
      doc.text(left, 50, y)
      doc.setFontSize(9)
      doc.setTextColor(110, 140, 255)
      doc.text(right, W - 50, y, { align: 'right' })
      y += 15
      if (sub) {
        doc.setTextColor(160, 170, 195)
        doc.setFontSize(9.5)
        const subLines = doc.splitTextToSize(sub, W - 100)
        doc.text(subLines, 50, y)
        y += subLines.length * 13 + 12
      }
    }

    section('EXPERIENCE')
    entry('Freelance Graphic Designer', '2024 — PRESENT', 'Branding, social media and advertising visuals for startups and small businesses.')
    entry('Creative Web Developer', '2024 — PRESENT', 'Interactive websites built with React, Three.js and WebGL.')
    entry('Personal Projects', '2023 — PRESENT', 'Ongoing exploration of UI, 3D scenes and design systems.')

    section('SKILLS')
    doc.setFontSize(10)
    doc.setTextColor(200, 208, 228)
    const skills = 'React - JavaScript - Node.js - Python - HTML5 - CSS - Excel - Graphic Design - UI/UX Design - Web Design'
    const skLines = doc.splitTextToSize(skills, W - 100)
    doc.text(skLines, 50, y)
    y += skLines.length * 14 + 24

    section('EDUCATION')
    entry('Computer Science', '2023 — 2027', 'Misr University for Science and Technology (MUST), Egypt.')
    y += 20

    doc.setTextColor(90, 100, 130)
    doc.setFontSize(8.5)
    doc.text('Portfolio: ' + INFO.linkedin, 50, doc.internal.pageSize.getHeight() - 50)

    doc.save('Omar-Abdelmonem-CV.pdf')
  })
}

export default function Hero({ ready }) {
  const { scrollTo } = useSmoothScroll()
  const reduced = usePrefersReducedMotion()
  const [hoverLine, setHoverLine] = useState(0)

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: ready ? 0.15 : 0.4 } },
  }
  const item = {
    hidden: { opacity: 0, y: 34 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
  }

  return (
    <section className="hero" id="home">
      <div className="hero-shade" />
      <motion.div
        className="hero-inner"
        variants={container}
        initial="hidden"
        animate={ready ? 'show' : 'hidden'}
      >
        <motion.p className="hero-tag mono" variants={item}>
          PORTFOLIO — 2026 <span className="dot-live" />
        </motion.p>

        <h1 className="hero-title">
          <motion.span variants={item} className="hero-line" aria-hidden="true">
            {'OMAR'.split('').map((ch, i) => (
              <motion.span
                key={i}
                className="hero-ch"
                initial={{ y: '115%', opacity: 0 }}
                animate={ready ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 1.1, delay: 0.25 + i * 0.07, ease: EASE }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
          <motion.span variants={item} className="hero-line hero-line-outline" aria-hidden="true">
            {'ABDELMONEM'.split('').map((ch, i) => (
              <motion.span
                key={i}
                className="hero-ch"
                initial={{ y: '115%', opacity: 0 }}
                animate={ready ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 1.1, delay: 0.75 + i * 0.035, ease: EASE }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        <motion.p className="hero-roles mono" variants={item}>
          COMPUTER SCIENCE STUDENT&nbsp;&nbsp;•&nbsp;&nbsp;DEVELOPER&nbsp;&nbsp;•&nbsp;&nbsp;GRAPHIC DESIGNER
        </motion.p>

        <motion.p className="hero-desc" variants={item}>
          Building digital experiences where technology meets creativity.
        </motion.p>

        <motion.div className="hero-actions" variants={item}>
          <Magnetic>
            <button
              className="btn btn-primary"
              data-cursor="GO"
              onClick={() => scrollTo('#projects', -40)}
            >
              VIEW MY WORK <ArrowUpRight />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              className="btn btn-ghost"
              data-cursor="SAVE"
              onClick={downloadCV}
              onMouseEnter={() => setHoverLine(1)}
              onMouseLeave={() => setHoverLine(0)}
            >
              DOWNLOAD CV <span className="btn-line">{hoverLine === 1 ? 'PDF / ONE PAGE' : 'PDF'}</span>
            </button>
          </Magnetic>
        </motion.div>

        {!reduced && (
          <motion.button
            className="hero-scroll mono"
            variants={item}
            onClick={() => scrollTo('#about', -20)}
            data-cursor=""
          >
            SCROLL TO EXPLORE
            <span className="scroll-track"><span className="scroll-fill" /></span>
          </motion.button>
        )}
      </motion.div>
    </section>
  )
}
