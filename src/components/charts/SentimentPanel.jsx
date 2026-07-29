import { useRef } from 'react'
import { useInViewOnce } from '../../lib/hooks'

// The Sunbeam CX sentiment panel, rebuilt at the frame's own geometry.
//
// The panel is drawn in Figma at 591px wide: 18.156px padding, a 12.104px
// radius, a 23px-tall split bar whose three segments are 301.063 / 40.341 /
// 213.284px, and a four-up stat row. Those widths are the design, not a
// derivation of the percentages — the frame's segments are drawn, so they are
// reproduced as drawn rather than recomputed from 55/4/41.
//
// Red / grey / green is the frame's actual encoding for negative / neutral /
// positive, which is why this chart is exempt from the site's no-saturated-hue
// rule. The bar grows on arrival from one observer on the panel, so all three
// segments move together as a single measurement (see useInViewOnce).

export const SENTIMENT_WIDTH = 591
// 591 less the panel's 18.156px padding on both sides — the exact sum of the
// three drawn segment widths.
const SENTIMENT_BAR = 554.688

const TONES = {
  negative: 'bg-cs-negative',
  neutral: 'bg-cs-neutral',
  positive: 'bg-cs-positive',
}

export default function SentimentPanel({ data }) {
  const ref = useRef(null)
  const shown = useInViewOnce(ref)
  if (!data) return null

  return (
    <div
      ref={ref}
      className="flex flex-col items-start gap-3 rounded-[12.104px] border border-border bg-surface p-[18.156px]"
      style={{ width: SENTIMENT_WIDTH }}
    >
      <div className="flex flex-col items-start gap-1 text-text">
        <p className="whitespace-nowrap text-[19.367px] font-semibold leading-[24.208px] tracking-[-0.6052px]">
          {data.title}
        </p>
        <p className="whitespace-pre text-[12px] leading-[16px] font-normal">
          {data.source}
        </p>
      </div>

      <div className="flex flex-col items-start gap-1">
        <p className="whitespace-nowrap text-[12px] leading-[16px] font-normal text-text">
          {data.splitLabel}
        </p>
        {/* The whole bar wipes in; the segments keep their drawn widths, so
            the split never renders at a ratio the frame doesn't show. */}
        <div
          className="flex h-[23px] items-center overflow-hidden rounded-[12.104px] transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: shown ? SENTIMENT_BAR : 0 }}
        >
          {data.segments.map((segment) => (
            <div
              key={segment.tone}
              className={`relative h-[47.811px] shrink-0 overflow-hidden ${TONES[segment.tone]}`}
              style={{ width: segment.width }}
            >
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[9.683px] font-normal leading-[14.525px] text-surface">
                {segment.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full items-center justify-between whitespace-nowrap text-text">
        {data.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-[6.052px] rounded-[10px] border border-border bg-surface p-[6.052px]"
          >
            <p className="text-[12px] leading-[16px] font-normal">{stat.label}</p>
            <p className="text-[28px] leading-[36px] tracking-[-0.5px] font-semibold">{stat.value}</p>
            <p className="text-[12px] leading-[16px] font-normal">{stat.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
