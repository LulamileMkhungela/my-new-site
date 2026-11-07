/** Shared project cards and category filters. Counts come from the imported data. */
(function () {
  const { esc } = window.LM;
  const projects = () => window.PROJECTS || [];
  const categories = () => window.SITE.categories;

  function card(project, index) {
    const external = /^https?:/.test(project.url);
    const cover = project.cover
      ? `<div class="media media--16x9"><img data-asset="${esc(project.cover)}" src="${window.asset(project.cover)}" alt="${esc(project.title)} — project preview" loading="lazy" decoding="async"></div>`
      : `<div class="project-cover project-cover--text" aria-hidden="true"><span>PO</span><strong>${esc(project.title)}</strong><small>${esc(project.subtitle)}</small></div>`;
    return `
      <a class="work-card" href="${esc(project.url)}"${external ? ' target="_blank" rel="noopener"' : ''} data-category="${esc(project.category)}" data-reveal style="--delay:${(index % 2) * 60}ms">
        ${cover}
        <div class="work-card__body">
          <span class="work-card__index"><span>${esc(project.category)} · ${esc(project.location)}</span><span class="status-dot ${project.status === 'In progress' ? 'status-dot--wip' : ''}">${esc(project.status)}</span></span>
          <h3>${esc(project.title)}</h3>
          <p>${esc(project.description)}</p>
          <span class="chips">${project.tags.slice(0, 3).map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}</span>
          <span class="work-card__foot"><span>${esc(project.year)}</span><span class="work-card__cta">${external ? 'Open project' : 'View case study'} <span aria-hidden="true">↗</span></span></span>
        </div>
      </a>`;
  }

  function groups(host, list) {
    host.innerHTML = categories().map((category) => {
      const items = list.filter((project) => project.category === category.id);
      if (!items.length) return '';
      return `
        <section class="project-group" data-project-group="${esc(category.id)}" aria-labelledby="group-${esc(category.id)}-${esc(host.dataset.workKind || 'work')}">
          <div class="project-group__head">
            <div><p class="eyebrow">${esc(category.label)} · ${items.length}</p><h3 class="display-md" id="group-${esc(category.id)}-${esc(host.dataset.workKind || 'work')}">${esc(category.label)}</h3></div>
            <p>${esc(category.description)}</p>
          </div>
          <div class="work-grid work-grid--feature">${items.map(card).join('')}</div>
        </section>`;
    }).join('');
  }

  function mount(host, filterHost, list = projects()) {
    groups(host, list);
    const counts = categories().map((category) => ({ ...category, count: list.filter((p) => p.category === category.id).length }));
    if (filterHost) {
      filterHost.innerHTML = [{ id: 'all', label: 'All work', count: list.length }, ...counts]
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
