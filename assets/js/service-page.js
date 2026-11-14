/**
 * Service detail — one page per area of work, following the reference build's
 * service-page structure exactly (reference/source-mirror/):
 *
 *   1. hero            eyebrow, two-line headline, subheadline, the two CTAs
 *   2. sticky tabs     A · Portfolio    B · What I Offer    C · Common Questions
 *   3. the problem     chaos vs clarity
 *   4. industries      "Every industry breaks in a different place."
 *   5. clients         the logo marquee
 *   6. selected work   the studies filed under this area
 *   7. archive         the older projects filed under this area
 *   8. process         "Here's how it actually works."
 *   9. offer           "Three ways to work together." + the not-sure escape hatch
 *  10. questions       the area's FAQs
 *  11. closing         "Not sure where to start? That's fine…"
 *
 * Product Design & Strategy also carries ProdOps (the product I own) and the
 * mobile apps in the build, because that is the area they belong to.
 *
 *   service.html?id=product | brand | impact | web
 */
(function () {
  const SITE = window.SITE;
  const WORK = window.WORK;
  const PAGES = window.SERVICE_PAGES;
  const COPY = PAGES.sectionCopy;
  const { esc } = window.SR;

  const id = (new URLSearchParams(location.search).get('id') || 'product').toLowerCase();
  const service = SITE.services.find((item) => item.id === id) || SITE.services[0];
  const page = PAGES[service.id];
  const detail = SITE.serviceDetail[service.id];
  const index = SITE.services.indexOf(service);

  const img = (name, alt) =>
    name
      ? `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt)}" loading="lazy" decoding="async" />`
      : '';

  document.title = `${service.title} | Lulamile M`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', page.hero.sub);

  /* ---- Which work belongs to this area ----------------------------------- */
  const tagMap = { product: 'product-design', brand: 'brand-strategy', impact: 'microfinance', web: 'website-design' };
  const filedTag = tagMap[service.id] || service.id;

  const studies = WORK.studies.filter((project) => (project.tags || []).includes(filedTag));
  const redirects = WORK.redirects.filter((project) => (project.tags || []).includes(filedTag));
  const archive = (WORK.archive || []).filter((project) => (project.tags || []).includes(filedTag));

  /* The work cards, in the reference's full-bleed row shape. */
  const workRow = (project, position, total) => `
    <a class="service-work" href="${esc(project.href || project.url)}"${project.url && !project.href ? ' target="_blank" rel="noopener"' : ''} data-reveal>
      <div class="service-work__media">
        ${img(project.cover, project.title)}
        <span class="service-work__count">${String(position + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
      </div>
      <div class="service-work__body">
        <p class="service-work__meta">${esc(project.client)} · ${esc(project.year)}</p>
        <h3>${esc(project.title)}</h3>
        <span class="service-work__cta">View case study
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
        <p class="service-work__desc">${esc(project.description || '')}</p>
        <div class="chips">${(project.skills || []).map((skill) => `<span class="chip">${esc(skill)}</span>`).join('')}</div>
      </div>
    </a>`;

  const archiveCard = (project) => `
    <a class="archive-card" href="${esc(project.url)}" target="_blank" rel="noopener" data-reveal>
      <div class="media">${img(project.image || project.cover, project.title)}</div>
      <div>
        <h3>${esc(project.title)}</h3>
        <p>${esc(project.company || project.client)} · ${esc(project.year)}</p>
      </div>
    </a>`;

  /* ---- ProdOps and the apps in the build (product design only) ----------- */
  const APPS = (window.EXTRA && window.EXTRA.comingSoon && window.EXTRA.comingSoon.apps) || [];
  const store = (app, platform) => {
    const url = (app.downloads || {})[platform] || '';
    const label = platform === 'android' ? 'Android APK' : 'iOS build';
    if (!url) {
      return `<span class="btn btn--ghost btn--sm store-btn is-pending" aria-disabled="true" title="Link not added yet">${label} <span class="store-btn__state">Not yet</span></span>`;
    }
    return `<a class="btn btn--sm store-btn" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`;
  };

  const extras = service.id === 'product'
    ? `<section class="service-section" id="prodops">
         <div class="service-section__inner">
           <div class="service-section__lead">
             <p class="eyebrow">My product</p>
             <h2>ProdOps</h2>
             <p class="service-section__body">
               A role-based product workspace: business and product ownership, product/UX/UI/CX design,
               development, QA and delivery each get their own stage, artifacts and approvals — with AI
               drafting and Figma frame imports where a provider is configured. I own it and build it.
             </p>
             <div class="row" style="margin-top:1.4rem">
               <a class="btn btn--accent" href="https://lulamilemkhungela.github.io/ProdOps/" target="_blank" rel="noopener">Open the live workspace</a>
               <a class="btn btn--ghost" href="https://github.com/LulamileMkhungela/ProdOps" target="_blank" rel="noopener">Repository</a>
             </div>
           </div>
         </div>
       </section>

       <section class="service-section" id="apps">
         <div class="service-section__inner">
           <div class="service-section__lead">
             <p class="eyebrow">In the build</p>
             <h2>Mobile apps</h2>
             <p class="service-section__body">
               Three apps in the build. Each gets an Android APK and an iOS build at launch.
             </p>
           </div>
           <div class="service-section__grid">
             ${APPS.map(
               (app) => `
               <article class="note-card">
                 <h3>${esc(app.name)}${app.aka ? ` <span class="meta">· ${esc(app.aka)}</span>` : ''}</h3>
                 <p>${esc(app.description)}</p>
                 <div class="row" style="margin-top:1rem">
                   ${store(app, 'android')}
                   ${store(app, 'ios')}
                 </div>
               </article>`,
             ).join('')}
           </div>
         </div>
       </section>`
    : '';

  /* ---- Markup ------------------------------------------------------------ */
  document.querySelector('[data-service-page]').innerHTML = `
    <section class="service-hero">
      <div class="shell shell--narrow">
        <p class="eyebrow">${esc(page.hero.eyebrow)}</p>
        <h1 class="service-hero__title">
          <span>${esc(page.hero.line1)}</span>
          <span>${esc(page.hero.line2)}</span>
        </h1>
        <p class="service-hero__lede">${esc(page.hero.sub)}</p>
        <div class="row" style="margin-top:2rem">
          <a class="btn btn--accent" href="#portfolio">
            See the Work
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
          </a>
          <a class="btn btn--outline" href="contact.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>
            Book a Free Call
          </a>
        </div>
      </div>
    </section>

    <nav class="service-tabs" aria-label="On this page" data-service-tabs>
      <div class="shell service-tabs__inner">
        <a class="service-tabs__tab" href="#portfolio" data-tab="portfolio"><span>A</span> Portfolio</a>
        <a class="service-tabs__tab" href="#offer" data-tab="offer"><span>B</span> What I Offer</a>
        <a class="service-tabs__tab" href="#questions" data-tab="faq"><span>C</span> Common Questions</a>
      </div>
    </nav>

    <!-- The problem: chaos vs clarity -->
    <section class="service-section" id="problem">
      <div class="service-section__inner">
        <h2 class="service-section__title">${esc(detail.problem.heading)}</h2>
        <p class="service-section__body" style="max-width:62ch;margin-top:1.2rem">${esc(detail.problem.kicker)}</p>
        <div class="clarity" style="margin-top:clamp(2rem,4vw,3rem)">
          <div class="clarity__col clarity__col--chaos">
            <p class="clarity__title"><span aria-hidden="true">🌀</span> Chaos</p>
            <ul class="clarity__list">
              ${detail.problem.chaos.map((item) => `<li>${esc(item)}</li>`).join('')}
            </ul>
          </div>
          <div class="clarity__col clarity__col--clear">
            <p class="clarity__title"><span aria-hidden="true">✦</span> ${esc(detail.problem.clarityTitle)}</p>
            <ul class="clarity__list clarity__list--clear">
              ${detail.problem.clarity
                .map(
                  (item, position) => `<li><span class="clarity__num">${String(position + 1).padStart(2, '0')}</span><span><strong>${esc(item.label)}</strong>${esc(item.body)}</span></li>`,
                )
                .join('')}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Industries -->
    <section class="service-section" id="industries">
      <div class="service-section__inner">
        <h2 class="service-section__title">${esc(COPY.industries)}</h2>
        <div class="industry-grid">
          ${page.industries
            .map(
              (industry) => `
            <article class="industry" style="--hue:${esc(industry.accentHue)}">
              <span class="industry__icon" aria-hidden="true">${esc(industry.icon)}</span>
              <h3>${esc(industry.name)}</h3>
              <p>${esc(industry.body)}</p>
            </article>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <!-- Clients -->
    <section class="service-section service-section--tight" aria-label="Clients">
      <div class="shell">
        <div class="between">
          <p class="eyebrow eyebrow--bare" style="margin:0">Worked with</p>
          <p class="meta" style="margin:0"><span data-logo-count>30+</span> brands &amp; founders</p>
        </div>
      </div>
      <div class="marquee" data-marquee aria-live="off"></div>
    </section>

    <!-- Selected work + archive -->
    <section class="service-section" id="portfolio">
      <div class="service-section__inner">
        <h2 class="service-section__title">${esc(COPY.work)}</h2>
        <div class="service-work__list">
          ${studies.length
            ? studies.map((project, position) => workRow(project, position, studies.length)).join('')
            : `<p class="service-section__body">Case studies for this area are being written up. <a href="contact.html">Ask me about them</a>.</p>`}
        </div>

        ${
          archive.length
            ? `<div class="service-archive">
                 <h2 class="service-section__title">${esc(COPY.archive)}</h2>
                 <div class="archive-grid">
                   ${archive.map((project, position) => archiveCard(project, position, archive.length)).join('')}
                 </div>
               </div>`
            : ''
        }

        ${
          redirects.length
            ? `<div class="service-archive">
                 <h2 class="service-section__title">Live sites</h2>
                 <div class="archive-grid">
                   ${redirects
                     .map(
                       (project) => `
                     <a class="archive-card" href="${esc(project.url)}" target="_blank" rel="noopener" data-reveal>
                       <div class="media">${img(project.cover, project.title)}</div>
                       <div>
                         <h3>${esc(project.title)}</h3>
                         <p>${esc(project.client)} · ${esc(project.year)}</p>
                       </div>
                     </a>`,
                     )
                     .join('')}
                 </div>
               </div>`
            : ''
        }
      </div>
    </section>

    <!-- Process -->
    <section class="service-section" id="process">
      <div class="service-section__inner">
        <h2 class="service-section__title">${esc(COPY.process)}</h2>
        <div class="process-grid">
          ${(SITE.process || [])
            .map(
              (step) => `
            <div class="process-step" data-reveal>
              <span class="process-step__num">${esc(step.num)}</span>
              <h3>${esc(step.title)}</h3>
              <p>${esc(step.body)}</p>
            </div>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <!-- What I offer -->
    <section class="service-section" id="offer">
      <div class="service-section__inner">
        <h2 class="service-section__title">Three ways to <em>work together.</em></h2>
        <p class="service-section__body" style="max-width:60ch;margin-top:1rem">${esc(COPY.servicesIntro)}</p>
        <div class="offer-grid">
          ${detail.offerings
            .map(
              (item, position) => `
            <article class="offer" data-reveal>
              <span class="offer__num">${String(position + 1).padStart(2, '0')}</span>
              <h3>${esc(item.title)}</h3>
              <p>${esc(item.description)}</p>
              <div class="chips">${item.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}</div>
              <ul class="tick-list offer__list">${item.deliverables.map((deliverable) => `<li>${esc(deliverable)}</li>`).join('')}</ul>
              <p class="offer__best"><strong>Best for:</strong> ${esc(item.bestFor)}</p>
              <a class="offer__cta" href="contact.html">Start with this
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </a>
            </article>`,
            )
            .join('')}
        </div>
        <p class="service-not-sure">${esc(COPY.notSure)} <a href="contact.html">${esc(COPY.notSureCta)}</a></p>
      </div>
    </section>

    ${extras}

    <!-- Questions -->
    <section class="service-section" id="questions">
      <div class="service-section__inner">
        <h2 class="service-section__title">${esc(COPY.faq[service.id] || COPY.faq.product)}</h2>
        <div class="faq" style="margin-top:clamp(1.6rem,3vw,2.4rem)">
          ${page.faqs
            .map(
              (item, position) => `
            <details${position === 0 ? ' open' : ''}>
              <summary>${esc(item.q)}</summary>
              <p>${esc(item.a)}</p>
            </details>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <!-- Closing -->
    <section class="service-section service-cta">
      <div class="service-section__inner">
        <h2 class="service-section__title">${esc(COPY.ctaHeading)}</h2>
        <p class="service-section__body">${esc(COPY.ctaBody)}</p>
        <div class="row" style="margin-top:1.6rem">
          <a class="btn btn--accent" href="contact.html">${esc(COPY.cta1)}</a>
          <a class="btn btn--ghost" href="contact.html">${esc(COPY.cta2)}</a>
        </div>
      </div>
    </section>`;

  /* ---- Client marquee (same loop as the home page) ----------------------- */
  const marquee = document.querySelector('[data-marquee]');
  if (marquee) {
    const logos = (SITE.logos || [])
      .map(
        (logo) =>
          `<img data-asset="${esc(logo.src)}" src="${window.asset(logo.src)}" alt="${esc(logo.alt)}" loading="lazy"
             style="height:${logo.scale ? (1.4 * logo.scale).toFixed(2) : '1.4'}rem" />`,
      )
      .join('');
    marquee.innerHTML = `<div class="marquee__track">${logos}${logos}</div>`;
    const counter = document.querySelector('[data-logo-count]');
    if (counter) counter.textContent = `${(SITE.logos || []).length}+`;
  }

  /* ---- Sticky tabs follow the scroll ------------------------------------ */
  const tabs = [...document.querySelectorAll('[data-service-tabs] .service-tabs__tab')];
  const targets = tabs
    .map((tab) => ({ tab, section: document.getElementById(tab.getAttribute('href').slice(1)) }))
    .filter((entry) => entry.section);

  if (targets.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          tabs.forEach((tab) => tab.removeAttribute('aria-current'));
          const match = targets.find((target) => target.section === entry.target);
          if (match) match.tab.setAttribute('aria-current', 'true');
        });
      },
      { rootMargin: '-25% 0px -60% 0px' },
    );
    targets.forEach((target) => io.observe(target.section));
  }
})();
