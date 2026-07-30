// One hover, one size, one colour rule for every call to action on the site —
// the pill `Button`, the header theme toggle, the footer's round icon buttons
// and the contact form's submit all assemble themselves out of the strings
// below, so they cannot drift apart.
//
// The motion is a colour move and nothing else: no zoom, no lift, no shadow,
// no pointer-tracking drift.
//
// Deliberately CSS rather than a Framer `whileHover`: half these controls are
// plain <button>/<a> elements, and one mechanism for all of them is the only
// way "consistent" stays true when a new control is added.
export const CTA_HOVER =
  'transition-[color,background-color,border-color] duration-200 ease-out ' +
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

// ── The hover paint. It is the theme's own ink, not a third colour: an
//    outlined control fills with `text` and flips its label to `bg`, which is
//    exactly the pairing the primary pill and the cursor pill already rest at.
//    So the hover follows the theme without a single `dark:` class, and the
//    site never grows a hover hue that only exists on hover.
//
//    Measured on the hovered fill: 16.3:1 light, 15.3:1 dark.
export const CTA_HOVER_FILL =
  'hover:border-text hover:bg-text hover:text-bg'

// The filled pill already rests on that pairing, so it cannot hover *to* it.
// It softens to the body ink instead — same two-colour palette, same direction
// of travel, still no new hue. Measured: 8.9:1 light, 8.8:1 dark.
export const CTA_HOVER_FILL_SOLID =
  'hover:border-text-muted hover:bg-text-muted hover:text-bg'
