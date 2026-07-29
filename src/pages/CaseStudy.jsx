import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { projects } from '../data/portfolio'
import { useReveal } from '../lib/hooks'
import Figure from '../components/Figure'
import Lightbox from '../components/Lightbox'
import ScaleToFit from '../components/casestudy/ScaleToFit'
import SentimentPanel, { SENTIMENT_WIDTH } from '../components/charts/SentimentPanel'
import FrictionChart, { FRICTION_WIDTH } from '../components/charts/FrictionChart'
import {
  CSSection,
  CSLabel,
  CSHeading,
  CSSubheading,
  CSBody,
  CSList,
  CSRich,
  CSCallout,
  CSQuote,
  CSLiteratureCards,
  CSSignalCards,
  CSResultCards,
  CSCompareColumns,
} from '../components/casestudy/Blocks'

// The case-study page (/work/:slug), rebuilt from the MyFitnessPal Figma
// frame — the same eighteen sections in the same order, each on its own
// measure centred on the frame's 1440 canvas, with the frame's 104px section
// rhythm and 24px internal rhythm. Type, colour and radii come from the
// `cs-*` tokens, which are that frame's variables. Every string still lives in
// portfolio.js.
//
// The design is a 1440 desktop frame, so it is reproduced exactly at that
// width and above. Below it, each section keeps its own measure and stacks;
// the two research panels, which are drawn geometry rather than reflowable
// layout, scale as a unit (see ScaleToFit).
export default function CaseStudy() {
  const { slug } = useParams()
  const [lightbox, setLightbox] = useState(null)
  const project = projects.find((p) => p.slug === slug)

  // Unknown slug or a project without a published case study → home.
  if (!project || !project.caseStudy) return <Navigate to="/" replace />

  const cs = project.caseStudy
  const open = (figure) => setLightbox(figure)

  return (
    <>
      <ReadingProgress />
      <CaseStudyHero hero={cs.hero} title={cs.title} tagline={cs.tagline} />

      <article className="w-full px-6 pb-cs-gap pt-cs-gap">
        <div className="flex flex-col gap-cs-gap">
          {/* 1 — Background, with the fact-sheet rail beside it */}
          {cs.background && (
            <div className="relative mx-auto w-full max-w-[1440px]">
              <BackgroundMeta items={cs.background.meta} />
              <CSSection id="background" width={593}>
                <CSLabel>{cs.background.badge}</CSLabel>
                <CSHeading>{cs.background.heading}</CSHeading>
                <CSBody paragraphs={cs.background.body} />
              </CSSection>
            </div>
          )}

          {/* 2 — Problem */}
          {cs.problem && (
            <CSSection id="problem" width={593}>
              <CSLabel>{cs.problem.badge}</CSLabel>
              <CSHeading>{cs.problem.heading}</CSHeading>
              <CSBody paragraphs={cs.problem.body} />
            </CSSection>
          )}

          {/* 3 — Design challenge, ending on the framing question */}
          {cs.designChallenge && (
            <CSSection id="challenge">
              <CSLabel>{cs.designChallenge.badge}</CSLabel>
              <CSHeading>{cs.designChallenge.heading}</CSHeading>
              <CSBody paragraphs={cs.designChallenge.body} />
              <CSQuote>{cs.designChallenge.question}</CSQuote>
            </CSSection>
          )}

          {/* 4 — Solution preview */}
          {cs.solution && (
            <CSSection id="solution">
              <CSLabel>{cs.solution.badge}</CSLabel>
              <CSHeading>{cs.solution.heading}</CSHeading>
              <CSBody paragraphs={cs.solution.body} />
            </CSSection>
          )}

          {/* 5 — Discovery: the two annotated boards */}
          {cs.discovery && (
            <CSSection id="discovery" width={1000}>
              <CSLabel>{cs.discovery.badge}</CSLabel>
              <CSHeading loose>{cs.discovery.heading}</CSHeading>
              <CSBody paragraphs={cs.discovery.body} />
              {cs.discovery.figures.map((figure) => (
                <Figure
                  key={figure.src}
                  figure={figure}
                  caption={figure.caption}
                  onOpen={open}
                />
              ))}
            </CSSection>
          )}

          {/* 6 — Research: reviews, then literature */}
          {cs.research && (
            <>
              <CSSection id="research">
                <CSLabel>{cs.research.badge}</CSLabel>
                <CSHeading>{cs.research.heading}</CSHeading>
                <CSBody paragraphs={cs.research.intro} />
              </CSSection>

              {/* Sentiment: the claim beside the panel that carries it. */}
              <PanelRow
                copy={<CSBody paragraphs={cs.research.sentimentBody} />}
                panel={
                  <ScaleToFit width={SENTIMENT_WIDTH}>
                    <SentimentPanel data={cs.research.sentiment} />
                  </ScaleToFit>
                }
              />

              {/* Friction: the chart leads, the conclusion follows it. */}
              <PanelRow
                reverse
                copy={
                  <div className="flex w-full flex-col gap-cs-stack">
                    <CSHeading>{cs.research.frictionHeading}</CSHeading>
                    <div className="flex w-full flex-col">
                      <CSBody paragraphs={cs.research.frictionIntro} />
                      <CSList items={cs.research.frictionTypes} />
                      <CSBody paragraphs={cs.research.frictionConclusion} />
                    </div>
                  </div>
                }
                panel={
                  <ScaleToFit width={FRICTION_WIDTH}>
                    <FrictionChart data={cs.research.chart} />
                  </ScaleToFit>
                }
              />

              <CSSection id="literature" width={1158}>
                <CSBody paragraphs={cs.research.literatureIntro} />
                <CSLiteratureCards items={cs.research.literature} className="w-full" />
                <CSHeading>{cs.research.synthesisHeading}</CSHeading>
                <CSBody paragraphs={cs.research.synthesis} />
              </CSSection>
            </>
          )}

          {/* 7 — Product decision: the Today screen, six moves */}
          {cs.productDecision && (
            <CSSection id="today-screen" width={1000}>
              <CSLabel>{cs.productDecision.badge}</CSLabel>
              <CSHeading>{cs.productDecision.heading}</CSHeading>
              <CSLabel tone="copy">{cs.productDecision.subLabel}</CSLabel>
              <ol className="flex w-full flex-col gap-cs-stack">
                {cs.productDecision.steps.map((step, i) => (
                  <li
                    key={step.body}
                    className={`flex w-full flex-col gap-cs-stack ${
                      step.spaced ? 'pt-[30px]' : ''
                    }`}
                  >
                    <Step index={i} body={step.body} />
                    {step.figure && <Figure figure={step.figure} onOpen={open} />}
                  </li>
                ))}
              </ol>
            </CSSection>
          )}

          {/* 8 — Solution 2: what the prediction runs on */}
          {cs.repeatLogging && (
            <CSSection id="repeat-logging">
              <CSLabel tone="copy">{cs.repeatLogging.label}</CSLabel>
              <CSHeading>{cs.repeatLogging.heading}</CSHeading>
              <CSBody paragraphs={cs.repeatLogging.body} />
              <CSSignalCards items={cs.repeatLogging.signals} className="w-full" />
            </CSSection>
          )}

          {/* 9 — Where the prediction sits, beside the screen it produced */}
          {cs.predictionCard && (
            <CSSection id="prediction-card" width={1004}>
              <div className="flex w-full flex-col items-center justify-center gap-cs-stack lg:flex-row">
                <div className="flex w-full flex-col items-start justify-center gap-cs-stack lg:w-[703px] lg:shrink-0">
                  <CSHeading>{cs.predictionCard.heading}</CSHeading>
                  <CSBody paragraphs={cs.predictionCard.body} />
                </div>
                <Figure
                  figure={cs.predictionCard.figure}
                  onOpen={open}
                  className="lg:-mx-[4.613px] lg:w-[285.99px] lg:shrink-0"
                />
              </div>
            </CSSection>
          )}

          {/* 10 — What Done does */}
          {cs.addMore && (
            <CSSection id="add-more" width={1000}>
              <CSBody paragraphs={cs.addMore.body} />
              <Figure figure={cs.addMore.figure} onOpen={open} />
            </CSSection>
          )}

          {/* 11 — Strong / weak */}
          {cs.strength && (
            <CSSection id="strength" width={880}>
              <CSHeading>{cs.strength.heading}</CSHeading>
              <CSCompareColumns columns={cs.strength.columns} className="w-full" />
            </CSSection>
          )}

          {/* 12 — Testing outcomes */}
          {cs.testing && (
            <CSSection id="testing" width={928}>
              <CSLabel>{cs.testing.badge}</CSLabel>
              <CSHeading>{cs.testing.heading}</CSHeading>
              <CSBody paragraphs={cs.testing.intro} />
              <CSCallout lines={cs.testing.task} gap={false} className="w-full" />
              <CSResultCards items={cs.testing.results} className="w-full" />
              <CSBody paragraphs={cs.testing.body} />
              <CSCallout lines={cs.testing.caveat} className="w-full" />
            </CSSection>
          )}

          {/* 13 — If this shipped */}
          {cs.ifShipped && (
            <CSSection id="if-shipped" width={928}>
              <CSLabel>{cs.ifShipped.badge}</CSLabel>
              <CSHeading>{cs.ifShipped.heading}</CSHeading>
              <CSBody paragraphs={cs.ifShipped.intro} />
              <CSList items={cs.ifShipped.signals} />
              <CSCallout lines={cs.ifShipped.callout} className="w-full" />
            </CSSection>
          )}

          {/* 14 — Learnings */}
          {cs.learnings && (
            <CSSection id="learnings" width={928}>
              <CSLabel>{cs.learnings.badge}</CSLabel>
              <CSHeading>{cs.learnings.heading}</CSHeading>
              <CSBody paragraphs={cs.learnings.body} />
            </CSSection>
          )}
        </div>

        <Lightbox figure={lightbox} onClose={() => setLightbox(null)} />
      </article>
    </>
  )
}

