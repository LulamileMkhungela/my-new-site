/**
 * Merge the generated source data (projects.data.js) with the work added later
 * (extra.data.js), so every page sees one list.
 *
 *   window.WORK.all         every study, redirect card and pass-through, in
 *                           display order: product → added studies → graphic →
 *                           amazon → redirects → archive
 *   window.WORK.studies     the ones that open case-study.html
 *   window.WORK.redirects   the ones that are a link out, nothing more
 *   window.WORK.filters     the filter set, with counts computed from the list
 *
 * Projects from the source data keep their shape; added entries carry
 * `kind: 'project' | 'redirect'` plus an optional `url`.
 */
(function () {
  const P = window.PROJECTS || {};
  const X = window.EXTRA || { caseStudies: [], redirects: [] };

  const href = (project) => `case-study.html?id=${project.id}`;

  const product = [
    ...(P.product || []),
    ...X.caseStudies,
  ];

  const passes = [
    ...Object.values(P.graphic || {}),
    ...Object.values(P.amazon || {}),
  ];

  const redirects = (X.redirects || []).map((project) => ({ ...project, href: project.url }));

  const studies = [...product, ...passes].map((project) => ({
    ...project,
    href: project.href || href(project),
  }));

  const all = [...product.map((p) => ({ ...p, href: href(p) })), ...passes.map((p) => ({ ...p, href: href(p) })), ...redirects];

  /* Counts come from the list, so adding a project cannot leave a stale badge. */
  const base = window.SITE && window.SITE.filters ? window.SITE.filters : [];
  const filters = base.map((filter) => ({
    ...filter,
    count:
      filter.tag === 'all'
        ? all.length
        : all.filter((project) => (project.tags || []).includes(filter.tag)).length,
  }));

  window.WORK = { all, studies, redirects, filters, product, archive: P.archive || [] };
})();
