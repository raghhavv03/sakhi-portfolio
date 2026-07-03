import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { nav, links } from '../data/portfolio'
import Button from './Button'
import { useReducedMotion } from '../lib/hooks'

// Global header. Transparent over the home hero; gains a subtle solid
// background elsewhere and once the page is scrolled. Collapses to a hamburger
// panel below 768px.
export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const blurTarget = (e) => {
    e.currentTarget.blur()
  }

  const goToPage = (path) => (e) => {
    setMenuOpen(false)
    if (location.pathname === path) {
      e.preventDefault()
      scrollToTop()
    }
    blurTarget(e)
  }

  const goHome = (e) => {
    setMenuOpen(false)
    if (isHome) {
      e.preventDefault()
      scrollToTop()
    }
    blurTarget(e)
  }

  // "Work" isn't its own route — it scrolls to the #work section on the home
  // page. Already home → scroll directly; elsewhere → navigate to "/#work"
  // and Home's own mount effect finishes the scroll once it renders.
  const goToWork = () => {
    if (isHome) {
      document
        .getElementById('work')
        ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
    } else {
      navigate('/#work')
    }
    setMenuOpen(false)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  // Insert a "Work" item right after "Home" in the shared nav data, without
  // mutating it (Footer reads the same array and must be unaffected).
  const homeIndex = nav.findIndex((item) => item.to === '/')
  const navWithWork = [
    ...nav.slice(0, homeIndex + 1),
    { label: 'Work', isWork: true },
    ...nav.slice(homeIndex + 1),
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile panel on route change.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm transition-colors duration-200 min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2 ${
      isActive
        ? 'font-semibold text-text'
        : 'font-normal text-text-muted hover:text-text'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `flex min-h-[44px] items-center rounded-xl px-4 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2 ${
      isActive
        ? 'font-semibold text-text'
        : 'font-normal text-text-muted hover:text-text'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'border-b border-border bg-bg/80 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        {/* Logo — accessible name lives on the link itself; the image is
            decorative (alt="") so it isn't announced a second time. */}
        <Link
          to="/"
          onClick={goHome}
          className="inline-flex min-h-[44px] items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
          aria-label="Sakhi Rana — home"
        >
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            width="261"
            height="67"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navWithWork.map((item) =>
            item.isWork ? (
              <button
                key="work"
                type="button"
                onClick={goToWork}
                className={navLinkClass({ isActive: false })}
              >
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={navLinkClass}
                onClick={goToPage(item.to)}
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Desktop right-side actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="secondary"
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </Button>
          <Button
            variant="primary"
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-text transition-transform duration-200 ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 bg-text transition-opacity duration-200 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 bg-text transition-transform duration-200 ${
                menuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile full-width panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="border-b border-border bg-bg md:hidden"
          >
            <nav
              className="mx-auto flex max-w-content flex-col gap-1 px-6 py-4"
              aria-label="Mobile"
            >
              {navWithWork.map((item) =>
                item.isWork ? (
                  <button
                    key="work"
                    type="button"
                    onClick={goToWork}
                    className={mobileNavLinkClass({ isActive: false })}
                  >
                    {item.label}
                  </button>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    className={mobileNavLinkClass}
                    onClick={goToPage(item.to)}
                  >
                    {item.label}
                  </NavLink>
                )
              )}
              <a
                href={links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center rounded-xl px-4 text-base font-normal text-text-muted hover:text-text"
              >
                Resume
              </a>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center rounded-xl px-4 text-base font-normal text-text-muted hover:text-text"
              >
                LinkedIn
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
