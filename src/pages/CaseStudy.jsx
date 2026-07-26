import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { projects } from '../data/portfolio'
import { useReveal, useActiveSection } from '../lib/hooks'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Magnetic from '../components/Magnetic'
import Figure from '../components/Figure'
import Lightbox from '../components/Lightbox'
import RichText, { Rich } from '../components/RichText'
import SentimentPanel from '../components/charts/SentimentPanel'
import FrictionChart from '../components/charts/FrictionChart'
import {
  Section,
  PairCards,
  InfoCards,
  Question,
  Note,
  StatRow,
  CompareColumns,
  Subheading,
} from '../components/casestudy/Blocks'

// The contents rail, in reading order. Ids are duplicated on the sections
// below; keeping the list here (rather than deriving it) means the rail can be
// reordered without touching the narrative.
const CONTENTS = [
  { id: 'background', label: 'Background' },
  { id: 'problem', label: 'Problem' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'solution', label: 'Solution' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'research', label: 'Research' },
  { id: 'today-screen', label: 'Today screen' },
  { id: 'repeat-logging', label: 'Repeat logging' },
  { id: 'testing', label: 'Testing' },
]

// Case-study template (/work/:slug). Leads with the problem and the result,
// then walks the argument: background → problem → challenge → solution →
// discovery → research → the two design solutions → testing. Every string comes
// from portfolio.js, so the same template renders any project written to that
// shape; sections whose data is absent simply don't render.
export default function CaseStudy() {
  const { slug } = useParams()
  const [lightbox, setLightbox] = useState(null)
  const project = projects.find((p) => p.slug === slug)

  // Unknown slug or a project without a published case study → home.
  if (!project || !project.caseStudy) return <Navigate to="/" replace />

  const cs = project.caseStudy
  const openFigure = (figure) => setLightbox(figure)

  return (
    <article className="mx-auto max-w-content px-6 py-section-sm md:py-section-md lg:py-section">
      <ReadingProgress />
      <BackHome />

      {/* Title block */}
      <header className="mt-8 max-w-4xl">
        <Badge>Case study</Badge>
        {cs.appIcon?.src ? (
          <div className="mt-5 flex items-center gap-4 sm:gap-5">
            <AppIcon icon={cs.appIcon} />
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {cs.title}
            </h1>
          </div>
        ) : (
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {cs.title}
          </h1>
        )}
        {cs.tagline && (
          <p className="mt-5 max-w-3xl text-lg font-normal leading-body text-text-muted sm:text-xl">
            {cs.tagline}
          </p>
        )}
        {cs.meta?.length > 0 && (
          <dl className="mt-10 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
            {cs.meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs font-normal text-text-muted">{m.label}</dt>
                <dd className="mt-1.5 text-sm font-semibold leading-snug">
                  {m.value}
                </dd>
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
        <Reveal className="mt-5 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {cs.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="text-3xl font-semibold leading-none sm:text-4xl">
                {metric.value}
              </div>
              <div className="mt-2 text-sm font-normal leading-body text-text-muted">
                {metric.label}
              </div>
            </div>
          ))}
        </Reveal>
      )}

      {/* Narrative + contents rail */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_170px] lg:gap-14">
        <div className="min-w-0">
          {/* 1 — Background */}
          {cs.background && (
            <Section
              id="background"
              badge={cs.background.badge}
              heading={cs.background.heading}
            >
              <RichText
                paragraphs={cs.background.body}
                className="mt-6 max-w-3xl"
              />
              {cs.background.pullQuote && (
                <Reveal className="mt-8 max-w-3xl border-l-2 border-text pl-6">
                  <p className="text-xl font-semibold leading-tight sm:text-2xl">
                    {cs.background.pullQuote}
                  </p>
                </Reveal>
              )}
              {cs.background.stats && (
                <StatRow stats={cs.background.stats} className="mt-8" />
              )}
            </Section>
          )}

          {/* 2 — Problem */}
          {cs.problem && (
            <Section
              id="problem"
              badge={cs.problem.badge}
              heading={cs.problem.heading}
            >
              <PairCards items={cs.problem.items} />
            </Section>
          )}

          {/* 3 — Design challenge */}
          {cs.designChallenge && (
            <Section
              id="challenge"
              badge={cs.designChallenge.badge}
              heading={cs.designChallenge.heading}
            >
              <RichText
                paragraphs={cs.designChallenge.body}
                className="mt-6 max-w-3xl"
              />
              <Question className="mt-8">{cs.designChallenge.question}</Question>
            </Section>
          )}

          {/* 4 — Solution preview */}
          {cs.solution && (
            <Section
              id="solution"
              badge={cs.solution.badge}
              heading={cs.solution.heading}
            >
              <PairCards items={cs.solution.items} />
            </Section>
          )}

          {/* 5 — Discovery */}
          {cs.discovery && (
            <Section
              id="discovery"
              badge={cs.discovery.badge}
              heading={cs.discovery.heading}
            >
              <RichText
                paragraphs={cs.discovery.body}
                className="mt-6 max-w-3xl"
              />
              <div className="mt-8 space-y-8">
                {cs.discovery.figures.map((figure) => (
                  <Figure
                    key={figure.src}
                    figure={figure}
                    onOpen={openFigure}
                    padded={false}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* 6 — Research */}
          {cs.research && (
            <Section
              id="research"
              badge={cs.research.badge}
              heading={cs.research.heading}
            >
              <RichText
                paragraphs={cs.research.intro}
                className="mt-6 max-w-3xl"
              />

              <div className="mt-10">
                <SentimentPanel data={cs.research.sentiment} />
              </div>
              <RichText
                paragraphs={cs.research.sentimentBody}
                className="mt-8 max-w-3xl"
              />

              <div className="mt-12">
                <FrictionChart data={cs.research.chart} />
              </div>

              <Subheading className="mt-16">
                {cs.research.frictionHeading}
              </Subheading>
              <RichText
                paragraphs={cs.research.frictionIntro}
                className="mt-4 max-w-3xl"
              />
              <InfoCards
                items={cs.research.frictionTypes}
                columns={4}
                className="mt-8"
              />
              <RichText
                paragraphs={cs.research.frictionConclusion}
                className="mt-8 max-w-3xl"
              />

              <Subheading className="mt-16">
                {cs.research.literatureHeading}
              </Subheading>
              <RichText
                paragraphs={cs.research.literatureIntro}
                className="mt-4 max-w-3xl"
              />
              <InfoCards
                items={cs.research.literature}
                columns={3}
                numbered
                className="mt-8"
              />

              <Subheading className="mt-16">
                {cs.research.synthesisHeading}
              </Subheading>
              <RichText
                paragraphs={cs.research.synthesis}
                className="mt-4 max-w-3xl"
              />
            </Section>
          )}

          {/* 7 — Solution 1: the Today screen */}
          {cs.todayScreen && (
            <Section
              id="today-screen"
              badge={cs.todayScreen.badge}
              heading={cs.todayScreen.heading}
            >
              <Reveal className="mt-6">
                <p className="text-sm font-semibold text-text-muted">
                  {cs.todayScreen.eyebrow}
                </p>
              </Reveal>
              <ol className="mt-8 space-y-12">
                {cs.todayScreen.steps.map((step, i) => (
                  <li key={step.title}>
                    <Reveal className="max-w-3xl">
                      <div className="flex gap-5">
                        <span className="pt-1 text-sm font-semibold text-text-muted">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold leading-tight">
                            {step.title}
                          </h3>
                          <p className="mt-3 text-base font-normal leading-body text-text-muted">
                            <Rich>{step.body}</Rich>
                          </p>
                        </div>
                      </div>
                    </Reveal>
                    {step.figure && (
                      <Figure
                        figure={step.figure}
                        onOpen={openFigure}
                        className="mt-8"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {/* 8 — Solution 2: repeat logging */}
          {cs.repeatLogging && (
            <Section
              id="repeat-logging"
              badge={cs.repeatLogging.badge}
              heading={cs.repeatLogging.heading}
            >
              <Reveal className="mt-6">
                <p className="text-sm font-semibold text-text-muted">
                  {cs.repeatLogging.eyebrow}
                </p>
              </Reveal>
              <RichText
                paragraphs={cs.repeatLogging.intro}
                className="mt-6 max-w-3xl"
                size="lg"
              />

              <InfoCards
                items={cs.repeatLogging.signals}
                columns={3}
                className="mt-10"
              />

              {/* Placement: the argument beside the screen it produced. */}
              <Subheading className="mt-16">
                {cs.repeatLogging.placement.heading}
              </Subheading>
              <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
                <RichText paragraphs={cs.repeatLogging.placement.body} />
                <Figure
                  figure={cs.repeatLogging.placement.figure}
                  onOpen={openFigure}
                  className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none"
                />
              </div>

              {/* Commit: figure first on desktop, so the pair reads as a beat
                  answering the one above rather than repeating its shape. */}
              <Subheading className="mt-16">
                {cs.repeatLogging.commit.heading}
              </Subheading>
              <div className="mt-8 grid items-start gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
                <Figure
                  figure={cs.repeatLogging.commit.figure}
                  onOpen={openFigure}
                  className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none"
                />
                <RichText paragraphs={cs.repeatLogging.commit.body} />
              </div>

              <Subheading className="mt-16">
                {cs.repeatLogging.limits.heading}
              </Subheading>
              <CompareColumns
                columns={cs.repeatLogging.limits.columns}
                className="mt-8"
              />
            </Section>
          )}

          {/* 9 — Testing */}
          {cs.testing && (
            <Section
              id="testing"
              badge={cs.testing.badge}
              heading={cs.testing.heading}
            >
              <RichText
                paragraphs={cs.testing.intro}
                className="mt-6 max-w-3xl"
              />
              <Note
                label={cs.testing.task.label}
                title={cs.testing.task.value}
                className="mt-8 max-w-3xl"
              >
                {cs.testing.task.note}
              </Note>
              <StatRow stats={cs.testing.results} className="mt-8" />
              <RichText
                paragraphs={cs.testing.body}
                className="mt-8 max-w-3xl"
              />
              <Note
                label={cs.testing.caveat.label}
                className="mt-8 max-w-3xl"
              >
                {cs.testing.caveat.body}
              </Note>
            </Section>
          )}
        </div>

        <Contents />
      </div>

      {/* Closing back-home affordance */}
      <div className="mt-section-sm md:mt-section-md lg:mt-section">
        <BackHome />
      </div>

      <Lightbox figure={lightbox} onClose={() => setLightbox(null)} />
    </article>
  )
}

// The subject product's app icon, as a small rounded tile beside the title.
// Hides itself if the file is missing, so a not-yet-added asset never leaves a
// broken-image box in the masthead.
function AppIcon({ icon }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <img
      src={icon.src}
      alt={icon.alt}
      width="96"
      height="96"
      onError={() => setFailed(true)}
      className="h-14 w-14 shrink-0 rounded-2xl border border-border object-cover sm:h-16 sm:w-16"
    />
  )
}

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

// Sticky contents rail (desktop only — below lg the page is a single column
// and the progress bar carries orientation on its own). Plain anchors, so it
// works without JS and the browser handles the smooth scroll.
function Contents() {
  const active = useActiveSection(CONTENTS.map((c) => c.id))
  return (
    <nav aria-label="On this page" className="hidden lg:block">
      <ul className="sticky top-28 space-y-1 border-l border-border">
        {CONTENTS.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`-ml-px block border-l py-1.5 pl-4 text-sm transition-colors duration-200 ${
                  isActive
                    ? 'border-text font-semibold text-text'
                    : 'border-transparent font-normal text-text-muted hover:text-text'
                }`}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// Prominent back-to-home control. Its visible label is self-explanatory, so it
// carries no custom-cursor pill.
function BackHome() {
  return (
    <Magnetic className="inline-flex">
      <Button variant="secondary" to="/" className="group">
        {/* Arrow nudges 2px left on hover — points where you'll go. */}
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:group-hover:translate-x-0"
        >
          ←
        </span>
        Back to home
      </Button>
    </Magnetic>
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
