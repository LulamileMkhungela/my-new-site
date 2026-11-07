/** Case studies — original my-new-site case layout, rendered from Lulamile's imported projects. */
(function () {
  const P = window.PROJECTS;
  const { esc } = window.LM;
  const id = new URLSearchParams(location.search).get('id');
  const project = P.find((item) => item.id === id);
  const host = document.querySelector('[data-case]');

  if (!project || !project.sections.length) {
    document.title = 'Project not found | Lulamile Mkhungela';
    host.innerHTML = `<section class="shell notfound"><p class="eyebrow" style="justify-content:center">Work</p><h1>${project ? 'This project opens on my portfolio.' : 'That project is not in this collection.'}</h1><p class="lede" style="margin-inline:auto">${project ? 'ProdOps is an in-progress external project.' : 'The link may be from an older version of the site. The current collection has six projects.'}</p><div class="row" style="justify-content:center;margin-top:1.5rem"><a class="btn btn--accent" href="${project ? esc(project.url) : 'work.html'}"${project ? ' target="_blank" rel="noopener"' : ''}>${project ? 'Open ProdOps' : 'See the work'}</a><a class="btn btn--ghost" href="work.html">All work</a></div></section>`;
    return;
  }

  document.title = `${project.title} — ${project.client} | Case study`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', project.description || project.title);
  const index = P.indexOf(project);
  const next = P[(index + 1) % P.length];

  const img = (name, alt, cls) => name
    ? `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt || '')}" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ''} />`
    : '';
  const media = (name, alt, ratio) => name ? `<figure class="media media--${ratio || '16x9'}">${img(name, alt)}</figure>` : '';

  function sectionHead(num, title) {
    return `<div class="case-section__head"><div><span class="case-section__num">${num}</span><h2>${title}</h2></div><div>`;
  }

  function sectionBody(section) {
    const out = [];
    if (section.paragraphs.length) {
      out.push(`<div class="${section.id === 'checks' ? 'disclaimer' : 'prose'}">${section.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`);
    }
    if (section.cards.length) {
      out.push(`<div class="card-grid">${section.cards.map((card) => `
        <div class="note-card">
          ${card.label ? `<span class="case-section__num">${esc(card.label)}</span>` : ''}
          <h3>${esc(card.title)}</h3>
          ${card.body.map((p) => `<p>${esc(p)}</p>`).join('')}
          ${card.items.length ? `<ul class="tick-list">${card.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
          ${card.tradeoff ? `<div class="note"><strong>Trade-off</strong><p>${esc(card.tradeoff)}</p></div>` : ''}
        </div>`).join('')}</div>`);
    }
    if (section.steps.length) {
      out.push(section.steps.map((step, i) => `
        <div class="step-block">
          <h3>${String(i + 1).padStart(2, '0')} · ${esc(step.title)}</h3>
          ${step.body.map((p) => `<p>${esc(p)}</p>`).join('')}
        </div>`).join(''));
    }
    if (section.results.length) {
      out.push(`<div class="results">${section.results.map((result) => `
        <div class="result">
          <strong>${esc(result.title)}</strong>
          ${result.body.map((p) => `<p>${esc(p)}</p>`).join('')}
        </div>`).join('')}</div>`);
    }
    if (section.images.length) {
      out.push(`<div class="case-gallery">${section.images.map((image) => `
        <figure class="case-figure">
          ${media(image.src, image.alt || project.title, 'flat')}
          ${image.caption ? `<figcaption>${esc(image.caption)}</figcaption>` : ''}
        </figure>`).join('')}</div>`);
    }
    return out.join('');
  }

  const order = ['overview', 'problem', 'role', 'goals', 'personas', 'research', 'process', 'decisions', 'impact', 'live', 'work', 'outcomes', 'tradeoffs', 'vodacom-internal', 'checks', 'conclusion'];
  const sections = [...project.sections].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const facts = [
    { label: 'Client', value: project.client },
    { label: 'Year', value: project.year },
    { label: 'Role', value: project.role },
    { label: 'Location', value: project.location },
  ];

  host.innerHTML = `
    <article>
      <header class="case-hero">
        <div class="shell shell--narrow">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> <span aria-hidden="true">/</span> <a href="work.html">Work</a> <span aria-hidden="true">/</span> <span>${esc(project.category)}</span></nav>
          <p class="eyebrow">${esc(project.category)} case study · ${esc(project.subtitle)}</p>
          <h1>${esc(project.title)}</h1>
          <p class="lede">${esc(project.summary || project.description)}</p>
          <dl class="factbar">${facts.map((fact) => `<div class="fact"><dt>${esc(fact.label)}</dt><dd>${esc(fact.value)}</dd></div>`).join('')}</dl>
          <div class="chips" style="margin-top:1.6rem">${project.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}<span class="chip">${esc(project.status)}</span></div>
          <div class="row" style="margin-top:1.5rem">
            ${project.liveUrl ? `<a class="btn btn--accent btn--sm" href="${esc(project.liveUrl)}" target="_blank" rel="noopener">Open live product ↗</a>` : ''}
            <a class="btn btn--ghost btn--sm" href="${esc(project.sourceUrl)}" target="_blank" rel="noopener">Read on my portfolio ↗</a>
          </div>
        </div>
        <div class="shell"><div class="case-cover">${media(project.cover, project.title, '16x9')}</div></div>
      </header>

      <div class="case-body"><div class="shell">
        ${sections.map((section, i) => `
          <section class="case-section" id="${esc(section.id)}">
            ${sectionHead(String(i + 1).padStart(2, '0'), esc(section.title))}
              ${sectionBody(section)}
            </div>
          </section>`).join('')}
      </div></div>

      <section class="section section--tight"><div class="shell shell--narrow"><div class="band">
        <p class="eyebrow eyebrow--bare" style="justify-content:center">Thanks for reading</p>
        <h2 style="font-size:clamp(1.3rem,2.6vw,1.9rem)">Need this kind of thinking on your product?</h2>
        <div class="row"><a class="btn btn--accent" href="contact.html">Book a Free Call</a><a class="btn btn--ghost" href="work.html">More work</a></div>
      </div></div></section>

      <section class="section section--tight"><div class="shell">
        <a class="case-next" href="${esc(next.url)}"${/^https?:/.test(next.url) ? ' target="_blank" rel="noopener"' : ''}>
          <span><span class="meta">Next case study</span><h3>${esc(next.title)}</h3><p>${esc(next.client)} · ${esc(next.year)}</p></span>
          <span class="btn btn--ghost btn--sm">Open →</span>
        </a>
      </div></section>
    </article>`;

  document.querySelectorAll('[data-case] img').forEach((element) => element.setAttribute('data-guard', '1'));
})();
