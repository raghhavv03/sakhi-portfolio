import { motion } from 'framer-motion'
import { useReveal } from '../../lib/hooks'

// Exact-match primitives for the MyFitnessPal case study's Figma frame.
//
// Font is Inter (`font-cs`); type comes from the frame's own Heading/* and
// Text/* variables, added to tailwind.config.js as the `cs-*` scale; colour
// comes from its Content/* variables plus the literal hexes it uses off-token
// (`cs-copy`, `cs-card`, `cs-card-border`). None of this is Sakhi's own
// design language — every other page still uses that — and nothing here is
// reused outside this one case study.
//
// Two rhythms run through the whole frame and are the reason these primitives
// exist at all: 104px between sections (`gap-cs-gap`) and 24px between every
// stacked block inside one (`gap-cs-stack`).

// Inline emphasis for case-study prose. The frame sets emphasis in Inter Bold
// at the same #575757 as the surrounding copy — not in a darker semibold, the
// way the rest of the site does — so this is deliberately not `RichText`'s
// `Rich`.
export function CSRich({ children }) {
  if (typeof children !== 'string') return children
  return children.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    // Odd indices are the captured groups, i.e. the emphasised runs.
    i % 2 === 1 ? (
      <strong key={i} className="font-bold">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

// The small label above a section heading — "Background", "Problem",
// "Research". Text/L Regular on Content/tertiary.
export function CSLabel({ children, tone = 'tertiary', className = '' }) {
  const reveal = useReveal()
  return (
    <motion.p
      {...reveal}
      className={`font-cs w-full text-cs-body-l font-normal ${
        tone === 'copy' ? 'text-cs-copy' : 'text-cs-tertiary'
      } ${className}`}
    >
      {children}
    </motion.p>
  )
}

// Heading/L Semibold — every section heading in the frame, 32/40/-1. The one
// exception is Discovery, which rides a 45px line (`loose`).
export function CSHeading({ children, loose = false, className = '' }) {
  const reveal = useReveal()
  return (
    <motion.h2
      {...reveal}
      className={`font-cs w-full ${
        loose ? 'text-cs-l-loose' : 'text-cs-l'
      } font-semibold text-cs-secondary ${className}`}
    >
      {children}
    </motion.h2>
  )
}

// Heading/S Semibold — the fact-sheet rail's field names, and the literature
// cards' titles.
export function CSSubheading({ children, as = 'h3', className = '' }) {
  const Tag = motion[as]
  const reveal = useReveal()
  return (
    <Tag
      {...reveal}
      className={`font-cs text-cs-s font-semibold text-cs-secondary ${className}`}
    >
      {children}
    </Tag>
  )
}

// A section: its own measure, centred on the frame, stacking on the 24px
// rhythm. `width` is the frame's literal measure for that section — they
// differ section to section and are not a mistake.
const MEASURES = {
  593: 'max-w-cs-593',
  880: 'max-w-cs-880',
  928: 'max-w-cs-928',
  948: 'max-w-cs-948',
  1000: 'max-w-cs-1000',
  1004: 'max-w-cs-1004',
  1158: 'max-w-cs-1158',
  1182: 'max-w-cs-1182',
}

export function CSSection({ id, width = 948, children, className = '' }) {
  return (
    <section
      id={id}
      className={`mx-auto flex w-full scroll-mt-28 flex-col items-center gap-cs-stack ${MEASURES[width]} ${className}`}
    >
      {children}
    </section>
  )
}

// Body copy — Text/L Regular at the frame's own 38px line, #575757. This is
// the one paragraph style the frame uses across all of its prose.
export function CSBody({ paragraphs, className = '' }) {
  const reveal = useReveal()
  if (!paragraphs?.length) return null
  return (
    <div className={`flex w-full flex-col gap-cs-stack ${className}`}>
      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          {...reveal}
          className="font-cs w-full text-cs-body-xl font-normal text-cs-copy"
        >
          <CSRich>{p}</CSRich>
        </motion.p>
      ))}
    </div>
  )
}

// Disc list on the same 38px line as the body copy, 24px marker indent.
export function CSList({ items, className = '' }) {
  const reveal = useReveal()
  if (!items?.length) return null
  return (
    <motion.ul
      {...reveal}
      className={`font-cs w-full list-disc pl-6 text-cs-body-xl font-normal text-cs-copy ${className}`}
    >
      {items.map((item, i) => (
        <li key={i}>
          <CSRich>{item}</CSRich>
        </li>
      ))}
    </motion.ul>
  )
}

