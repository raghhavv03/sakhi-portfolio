import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer, useReducedMotion } from '../lib/hooks'

// Custom cursor — desktop (fine pointer) only.
//   • 10px vivid-blue dot that tracks the pointer 1:1
//   • 30px ring that lags slightly via spring (disabled under reduced-motion)
//   • expands into a labelled pill over any [data-cursor] element
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

  // Toggle the global class that hides the native cursor — only when active.
  useEffect(() => {
    const root = document.documentElement
    if (finePointer) root.classList.add('has-custom-cursor')
    else root.classList.remove('has-custom-cursor')
    return () => root.classList.remove('has-custom-cursor')
  }, [finePointer])

  const labelRef = useRef(null)

  useEffect(() => {
    if (!finePointer) return

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)

      // Resolve the nearest [data-cursor] ancestor for the label.
      const target =
        e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      const next = target ? target.getAttribute('data-cursor') : null
      if (next !== labelRef.current) {
        labelRef.current = next
        setLabel(next)
      }
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
    }
  }, [finePointer, visible, x, y])

  if (!finePointer) return null

  const expanded = Boolean(label)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Trailing ring (or label pill when hovering a labelled element). */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
          animate={
            expanded
              ? { width: 'auto', height: 28, backgroundColor: '#2563EB' }
              : { width: 30, height: 30, backgroundColor: 'rgba(37,99,235,0)' }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', damping: 22, stiffness: 320 }
          }
          style={{ border: expanded ? 'none' : '1.5px solid #2563EB' }}
        >
          {expanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.15 }}
              className="whitespace-nowrap px-3 text-xs font-semibold text-white"
            >
              {label}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Vivid-blue dot — tracks the pointer 1:1, hidden when over a label. */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x, y, opacity: visible && !expanded ? 1 : 0 }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 10, height: 10, backgroundColor: '#2563EB' }}
        />
      </motion.div>
    </div>
  )
}
