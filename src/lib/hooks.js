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

// Id of the section currently being read, for the case-study contents rail.
// Sections are taller than the viewport, so "in view" is decided by a band near
// the top rather than by intersection ratio — the last heading to cross that
// band is the one you're reading.
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? null)
  const key = ids.join('|')

  useEffect(() => {
    const sections = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!sections.length) return

    const onScroll = () => {
      const band = window.innerHeight * 0.3
      let current = sections[0].id
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= band) current = section.id
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [key])

  return active
}
