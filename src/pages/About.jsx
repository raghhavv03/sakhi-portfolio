import { motion } from 'framer-motion'
import { about } from '../data/portfolio'
import { useReveal } from '../lib/hooks'
import SectionHeader from '../components/SectionHeader'
import Badge from '../components/Badge'
import Button from '../components/Button'
import PhotoStack from '../components/PhotoStack'

// About — the "Website changes" Figma frames. Both of them: the desktop frame
// leads with the Crochet Curio makes and lets the background copy explain them
// afterwards, while the phone frame states the background first and shows the
// makes as the evidence under it. The two frames also disagree about the
// off-duty photographs — trips before cats on the phone, cats before trips on
// the desktop, where they share a row.
//
// So the sections are written in the phone frame's order and re-ordered at
// `lg`, the same width the photo groups stop being swipe decks and become the
// hover spread. Education sits where a CV would put it and hides itself until
// there are entries.
export default function About() {
  // Opens with type, so it starts below the floating nav band rather than
  // under it — see `nav-clear` in tailwind.config.js.
  return (
    <div className="mx-auto flex max-w-content flex-col px-6 pb-section-sm pt-nav-clear md:pb-section-md lg:pb-section">
      <Intro />
      <Background />
      <Makes />
      <Education />
      <OffDuty />
    </div>
  )
}

// The section rhythm, and where each section sits in each of the two orders.
const SECTION = 'mt-section-sm md:mt-section-md lg:mt-section'

function Intro() {
  const reveal = useReveal()
  const { portrait } = about

  return (
    <section className="order-1 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-14">
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
// evidence the Background section is written around.
function Makes() {
  return (
    <section className={`order-3 lg:order-2 ${SECTION}`}>
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
    <section className={`order-2 lg:order-3 ${SECTION}`}>
      {/* No badge. The frame gives this section one heading and nothing above
          it. The heading is "Background" rather than the frame's "Crochet
          Curio" because the section is only half about the shop — the second
          paragraph is how she works now — and the makes beside it already say
          whose they are. The button under it is what names the shop. */}
      <SectionHeader heading={heading} />
      {/* The two paragraphs sit side by side from `md`, the same two-column
          move the Intro and Off-duty sections make. One column at this width
          left half the page empty and the measure over-long. */}
      <motion.div {...reveal} className="mt-8">
        <div className="grid gap-x-12 md:grid-cols-2">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-5 text-body font-normal text-text-muted first:mt-0 md:mt-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
        {link && (
          <div className="mt-6">
            <Button
              variant="secondary"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
              Visit Crochet Curio
            </Button>
          </div>
        )}
      </motion.div>
    </section>
  )
}

// The shop only exists on Instagram, so the button carries the mark rather
// than making "Visit" the only clue about where it goes. Stroked in
// currentColor, so it fills with the label on hover like any other CTA glyph.
function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="block shrink-0"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

function Education() {
  const reveal = useReveal()
  // No entries yet → no section. An "Education" heading over an empty rule
  // reads as a bug, not as a section awaiting content.
  if (!about.education.length) return null

  return (
    <section className={`order-4 ${SECTION}`}>
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
// spreads is room the other is not using. On a phone the copy leads and the
// two decks follow it, trips first, which is the phone frame's own order.
function OffDuty() {
  const reveal = useReveal()
  const { heading, paragraph, cats, trips } = about.offDuty

  return (
    <section className={`order-5 ${SECTION}`}>
      <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-center lg:gap-12">
        {/* One column until `lg`, because each group is a swipe deck below
            that and two of them cannot share a row. */}
        <div className="order-2 grid gap-10 lg:order-1 lg:grid-cols-2 lg:gap-6">
          <div className="order-2 lg:order-1">
            <PhotoStack
              items={cats}
              shape="cat"
              layout="pile"
              label="Stray cats I have tried to befriend"
            />
          </div>
          <div className="order-1 lg:order-2">
            <PhotoStack
              items={trips}
              shape="trip"
              layout="pile"
              label="Photographs from recent trips"
            />
          </div>
        </div>

        {/* Heading only, same as Background — the frame has no kicker here. */}
        <motion.div {...reveal} className="order-1 lg:order-2">
          <h2 className="text-h2 font-semibold text-text">{heading}</h2>
          <p className="mt-4 text-body font-normal text-text-muted">
            {paragraph}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
