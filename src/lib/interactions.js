// One hover for every call to action on the site — the pill buttons, the
// header theme toggle and the footer's round icon buttons all import this
// string, so they cannot drift apart.
//
// It is a small zoom and nothing else: no lift, no shadow, no pointer-tracking
// drift. Transform is GPU-cheap, so the same class is safe on a 14px icon
// button and a full-width pill. Colour comes from `accent`, the site's one
// hover token, whose *value* is per-theme — so the hover follows the theme
// without a single `dark:` class.
//
// Deliberately CSS rather than a Framer `whileHover`: the icon buttons are
// plain <button>/<a> elements, and one mechanism for all of them is the only
// way "consistent" stays true when a new control is added.
export const CTA_HOVER =
  'transition-[color,background-color,border-color,transform] duration-200 ease-out ' +
  'hover:scale-[1.03] active:scale-[0.98] ' +
  'motion-reduce:hover:scale-100 motion-reduce:active:scale-100 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2'

// The hover paint itself, shared by the outlined pill, the theme toggle and the
// icon buttons: the accent fills, the border matches it so the hairline does
// not cut the fill, and the ink lands on the heading colour.
export const CTA_HOVER_FILL =
  'hover:border-accent hover:bg-accent hover:text-text'
