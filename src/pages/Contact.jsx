import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { contact, links, site } from '../data/portfolio'
import { useReducedMotion, useReveal } from '../lib/hooks'
import { successHaptic } from '../lib/haptics'
import {
  CTA_HOVER,
  CTA_HOVER_FILL_SOLID,
  CTA_SHAPE,
} from '../lib/interactions'
import Badge from '../components/Badge'
import Button from '../components/Button'

// Contact — short and direct: headline + invite, direct email / LinkedIn,
// and a minimal form.
//
// Delivery is Formspree: a POST of the form's own fields to the endpoint in
// `contact.formEndpoint`, which forwards them to `contact.email`. No backend,
// no key in the bundle — the endpoint id is public by design and rate-limited
// on their side.
//
// With no endpoint set the same form stays UI-only: it validates and
// acknowledges, and the confirmation says so, rather than posting into
// nowhere and claiming it sent.
export default function Contact() {
  const reveal = useReveal()
  const reducedMotion = useReducedMotion()

  // Submit state machine: idle → sending → sent | error. `error` is the only
  // state that returns to idle, so a failed message can be sent again without
  // retyping it.
  const [status, setStatus] = useState('idle')
  const sent = status === 'sent'
  const failed = status === 'error'
  const wired = Boolean(contact.formEndpoint)
  const timeoutRef = useRef(null)
  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending' || sent) return

    // Not wired yet — acknowledge without pretending to deliver. Under
    // reduced motion, skip the beat and confirm straight away.
    if (!wired) {
      successHaptic()
      if (reducedMotion) {
        setStatus('sent')
        return
      }
      setStatus('sending')
      timeoutRef.current = setTimeout(() => setStatus('sent'), 650)
      return
    }

    const form = e.currentTarget
    const body = new FormData(form)
    setStatus('sending')

    try {
      const response = await fetch(contact.formEndpoint, {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`)
      successHaptic()
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="mx-auto max-w-content px-6 py-section-sm md:py-section-md lg:py-section">
      <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-start md:gap-14 lg:gap-16">
        {/* Left: headline, invite, direct details */}
        <motion.div {...reveal}>
          <Badge>Contact</Badge>
          <h1 className="mt-5 text-h1 font-semibold text-text">
            Let's connect
          </h1>
          <p className="mt-5 max-w-md text-lead font-normal text-text-muted">
            {contact.invite}
          </p>

          {/* Direct details only when they exist — until then the form is the
              route in, and an empty rule/heading would just look broken. */}
          {(contact.email || links.linkedin) && (
            <dl className="mt-10 space-y-6 border-t border-border pt-8">
              {contact.email && (
                <div>
                  <dt className="text-body-sm font-normal text-text-muted">Email</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${contact.email}`}
                      data-cursor="Email me"
                      className="inline-flex min-h-[44px] items-center text-h4 font-semibold text-text underline decoration-border underline-offset-4 transition-colors hover:decoration-text"
                    >
                      {contact.email}
                    </a>
                  </dd>
                </div>
              )}

              {links.linkedin && (
                <div>
                  <dt className="text-body-sm font-normal text-text-muted">
                    LinkedIn
                  </dt>
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
              )}
            </dl>
          )}
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
                className="block text-body-sm font-normal text-text-muted"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Tell me about your project…"
                className="mt-2 w-full resize-y rounded-xl border border-border bg-bg px-4 py-3 text-body font-normal text-text transition-[border-color,box-shadow] duration-200 placeholder:text-text-muted/70 placeholder:transition-opacity placeholder:duration-200 focus:border-text focus:shadow-[0_0_0_3px_rgb(var(--text)/0.12)] focus:outline-none focus:placeholder:opacity-50"
              />
            </div>

            {/* Formspree's own fields: `_subject` names the notification
                email, `_gotcha` is the honeypot it drops silently when a bot
                fills it. Both are inert when no endpoint is set. */}
            <input
              type="hidden"
              name="_subject"
              value={`New message from ${site.name}'s portfolio`}
            />
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="mt-6">
              {/* Submit swaps label → spinner → check, fading 4px between
                  states. Disabled only while in flight and after success — a
                  failure has to stay pressable so the message can be retried
                  without retyping it. */}
              <button
                type="submit"
                disabled={status === 'sending' || sent}
                className={`w-full ${CTA_SHAPE} ${CTA_HOVER} border border-text bg-text text-bg ${CTA_HOVER_FILL_SOLID} disabled:hover:border-text disabled:hover:bg-text disabled:hover:text-bg`}
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
                    {failed && 'Try again'}
                </motion.span>
              </button>
            </div>

            {/* Polite, accessible confirmation. A failure names the fallback
                rather than leaving the message stranded in the textarea. */}
            <p
              role="status"
              aria-live="polite"
              className={`mt-4 text-body-sm font-normal text-text-muted ${
                sent || failed ? '' : 'sr-only'
              }`}
            >
              {sent &&
                (wired
                  ? "Thanks — your message is on its way. I'll come back to you."
                  : 'Thanks — your message is ready to send. (The form is not yet connected, so nothing was delivered.)')}
              {failed && (
                <>
                  That didn't send. Try again, or email me directly at{' '}
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-semibold text-text underline decoration-border underline-offset-4 transition-colors hover:decoration-text"
                  >
                    {contact.email}
                  </a>
                  .
                </>
              )}
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
      <label htmlFor={id} className="block text-body-sm font-normal text-text-muted">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-body font-normal text-text transition-[border-color,box-shadow] duration-200 placeholder:text-text-muted/70 placeholder:transition-opacity placeholder:duration-200 focus:border-text focus:shadow-[0_0_0_3px_rgb(var(--text)/0.12)] focus:outline-none focus:placeholder:opacity-50"
      />
    </div>
  )
}
