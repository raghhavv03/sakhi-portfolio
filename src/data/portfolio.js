// ---------------------------------------------------------------------------
// ALL site content lives here — never hardcode copy/links inside components.
// Everything in [SQUARE BRACKETS] is a placeholder to be filled in later.
// ---------------------------------------------------------------------------

export const site = {
  name: '[YOUR NAME]',
  role: '[Product Designer]',
  bio: '[One-line bio — what you do and who you do it for.]',
  copyright: '© 2026 [NAME] · all rights reserved',
}

export const contact = {
  email: '[you@email.com]',
  invite: '[A short line inviting people to reach out.]',
}

export const links = {
  resume: '/resume.pdf', // opens in a new tab for viewing (not a download)
  linkedin: '[https://linkedin.com/in/your-handle]',
  behance: '[https://behance.net/your-handle]',
}

// Footer/contact social icons. `label` doubles as the data-cursor label.
export const socials = [
  { platform: 'LinkedIn', label: 'LinkedIn', href: links.linkedin },
  { platform: 'Behance', label: 'Behance', href: links.behance },
]

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const hero = {
  name: '[YOUR NAME]',
  opening:
    "[Hi, I'm [NAME] — a product designer solving complex problems through smart, human experiences.]",
}

// Projects. `status: 'live'` opens /work/:slug; `status: 'coming-soon'` is
// non-clickable with an In progress badge.
export const projects = [
  {
    slug: 'project-one',
    name: '[Project One]',
    description: '[A short one-to-two-line description of the project.]',
    thumbnail: '[/images/project-one.webp]',
    status: 'live',
    // ----------------------------------------------------------------------
    // Case-study template. Duplicate this whole `caseStudy` block for each new
    // live project. Leads with the problem + the result, then the process.
    //   - tagline:   one line shown under the title (what it is)
    //   - meta:      small role/timeline/platform facts
    //   - challenge: the problem and its constraints
    //   - result:    the headline outcome, surfaced up top before the process
    //   - metrics:   measurable outcomes (value + label)
    //   - contribution: what you specifically did
    //   - decisions: key decisions, each with the reasoning behind it
    //   - outcomes:  closing narrative on impact
    //   - images:    { cover, process[], outcomes[] } — URLs; empty = placeholder
    // ----------------------------------------------------------------------
    caseStudy: {
      title: '[Project One]',
      tagline: '[One line on what this project is.]',
      meta: [
        { label: 'Role', value: '[Your role]' },
        { label: 'Timeline', value: '[20XX · N weeks]' },
        { label: 'Platform', value: '[Web / iOS / …]' },
      ],
      challenge:
        '[Describe the problem and the constraints you were working within.]',
      result:
        '[State the headline result in one or two sentences — lead with impact.]',
      metrics: [
        { value: '[+00%]', label: '[what improved]' },
        { value: '[00k]', label: '[what grew]' },
        { value: '[0.0×]', label: '[what multiplied]' },
      ],
      contribution:
        '[Describe your specific contribution — what you owned and did.]',
      decisions: [
        {
          title: '[Decision one]',
          reasoning: '[The reasoning behind it and the trade-offs considered.]',
        },
        {
          title: '[Decision two]',
          reasoning: '[The reasoning behind it and the trade-offs considered.]',
        },
        {
          title: '[Decision three]',
          reasoning: '[The reasoning behind it and the trade-offs considered.]',
        },
      ],
      outcomes:
        '[Close with the measurable impact and what you learned or shipped.]',
      images: { cover: '', process: ['', ''], outcomes: ['', ''] },
    },
  },
  {
    slug: 'project-two',
    name: '[Project Two]',
    description: '[A short one-to-two-line description of the project.]',
    thumbnail: '[/images/project-two.webp]',
    status: 'live',
    caseStudy: {
      title: '[Project Two]',
      tagline: '[One line on what this project is.]',
      meta: [
        { label: 'Role', value: '[Your role]' },
        { label: 'Timeline', value: '[20XX · N weeks]' },
        { label: 'Platform', value: '[Web / iOS / …]' },
      ],
      challenge:
        '[Describe the problem and the constraints you were working within.]',
      result:
        '[State the headline result in one or two sentences — lead with impact.]',
      metrics: [
        { value: '[+00%]', label: '[what improved]' },
        { value: '[00k]', label: '[what grew]' },
        { value: '[0.0×]', label: '[what multiplied]' },
      ],
      contribution:
        '[Describe your specific contribution — what you owned and did.]',
      decisions: [
        {
          title: '[Decision one]',
          reasoning: '[The reasoning behind it and the trade-offs considered.]',
        },
        {
          title: '[Decision two]',
          reasoning: '[The reasoning behind it and the trade-offs considered.]',
        },
      ],
      outcomes:
        '[Close with the measurable impact and what you learned or shipped.]',
      images: { cover: '', process: ['', ''], outcomes: ['', ''] },
    },
  },
  {
    slug: 'fitnesspal',
    name: '[FitnessPal]',
    description: '[A short one-to-two-line description of the project.]',
    thumbnail: '[/images/fitnesspal.webp]',
    status: 'coming-soon',
    caseStudy: null,
  },
]

export const about = {
  badge: 'About Me',
  statement:
    "[Design has always been more than just a job — it's my passion.]",
  paragraph: '[A short supporting paragraph about who you are.]',
  education: [
    {
      institution: '[Institution name]',
      qualification: '[Degree / field of study]',
      years: '[20XX – 20XX]',
    },
    {
      institution: '[Institution name]',
      qualification: '[Degree / field of study]',
      years: '[20XX – 20XX]',
    },
  ],
  crochetCurio: {
    heading: 'Crochet Curio',
    paragraph: '[Describe Crochet Curio — what it is and why it matters to you.]',
    images: [],
    link: '[https://your-shop-or-page]', // optional; uses the Visit cursor
  },
  // `motif` selects which hero-doodle accent the card echoes.
  interests: [
    { title: 'Crochet', blurb: '[Short blurb about crochet.]', motif: 'circle' },
    { title: 'My cat', blurb: '[Short blurb about your cat.]', motif: 'dot' },
    { title: 'My dog', blurb: '[Short blurb about your dog.]', motif: 'dot' },
    { title: 'Plants', blurb: '[Short blurb about your plants.]', motif: 'squiggle' },
    { title: 'Photography', blurb: '[Short blurb about photography.]', motif: 'circle' },
    { title: 'Kathak', blurb: '[≈10 years of classical training.]', motif: 'squiggle' },
  ],
}
