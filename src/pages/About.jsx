import { motion } from 'framer-motion'
import { about } from '../data/portfolio'
import { useReveal } from '../lib/hooks'
import SectionHeader from '../components/SectionHeader'
import Badge from '../components/Badge'
import Button from '../components/Button'
import PhotoStack from '../components/PhotoStack'

// About — the "Website changes" Figma frame, in that frame's order: the intro
// beside a portrait, the Crochet Curio makes, the background behind them, and
// what happens when the designing stops. Education sits where a CV would put
// it and hides itself until there are entries.
export default function About() {
  return (
    <div className="mx-auto max-w-content px-6 py-section-sm md:py-section-md lg:py-section">
      <Intro />
      <Makes />
      <Background />
      <Education />
      <OffDuty />
    </div>
  )
}

function Intro() {
  const reveal = useReveal()
  const { portrait } = about

  return (
    <section className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-14">
      <div>
        <Badge>{about.badge}</Badge>
        <h1 className="mt-5 max-w-2xl text-h1 font-semibold text-text">
          {about.heading}
        </h1>
        <p className="mt-6 max-w-xl text-lead font-normal text-text-muted">
          {about.statement}
        </p>
        {about.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-5 max-w-xl text-body font-normal text-text-muted"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <motion.div {...reveal}>
        <img
          src={portrait.src}
          alt={portrait.alt}
          width={portrait.width}
          height={portrait.height}
          className="mx-auto h-auto w-full max-w-xs rounded-2xl object-cover md:max-w-[17rem] lg:max-w-sm"
        />
      </motion.div>
    </section>
  )
}

// The makes carry their own labels, so they need no heading — they are the
// evidence for the Background section that follows them.
function Makes() {
  return (
    <section className="mt-section-sm md:mt-section-md lg:mt-section">
      <PhotoStack
        items={about.makes}
        shape="make"
        layout="fan"
        label="Things I made for Crochet Curio"
      />
    </section>
  )
}

function Background() {
  const reveal = useReveal()
  const { heading, paragraphs, link } = about.background

  return (
    <section className="mt-section-sm md:mt-section-md lg:mt-section">
      {/* No badge. The frame gives this section one heading and nothing above
          it, and "Background" over "Background" was ours, not hers. */}
      <SectionHeader heading={heading} />
      <motion.div {...reveal} className="mt-8 max-w-3xl">
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-5 text-body font-normal text-text-muted first:mt-0"
          >
            {paragraph}
          </p>
        ))}
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

// Two piles and the copy that explains them. The piles share the left column
// at `lg` — only one is ever open at a time, so the room one takes when it
// spreads is room the other is not using.
function OffDuty() {
  const reveal = useReveal()
  const { heading, paragraph, cats, trips } = about.offDuty

  return (
    <section className="mt-section-sm md:mt-section-md lg:mt-section">
      <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-center lg:gap-12">
        {/* One column until `lg`, because each pile is a full-bleed scrolling
            strip below that and two of them cannot share a row. */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-6">
          <PhotoStack
            items={cats}
            shape="cat"
            layout="pile"
            label="Stray cats I have tried to befriend"
          />
          <PhotoStack
            items={trips}
            shape="trip"
            layout="pile"
            label="Photographs from recent trips"
          />
        </div>

        {/* Heading only, same as Background — the frame has no kicker here. */}
        <motion.div {...reveal}>
          <h2 className="text-h2 font-semibold text-text">{heading}</h2>
          <p className="mt-4 text-body font-normal text-text-muted">
            {paragraph}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
