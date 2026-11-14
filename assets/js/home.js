/**
 * Home — hero, client marquee, featured work, mobile apps in the build,
 * process, services, testimonials.
 * Copy comes from window.SITE, and the work list from window.WORK (the merged
 * source data plus the work added in extra.data.js).
 */
(function () {
  const SITE = window.SITE;
  const WORK = window.WORK;
  const P = window.PROJECTS;
  const { esc, md, initials } = window.SR;
  const img = (name, alt, cls) =>
    `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt)}" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ''} />`;

  /* ---- Hero --------------------------------------------------------------- */
  /* "Great ideas deserve great design." — the last two words carry the accent. */
  /* Each word is its own span so the headline can rise in one word at a time —
     the reference's entry animation, done in CSS with a stagger. */
  const headline = SITE.headline.replace(/great design\.?$/i, '<em>great design</em>.');
  document.querySelector('[data-headline]').innerHTML = headline
    .split(/(\s+)/)
    .map((part, index) => {
      if (!part.trim()) return part;
      return `<span class="word" style="--word:${index}"><span>${part}</span></span>`;
    })
    .join('');

  /* The badge line above the headline: the three roles, dot separated. */
  document.querySelector('[data-roles]').innerHTML = SITE.roles
    .map((role) => esc(role))
    .join(' &middot; ');
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

  const logoCount = document.querySelector('[data-logo-count]');
  if (logoCount) logoCount.textContent = `${SITE.logos.length}`;

  /* ---- Filters ------------------------------------------------------------ */
  const filters = document.querySelector('[data-filters]');
  filters.innerHTML = WORK.filters
    .filter((filter) => filter.count > 0 || filter.tag === 'all')
    .map(
      (filter, index) =>
        `<button class="filter" type="button" data-filter="${esc(filter.tag)}" aria-pressed="${index === 0}">
           ${esc(filter.label)}<span>${filter.count}</span>
         </button>`,
    )
    .join('');

  /* ---- Positioning ------------------------------------------------------- */
  const chips = document.querySelector('[data-positioning-chips]');
  if (chips) {
    chips.innerHTML = ['Product', 'Brand', 'Amazon', 'Impact', 'Web']
      .map((label) => `<span class="chip">${esc(label)}</span>`)
      .join('');
  }

  /* ---- Positioning: the glow follows the pointer ------------------------- */
  const positioning = document.querySelector('[data-positioning]');
  if (positioning && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    positioning.addEventListener('pointermove', (event) => {
      const rect = positioning.getBoundingClientRect();
      positioning.style.setProperty('--px', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      positioning.style.setProperty('--py', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
  }

  /* ---- Featured work ------------------------------------------------------ */
  const APPS = (window.EXTRA && window.EXTRA.comingSoon && window.EXTRA.comingSoon.apps) || [];

  /* Each app becomes a portfolio card in the Product Design category. It is an
     <article>, not a link: there is no case study yet, and the two download
     buttons inside it must stay real controls. */
  const appCards = APPS.map((app) => ({
    kind: 'app',
    id: app.id,
    title: app.name,
    client: app.aka ? `${app.name} · ${app.aka}` : app.name,
    year: app.status,
    description: app.description,
    role: app.tagline,
    skills: app.skills || [],
    tags: ['product-design', 'mobile-app', 'cat-saas-ops'],
    downloads: app.downloads || {},
  }));

  const featured = [...WORK.studies, ...appCards];

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

  /* A download is only a link once there is a URL; until then the button is
     present, labelled and disabled, so the card never claims a build it cannot
     hand over. */
  function storeButton(app, platform) {
    const url = (app.downloads || {})[platform] || '';
    const label = platform === 'android' ? 'Android APK' : 'iOS build';
    const icon =
      platform === 'android'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M7 2l1.6 2.8M17 2l-1.6 2.8"/><rect x="4" y="6.5" width="16" height="12.5" rx="3"/><path d="M8.5 11.5h.01M15.5 11.5h.01"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M16 3.5c-1.2.1-2.4.8-3 1.7-.6.8-1 1.9-.9 2.9 1.2.1 2.4-.6 3.1-1.5.6-.8 1-1.9.8-3.1Z"/><path d="M19.5 16.7c-.5 1.1-.8 1.6-1.5 2.6-1 1.4-2.4 3.1-4.1 3.1-1.5 0-1.9-1-4-1s-2.5 1-4 1c-1.7 0-3-1.9-4-3.3-2.7-4.1-3-9-1.3-11.6 1.2-1.8 3.1-2.8 4.9-2.8 1.8 0 2.9 1 4.4 1 1.4 0 2.3-1 4.4-1 1.6 0 3.3.9 4.5 2.4-4 2.2-3.3 7.9.7 9.6Z"/></svg>';

    if (!url) {
      return `<span class="btn btn--ghost btn--sm store-btn is-pending" aria-disabled="true" title="Link not added yet">
          ${icon}${label} <span class="store-btn__state">Not yet</span>
        </span>`;
    }
    return `<a class="btn btn--sm store-btn" href="${esc(url)}" target="_blank" rel="noopener" download>
        ${icon}${label}
      </a>`;
  }

  function card(project, index) {
    const tags = project.tags || [];
    const counter = `${String(index + 1).padStart(2, '0')} / ${String(featured.length).padStart(2, '0')}`;

    if (project.kind === 'app') {
      return `
      <article class="work-card work-card--app" data-tags="${esc(tags.join(' '))}" data-reveal style="--delay:${(index % 2) * 80}ms">
        <div class="media media--16x9">
          <div class="work-card__plate">
            <span class="work-card__plate-name">${esc(project.title)}</span>
            <span class="work-card__plate-tag">Mobile app · coming soon</span>
          </div>
          <span class="work-card__counter" aria-hidden="true">${counter}</span>
        </div>
        <div class="work-card__body">
          <div>
            <span class="work-card__index">
              <span>Product Design &middot; Mobile</span>
              <span>${esc(project.year)}</span>
            </span>
            <h3>${esc(project.title)}</h3>
            <span class="work-card__stores">
              ${storeButton(project, 'android')}
              ${storeButton(project, 'ios')}
            </span>
          </div>
          <div>
            <p>${esc(project.description)}</p>
            <span class="chips">${(project.skills || [])
              .slice(0, 3)
              .map((skill) => `<span class="chip">${esc(skill)}</span>`)
              .join('')}</span>
          </div>
        </div>
      </article>`;
    }

    return `
      <a class="work-card" href="${esc(project.href)}" data-tags="${esc(tags.join(' '))}" data-reveal style="--delay:${(index % 2) * 80}ms">
        <div class="media media--16x9">
          ${img(project.cover, project.title)}
          <span class="work-card__counter" aria-hidden="true">${counter}</span>
        </div>
        <div class="work-card__body">
          <div>
            <span class="work-card__index">
              <span>${esc(project.client)} · ${esc(project.year)}</span>
              <span>${esc(project.role || '')}</span>
            </span>
            <h3>${esc(project.title)}</h3>
            <span class="work-card__cta">View case study
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </div>
          <div>
            <p>${esc(project.description)}</p>
            <span class="chips">${(project.skills || [])
              .slice(0, 3)
              .map((skill) => `<span class="chip">${esc(skill)}</span>`)
              .join('')}</span>
          </div>
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
        <span class="service-card__num">${esc(service.number)}</span>
        <span class="service-card__body">
          <h3>${esc(service.title)}</h3>
          <p>${esc(service.oneliner)}</p>
        </span>
        <span class="service-card__keyword meta" aria-hidden="true">${esc(service.keyword)}</span>
        <span class="service-card__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17 17 7M9 7h8v8"/></svg>
        </span>
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
    // Crossfade: fade the current quote out, swap the copy, fade it back in.
    const panel = textEl.closest('.quote-panel') || textEl.parentElement;
    panel.classList.add('is-swapping');
    const paint = () => {
      textEl.textContent = item.message;
      nameEl.textContent = item.name;
      metaEl.innerHTML = `${esc(item.designation)} · ${esc(item.company)}<span style="display:block;opacity:.7;font-size:.68rem;margin-top:.15rem">${esc(item.period)}</span>`;
      avatarEl.textContent = initials(item.name);
      dots.querySelectorAll('[data-dot]').forEach((dot, i) => dot.setAttribute('aria-current', String(i === at)));
      requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.remove('is-swapping')));
    };
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) paint();
    else setTimeout(paint, 220);
  }

  function auto() {
    clearInterval(timer);
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
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
