// ---------------------------------------------------------------------------
// ALL site content lives here — never hardcode copy/links inside components.
//
// Empty strings and empty arrays are meaningful: every consumer treats missing
// data as "don't render this". An absent résumé hides the Resume button rather
// than shipping a dead link, an empty `education` array hides that whole
// section, and so on. So leave a value empty until it's real — never a
// placeholder string, which would render as visible filler.
// ---------------------------------------------------------------------------

export const site = {
  name: 'Sakhi Rana',
  role: 'UI/UX & Product Designer',
  bio: 'UI/UX designer working on product problems — research first, then the interface that answers it.',
  copyright: '© 2026 Sakhi Rana · all rights reserved',
}

export const contact = {
  email: '', // e.g. 'hello@example.com' — empty hides every mailto affordance
  invite:
    "Open to product design roles, freelance work, and the occasional interesting problem. Tell me what you're building and I'll come back to you.",
}

export const links = {
  resume: '', // path to a PDF in /public — opens in a new tab for viewing
  linkedin: '',
  behance: '',
}

// Footer/contact social links. `label` doubles as the data-cursor label.
// Filtered, so a platform with no URL simply doesn't appear.
export const socials = [
  { platform: 'LinkedIn', label: 'LinkedIn', href: links.linkedin },
  { platform: 'Behance', label: 'Behance', href: links.behance },
].filter((s) => s.href)

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const hero = {
  name: 'Sakhi Rana',
  opening:
    "Hi, I'm Sakhi — a UI/UX designer who digs into why a product is hard to use, then designs the version that isn't.",
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
// only inline emphasis the renderer understands (see RichText.jsx).
export const projects = [
  {
    slug: 'myfitnesspal',
    name: 'MyFitnessPal',
    description:
      'Taking the effort back out of food logging — restoring what a redesign removed, and removing the repetition the product never did.',
    thumbnail: '/images/myfitnesspal/thumbnail.webp',
    status: 'live',
    caseStudy: {
      title: 'MyFitnessPal',
      // Small product mark beside the title. Empty until the file exists —
      // the tile just doesn't render. The same mark (full-bleed on the
      // product's blue) is the home-page project thumbnail.
      appIcon: {
        src: '/images/myfitnesspal/app-icon.webp',
        alt: 'MyFitnessPal app icon',
      },
      tagline:
        'A redesign of the daily logging loop: the shortcuts a 2026 update stripped, put back — and the repetition the app always left to the user, taken off their hands.',
      meta: [
        {
          label: 'Role',
          value: 'User research · UX design · Interaction design · Prototyping & testing',
        },
        { label: 'Tools', value: 'Figma · Figma Make · FigJam · NotebookLM · Lyssna' },
        { label: 'Platform', value: 'iOS · concept redesign' },
      ],

      // Lead: the problem and the result, before any process detail.
      challenge:
        "MyFitnessPal's April 2026 redesign stripped the shortcuts that made logging fast and pushed the day out of sight — a navigational and cognitive regression on its most-used flow. And even fixed, logging stays repetitive: people eat the same foods every day, yet the only thing the app offers back is a verbatim copy of one past day.",
      result:
        "Both fixes on one surface, with no new screen and nothing behind the paywall. The Today page shows a logged day at a glance again, and the diary now surfaces the foods you're most likely to log, predicted from your own history. In testing, every user logged by tapping the card — none went looking for search.",
      metrics: [
        { value: '1,999', label: 'reviews analysed' },
        { value: '55%', label: 'negative sentiment on the redesign' },
        { value: '0', label: 'new screens added' },
        { value: '100%', label: 'of testers logged via the card' },
      ],

      // 1 — Background
      background: {
        badge: 'Background',
        heading: 'One small action, done all day, holds the product up',
        body: [
          'MyFitnessPal is the world’s most widely used nutrition tracker, with over 200 million registered users since 2005. The product runs on one daily loop: you log your meals, the app reports whether you’re within your calorie and macro goals, and you adjust.',
          'Only around 30 million of those registered users log in in a given month, so the daily habit is the free tier’s retention engine. **Friction in that loop is a retention problem, not a polish problem.**',
        ],
        pullQuote: 'Logging is the mechanism the entire product depends on.',
        stats: [
          { value: '200M+', label: 'registered users since 2005' },
          { value: '~30M', label: 'log in in a given month' },
        ],
      },

      // 2 — Problem
      problem: {
        badge: 'Problem',
        heading: 'Logging got harder, in two different ways',
        items: [
          {
            eyebrow: 'Problem 1',
            title: 'The redesign took the working things away',
            body: 'MyFitnessPal’s April 2026 redesign stripped the shortcuts that made logging fast and pushed the day out of sight — a navigational and cognitive regression on its most-used flow.',
          },
          {
            eyebrow: 'Problem 2',
            title: 'Even fixed, logging stays repetitive',
            body: 'People eat the same foods every day, yet the only thing the app offers back is a verbatim copy of one past day. Every other repeat is a trip into the logger to re-pick the same items by hand.',
          },
        ],
      },

      // 3 — Design challenge
      designChallenge: {
        badge: 'Design challenge',
        heading: 'One question had to answer both problems',
        body: [
          'Both problems are the same problem at two depths: **logging costs more than it should.** So I set myself one question and solved them together, on a single surface.',
        ],
        question:
          'How might we take the effort back out of the most frequent action in the app — the effort the redesign added, and the effort the product never removed — without a new screen and without touching the paywall?',
      },

      // 4 — Solution preview
      solution: {
        badge: 'Solution',
        heading: 'I took the effort back out of logging',
        items: [
          {
            eyebrow: 'Solution 1',
            title: 'I put the fast back in',
            body: 'I brought back the stripped shortcuts and rebuilt the Today page so a logged day is visible and loggable at a glance — with nothing behind Premium and no new screens.',
          },
          {
            eyebrow: 'Solution 2',
            title: 'I stopped making people repeat themselves',
            body: 'Re-logging a familiar meal is now near-instant. Why that repetition is the app’s to carry, not the user’s — and how it does now — is where the research picks up.',
          },
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
            src: '/images/myfitnesspal/journey-annotated-1.webp',
            width: 2000,
            height: 996,
            alt: 'Annotated user journey — current MyFitnessPal screens with friction notes attached to each step',
            caption: 'Current journey, annotated — logging, filtering and reuse',
          },
          {
            src: '/images/myfitnesspal/journey-annotated-2.webp',
            width: 2000,
            height: 910,
            alt: 'Annotated user journey — continued, covering saved meals, recipes and repeat entry',
            caption: 'Continued — saved meals, recipes and every path back to a food already on record',
          },
        ],
      },

      // 6 — Research
      research: {
        badge: 'Research',
        heading:
          'The reviews diagnose the redesign, the literature diagnoses the product',
        intro: [
          'My diagnosis was secondary-led: thematic and sentiment analysis of roughly 2,000 App Store and Trustpilot reviews via Sunbeam CX, triangulated against the official MyFitnessPal community thread, plus a literature review to ground the response.',
        ],

        sentiment: {
          title: 'The redesign moved sentiment sharply negative',
          source:
            'Sunbeam CX · ~2,000 App Store & Trustpilot reviews · Apr–Jun 2026',
          splitLabel: 'Sentiment split',
          split: [
            { label: 'Negative', value: 55, tone: 'strong' },
            { label: 'Neutral', value: 4, tone: 'muted' },
            { label: 'Positive', value: 41, tone: 'accent' },
          ],
          stats: [
            { label: 'Overall NPS', value: '−14', note: 'Last 30 days' },
            { label: 'Comments analysed', value: '1,999', note: '30-day window' },
            {
              label: 'Redesign dislike',
              value: '586',
              note: 'Mentions · −98 sentiment',
            },
            {
              label: 'Asking for the old UI',
              value: '63',
              note: '+40 cite no revert option',
            },
          ],
        },

        sentimentBody: [
          '**The redesign is a measurable regression, not ordinary resistance to change.** Sentiment across the reviews ran 55 percent negative against an overall NPS of −14, and dislike of the redesign was the single largest theme.',
          'This isn’t blanket hostility: calorie and macro tracking and the app’s long-standing ease of use still draw strongly positive mentions. **The negativity is specific to what changed**, which makes it a clean signal.',
        ],

        chart: {
          title: 'What users say the redesign broke',
          source:
            'Reviews raising each issue — thematic analysis via Sunbeam CX, ~2,000 App Store & Trustpilot reviews, Apr–Jun 2026',
          callout:
            '586 reviews dislike the redesign overall — the single largest theme. Grouped below are the specific frictions inside that dislike, sorted into four types.',
          groups: [
            {
              label: 'More steps & effort',
              bars: [
                { label: 'Increased steps & effort for basic functions', value: 78 },
                { label: 'Increased complexity & steps in food logging', value: 52 },
              ],
            },
            {
              label: 'Removed / buried features',
              bars: [
                {
                  label: 'Removal or burying of previously accessible features',
                  value: 55,
                },
                { label: 'No option to revert to the old version', value: 40 },
                { label: 'Loss of edit / delete on logged meals', value: 29 },
                { label: 'Loss of copy day', value: 25 },
              ],
            },
            {
              label: 'Lost visibility of the day',
              bars: [
                { label: 'Can’t view the full diary at a glance', value: 41 },
                { label: 'Reduced visibility of nutrition info', value: 25 },
                { label: 'Loss of at-a-glance food & nutrient data', value: 18 },
              ],
            },
            {
              label: 'Harder navigation & broken habits',
              bars: [
                { label: 'Workflow & muscle-memory disruption', value: 41 },
                { label: 'Difficult navigating the new interface', value: 31 },
                { label: 'More clicks; features now hidden', value: 29 },
              ],
            },
          ],
        },

        frictionHeading: 'The previous experience served the daily habit better',
        frictionIntro: [
          '**The friction has a specific shape.** Coding the complaints surfaced four recurring types rather than one diffuse grievance.',
        ],
        frictionTypes: [
          {
            title: 'More steps and effort',
            body: 'Basic actions cost more taps than they used to.',
          },
          {
            title: 'Removed or buried features',
            body: 'Copy-day, editing, and any option to revert.',
          },
          {
            title: 'Lost visibility of the day',
            body: 'The full diary no longer readable at a glance.',
          },
          {
            title: 'Harder navigation and broken habits',
            body: 'Removed gestures, disrupted muscle memory.',
          },
        ],
        frictionConclusion: [
          '**Navigation and visibility dominate.** The redesign didn’t make the app do less; it made the day **harder to see, reach, and control.** That is the exact ease-of-use I set out to restore.',
        ],

        literatureHeading: 'What the behavioural research says about logging',
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
            body: 'Next-day food choices can be modelled from a user’s own history, with recent entries the strongest signal. Surfacing likely foods is feasible, not speculative.',
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
          'MyFitnessPal holds every user’s logging history — the exact record that makes their next meal predictable. It does use it, but every **fast path it offers bills the user first**, in setup or in navigation or both, and the only one that asks nothing is the one that **simply replays a past day verbatim.** The signal is sitting right there, and the **app never surfaces the likely meal.**',
          '**Repeat logging isn’t a habit users should have to accept.** It is the mark of a product that holds the pattern and leaves the work to the user.',
          'And no tracker closes the gap. **YAZIO, Cronometer and Lose It!** offer the same kind of help — copy-to-day, favourites, recent and frequent lists, saved meals and recipes — and all of it is manual reuse you either build or navigate to. The closest thing to time-awareness anywhere is Cronometer’s Repeat Items, a paid feature, and even that is a fixed schedule you define by hand, not a prediction.',
        ],
      },

      // 7 — Product decision, part one: the Today screen
      todayScreen: {
        badge: 'Product decision',
        heading: 'Both fixes live on one surface',
        eyebrow: 'Solution 1 — The Today screen',
        steps: [
          {
            title: 'Reclaimed the top of the screen',
            body: 'The weekly date strip was removed to open space and lift all four meal cards into view, so a logged day is visible and loggable without scrolling. Its streak duplicated the counter already in the top-right, and its only other role — moving between days within the current week — was folded into the redesign’s day navigation.',
          },
          {
            title:
              'Merged the calorie and macro cards, and brought the day’s nutrition onto Today',
            body: 'The two stacked cards became one combined strip, freeing more vertical space. That strip also gained a “Nutrition facts” toggle that opens the day’s full nutrient breakdown in a sheet, so the fuller view sits with the calories and macros it belongs to rather than two screens away under Progress.',
            figure: {
              src: '/images/myfitnesspal/today-hierarchy.webp',
              width: 1600,
              height: 1023,
              alt: 'Redesigned Today screen with a merged calorie and macro strip, all four meal cards in view, and the nutrition sheet it opens',
              caption:
                'One combined strip, four meal cards in view, and the day’s nutrients one tap away',
            },
          },
          {
            title: 'Moved day navigation to a swipe, with a jump-to-today',
            body: 'Moving between days is now a swipe and the “‹ Today ›” control at the top, replacing the removed strip’s week-bound jumping. Because navigating to another date — to copy a meal to or from another day, say — meant re-selecting today’s date to get back, a “Jump to Today” button now returns you in one tap.',
            figure: {
              src: '/images/myfitnesspal/day-navigation.webp',
              width: 1600,
              height: 1023,
              alt: 'Day navigation: a month picker opened from the date control, with a Jump to Today button',
              caption: 'Any date in reach, and one tap back to today',
            },
          },
          {
            title: 'Added the batch shortcuts',
            body: '“Copy Full Day” and “Select” now live in the overflow menu beside “View all”, and Select opens a checklist to delete several foods in one action instead of removing them one at a time.',
            figure: {
              src: '/images/myfitnesspal/batch-shortcuts.webp',
              width: 1600,
              height: 1023,
              alt: 'Overflow menu with Select and Copy Full Day, the multi-select delete checklist, and the copy-to-date sheet',
              caption: 'Copy a whole day, or clear several foods, in one action',
            },
          },
          {
            title: 'Moved the diary inline',
            body: 'The diary now expands in place on Today with a “View all / View less” toggle, removing the separate screen that repeated the strip and ended in a “Log more” button leading to the same search the add button already opens. That screen held one thing worth keeping — the meal’s macro split — so it now sits inline on each expanded meal card beside the calorie total. The breakdown of a meal is readable in the diary itself, and no information was lost with the screen that carried it. A food goes straight to its edit screen without the extra stop.',
          },
          {
            title: 'Rebuilt Edit Entry around the number being changed',
            body: 'The calorie total and its macro split moved to the top, above the fields and laid out in one line to create white space and consistency. Servings gained a plus/minus stepper, making the most common edit on this screen a tap rather than a keyboard entry. Per-food nutrition facts keep their expand toggle, now sitting directly under the fields instead of below a full-width ad and a Premium block, where the control was easy to miss. Collapsed stays the default, because this screen exists to set an amount, not to read a table.',
            figure: {
              src: '/images/myfitnesspal/inline-diary.webp',
              width: 1600,
              height: 1729,
              alt: 'The diary expanding inline on Today with per-meal macro splits, and the rebuilt Edit Entry screen',
              caption:
                'The diary expands in place, and a food goes straight to its edit screen',
            },
          },
        ],
      },

      // 8 — Product decision, part two: repeat logging
      repeatLogging: {
        badge: 'The hero',
        eyebrow: 'Solution 2 — Repeat logging',
        heading: 'The app should carry the repetition, not the user',
        intro: [
          'The redesigned diary surfaces the foods a consistent user is most likely to log — predicted from their own history by **day, time, and recency** — on the meal card itself rather than behind a search. Logging shifts from recall to recognition, and from a search task to a confirmation.',
          'It targets users with existing logging history, since prediction needs a pattern to learn from. Two of those three signals already exist in MyFitnessPal, split across a filter and a sort you have to set yourself. **What no tracker does is weigh them together, add the day of the week, and put the answer where you already are without being asked.**',
        ],
        signals: [
          {
            title: 'Recency',
            weight: 'Strongest signal',
            body: 'What you have logged in the last few days.',
          },
          {
            title: 'Day',
            weight: 'The corrective',
            body: 'The day of the week. A weekday lunch and a weekend lunch are often different meals, so foods logged on the same weekday count for more.',
          },
          {
            title: 'Time',
            weight: 'The slot',
            body: 'The meal slot you are logging into. Open Dinner at breakfast time and you still get your usual dinner foods.',
          },
        ],
        placement: {
          heading: 'Surfacing predictions where users already log meals',
          body: [
            'I placed the prediction on the meal card at the empty slot — the moment the user has already decided to log. **Intent and the food meet in the same place.**',
            'The card holds two offers that answer different questions. **Swipe to copy** replays a past meal verbatim. The **frequent carousel** surfaces what the user eats most at this meal, on this day. The same food can sit in both: if the user had egg and coffee yesterday and eats them most mornings, they land in the copy line and rank first in the carousel at once. That overlap is just the two signals pointing at the same food — one reading yesterday, the other reading frequency.',
            '**The two paths cannot collide.** Copying yesterday is all or nothing, so hand-picking even one food from the frequent carousel means the day is no longer yesterday’s, and the copy offer drops away. Copy the meal instead, and egg and coffee are already logged, so the carousel drops just those and surfaces the next most frequent foods. Neither path can add the same food twice.',
            'Each chip carries a stepper to set servings before logging, so the amount is right at the moment the food goes in rather than corrected in a separate edit afterward.',
          ],
          figure: {
            src: '/images/myfitnesspal/predict-card.webp',
            width: 760,
            height: 1569,
            alt: 'Breakfast meal card showing a swipe-to-copy line and a Frequent at breakfast carousel of food chips with steppers',
            caption: 'The prediction sits on the empty meal card, not behind a search',
          },
        },
        commit: {
          heading: 'The card commits without locking',
          body: [
            '**Done** collapses the carousel into a single **Add more** button, clearing the meal card back to the uninterrupted diary view. The prediction is assembly-time scaffolding — once the meal is built, keeping it on screen would compete with the diary for the user’s attention.',
            '**Add more** holds the return path: the carousel is one tap away, so a food recalled after the fact is added in place rather than through search.',
          ],
          figure: {
            src: '/images/myfitnesspal/add-more.webp',
            width: 760,
            height: 1568,
            alt: 'The built breakfast card collapsed back to the diary view with a single Add more button',
            caption: 'Once the meal is built, the scaffolding steps back',
          },
        },
        limits: {
          heading: 'Where the prediction is strong, and where it is not',
          columns: [
            {
              label: 'Strong',
              body: [
                'It runs on repetition, so it works best for the **most consistent loggers.** Day earns its place for people whose **weekdays and weekends differ**, where it keeps recency from offering a Monday lunch on a Sunday.',
                'Its value concentrates on people who **log by habit but never build a saved meal or recipe** — the users for whom every repeat is still a search.',
              ],
            },
            {
              label: 'Weak',
              body: [
                'The feature is weakest where there is **nothing to learn from**: a new account with no history, or eating that does not repeat at all.',
                'For the smaller, disciplined group who already curate and reuse their own saved meals, prediction is **a convenience rather than a transformation.**',
              ],
            },
          ],
        },
      },

      // 9 — Testing
      testing: {
        badge: 'Testing outcomes',
        heading: 'Users reached the food by recognition, not search',
        intro: [
          'I tested the repeat-logging flow in Lyssna as an interactive prototype, to see whether it held up in a real hand and not just on paper.',
          'The goal was not to validate the prediction itself. I wanted to know whether a user **notices** the surfaced food and **understands that tapping it logs the food** — because a shortcut no one sees is not a shortcut. Discoverability and comprehension of the card were the whole target.',
        ],
        task: {
          label: 'Task scenario',
          value: 'Add a banana to breakfast',
          note: 'A neutral start on the day’s log, with no path pointed out and no mention that a search route existed.',
        },
        results: [
          {
            value: 'Every user',
            label:
              'logged the food by tapping it on the card — none went looking for search or manual entry.',
          },
          {
            value: 'A third',
            label:
              'never consciously noticed the “Frequent at breakfast” label, and still logged through the card.',
          },
        ],
        body: [
          'The only friction was in the card **being noticed**, not in it **being used** once seen — which points at its visibility as the thing to strengthen, not its operation.',
          'Users tapped the food because they could see it. The card shows the actual food, so **recall became recognition**: instead of remembering a food and searching for it, users just saw it and tapped. The prediction works quietly in the background; to the user, the food is simply already there.',
        ],
        caveat: {
          label: 'What this does not prove',
          body: 'This validates delivery, not accuracy. The test proves a surfaced food is found and understood with no learned path to lean on. It does not test whether the prediction is right, because a static prototype with no logging history has no real signal to predict from. Accuracy sits outside what a prototype can show, and would need a live build with real history to measure.',
        },
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

export const about = {
  badge: 'About Me',
  statement:
    "Design has always been more than just a job — it's my passion.",
  paragraph:
    "I'm a UI/UX designer drawn to the small, repeated actions a product depends on — the ones people perform every day and stop noticing until they get harder. I like starting in the research: reviews, journeys, the behavioural literature, whatever explains why something feels heavier than it should. The interface comes after, and it has to earn every tap it asks for.",
  educationHeading: 'Where I studied',
  // Each entry: { institution, qualification, years }. Empty until filled —
  // the Education section doesn't render without it.
  education: [],
  crochetCurio: {
    heading: 'Crochet Curio',
    paragraph:
      "Crochet Curio is where I make things with my hands instead of a cursor. It's the same instinct as the design work — structure, repetition, a pattern you can feel your way through — just slower, and with the finished object in your lap at the end. It's also the best thinking I do all week.",
    images: [],
    link: '', // optional shop/page URL; uses the Visit cursor
  },
  interestsHeading: 'The things that define me',
  // `motif` selects which hero-doodle accent the card echoes.
  interests: [
    {
      title: 'Crochet',
      blurb: 'Patterns, yarn, and the satisfaction of a row that finally sits straight.',
      motif: 'circle',
    },
    {
      title: 'My cat',
      blurb: 'Chief design critic. Sits on the keyboard at the exact moment of insight.',
      motif: 'dot',
    },
    {
      title: 'My dog',
      blurb: 'The reason I take breaks, and the reason those breaks are the best part of the day.',
      motif: 'dot',
    },
    {
      title: 'Plants',
      blurb: 'A growing collection, kept alive with more optimism than expertise.',
      motif: 'squiggle',
    },
    {
      title: 'Photography',
      blurb: 'Looking properly at ordinary things until they turn into a frame.',
      motif: 'circle',
    },
    {
      title: 'Kathak',
      blurb: 'Around ten years of classical training — rhythm I still count in my head.',
      motif: 'squiggle',
    },
  ],
}
