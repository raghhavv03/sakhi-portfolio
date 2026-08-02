// ---------------------------------------------------------------------------
// ALL site content lives here — never hardcode copy/links inside components.
//
// Empty strings and empty arrays are meaningful: every consumer treats missing
// data as "don't render this". An absent résumé hides the Resume button rather
// than shipping a dead link, an empty `education` array hides that whole
// section, and so on. So leave a value empty until it's real — never a
// placeholder string, which would render as visible filler.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// PREVIEW SWITCH — layout review only. DO NOT SHIP WITH THIS ON.
//
// Because the site hides an affordance until its fact is real, none of the
// Resume / Behance / shop controls can be *seen* while those facts are
// outstanding — which makes their placement impossible to review. This fills
// them with deliberately fake stand-ins so every button renders. The `#` hrefs
// go nowhere on purpose: a plausible-looking invented URL is worse than an
// obviously fake one, because it might belong to somebody.
//
// Email and LinkedIn are real now, so they no longer pass through this.
//
// Set to `false` and every one of them disappears again — the hiding logic
// itself is untouched. Replace the real values below as they arrive, then
// delete this block.
// ---------------------------------------------------------------------------
const PREVIEW_UNPUBLISHED = true
const preview = (real, stand_in = '#') =>
  real || (PREVIEW_UNPUBLISHED ? stand_in : '')

export const site = {
  name: 'Sakhi Rana',
  role: 'UI/UX & Product Designer',
  bio: 'UI/UX designer working on product problems — research first, then the interface that answers it.',
  copyright: '© 2026 Sakhi Rana · Built with love',
}

// Footer closing copy — the centred sign-off band at the bottom of every page.
export const footer = {
  heading: 'Thanks for stopping by!',
  subtext:
    "Feel free to reach out if you'd like to chat, collaborate, or simply say hello.",
  // The one connect affordance that never depends on a fact we don't have yet:
  // the contact form. LinkedIn and email join it as soon as they exist.
  sayHello: 'Say hello',
}

export const contact = {
  email: 'sakhirana03@gmail.com',
  // Formspree form endpoint — https://formspree.io/f/<id>. Empty means the
  // contact form stays UI-only: it still validates and acknowledges, and says
  // so, rather than posting into nowhere. Paste the endpoint here and the same
  // form starts delivering to the inbox above with no code change.
  formEndpoint: 'https://formspree.io/f/xlgqyjlr',
  invite:
    "Open to product design roles, collaborations, and meaningful conversations. Tell me what you're building, and I'll get back to you.",
}

export const links = {
  resume: preview(''), // path to a PDF in /public — opens in a new tab for viewing
  linkedin: 'https://www.linkedin.com/in/sakhi-rana-717548212',
  behance: preview(''),
}

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const hero = {
  name: "Hey, I'm Sakhi!",
  opening:
    'I design products that are useful, intuitive, and built around people.',
  // The hero artwork is the same desk in two lights, and the lamp in it is
  // the site's theme switch. Both frames need their own alt text, because
  // which one you are looking at is itself the state of the control.
  // `hint` is the small glass pill above the lamp — the cursor label only
  // exists on a fine pointer, so this is what makes the switch findable on a
  // phone. Empty hides the pill.
  scene: {
    hint: 'Try me!',
    altLight:
      'Illustration of a designer at a sunlit desk — laptop, sketchbook of wireframes, coffee and plants, with a park and city skyline through the window.',
    altDark:
      'The same desk at night — the desk lamp is lit, the laptop glows, and the park outside sits under a moonlit sky.',
  },
}

