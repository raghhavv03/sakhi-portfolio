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
