import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion, useReveal } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'

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
            ? 'border-border group-hover:border-text/20 group-hover:shadow-[0_16px_32px_-16px_rgba(26,26,26,0.18)]'
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

        {/* Scrim keeps the name legible over artwork without tinting it. */}
        {project.thumbnail && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/85 to-transparent"
          />
        )}

        <div className="absolute inset-0 flex items-end p-6 sm:p-7">
          <span className="text-2xl font-semibold leading-tight text-text sm:text-3xl">
            {project.name}
          </span>
        </div>

        {!isLive && (
          <span className="absolute right-4 top-4 inline-flex items-center rounded-full border border-border bg-bg/90 px-3 py-1 text-xs font-normal text-text-muted backdrop-blur">
            In progress
          </span>
        )}
      </div>
    )
  }

  const body = (
    <p className="mt-4 max-w-xl text-base font-normal leading-body text-text-muted">
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
          className="group block rounded-2xl focus-visible:outline-offset-4"
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
