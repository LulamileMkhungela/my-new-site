/**
 * Service detail — one page per area of work, rendered from SITE.serviceDetail
 * so the four expertise dropdown destinations have a real page behind them:
 *
 *   service.html?id=product   Product Design & Strategy
 *   service.html?id=brand     Brand Strategy & Amazon Growth
 *   service.html?id=impact    Microfinance & Impact Consulting
 *   service.html?id=web       Website Design & Conversion
 *
 * Product Design & Strategy also carries ProdOps (the product I own) and the
 * mobile apps in the build, because that is where they belong.
 */
(function () {
  const SITE = window.SITE;
  const WORK = window.WORK;
  const { esc } = window.SR;

  const id = (new URLSearchParams(location.search).get('id') || 'product').toLowerCase();
  const service = SITE.services.find((item) => item.id === id) || SITE.services[0];
  const detail = SITE.serviceDetail[service.id];
  const index = SITE.services.indexOf(service);
  const next = SITE.services[(index + 1) % SITE.services.length];

  const img = (name, alt) =>
    name
      ? `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt)}" loading="lazy" decoding="async" />`
      : '';

  document.title = `${service.title} | Lulamile M`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', detail.whatIntro);

  /* Studies filed under this area, plus the live products that belong to it. */
  const areaTag = service.id; // product | brand | impact | web
  const tagMap = { product: 'product-design', brand: 'brand-strategy', impact: 'microfinance', web: 'website-design' };
  const filedTag = tagMap[areaTag] || areaTag;
  const related = [
    ...WORK.studies.filter((project) => (project.tags || []).includes(filedTag)),
    ...WORK.redirects.filter((project) => (project.tags || []).includes(filedTag)),
  ];

  const offerings = detail.offerings
    .map(
      (item) => `
      <div class="note-card">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.description)}</p>
        <div class="chips" style="margin-top:0.8rem">${item.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}</div>
        <div class="note">
          <strong>What you get</strong>
          <ul class="tick-list" style="margin-top:0.3rem">
            ${item.deliverables.map((deliverable) => `<li>${esc(deliverable)}</li>`).join('')}
          </ul>
        </div>
        <p style="margin-top:0.9rem;font-size:0.82rem"><strong style="color:hsl(var(--fg))">Best for:</strong> ${esc(item.bestFor)}</p>
        <p style="font-size:0.82rem"><strong style="color:hsl(var(--fg))">Outcome:</strong> ${esc(item.outcome)}</p>
      </div>`,
    )
    .join('');

  /* ProdOps and the apps in the build are product design work. */
  const APPS = (window.EXTRA && window.EXTRA.comingSoon && window.EXTRA.comingSoon.apps) || [];
  const prodops = service.id === 'product'
    ? `<section class="case-section" id="prodops">
         <div class="case-section__head">
           <div>
             <span class="case-section__num">My product</span>
             <h2>ProdOps</h2>
             <p class="meta" style="margin-top:0.8rem">Product owner &amp; builder</p>
           </div>
           <div>
             <p class="lede">
               A role-based product workspace: business and product ownership, product/UX/UI/CX design, development,
               QA and delivery each get their own stage, artifacts and approvals — with AI drafting and Figma frame
               imports where a provider is configured. I own it and build it.
             </p>
             <div class="row" style="margin-top:1.2rem">
               <a class="btn btn--accent" href="https://lulamilemkhungela.github.io/ProdOps/" target="_blank" rel="noopener">Open the live workspace</a>
               <a class="btn btn--ghost" href="https://github.com/LulamileMkhungela/ProdOps" target="_blank" rel="noopener">Repository</a>
             </div>
           </div>
         </div>
       </section>

       <section class="case-section" id="apps">
         <div class="case-section__head">
           <div>
             <span class="case-section__num">In the build</span>
             <h2>Mobile apps</h2>
             <p class="meta" style="margin-top:0.8rem">Coming soon</p>
           </div>
           <div>
             <p class="lede">
               Three apps in the build. Each gets an Android APK and an iOS build at launch — the buttons below are
               wired and waiting for their URLs.
             </p>
             <div class="card-grid" style="margin-top:1.4rem">
               ${APPS.map(
                 (app) => `
                 <div class="note-card">
                   <h3>${esc(app.name)}${app.aka ? ` <span class="meta">· ${esc(app.aka)}</span>` : ''}</h3>
                   <p>${esc(app.description)}</p>
                   <div class="row" style="margin-top:0.9rem">
                     <span class="chip">${esc(app.status)}</span>
                     <span class="chip">Android APK</span>
                     <span class="chip">iOS build</span>
                   </div>
                 </div>`,
               ).join('')}
             </div>
           </div>
         </div>
       </section>`
    : '';

  /* Chaos on the left, clarity on the right — the reference's problem block. */
  const problem = detail.problem
    ? `<section class="case-section" id="problem">
         <div class="case-section__head">
           <div>
             <span class="case-section__num">The problem</span>
             <h2>${esc(detail.problem.heading)}</h2>
             <p class="lede" style="margin-top:1rem">${esc(detail.problem.kicker)}</p>
           </div>
           <div class="clarity">
             <div class="clarity__col clarity__col--chaos">
               <p class="clarity__title">What it sounds like now</p>
               <ul class="clarity__list">
                 ${detail.problem.chaos
                   .map((item) => `<li><span class="clarity__mark" aria-hidden="true">&times;</span>${esc(item)}</li>`)
                   .join('')}
               </ul>
             </div>
             <div class="clarity__col clarity__col--clear">
               <p class="clarity__title">${esc(detail.problem.clarityTitle)}</p>
               <ul class="clarity__list clarity__list--clear">
                 ${detail.problem.clarity
                   .map(
                     (item) => `<li><span class="clarity__mark" aria-hidden="true">&check;</span><span><strong>${esc(item.label)}</strong>${esc(item.body)}</span></li>`,
                   )
                   .join('')}
               </ul>
             </div>
           </div>
         </div>
       </section>`
    : '';

  document.querySelector('[data-service-page]').innerHTML = `
    <section class="hero">
      <div class="shell">
        <p class="hero__badge">
          <span class="dot" aria-hidden="true"></span>
          <span>Area ${esc(service.number)} · ${esc(service.keyword)}</span>
        </p>
        <div class="hero__grid">
          <div>
            <p class="eyebrow">${esc(service.keyword)}</p>
            <h1 class="display-xl">${esc(service.title)}</h1>
            <p class="hero__lede">${esc(detail.whatIntro)}</p>
            <div class="hero__actions">
              <a class="btn btn--accent" href="${related.length ? '#work' : 'work.html'}">
                See the Work
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
              </a>
              <a class="btn btn--outline" href="contact.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>
                Book a Free Call
              </a>
            </div>
          </div>
          <div class="stats">
            <div class="stat"><strong>${esc(service.number)}</strong><span>Area of work</span></div>
            <div class="stat"><strong>${related.length}</strong><span>${related.length === 1 ? 'Project filed' : 'Projects filed'}</span></div>
          </div>
        </div>
      </div>
    </section>

    <div class="shell">
      <div class="media media--16x9" style="margin-bottom:clamp(2rem,4vw,3rem)">${img(service.image, service.title)}</div>

      <nav class="service-tabs" aria-label="On this page">
        ${related.length ? '<a class="service-tabs__tab" href="#work">The Work</a>' : ''}
        <a class="service-tabs__tab" href="#offer">What I Offer</a>
        ${service.id === 'product' ? '<a class="service-tabs__tab" href="#prodops">ProdOps</a>' : ''}
        <a class="service-tabs__tab" href="#questions">Common Questions</a>
      </nav>

      ${problem}

      <section class="case-section" id="offer">
        <div class="case-section__head">
          <div>
            <span class="case-section__num">01 · What I offer</span>
            <h2>${esc(service.tagline)}</h2>
          </div>
          <div>
            <div class="card-grid">${offerings}</div>
          </div>
        </div>
      </section>

      <section class="case-section">
        <div class="case-section__head">
          <div>
            <span class="case-section__num">02 · Who this is for</span>
            <h2>Who it is built for</h2>
          </div>
          <div>
            <div class="card-grid">
              ${detail.audiences
                .map(
                  (audience) => `
                <div class="note-card">
                  <span class="case-section__num" style="font-size:1.1rem">${esc(audience.icon)}</span>
                  <h3>${esc(audience.name)}</h3>
                  <p>${esc(audience.body)}</p>
                </div>`,
                )
                .join('')}
            </div>
          </div>
        </div>
      </section>

      ${
        related.length
          ? `<section class="case-section" id="work">
               <div class="case-section__head">
                 <div>
                   <span class="case-section__num">03 · The work</span>
                   <h2>Filed under this area</h2>
                 </div>
                 <div>
                   <div class="work-grid work-grid--list">
                     ${related
                       .map(
                         (project) => `
                       <a class="archive-card" href="${esc(project.href || project.url)}"${project.url && !project.href ? ' target="_blank" rel="noopener"' : ''}>
                         <div class="media">${img(project.cover, project.title)}</div>
                         <div>
                           <h3>${esc(project.title)}</h3>
                           <p>${esc(project.client)} · ${esc(project.year)}</p>
                         </div>
                       </a>`,
                       )
                       .join('')}
                   </div>
                 </div>
               </div>
             </section>`
          : ''
      }

      ${prodops}

      <section class="case-section" id="questions">
        <div class="case-section__head">
          <div>
            <span class="case-section__num">Common questions</span>
            <h2>Before we talk</h2>
          </div>
          <div>
            <div class="faq">
              ${detail.faqs
                .map(
                  (item, position) => `
                <details${position === 0 ? ' open' : ''}>
                  <summary>${esc(item.q)}</summary>
                  <p>${esc(item.a)}</p>
                </details>`,
                )
                .join('')}
            </div>
            <div class="row" style="margin-top:1.4rem">
              <a class="btn btn--accent" href="contact.html">Book a call about ${esc(service.keyword.toLowerCase())}</a>
              <a class="btn btn--ghost" href="services.html">All four areas</a>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section class="section section--tight">
      <div class="shell">
        <a class="case-next" href="service.html?id=${esc(next.id)}">
          <span>
            <span class="meta">Next area of work</span>
            <h3>${esc(next.title)}</h3>
            <p>${esc(next.tagline)}</p>
          </span>
          <span class="btn btn--ghost btn--sm">Open →</span>
        </a>
      </div>
    </section>`;
})();
