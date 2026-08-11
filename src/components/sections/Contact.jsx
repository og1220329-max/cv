import { useState } from 'react'
import { motion } from 'framer-motion'
import { INFO } from '../../data'
import Magnetic from '../Magnetic'
import { Mail, Whatsapp, Linkedin, ArrowUpRight } from '../Icons'
import { useInViewOnce } from '../../lib/hooks'

const EASE = [0.22, 1, 0.36, 1]

function Words({ text, inView, delay = 0 }) {
  const words = text.split(' ')
  return (
    <span className="cta-words" aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="word" aria-hidden="true">
          <motion.span
            className="word-inner"
            initial={{ y: '115%' }}
            animate={inView ? { y: '0%' } : {}}
            transition={{ duration: 0.95, delay: delay + i * 0.09, ease: EASE }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export default function Contact() {
  const [ref, inView] = useInViewOnce({ threshold: 0.25 })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name || 'a visitor'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `mailto:${INFO.email}?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="contact-head">
        <p className="contact-kicker mono">READY WHEN YOU ARE</p>
        <h2 className="contact-title">
          <Words text="LET'S BUILD" inView={inView} />
          <br />
          <Words text="SOMETHING GREAT." inView={inView} delay={0.35} />
        </h2>
        <motion.p
          className="contact-sub"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.7, ease: EASE }}
        >
          Have an idea, project, or opportunity? Let's turn it into something remarkable.
        </motion.p>

        <motion.div
          className="contact-actions"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
        >
          <Magnetic>
            <a className="btn btn-primary" href={`mailto:${INFO.email}`} data-cursor="SEND">
              EMAIL ME <Mail />
            </a>
          </Magnetic>
          <Magnetic>
            <a className="btn btn-ghost" href={`https://wa.me/${INFO.whatsapp}`} target="_blank" rel="noreferrer" data-cursor="CHAT">
              WHATSAPP <Whatsapp />
            </a>
          </Magnetic>
          <Magnetic>
            <a className="btn btn-ghost" href={INFO.linkedin} target="_blank" rel="noreferrer" data-cursor="CONNECT">
              LINKEDIN <Linkedin />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.form
        className="contact-form glass"
        onSubmit={submit}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1.05, ease: EASE }}
      >
        <span className="form-sign mono">OMAR ABDELMONEM</span>
        <label className="field">
          <span className="field-label mono">NAME</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={update('name')}
            placeholder="Your name"
            autoComplete="name"
          />
        </label>
        <label className="field">
          <span className="field-label mono">EMAIL</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </label>
        <label className="field">
          <span className="field-label mono">MESSAGE</span>
          <textarea
            required
            rows="4"
            value={form.message}
            onChange={update('message')}
            placeholder="Tell me about your idea..."
          />
        </label>
        <button type="submit" className="btn btn-primary form-submit" data-cursor="SEND">
          {sent ? 'THANK YOU — CHECK YOUR MAIL APP' : 'SEND MESSAGE'} <ArrowUpRight />
        </button>
      </motion.form>
    </section>
  )
}
