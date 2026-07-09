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

function parseCursorLabel(label) {
  if (!label) return { text: '', icon: null }

  if (label.includes('↓')) {
    return { text: label.replace(/\s*↓\s*/, '').trim(), icon: 'down' }
  }

  if (label === 'Coming soon') {
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

    const onScroll = () => {
      const { x: px, y: py } = pointerRef.current
      if (px < 0 || py < 0) return
      applyLabelAt(px, py)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll, { capture: true })
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
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
          animate={{ width: 'auto', height: 'auto', backgroundColor: 'var(--accent-hover)' }}
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
            className="flex items-center gap-1.5 whitespace-nowrap px-5 py-2.5 text-base font-normal leading-none text-text"
          >
            {text}
            <CursorIcon type={icon} />
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  )
}
