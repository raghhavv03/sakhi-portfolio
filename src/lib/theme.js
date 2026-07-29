import { createContext, useContext } from 'react'

// Theme plumbing. The palette itself lives in src/index.css; all this does is
// decide which of the two blocks is active and remember the decision.
//
// Precedence: an explicit choice (the hero lamp or the header toggle, stored
// in localStorage) always wins; with no stored choice the site follows the OS
// and keeps following it if the OS flips mid-session.

export const STORAGE_KEY = 'sakhi-theme'

// Mirrors --bg in each theme — this is the colour the mobile browser chrome
// takes, so it has to move with the canvas.
export const THEME_COLOR = { light: '#FBF9F5', dark: '#0F172A' }

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    // Private mode / storage disabled — fall back to the OS preference.
    return null
  }
}

export function systemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

// The single place that touches the DOM for theming.
export function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLOR[theme])
}