// Home's journey section — parked on `journey-branch` until ready. Not rendered
// on main; restore by bringing back `Journey.jsx` and mounting it on Home.
export const journey = {
  badge: 'Journey',
  heading: 'The long way round to design',
  subhead:
    "Every design has a backstory. Mine didn't start on a screen — it started with a hook, a ball of yarn, and a lockdown.",
  chapters: [
    {
      label: 'Chapter 01',
      title: 'Lockdown and a crochet hook',
      body: "When everything paused in 2020 I picked up a hook and yarn. It turned out to be a first lesson in structure: one thread, repeated in a pattern, becomes an object that holds its shape. That's the same thing a component is.",
    },
    {
      label: 'Chapter 02',
      title: 'Crochet Curio',
      body: 'The hobby became a small business — orders, packaging, shipping, replies, a shop feed to keep alive. It taught me the thing I still design around: a beautiful product counts for nothing if the path to it is awkward.',
    },
    {
      label: 'Chapter 03',
      title: 'The MBA',
      body: 'I wanted the why behind the numbers, so I went and studied them. Business value, funnels, and — the part that stuck — the psychology of the person deciding whether something is worth their time.',
    },
    {
      label: 'Chapter 04',
      title: 'Finding UX',
      body: 'Then the pieces met: the tactile making, the business sense, and a stubborn interest in why people struggle with things. Wireframes became the new patterns, design systems the new inventory.',
    },
  ],
  closing: 'Which is where the work below picks up.',
}

// Home's portfolio section.
export const work = {
  badge: 'Work',
  heading: 'Explore my work',
}

