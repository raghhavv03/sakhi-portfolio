import { motion } from 'framer-motion'
import { useReveal } from '../../lib/hooks'
import Badge from '../Badge'

// Layout primitives for the MyFitnessPal case study.
//
// The frame these were extracted from carried its own type ramp, its own
// greys and its own card shape. They now use the site's: `text-h*` / `text-body*`
// for size, `text-text` for every heading and `text-text-muted` for every
// paragraph, label and caption. What stays literal from the frame is layout —
// the three section measures (see MEASURES) are sized to the artwork
// exported into them.
//
// Two exceptions to the two-colour rule survive on this page and are marked
// where they appear: the blue framing question (CSQuote) and the two research
// panels' data hues.

// Inline emphasis for case-study prose: **double asterisks** become
// semibold heading ink so the emphasis reads against the muted paragraph.
export function CSRich({ children }) {
  if (typeof children !== 'string') return children
  return children.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    // Odd indices are the captured groups, i.e. the emphasised runs.
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-text">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

// The kicker above a section heading — "Background", "Problem", "Research".
// The same Badge pill Home, About and Contact put above their own headings.
export function CSLabel({ children, className = '' }) {
  const reveal = useReveal()
  if (!children) return null
  return (
    <motion.div {...reveal} className={`w-full ${className}`}>
      <Badge>{children}</Badge>
    </motion.div>
  )
}

// Section heading — the site's h2, identical to SectionHeader's.
export function CSHeading({ children, className = '' }) {
  const reveal = useReveal()
  return (
    <motion.h2
      {...reveal}
      className={`w-full text-h2 font-semibold text-text ${className}`}
    >
      {children}
    </motion.h2>
  )
}

// Card title — literature and signal cards, and the fact sheet's field names.
export function CSSubheading({ children, as = 'h3', className = '' }) {
  const Tag = motion[as]
  const reveal = useReveal()
  return (
    <Tag {...reveal} className={`text-h3 font-semibold text-text ${className}`}>
      {children}
    </Tag>
  )
}

// A section: one of the page's three measures, centred, stacking on the site's
// 24px rhythm. `prose` is the default and carries every text and card-grid
// section; the two wider ones exist only where artwork needs the room.
const MEASURES = {
  prose: 'max-w-cs-prose',
  wide: 'max-w-cs-wide',
  full: 'max-w-cs-full',
}

export function CSSection({ id, width = 'prose', children, className = '' }) {
  return (
    <section
      id={id}
      className={`mx-auto flex w-full scroll-mt-28 flex-col items-center gap-6 ${MEASURES[width]} ${className}`}
    >
      {children}
    </section>
  )
}

// Body copy — the site's paragraph, on the muted ink.
export function CSBody({ paragraphs, className = '' }) {
  const reveal = useReveal()
  if (!paragraphs?.length) return null
  return (
    <div className={`flex w-full flex-col gap-6 ${className}`}>
      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          {...reveal}
          className="w-full text-body font-normal text-text-muted"
        >
          <CSRich>{p}</CSRich>
        </motion.p>
      ))}
    </div>
  )
}

// Disc list at body size, 24px marker indent.
export function CSList({ items, className = '' }) {
  const reveal = useReveal()
  if (!items?.length) return null
  return (
    <motion.ul
      {...reveal}
      className={`w-full list-disc pl-6 text-body font-normal text-text-muted ${className}`}
    >
      {items.map((item, i) => (
        <li key={i}>
          <CSRich>{item}</CSRich>
        </li>
      ))}
    </motion.ul>
  )
}

