/**
 * The builder toolkit — content from github.com/LulamileMkhungela/devzigner.
 *
 * Source: src/tools.ts (the eight tools, in the order the repo presents them),
 * their SKILL.md phase headings, and the paths each one ships at. Steps are the
 * headings the skills actually use, so the list here matches the files.
 */
window.TOOLS_DATA = {
  intro: {
    eyebrow: 'Tools',
    title: 'The builder toolkit',
    lede: 'Eight free tools for builders — the skills, templates, conventions and workflows that turn a fuzzy idea into something a coding agent can actually build. Every one of them ships in the package.',
    stats: [
      { value: '8', label: 'Free tools' },
      { value: '80', label: 'Files in the package' },
      { value: '20', label: 'Mapped commands' },
      { value: '5', label: 'ProdOps stages' },
    ],
  },

  tools: [
    {
      id: 'prd-creator',
      name: 'PRD Creator',
      kind: 'Agent skill',
      blurb: 'Turns a fuzzy idea into a locked PRD plus build-ready milestone prompts and a milestone log.',
      ships: '.agents/skills/prd-creator/ + _build_plan/prd.md and one prompt per milestone',
      files: 16,
      steps: [
        { title: 'Brain dump intake', file: 'steps/brain-dump.md' },
        { title: 'Format choice', file: 'steps/format-choice.md' },
        { title: 'Core purpose', file: 'steps/core-purpose.md' },
        { title: 'Top-level features (in scope)', file: 'steps/top-level-features.md' },
        { title: 'Top-level out-of-scope', file: 'steps/out-of-scope.md' },
        { title: 'Tech stack & starter template', file: 'steps/tech-stack.md' },
        { title: 'External integrations & credentials', file: 'steps/integrations.md' },
        { title: 'Data model', file: 'steps/data-model.md' },
        { title: 'Per-feature scoping', file: 'steps/per-feature-scoping.md' },
        { title: 'Milestone breakout', file: 'steps/milestones.md' },
        { title: 'Write files', file: 'steps/write-files.md' },
      ],
    },
    {
      id: 'skill-builder',
      name: 'Skill Builder',
      kind: 'Agent skill',
      blurb: 'Interviews you about a repeatable process, then designs, writes and verifies a portable skill.',
      ships: '.agents/skills/skill-builder/',
      files: 9,
      steps: [
        { title: 'Understand the process', file: 'steps/understand.md' },
        { title: 'Interview the user', file: 'steps/interview.md' },
        { title: 'Design the shape', file: 'steps/design.md' },
        { title: 'Build it', file: 'steps/build.md' },
        { title: 'Save it', file: 'steps/save.md' },
        { title: 'Verify & hand off', file: 'steps/verify.md' },
      ],
    },
    {
      id: 'design-system',
      name: 'Design System',
      kind: 'Agent skill',
      blurb: 'Scaffolds a real design system into a React + Tailwind app, with a preview page and agent rules.',
      ships: '.agents/skills/design-system/ (50 reference files)',
      files: 50,
      steps: [
        { title: 'Detect target codebase state' },
        { title: 'Confirm route' },
        { title: 'Branding defaults' },
        { title: '(re-run only) Scope' },
        { title: 'Write files' },
        { title: 'Update agent instructions' },
        { title: 'Scan for existing UI to migrate' },
        { title: 'Wrap up' },
      ],
    },
    {
      id: 'favicon-creator',
      name: 'Favicon Creator',
      kind: 'Agent skill',
      blurb: 'Generates the full favicon set from one icon and wires the meta tags into the codebase.',
      ships: '.agents/skills/favicon-creator/ + favicon.svg (the set is built by the skill)',
      files: 8,
      steps: [
        { title: 'Gather inputs from the user' },
        { title: 'Locate the layout file' },
        { title: 'Determine the public asset directory' },
        { title: 'Generate the SVG for browser tabs' },
        { title: 'Generate the raster source SVG' },
        { title: 'Rasterize all sizes' },
        { title: 'Wire up the meta tags' },
        { title: 'Report what changed' },
      ],
    },
    {
      id: 'starter',
      name: 'Starter',
      kind: 'Template',
      blurb: 'The Rails + React starter: conventions, agent instructions and deployment notes, already canonical.',
      ships: 'template/starter/',
      steps: [
        { title: 'Clone the template and bundle install' },
        { title: 'Set the app name and credentials' },
        { title: 'Create the database and run the seed' },
        { title: 'Start the dev processes and open the app' },
        { title: 'Read AGENTS.md before the first agent session' },
        { title: 'Deploy with the Hatchbox guide' },
      ],
    },
    {
      id: 'agents',
      name: 'Agents canon',
      kind: 'Convention',
      blurb: 'One canonical home for skills and instructions: .agents/skills + AGENTS.md, with symlinks for the holdouts.',
      ships: '.agents/ + AGENTS.md + scripts/link-agents.sh',
      steps: [
        { title: 'Install every skill into .agents/skills/' },
        { title: 'Write agent instructions to AGENTS.md' },
        { title: 'Point CLAUDE.md at AGENTS.md' },
        { title: 'Symlink .claude/skills to ../.agents/skills' },
        { title: 'Never store a real skill inside a tool-specific path' },
        { title: 'Bake the setup into the template repo' },
      ],
    },
    {
      id: 'standards',
      name: 'Standards',
      kind: 'Workflow',
      blurb: 'Standards, specs and shaping for the coding agent, captured once and injected everywhere.',
      ships: 'standards/ + .agents/commands/prodops/ (the five standards commands)',
      steps: [{ title: 'Install' }, { title: 'Discover' }, { title: 'Inject' }, { title: 'Shape' }],
    },
    {
      id: 'prodops',
      name: 'ProdOps flow',
      kind: 'Workflow',
      blurb: 'Plan and design a real app in five stages, then export a handoff a coding agent can build from.',
      ships: 'product-plan/ + .agents/commands/prodops/ (the ten stage commands)',
      steps: [
        { title: 'Product' },
        { title: 'Data Shape' },
        { title: 'Design' },
        { title: 'Sections' },
        { title: 'Export' },
      ],
    },
  ],

  /* The skill library the workspace ships, read from .agents/skills/. */
  library: [
    { id: 'product-workflow', files: 1, body: 'Shape product and business analysis from discovery through roadmap and handoff.' },
    { id: 'business-data-model', files: 1, body: 'Define business information requirements and conceptual data models with stakeholders.' },
    { id: 'experience-design', files: 1, body: 'Guide end-to-end product, UX, UI and customer experience design.' },
    { id: 'design-system', files: 50, body: 'Guides you through creating and implementing a design system for your application.' },
    { id: 'frontend-design', files: 1, body: 'Create distinctive, production-grade frontend interfaces with high design quality.' },
    { id: 'database-engineering', files: 1, body: 'Plan physical database design and safe schema changes from business requirements.' },
    { id: 'quality-engineering', files: 1, body: 'Plan quality assurance, acceptance and regression verification.' },
    { id: 'delivery-operations', files: 1, body: 'Guide delivery, release, adoption and ongoing support.' },
    { id: 'prd-creator', files: 13, body: 'Run a structured interview and produce a PRD plus build-ready milestone prompts.' },
    { id: 'skill-builder', files: 9, body: 'Build a new agent skill, or restructure an existing one, following ProdOps conventions.' },
    { id: 'favicon-creator', files: 1, body: 'Generate a complete favicon set from a Lucide icon or another source SVG, then wire the meta tags.' },
    { id: 'agents-repo', files: 1, body: 'Convert a repo to the agents canon: skills into .agents/skills, symlinks for the holdouts.' },
    { id: 'agents-manifest', files: 2, body: 'Install or update the skills manifest — one page listing every skill on the machine.' },
  ],

  /* The five-stage flow, from the repo's src/App.tsx PHASES. */
  stages: [
    { id: 'product', num: '01', title: 'Product', body: 'The brief, the who-it-is-for and the data shape the rest of the work stands on.' },
    { id: 'data-shape', num: '02', title: 'Data Shape', body: 'Entities, relationships and business rules, written down before a screen is designed.' },
    { id: 'design', num: '03', title: 'Design', body: 'Design requirements, named tokens and the component registry every screen draws from.' },
    { id: 'sections', num: '04', title: 'Sections', body: 'The screens themselves, grouped into sections of the product, each one reviewable.' },
    { id: 'export', num: '05', title: 'Export', body: 'A handoff a coding agent can build from — files, specs, standards and commands.' },
  ],

  /* Inside the workspace, per the repo's TRACK_NAV and stage copy. */
  workspace: [
    { title: 'Tools', body: 'The eight free tools, their full step sequence and where each one ships.' },
    { title: 'Library', body: 'The skill library the agent reads, mapped to the stage where it applies.' },
    { title: 'Build kits', body: 'Starter kits per stack — the conventions, instructions and deployment notes.' },
    { title: 'Who it is for', body: 'The person whose day the product changes, their goal, their pain, what is actually true.' },
    { title: 'User flows', body: 'A flow per persona, and the screens each flow passes through.' },
    { title: 'Tech stack', body: 'The stack layer by layer, and the component registry every screen uses.' },
    { title: 'Prototype', body: 'Your sections running as one app, with the data your product actually has.' },
    { title: 'Token editor', body: 'Change the design system and see every screen follow.' },
    { title: 'Wiki', body: 'The project, written down — a version for every snapshot you take.' },
    { title: 'Coverage', body: 'Every command, checked against the package that exists. What is missing, named.' },
  ],

  /* The ten stage commands, from the repo command list. */
  commands: [
    { name: 'plan-product', body: 'Turn the brief into a product plan the other stages can read.' },
    { name: 'product-vision', body: 'Write the vision, audience and the boundary of what this product is not.' },
    { name: 'product-roadmap', body: 'Sequence the work into a roadmap with a defensible order.' },
    { name: 'data-shape', body: 'Shape the entities, relationships, and business rules.' },
    { name: 'design-tokens', body: 'Derive named tokens from the brand palette and type scale.' },
    { name: 'design-screen', body: 'Design a screen from the section spec and the component registry.' },
    { name: 'design-shell', body: 'Design the app shell, navigation and the states around the screens.' },
    { name: 'shape-section', body: 'Shape one section of the product into a spec the design stage uses.' },
    { name: 'export-product', body: 'Export the handoff: files, specs, standards and commands.' },
    { name: 'implement-tasks', body: 'Break the exported plan into implementable tasks for the coding agent.' },
  ],

  install: [
    { title: 'Clone the repository', body: 'The package is the repo: skills in .agents/skills, instructions in AGENTS.md.', code: 'git clone https://github.com/LulamileMkhungela/devzigner.git' },
    { title: 'Run the workspace', body: 'The workspace binds to 0.0.0.0:5173 by default; set PORT to change it.', code: 'npm ci && npm run build && npm run preview:site' },
    { title: 'Or develop against it', body: 'The same workspace in Vite, with the local API server.', code: 'npm run dev' },
    { title: 'Read the canon first', body: 'AGENTS.md is the canonical instruction file. CLAUDE.md and .claude/skills are symlinks to it, so there is one copy to keep current.', code: 'cat AGENTS.md' },
  ],

  tree: `design-ops/
├── .agents/
│   ├── commands/prodops/    the twenty mapped commands
│   └── skills/              the skill library the agent reads
├── standards/               standards, captured once and injected everywhere
├── product-plan/            the five-stage plan and its exported handoff
├── template/starter/        the Rails + React starter
├── src/                     the workspace (tools, library, kits, prototype)
├── scripts/                 checks, servers and the export pipeline
└── AGENTS.md                the canonical instruction file`,

  free: {
    title: 'Access free — nothing to unlock',
    body: 'There is no email and no key: the tool is already in the package the repository exports.',
    steps: [
      'It ships at the path named on the tool, exactly where its steps expect it.',
      'Its folder sits under .agents/skills/; CLAUDE.md and .claude/skills are symlinks to it, so there is one copy to update.',
      'Run it with the command its own file names — every step listed is a section of SKILL.md.',
    ],
  },

  repoUrl: 'https://github.com/LulamileMkhungela/devzigner',
  note: 'Content mirrors github.com/LulamileMkhungela/devzigner — the toolkit, the five-stage ProdOps flow and the command set described in its README.',
};
