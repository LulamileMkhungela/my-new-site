/**
 * Lulamile Mkhungela — professional site copy.
 * Project facts and endorsements are drawn from the owner's public portfolio:
 * https://lulamilemkhungela.github.io/portfolio.github.io/
 * Service descriptions are editorial summaries of that portfolio's services.
 */
window.SITE = {
  name: 'Lulamile Mkhungela',
  shortName: 'Lulamile M',
  brandLine: 'Product design · UI development',
  location: 'Johannesburg, South Africa',
  availability: 'Available remotely',
  roles: ['Product Designer', 'UI Developer', 'Design Systems'],
  email: 'mkhungela.l@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lulamile-mkhungela/',
  github: 'https://github.com/LulamileMkhungela',
  portfolio: 'https://lulamilemkhungela.github.io/portfolio.github.io/',
  resume: 'https://drive.google.com/file/d/1nCqtTe9LVwj_LeQX67L4f90zd1IYYeRE/view?usp=sharing',
  bookCall: 'contact.html',
  headline: 'Design the product. Build the interface.',
  subline:
    'I’m Lulamile Mkhungela, a product designer and UI developer based in Johannesburg. I research how a product is used, shape its structure and screens, then build the interface where the project calls for it.',
  positioning:
    'South African product design, design systems and front-end craft — from the first research question to the interface that ships.',
  contactMessage:
    'Have a product, a design system or a website that needs clarity? Tell me what you are building and where you need a hand.',
  stats: [
    { value: '8+', label: 'Years in design & build' },
    { value: '6', label: 'Selected projects' },
    { value: 'ZA', label: 'Based in South Africa' },
  ],
  collaborations: ['Vodacom', 'Toyota South Africa', 'iOCO', 'FoodieZone', 'Nerdma', 'AddmoreDigital'],
  categories: [
    { id: 'Product', label: 'Product', description: 'Enterprise tools, design systems and product workflows.' },
    { id: 'Impact', label: 'Impact', description: 'Technology shaped around real South African communities and small businesses.' },
    { id: 'Brand', label: 'Brand', description: 'Positioning and identity systems that carry through to the product.' },
  ],
  process: [
    { num: '01', title: 'Talk about the problem', body: 'A short conversation about the people using the product, what is not working and what you need from me.' },
    { num: '02', title: 'Agree the work', body: 'We decide what to research, design or build, what is out of scope and how the work will be reviewed.' },
    { num: '03', title: 'Work through it together', body: 'I share progress, check the important flows and carry the design into the UI build when development is part of the scope.' },
  ],
  services: [
    {
      id: 'product', number: '01', title: 'Product & UX/UI design', keyword: 'PRODUCT',
      tagline: 'Work out what to build.',
      oneliner: 'Research, information architecture, prototypes and interface design, with development constraints considered along the way.',
      hue: 'lavender', image: 'engage-cover.webp', page: 'services.html#product',
      offerings: [
        { title: 'Product design', description: 'From the task people need to complete to a tested, build-ready interface.', tags: ['UX research', 'UI design', 'Prototyping'], deliverables: ['Research and discovery', 'Information architecture', 'User flows and wireframes', 'Interface design', 'Interactive prototypes', 'Design handoff'], bestFor: 'Teams shaping a new product or improving an existing one.', outcome: 'A clear product direction and an interface your team can build from.' },
        { title: 'Product strategy', description: 'Turn a broad brief into user needs, priorities and a defensible next step.', tags: ['Discovery', 'Prioritisation', 'Roadmap'], deliverables: ['Product brief', 'Feature priorities', 'Roadmap', 'Journey maps'], bestFor: 'Founders and product teams before a major build decision.', outcome: 'Shared agreement on what to build, what to leave out and why.' },
        { title: 'Inclusive, real-world UX', description: 'Plan for language, connectivity and different levels of digital experience.', tags: ['Localisation', 'Offline-first', 'Field research'], deliverables: ['Context and constraint review', 'Localised UX recommendations', 'Offline-tolerant flow design'], bestFor: 'Products used on mobile data, in the field or by first-time digital users.', outcome: 'Design decisions grounded in the conditions people actually work in.' },
      ],
      faqs: [
        { q: 'Can you help before there is a brief?', a: 'Yes. We can start with the problem, the people affected and the constraints, then agree the scope before design begins.' },
        { q: 'Do you only design, or also build?', a: 'Both. Depending on the project, I can hand off a designed product or build the interface in React, Angular or Ionic.' },
      ],
    },
    {
      id: 'systems', number: '02', title: 'Design systems & UI development', keyword: 'SYSTEMS',
      tagline: 'Bring the design into the product.',
      oneliner: 'Tokens, components and production interfaces that keep design intent intact from Figma to the browser.',
      hue: 'sage', image: 'design-ops-cover.webp', page: 'services.html#systems',
      offerings: [
        { title: 'Design systems in code', description: 'Connect the design library to the codebase with reusable decisions.', tags: ['Tokens', 'Components', 'Storybook'], deliverables: ['Token model', 'Component library', 'Usage documentation', 'Framework outputs'], bestFor: 'Teams with drifting components or multiple framework targets.', outcome: 'One shared language for design and engineering.' },
        { title: 'Production UI builds', description: 'Interfaces built with states, content and accessibility in mind.', tags: ['React', 'Angular', 'Ionic'], deliverables: ['Responsive UI', 'Interaction states', 'Accessibility checks', 'UAT support'], bestFor: 'Teams that need a designer who can carry the work into code.', outcome: 'An interface that can be checked against the design in the browser.' },
        { title: 'PWA & product builds', description: 'Installable web products designed for phones and unreliable connections.', tags: ['PWA', 'Offline-first', 'Performance'], deliverables: ['Mobile-first build', 'Cached shell where appropriate', 'Install guidance', 'Performance review'], bestFor: 'Small businesses and field-facing products.', outcome: 'A product people can open and use in their real conditions.' },
      ],
      faqs: [
        { q: 'Can you work with our existing stack?', a: 'My production work includes React, Angular and Ionic. I review the codebase and agree the integration approach before committing to scope.' },
        { q: 'Is a design system always the answer?', a: 'No. I start with the drift or reuse problem you actually have. Sometimes a small token set and a few shared components are enough.' },
      ],
    },
    {
      id: 'web', number: '03', title: 'Websites & conversion', keyword: 'WEB',
      tagline: 'Make the next step clear.',
      oneliner: 'Websites that explain the offer, work on a phone and make it easier to enquire — with follow-up wired in where needed.',
      hue: 'sky', image: 'foodiezone-cover.webp', page: 'services.html#web',
      offerings: [
        { title: 'Websites & landing pages', description: 'Clear structure and mobile layouts shaped around what visitors need to know and do.', tags: ['Mobile-first', 'SEO', 'Landing pages'], deliverables: ['Content structure', 'Responsive design and build', 'Search-friendly metadata', 'Enquiry path'], bestFor: 'Businesses, launches and consultancies.', outcome: 'A site that communicates the offer and gives visitors a clear next step.' },
        { title: 'Website + CRM setup', description: 'Connect the site to a follow-up process with an owner and a next step.', tags: ['Lead capture', 'CRM', 'Automation'], deliverables: ['Forms', 'Pipeline stages', 'Ownership rules', 'Follow-up reminders'], bestFor: 'Teams losing enquiries between the inbox and the follow-up.', outcome: 'A website and enquiry process planned as one piece of work.' },
        { title: 'Ordering & small-business flows', description: 'Build around the channels customers already use, supported by field observation.', tags: ['Ordering', 'WhatsApp', 'Field research'], deliverables: ['Order-flow review', 'Menu or catalogue structure', 'Ordering interface', 'Owner workflow'], bestFor: 'Kitchens, retailers and service businesses moving off manual messages.', outcome: 'Less retyping and a clearer path from interest to order.' },
      ],
      faqs: [
        { q: 'Do I need finished copy first?', a: 'Not necessarily. I can work with what you have and shape the content structure as part of the project.' },
        { q: 'Can the site connect to our CRM?', a: 'Yes, where the scope calls for it. We agree the forms, pipeline and ownership before setup.' },
      ],
    },
    {
      id: 'brand', number: '04', title: 'Brand & product identity', keyword: 'BRAND',
      tagline: 'An identity the product can actually use.',
      oneliner: 'Positioning, messaging and visual systems with practical guidance across products and communications.',
      hue: 'peach', image: 'brand-strategy-cover.webp', page: 'services.html#brand',
      offerings: [
        { title: 'Brand strategy & identity', description: 'Make the positioning and identity easier for teams to use consistently.', tags: ['Positioning', 'Identity', 'Guidelines'], deliverables: ['Positioning and messaging', 'Visual identity rules', 'Practical brand guidance'], bestFor: 'Products and businesses whose identity has fragmented as they grow.', outcome: 'A shared position and rules teams can apply without starting over.' },
        { title: 'Brand into product', description: 'Translate identity into tokens, components and product UI.', tags: ['Design tokens', 'Product UI', 'Design systems'], deliverables: ['Colour, type and spacing tokens', 'Product components', 'Usage notes', 'Design and code alignment'], bestFor: 'Connected products that should feel like one family.', outcome: 'Brand decisions that survive the move into the interface.' },
      ],
      faqs: [
        { q: 'Can brand work include the product UI?', a: 'Yes. My Toyota mobility work connected positioning and identity rules to a design system and the product interfaces.' },
        { q: 'Do you take on brand-only engagements?', a: 'Yes, when the scope is clear. We can focus on positioning and identity, or carry the system into product design as well.' },
      ],
    },
  ],
  testimonials: [
    { name: 'Cleorise Enoch', designation: 'Business Analyst · HRIT', company: 'Telecommunications group', message: 'I asked Lulamile to sit with the people who actually use the app before touching the design. He did — and rebuilt the navigation around how they work, not how the org chart says they work. The search and grouped sections changed the way staff talk about the platform; the "where do I find" questions mostly stopped.' },
    { name: 'Stanley Moloto', designation: 'Co-founder · UX/UI/Web Designer', company: 'AddmoreDigital', message: 'We had the work, we just could not present it. Lulamile restructured the site around our portfolio and then set up the pipeline behind it. He was as comfortable in the copy as in the code, and proposals stopped being a scramble. Enquiries started arriving with context instead of a question mark.' },
    { name: 'Gracious Mashasha', designation: 'Full Stack Developer', company: 'Nerdma', message: 'We built the Nerdma site together and the handover never felt like a handover — the same component names, the same states, the same edges. He tests his own work on a phone before anyone else has to, and he asks the question that saves a rebuild two weeks later.' },
    { name: 'Owner', designation: 'Food retail', company: 'FoodieZone', message: 'Orders used to come through messages all day. Now customers order themselves, reorder in a tap, and I change the menu from my phone. It just works.' },
  ],
  about: {
    intro: 'I design digital products and build the interfaces that ship.',
    paragraphs: [
      'I work across product design and UI development: research how a product is used, shape its structure and screens, then build the interface where the project calls for it. That combination lets me follow a design into the browser and catch details that can get lost between a Figma file and a handoff.',
      'For more than eight years, I have designed and built digital products in enterprise software, telecoms, automotive, public services, fintech and small business. My work has included research, Figma systems and prototypes, production React and Angular interfaces, accessibility and user acceptance testing.',
      'My work has included Vodacom, Toyota, Nerdma and AddmoreDigital, as well as enterprise teams in energy, public audit, financial services and pharmaceuticals through iOCO. Some of that work is covered by an NDA, so the public case studies only include details I can share.',
      'I’m based in Johannesburg. Outside client work, I build side projects and mentor designers and UI developers. This site brings together the work I can show, what I owned on each project, and the evidence available for its results.',
    ],
    close: 'Rooted in Johannesburg, South Africa. Working with teams anywhere remote.',
    quote: { text: 'Start with the task people need to complete. The screen comes after that.', author: 'How I work' },
    connect: 'I’m open to product design, UI development, design-system work and focused collaborations. Tell me what you are building.',
    experience: [
      { period: '2021 — present', title: 'iOCO', body: 'Embedded design and development authority across enterprise teams, including Vodacom, Toyota South Africa, energy, public audit, financial services and pharmaceuticals.' },
      { period: '2025', title: 'FoodieZone', body: 'Freelance lead product designer and UI developer for the ordering PWA in Pimville, Soweto.' },
      { period: '2023', title: 'Nerdma', body: 'Freelance UI/UX design, alongside enterprise work.' },
      { period: '2017 — 2020', title: 'mLab, The Digital Academy, Sesyme & SmartServe', body: 'UI/UX design and Android development across mobile and web products.' },
    ],
  },
};