// Projects. `status: 'live'` opens /work/:slug; `status: 'coming-soon'` is
// non-clickable with an In progress badge.
//
// A `caseStudy` is a sequence of named sections rendered by CaseStudy.jsx.
// Prose is written as an array of paragraphs; **double asterisks** mark the
// only inline emphasis the renderer understands (see CSRich in Blocks.jsx).
export const projects = [
  {
    slug: 'myfitnesspal',
    name: 'MyFitnessPal',
    description:
      'Turned repetitive logging into a recognition-first experience.',
    thumbnail: '/images/myfitnesspal/thumbnail.webp',
    // Name uses the site's heading ink (`text-text`) — same as every other
    // heading — rather than inverse white. The blue field stays; the type
    // does not invent a third colour for this one card.
    status: 'live',
    caseStudy: {
      title: 'MyFitnessPal',
      // Full-bleed hero band on the product's own brand blue, opening the
      // case study. Hides itself if the image is absent.
      hero: {
        image: {
          src: '/images/myfitnesspal/hero-app-store.webp',
          alt: 'MyFitnessPal on the App Store, shown on an iPhone',
          width: 333,
          height: 500,
        },
      },
      tagline:
        'Redesigning a nutrition tracker so it stops asking you to log the same meal you have logged 200 times',

      // 1 — Background
      background: {
        badge: 'Background',
        heading: 'One small action, done all day, holds the product up',
        // Fact-sheet rail beside the narrative — my role, status, type, tools.
        meta: [
          {
            label: 'My Role',
            items: ['Product designer', 'UX Research', 'Prototyping & Testing'],
          },
          { label: 'Status', items: ['Concept', 'Hi-Fi prototype'] },
          { label: 'Type', items: ['Mobile App', 'B2C', 'Tracking'] },
          {
            label: 'Tools Used',
            items: ['Figma', 'Figma Make', 'NotebookLM', 'Lyssna', 'Sunbeam CX'],
          },
        ],
        body: [
          "MyFitnessPal is the world's most widely used nutrition tracker, with over 200 million registered users since 2005. The product runs on one daily loop: you log your meals, the app reports whether you're within your calorie and macro goals, and you adjust.",
          "Only around 30 million of those registered users log in a given month, so the daily habit is the free tier's retention engine. Friction in that loop is a retention problem, not a polish problem.",
          'Logging is the mechanism the entire product depends on.',
        ],
      },

      // 2 — Problem
      problem: {
        badge: 'Problem',
        heading: 'Logging got harder, in two different ways',
        body: [
          "Problem 1: **The redesign took the working things away**. MyFitnessPal's April 2026 redesign stripped the shortcuts that made logging fast and pushed the day out of sight, a navigational and cognitive regression on its most-used flow.",
          'Problem 2: **Even fixed, logging stays repetitive**. People eat the same foods every day, yet the only thing the app offers back is a verbatim copy of one past day. Every other repeat is a trip into the logger to re-pick the same items by hand.',
        ],
      },

      // 3 — Design challenge
      designChallenge: {
        badge: 'Design Challenge',
        heading: 'One question had to answer both problems',
        body: [
          'Both problems are the same problem at two depths: **logging costs more than it should**. So I set myself one question and solved them together, on a single surface:',
        ],
        question:
          'How might we take the effort back out, the effort the redesign added, and the effort the product never removed, without a new screen and without touching the paywall?',
      },

      // 4 — Solution preview
      solution: {
        badge: 'Solution',
        heading: 'I took the effort back out of logging',
        body: [
          'Solution 1: **I put the fast back in**. I brought back the stripped shortcuts and rebuilt the Today page so a logged day is visible and loggable at a glance, with nothing behind Premium and no new screens.',
          "Solution 2: **I stopped making people repeat themselves.** Re-logging a familiar meal is now near-instant. Why that repetition is the app's to carry, not the user's, and how it does now, is where the research picks up.",
        ],
      },

      // 5 — Discovery
      discovery: {
        badge: 'Discovery',
        heading: 'I mapped every friction point before redesigning',
        body: [
          'I documented the current experience screen by screen, annotating both where the interface creates friction and where the app makes me re-enter foods it already has on record.',
        ],
        figures: [
          {
            src: '/images/myfitnesspal/ui-teardown.webp',
            width: 1000,
            height: 449,
            alt: 'Teardown board: the current MyFitnessPal screens in a row, each annotated with the friction it creates',
            caption: 'The UI teardown',
          },
          {
            src: '/images/myfitnesspal/repeat-journey.webp',
            width: 1000,
            height: 490,
            alt: 'Journey board: the current repeat-logging path, screen by screen, annotated with where the app asks the user to do work it could do itself',
            caption: 'Repeat logging user journey',
          },
        ],
      },

      // 6 — Research
      research: {
        badge: 'Research',
        heading:
          'The reviews diagnose the redesign; the literature diagnoses the product',
        intro: [
          'My diagnosis was secondary-led: thematic and sentiment analysis of roughly 2,000 App Store and Trustpilot reviews via Sunbeam CX, triangulated against the official MyFitnessPal community thread, plus a literature review to ground the response.',
        ],

        // Sentiment — prose beside the Sunbeam CX panel.
        sentimentBody: [
          "**The redesign is a measurable regression, not ordinary resistance to change**. Sentiment across the reviews ran 55 percent negative against an overall NPS of −14. **Dislike** of the **redesign** was the single **largest theme**. This isn't blanket hostility: calorie and macro tracking and the app's long-standing ease of use still draw strongly positive mentions. The negativity is specific to what changed, which makes it a clean signal.",
        ],
        sentiment: {
          title: 'The redesign moved sentiment sharply negative',
          source:
            'Sunbeam CX ~ 2,000 App Store & Trustpilot reviews • Apr-Jun 2026',
          splitLabel: 'Sentiment split',
          // Widths are the frame's own, not a recomputation of the percentages.
          segments: [
            { label: '55%', width: 301.063, tone: 'negative' },
            { label: '4%', width: 40.341, tone: 'neutral' },
            { label: '41%', width: 213.284, tone: 'positive' },
          ],
          stats: [
            { label: 'Overall NPS', value: '-14', note: 'Last 30 days' },
            { label: 'Comments analysed', value: '1,999', note: '30-day window' },
            {
              label: 'Redesign dislike',
              value: '586',
              note: 'Mentions • -98 sentiment',
            },
            {
              label: 'Asking for the old UI',
              value: '63',
              note: '+40 cite no revert option',
            },
          ],
        },

        // Friction — the thematic chart beside the conclusion it supports.
        frictionHeading: 'The previous experience served the daily habit better',
        frictionIntro: [
          '**The friction has a specific shape**. Coding the complaints surfaced four recurring types rather than one diffuse grievance:',
        ],
        frictionTypes: [
          '**More steps and effort** for basic actions.',
          '**Removed or buried features**: copy-day, editing, and any option to revert.',
          '**Lost visibility of the day**: the full diary no longer readable at a glance.',
          '**Harder navigation and broken habits**: removed gestures, disrupted muscle memory.',
        ],
        frictionConclusion: [
          '**Navigation** **and** **visibility** **dominate**. The redesign didn’t make the app do less; it made the day **harder to see, reach, and control**. That is the exact ease-of-use I set out to restore.',
        ],
        chart: {
          title: 'What the users say redesign broke',
          source:
            'The bars show how many reviews raised each issue - thematic analysis via Sunbeam CX, ~ 2,000 App Store & Trustpilot reviews, Apr-Jun 2026',
          callout: {
            title:
              '586 reviews dislike the redesign overall, the single largest theme',
            body: 'Grouped below are the specific frictions inside that dislike, sorted into four types.',
          },
          // `width` is the bar's drawn length in the frame, not value × scale —
          // the frame's bars are drawn, not plotted, so they are copied as drawn.
          groups: [
            {
              label: 'More steps & effort',
              tone: 'steps',
              rows: [
                {
                  label: 'Increased steps & effort for basic functions',
                  width: 213.103,
                  value: '78',
                },
                {
                  label: 'Increased complexity & steps in food logging',
                  width: 149.838,
                  value: '52',
                },
              ],
            },
            {
              label: 'Removed / buried features',
              tone: 'removed',
              rows: [
                {
                  label: 'Removal / burying of previously accessible features',
                  width: 133.855,
                  value: '55',
                },
                {
                  label: 'No option to revert to the old version',
                  width: 95.896,
                  value: '40',
                },
                {
                  label: 'Loss of edit / delete on logged meals',
                  width: 61.267,
                  value: '29',
                },
                { label: 'Loss of copy-day', width: 47.282, value: '25' },
              ],
            },
            {
              label: 'Lost visibility of the day',
              tone: 'visibility',
              rows: [
                {
                  label: 'Can’t view the full diary at a glance',
                  width: 111.213,
                  value: '41',
                },
                {
                  label: 'Reduced visibility of nutrition info',
                  width: 47.282,
                  value: '25',
                },
                {
                  label: 'Loss of at-a-glance food & nutrient data',
                  width: 35.295,
                  value: '18',
                },
              ],
            },
            {
              label: 'Harder navigation & broken habits',
              tone: 'navigation',
              rows: [
                {
                  label: 'Workflow & muscle-memory disruption',
                  width: 111.213,
                  value: '41',
                },
                {
                  label: 'Difficulty navigating the new interface',
                  width: 65.263,
                  value: '31',
                },
                {
                  label: 'More clicks; features now hidden',
                  width: 58.603,
                  value: '29',
                },
                {
                  label: 'More clicks; features now hidden',
                  width: 9.989,
                  value: '3',
                },
              ],
            },
          ],
        },

        // Literature — three findings, then what they add up to.
        literatureIntro: [
          'For **Problem 2**, I turned to the behavioural research on how people log food.',
        ],
        literature: [
          {
            title: 'Eating is highly repetitive',
            body: 'People re-log the same foods far more than they log new ones, and individual items recur more reliably than whole meals. Repetition, not novelty, is the pattern to design for.',
            citation: 'Pai & Sabharwal, 2022; Hagerman et al., 2026',
          },
          {
            title: 'That repetition is predictable from recency',
            body: "Next-day food choices can be modelled from a user's own history, with recent entries the strongest signal. Surfacing likely foods is feasible, not speculative.",
            citation: 'Liu et al., 2019',
          },
          {
            title: 'Logging effort is a barrier, but not all effort is equal',
            body: 'Manual entry is a documented reason people stop logging, yet removing effort indiscriminately weakens the habit. The redesign cuts the wasted effort of re-searching known foods while preserving the deliberate act of logging.',
            citation: 'König et al., 2021; Turner-McGrievy et al., 2021',
          },
        ],
        synthesisHeading:
          'Together these name the deeper problem the reviews only hinted at',
        synthesis: [
          "MyFitnessPal holds every user's logging history, the exact record that makes their next meal predictable. It does use it, but every **fast path it offers bills the user first**, in setup or in navigation or both, and the only one that asks nothing is the one that **simply replays a past day verbatim**. The signal is sitting right there, and the **app never surfaces the likely food**. **Repeat logging isn't a habit users should have to accept**. It is the mark of a product that **holds the pattern and leaves the work to the user**.",
          "**No tracker closes the gap**. YAZIO, Cronometer, and Lose It! offer the same kind of help, copy-to-day, favourites, recent and frequent lists, saved meals and recipes, and all of it is manual reuse you either build or navigate to. The closest thing to time-awareness anywhere is Cronometer's Repeat Items, a paid feature, and even that is a fixed schedule you define by hand, not a prediction.",
        ],
      },

      // 7 — Product decision: the Today screen, six moves
      productDecision: {
        badge: 'Product decision',
        heading: 'Both fixes live on one surface',
        subLabel: 'Solution 1: The Today Screen',
        // `spaced` reproduces the extra 30px the frame puts above a step that
        // follows a figure rather than another step.
        steps: [
          {
            body: '**Reclaimed the top of the screen**. The weekly date strip was removed to open space and lift all four meal cards into view, so a logged day is visible and loggable without scrolling. Its streak duplicated the counter already in the top-right, and its only other role, moving between days within the current week, was folded into the redesign’s day navigation.',
          },
          {
            body: '**Merged the calorie and macro cards, and brought the day’s nutrition onto Today**. The two stacked cards became one combined strip, freeing more vertical space. That strip also gained a "Nutrition facts" toggle that opens the day’s full nutrient breakdown in a sheet, so the fuller view sits with the calories and macros it belongs to, rather than two screens away under Progress.',
            figure: {
              src: '/images/myfitnesspal/today-nutrition.webp',
              width: 1000,
              height: 639,
              alt: 'Redesigned Today screen beside the Nutrition facts sheet it now opens',
            },
          },
          {
            spaced: true,
            body: '**Moved day navigation to a swipe, with a jump-to-today**. Moving between days is now a swipe and the "‹ Today ›" control at the top, replacing the removed strip’s week-bound jumping. Because navigating to another date, for instance to copy a meal to or from another day, meant re-selecting today’s date to get back, a "jump to today" button now returns you in one tap.',
            figure: {
              src: '/images/myfitnesspal/day-navigation.webp',
              width: 1000,
              height: 639,
              alt: 'Redesigned day navigation — a swipe between days with a jump-to-today control',
            },
          },
          {
            spaced: true,
            body: '**Added the batch shortcuts**. "Copy Full Day" and "Select" now live in the overflow menu beside "View all", and Select opens a checklist to delete several foods in one action instead of removing them one at a time.',
            figure: {
              src: '/images/myfitnesspal/batch-shortcuts.webp',
              width: 1000,
              height: 639,
              alt: 'Select-and-delete checklist, the overflow menu, and the copy-entire-day screen',
            },
          },
          {
            spaced: true,
            body: '**Moved the diary inline**. The diary now expands in place on the Today screen with a "View all / View less" toggle, removing the separate screen that repeated the strip and ended in a "Log more" button leading to the same search the add button already opens. That screen held one thing worth keeping, the meal’s macro split, so it now sits inline on each expanded meal card beside the calorie total. The breakdown of a meal is readable in the diary itself, and no information was lost with the screen that carried it. A food goes straight to its edit screen without the extra stop.',
          },
          {
            body: '**Rebuilt Edit Entry around the number being changed**. The calorie total and its macro split moved to the top, above the fields and laid out in one line to create some white space and consistency. Servings gained a plus and minus stepper, making the most common edit on this screen a tap rather than a keyboard entry. Per-food nutrition facts keep their expand toggle, now sitting directly under the fields instead of below a full-width ad and a Premium block, where the control was easy to miss. Collapsed stays the default because this screen exists to set an amount, not to read a table, and a single food’s breakdown is an occasional lookup rather than the reason you opened it.',
            figure: {
              src: '/images/myfitnesspal/inline-diary-edit.webp',
              width: 1000,
              height: 1080,
              alt: 'Today with the diary expanded inline, the nutrition sheet, and the rebuilt Edit Entry screen',
            },
          },
        ],
      },

      // 8 — Solution 2: repeat logging
      repeatLogging: {
        label: 'Solution 2: Repeat Logging',
        heading: 'The Hero: The app should carry the repetition, not the user',
        body: [
          'The redesigned diary surfaces the foods a consistent user is most likely to log, predicted from their own history by day, time, and recency, on the meal card itself rather than behind a search. Logging shifts from recall to recognition, and from a search task to a confirmation.',
          'It targets users with existing logging history, since prediction needs a pattern to learn from. Two of those three signals already exist in MyFitnessPal, split across a filter and a sort you have to set yourself. What no tracker does is weigh them together, add the day of the week, and put the answer where you already are without being asked.',
        ],
        signals: [
          {
            kicker: 'Strongest signal',
            title: 'Recency',
            body: 'What you have logged in the last few days.',
          },
          {
            kicker: 'The corrective',
            title: 'Day',
            body: 'Day is the day of the week: a weekday lunch and a weekend lunch are often different meals, so foods logged on the same weekday count for more.',
          },
          {
            kicker: 'The meal slot',
            title: 'Time',
            body: 'Time is the meal slot you are logging into, breakfast, lunch, dinner, or snacks. Open Dinner at breakfast time and you still get your usual dinner foods.',
          },
        ],
      },

      // 9 — Where the prediction sits
      predictionCard: {
        heading: 'Surfacing predictions where users already log meals',
        body: [
          'I placed the prediction on the meal card at the empty slot, the moment the user has already decided to log. Intent and the food meet in the same place.',
          'The card holds two offers that answer different questions. Swipe to copy replays a past meal verbatim. The frequent carousel surfaces what the user eats most at this meal, on this day. The same food can sit in both: if the user had egg and coffee yesterday and eats them most mornings, they land in the copy line and rank first in the carousel at once. That overlap is just the two signals pointing at the same food, one **reading yesterday**, the other **reading frequency**.',
          "**The two paths cannot collide**. Copying yesterday is all or nothing, so hand-picking even one food from the **frequent at breakfast** means the day is no longer yesterday's, and the **copy offer drops away**. **Copy** meal instead, and egg and coffee are already logged, so the carousel drops just those and surfaces the next most frequent foods. Neither path can add the same food twice.",
          'Each chip carries a stepper to set servings before logging, so the amount is right at the moment the food goes in rather than corrected in a separate edit afterward.',
        ],
        // The device frame's 4.613px stroke sits outside its 276.761 × 600
        // box, so the export is that much larger on every side. Rendering at
        // the export's own size and pulling it back by the stroke keeps the
        // screen itself exactly where the frame puts it.
        figure: {
          src: '/images/myfitnesspal/prediction-card.webp',
          width: 285.99,
          height: 609.23,
          alt: 'Breakfast meal card with the swipe-to-copy line and the frequent-at-breakfast carousel',
        },
      },

      // 10 — What Done does
      addMore: {
        body: [
          '**Done collapses the carousel into a single Add more button**, clearing the meal card back to the uninterrupted diary view. The prediction is assembly-time scaffolding; once the meal is built, keeping it on screen would compete with the diary for the user’s attention.',
          'Add more holds the return path: the carousel is one tap away, so a food recalled after the fact is added in place rather than through search. The card commits without locking.',
        ],
        figure: {
          src: '/images/myfitnesspal/add-more-card.webp',
          width: 1000,
          height: 639,
          alt: 'Today after Done — the carousel collapsed to a single Add more button on the built meal card',
        },
      },

      // 11 — Strong / weak
      strength: {
        heading: 'Where the prediction is strong, and where it is not',
        columns: [
          {
            label: 'Strong',
            body: [
              'It runs on repetition, so it works best for the most consistent loggers. Day earns its place for people whose weekdays and weekends differ, where it keeps recency from offering a Monday lunch on a Sunday.',
              'Its value concentrates on people who log by habit but never build a saved meal or recipe, the users for whom every repeat is still a search.',
            ],
          },
          {
            label: 'Weak',
            body: [
              'The feature is weakest where there is nothing to learn from, a new account with no history, or eating that does not repeat at all.',
              'For the smaller, disciplined group who already curate and reuse their own saved meals, prediction is a convenience rather than a transformation.',
            ],
          },
        ],
      },

      // 12 — Testing outcomes
      testing: {
        badge: 'Testing outcomes',
        heading: 'Users reached the food by recognition, not search',
        intro: [
          'I tested the repeat-logging flow in Lyssna as an interactive prototype, to see whether it held up in a real hand and not just on paper.',
          'The goal was not to validate the prediction itself. I wanted to know whether a user notices the surfaced food and understands that tapping it logs the food. Discoverability and comprehension of the card were the whole target.',
        ],
        task: [
          'I tested one task scenario:',
          "**Add a banana to breakfast**: a neutral start on the day's log, with no path pointed out and no mention that a search route existed.",
        ],
        results: [
          {
            value: 'Every user',
            label:
              'Every user logged the food by tapping it on the card; none went looking for search or manual entry.',
          },
          {
            value: 'A third',
            label:
              'A third never consciously noticed the "Frequent at breakfast" label and still logged through the card, so it works even when the user is not reading it.',
          },
        ],
        body: [
          'The only friction was in the card being noticed, not in it being used once seen, which points at its visibility as the thing to strengthen, not its operation.',
          'Users tapped the food because they could see it. The card shows the actual food, so recall became recognition: instead of remembering a food and searching for it, users just saw it and tapped. The prediction works quietly in the background; to the user, the food is simply already there.',
        ],
        caveat: [
          'What this does not prove',
          'This validates delivery, not accuracy. The test proves a surfaced food is found and understood with no learned path to lean on. It does not test whether the prediction is right, because a static prototype with no logging history has no real signal to predict from. Delivery is proven. Accuracy sits outside what a prototype can show, and would need a live build with real history to measure.',
        ],
      },

      // 13 — If this shipped
      ifShipped: {
        badge: 'If this shipped',
        heading: 'Prototype testing can only tell you so much',
        intro: [
          'This is a concept project, so there is no production data, and a static prototype has no history to predict from. Accuracy is the thing only a real build could expose. With live history behind it, these are the signals I would watch:',
        ],
        signals: [
          "How often the surfaced foods are the ones actually logged, split by how consistent the user's history is",
          'Whether the day-of-week signal earns its place, comparing hit rate on weekdays against weekends for the same user',
          'Repeat-log completion time for users with history against those without',
          'Whether faster repeats change logging frequency itself, since a lower-effort log could deepen the habit or quietly thin out what gets recorded',
          'Review sentiment on logging effort, the source that diagnosed the problem, read again after the change',
        ],
        callout: [
          'Most important question',
          "Whether the prediction stays honest as a life changes. A model that leans on history is slow to notice when someone's eating actually shifts, and the real test is whether it keeps surfacing old habits after they have stopped being true.",
        ],
      },

      // 14 — Learnings
      learnings: {
        badge: 'Learnings',
        heading:
          'The interface was doing what it was told. The product was telling users to repeat themselves.',
        body: [
          'The redesign was the visible problem, but not the deep one. Underneath it, the app already held the pattern and still handed the work of repeat logging back to the user every day. The interface was not failing. It was faithfully carrying a product decision.',
          'Once I saw it that way, the design followed. The fast paths did not need more polish, they needed the app to stop asking for work it already had the answer to. Both problems turned out to be the same one at two depths.',
          'That is the lesson I am carrying forward: before smoothing a flow, check what the product is quietly making users do for it, because the heaviest friction is often a decision, not a screen.',
        ],
      },
    },
  },
  {
    slug: 'project-two',
    name: 'Next case study',
    description:
      "A second project is in progress. It'll land here once the work is done.",
    thumbnail: '',
    status: 'coming-soon',
    caseStudy: null,
  },
]

