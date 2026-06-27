import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReveal } from '../lib/hooks'

// Project card: a thumbnail with the project name on it, and a short
// description below it. Live projects link to their case study ("View case
// study" cursor); the in-progress project is non-clickable, shows an
// "In progress" badge + "Coming soon" cursor, and carries an aria-label so the
// state is conveyed without relying on the cursor.
//
// Thumbnails use a styled placeholder block until real images are supplied;
// the slot keeps a fixed 4:3 aspect ratio to avoid layout shift.
export default function ProjectCard({ project }) {
  const isLive = project.status === 'live'
  const reveal = useReveal()

  const thumb = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface">
      {/* Placeholder artwork — replace with <img> when thumbnails exist. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-border to-surface"
      />
      <div className="absolute inset-0 flex items-end p-5">
        <span className="text-xl font-semibold leading-tight text-text">
          {project.name}
        </span>
      </div>

      {!isLive && (
        <span className="absolute right-3 top-3 inline-flex items-center rounded-full border border-border bg-bg/90 px-3 py-1 text-xs font-normal text-text-muted backdrop-blur">
          In progress
        </span>
      )}
    </div>
  )

  const body = (
    <p className="mt-3 text-sm font-normal leading-body text-text-muted">
      {project.description}
    </p>
  )

  return (
    <motion.article {...reveal}>
      {isLive ? (
        <Link
          to={`/work/${project.slug}`}
          data-cursor="View case study"
          aria-label={`${project.name} — view case study`}
          className="group block rounded-2xl focus-visible:outline-offset-4"
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-2xl transition-shadow duration-250 group-hover:[&>div]:border-text/20"
          >
            {thumb}
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
          {thumb}
          {body}
        </div>
      )}
    </motion.article>
  )
}
