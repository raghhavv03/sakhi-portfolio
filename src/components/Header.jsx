import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { nav, links } from '../data/portfolio'
import Button from './Button'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useReducedMotion } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'
import { tapHaptic } from '../lib/haptics'

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
    tapHaptic()
    setMenuOpen(false)
    if (location.pathname === path) {
      e.preventDefault()
      scrollToTop()
    }
    blurTarget(e)
  }

  const goHome = (e) => {
    tapHaptic()
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
    tapHaptic()
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

  // Active nav item rises to the heading ink; everything else rests on the
  // body ink. Same two colours as the rest of the site — the only difference
  // between the desktop and mobile rows is the shape of their hit area.
  const navLinkClass = ({ isActive }) =>
    `relative rounded-full px-4 py-2 text-body-sm transition-colors duration-200 min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2 ${
      isActive
        ? 'font-semibold text-text'
        : 'font-normal text-text-muted hover:text-text'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `flex min-h-[44px] items-center rounded-xl px-4 text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2 ${
      isActive
        ? 'font-semibold text-text'
        : 'font-normal text-text-muted hover:text-text'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        transparent
          ? 'border-transparent bg-bg/70 backdrop-blur-md'
          : 'border-border bg-bg/80 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        {/* Logo — accessible name lives on the link itself; the mark is
            decorative (aria-hidden) so it isn't announced a second time. */}
        <Link
          to="/"
          onClick={goHome}
          className="inline-flex min-h-[44px] items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
          aria-label="Sakhi Rana — home"
        >
          {/* Inline SVG on `currentColor`, so the mark is the same ink as the
              nav links next to it and changes with the theme on its own. */}
          <Logo className="h-10 w-auto text-text" />
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
                {({ isActive }) => (
                  <>
                    {item.label}
                    {/* Active-page indicator — one shared layoutId, so the
                        underline slides between items on route change. */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-underline"
                        aria-hidden="true"
                        className="absolute inset-x-4 bottom-1.5 h-0.5 rounded-full bg-text"
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : { duration: DUR.page, ease: EASE }
                        }
                      />
                    )}
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* Desktop right-side actions — the toggle and both buttons carry the
            one shared CTA hover, so the three read as one row. */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Same switch the hero lamp is — one shared state, so the two can
              never show different things. */}
          <ThemeToggle />
          {links.resume && (
            <Button
              variant="secondary"
              href={links.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </Button>
          )}
          {links.linkedin && (
            <Button
              variant="primary"
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Button>
          )}
        </div>

        {/* Mobile actions — the theme toggle stays out of the panel so it is
            reachable without opening the menu. */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
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
              {links.resume && (
                <a
                  href={links.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={mobileNavLinkClass({ isActive: false })}
                >
                  Resume
                </a>
              )}
              {links.linkedin && (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={mobileNavLinkClass({ isActive: false })}
                >
                  LinkedIn
                </a>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
