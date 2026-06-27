import { Link, useLocation } from 'react-router-dom'
import { site, contact, links, socials, nav } from '../data/portfolio'

// Global footer — dark band. Repeats every nav action so visitors never have
// to scroll back up, plus a back-to-home button (hidden on home itself), bio,
// and copyright.
export default function Footer() {
  const isHome = useLocation().pathname === '/'
  const linkClass =
    'inline-flex min-h-[44px] items-center text-sm font-normal text-dark-muted transition-colors hover:text-dark-text'

  return (
    <footer className="bg-dark-bg text-dark-text">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Left: identity + bio + back-to-home */}
          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center text-xl font-semibold"
              aria-label={`${site.name} — home`}
            >
              {site.name}
            </Link>
            <p className="mt-3 text-sm font-normal leading-body text-dark-muted">
              {site.bio}
            </p>
            {!isHome && (
              <Link
                to="/"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-dark-border px-5 py-2.5 text-sm font-semibold text-dark-text transition-colors hover:border-accent hover:bg-accent hover:text-text"
              >
                ← Back to home
              </Link>
            )}
          </div>

          {/* Right: navigation + actions. Tidy 2-col group on phone; inline
              row from sm up. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:flex sm:flex-wrap sm:gap-x-12">
            <nav className="flex flex-col gap-1" aria-label="Footer">
              <span className="mb-1 text-xs font-normal uppercase tracking-wide text-dark-muted/70">
                Navigate
              </span>
              {nav.map((item) => (
                <Link key={item.to} to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-1">
              <span className="mb-1 text-xs font-normal uppercase tracking-wide text-dark-muted/70">
                Connect
              </span>
              <a
                href={links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Resume
              </a>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                LinkedIn
              </a>
              <a
                href={`mailto:${contact.email}`}
                data-cursor="Email me"
                className={linkClass}
              >
                {contact.email}
              </a>
            </div>

            <div className="flex flex-col gap-1">
              <span className="mb-1 text-xs font-normal uppercase tracking-wide text-dark-muted/70">
                Social
              </span>
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-dark-border pt-6 text-xs font-normal text-dark-muted">
          {site.copyright}
        </div>
      </div>
    </footer>
  )
}
