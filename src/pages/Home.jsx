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
        <div className="relative md:absolute md:inset-0">
          <HeroScene className="h-[62svh] min-h-[300px] w-full md:h-full" />
          {/* Legibility wash: bottom-up on mobile (copy sits below the art),
              left-to-right on desktop (copy sits on the wall). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-bg/20 to-bg md:bg-gradient-to-r md:from-bg md:via-bg/80 md:to-transparent"
          />
        </div>

        <div className="relative mx-auto flex max-w-content items-center px-6 pb-section-sm pt-8 md:min-h-[100svh] md:pb-0 md:pt-20">
          <div className="md:w-[52%] lg:w-[46%]">
            <h1 className="text-display font-semibold text-text">
              {hero.name}
            </h1>
            <p className="mt-6 max-w-md text-lead font-normal text-text-muted">
              {hero.opening}
            </p>
            {/* Discoverability for the lamp — the switch is in the artwork,
                so something has to say so. */}
            <p className="mt-8 text-body-sm font-normal text-text-muted">
              <span
                aria-hidden="true"
                className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-lamp align-middle"
              />
              {hero.scene.lampHint}
            </p>
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
