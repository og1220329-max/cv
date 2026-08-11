import { motion } from 'framer-motion'
import { INFO } from '../../data'
import { Github, Linkedin, Behance, Whatsapp } from '../Icons'
import { useSmoothScroll } from '../../lib/scroll'

export default function Footer() {
  const { scrollTo } = useSmoothScroll()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-main">
        <span className="footer-logo">OMAR<span className="footer-dot">.</span></span>
        <nav className="footer-links mono" aria-label="Footer">
          {['HOME', 'ABOUT', 'SKILLS', 'PROJECTS', 'EXPERIENCE', 'CONTACT'].map((l, i) => (
            <button key={l} onClick={() => scrollTo(`#${l.toLowerCase()}`)} data-cursor="">
              {l}
            </button>
          ))}
        </nav>
        <div className="footer-social">
          <a href={INFO.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor=""><Github /></a>
          <a href={INFO.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor=""><Linkedin /></a>
          <a href={INFO.behance} target="_blank" rel="noreferrer" aria-label="Behance" data-cursor=""><Behance /></a>
          <a href={`https://wa.me/${INFO.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" data-cursor=""><Whatsapp /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="mono">© {year} Omar Abdelmonem. All rights reserved.</span>
        <button className="footer-top mono" onClick={() => scrollTo(0)} data-cursor="UP">
          BACK TO TOP <span className="footer-up">↑</span>
        </button>
      </div>
    </footer>
  )
}
