import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { hero, projects, work } from '../data/portfolio'
import HeroScene from '../components/HeroScene'
import Journey from '../components/Journey'
import SectionHeader from '../components/SectionHeader'
import ProjectCard from '../components/ProjectCard'
import { useReducedMotion } from '../lib/hooks'

// Home: hero → journey → work. Nothing else.
export default function Home() {
  const location = useLocation()
  const reducedMotion = useReducedMotion()

  // Arriving from the header's "Work" nav item on another page lands here as
  // "/#work" — scroll to the work section once the page has mounted.
  useEffect(() => {
    if (location.hash !== '#work') return
    const id = requestAnimationFrame(() => {
      document
        .getElementById('work')
        ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
    })
    return () => cancelAnimationFrame(id)
  }, [location.hash, reducedMotion])

  return (
    <>
      {/* 1. Hero — the room, edge to edge, with the copy sitting in its light.
          `-mt-20` pulls the artwork up under the (transparent) header; the
          copy column adds that space back so it never hides behind it.
          The whole area carries the "Scroll ↓" cursor hint, except the lamp,
          which sets its own label. */}
      <section
        data-cursor="Scroll ↓"
        className="relative -mt-20 overflow-hidden md:min-h-[100svh]"
      >
        {/* No wash. The artwork is shown as painted, edge to edge — the copy
            sits on the same frosted `bg` the header uses over this scene. */}
        <div className="relative md:absolute md:inset-0">
          <HeroScene className="h-[62svh] min-h-[300px] w-full md:h-full" />
        </div>

        {/* The copy sits on a frosted card — the same `bg-bg/70
            backdrop-blur-md` recipe the header uses over this artwork — so
            the two bands read as one material. Hairline border only; no
            speech-bubble tail. Sized one step under the display/lead pair
            (`h1` + `body`) so the room stays the hero and the card stays a
            greeting, not a billboard. On desktop it floats over the wall; on
            mobile it lifts up over the bottom of the frame, so the artwork
            is never cut by a hard edge. */}
        <div className="relative mx-auto -mt-20 flex max-w-content items-center px-6 pb-section-sm pt-0 md:mt-0 md:min-h-[100svh] md:pb-0 md:pt-20">
          <div className="md:w-[40%] lg:w-[36%]">
            <div className="max-w-[26rem] rounded-2xl border border-border bg-bg/70 p-5 backdrop-blur-md sm:p-6">
              <h1 className="text-h1 font-semibold text-text">
                {hero.name}
              </h1>
              <hr className="my-4 border-0 border-t border-border" />
              <p className="text-body font-normal text-text-muted">
                {hero.opening}
              </p>
              {/* Decorative sign-off — it says nothing the copy doesn't. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="mt-4 ml-auto block h-5 w-5 text-text-muted"
              >
                <path
                  d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 3.2c0 5.1-7.5 9.7-7.5 9.7Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Journey — the trail from crochet to product design. */}
      <Journey />

      {/* 3. Portfolio grid. id="work" is the scroll target for the header's
          "Work" nav item; scroll-mt-20 keeps it clear of the fixed header. */}
      <section
        id="work"
        className="mx-auto max-w-content scroll-mt-20 px-6 py-section-sm md:py-section-md lg:py-section"
      >
        <SectionHeader badge={work.badge} heading={work.heading} />
        {/* Two projects, so two per row at every width above mobile — the
            cards get the extra space rather than a third empty column. */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
          {/* Same-row cards enter viewport together — a small per-card delay
              turns that into a gentle left-to-right stagger. */}
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} delay={i * 0.07} />
          ))}
        </div>
      </section>
    </>
  )
}
