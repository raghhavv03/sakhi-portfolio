import { motion } from 'framer-motion'
import { useReveal } from '../../lib/hooks'
import RichText, { Rich } from '../RichText'
import SectionHeader from '../SectionHeader'

// Shared building blocks for the case-study template. Everything here is
// layout-only: the copy arrives from portfolio.js, and the visual language
// (hairline surfaces, neutral badges, one pastel-blue accent) is the same set
// the rest of the site uses.

// A numbered narrative section with its anchor id and scroll offset for the
// fixed header and the contents rail.
export function Section({ id, badge, heading, children, className = '' }) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 pt-section-sm md:pt-section-md lg:pt-section ${className}`}
    >
      {(badge || heading) && <SectionHeader badge={badge} heading={heading} />}
      {children}
    </section>
  )
}

// Two side-by-side statement cards — used for the two problems and the two
// solutions, where the pairing is the point.
export function PairCards({ items }) {
  const reveal = useReveal()
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2">
      {items.map((item, i) => (
        <motion.div
          {...reveal}
          transition={{ ...reveal.transition, delay: i * 0.07 }}
          key={item.title}
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          {item.eyebrow && (
            <p className="text-xs font-normal text-text-muted">{item.eyebrow}</p>
          )}
          <h3 className="mt-2 text-xl font-semibold leading-tight">
            {item.title}
          </h3>
          <p className="mt-3 text-base font-normal leading-body text-text-muted">
            <Rich>{item.body}</Rich>
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// A grid of short supporting cards — friction types, prediction signals,
// literature findings. `columns` controls the desktop count.
export function InfoCards({ items, columns = 3, numbered = false, className = '' }) {
  const reveal = useReveal()
  const grid =
    columns === 2
      ? 'sm:grid-cols-2'
      : columns === 4
        ? 'sm:grid-cols-2 lg:grid-cols-4'
        : 'sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid gap-5 ${grid} ${className}`}>
      {items.map((item, i) => (
        <motion.div
          {...reveal}
          transition={{ ...reveal.transition, delay: i * 0.06 }}
          key={item.title}
          className="flex flex-col rounded-2xl border border-border bg-surface p-6"
        >
          {numbered ? (
            <span className="text-sm font-semibold text-text-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
          ) : (
            item.weight && (
              <span className="text-xs font-normal text-text-muted">
                {item.weight}
              </span>
            )
          )}
          <h3 className="mt-3 text-lg font-semibold leading-tight">
            {item.title}
          </h3>
          <p className="mt-2 flex-1 text-sm font-normal leading-body text-text-muted">
            <Rich>{item.body}</Rich>
          </p>
          {item.citation && (
            <p className="mt-4 border-t border-border pt-3 text-xs font-normal text-text-muted">
              {item.citation}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// The one place pastel blue fills a surface: the framing question the whole
// case study answers. Large, quiet, and unmissable.
export function Question({ children, className = '' }) {
  const reveal = useReveal()
  return (
    <motion.blockquote
      {...reveal}
      className={`rounded-2xl border border-accent bg-accent/20 p-6 sm:p-10 ${className}`}
    >
      <p className="text-xl font-semibold leading-tight sm:text-2xl">
        {children}
      </p>
    </motion.blockquote>
  )
}

// A labelled aside — the test scenario, the accuracy caveat. Neutral, so it
// reads as a footnote to the argument rather than a second headline.
export function Note({ label, title, children, className = '' }) {
  const reveal = useReveal()
  return (
    <motion.aside
      {...reveal}
      className={`rounded-2xl border border-border bg-surface p-6 sm:p-8 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </p>
      {title && (
        <p className="mt-3 text-lg font-semibold leading-tight">{title}</p>
      )}
      <p className="mt-2 text-sm font-normal leading-body text-text-muted">
        <Rich>{children}</Rich>
      </p>
    </motion.aside>
  )
}

// Big-number facts sitting inside a narrative section (registered users,
// test results) rather than in the headline metric row.
export function StatRow({ stats, className = '' }) {
  const reveal = useReveal()
  return (
    <motion.dl
      {...reveal}
      className={`grid gap-5 sm:grid-cols-2 ${className}`}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-border bg-surface p-6">
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span className="block text-3xl font-semibold leading-none">
              {stat.value}
            </span>
            <span className="mt-2 block text-sm font-normal leading-body text-text-muted">
              <Rich>{stat.label}</Rich>
            </span>
          </dd>
        </div>
      ))}
    </motion.dl>
  )
}

// Two stacked prose columns for a strengths / limits comparison.
export function CompareColumns({ columns, className = '' }) {
  const reveal = useReveal()
  return (
    <div className={`grid gap-5 md:grid-cols-2 ${className}`}>
      {columns.map((column, i) => (
        <motion.div
          {...reveal}
          transition={{ ...reveal.transition, delay: i * 0.07 }}
          key={column.label}
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {column.label}
          </h3>
          <RichText paragraphs={column.body} className="mt-4" size="base" />
        </motion.div>
      ))}
    </div>
  )
}

// Sub-heading inside a section, for the beats that don't warrant their own
// badge but still break the argument into readable parts.
export function Subheading({ children, className = '' }) {
  const reveal = useReveal()
  return (
    <motion.h3
      {...reveal}
      className={`max-w-2xl text-2xl font-semibold leading-tight sm:text-3xl ${className}`}
    >
      {children}
    </motion.h3>
  )
}
