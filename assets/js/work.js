/**
 * Work — the full portfolio index: studies that open a case-study page, live
 * products that are a redirect only, and the earlier archive.
 *
 * The list comes from window.WORK (projects.data.js + extra.data.js), so a
 * study added to either file appears here without touching this script.
 */
(function () {
  const WORK = window.WORK;
  const P = window.PROJECTS;
  const { esc } = window.SR;

  const img = (name, alt) =>
    name
      ? `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt)}" loading="lazy" decoding="async" />`
      : '';

  const all = WORK.studies.filter((project) => project.cover);

  /* ---- Stats, counted rather than typed ---------------------------------- */
  const statsHost = document.querySelector('[data-work-stats]');
  if (statsHost) {
    const stats = [
      { value: String(WORK.studies.length), label: 'Case studies' },
      { value: String(WORK.redirects.length), label: 'Live products' },
      { value: String(P.archive.length), label: 'Earlier projects' },
      { value: String((window.SITE.logos || []).length), label: 'Client logos' },
    ];
    statsHost.innerHTML = stats
      .map((stat) => `<div class="stat"><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`)
      .join('');
  }

  /* ---- Filters ----------------------------------------------------------- */
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

  /* ---- Case-study cards --------------------------------------------------- */
  const grid = document.querySelector('[data-work]');
  grid.innerHTML = all
    .map(
      (project, index) => `
      <a class="work-card" href="${esc(project.href)}" data-tags="${esc((project.tags || []).join(' '))}" data-reveal style="--delay:${(index % 2) * 60}ms">
        <div class="media media--16x9">${img(project.cover, project.title)}</div>
        <div class="work-card__body">
          <span class="work-card__index">
            <span>${String(index + 1).padStart(2, '0')} / ${String(all.length).padStart(2, '0')}</span>
            <span>${esc(project.client)} · ${esc(project.year)}</span>
          </span>
          <h3>${esc(project.title)}</h3>
          <p>${esc(project.description)}</p>
          <span class="chips">${(project.skills || []).slice(0, 4).map((skill) => `<span class="chip">${esc(skill)}</span>`).join('')}</span>
          <span class="work-card__foot">
            <span>${esc(project.role || project.kind)}</span>
            <span class="work-card__cta">View case study
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
            </span>
          </span>
        </div>
      </a>`,
    )
    .join('');

  /* ---- Redirect-only cards ------------------------------------------------ */
  const redirectHost = document.querySelector('[data-redirects]');
  if (redirectHost) {
    const note = WORK.redirects.filter((project) => project.cover).length
      ? 'Opens the live product in a new tab.'
      : '';
    redirectHost.innerHTML = WORK.redirects
      .map((project, index) => {
        /* No cover for ProdOps: the card leads with the name instead, rather
           than borrowing a screenshot that would misdescribe it. */
        const media = project.cover
          ? `<div class="media media--16x9">${img(project.cover, project.title)}</div>`
          : `<div class="redirect-card__plate" aria-hidden="true">
               <span>${esc(String(index + 1).padStart(2, '0'))}</span>
               <span>${esc(project.title)}</span>
             </div>`;
        return `
        <a class="work-card work-card--redirect" href="${esc(project.url)}" target="_blank" rel="noopener" data-reveal style="--delay:${(index % 2) * 60}ms">
          ${media}
          <div class="work-card__body">
            <span class="work-card__index">
              <span>Live product</span>
              <span>${esc(project.client)} · ${esc(project.year)}</span>
            </span>
            <h3>${esc(project.title)}</h3>
            <p>${esc(project.description)}</p>
            <span class="chips">${(project.skills || []).slice(0, 4).map((skill) => `<span class="chip">${esc(skill)}</span>`).join('')}</span>
            <span class="work-card__foot">
              <span>${esc(project.role || project.kind)}</span>
              <span class="work-card__cta">${esc(project.urlLabel || 'Open the live product')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
              </span>
            </span>
          </div>
        </a>`;
      })
      .join('');
    if (note) redirectHost.setAttribute('aria-description', note);
  }

  /* ---- Archive ----------------------------------------------------------- */
  document.querySelector('[data-archive]').innerHTML = P.archive
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

  /* ---- Filtering --------------------------------------------------------- */
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const tag = button.dataset.filter;
    filters
      .querySelectorAll('[data-filter]')
      .forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    grid.querySelectorAll('.work-card').forEach((element) => {
      const match = tag === 'all' || (element.dataset.tags || '').split(' ').includes(tag);
      element.hidden = !match;
    });
    /* Redirect cards are not part of the filter, so they only show on "All". */
    redirectHost?.querySelectorAll('.work-card').forEach((element) => {
      element.hidden = tag !== 'all';
    });
    document.querySelectorAll('[data-archive] .archive-card').forEach((element) => {
      element.hidden = tag !== 'all';
    });
  });
})();
