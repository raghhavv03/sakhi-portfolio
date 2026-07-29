import { site, contact, links, footer as footerCopy } from '../data/portfolio'
import { useReducedMotion } from '../lib/hooks'
import { tapHaptic } from '../lib/haptics'

// Global footer — centred sign-off band. Back to top lives here for every
// route; connect links only render when the underlying facts exist.
export default function Footer() {
  const reducedMotion = useReducedMotion()

  const scrollToTop = () => {
    tapHaptic()
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const connectLinks = [
    links.linkedin && {
      label: 'LinkedIn',
      href: links.linkedin,
      external: true,
    },
    contact.email && {
      label: contact.email,
      href: `mailto:${contact.email}`,
      external: false,
      cursorLabel: 'Email me',
    },
    links.behance && {
      label: 'Behance',
      href: links.behance,
      external: true,
    },
    links.resume && {
      label: 'Resume',
      href: links.resume,
      external: true,
    },
  ].filter(Boolean)

  return (
    <footer className="border-t border-border bg-bg text-text">
      <div className="mx-auto flex max-w-content flex-col items-center px-6 py-section-sm text-center md:py-section">
        <button
          type="button"
          onClick={scrollToTop}
          className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-normal text-text-muted transition-colors duration-200 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
        >
          Back to top
          <ArrowUpRightIcon className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
        </button>

        <h2 className="mt-8 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
          {footerCopy.heading}
        </h2>

        <p className="mt-4 max-w-lg text-base font-normal italic leading-body text-text-muted">
          {footerCopy.subtext}
        </p>

        {connectLinks.length > 0 && (
          <nav
            aria-label="Connect"
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {connectLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                data-cursor={item.cursorLabel}
                className="group inline-flex min-h-[44px] items-center gap-1.5 text-sm font-normal text-text transition-colors duration-200 hover:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
              >
                {item.label}
                <ArrowUpRightIcon className="text-text-muted transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
              </a>
            ))}
          </nav>
        )}

        <p className="mt-10 text-xs font-normal text-text-muted">
          {site.copyright}
        </p>
      </div>
    </footer>
  )
}

function ArrowUpRightIcon({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`block shrink-0 ${className}`}
    >
      <path
        d="M3.5 8.5 8.5 3.5M8.5 3.5H4.75M8.5 3.5V7.25"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