// The neutral card the frame reuses everywhere: literature findings, the
// signal cards, the testing outcomes, the strong/weak columns, every callout.
// One shape — #fafafa on a #e7e7e7 hairline, 20px radius, 30/20 padding.
export function CSCard({ children, className = '', style, delay = 0 }) {
  const reveal = useReveal()
  return (
    <motion.div
      {...reveal}
      transition={reveal.transition ? { ...reveal.transition, delay } : undefined}
      style={style}
      className={`rounded-[20px] border border-cs-card-border bg-cs-card px-[30px] py-5 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// A titled callout card — a plain label line, then the body. Used for the
// test task, the "what this does not prove" caveat, and "most important
// question". Both lines are ordinary body copy in the frame; the 10px gap is
// all that separates them, and the test-task card is the one instance the
// frame sets as a single text block with no gap at all.
export function CSCallout({ lines, gap = true, className = '' }) {
  if (!lines?.length) return null
  return (
    <CSCard
      className={`flex flex-col items-center justify-center ${
        gap ? 'gap-2.5' : ''
      } ${className}`}
    >
      {lines.map((line, i) => (
        <p
          key={i}
          className="font-cs w-full text-cs-body-xl font-normal text-cs-copy"
        >
          <CSRich>{line}</CSRich>
        </p>
      ))}
    </CSCard>
  )
}

// The framing question the case study answers — the one place the product's
// blue fills a surface, with the frame's own quote glyph.
export function CSQuote({ children }) {
  const reveal = useReveal()
  return (
    <motion.div
      {...reveal}
      className="flex w-full items-start gap-cs-stack rounded-[20px] bg-[rgba(2,120,254,0.2)] px-[35px] py-[25px]"
    >
      <span className="flex w-[50px] shrink-0 flex-col items-start pt-2.5">
        <img
          src="/images/myfitnesspal/quote-mark.svg"
          alt=""
          aria-hidden="true"
          width={50}
          height={37.5}
          className="block h-[37.5px] w-[50px]"
        />
      </span>
      <p className="font-cs min-w-0 flex-1 text-cs-question font-semibold text-cs-quote">
        {children}
      </p>
    </motion.div>
  )
}

// Numbered literature findings — "01 / title / body", a hairline-divided
// citation pinned to the card's foot. 460px is the frame's minimum height so
// the three citations line up; cards grow together when a citation wraps.
export function CSLiteratureCards({ items, className = '' }) {
  return (
    <div className={`grid gap-cs-stack md:grid-cols-3 ${className}`}>
      {items.map((item, i) => (
        <CSCard
          key={item.title}
          delay={i * 0.07}
          className="flex h-full min-h-0 flex-col items-center justify-between gap-4 md:min-h-[460px]"
        >
          <div className="flex w-full min-w-0 flex-col items-start gap-4">
            <p className="font-cs text-cs-body-xl font-bold text-cs-copy">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="font-cs w-full text-cs-s font-semibold text-cs-secondary">
              {item.title}
            </h3>
            <p className="font-cs w-full text-cs-body-xl font-normal text-cs-copy">
              <CSRich>{item.body}</CSRich>
            </p>
          </div>
          {item.citation && (
            <div className="mt-auto flex w-full shrink-0 items-center justify-center border-t-[0.5px] border-cs-border-2 pt-2.5">
              <p className="font-cs min-w-0 flex-1 text-cs-body-m font-normal text-cs-copy">
                {item.citation}
              </p>
            </div>
          )}
        </CSCard>
      ))}
    </div>
  )
}

// A prediction-signal card — a small kicker, the signal's name at heading
// size, and what it means. Recency / Day / Time.
export function CSSignalCards({ items, className = '' }) {
  return (
    <div className={`grid gap-cs-stack md:grid-cols-3 ${className}`}>
      {items.map((item, i) => (
        <CSCard key={item.title} delay={i * 0.07} className="flex flex-col items-center">
          <div className="flex w-full flex-col items-start gap-4">
            <p className="font-cs text-cs-body-m font-normal text-cs-copy">
              {item.kicker}
            </p>
            <p className="font-cs w-full text-cs-l font-semibold text-cs-secondary">
              {item.title}
            </p>
            <p className="font-cs w-full text-cs-body-xl font-normal text-cs-copy">
              {item.body}
            </p>
          </div>
        </CSCard>
      ))}
    </div>
  )
}

// A big-value outcome card — "Every user" / "A third" — the value at heading
// size over its explanation.
export function CSResultCards({ items, className = '' }) {
  return (
    <div className={`grid gap-cs-stack md:grid-cols-2 ${className}`}>
      {items.map((item, i) => (
        <CSCard
          key={item.value}
          delay={i * 0.07}
          className="flex flex-col items-center justify-center gap-2.5"
        >
          <p className="font-cs w-full text-cs-l font-semibold text-cs-secondary">
            {item.value}
          </p>
          <p className="font-cs w-full text-cs-body-xl font-normal text-cs-copy">
            <CSRich>{item.label}</CSRich>
          </p>
        </CSCard>
      ))}
    </div>
  )
}

// Strong / weak — two columns, a plain 20px label over stacked prose.
export function CSCompareColumns({ columns, className = '' }) {
  return (
    <div className={`grid gap-cs-stack md:grid-cols-2 ${className}`}>
      {columns.map((column, i) => (
        <CSCard key={column.label} delay={i * 0.07} className="flex flex-col items-start gap-2">
          <p className="font-cs text-cs-label-xl font-normal text-cs-copy">
            {column.label}
          </p>
          <div className="flex w-full flex-col">
            {column.body.map((p, j) => (
              <p
                key={j}
                className="font-cs w-full text-cs-body-xl font-normal text-cs-copy"
              >
                <CSRich>{p}</CSRich>
              </p>
            ))}
          </div>
        </CSCard>
      ))}
    </div>
  )
}
