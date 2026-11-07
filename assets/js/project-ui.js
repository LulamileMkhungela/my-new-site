/** Shared project cards and category filters, using the original my-new-site card UI. */
(function () {
  const { esc } = window.LM;
  const projects = () => window.PROJECTS || [];
  const categories = () => window.SITE.categories;

  const img = (name, alt) =>
    `<img data-asset="${esc(name || alt)}" src="${name ? window.asset(name) : window.placeholderImage(alt)}" alt="${esc(alt)}" loading="lazy" decoding="async" />`;

  function card(project, index, total) {
    const external = /^https?:/.test(project.url);
    const tags = project.tags || [];
    return `
      <a class="work-card" href="${esc(project.url)}"${external ? ' target="_blank" rel="noopener"' : ''} data-category="${esc(project.category)}" data-reveal style="--delay:${(index % 2) * 60}ms">
        <div class="media media--16x9">${img(project.cover, project.title)}</div>
        <div class="work-card__body">
          <span class="work-card__index">
            <span>${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
            <span>${esc(project.client)}</span>
          </span>
          <h3>${esc(project.title)}</h3>
          <p>${esc(project.description)}</p>
          <span class="chips">${tags.slice(0, 4).map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}</span>
          <span class="work-card__foot">
            <span>${esc(project.year)}${project.status ? ` · ${esc(project.status)}` : ''}</span>
            <span class="work-card__cta">${external ? 'Open project' : 'View case study'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
            </span>
          </span>
        </div>
      </a>`;
  }

  function groups(host, list) {
    let index = 0;
    host.innerHTML = categories().map((category) => {
      const items = list.filter((project) => project.category === category.id);
      if (!items.length) return '';
      const cards = items.map((project) => card(project, index++, list.length)).join('');
      return `
        <section class="project-group" data-project-group="${esc(category.id)}" aria-labelledby="group-${esc(category.id)}-${esc(host.dataset.workKind || 'work')}">
          <div class="between">
            <div>
              <p class="eyebrow">${esc(category.label)} · ${items.length}</p>
              <h3 class="display-md" id="group-${esc(category.id)}-${esc(host.dataset.workKind || 'work')}">${esc(category.label)}</h3>
            </div>
            <p>${esc(category.description)}</p>
          </div>
          <div class="work-grid work-grid--feature">${cards}</div>
        </section>`;
    }).join('');
  }

  function mount(host, filterHost, list = projects()) {
    groups(host, list);
    const counts = categories().map((category) => ({ ...category, count: list.filter((p) => p.category === category.id).length }));
    if (filterHost) {
      filterHost.innerHTML = [{ id: 'all', label: 'All', count: list.length }, ...counts]
        .map((item, index) => `<button class="filter" type="button" data-filter="${esc(item.id)}" aria-pressed="${index === 0}">${esc(item.label)}<span>${item.count}</span></button>`).join('');
      filterHost.addEventListener('click', (event) => {
        const button = event.target.closest('[data-filter]');
        if (!button) return;
        const selected = button.dataset.filter;
        filterHost.querySelectorAll('[data-filter]').forEach((el) => el.setAttribute('aria-pressed', String(el === button)));
        host.querySelectorAll('[data-project-group]').forEach((group) => { group.hidden = selected !== 'all' && group.dataset.projectGroup !== selected; });
        const status = document.querySelector('[data-work-status]');
        if (status) status.textContent = selected === 'all' ? `Showing all ${list.length} projects.` : `Showing ${counts.find((c) => c.id === selected)?.count || 0} ${selected} projects.`;
      });
    }
  }
  window.ProjectUI = { card, mount, categories };
})();
