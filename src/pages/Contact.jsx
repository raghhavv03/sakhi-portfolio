import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { contact, links } from '../data/portfolio'
import { useReducedMotion, useReveal } from '../lib/hooks'
import { successHaptic } from '../lib/haptics'
import Badge from '../components/Badge'
import Button from '../components/Button'

// Contact — short and direct: headline + invite, direct email / LinkedIn,
// and a minimal (UI-only) form.
export default function Contact() {
  const reveal = useReveal()
  const reducedMotion = useReducedMotion()

  // Submit state machine: idle → sending → sent. The form is UI-only, so
  // "sending" is a brief acknowledgement beat, not a network wait; under
  // reduced motion we jump straight to the confirmation.
  const [status, setStatus] = useState('idle')
  const sent = status === 'sent'
  const timeoutRef = useRef(null)
  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const onSubmit = (e) => {
    e.preventDefault()
    if (status !== 'idle') return
    successHaptic()
    if (reducedMotion) {
      setStatus('sent')
      return
    }
    setStatus('sending')
    timeoutRef.current = setTimeout(() => setStatus('sent'), 650)
  }

  return (
    <section className="mx-auto max-w-content px-6 py-section-sm md:py-section-md lg:py-section">
      <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-start md:gap-14 lg:gap-16">
        {/* Left: headline, invite, direct details */}
        <motion.div {...reveal}>
          <Badge>Contact</Badge>
          <h1 className="mt-5 text-5xl font-semibold leading-tight sm:text-6xl">
            Let's connect
          </h1>
          <p className="mt-5 max-w-md text-lg font-normal leading-body text-text-muted">
            {contact.invite}
          </p>

          <dl className="mt-10 space-y-6 border-t border-border pt-8">
            <div>
              <dt className="text-xs font-normal text-text-muted">Email</dt>
              <dd className="mt-1.5">
                <a
                  href={`mailto:${contact.email}`}
                  data-cursor="Email me"
                  className="inline-flex min-h-[44px] items-center text-lg font-semibold underline decoration-border underline-offset-4 transition-colors hover:decoration-text"
                >
                  {contact.email}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-xs font-normal text-text-muted">LinkedIn</dt>
              <dd className="mt-2">
                <Button
                  variant="secondary"
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open LinkedIn
                </Button>
              </dd>
            </div>
          </dl>
        </motion.div>

        {/* Right: minimal contact form (UI-only) */}
        <motion.div {...reveal}>
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
          >
            <Field
              id="name"
              label="Name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
            />
            <Field
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="Your email"
            />

            <div className="mt-5">
              <label
                htmlFor="message"
                className="block text-sm font-normal text-text-muted"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Tell me about your project…"
                className="mt-2 w-full resize-y rounded-xl border border-border bg-bg px-4 py-3 text-base font-normal text-text transition-[border-color,box-shadow] duration-200 placeholder:text-text-muted/70 placeholder:transition-opacity placeholder:duration-200 focus:border-text focus:shadow-[0_0_0_3px_rgba(26,26,26,0.07)] focus:outline-none focus:placeholder:opacity-50"
              />
            </div>

            <div className="mt-6">
              {/* Submit swaps label → spinner → check, fading 4px between
                  states. Disabled while in flight so it can't double-fire. */}
              <button
                type="submit"
                disabled={status !== 'idle'}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-text px-6 py-3 text-sm font-semibold text-bg transition-colors duration-200 hover:bg-accent hover:text-text disabled:hover:bg-text disabled:hover:text-bg"
              >
                {/* Keyed enter-only swap — the old label unmounts instantly,
                    the new one fades up. No exit animation, so the swap can
                    never stall on a busy main thread. */}
                <motion.span
                  key={status}
                  initial={reducedMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-2"
                >
                    {status === 'idle' && 'Send message'}
                    {status === 'sending' && (
                      <>
                        <span
                          aria-hidden="true"
                          className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                        />
                        Sending…
                      </>
                    )}
                    {status === 'sent' && (
                      <>
                        <svg
                          aria-hidden="true"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M2.5 7.5 5.5 10.5 11.5 3.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Thanks!
                      </>
                    )}
                </motion.span>
              </button>
            </div>

            {/* Polite, accessible confirmation — UI-only acknowledgement. */}
            <p
              role="status"
              aria-live="polite"
              className={`mt-4 text-sm font-normal text-text-muted ${
                sent ? '' : 'sr-only'
              }`}
            >
              {sent
                ? 'Thanks — your message is ready to send. (Form is not yet wired to a backend.)'
                : ''}
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

// Single labelled input row.
function Field({ id, label, type, autoComplete, placeholder }) {
  return (
    <div className="mt-5 first:mt-0">
      <label htmlFor={id} className="block text-sm font-normal text-text-muted">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-base font-normal text-text transition-[border-color,box-shadow] duration-200 placeholder:text-text-muted/70 placeholder:transition-opacity placeholder:duration-200 focus:border-text focus:shadow-[0_0_0_3px_rgba(26,26,26,0.07)] focus:outline-none focus:placeholder:opacity-50"
      />
    </div>
  )
}
