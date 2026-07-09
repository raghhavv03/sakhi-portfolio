import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { hero, projects } from '../data/portfolio'
import HeroImage from '../components/HeroImage'
import SectionHeader from '../components/SectionHeader'
import ProjectCard from '../components/ProjectCard'
import { useReducedMotion } from '../lib/hooks'

// Home — deliberately short: hero and projects. Nothing else.
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
      {/* 1. Hero. The whole area carries the "Scroll ↓" cursor hint. */}
      <section
        data-cursor="Scroll ↓"
        className="mx-auto max-w-content px-6 pb-section-sm pt-10 sm:pt-16 md:pb-section"
      >
        <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.4fr] md:gap-10 lg:gap-12">
          {/* Name + opening line — visible immediately, no animation delay.
              Name comes first in the DOM so it stacks above the illustration on
              mobile and sits to its left on desktop. */}
          <div>
            <h1 className="font-semibold leading-hero tracking-tight text-hero">
              {hero.name}
            </h1>
            <p className="mt-6 max-w-md text-lg font-normal leading-body text-text-muted sm:text-xl">
              {hero.opening}
            </p>
          </div>

          {/* Responsive illustration slot (stacks below the name on mobile). */}
          <div className="overflow-visible">
            <HeroImage
              priority
              sizes="(min-width: 768px) 58vw, 96vw"
              className="mx-auto h-auto w-full max-w-3xl md:ml-auto md:mr-0 md:max-w-none md:origin-right md:scale-110"
            />
          </div>
        </div>
      </section>

      {/* 2. Portfolio grid. id="work" is the scroll target for the header's
          "Work" nav item; scroll-mt-20 keeps it clear of the fixed header. */}
      <section
        id="work"
        className="mx-auto max-w-content scroll-mt-20 px-6 py-section-sm md:py-section-md lg:py-section"
      >
        <SectionHeader badge="Work" heading="[Explore my work]" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
