
/* ==========================================================================
   Service pages — the copy behind service.html?id=<area>

   Structure and wording follow the reference build's four service pages
   (reference/source-mirror/, /product-design-strategy and its siblings):
   a two-line headline, the chaos/clarity problem block, the industries the
   area breaks in, selected work, the archive, the process, the three ways to
   work together, the questions founders ask, and a closing invitation.
   ========================================================================== */
window.SERVICE_PAGES = {

  /* Shared section copy — the reference uses the same wording on all four. */
  sectionCopy: {
    industries: 'Every industry breaks in a different place.',
    work: 'Selected work',
    archive: 'Archive of Past Works',
    process: "Here's how it actually works.",
    processIntro: '',
    services: 'Three ways to work together.',
    servicesIntro:
      'Each is a focused engagement designed for a specific stage of building. Pick the one that matches where you are.',
    notSure: 'Not sure which one fits? Tell me what you are working on.',
    notSureCta: "Let's figure it out",
    faq: {
      product: 'Things founders usually ask.',
      brand: 'Things brand sellers usually ask.',
      impact: 'Things organisations usually ask.',
      web: 'Things website clients usually ask.',
    },
    ctaHeading: "Not sure where to start? That's fine — most people aren't.",
    ctaBody: "Tell me what you're building and we'll figure out the rest.",
    cta1: 'Book a Free Call',
    cta2: 'Send a message',
  },


  product: {
    hero: {
      eyebrow: "Product Design & Strategy",
      line1: "From messy problem",
      line2: "to working product.",
      sub: "You're not short on ideas — you're short on clarity. I help early-stage founders cut through the noise, define exactly what to build, and design it properly the first time — so you ship something users actually want.",
    },
    industries: [
  {
    "name": "Fintech & MFI",
    "body": "Most financial products are built for people who already trust the system. The users here don't — and for good reason. They need clarity, not complexity, at every step.",
    "icon": "₹",
    "accentHue": "16"
  },
  {
    "name": "Edtech",
    "body": "Learners drop off when a product doesn't respect their time or context. Distracted, time-poor, often on a low-end device — the product has to work for their world, not the ideal one.",
    "icon": "✦",
    "accentHue": "210"
  },
  {
    "name": "Healthtech",
    "body": "High stakes, low patience, real consequences. One confusing screen can mean a missed diagnosis or a skipped dose. There's no room for friction here.",
    "icon": "+",
    "accentHue": "160"
  },
  {
    "name": "E-commerce & DTC",
    "body": "Every scroll is a decision. The gap between a user who converts and one who leaves is usually a single moment of confusion — and that moment is designable.",
    "icon": "→",
    "accentHue": "30"
  },
  {
    "name": "SaaS & B2B",
    "body": "Most internal tools are built for spec sheets, not for the person who has to open them at 9am. When adoption is low, the product — not the user — is the problem.",
    "icon": "⬡",
    "accentHue": "260"
  },
  {
    "name": "Real Estate",
    "body": "Property is the most complex financial decision most people make. The platform should reduce that weight — not add to it with poor flows and buried data.",
    "icon": "⌂",
    "accentHue": "45"
  }
],
    faqs: [
  {
    "q": "How do you work — fixed price, hourly or retainer?",
    "a": "Depends on the project. Short-term work is usually fixed price. Ongoing engagements are retainer-based. I'm flexible and happy to figure out what works for you."
  },
  {
    "q": "Do you take on small projects or only long-term engagements?",
    "a": "Both. Some of my best work has come from a focused 2-week sprint. If the problem is interesting and I can genuinely help, project size isn't the filter."
  },
  {
    "q": "Can you work with an early-stage founder who has a limited budget?",
    "a": "Yes. I'd rather work on something meaningful at a reasonable rate than expensive work I don't believe in. Let's talk."
  },
  {
    "q": "What does the first conversation look like?",
    "a": "A 30-minute call, no agenda required. You tell me what you're building or struggling with. I ask questions. We figure out together if and how I can help."
  },
  {
    "q": "Do you work remotely across time zones?",
    "a": "Always. I've worked with teams across Japan, Cambodia, Sri Lanka, India and the US simultaneously. Time zones have never been a real problem."
  },
  {
    "q": "How involved are you in implementation — do you just hand off designs?",
    "a": "I stay involved as long as it's useful. I can hand off detailed specs and work directly with your engineers, review builds against designs, and flag issues before they ship. I'm not a designer who disappears after Figma."
  },
  {
    "q": "What if I already have a designer — can you come in at a strategy level only?",
    "a": "Yes. Some of my most useful work has been upstream of design — helping founders clarify the problem, shape the product brief, and sequence what to build. If you have execution covered but need thinking, that works."
  }
],
  },


  brand: {
    hero: {
      eyebrow: "Brand Strategy & Amazon Growth",
      line1: "From invisible listing",
      line2: "to converting brand.",
      sub: "Most Amazon sellers have a product — but not a brand. I help you build the strategy, identity, and listing architecture that turns browsers into buyers and one-time sales into a growing channel.",
    },
    industries: [
  {
    "name": "International Brands Entering US",
    "body": "Entering the US market requires more than translation — it requires repositioning. The US Amazon buyer is different, the competition is stiffer, and the listing architecture has to work harder.",
    "icon": "◎",
    "accentHue": "30"
  },
  {
    "name": "Startups & Early-Stage Brands",
    "body": "Before you spend on ads or build a team, your brand positioning needs to be right. Most founders skip this — and pay for it later in wasted spend and unclear messaging.",
    "icon": "⬡",
    "accentHue": "45"
  },
  {
    "name": "New Product Launch",
    "body": "A new listing with no reviews, no rank, and no brand presence is invisible by default. Launch architecture — images, copy, A+ content, and keyword strategy — determines whether it gets found or buried.",
    "icon": "→",
    "accentHue": "200"
  },
  {
    "name": "Traffic Without Conversions",
    "body": "The ads are running. The clicks are coming. The sales aren't. Usually the problem isn't the campaign — it's the listing. Copy, images, and A+ content that don't convert are expensive to ignore.",
    "icon": "✦",
    "accentHue": "160"
  },
  {
    "name": "Brand Without Amazon Presence",
    "body": "A brand that exists everywhere except Amazon is leaving its most searchable shelf empty. Setting up a storefront, brand story, and A+ content isn't optional if you're serious about the channel.",
    "icon": "⊕",
    "accentHue": "260"
  },
  {
    "name": "Scaling Past the First Win",
    "body": "The first product worked. Now comes the hard part — expanding the catalogue, protecting the listing, and building a brand presence that grows with you rather than starting over each time.",
    "icon": "⌘",
    "accentHue": "130"
  }
],
    faqs: [
  {
    "q": "I already have a brand. Can you still help, or is this only for launches?",
    "a": "Most of my work is with brands that already exist but feel stuck — inconsistent messaging, listings that don't convert, visuals that don't match what they're actually selling. A rebrand or brand refresh is often more valuable than a first build."
  },
  {
    "q": "Do I need brand strategy before Amazon, or can I go straight to listing optimisation?",
    "a": "You can go straight to the listing — and sometimes that's the right call. But if your brand story isn't clear, even a perfect listing won't fix the conversion problem. I'll tell you honestly which one you actually need."
  },
  {
    "q": "What makes Amazon listings convert better?",
    "a": "Mostly clarity. Buyers decide in under three seconds. The main image, the first bullet, and the headline need to answer 'what is this and why should I care' immediately. Most listings fail at exactly that."
  },
  {
    "q": "I'm entering the US market from outside. Where do I start?",
    "a": "With your positioning. US buyers have different expectations, vocabulary, and trust signals than buyers in India, Japan, or Europe. Before any listing or campaign, I help you understand how your brand needs to land here — and what to change."
  },
  {
    "q": "Can you help with an Amazon launch from scratch — product research and all?",
    "a": "Yes. I've taken brands through the full journey: product research, keyword strategy, listing architecture, A+ content, storefront, and launch plan. You don't need to figure out the sequence on your own."
  },
  {
    "q": "How long does brand strategy take, and what do I actually get at the end?",
    "a": "A focused brand strategy engagement usually takes 2–4 weeks. What you get: a positioning document, messaging framework, tone of voice guide, and a competitor landscape — everything a designer or marketer needs to execute without second-guessing."
  },
  {
    "q": "Do you do the design work too, or just strategy?",
    "a": "Both. I can hand off a strategy brief to a design team, or I can take it through to logo, identity, and brand guidelines myself. Most clients prefer the end-to-end — fewer handoffs, more coherence."
  },
  {
    "q": "Can you work with an early-stage founder with a limited budget?",
    "a": "Yes. I'd rather work on something meaningful at a reasonable rate than on expensive work I don't believe in. Let's talk about what's actually useful for where you are right now."
  }
],
  },


  impact: {
    hero: {
      eyebrow: "Microfinance & Impact Consulting",
      line1: "Designing for the people",
      line2: "most products forget.",
      sub: "Low-income users, first-time digital adopters, and underserved communities deserve products that actually work for them. I've spent 4+ years on the ground — building, testing, and shipping in the markets most designers never visit.",
    },
    industries: [
  {
    "name": "Microfinance Institutions",
    "body": "Field agents, loan officers, and branch managers use these tools daily under real pressure. A confusing screen isn't a UX problem — it's a missed repayment.",
    "icon": "₹",
    "accentHue": "16"
  },
  {
    "name": "Rural Fintech",
    "body": "Most rural fintech fails not because of the technology — but because the design assumes a smartphone-native user who doesn't exist in that market yet.",
    "icon": "⬡",
    "accentHue": "200"
  },
  {
    "name": "Impact Investment",
    "body": "Portfolio companies need design support that understands the mission alongside the metrics. I've worked inside that context — I know what 'impact-aligned' actually means.",
    "icon": "✦",
    "accentHue": "160"
  },
  {
    "name": "International Development",
    "body": "Multi-country programs, multilingual interfaces, low-connectivity constraints — and the need to get it right the first time because field pilots are expensive.",
    "icon": "⊕",
    "accentHue": "280"
  },
  {
    "name": "NGOs & Social Enterprises",
    "body": "Design budgets are tight and the stakes are high. I've worked where every design decision carries real human consequence — and where trust is earned slowly.",
    "icon": "◎",
    "accentHue": "130"
  },
  {
    "name": "Emerging Market Entry",
    "body": "Entering South Asia, Southeast Asia or Central Asia? The cultural, literacy, and connectivity gaps are designable problems — if you plan for them from day one.",
    "icon": "⟶",
    "accentHue": "45"
  }
],
    faqs: [
  {
    "q": "Have you worked directly with MFIs and impact-focused organisations?",
    "a": "Yes — 4+ years with Gojo & Company and its portfolio MFIs across South Asia and Southeast Asia. I've done field research, product design, and digital transformation consulting in this specific context."
  },
  {
    "q": "Do you understand the constraints — connectivity, literacy, trust?",
    "a": "These aren't constraints I read about — they're problems I've designed around directly. Low-connectivity UX, low-literacy interfaces, culturally adapted flows — these are core to how I approach this work."
  },
  {
    "q": "How do you work — fixed price, retainer, or project basis?",
    "a": "Depends on the engagement. Short-term research or audits are usually fixed price. Longer product or transformation engagements are retainer-based. I'm flexible and happy to discuss what works for your organisation."
  },
  {
    "q": "Can you support field research across countries?",
    "a": "Yes. I've done field research in rural and semi-urban contexts across India, Sri Lanka, and Cambodia. I know how to plan it, conduct it safely, and synthesise it into something buildable."
  },
  {
    "q": "Do you work with development sector funders or INGOs?",
    "a": "Yes — I've worked within organisations funded by impact investors and international development partners. I understand reporting requirements, stakeholder alignment, and the pace of institutional decision-making."
  },
  {
    "q": "Do you have experience with multilingual interfaces beyond English?",
    "a": "Yes. Several of the products I've worked on needed to function across Hindi, Gujarati, Tamil, Sinhala, and Khmer — languages with very different scripts, reading patterns, and text expansion behaviour. Designing for multilingual contexts changes how you think about layout, iconography, and information hierarchy. It's not just translation — it's a different design problem."
  },
  {
    "q": "Can you help with digital onboarding for low-smartphone-literacy users?",
    "a": "Yes — this is one of the most common challenges in MFI and rural fintech. I've designed onboarding flows that rely heavily on visuals, voice cues, and progressive disclosure rather than text-heavy instructions. The goal is always reducing dropout before the user even starts."
  },
  {
    "q": "What does the first conversation look like?",
    "a": "A 30-minute call. You tell me what you're building or struggling with. I ask questions. We figure out if and how I can help — no pitch, no agenda."
  }
],
  },


  web: {
    hero: {
      eyebrow: "Website Design & Conversion",
      line1: "A website that works",
      line2: "as hard as you do.",
      sub: "Most websites look fine and do nothing. I build sites designed from the first scroll to earn trust, communicate value, and turn visitors into customers — fast.",
    },
    industries: [
  {
    "name": "Startups & SaaS",
    "body": "You've got traction but your site still looks like an MVP. It's the first thing investors and customers judge you on — it should earn that moment.",
    "icon": "⬡",
    "accentHue": "210"
  },
  {
    "name": "E-commerce & DTC",
    "body": "Every scroll is a decision. The gap between a visitor who converts and one who leaves is usually a single moment of confusion — and that moment is designable.",
    "icon": "→",
    "accentHue": "30"
  },
  {
    "name": "Consultancies & Agencies",
    "body": "Your work is exceptional. Your website needs to say so before you get on a call. Credibility, positioning, and proof — structured to win the right clients.",
    "icon": "✦",
    "accentHue": "260"
  },
  {
    "name": "Founders & Professionals",
    "body": "A personal site is your permanent first impression. It should show your thinking, your work, and why someone should choose you — without you having to explain it.",
    "icon": "◎",
    "accentHue": "160"
  },
  {
    "name": "Product Launches",
    "body": "A launch page has one job: convert. Every element — headline, proof, CTA — should earn its place. No filler, no guesswork.",
    "icon": "⟶",
    "accentHue": "45"
  },
  {
    "name": "Local & Service Businesses",
    "body": "Most local business sites look like they were built in 2015. A well-designed, fast, mobile-first site is still one of the highest-ROI investments a local business can make.",
    "icon": "⌂",
    "accentHue": "16"
  }
],
    faqs: [
  {
    "q": "How fast can you actually deliver?",
    "a": "A landing page can be live in 3–5 days. A full marketing site typically takes 1–2 weeks depending on scope and content readiness. I work fast without sacrificing craft."
  },
  {
    "q": "Do I need to provide copy and content?",
    "a": "Not necessarily. I can work with what you have, refine existing content, or guide you on what's needed. For landing pages, I often provide copy direction as part of the engagement."
  },
  {
    "q": "What if I already have a site — can you just improve it?",
    "a": "Yes. I offer website audits that identify exactly where conversions are being lost and what to fix. Some clients prefer an audit first, then implementation support. Happy to do either."
  },
  {
    "q": "How do you work — fixed price, hourly, or retainer?",
    "a": "Most website projects are fixed price. Ongoing support or iterative improvements are retainer-based. I'll tell you upfront what works best for your scope."
  },
  {
    "q": "Will I be able to edit the site myself after launch?",
    "a": "Yes, if that matters to you. I can integrate a CMS that makes content updates straightforward — no developer required for the day-to-day."
  },
  {
    "q": "Do you work remotely across time zones?",
    "a": "Always. I've worked with clients across India, the US, Japan, and Southeast Asia simultaneously. Async communication and clear handoffs mean time zones are never a real barrier."
  }
],
  },

};
