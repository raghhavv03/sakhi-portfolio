import { useEffect, useState } from 'react'
import { fadeUp } from './animations'

// Subscribe to a CSS media query and re-render on change.
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    onChange(mql)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

// True on devices with a fine pointer (mouse/trackpad) — gates the custom cursor.
export function useFinePointer() {
  return useMediaQuery('(pointer: fine)')
}

// True when the user has requested reduced motion.
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

// True at Tailwind's `lg` and up. Only for layouts a class cannot express —
// About's photo stacks compute their transforms in JS, and a stack that is a
// scrolling strip on a phone must not be told to fan out. Keep the breakpoint
// here in step with the `lg:` classes that go with it.
export function useLargeScreen() {
  return useMediaQuery('(min-width: 1024px)')
}

// True once the reader is scrolling *down* and is past `threshold` — the one
// signal behind the floating nav swap: the nav lifts away, the case study's
// section rail drops into its place, and scrolling back up reverses both. Two
// components read it, so it lives here and cannot drift between them.
//
// `delta` is a jitter floor: trackpad momentum and rubber-banding emit a
// stream of one- and two-pixel scrolls, and a nav that flickers on those is
// worse than no nav at all. Movement under the floor accumulates rather than
// being thrown away — `lastY` only advances on a move that counted.
export function useNavCollapsed({ threshold = 140, delta = 6 } = {}) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let queued = false

    const read = () => {
      queued = false
      const y = window.scrollY
      // The top of the page always shows the nav, whichever way we arrived.
      if (y < threshold) {
        lastY = y
        setCollapsed(false)
        return
      }
      const dy = y - lastY
      if (Math.abs(dy) < delta) return
      lastY = y
      setCollapsed(dy > 0)
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold, delta])

  return collapsed
}

// Scroll-reveal props for a motion element. Under reduced motion the reveal is
// disabled entirely — the element renders in its final state with no animation.
export function useReveal() {
  const reducedMotion = useReducedMotion()
  return reducedMotion ? { initial: false } : fadeUp
}

// True once the referenced element has entered the viewport, and true from the
// first render under reduced motion. Charts use this to grow their bars on
// arrival: one observer on the plot area drives every bar, so a chart animates
// as a single measurement rather than as a dozen independent elements.
export function useInViewOnce(ref) {
  const reducedMotion = useReducedMotion()
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setSeen(true)
        observer.disconnect()
      },
      { rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, seen])

  return reducedMotion || seen
}
