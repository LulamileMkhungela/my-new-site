/**
 * Home — hero, client marquee, featured work, process, services, testimonials.
 * All copy comes from window.SITE and window.PROJECTS.
 */
(function () {
  const SITE = window.SITE;
  const P = window.PROJECTS;
  const { esc, md, initials } = window.LM;
  const img = (name, alt, cls) =>
    `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt)}" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ''} />`;

  /* ---- Hero --------------------------------------------------------------- */
  document.querySelector('[data-headline]').innerHTML = SITE.headline.replace(
    /great design\.?$/i,
    '<em>great design</em>.',
  );
  document.querySelector('[data-roles]').innerHTML = SITE.roles.map((role) => `<span>${esc(role)}</span>`).join('');
  document.querySelector('[data-stats]').innerHTML = SITE.stats
    .map((stat) => `<div class="stat"><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`)
    .join('');

  /* ---- Client marquee (two passes so the loop is seamless) ---------------- */
  const logos = SITE.logos
    .map(
      (logo) =>
        `<img data-asset="${esc(logo.src)}" src="${window.asset(logo.src)}" alt="${esc(logo.alt)}" loading="lazy"
           style="height:${logo.scale ? (1.4 * logo.scale).toFixed(2) : '1.4'}rem" />`,
    )
    .join('');
  document.querySelector('[data-marquee]').innerHTML = `<div class="marquee__track">${logos}${logos}</div>`;

  /* ---- Filters ------------------------------------------------------------ */
  const filters = document.querySelector('[data-filters]');
  filters.innerHTML = SITE.filters
    .map(
      (filter, index) =>
        `<button class="filter" type="button" data-filter="${esc(filter.tag)}" aria-pressed="${index === 0}">
           ${esc(filter.label)}<span>${filter.count}</span>
         </button>`,
    )
    .join('');

  /* ---- Featured work ------------------------------------------------------ */
  const featured = [
    ...P.product.map((project) => ({ ...project, href: /^https?:/.test(project.url) ? project.url : `case-study.html?id=${project.id}` })),
    ...Object.values(P.graphic).map((project) => ({ ...project, href: /^https?:/.test(project.url) ? project.url : `case-study.html?id=${project.id}` })),
    ...Object.values(P.amazon).map((project) => ({ ...project, href: /^https?:/.test(project.url) ? project.url : `case-study.html?id=${project.id}` })),
  ];

  const archiveCards = P.archive
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
    .join('');

  function card(project, index) {
    const tags = project.tags || [];
    return `
      <a class="work-card" href="${esc(project.href)}" data-tags="${esc(tags.join(' '))}" data-reveal style="--delay:${index * 60}ms">
        <div class="media media--16x9">${img(project.cover, project.title)}</div>
        <div class="work-card__body">
          <span class="work-card__index">
            <span>${String(index + 1).padStart(2, '0')} / ${String(featured.length).padStart(2, '0')}</span>
            <span>${esc(project.client)}</span>
          </span>
          <h3>${esc(project.title)}</h3>
          <p>${esc(project.description)}</p>
          <span class="chips">${(project.skills || []).slice(0, 4).map((skill) => `<span class="chip">${esc(skill)}</span>`).join('')}</span>
          <span class="work-card__foot">
            <span>${esc(project.year)}</span>
            <span class="work-card__cta">${/^https?:/.test(project.href) ? 'Open project' : 'View case study'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
            </span>
          </span>
        </div>
      </a>`;
  }

  const grid = document.querySelector('[data-featured]');
  const archiveHost = document.querySelector('[data-archive]');
  grid.innerHTML = featured.map(card).join('');
  archiveHost.innerHTML = archiveCards;

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const tag = button.dataset.filter;
    filters.querySelectorAll('[data-filter]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    grid.querySelectorAll('.work-card').forEach((element) => {
      const tags = element.dataset.tags || '';
      element.hidden = tag !== 'all' && !tags.split(' ').includes(tag);
    });
    archiveHost.querySelectorAll('.archive-card').forEach((element) => {
      element.hidden = tag !== 'all';
    });
  });

  /* ---- Process ------------------------------------------------------------ */
  document.querySelector('[data-process]').innerHTML = SITE.process
    .map(
      (step) => `
      <li data-reveal>
        <span class="n">${esc(step.num)}</span>
        <h3>${esc(step.title)}</h3>
        <p>${esc(step.body)}</p>
      </li>`,
    )
    .join('');

  /* ---- Services ----------------------------------------------------------- */
  document.querySelector('[data-services]').innerHTML = SITE.services
    .map(
      (service, index) => `
      <a class="service-card" href="${esc(service.page)}" data-reveal style="--delay:${index * 70}ms">
        <div class="media media--16x9">${img(service.image, service.title)}</div>
        <div class="service-card__body">
          <span class="service-card__num">${esc(service.number)} · ${esc(service.keyword)}</span>
          <h3>${esc(service.title)}</h3>
          <p>${esc(service.oneliner)}</p>
          <span class="chips"><span class="chip">${esc(service.tagline)}</span></span>
        </div>
      </a>`,
    )
    .join('');

  /* ---- Testimonials ------------------------------------------------------- */
  const list = SITE.testimonials;
  let at = 0;
  let timer;
  const textEl = document.querySelector('[data-quote-text]');
  const nameEl = document.querySelector('[data-quote-name]');
  const metaEl = document.querySelector('[data-quote-meta]');
  const avatarEl = document.querySelector('[data-quote-avatar]');
  const dots = document.querySelector('[data-quote-dots]');

  dots.innerHTML = list
    .map(
      (item, index) =>
        `<button type="button" role="tab" data-dot="${index}" aria-current="${index === 0}" aria-label="Testimonial from ${esc(item.name)}"></button>`,
    )
    .join('');

  function show(index) {
    at = (index + list.length) % list.length;
    const item = list[at];
    textEl.textContent = `“${item.message}”`;
    nameEl.textContent = item.name;
    metaEl.textContent = [item.designation, item.company, item.period].filter(Boolean).join(' · ');
    avatarEl.textContent = initials(item.name);
    dots.querySelectorAll('[data-dot]').forEach((dot, i) => dot.setAttribute('aria-current', String(i === at)));
  }

  function auto() {
    clearInterval(timer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => show(at + 1), 9000);
  }

  document.querySelector('[data-quote-prev]').addEventListener('click', () => {
    show(at - 1);
    auto();
  });
  document.querySelector('[data-quote-next]').addEventListener('click', () => {
    show(at + 1);
    auto();
  });
  dots.addEventListener('click', (event) => {
    const dot = event.target.closest('[data-dot]');
    if (!dot) return;
    show(Number(dot.dataset.dot));
    auto();
  });

  show(0);
  auto();

  /* ---- Resume link -------------------------------------------------------- */
  document.querySelectorAll('[data-resume]').forEach((link) => {
    link.href = SITE.resume;
    link.target = '_blank';
    link.rel = 'noopener';
  });
})();
