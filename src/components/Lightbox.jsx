import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'

// Full-bleed image viewer for case-study figures. The prototype screens carry
// real interface text at small sizes, so "look closer" is a genuine need rather
// than decoration: the image renders at its natural width inside a scrollable
// frame, which lets a wide board be panned rather than shrunk to illegibility.
//
// Escape closes, the backdrop closes, page scroll is locked while open, and
// focus moves to the close button and returns to the trigger on exit.
export default function Lightbox({ figure, onClose }) {
  const closeRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const open = Boolean(figure)

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    // Close is the viewer's only control, so trapping focus is just holding it
    // there — that keeps Tab from wandering into the page behind the overlay.
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        e.preventDefault()
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={figure.alt}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: DUR.page, ease: EASE }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex flex-col bg-dark-bg/95 p-4 backdrop-blur-sm sm:p-6"
        >
          <div className="flex shrink-0 items-start justify-between gap-6">
            <p className="max-w-2xl pt-1 text-sm font-normal leading-body text-dark-muted">
              {figure.caption || figure.alt}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              data-cursor=""
              className="shrink-0 rounded-full border border-dark-border px-4 py-2 text-sm font-normal text-dark-text transition-colors duration-200 hover:bg-accent hover:text-text focus-visible:outline-dark-text"
            >
              Close
            </button>
          </div>

          {/* Natural-size image in a scrollable frame — stopPropagation so
              panning a wide board doesn't dismiss the viewer. */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 min-h-0 flex-1 overflow-auto rounded-2xl bg-surface"
          >
            <img
              src={figure.src}
              alt={figure.alt}
              width={figure.width}
              height={figure.height}
              className="mx-auto block h-auto max-w-none"
              style={{ width: figure.width }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
