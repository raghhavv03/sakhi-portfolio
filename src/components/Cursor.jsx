import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer, useReducedMotion } from '../lib/hooks'

const ICON_SIZE = 18

function CursorIcon({ type }) {
  if (!type) return null

  const common = {
    width: ICON_SIZE,
    height: ICON_SIZE,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: 'shrink-0',
    'aria-hidden': true,
  }

  if (type === 'down') {
    return (
      <svg {...common}>
        <path
          d="M12 5v14M12 19l-6-6M12 19l6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path
        d="M5 12h14M19 12l-6-6M19 12l-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Labels that describe a state rather than a destination take no arrow —
// nothing is being navigated to.
const NO_ICON = new Set(['Coming soon', 'Night mode', 'Day mode'])

function parseCursorLabel(label) {
  if (!label) return { text: '', icon: null }

  if (label.includes('↓')) {
    return { text: label.replace(/\s*↓\s*/, '').trim(), icon: 'down' }
  }

  if (NO_ICON.has(label)) {
    return { text: label, icon: null }
  }

  return { text: label, icon: 'right' }
}

// Custom label cursor — desktop (fine pointer) only.
//   • leaves the native arrow/hand cursor untouched
//   • shows a labelled blue pill over any [data-cursor] element
//
// Gated entirely on (pointer: fine): on touch/coarse devices nothing renders
// and the native cursor is left untouched. Labels are decorative — every
// labelled element must also carry real link text / aria-label.
export default function Cursor() {
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()

  const [label, setLabel] = useState(null)
  const [visible, setVisible] = useState(false)

  // Raw pointer position (the dot follows this exactly).
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  // Ring lags behind via spring; under reduced motion it snaps (stiff/no lag).
  const ringConfig = reducedMotion
    ? { damping: 100, stiffness: 1000, mass: 0.1 }
    : { damping: 26, stiffness: 280, mass: 0.6 }
  const ringX = useSpring(x, ringConfig)
  const ringY = useSpring(y, ringConfig)

  const labelRef = useRef(null)
  const pointerRef = useRef({ x: -100, y: -100 })

  // Hide native cursor only while a custom label pill is active.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('has-label-cursor', finePointer && Boolean(label))
    return () => root.classList.remove('has-label-cursor')
  }, [finePointer, label])

  useEffect(() => {
    if (!finePointer) return

    const readCursorLabel = (clientX, clientY) => {
      let el = document.elementFromPoint(clientX, clientY)
      if (!(el instanceof Element)) return null

      while (el) {
        if (el.hasAttribute('data-cursor')) {
          const value = el.getAttribute('data-cursor')
          // Empty string explicitly suppresses a parent label (e.g. hero CTA).
          return value === '' ? null : value
        }
        el = el.parentElement
      }
      return null
    }

    const applyLabelAt = (clientX, clientY) => {
      const next = readCursorLabel(clientX, clientY)
      if (next !== labelRef.current) {
        labelRef.current = next
        setLabel(next)
      }
    }

    const onMove = (e) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      applyLabelAt(e.clientX, e.clientY)
    }

    // Re-read the label under a stationary pointer. The element there can
    // change without the pointer moving — the page scrolls under it, or a
    // toggle it is sitting on relabels itself after being pressed.
    const rereadUnderPointer = () => {
      const { x: px, y: py } = pointerRef.current
      if (px < 0 || py < 0) return
      applyLabelAt(px, py)
    }

    // A control that flips state (the lamp, the theme toggle) rewrites its own
    // data-cursor, so the pill has to follow the attribute, not the pointer —
    // otherwise "Night mode" sits under a stationary cursor until it next
    // moves. Watching the attribute is what makes that instant, and it is why
    // this is an observer rather than a click handler: hooking the click means
    // guessing when React's commit lands (a microtask queued from the capture
    // phase still runs before it), whereas the mutation record *is* the
    // commit. `attributeFilter` keeps it to the one attribute we care about.
    const observer = new MutationObserver(rereadUnderPointer)
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-cursor'],
    })

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('scroll', rereadUnderPointer, {
      passive: true,
      capture: true,
    })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    return () => {
      observer.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', rereadUnderPointer, { capture: true })
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
    }
  }, [finePointer, x, y])

  if (!finePointer) return null

  const expanded = Boolean(label)
  const { text, icon } = parseCursorLabel(label)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Trailing ring (or label pill when hovering a labelled element). */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: ringX, y: ringY, opacity: visible && expanded ? 1 : 0 }}
      >
        {/* The pill is the site's own ink inverted — `bg-text` with `text-bg`,
            the same pairing outlined CTAs hover into. It reads as part of the
            theme in both modes and flips with it, where the pastel accent read
            as a fifth colour dropped on top of the page. The fill is a class
            rather than a Framer value because there is nothing to interpolate
            and Framer cannot tween a colour held in a CSS variable. */}
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-text"
          animate={{ width: 'auto', height: 'auto' }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', damping: 22, stiffness: 320 }
          }
          style={{ border: 'none' }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
            className="flex items-center gap-1.5 whitespace-nowrap px-5 py-2.5 text-body font-normal leading-none text-bg"
          >
            {text}
            <CursorIcon type={icon} />
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  )
}
