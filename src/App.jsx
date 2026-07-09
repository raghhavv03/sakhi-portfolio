import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import CaseStudy from './pages/CaseStudy'
import { useReducedMotion } from './lib/hooks'
import { EASE, DUR } from './lib/animations'

// Blank placeholder pages — the shell, tokens, and cursor are what we're
// confirming here. Real pages come next.
function Placeholder({ name }) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-content flex-col items-start justify-center px-6 py-section">
      <p className="text-sm font-normal text-text-muted">Placeholder</p>
      <h1 className="mt-2 text-3xl font-semibold">{name}</h1>
      <p className="mt-4 max-w-md text-base font-normal leading-body text-text-muted">
        This page is intentionally blank. We're confirming the shell, design
        tokens, header, footer, and custom cursor before building the page
        content.
      </p>
    </section>
  )
}

// Reset scroll on every route change.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Cross-route fade: the incoming page fades in and rises 8px. Enter-only —
// exit animations (AnimatePresence mode="wait") can block navigation when the
// main thread is busy, so the swap itself stays instant and only the arrival
// is softened. Keyed by pathname; the first paint of a session is untouched
// because Framer runs `initial` → `animate` on mount immediately.
function AnimatedRoutes() {
  const location = useLocation()
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      key={location.pathname}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.page, ease: EASE }}
    >
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<Placeholder name="Not found" />} />
      </Routes>
    </motion.div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Cursor />
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-20">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  )
}
