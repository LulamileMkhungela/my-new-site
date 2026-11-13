/**
 * Expertise — what the practice covers, from the product work of ProdOps to
 * the enterprise design systems, front-end builds and brand work behind it.
 *
 * Product owner and source for the ProdOps block:
 * https://github.com/LulamileMkhungela/ProdOps (README), live at
 * https://lulamilemkhungela.github.io/ProdOps/
 */
window.EXPERTISE = {
  intro: {
    eyebrow: 'Expertise',
    title: 'Where the work actually sits.',
    lede:
      'Four areas of practice, and the tools and conventions I bring to each. One of them is mine: ProdOps, a role-based product workspace I own and build — so the method on this page is one I run, not one I describe.',
    stats: [
      { value: '5', label: 'Areas of practice' },
      { value: '4', label: 'Enterprise clients' },
      { value: '2.2 AA', label: 'WCAG target' },
      { value: '15+', label: 'Years building' },
    ],
  },

  /* ProdOps gets the featured block: it is the one product here that is both
     an area of expertise and a thing I own. */
  featured: {
    tag: 'Own product',
    name: 'ProdOps',
    role: 'Product owner & builder',
    link: 'https://lulamilemkhungela.github.io/ProdOps/',
    linkLabel: 'Open the live workspace',
    repo: 'https://github.com/LulamileMkhungela/ProdOps',
    summary:
      'A role-based product workspace. Business and product ownership, product/UX/UI/CX design, development, quality assurance and delivery/operations each get their own stage, their own artifacts and their own approvals — in one place, instead of spread across documents nobody opens twice.',
    points: [
      {
        title: 'A stage per role, not one long doc',
        body: 'Each role lists its own process steps and the resulting specs/ folders. Roles can start independently — no role waits for another to set up the project — and every step can be marked in progress, approved, rejected or sent back for a revisit with a note and a suggested next step.',
      },
      {
        title: 'Approvals that notice when the ground moves',
        body: 'Editing approved work, an upstream file or the shared context marks the affected approvals for revisit. They are local workflow aids, not multi-user authorisation — the tool tells the truth about what it is.',
      },
      {
        title: 'Specs deep enough to build from',
        body: 'Business analysis includes conceptual and logical data, relationships and business rules; development includes physical database design and migrations. The point is a handover somebody can implement, not a slide.',
      },
      {
        title: 'AI drafting with the boundaries stated',
        body: 'Drafting runs against a provider you configure — your own key, or a server-wide OpenAI-compatible or Anthropic endpoint. AI asks a focused follow-up only when details are missing (up to three questions) and drafts directly when the brief is clear. Models are not connected automatically, keys are never stored in project text, and the browser never chooses the API host.',
      },
      {
        title: 'References in, without pretending to be Figma',
        body: 'Paste a Figma frame link and the workspace reads the selected node through the REST API into a bounded Markdown summary — layout, colour, text, typography and available properties — then sends it as untrusted context. Limits are explicit (four levels, 180 nodes, 2 MB, ~18,000 characters). No images, no canvas rendering, no MCP.',
      },
      {
        title: 'It runs on a static host, honestly',
        body: 'The published workspace has no server, so AI drafting and Figma/GitHub imports are not available there. Everything else — editing, the Orbit dashboard example, approvals, exports and the ProdOps Lab — works, stored in your own browser.',
      },
    ],
  },

  areas: [
    {
      id: 'product',
      number: '01',
      title: 'Product & UX',
      keyword: 'PRODUCT',
      summary:
        'From research to a shipped interface: discovery, flows, prototypes, usability testing and the design system underneath.',
      items: [
        'End-to-end product design',
        'Product strategy & roadmap',
        'Field research in low-literacy, low-connectivity markets',
        'Usability testing before build, not after launch',
        'Multi-language and offline-tolerant UX',
      ],
      proof: 'Pasio banking app across India, Sri Lanka and Cambodia · Vodacom Engage · ProdOps',
      link: 'services.html#product',
    },
    {
      id: 'systems',
      number: '02',
      title: 'Design systems',
      keyword: 'SYSTEMS',
      summary:
        'Tokens, components and the governance that keeps them honest — built to survive a team, not just a Figma file.',
      items: [
        'Token architecture and theming',
        'Component libraries in Figma, React and Angular',
        'Design authority and review gates',
        'Storybook documentation',
        'Linting and drift detection between design and code',
      ],
      proof: 'Vodacom Design System — 65% fewer UI inconsistencies · Forma · DesignOps · Takeda Storybook components',
      link: 'case-study.html?id=designops-design-system',
    },
    {
      id: 'engineering',
      number: '03',
      title: 'Front-end engineering',
      keyword: 'BUILD',
      summary:
        'The design, in production code — React, Angular and TypeScript, with accessibility treated as a requirement.',
      items: [
        'React + TypeScript and Angular (RxJS) builds',
        'Accessibility to WCAG 2.2 AA on public and enterprise surfaces',
        'Data visualisation — Highcharts, Leaflet, dashboards',
        'Performance, SEO and progressive enhancement',
        'Static deploys, GitHub Actions and Vercel',
      ],
      proof: 'AGSA public platform with province risk heat-map · Eskom ML dashboards · FoodieZone & Heritage Bites PWAs',
      link: 'case-study.html?id=foodiezone',
    },
    {
      id: 'brand',
      number: '04',
      title: 'Brand & growth',
      keyword: 'BRAND',
      summary:
        'Positioning that survives contact with a buyer — and the listings, sites and content that carry it.',
      items: [
        'Brand strategy and identity systems',
        'Amazon listing, A+ content and storefront design',
        'Conversion-focused websites and landing pages',
        'Content architecture and copy direction',
        'Measurement: funnels, CTR, CVR, enquiry quality',
      ],
      proof: 'ELVD Wellness — 0.2% → 1.5% CTR · Culina Craftique · Toyota mobility brand',
      link: 'services.html#brand',
    },
    {
      id: 'impact',
      number: '05',
      title: 'Microfinance & impact',
      keyword: 'IMPACT',
      summary:
        'Products for the people most products forget, designed from the field rather than the office.',
      items: [
        'Financial inclusion and MFI product design',
        'Digital literacy and first-time-adopter patterns',
        'Train-the-trainer and field rollout',
        'Trust, safety and consent in the flow',
        'Offline-first and low-data design',
      ],
      proof: 'Gojo & Company across South and Southeast Asia · Pasio programme with Education Above All',
      link: 'services.html#impact',
    },
  ],

  stack: [
    'Figma',
    'React',
    'TypeScript',
    'Angular',
    'RxJS',
    'Vite',
    'Tailwind',
    'Highcharts',
    'Storybook',
    'Node.js',
    'GitHub Actions',
    'Vercel',
  ],

  training: [
    { name: 'Google UX Design', issuer: 'Google' },
    { name: 'AI for UX Research', issuer: 'NN/g' },
    { name: 'Interaction Design Patterns', issuer: 'Interaction Design Foundation' },
    { name: 'FNB Full-Stack', issuer: 'FNB App Academy' },
    { name: 'MTN Business App Academy', issuer: 'MTN' },
    { name: 'Data-Driven Product Research', issuer: 'Cursor Education' },
  ],
};
