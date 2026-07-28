import { useCallback, useLayoutEffect, useRef, useState } from 'react'

// Scales a fixed-width block down to whatever width it's given, never up.
//
// The two research panels are drawn in the Figma frame at an exact size —
// 591px wide, with 8px labels and bars measured in tenths of a pixel. Reflowing
// them at narrow widths would change the design; letting them overflow would
// break the page. So below their natural width they are scaled as a unit,
// which keeps every proportion, weight and gap exactly as drawn.
//
// A ResizeObserver on the outer element drives the transform, and the wrapper
// reserves the scaled height so the page doesn't reflow around a transformed
// child.
export default function ScaleToFit({ width, children, className = '' }) {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState(null)

  const measure = useCallback(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    const available = outer.clientWidth
    if (available) setScale(Math.min(1, available / width))
    // offsetHeight is the panel's own laid-out height, unaffected by the
    // transform, so the reserved space stays correct as the panel reflows
    // (a stat label wrapping, a webfont swapping in).
    setHeight(inner.offsetHeight)
  }, [width])

  // Measure before paint so the panel is never briefly wider than its column,
  // then keep it in step. The observer is the mechanism that matters, but it
  // only delivers while the document is visible, so the layout-effect pass is
  // what guarantees a correct first frame.
  useLayoutEffect(() => {
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(outerRef.current)
    observer.observe(innerRef.current)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div
      ref={outerRef}
      className={className}
      style={height === null ? undefined : { height: height * scale }}
    >
      <div
        ref={innerRef}
        style={{
          width,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  )
}