// The card this page reuses everywhere: literature findings, the signal
// cards, the testing outcomes, the strong/weak columns, every callout. Same
// shape as About's interest cards — white on a hairline, 16px radius, 24px
// padding — so a card reads the same on every route.
export function CSCard({ children, className = '', style, delay = 0 }) {
  const reveal = useReveal()
  return (
    <motion.div
      {...reveal}
      transition={reveal.transition ? { ...reveal.transition, delay } : undefined}
      style={style}
      className={`rounded-2xl border border-border bg-surface p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// A titled callout card — a plain label line, then the body. Used for the
// test task, the "what this does not prove" caveat, and "most important
// question". Both lines are ordinary body copy; the test-task card is the one
// instance set as a single block with no gap at all.
export function CSCallout({ lines, gap = true, className = '' }) {
  if (!lines?.length) return null
  return (
    <CSCard
      className={`flex flex-col items-center justify-center ${
        gap ? 'gap-2.5' : ''
      } ${className}`}
    >
      {lines.map((line, i) => (
        <p key={i} className="w-full text-body font-normal text-text-muted">
          <CSRich>{line}</CSRich>
        </p>
      ))}
    </CSCard>
  )
}

// The framing question the case study answers. **Colour exception**: the one
// place the subject's blue fills a surface and tints its text, so the question
// the whole page hangs on is unmissable.
export function CSQuote({ children }) {
  const reveal = useReveal()
  return (
    <motion.div
      {...reveal}
      className="flex w-full items-start gap-6 rounded-2xl bg-cs-quote/20 p-6"
    >
      <span className="flex w-[50px] shrink-0 flex-col items-start pt-1">
        <img
          src="/images/myfitnesspal/quote-mark.svg"
          alt=""
          aria-hidden="true"
          width={50}
          height={37.5}
          className="block h-[37.5px] w-[50px]"
        />
      </span>
      <p className="min-w-0 flex-1 text-lead font-semibold text-cs-quote">
        {children}
      </p>
    </motion.div>
  )
}

// Numbered literature findings — "01 / title / body", a hairline-divided
// citation pinned to the card's foot. 460px is the minimum height that keeps
// the three citations aligned; cards grow together when a citation wraps.
export function CSLiteratureCards({ items, className = '' }) {
  return (
    <div className={`grid gap-6 md:grid-cols-3 ${className}`}>
      {items.map((item, i) => (
        <CSCard
          key={item.title}
          delay={i * 0.07}
          className="flex h-full min-h-0 flex-col items-center justify-between gap-4 md:min-h-[460px]"
        >
          <div className="flex w-full min-w-0 flex-col items-start gap-4">
            <p className="text-body font-semibold text-text">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="w-full text-h3 font-semibold text-text">{item.title}</h3>
            <p className="w-full text-body font-normal text-text-muted">
              <CSRich>{item.body}</CSRich>
            </p>
          </div>
          {item.citation && (
            <div className="mt-auto flex w-full shrink-0 items-center justify-center border-t border-border pt-4">
              <p className="min-w-0 flex-1 text-body-sm font-normal text-text-muted">
                {item.citation}
              </p>
            </div>
          )}
        </CSCard>
      ))}
    </div>
  )
}

// A prediction-signal card — a small kicker, the signal's name at card-title
// size, and what it means. Recency / Day / Time.
export function CSSignalCards({ items, className = '' }) {
  return (
    <div className={`grid gap-6 md:grid-cols-3 ${className}`}>
      {items.map((item, i) => (
        <CSCard key={item.title} delay={i * 0.07} className="flex flex-col items-center">
          <div className="flex w-full flex-col items-start gap-4">
            <p className="text-body-sm font-normal text-text-muted">{item.kicker}</p>
            <p className="w-full text-h3 font-semibold text-text">{item.title}</p>
            <p className="w-full text-body font-normal text-text-muted">{item.body}</p>
          </div>
        </CSCard>
      ))}
    </div>
  )
}

// A big-value outcome card — "Every user" / "A third" — the value at section
// heading size over its explanation.
export function CSResultCards({ items, className = '' }) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {items.map((item, i) => (
        <CSCard
          key={item.value}
          delay={i * 0.07}
          className="flex flex-col items-center justify-center gap-2.5"
        >
          <p className="w-full text-h2 font-semibold text-text">{item.value}</p>
          <p className="w-full text-body font-normal text-text-muted">
            <CSRich>{item.label}</CSRich>
          </p>
        </CSCard>
      ))}
    </div>
  )
}

// Strong / weak — two columns, a card title over stacked prose.
export function CSCompareColumns({ columns, className = '' }) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {columns.map((column, i) => (
        <CSCard
          key={column.label}
          delay={i * 0.07}
          className="flex flex-col items-start gap-4"
        >
          <p className="text-h3 font-semibold text-text">{column.label}</p>
          <div className="flex w-full flex-col gap-4">
            {column.body.map((p, j) => (
              <p key={j} className="w-full text-body font-normal text-text-muted">
                <CSRich>{p}</CSRich>
              </p>
            ))}
          </div>
        </CSCard>
      ))}
    </div>
  )
}
