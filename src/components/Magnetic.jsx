import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer, useReducedMotion } from '../lib/hooks'

// Very subtle magnetic hover: the child drifts a few pixels toward the
// pointer while hovered and settles back on leave. Overdamped spring — no
// overshoot, no bounce. Renders children untouched on coarse pointers and
// under prefers-reduced-motion.
const SPRING = { stiffness: 300, damping: 30, mass: 0.4 }

export default function Magnetic({ children, max = 3, className = '' }) {
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()
  const ref = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, SPRING)
  const y = useSpring(my, SPRING)

  if (!finePointer || reducedMotion) {
    return <div className={className}>{children}</div>
  }

  const onPointerMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    // Offset from the element's centre, scaled down and clamped to ±max px.
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    mx.set(Math.max(-1, Math.min(1, dx)) * max)
    my.set(Math.max(-1, Math.min(1, dy)) * max)
  }

  const onPointerLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  )
}