// ---------------------------------------------------------------------------
// About. Every string below is Sakhi's own, from the "Website changes" Figma
// frame — not a draft written for her.
//
// The three photo groups (`makes`, `offDuty.cats`, `offDuty.trips`) are read
// by one component. A `caption` is what the card names itself as when it is
// lifted out of the stack; leave it empty and the photo simply carries no
// label. `alt` always describes the picture, caption or not.
// ---------------------------------------------------------------------------
export const about = {
  badge: 'About me',
  heading: 'A little bit about me...',
  statement: "I didn't study product design. I found my way to it.",
  paragraphs: [
    'I graduated in 2025 with an MBA in Marketing, where I spent a lot of time understanding consumer behavior, human psychology, and what makes people connect with products. Somewhere along the way, my focus shifted from why people choose products to how those products are shaped in the first place. That curiosity eventually led me to product design.',
    "Today, I spend a lot of my time paying attention to the little things most people overlook. I like noticing why one interaction feels effortless while another doesn't, questioning the decisions behind products I use every day, and exploring how thoughtful design can quietly make life easier.",
  ],
  portrait: {
    src: '/images/about/portrait.webp',
    alt: 'Sakhi in a grey saree, standing against a red brick wall',
    width: 720,
    height: 927,
  },

  // The Crochet Curio makes — the shop's own catalogue, in the frame's order.
  makes: [
    {
      src: '/images/about/make-coasters.webp',
      alt: 'Crocheted flower coasters in red, blue, orange, and yellow',
      caption: 'Tea & coffee coasters',
    },
    {
      src: '/images/about/make-bucket-hat.webp',
      alt: 'A pale blue crocheted bucket hat',
      caption: 'Bucket hat',
    },
    {
      src: '/images/about/make-caroline-top.webp',
      alt: 'A teal crocheted top with green and white trim',
      caption: 'Custom Caroline top',
    },
    {
      src: '/images/about/make-cardigan.webp',
      alt: 'A white crocheted cardigan with strawberries across the front',
      caption: 'Strawberry cardigan',
    },
    {
      src: '/images/about/make-tote.webp',
      alt: 'A blue and white checkered crocheted tote bag',
      caption: 'Checkered tote bag',
    },
  ],

  background: {
    heading: 'Background',
    paragraphs: [
      'I have a habit of diving headfirst into things that spark my curiosity. Crochet was one of them. What began as learning a few stitches eventually turned into a small online business where I designed and sold handmade accessories and clothing through @crochetcurioo. It taught me that the most rewarding projects usually start with simply being willing to learn.',
      "I approach product design with that same curiosity. I'm always exploring new ideas, refining my thinking, and paying attention to the details that make experiences feel effortless. Outside of design, that curiosity finds its way into other parts of my life too. Right now, I'm learning German, working on my pickleball game, and probably adding another unexpected skill to the list.",
    ],
    // The shop's own page — the Instagram the copy already names. Empty would
    // hide the Visit button; it is real now, so it no longer needs `preview`.
    link: 'https://www.instagram.com/crochetcurioo?igsh=MTY0MzNkcjRiaWhldg==',
  },

  educationHeading: 'Where I studied',
  // Each entry: { institution, qualification, years }. Empty until filled —
  // the Education section doesn't render without it.
  education: [],

  offDuty: {
    heading: "When I'm not designing",
    paragraph:
      "I'm usually planning my next trip, trying a new sport, doing Pilates, trying to make every stray cat fall in love with me (they're rarely convinced), or convincing myself I have enough time to pick up yet another hobby.",
    cats: [
      {
        src: '/images/about/cat-1.webp',
        alt: 'A tabby cat looking straight into the camera',
        caption: 'pspspsps',
      },
      {
        src: '/images/about/cat-2.webp',
        alt: 'A tabby cat stretched out asleep on warm concrete',
        caption: '',
      },
      {
        src: '/images/about/cat-3.webp',
        alt: 'A black stray cat sitting in the sun by a wall',
        caption: '',
      },
    ],
    trips: [
      {
        src: '/images/about/trip-kayaking.webp',
        alt: 'A yellow kayak on the water in front of a marina',
        caption: 'First time kayaking!',
      },
      {
        src: '/images/about/trip-aquarium.webp',
        alt: 'Standing in front of a floor-to-ceiling aquarium tank',
        caption: 'Seattle Aquarium',
      },
      {
        src: '/images/about/trip-sunset.webp',
        alt: 'Palm trees against a pink and purple sunset',
        caption: 'Goa',
      },
      {
        src: '/images/about/trip-rainier.webp',
        alt: 'A forest trail through tall trees on Mount Rainier',
        caption: 'Trekking Mount Rainier',
      },
    ],
  },
}
