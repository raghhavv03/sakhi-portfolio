import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { nav, links } from '../data/portfolio'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useNavCollapsed, useReducedMotion } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'
import { CTA_HOVER, FLOAT_SHELL, FLOAT_Y } from '../lib/interactions'
import { tapHaptic } from '../lib/haptics'

// Global header — three objects floating in one band near the top of the
// viewport rather than a bar pinned to its edge: a round logo capsule, the
// frosted nav pill carrying every destination, and the theme toggle. All three
// are cut from the same shell (`FLOAT_SHELL`), so they read as one row of
// glass, and the page runs underneath them.
//
// Scrolling down lifts the whole group out; scrolling back up returns it. On a
// case study the vacated spot is taken by the section rail — see
// casestudy/CaseStudyProgressNav, which reads the same `useNavCollapsed`.
//
// Below 860px the labels drop and the pill is glyphs only, which is what
// removes the need for a hamburger panel: every destination stays on screen at
// 360px. LinkedIn is not in this row — the pill carries destinations, and the
// footer's connect row already carries the profile.
//
// Only the theme toggle carries a `data-cursor`: every other control in the
// row already says in words or in its own mark where it goes, and a label
// pill repeating that is noise.
export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const collapsed = useNavCollapsed()
  // A collapsed nav is out of the way, not out of the document. Tabbing into
  // it brings it straight back, so keyboard order still matches what is drawn.
  const [focusWithin, setFocusWithin] = useState(false)
  const hidden = collapsed && !focusWithin

  const isHome = location.pathname === '/'

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const goToPage = (path) => (e) => {
    tapHaptic()
    if (location.pathname === path) {
      e.preventDefault()
      scrollToTop()
    }
    e.currentTarget.blur()
  }

  const goHome = (e) => {
    tapHaptic()
    if (isHome) {
      e.preventDefault()
      scrollToTop()
    }
    e.currentTarget.blur()
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
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  // Every destination lives in the one pill, in the shared nav's own order
  // with "Work" spliced in after "Home" and the CV added at the end. `nav`
  // itself is never mutated — the footer reads the same array.
  const glyphs = {
    '/': <HomeIcon />,
    '/about': <AboutIcon />,
    '/contact': <MessageIcon />,
  }
  const items = [
    ...nav.flatMap((item) =>
      item.to === '/'
        ? [
            { ...item, icon: glyphs['/'] },
            { label: 'Work', isWork: true, icon: <WorkIcon /> },
          ]
        : [{ ...item, icon: glyphs[item.to] }]
    ),
    // Empty means don't render: no résumé link, no CV item.
    ...(links.resume
      ? [
          {
            label: 'CV',
            href: links.resume,
            external: true,
            icon: <DocIcon />,
          },
        ]
      : []),
  ]

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: DUR.page, ease: EASE }

  return (
    <div className="pointer-events-none fixed left-1/2 top-0 z-50 -translate-x-1/2">
      <motion.div
        animate={{
          y: hidden ? FLOAT_Y.navHidden : FLOAT_Y.nav,
          opacity: hidden ? 0 : 1,
        }}
        initial={false}
        transition={transition}
        style={{ pointerEvents: hidden ? 'none' : 'auto' }}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={() => setFocusWithin(false)}
        className="flex max-w-[calc(100vw-16px)] items-center gap-2 md:gap-2.5"
      >
        {/* Logo capsule — its own object, not the first item of the pill.
            Accessible name lives on the link; the mark is decorative. No
            `data-cursor`: the mark already says where it goes. */}
        <Link
          to="/"
          onClick={goHome}
          aria-label="Sakhi Rana — home"
          className={`${FLOAT_SHELL} ${CTA_HOVER} inline-flex size-11 shrink-0 touch-manipulation items-center justify-center !rounded-full text-text hover:border-text/40 md:size-[52px]`}
        >
          <Logo className="h-4 w-auto md:h-[18px]" />
        </Link>

        <nav
          aria-label="Primary"
          className={`${FLOAT_SHELL} flex min-w-0 items-center gap-0.5 overflow-hidden p-1.5`}
        >
          {items.map((item) =>
            item.isWork ? (
              <PillItem
                key="work"
                as="button"
                type="button"
                onClick={goToWork}
                icon={item.icon}
                label={item.label}
              />
            ) : item.href ? (
              <PillItem
                key={item.label}
                as="a"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                icon={item.icon}
                label={item.label}
              />
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={goToPage(item.to)}
                className={pillClass}
                aria-label={item.label}
              >
                {({ isActive }) => (
                  <>
                    {/* Active-page indicator — one shared layoutId, so the
                        wash slides between items on route change. */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-text/[0.07]"
                        transition={transition}
                      />
                    )}
                    <PillFace icon={item.icon} label={item.label} />
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* The same switch the hero lamp is — one shared state, so the two can
            never show different things. Only its surface is restyled here, and
            it keeps its `data-cursor`: it is the one control in the row whose
            glyph names a state rather than a destination. */}
        <ThemeToggle
          className={`${FLOAT_SHELL} touch-manipulation !rounded-full md:size-[52px]`}
        />
      </motion.div>
    </div>
  )
}

// One destination inside the pill. 42px tall, glyph always, label from 860px
// up — the width the four labels stop fitting beside the logo, toggle and
// contact button.
//
// `touch-action: manipulation` opts each control out of double-tap-to-zoom, so
// a tap fires on the first one instead of waiting to find out whether a second
// is coming. These sit inside a bar the thumb reaches for constantly; a
// several-hundred-millisecond wait there reads as the tap not registering.
const pillClass =
  'relative inline-flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-full px-2.5 ' +
  'touch-manipulation text-body-sm font-normal text-text-muted transition-colors duration-200 ease-out ' +
  'hover:bg-text/[0.06] hover:text-text ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2 ' +
  'min-[860px]:px-4'

function PillFace({ icon, label }) {
  return (
    <span className="relative z-10 inline-flex items-center gap-2">
      {icon}
      <span className="hidden whitespace-nowrap min-[860px]:inline">
        {label}
      </span>
    </span>
  )
}

function PillItem({ as: As, icon, label, ...rest }) {
  return (
    <As
      className={pillClass}
      aria-label={label}
      onPointerDown={tapHaptic}
      {...rest}
    >
      <PillFace icon={icon} label={label} />
    </As>
  )
}

// Glyphs — one 24 grid, 1.6 stroke on currentColor, so they take the pill's
// ink and the theme with it.
function Glyph({ children }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="block shrink-0"
    >
      {children}
    </svg>
  )
}

function HomeIcon() {
  return (
    <Glyph>
      <path
        d="M3.6 10.4 12 3.8l8.4 6.6V20a1 1 0 0 1-1 1h-4.6v-6H9.2v6H4.6a1 1 0 0 1-1-1v-9.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Glyph>
  )
}

function WorkIcon() {
  return (
    <Glyph>
      <path
        d="M3.5 7.2a1.7 1.7 0 0 1 1.7-1.7h3.4l2 2.4h8.2a1.7 1.7 0 0 1 1.7 1.7v8.9a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7V7.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Glyph>
  )
}

function AboutIcon() {
  return (
    <Glyph>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.6 13.6a4 4 0 0 0 6.8 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9.4 9.6h.01M14.6 9.6h.01"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </Glyph>
  )
}

function DocIcon() {
  return (
    <Glyph>
      <path
        d="M6.2 3.8h7l4.6 4.6v11.8a1 1 0 0 1-1 1H6.2a1 1 0 0 1-1-1V4.8a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13 3.9v4.6h4.7M8.4 13h7.2M8.4 16.4h4.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Glyph>
  )
}

// Contact is a conversation, not an inbox — a speech bubble, matching the
// footer's own "say hello" glyph rather than repeating the mail envelope that
// sits next to it down there.
function MessageIcon() {
  return (
    <Glyph>
      <path
        d="M6.6 4.2h10.8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8.6l-4 3.6V6.2a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Glyph>
  )
}
