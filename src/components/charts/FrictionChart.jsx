import { Fragment, useRef } from 'react'
import { useInViewOnce } from '../../lib/hooks'

// "What the users say redesign broke" — the thematic bar chart, rebuilt at
// the frame's own geometry.
//
// Drawn in Figma at 591px wide: 23.5/20 padding, a 13.319px radius, 15.983px
// between groups, 13.319px bars on a 19.98px pitch, 9.323px group labels and
// 7.991px row labels. The bar lengths in portfolio.js are the lengths the
// frame draws, which are not value × a single scale — the chart is drawn, not
// plotted, so copying it faithfully means copying the drawn lengths.
//
// Labels are right-aligned in a `1fr` column so every bar starts on the same
// x, exactly as the frame positions them. One observer on the plot area grows
// every bar together on arrival.

export const FRICTION_WIDTH = 591

const TONES = {
  steps: 'bg-cs-steps',
  removed: 'bg-cs-removed',
  visibility: 'bg-cs-visibility',
  navigation: 'bg-cs-navigation',
}

export default function FrictionChart({ data }) {
  const ref = useRef(null)
  const shown = useInViewOnce(ref)
  if (!data) return null

  return (
    <div
      ref={ref}
      className="flex flex-col items-start gap-[15.983px] rounded-[13.319px] border border-cs-card-border bg-cs-card px-[23.5px] py-5"
      style={{ width: FRICTION_WIDTH }}
    >
      <div className="flex flex-col items-start gap-[2.664px] text-cs-secondary">
        <p className="font-cs text-[12.899px] font-semibold leading-[25.794px] tracking-[-0.403px]">
          {data.title}
        </p>
        {/* The frame sizes this card to this one un-wrapping line — it is
            what makes the panel 591 wide — so it must not wrap here either. */}
        <p className="font-cs whitespace-nowrap text-[7.991px] font-normal leading-[10.655px]">
          {data.source}
        </p>
      </div>

      <div className="flex w-full flex-col items-start gap-[5.328px] rounded-[6.659px] border-[0.666px] border-cs-callout bg-[rgba(129,124,255,0.5)] px-[13.319px] py-[9.989px] text-cs-secondary">
        <p className="font-cs text-[9.323px] font-semibold leading-[13.319px]">
          {data.callout.title}
        </p>
        <p className="font-cs text-[7.991px] font-normal leading-[10.655px]">
          {data.callout.body}
        </p>
      </div>

      {/* One grid for every row in the chart, not one per group: that is what
          puts all sixteen bars on a single left edge, the way the frame
          positions them. Group headers span the full width. Bars animate with
          scaleX rather than width so growing them never re-measures the
          label column. */}
      <div className="grid w-full grid-cols-[1fr_auto] items-center gap-x-[7.991px] gap-y-[6.661px]">
        {data.groups.map((group, g) => (
          <Fragment key={group.label}>
            <div
              className={`col-span-2 flex items-center gap-[10.655px] ${
                g > 0 ? 'mt-[9.322px]' : ''
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-[13.319px] shrink-0 rounded-[3.33px] ${TONES[group.tone]}`}
              />
              <p className="font-cs whitespace-nowrap text-[9.323px] font-semibold leading-[13.319px] text-cs-secondary">
                {group.label}
              </p>
            </div>

            {group.rows.map((row, i) => (
              <Fragment key={`${group.label}-${i}`}>
                <p className="font-cs whitespace-nowrap text-right text-[7.991px] font-normal leading-[10.655px] text-cs-secondary">
                  {row.label}
                </p>
                <div className="flex items-center gap-[7.991px]">
                  <div
                    className={`h-[13.319px] shrink-0 origin-left rounded-[3.33px] transition-transform duration-700 ease-out motion-reduce:transition-none ${TONES[group.tone]}`}
                    style={{
                      width: row.width,
                      transform: `scaleX(${shown ? 1 : 0})`,
                    }}
                  />
                  <p className="font-cs text-[7.991px] font-normal leading-[10.655px] text-cs-secondary">
                    {row.value}
                  </p>
                </div>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
