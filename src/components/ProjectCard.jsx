import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion, useReveal } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'
import Badge from './Badge'

// Project card: a thumbnail with the project name on it, and a short
// description below it. Live projects link to their case study ("View case
// study" cursor); the in-progress project is non-clickable, shows an
// "In progress" badge + "Coming soon" cursor, and carries an aria-label so the
// state is conveyed without relying on the cursor.
//
// A project without a `thumbnail` falls back to a styled placeholder block;
// either way the slot keeps a fixed 4:3 aspect ratio to avoid layout shift.
//
// Hover (live cards only): 4px lift + soft neutral shadow + hairline border
// deepens + artwork zooms to 1.02 + a one-off shine sweep (see index.css).
// All transform/opacity/shadow — GPU-cheap, disabled under reduced motion.
// `delay` staggers the scroll reveal when cards share a row.
export default function ProjectCard({ project, delay = 0 }) {
  const isLive = project.status === 'live'
  const reveal = useReveal()
  const reducedMotion = useReducedMotion()

  const thumb = (interactive) => {
    const zoom =
      interactive && !reducedMotion
        ? 'transition-transform duration-300 ease-out group-hover:scale-[1.02]'
        : ''

    return (
      <div
        className={`card-shine relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-300 ${
          interactive
            ? 'border-border group-hover:border-text/20 group-hover:shadow-[0_16px_32px_-16px_rgb(var(--shadow)/0.22)]'
            : 'border-border'
        }`}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt=""
            width="1600"
            height="900"
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover ${zoom}`}
          />
        ) : (
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-gradient-to-br from-border to-surface ${zoom}`}
          />
        )}

        {/* No scrim. The name is the site's heading ink — same `text-text`
            every other heading uses — so the card does not invent a third
            colour just because the artwork is saturated. Optional
            `nameInk: 'on-brand'` still flips to inverse white for a future
            card that needs it; nothing uses that today. */}
        <div className="absolute inset-0 flex items-end p-6 sm:p-7">
          <span
            className={`text-h2 font-semibold ${
              project.nameInk === 'on-brand' ? 'text-on-brand' : 'text-text'
            }`}
          >
            {project.name}
          </span>
        </div>

        {!isLive && (
          <Badge className="absolute right-4 top-4 bg-bg/90 backdrop-blur">
            In progress
          </Badge>
        )}
      </div>
    )
  }

  const body = (
    <p className="mt-4 max-w-xl text-body font-normal text-text-muted">
      {project.description}
    </p>
  )

  return (
    <motion.article
      {...reveal}
      transition={{ ...reveal.transition, delay }}
    >
      {isLive ? (
        <Link
          to={`/work/${project.slug}`}
          data-cursor="View case study"
          aria-label={`${project.name} — view case study`}
          className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
        >
          <motion.div
            whileHover={reducedMotion ? undefined : { y: -4 }}
            transition={{ duration: DUR.hover, ease: EASE }}
            className="rounded-2xl"
          >
            {thumb(true)}
          </motion.div>
          {body}
        </Link>
      ) : (
        <div
          data-cursor="Coming soon"
          aria-label={`${project.name} — coming soon`}
          role="group"
          className="block cursor-default"
        >
          {thumb(false)}
          {body}
        </div>
      )}
    </motion.article>
  )
}
