import { motion } from 'framer-motion'
import { about } from '../data/portfolio'
import { useReveal } from '../lib/hooks'
import SectionHeader from '../components/SectionHeader'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Doodle from '../components/Doodle'

// About — intro, schooling, Crochet Curio passion project, personal interests.
// Intentionally excludes services, an experience timeline, and testimonials.
export default function About() {
  return (
    <div className="mx-auto max-w-content px-6 py-section-sm md:py-section-md lg:py-section">
      {/* A1. Intro */}
      <Intro />

      {/* A2. Schooling / education */}
      <Education />

      {/* A3. Passion project — Crochet Curio */}
      <CrochetCurio />

      {/* A4. Personal interests */}
      <Interests />
    </div>
  )
}

function Intro() {
  const reveal = useReveal()
  return (
    <section className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-14">
      <div>
        <Badge>{about.badge}</Badge>
        <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          {about.statement}
        </h1>
        <p className="mt-6 max-w-xl text-base font-normal leading-body text-text-muted">
          {about.paragraph}
        </p>
      </div>

      {/* Use a distinct portrait on About to avoid repeating the Home hero image. */}
      <motion.div {...reveal}>
        <img
          src="/about-sakhi-saree.png"
          alt="Sakhi smiling in a saree"
          width="892"
          height="1152"
          loading="lazy"
          className="mx-auto h-auto w-full max-w-xs rounded-2xl object-cover md:max-w-[17rem] lg:max-w-sm"
        />
      </motion.div>
    </section>
  )
}

function Education() {
  const reveal = useReveal()
  return (
    <section className="mt-section-sm md:mt-section-md lg:mt-section">
      <SectionHeader badge="Education" heading="[Where I studied]" />
      <ul className="mt-8 max-w-3xl divide-y divide-border border-t border-border">
        {about.education.map((entry, i) => (
          <motion.li
            {...reveal}
            key={i}
            className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <div>
              <p className="text-lg font-semibold leading-tight">
                {entry.institution}
              </p>
              <p className="mt-1 text-sm font-normal text-text-muted">
                {entry.qualification}
              </p>
            </div>
            <span className="shrink-0 text-sm font-normal text-text-muted">
              {entry.years}
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

function CrochetCurio() {
  const reveal = useReveal()
  const { heading, paragraph, images, link } = about.crochetCurio
  // Up to four image slots; fall back to placeholder tiles when none supplied.
  const gallery = images && images.length ? images : [0, 1, 2]

  return (
    <section className="mt-section-sm md:mt-section-md lg:mt-section">
      <SectionHeader badge="Passion Project" heading={heading} />
      <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start md:gap-14">
        <motion.div {...reveal}>
          <p className="max-w-xl text-base font-normal leading-body text-text-muted">
            {paragraph}
          </p>
          {link && (
            <div className="mt-6">
              <Button
                variant="secondary"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Crochet Curio
              </Button>
            </div>
          )}
        </motion.div>

        {/* Image / small gallery slot. */}
        <motion.div {...reveal} className="grid grid-cols-2 gap-4">
          {gallery.map((src, i) =>
            typeof src === 'string' ? (
              <img
                key={i}
                src={src}
                alt={`Crochet Curio work ${i + 1}`}
                width="400"
                height="400"
                loading="lazy"
                className={`aspect-square w-full rounded-2xl border border-border object-cover ${
                  i === 0 ? 'col-span-2' : ''
                }`}
              />
            ) : (
              <div
                key={i}
                aria-hidden="true"
                className={`flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-border to-surface text-xs font-normal text-text-muted ${
                  i === 0 ? 'col-span-2' : ''
                }`}
              >
                [image]
              </div>
            )
          )}
        </motion.div>
      </div>
    </section>
  )
}

function Interests() {
  const reveal = useReveal()
  return (
    <section className="mt-section-sm md:mt-section-md lg:mt-section">
      <SectionHeader badge="Beyond design" heading="[The things that define me]" />
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Gentle left-to-right stagger for cards that share a row. */}
        {about.interests.map((interest, i) => (
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: (i % 3) * 0.07 }}
            key={interest.title}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <Doodle variant={interest.motif} />
            <h3 className="mt-4 text-lg font-semibold leading-tight">
              {interest.title}
            </h3>
            <p className="mt-2 text-sm font-normal leading-body text-text-muted">
              {interest.blurb}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
