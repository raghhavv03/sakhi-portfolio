import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ThemeContext,
  STORAGE_KEY,
  applyTheme,
  readStoredTheme,
  systemTheme,
} from '../lib/theme'

// Owns the light/dark decision for the whole site. Every control that changes
// the theme — the hero lamp, the header toggle — calls into this one state, so
// they can never disagree.
//
// The class on <html> is already correct before React mounts (see the inline
// script in index.html), so the first paint never flashes the wrong theme;
// this reads that class rather than re-deciding.
export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  )
  const [chosen, setChosen] = useState(() => readStoredTheme() !== null)
  const transitionTimer = useRef(null)

  const setTheme = useCallback((next) => {
    // Colour transitions are enabled only around a deliberate switch — never
    // on first paint, and never while the user is navigating.
    const root = document.documentElement
    root.classList.add('theme-transition')
    clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(
      () => root.classList.remove('theme-transition'),
      400
    )

    setThemeState(next)
    setChosen(true)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable — the choice still holds for this session.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => () => clearTimeout(transitionTimer.current), [])

  // Keep following the OS until the visitor states a preference of their own.
  useEffect(() => {
    if (chosen || typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setThemeState(systemTheme())
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [chosen])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
