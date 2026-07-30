import { Link, useLocation } from 'react-router-dom'
import { site, contact, links, footer as footerCopy } from '../data/portfolio'
import { useReducedMotion } from '../lib/hooks'
import { tapHaptic } from '../lib/haptics'
import { CTA_HOVER, CTA_HOVER_FILL } from '../lib/interactions'
import Button from './Button'

// Global footer — the centred sign-off band from the Figma frame: a hairline,
// the sign-off, a row of round connect buttons, the copyright. Back to top is
// this site's own addition and lives here for every route.
//
// Every button but "say hello" depends on a fact we may not have yet, so the
// row is assembled rather than written out: no LinkedIn URL, no LinkedIn
// button. The contact form is always reachable, so the row is never empty.
export default function Footer() {
  const reducedMotion = useReducedMotion()
  const location = useLocation()
  const onContact = location.pathname === '/contact'

  const scrollToTop = () => {
    tapHaptic()
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const connectLinks = [
    links.linkedin && {
      key: 'linkedin',
      label: 'LinkedIn',
      href: links.linkedin,
      external: true,
      icon: <LinkedInGlyph />,
    },
    contact.email && {
      key: 'email',
      label: `Email ${site.name}`,
      href: `mailto:${contact.email}`,
      cursorLabel: 'Email me',
      icon: <MailIcon />,
    },
    // On every other route this navigates to the contact form. On the contact
    // page itself there is nowhere to navigate to, and a link that looks
    // clickable but lands you where you already are reads as broken — so there
    // it scrolls back up to the form instead.
    onContact
      ? {
          key: 'hello',
          label: `${footerCopy.sayHello} — back to the form`,
          onClick: scrollToTop,
          cursorLabel: footerCopy.sayHello,
          icon: <ChatIcon />,
        }
      : {
          key: 'hello',
          label: footerCopy.sayHello,
          to: '/contact',
          cursorLabel: footerCopy.sayHello,
          icon: <ChatIcon />,
        },
  ].filter(Boolean)

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-content flex-col items-center px-6 py-section-sm text-center md:py-section-md lg:py-section">
        <button
          type="button"
          onClick={scrollToTop}
          className="group inline-flex min-h-[44px] items-center gap-2 text-body-sm font-normal text-text-muted transition-colors duration-200 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
        >
          Back to top
          <ArrowUpRightIcon className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0" />
        </button>

        <h2 className="mt-8 max-w-2xl text-h2 font-semibold text-text">
          {footerCopy.heading}
        </h2>

        <p className="mt-4 max-w-lg text-body font-normal text-text-muted">
          {footerCopy.subtext}
        </p>

        <nav
          aria-label="Connect"
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {connectLinks.map(({ key, ...item }) => (
            <ConnectButton key={key} {...item} />
          ))}
        </nav>

        {/* The résumé has no glyph in the frame, and a hand-drawn one would be
            a guess — so it keeps the site's own button instead of joining the
            icon row. Absent until there is a PDF to point at. */}
        {links.resume && (
          <div className="mt-8">
            <Button
              variant="secondary"
              href={links.resume}
              target="_blank"
              rel="noopener noreferrer"
              cursorLabel="Open résumé"
            >
              Resume
            </Button>
          </div>
        )}

        <p className="mt-10 text-caption font-normal text-text-muted">
          {site.copyright}
        </p>
      </div>
    </footer>
  )
}

// A round hairline button carrying one glyph. Rests neutral, then takes the
// same accent fill and the same small zoom as every other CTA on the site.
const connectClass =
  'inline-flex size-14 items-center justify-center rounded-full border border-border text-text ' +
  `${CTA_HOVER} ${CTA_HOVER_FILL}`

function ConnectButton({ label, href, to, external, cursorLabel, icon, onClick }) {
  const shared = {
    className: connectClass,
    'aria-label': label,
    'data-cursor': cursorLabel ?? label,
    onPointerDown: tapHaptic,
  }

  // A scroll, not a destination — so it is a real button, not a link with a
  // dead href.
  if (onClick) {
    return (
      <button type="button" onClick={onClick} {...shared}>
        {icon}
      </button>
    )
  }

  if (to) {
    return (
      <Link to={to} {...shared}>
        {icon}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...shared}
    >
      {icon}
    </a>
  )
}

// The frame sets LinkedIn in type rather than as a logo, which is also the
// honest thing to ship — it is a wordmark we are not licensed to redraw.
function LinkedInGlyph() {
  return (
    <span aria-hidden="true" className="text-h4 font-semibold">
      in
    </span>
  )
}

// Mail and chat are the frame's own glyphs, re-pointed at currentColor so they
// take the theme's ink instead of the frame's #333.
function MailIcon() {
  return (
    <GlyphSvg>
      <path d="M32.7779 56.6667C32.0279 56.6667 31.3774 56.3913 30.8263 55.8404C30.2754 55.2893 30 54.6388 30 53.8888V32.7779C30 32.0279 30.2754 31.3774 30.8263 30.8263C31.3774 30.2754 32.0279 30 32.7779 30H60.5554C61.3054 30 61.956 30.2754 62.5071 30.8263C63.0579 31.3774 63.3333 32.0279 63.3333 32.7779V53.8888C63.3333 54.6388 63.0579 55.2893 62.5071 55.8404C61.956 56.3913 61.3054 56.6667 60.5554 56.6667H32.7779ZM46.6667 44.3887L32.7779 35.4167V53.8888H60.5554V35.4167L46.6667 44.3887ZM46.6667 41.6112L60.4446 32.7779H32.9167L46.6667 41.6112ZM32.7779 35.4167V32.7779V53.8888V35.4167Z" />
    </GlyphSvg>
  )
}

function ChatIcon() {
  return (
    <GlyphSvg>
      <path d="M30 63.3333V32.7779C30 32.0279 30.2754 31.3774 30.8263 30.8263C31.3774 30.2754 32.0279 30 32.7779 30H60.5554C61.3054 30 61.956 30.2754 62.5071 30.8263C63.0579 31.3774 63.3333 32.0279 63.3333 32.7779V53.8888C63.3333 54.6388 63.0579 55.2893 62.5071 55.8404C61.956 56.3913 61.3054 56.6667 60.5554 56.6667H36.6667L30 63.3333ZM35.4721 53.8888H60.5554V32.7779H32.7779V56.7363L35.4721 53.8888Z" />
    </GlyphSvg>
  )
}

function GlyphSvg({ children }) {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="30 30 33.34 33.34"
      fill="currentColor"
      className="block shrink-0"
    >
      {children}
    </svg>
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