// A prose column beside one of the research panels: 567 + 24 + 591 = the
// frame's 1182 measure. Side by side once there's room for all 1182, stacked
// under that, with the panel scaling to whatever width it lands in.
function PanelRow({ copy, panel, reverse = false }) {
  return (
    <div
      className={`mx-auto flex w-full max-w-cs-1182 flex-col items-center justify-center gap-cs-stack ${
        reverse ? 'min-[1280px]:flex-row-reverse' : 'min-[1280px]:flex-row'
      }`}
    >
      <div className="w-full min-[1280px]:w-[567px] min-[1280px]:shrink-0">{copy}</div>
      <div className="w-full min-[1280px]:w-[591px] min-[1280px]:shrink-0">{panel}</div>
    </div>
  )
}

// One of the six Today-screen moves: a bold ordinal, then the change.
function Step({ index, body }) {
  const reveal = useReveal()
  return (
    <motion.div {...reveal} className="flex w-full items-start gap-2.5 text-cs-copy">
      <p className="font-cs shrink-0 text-cs-body-xl font-bold">
        {String(index + 1).padStart(2, '0')}
      </p>
      <p className="font-cs min-w-0 flex-1 text-cs-body-xl font-normal">
        <CSRich>{body}</CSRich>
      </p>
    </motion.div>
  )
}

