import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { useNavCollapsed, useReducedMotion } from '../../lib/hooks'
import { EASE, DUR } from '../../lib/animations'
import { FLOAT_SHELL, FLOAT_Y } from '../../lib/interactions'
import { tapHaptic } from '../../lib/haptics'

// Where the reader is in a case study, in the band the floating nav rests in.
// Case studies are the only long-form pages on the site, so this is the one
// place a progress indicator earns its keep.
//
// Two states, driven by the same `useNavCollapsed` the header reads:
//
//   scrolling up   — the header is back, so this is a row of seven dots
//                    riding just above it: position without furniture.
//   scrolling down — the header lifts away and the rail expands into the spot
//                    it left, naming the seven parts with a wash that slides
//                    between them (one `layoutId`).
//
// The two layers are stacked in one grid cell and cross-fade, so nothing
// reflows when the mode changes.

// The page ships fourteen sections; a reader needs seven. Each group is
// anchored to the id of the section that opens it — the rail activates a
// group once that section's top passes under the floating band, which is what
// keeps the groups contiguous and the highlight monotonic while scrolling.
const GROUPS = [
  { label: 'Overview', id: 'background' },
  { label: 'Problem', id: 'problem' }, // + challenge, solution preview
  { label: 'Research', id: 'discovery' }, // + research, literature
  { label: 'Process', id: 'today-screen' },
  { label: 'Solution', id: 'repeat-logging' }, // + prediction-card, add-more
  { label: 'Results', id: 'strength' }, // + testing, if-shipped
  { label: 'Learnings', id: 'learnings' },
]

// A section counts as current once its top is above this line — the bottom of
// the floating band plus a little air, so the rail names what you are reading
// rather than what is about to arrive.
const ACTIVE_LINE = 160
const SCROLL_OFFSET = 118

export default function CaseStudyProgressNav() {
  const reducedMotion = useReducedMotion()
  const collapsed = useNavCollapsed()
  const { scrollYProgress } = useScroll()

  // Empty means don't render: a case study without one of these sections
  // simply has one fewer stop.
  const [groups, setGroups] = useState([])
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    setGroups(GROUPS.filter((group) => document.getElementById(group.id)))
  }, [])

  useEffect(() => {
    if (!groups.length) return
    let queued = false

    const read = () => {
      queued = false
      let next = 0
      groups.forEach((group, i) => {
        const el = document.getElementById(group.id)
        if (el && el.getBoundingClientRect().top <= ACTIVE_LINE) next = i
      })
      if (next === activeRef.current) return
      activeRef.current = next
      setActive(next)
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [groups])

  const goTo = useCallback(
    (id) => {
      tapHaptic()
      const el = document.getElementById(id)
      if (!el) return
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
    },
    [reducedMotion]
  )

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: DUR.page, ease: EASE }
  const slide = reducedMotion
    ? { duration: 0 }
    : { duration: DUR.reveal, ease: EASE }

  if (!groups.length) return null

  return (
    <>
      {/* Thin reading-progress bar pinned above everything. Scroll-linked
          scaleX — no animation loop, no layout work. */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-text"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="pointer-events-none fixed left-1/2 top-0 z-[52] -translate-x-1/2">
        <motion.div
          animate={{ y: collapsed ? FLOAT_Y.rail : FLOAT_Y.dots }}
          initial={false}
          transition={transition}
          className="grid max-w-[calc(100vw-16px)] grid-cols-1 grid-rows-1 place-items-center"
        >
          {/* Collapsed: position only. Decorative — the rail underneath
              carries the same information in words.
              `self-start`: the cell is as tall as the rail, and a dot row
              centred in it lands on the nav pill's top edge. */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: collapsed ? 0 : 1 }}
            initial={false}
            transition={transition}
            className="col-start-1 row-start-1 flex items-center gap-[9px] self-start px-3 py-2"
          >
            {groups.map((group, i) => (
              <motion.span
                key={group.id}
                animate={{
                  width: i === active ? 16 : 5,
                  opacity: i === active ? 1 : i < active ? 0.4 : 0.22,
                }}
                initial={false}
                transition={slide}
                className={`block h-[5px] rounded-full ${
                  i <= active ? 'bg-text' : 'bg-text-muted'
                }`}
              />
            ))}
          </motion.div>

          {/* Expanded: the seven parts, named. */}
          <motion.nav
            aria-label="Case study progress"
            aria-hidden={!collapsed}
            animate={{
              opacity: collapsed ? 1 : 0,
              scale: collapsed ? 1 : 0.96,
            }}
            initial={false}
            transition={transition}
            style={{ pointerEvents: collapsed ? 'auto' : 'none' }}
            className={`${FLOAT_SHELL} col-start-1 row-start-1 flex max-w-full items-center gap-0.5 overflow-hidden p-1.5`}
          >
            {groups.map((group, i) => {
              const isActive = i === active
              return (
                <button
                  key={group.id}
                  type="button"
                  tabIndex={collapsed ? 0 : -1}
                  onClick={() => goTo(group.id)}
                  data-cursor={group.label}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative shrink-0 rounded-full px-3.5 py-2.5 text-body-sm transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'font-semibold text-text'
                      : i < active
                        ? 'font-normal text-text-muted/80 hover:text-text'
                        : 'font-normal text-text-muted/45 hover:text-text'
                  } ${
                    // Under 720px there is no room for seven labels beside
                    // each other, so the rail keeps only the one you are in.
                    isActive ? 'inline-flex' : 'hidden min-[720px]:inline-flex'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="cs-rail-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-text/[0.07]"
                      transition={slide}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">
                    {group.label}
                  </span>
                </button>
              )
            })}
          </motion.nav>
        </motion.div>
      </div>
    </>
  )
}
