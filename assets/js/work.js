/** Work — the six public desktop projects, grouped by their source categories. */
(function () {
  const projects = window.PROJECTS;
  const { esc } = window.LM;
  document.querySelector('[data-work-stats]').innerHTML = [
    { value: projects.length, label: 'Selected projects' },
    ...window.SITE.categories.map((category) => ({ value: projects.filter((p) => p.category === category.id).length, label: category.label })),
  ].map((stat) => `<div class="stat"><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`).join('');
  window.ProjectUI.mount(document.querySelector('[data-work]'), document.querySelector('[data-filters]'));
})();