// Full-bleed band that opens the case study — the frame's own hero: the App
// Store screenshot pinned to the left on the product's brand blue, with the
// title and tagline centred over it. Hides itself without an image so an
// unfinished project never ships a bare colour band.
function CaseStudyHero({ hero, title, tagline }) {
  const reveal = useReveal()
  if (!hero?.image?.src) return null
  return (
    <section className="relative w-full overflow-hidden bg-mfp-blue">
      <div className="relative mx-auto flex min-h-[380px] w-full max-w-[1440px] flex-col items-center justify-center gap-cs-stack px-6 py-16 text-center sm:min-h-[420px] sm:py-20 lg:h-[514px] lg:min-h-0 lg:py-0">
        <img
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.width}
          height={hero.image.height}
          fetchpriority="high"
          className="relative z-0 h-auto w-full max-w-[200px] sm:max-w-[220px] lg:absolute lg:left-[26px] lg:top-[12px] lg:h-[500px] lg:w-[333px] lg:max-w-none lg:object-cover"
        />
        <motion.h1
          {...reveal}
          className="font-cs relative z-10 text-4xl font-semibold leading-[1.05] tracking-tight text-cs-inverse sm:text-6xl lg:whitespace-nowrap lg:text-cs-5xl"
        >
          {title}
        </motion.h1>
        {tagline && (
          <motion.p
            {...reveal}
            className="font-cs relative z-10 w-full max-w-[684px] text-lg font-normal leading-snug text-cs-inverse sm:text-2xl lg:text-cs-tagline"
          >
            {tagline}
          </motion.p>
        )}
      </div>
    </section>
  )
}

// The narrow fact-sheet rail beside Background — my role, status, type and
// tools. The frame parks it at x=114 on a 1440 canvas, i.e. 606px left of
// centre, so at 1440 and above it takes exactly that position; below that
// there is no room for it beside a centred 593px column, so it reads as a
// fact sheet above the narrative instead.
function BackgroundMeta({ items }) {
  const reveal = useReveal()
  if (!items?.length) return null
  return (
    <motion.dl
      {...reveal}
      className="mx-auto mb-cs-stack flex w-full max-w-cs-593 flex-col gap-10 min-[1440px]:absolute min-[1440px]:left-[calc(50%-606px)] min-[1440px]:top-0 min-[1440px]:mx-0 min-[1440px]:mb-0 min-[1440px]:w-[163px]"
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-start gap-2">
          <CSSubheading as="dt">{item.label}</CSSubheading>
          <dd className="w-full">
            <ul className="font-cs list-disc pl-6 text-cs-body-xl font-normal text-cs-primary">
              {item.items.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </motion.dl>
  )
}

// Thin reading-progress bar pinned above the header. Case studies are the
// only long-form pages, so this is the one place a progress indicator earns
// its keep. Scroll-linked scaleX — no animation loop, no layout work.
function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-text"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

