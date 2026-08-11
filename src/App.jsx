import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SmoothScrollProvider } from './lib/scroll'
import Loader from './components/Loader'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'
import CodeSection from './components/sections/CodeSection'
import DesignShowcase from './components/sections/DesignShowcase'
import Contact from './components/sections/Contact'
import Footer from './components/sections/Footer'

const HeroScene = lazy(() => import('./components/three/HeroScene'))

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('no-scroll', !loaded)
  }, [loaded])

  return (
    <SmoothScrollProvider>
      <AnimatePresence>
        {!loaded && <Loader key="loader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      <CustomCursor />

      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <Navbar visible={loaded} />

      <main>
        <Hero ready={loaded} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <CodeSection />
        <DesignShowcase />
        <Contact />
      </main>

      <Footer />
    </SmoothScrollProvider>
  )
}
