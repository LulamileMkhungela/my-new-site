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
        `<button class="filter" type="button" role="tab" data-filter="${esc(filter.tag)}" aria-pressed="${index === 0}">
           ${esc(filter.label)}<span>${filter.count}</span>
         </button>`,
    )
    .join('');

  /* ---- Case-study cards — the reference's image row + 3/5 · 2/5 split --- */
  const grid = document.querySelector('[data-work]');
  grid.innerHTML = all
    .map((project, index) => {
      const counter = `${String(index + 1).padStart(2, '0')} / ${String(all.length).padStart(2, '0')}`;
      return `
      <a class="work-card" href="${esc(project.href)}" data-tags="${esc((project.tags || []).join(' '))}" data-reveal style="--delay:${(index % 2) * 80}ms">
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
    })
    .join('');

  /* ---- Redirect-only cards — compact rows, still a link out ------------- */
  const redirectHost = document.querySelector('[data-redirects]');
  if (redirectHost) {
    redirectHost.innerHTML = WORK.redirects
      .map((project, index) => {
        const media = project.cover
          ? `<div class="media">${img(project.cover, project.title)}</div>`
          : `<div class="redirect-card__plate" aria-hidden="true">
               <span>${esc(project.client)}</span>
               <span>${esc(project.title)}</span>
             </div>`;
        return `
        <a class="archive-card" href="${esc(project.url)}" target="_blank" rel="noopener" data-reveal style="--delay:${(index % 2) * 60}ms">
          ${media}
          <h3>${esc(project.title)}</h3>
          <p>${esc(project.year)} · ${esc(project.urlLabel || 'Live product')} ↗</p>
        </a>`;
      })
      .join('');
  }

  /* ---- Archive ----------------------------------------------------------- */
  const ARCHIVE = WORK.archive || [];
  document.querySelector('[data-archive]').innerHTML = ARCHIVE
    .map(
      (project, index) => `
      <a class="archive-card" href="${esc(project.url)}" target="_blank" rel="noopener"
         data-tags="${esc((project.tags || []).join(' '))}" data-reveal>
        <div class="media">
          ${img(project.cover, project.title)}
          <span class="work-card__counter" aria-hidden="true">${String(index + 1).padStart(2, '0')} / ${String(ARCHIVE.length).padStart(2, '0')}</span>
        </div>
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
    /* Archive cards carry category tags of their own, so they filter like any
       other card rather than vanishing whenever a filter is on. */
    let archiveShown = 0;
    document.querySelectorAll('[data-archive] .archive-card').forEach((element) => {
      element.hidden = tag !== 'all' && !(element.dataset.tags || '').split(' ').includes(tag);
      if (!element.hidden) archiveShown += 1;
    });
    const archiveHead = document.querySelector('[data-archive-head]');
    if (archiveHead) archiveHead.hidden = archiveShown === 0;
    /* Keep the redirect row dimmed-but-present when a filter is on, since the
       cards are not part of the category taxonomy. */

  });
})();
