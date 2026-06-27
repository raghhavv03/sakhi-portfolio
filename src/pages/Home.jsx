import { hero, projects } from '../data/portfolio'
import Button from '../components/Button'
import HeroImage from '../components/HeroImage'
import BrandStrip from '../components/BrandStrip'
import SectionHeader from '../components/SectionHeader'
import ProjectCard from '../components/ProjectCard'

// Home — deliberately short: hero, one brand row, projects. Nothing else.
export default function Home() {
  return (
    <>
      {/* 1. Hero. The whole area carries the "Scroll ↓" cursor hint. */}
      <section
        data-cursor="Scroll ↓"
        className="mx-auto max-w-content px-6 pb-section-sm pt-10 sm:pt-16 md:pb-section"
      >
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
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
            <div className="mt-8">
              {/* Empty data-cursor overrides the section's "Scroll ↓" so the
                  CTA shows the plain cursor, not a misleading scroll hint. */}
              <Button variant="primary" to="/contact" data-cursor="">
                {hero.ctaLabel}
              </Button>
            </div>
          </div>

          {/* Responsive illustration slot (stacks below the name on mobile). */}
          <div>
            <HeroImage
              priority
              sizes="(min-width: 768px) 45vw, 90vw"
              className="mx-auto h-auto w-full max-w-xl md:ml-auto md:mr-0"
            />
          </div>
        </div>
      </section>

      {/* 2. Brand / tools strip — one row. */}
      <BrandStrip />

      {/* 3. Portfolio grid. */}
      <section className="mx-auto max-w-content px-6 py-section-sm md:py-section-md lg:py-section">
        <SectionHeader badge="Portfolio" heading="[Explore my work]" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </>
  )
}
