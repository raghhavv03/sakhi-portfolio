// Shared Framer Motion presets — the single source of truth for motion.
// Philosophy: fade + translate only, tasteful ease-out, no bounce/overshoot,
// nothing above ~600ms. Scroll reveals fire once and never re-trigger.

// Ease-out curve (fast start, gentle settle) — no overshoot. Used everywhere
// so the whole site decelerates the same way.
export const EASE = [0.22, 1, 0.36, 1]

// Timing tokens (seconds). Hover/tap live in components as CSS/Framer props.
export const DUR = {
  hover: 0.18, // 150–220ms band
  tap: 0.1, // 80–120ms band
  reveal: 0.45, // 350–600ms band
  page: 0.3, // 300–450ms band
}

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: DUR.reveal, ease: EASE },
}

export const stagger = {
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true },
}

// Child variant to pair with a staggered parent.
export const fadeUpChild = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: DUR.reveal, ease: EASE },
}
