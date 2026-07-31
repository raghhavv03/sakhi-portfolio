// Shared Framer Motion presets — the single source of truth for motion.
// Philosophy: fade + translate only, tasteful ease-out, no bounce/overshoot,
// nothing above ~600ms. Scroll reveals fire once and never re-trigger.

// Ease-out curve (fast start, gentle settle) — no overshoot. Used everywhere
// so the whole site decelerates the same way.
export const EASE = [0.22, 1, 0.36, 1]

// Timing tokens (seconds).
export const DUR = {
  hover: 0.18, // 150–220ms band
  reveal: 0.45, // 350–600ms band
  page: 0.3, // 300–450ms band
}

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: DUR.reveal, ease: EASE },
}
