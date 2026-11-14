/**
 * Merge the generated source data (projects.data.js) with the work added later
 * (extra.data.js), so every page sees one list.
 *
 *   window.WORK.all         every card, in display order — this is the *only*
 *                           list the home and work pages render
 *   window.WORK.featured    the inline cards: studies + link-outs + apps
 *   window.WORK.archive     the Behance grid at the end of the section
 *   window.WORK.studies     the ones that open case-study.html
 *   window.WORK.redirects   the ones that are a link out, nothing more
 *   window.WORK.filters     the filter set, with counts computed from the list
 *
 * The reference renders one flat list, then splits it by *card family*, not by
 * position: case studies carry a full-width card with a cover and a `NN / NN`
 * counter, Amazon/commerce work the same, and everything from the Behance
 * archive arrays becomes a smaller card in a two-column grid under an "Earlier"
 * heading. Both families share one counter total — the reference's 5 inline
 * cards are numbered `01 / 11` … `05 / 11`, then its six archive cards restart
 * at `01 / 06`. So adding a card must not renumber the archive, and turning a
 * card into an archive card must not close the gap in the inline numbers.
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

  /* Card families, in the reference's order: case studies, then the graphic and
     Amazon work, then the link-outs. Everything here is an inline card. */
  const featured = [
    ...product.map((p) => ({ ...p, href: href(p) })),
    ...passes.map((p) => ({ ...p, href: href(p) })),
    ...redirects,
  ];

  /* The Behance array is its own family: a smaller card in a two-column grid,
     with its own counter that restarts at 01. */
  const archive = (P.archive || []).map((project) => ({ ...project, isArchive: true }));

  const all = [...featured, ...archive];

  /* Counts come from the list, so adding a project cannot leave a stale badge.
     The archive counts too — the reference's "All 11" includes its six archive
     cards, even though they render in a separate grid. */
  const base = window.SITE && window.SITE.filters ? window.SITE.filters : [];
  const filters = base.map((filter) => ({
    ...filter,
    count:
      filter.tag === 'all'
        ? all.length
        : all.filter((project) => (project.tags || []).includes(filter.tag)).length,
  }));

  window.WORK = { all, featured, studies, redirects, filters, product, archive };
})();
