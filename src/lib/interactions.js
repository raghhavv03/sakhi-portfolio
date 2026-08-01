// One hover, one size, one colour rule for every call to action on the site —
// the pill `Button`, the header theme toggle, and the footer's round icon
// buttons all assemble themselves out of the strings below, so they cannot
// drift apart. The contact form's submit is an action button and uses
// `ACTION_HOVER_GLASS` instead of a CTA fill/unfill pair.
//
// The motion is a colour move and nothing else: no zoom, no lift, no shadow,
// no pointer-tracking drift.
//
// Deliberately CSS rather than a Framer `whileHover`: half these controls are
// plain <button>/<a> elements, and one mechanism for all of them is the only
// way "consistent" stays true when a new control is added.
export const CTA_HOVER =
  'transition-[color,background-color,border-color,backdrop-filter] duration-200 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2'

// The one size every CTA is: a 44px-minimum pill, the body-sm size at the
// semibold weight. A control that carries a word imports this; a control that
// carries only a glyph imports `CTA_ICON` instead, which is the same 44px box
// made square.
// `py-2` under the 44px floor on purpose: at body-sm the padding alone would
// make the pill 47px, three taller than the icon buttons standing next to it
// in the header. Letting `min-h` set the height is what makes one row.
export const CTA_SHAPE =
  'inline-flex items-center justify-center gap-2 rounded-full ' +
  'min-h-[44px] px-6 py-2 text-body-sm font-semibold whitespace-nowrap'

export const CTA_ICON =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-full'

// Outlined control fills with `text` and flips its label to `bg` on hover —
// the theme's own ink, not a third colour. Measured: 16.3:1 light, 15.3:1 dark.
export const CTA_HOVER_FILL =
  'hover:border-text hover:bg-text hover:text-bg'

// Contact submit is an action button, not a nav CTA — it rests filled (same
// ink pairing as a hovered CTA) and on hover softens to a glassy wash of that
// fill rather than emptying to outline. Opacity + backdrop blur only; label
// stays `bg`. Works in both themes because the fill is still `text`.
export const ACTION_HOVER_GLASS =
  'hover:border-text/50 hover:bg-text/70 hover:text-bg hover:backdrop-blur-md'
