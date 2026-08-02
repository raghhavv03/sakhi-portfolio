import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import ThemeProvider from './components/ThemeProvider'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Badge from './components/Badge'
import Button from './components/Button'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import CaseStudy from './pages/CaseStudy'
import { useReducedMotion } from './lib/hooks'
import { EASE, DUR } from './lib/animations'

// Anything that isn't a route. It opens with type, so it clears the floating
// nav the same way About and Contact do.
function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-content flex-col items-start justify-center px-6 pb-section-sm pt-nav-clear md:pb-section-md lg:pb-section">
      <Badge>404</Badge>
      <h1 className="mt-5 text-h1 font-semibold text-text">Page not found</h1>
      <p className="mt-4 max-w-md text-body font-normal text-text-muted">
        That page doesn't exist. The work, the story behind it, and a way to
        reach me are all still here.
      </p>
      <Button to="/" className="mt-8">
        Back to home
      </Button>
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </motion.div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-bg text-text-muted">
        <Cursor />
        <ScrollToTop />
        <Header />
        {/* No top padding: the nav floats, so the page starts at the top of
            the viewport and runs under it. Sections that open with type carry
            their own `pt-nav-clear`. */}
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
