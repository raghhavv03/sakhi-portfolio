import { useParams, Navigate, Link } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { projects } from '../data/portfolio'
import { useReveal } from '../lib/hooks'
import Badge from '../components/Badge'
import SectionHeader from '../components/SectionHeader'

// Thin reading-progress bar pinned above the header. Case studies are the
// only long-form pages, so this is the one place a progress indicator earns
// its keep. Scroll-linked scaleX — no animation loop, no layout work.
function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-text"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

// Case-study template (/work/:slug). Leads with the problem and the result,
// then walks the process: contribution → key decisions → outcomes. Alternates
// full-width process visuals with outcome screens. Reads from portfolio.js so
// the same template renders every project.
export default function CaseStudy() {
  const { slug } = useParams()
  const reveal = useReveal()
  const project = projects.find((p) => p.slug === slug)

  // Unknown slug or a project without a published case study → home.
  if (!project || !project.caseStudy) return <Navigate to="/" replace />

  const cs = project.caseStudy

  return (
    <article className="mx-auto max-w-content px-6 py-section-sm md:py-section-md lg:py-section">
      <ReadingProgress />
      <BackHome />

      {/* Title block */}
      <header className="mt-8 max-w-3xl">
        <Badge>Case study</Badge>
        <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
          {cs.title}
        </h1>
        {cs.tagline && (
          <p className="mt-4 text-lg font-normal leading-body text-text-muted">
            {cs.tagline}
          </p>
        )}
        {cs.meta?.length > 0 && (
          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-border pt-6">
            {cs.meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs font-normal text-text-muted">{m.label}</dt>
                <dd className="mt-1 text-sm font-semibold">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {/* Lead: problem + result side by side, before any process detail. */}
      <Reveal className="mt-12 grid gap-8 rounded-2xl border border-border bg-surface p-6 sm:p-8 md:grid-cols-2 md:gap-12">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            The challenge
          </h2>
          <p className="mt-3 text-lg font-normal leading-body">{cs.challenge}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            The result
          </h2>
          <p className="mt-3 text-lg font-normal leading-body">{cs.result}</p>
        </div>
      </Reveal>

      {/* Headline metrics */}
      {cs.metrics?.length > 0 && (
        <Reveal className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cs.metrics.map((metric, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="text-3xl font-semibold leading-none">
                {metric.value}
              </div>
              <div className="mt-2 text-sm font-normal text-text-muted">
                {metric.label}
              </div>
            </div>
          ))}
        </Reveal>
      )}

      {/* Full-width cover visual */}
      <Visual src={cs.images?.cover} alt={`${cs.title} — overview`} className="mt-12" />

      {/* My contribution */}
      <section className="mt-section-sm md:mt-section-md lg:mt-section">
        <SectionHeader badge="My contribution" heading="What I did" />
        <Reveal className="mt-6 max-w-3xl">
          <p className="text-base font-normal leading-body text-text-muted">
            {cs.contribution}
          </p>
        </Reveal>
      </section>

      {/* Process visuals (full-width, alternating with outcomes below) */}
      <VisualRow images={cs.images?.process} label="process" className="mt-12" />

      {/* Key decisions + reasoning */}
      {cs.decisions?.length > 0 && (
        <section className="mt-section-sm md:mt-section-md lg:mt-section">
          <SectionHeader
            badge="Key decisions"
            heading="Decisions & the reasoning"
          />
          <ol className="mt-8 max-w-3xl space-y-px overflow-hidden rounded-2xl border border-border">
            {cs.decisions.map((d, i) => (
              <motion.li
                {...reveal}
                key={i}
                className="flex gap-5 bg-surface p-6"
              >
                <span className="text-sm font-semibold text-text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-tight">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm font-normal leading-body text-text-muted">
                    {d.reasoning}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </section>
      )}

      {/* Measurable outcomes + outcome screens */}
      <section className="mt-section-sm md:mt-section-md lg:mt-section">
        <SectionHeader badge="Outcomes" heading="Measurable impact" />
        <Reveal className="mt-6 max-w-3xl">
          <p className="text-base font-normal leading-body text-text-muted">
            {cs.outcomes}
          </p>
        </Reveal>
      </section>

      <VisualRow images={cs.images?.outcomes} label="outcome" className="mt-12" />

      {/* Closing back-home affordance */}
      <div className="mt-section-sm md:mt-section-md lg:mt-section">
        <BackHome />
      </div>
    </article>
  )
}

// Prominent back-to-home control. Its visible label is self-explanatory, so it
// carries no custom-cursor pill.
function BackHome() {
  return (
    <Link
      to="/"
      className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-text"
    >
      {/* Arrow nudges 2px left on hover — points where you'll go. */}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:group-hover:translate-x-0"
      >
        ←
      </span>
      Back to home
    </Link>
  )
}

// Reveal wrapper (reduced-motion aware) for block content.
function Reveal({ children, className }) {
  const reveal = useReveal()
  return (
    <motion.div {...reveal} className={className}>
      {children}
    </motion.div>
  )
}

// Single full-width visual. Renders an <img> when a src exists, otherwise a
// labelled placeholder slot that preserves the aspect ratio (no layout shift).
function Visual({ src, alt, ratio = 'aspect-[16/9]', className = '' }) {
  return (
    <Reveal className={className}>
      {src ? (
        <img
          src={src}
          alt={alt}
          width="1200"
          height="675"
          loading="lazy"
          className={`w-full rounded-2xl border border-border object-cover ${ratio}`}
        />
      ) : (
        <div
          aria-hidden="true"
          className={`flex w-full items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-border to-surface text-xs font-normal text-text-muted ${ratio}`}
        >
          [{alt}]
        </div>
      )}
    </Reveal>
  )
}

// A row of up to two visuals (outcome screens). Falls back to placeholder tiles.
function VisualRow({ images, label, className = '' }) {
  const slots = images && images.length ? images : ['', '']
  return (
    <Reveal className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {slots.map((src, i) =>
        src ? (
          <img
            key={i}
            src={src}
            alt={`${label} ${i + 1}`}
            width="800"
            height="600"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl border border-border object-cover"
          />
        ) : (
          <div
            key={i}
            aria-hidden="true"
            className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-border to-surface text-xs font-normal text-text-muted"
          >
            [{label} visual]
          </div>
        )
      )}
    </Reveal>
  )
}
