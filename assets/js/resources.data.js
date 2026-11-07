/**
 * External reading list curated by Lulamile Mkhungela.
 * Publishers retain authorship. Access labels checked against publisher pages
 * on 2026-11-07; provider terms and prices can change.
 */
window.RESOURCES_DATA = {
  curator: 'Lulamile Mkhungela',
  directories: [
    { label: 'Browse the skill-pack library', url: 'https://90n.ai/resources' },
    { label: 'Browse the guide library', url: 'https://90n.ai/guides' },
  ],
  groups: [
    { id: 'packs', label: 'Claude skill packs', description: 'Practical workflows I recommend for product and design teams. Free downloads from the publisher.' },
    { id: 'guides', label: 'Guides worth reading', description: 'Long-form guidance on creative work, hiring and people processes. Free to read.' },
    { id: 'software', label: 'Software & services', description: 'A tool with a free starting point and paid options when you need more.' },
  ],
  items: [
    {
      id: 'product-designers-pack', group: 'packs', title: '32 Claude Skills for Product Designers', access: 'free', price: 'Free', provider: '90n',
      description: 'Problem framing, design options, prototyping, critique, testing, handoff and the portfolio case study.',
      note: 'Useful when you want a repeatable design process without handing the design decisions to a model.',
      url: 'https://90n.ai/resources/product-designers-pack', format: '32 skills · ZIP + GitHub',
    },
    {
      id: 'designops-pack', group: 'packs', title: '12 Claude Skills for DesignOps', access: 'free', price: 'Free', provider: '90n',
      description: 'Critique rituals, handoff standards, system governance, file conventions, intake and capacity.',
      note: 'Pairs well with the DesignOps and design-system work in my portfolio.',
      url: 'https://90n.ai/resources/designops-pack', format: '12 skills · ZIP + GitHub',
    },
    {
      id: 'product-strategy-pack', group: 'packs', title: '32 Claude Skills for Product Strategy', access: 'free', price: 'Free', provider: '90n',
      description: 'Diagnose the product’s state, compare strategic options, write the bets and build a reviewable roadmap.',
      note: 'A structured way to turn a broad brief into choices a team can defend.',
      url: 'https://90n.ai/resources/product-strategy-pack', format: '32 skills · ZIP + GitHub',
    },
    {
      id: 'ux-research-pack', group: 'packs', title: 'UX Research with Claude', access: 'free', price: 'Free', provider: '90n',
      description: 'Plan, recruit, run, synthesise and share user research, with real users only.',
      note: 'Keeps research grounded in evidence rather than generated assumptions.',
      url: 'https://90n.ai/resources/ux-research-pack', format: '32 skills',
    },
    {
      id: 'creativity-guide', group: 'guides', title: 'Keeping Creativity Alive in the Age of AI', access: 'free', price: 'Free', provider: '90n',
      description: 'Where creativity comes from, how to use AI as a junior assistant, and the systems that keep people noticing things.',
      note: 'My rule of thumb: let AI take the production work around the thinking, not the thinking itself.',
      url: 'https://90n.ai/guides/keeping-creativity-alive-guide', format: 'Guide · free to read',
    },
    {
      id: 'hiring-guide', group: 'guides', title: 'Hiring Creative Talent in the AI Age', access: 'free', price: 'Free', provider: '90n',
      description: 'Who to hire, how to assess designers, how to read a polished portfolio, and what to do about junior talent.',
      note: 'A practical reminder to assess decisions and ownership, not just the finish of the work.',
      url: 'https://90n.ai/guides/hiring-creative-talent-ai-age-guide', format: 'Guide · free to read',
    },
    {
      id: 'performance-reviews-guide', group: 'guides', title: 'Using AI in Performance Reviews', access: 'free', price: 'Free', provider: '90n',
      description: 'Where AI can help prepare a review cycle, what stays with people, and how to keep responsibility clear.',
      note: 'Useful for teams that want the admin help without outsourcing people decisions.',
      url: 'https://90n.ai/guides/ai-in-performance-reviews', format: 'Guide · free to read',
    },
    {
      id: 'review-season-guide', group: 'guides', title: 'Review Season Guide', access: 'free', price: 'Free', provider: '90n',
      description: 'A month-by-month plan for a fair review cycle, shared criteria and a useful growth matrix.',
      note: 'A planning reference for leaders who need structure before the calendar fills up.',
      url: 'https://90n.ai/guides/review-season', format: 'Guide · free to read',
    },
    {
      id: 'lantern', group: 'software', title: 'Lantern — social posts from your own work', access: 'freemium', price: 'Free trial · paid plans', provider: '90n',
      description: 'Turns your notes, documents and call transcripts into social drafts in your voice. You review every post before publishing.',
      note: 'The free trial includes 100 credits. Pro is listed at US$8/month for 200 monthly credits; check the provider for current terms.',
      url: 'https://lantern.90n.ai/', format: 'Web app · free trial + paid plans',
    },
  ],
  disclosure: 'These are external resources I recommend, not work I created. 90n and the other publishers retain authorship and set their own access, prices and terms. Inclusion does not imply a partnership or endorsement of my practice.',
};
