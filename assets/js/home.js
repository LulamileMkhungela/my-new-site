/** Home — selected work, approach, services and verified endorsements. */
(function () {
  const SITE = window.SITE;
  const { esc, initials } = window.LM;

  document.querySelector('[data-headline]').innerHTML = 'Design the product.<br><em>Build the interface.</em>';
  document.querySelector('[data-roles]').innerHTML = SITE.roles.map((role) => `<span>${esc(role)}</span>`).join('');
  document.querySelector('[data-subline]').textContent = SITE.subline;
  document.querySelector('[data-location]').textContent = `${SITE.location} · ${SITE.availability}`;
  document.querySelector('[data-stats]').innerHTML = SITE.stats.map((stat) => `<div class="stat"><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`).join('');

  const names = SITE.collaborations.map((name) => `<span class="client-name">${esc(name)}</span>`).join('');
  document.querySelector('[data-marquee]').innerHTML = `<div class="marquee__track">${names}${names}</div>`;

  window.ProjectUI.mount(document.querySelector('[data-featured]'), document.querySelector('[data-filters]'));

  document.querySelector('[data-process]').innerHTML = SITE.process.map((step) => `<li data-reveal><span class="n">${esc(step.num)}</span><h3>${esc(step.title)}</h3><p>${esc(step.body)}</p></li>`).join('');
  document.querySelector('[data-services]').innerHTML = SITE.services.map((service, index) => `
    <a class="service-card" href="${esc(service.page)}" data-reveal style="--delay:${index * 60}ms">
      <div class="service-card__body">
        <span class="service-card__num">${esc(service.number)} · ${esc(service.keyword)}</span>
        <h3>${esc(service.title)}</h3><p>${esc(service.oneliner)}</p>
        <span class="chips"><span class="chip">${esc(service.tagline)}</span></span>
      </div>
    </a>`).join('');

  const list = SITE.testimonials;
  let at = 0;
  let timer;
  const textEl = document.querySelector('[data-quote-text]');
  const nameEl = document.querySelector('[data-quote-name]');
  const metaEl = document.querySelector('[data-quote-meta]');
  const avatarEl = document.querySelector('[data-quote-avatar]');
  const dots = document.querySelector('[data-quote-dots]');
  dots.innerHTML = list.map((item, index) => `<button type="button" data-dot="${index}" aria-current="${index === 0}" aria-label="Testimonial from ${esc(item.name)}"></button>`).join('');
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
    timer = setInterval(() => { if (!document.hidden) show(at + 1); }, 10000);
  }
  document.querySelector('[data-quote-prev]').addEventListener('click', () => { show(at - 1); auto(); });
  document.querySelector('[data-quote-next]').addEventListener('click', () => { show(at + 1); auto(); });
  dots.addEventListener('click', (event) => { const dot = event.target.closest('[data-dot]'); if (dot) { show(Number(dot.dataset.dot)); auto(); } });
  const panel = document.querySelector('[data-quote]');
  panel.addEventListener('mouseenter', () => clearInterval(timer));
  panel.addEventListener('mouseleave', auto);
  panel.addEventListener('focusin', () => clearInterval(timer));
  panel.addEventListener('focusout', auto);
  show(0);
  auto();

  document.querySelectorAll('[data-resume]').forEach((link) => { link.href = SITE.resume; link.target = '_blank'; link.rel = 'noopener'; });
})();
