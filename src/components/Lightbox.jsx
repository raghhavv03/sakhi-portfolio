import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'

const ZOOM_MIN = 1
const ZOOM_MAX = 3
const ZOOM_STEP = 0.5

// Full-bleed image viewer for case-study figures. Opens straight to the whole
// image, fitted to the viewport — not a natural-size crop the user has to pan
// to make sense of. From there, Zoom in/out steps between the fit and up to 3x.
//
// Past the fit the image is *panned*, not scrolled: it keeps its fitted layout
// size and is moved with a transform, so every part of it is reachable by
// dragging it — mouse, trackpad or finger, with two fingers pinching to zoom.
// A scroll container could not do this: an `overflow-auto` box that centres its
// content leaves the overflow above and to the left of centre unreachable, at
// any zoom, in every browser. That is the bug this replaces.
//
// Escape closes, the backdrop closes, page scroll is locked while open, and
// focus moves to the close button and returns to the trigger on exit.
export default function Lightbox({ figure, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const frameRef = useRef(null)
  const imgRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const open = Boolean(figure)

  const [zoom, setZoom] = useState(ZOOM_MIN)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  // Live pointers on the frame, so one finger pans and two pinch. `drag` is
  // the grab point in image space; `pinch` is the span the gesture started at.
  const pointers = useRef(new Map())
  const drag = useRef(null)
  const pinch = useRef(null)
  // A drag released outside the frame delivers its click to the backdrop, which
  // would close the viewer the moment a pan overshoots. This swallows that one.
  const swallowClick = useRef(false)

  // How far the image may travel before its edge would leave the frame: half
  // the overhang on each axis, and zero on an axis that still fits.
  const clampOffset = useCallback((next, atZoom) => {
    const frame = frameRef.current
    const img = imgRef.current
    if (!frame || !img) return next
    // offsetWidth is the *layout* size — the transform does not change it, so
    // this stays the fitted size at every zoom.
    const maxX = Math.max(0, (img.offsetWidth * atZoom - frame.clientWidth) / 2)
    const maxY = Math.max(0, (img.offsetHeight * atZoom - frame.clientHeight) / 2)
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    }
  }, [])

  const applyZoom = useCallback(
    (value) => {
      const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value))
      setZoom(next)
      // Zooming back out has to pull the image with it, or it would come to
      // rest off-centre with bands of empty frame beside it.
      setOffset((current) => clampOffset(current, next))
    },
    [clampOffset]
  )

  const zoomIn = useCallback(() => applyZoom(zoom + ZOOM_STEP), [applyZoom, zoom])
  const zoomOut = useCallback(() => applyZoom(zoom - ZOOM_STEP), [applyZoom, zoom])

  // Reset to the fitted, centred view whenever a new figure opens.
  useEffect(() => {
    setZoom(ZOOM_MIN)
    setOffset({ x: 0, y: 0 })
    pointers.current.clear()
    drag.current = null
    pinch.current = null
    setDragging(false)
  }, [figure])

  // A resized window re-fits the image, so a pan that was in bounds may not be.
  useEffect(() => {
    if (!open) return
    const onResize = () => setOffset((current) => clampOffset(current, zoom))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open, zoom, clampOffset])

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
  }, [open, onClose, zoomIn, zoomOut])

  // ── Pan and pinch. Pointer events, so one path covers mouse, trackpad and
  //    touch; the frame captures the pointer so a fast drag that leaves the
  //    frame keeps panning instead of stalling at the edge.
  const startDrag = (point) => {
    drag.current = { x: point.x - offset.x, y: point.y - offset.y }
    setDragging(true)
  }

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    swallowClick.current = false
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    // Capture is the nicety (a fast drag that leaves the frame keeps panning),
    // not the mechanism — so a browser that refuses it must not take the pan
    // down with it.
    try {
      frameRef.current?.setPointerCapture(e.pointerId)
    } catch {
      /* not capturable — pan still works, it just stops at the frame edge */
    }

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values())
      pinch.current = { span: Math.hypot(a.x - b.x, a.y - b.y) || 1, zoom }
      drag.current = null
      setDragging(false)
    } else if (zoom > ZOOM_MIN) {
      startDrag({ x: e.clientX, y: e.clientY })
    }
  }

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size >= 2 && pinch.current) {
      const [a, b] = Array.from(pointers.current.values())
      const span = Math.hypot(a.x - b.x, a.y - b.y)
      applyZoom(pinch.current.zoom * (span / pinch.current.span))
      return
    }

    if (!drag.current) return
    swallowClick.current = true
    setOffset(
      clampOffset(
        { x: e.clientX - drag.current.x, y: e.clientY - drag.current.y },
        zoom
      )
    )
  }

  const endPointer = (e) => {
    pointers.current.delete(e.pointerId)
    if (frameRef.current?.hasPointerCapture?.(e.pointerId)) {
      frameRef.current.releasePointerCapture(e.pointerId)
    }

    if (pointers.current.size < 2) pinch.current = null
    if (pointers.current.size === 1 && zoom > ZOOM_MIN) {
      // A pinch that lost a finger becomes a pan from where the other one is,
      // rather than freezing until the user lifts off and starts again.
      const [remaining] = Array.from(pointers.current.values())
      startDrag(remaining)
    } else if (pointers.current.size === 0) {
      drag.current = null
      setDragging(false)
    }
  }

  if (typeof document === 'undefined') return null

  const panned = zoom > ZOOM_MIN

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
          onClick={() => {
            if (swallowClick.current) {
              swallowClick.current = false
              return
            }
            onClose()
          }}
          ref={dialogRef}
          className="fixed inset-0 z-[100] flex flex-col bg-dark-bg/95 p-4 backdrop-blur-sm sm:p-6"
        >
          <div className="flex shrink-0 items-start justify-between gap-6">
            <p className="max-w-2xl pt-1 text-body-sm font-normal text-dark-muted">
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
                className="rounded-full border border-dark-border px-3 py-2 text-body-sm font-normal text-dark-text transition-colors duration-200 hover:bg-dark-text hover:text-dark-bg focus-visible:outline-dark-text disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-dark-text"
              >
                −
              </button>
              <span className="w-11 text-center text-body-sm font-normal text-dark-muted tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom >= ZOOM_MAX}
                data-cursor=""
                aria-label="Zoom in"
                className="rounded-full border border-dark-border px-3 py-2 text-body-sm font-normal text-dark-text transition-colors duration-200 hover:bg-dark-text hover:text-dark-bg focus-visible:outline-dark-text disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-dark-text"
              >
                +
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                data-cursor=""
                className="ml-2 shrink-0 rounded-full border border-dark-border px-4 py-2 text-body-sm font-normal text-dark-text transition-colors duration-200 hover:bg-dark-text hover:text-dark-bg focus-visible:outline-dark-text"
              >
                Close
              </button>
            </div>
          </div>

          {/* The frame. `touch-none` hands every touch gesture to the handlers
              above — without it the browser claims the drag as a page scroll
              and the image never moves. stopPropagation so panning inside the
              picture doesn't dismiss the viewer. */}
          <div
            ref={frameRef}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            className={`mt-4 flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden rounded-2xl bg-surface ${
              panned ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
          >
            <img
              ref={imgRef}
              src={figure.src}
              alt={figure.alt}
              width={figure.width}
              height={figure.height}
              draggable="false"
              style={{
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
              }}
              className={`block h-auto max-h-full w-auto max-w-full select-none object-contain ${
                dragging || reducedMotion
                  ? ''
                  : 'transition-transform duration-200 ease-out'
              }`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
