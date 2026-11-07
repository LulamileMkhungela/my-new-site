/**
 * Home — original my-new-site hero, client marquee, featured work, process,
 * services and testimonials. Content comes from window.SITE and window.PROJECTS.
 */
(function () {
  const SITE = window.SITE;
  const { esc, initials } = window.LM;
  const img = (name, alt, cls) =>
    `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt)}" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ''} />`;

  /* ---- Hero --------------------------------------------------------------- */
  document.querySelector('[data-headline]').innerHTML = 'Design the product.<br><em>Build the interface.</em>';
  document.querySelector('[data-roles]').innerHTML = SITE.roles.map((role) => `<span>${esc(role)}</span>`).join('');
  document.querySelector('[data-subline]').textContent = SITE.subline;
  document.querySelector('[data-location]').textContent = `${SITE.location} · ${SITE.availability}`;
  document.querySelector('[data-stats]').innerHTML = SITE.stats
    .map((stat) => `<div class="stat"><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`)
    .join('');

  /* ---- Client marquee (two passes so the loop is seamless) ---------------- */
  const names = SITE.collaborations.map((name) => `<span class="client-name">${esc(name)}</span>`).join('');
  document.querySelector('[data-marquee]').innerHTML = `<div class="marquee__track">${names}${names}</div>`;

  /* ---- Featured work, grouped by source category -------------------------- */
  window.ProjectUI.mount(document.querySelector('[data-featured]'), document.querySelector('[data-filters]'));

  /* ---- Resources in the original archive-card list ------------------------ */
  document.querySelector('[data-archive]').innerHTML = [
    { href: 'resources.html#toolkit', tint: 'tint-lavender', title: 'My toolkit', body: 'Eight free tools, grouped by the job they do.' },
    { href: 'resources.html#prompts', tint: 'tint-peach', title: 'AI design prompts', body: 'Ten free prompts to copy; five paid packs on Selar.' },
    { href: 'resources.html#reading', tint: 'tint-sky', title: 'Reading list', body: 'Credited 90n packs and guides, plus Lantern.' },
  ].map((item) => `
    <a class="archive-card" href="${item.href}" data-reveal>
      <div class="media ${item.tint}" aria-hidden="true"></div>
      <div><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></div>
    </a>`).join('');

  /* ---- Process ------------------------------------------------------------ */
  document.querySelector('[data-process]').innerHTML = SITE.process
    .map((step) => `
      <li data-reveal>
        <span class="n">${esc(step.num)}</span>
        <h3>${esc(step.title)}</h3>
        <p>${esc(step.body)}</p>
      </li>`)
    .join('');

  /* ---- Services ----------------------------------------------------------- */
  document.querySelector('[data-services]').innerHTML = SITE.services
    .map((service, index) => `
      <a class="service-card" href="${esc(service.page)}" data-reveal style="--delay:${index * 70}ms">
        <div class="media media--16x9">${img(service.image, service.title)}</div>
        <div class="service-card__body">
          <span class="service-card__num">${esc(service.number)} · ${esc(service.keyword)}</span>
          <h3>${esc(service.title)}</h3>
          <p>${esc(service.oneliner)}</p>
          <span class="chips"><span class="chip">${esc(service.tagline)}</span></span>
        </div>
      </a>`)
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
    .map((item, index) => `<button type="button" role="tab" data-dot="${index}" aria-current="${index === 0}" aria-label="Testimonial from ${esc(item.name)}"></button>`)
    .join('');

  function show(index) {
    at = (index + list.length) % list.length;
    const item = list[at];
    textEl.textContent = `“${item.message}”`;
    nameEl.textContent = item.name;
    metaEl.textContent = `${item.designation} · ${item.company}`;
    avatarEl.textContent = initials(item.name);
    dots.querySelectorAll('[data-dot]').forEach((dot, i) => dot.setAttribute('aria-current', String(i === at)));
  }

  function auto() {
    clearInterval(timer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => show(at + 1), 9000);
  }

  document.querySelector('[data-quote-prev]').addEventListener('click', () => { show(at - 1); auto(); });
  document.querySelector('[data-quote-next]').addEventListener('click', () => { show(at + 1); auto(); });
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
