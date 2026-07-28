import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'

const ZOOM_MIN = 1
const ZOOM_MAX = 3
const ZOOM_STEP = 0.5

// Full-bleed image viewer for case-study figures. Opens straight to the whole
// image, fitted to the viewport — not a natural-size crop the user has to pan
// to make sense of. From there, Zoom in/out steps between the fit and up to
// 3x, panning by native scroll once the image is larger than the frame.
//
// Escape closes, the backdrop closes, page scroll is locked while open, and
// focus moves to the close button and returns to the trigger on exit.
export default function Lightbox({ figure, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const imgRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const open = Boolean(figure)
  const [zoom, setZoom] = useState(ZOOM_MIN)
  const [fitWidth, setFitWidth] = useState(null)

  // Reset to the fitted view whenever a new figure opens.
  useEffect(() => {
    setZoom(ZOOM_MIN)
    setFitWidth(null)
  }, [figure])

  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    // Cycle Tab through the viewer's own controls (zoom out/in, close)
    // instead of letting it wander into the page behind the overlay.
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-' || e.key === '_') zoomOut()
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll('button:not([disabled])')
        if (!focusables?.length) return
        e.preventDefault()
        const list = Array.from(focusables)
        const currentIndex = list.indexOf(document.activeElement)
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + list.length) % list.length
          : (currentIndex + 1) % list.length
        list[nextIndex].focus()
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
          ref={dialogRef}
          className="fixed inset-0 z-[100] flex flex-col bg-dark-bg/95 p-4 backdrop-blur-sm sm:p-6"
        >
          <div className="flex shrink-0 items-start justify-between gap-6">
            <p className="max-w-2xl pt-1 text-sm font-normal leading-body text-dark-muted">
              {figure.caption || figure.alt}
            </p>
            <div
              className="flex shrink-0 items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= ZOOM_MIN}
                data-cursor=""
                aria-label="Zoom out"
                className="rounded-full border border-dark-border px-3 py-2 text-sm font-normal text-dark-text transition-colors duration-200 hover:bg-accent hover:text-text focus-visible:outline-dark-text disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-dark-text"
              >
                −
              </button>
              <span className="w-11 text-center text-sm font-normal text-dark-muted tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom >= ZOOM_MAX}
                data-cursor=""
                aria-label="Zoom in"
                className="rounded-full border border-dark-border px-3 py-2 text-sm font-normal text-dark-text transition-colors duration-200 hover:bg-accent hover:text-text focus-visible:outline-dark-text disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-dark-text"
              >
                +
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                data-cursor=""
                className="ml-2 shrink-0 rounded-full border border-dark-border px-4 py-2 text-sm font-normal text-dark-text transition-colors duration-200 hover:bg-accent hover:text-text focus-visible:outline-dark-text"
              >
                Close
              </button>
            </div>
          </div>

          {/* Fitted by default (the whole image, scaled to the viewport) —
              stopPropagation so panning or zooming doesn't dismiss the
              viewer. Past the fit, the image gets an explicit pixel width so
              the frame can scroll to pan it. */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-2xl bg-surface"
          >
            <img
              ref={imgRef}
              src={figure.src}
              alt={figure.alt}
              width={figure.width}
              height={figure.height}
              onLoad={(e) => {
                if (fitWidth === null) setFitWidth(e.currentTarget.clientWidth)
              }}
              className={
                zoom > ZOOM_MIN
                  ? 'block h-auto max-w-none'
                  : 'block h-auto max-h-full w-auto max-w-full object-contain'
              }
              style={
                zoom > ZOOM_MIN && fitWidth
                  ? { width: fitWidth * zoom }
                  : undefined
              }
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
