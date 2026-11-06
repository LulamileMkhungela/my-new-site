/**
 * Work — the full portfolio index with the source site's category filters.
 */
(function () {
  const SITE = window.SITE;
  const P = window.PROJECTS;
  const { esc } = window.SR;

  const all = [
    ...P.product.map((project) => ({ ...project, href: `case-study.html?id=${project.id}` })),
    ...Object.values(P.graphic).map((project) => ({ ...project, href: `case-study.html?id=${project.id}` })),
    ...Object.values(P.amazon).map((project) => ({ ...project, href: `case-study.html?id=${project.id}` })),
  ];

  const img = (name, alt) =>
    `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt)}" loading="lazy" decoding="async" />`;

  const filters = document.querySelector('[data-filters]');
  filters.innerHTML = SITE.filters
    .map(
      (filter, index) =>
        `<button class="filter" type="button" data-filter="${esc(filter.tag)}" aria-pressed="${index === 0}">
           ${esc(filter.label)}<span>${filter.count}</span>
         </button>`,
    )
    .join('');

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

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const tag = button.dataset.filter;
    filters.querySelectorAll('[data-filter]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    const count = [...grid.querySelectorAll('.work-card')].filter((element) => {
      const match = tag === 'all' || (element.dataset.tags || '').split(' ').includes(tag);
      element.hidden = !match;
      return match;
    }).length;
    if (!count) grid.innerHTML = '<p class="lede">Nothing in this category yet.</p>';
  });
})();
