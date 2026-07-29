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
        <h1 className="mt-5 max-w-2xl text-h1 font-semibold text-text">
          {about.statement}
        </h1>
        <p className="mt-6 max-w-xl text-body font-normal text-text-muted">
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
  // No entries yet → no section. An "Education" heading over an empty rule
  // reads as a bug, not as a section awaiting content.
  if (!about.education.length) return null

  return (
    <section className="mt-section-sm md:mt-section-md lg:mt-section">
      <SectionHeader badge="Education" heading={about.educationHeading} />
      <ul className="mt-8 max-w-3xl divide-y divide-border border-t border-border">
        {about.education.map((entry, i) => (
          <motion.li
            {...reveal}
            key={i}
            className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <div>
              <p className="text-h4 font-semibold text-text">
                {entry.institution}
              </p>
              <p className="mt-1 text-body-sm font-normal text-text-muted">
                {entry.qualification}
              </p>
            </div>
            <span className="shrink-0 text-body-sm font-normal text-text-muted">
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
  // No photos yet → the copy takes the full width rather than sitting beside a
  // row of empty tiles. The gallery returns the moment there are images.
  const gallery = images ?? []
  const hasGallery = gallery.length > 0

  return (
    <section className="mt-section-sm md:mt-section-md lg:mt-section">
      <SectionHeader badge="Passion Project" heading={heading} />
      <div
        className={`mt-8 grid gap-10 md:items-start md:gap-14 ${
          hasGallery ? 'md:grid-cols-2' : ''
        }`}
      >
        <motion.div {...reveal}>
          <p className="max-w-xl text-body font-normal text-text-muted">
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

        {/* Image / small gallery slot — first image spans both columns. */}
        {hasGallery && (
          <motion.div {...reveal} className="grid grid-cols-2 gap-4">
            {gallery.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Crochet Curio work ${i + 1}`}
                width="400"
                height="400"
                loading="lazy"
                className={`aspect-square w-full rounded-2xl border border-border object-cover ${
                  i === 0 ? 'col-span-2' : ''
                }`}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

function Interests() {
  const reveal = useReveal()
  return (
    <section className="mt-section-sm md:mt-section-md lg:mt-section">
      <SectionHeader badge="Beyond design" heading={about.interestsHeading} />
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
            <h3 className="mt-4 text-h4 font-semibold text-text">
              {interest.title}
            </h3>
            <p className="mt-2 text-body-sm font-normal text-text-muted">
              {interest.blurb}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
