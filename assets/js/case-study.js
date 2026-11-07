/** Case studies rendered from Lulamile's imported public portfolio content. */
(function () {
  const { esc } = window.LM;
  const all = window.PROJECTS;
  const id = new URLSearchParams(location.search).get('id');
  const project = all.find((item) => item.id === id);
  const host = document.querySelector('[data-case]');

  if (!project || !project.sections.length) {
    document.title = 'Project not found | Lulamile Mkhungela';
    host.innerHTML = `<section class="shell notfound"><p class="eyebrow" style="justify-content:center">Work</p><h1>${project ? 'This project opens on my portfolio.' : 'That project is not in this collection.'}</h1><p class="lede" style="margin-inline:auto">${project ? 'ProdOps is an in-progress external project.' : 'The link may be from an older version of the site. The current collection has six projects.'}</p><div class="row" style="justify-content:center;margin-top:1.5rem"><a class="btn btn--accent" href="${project ? esc(project.url) : 'work.html'}"${project ? ' target="_blank" rel="noopener"' : ''}>${project ? 'Open ProdOps' : 'See the work'}</a><a class="btn btn--ghost" href="work.html">All work</a></div></section>`;
    return;
  }

  document.title = `${project.title} | Lulamile Mkhungela`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', project.description);
  const index = all.indexOf(project);
  const next = all[(index + 1) % all.length];
  const img = (image) => `<figure class="case-figure"><div class="media media--flat"><img src="${window.asset(image.src)}" alt="${esc(image.alt || project.title)}" loading="lazy" decoding="async"></div>${image.caption ? `<figcaption>${esc(image.caption)}</figcaption>` : ''}</figure>`;

  function sectionBody(section) {
    return `
      ${section.paragraphs.map((paragraph) => `<div class="prose"><p>${esc(paragraph)}</p></div>`).join('')}
      ${section.cards.length ? `<div class="card-grid">${section.cards.map((card) => `
        <article class="note-card">
          ${card.label ? `<span class="case-section__num">${esc(card.label)}</span>` : ''}
          <h3>${esc(card.title)}</h3>
          ${card.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}
          ${card.items.length ? `<ul class="tick-list">${card.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
          ${card.tradeoff ? `<p class="tradeoff"><strong>Trade-off:</strong> ${esc(card.tradeoff)}</p>` : ''}
        </article>`).join('')}</div>` : ''}
      ${section.steps.length ? `<ol class="case-steps">${section.steps.map((step, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(step.title)}</h3>${step.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</div></li>`).join('')}</ol>` : ''}
      ${section.results.length ? `<div class="results">${section.results.map((result) => `<article class="result"><strong>${esc(result.title)}</strong>${result.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</article>`).join('')}</div>` : ''}
      ${section.images.length ? `<div class="case-gallery">${section.images.map(img).join('')}</div>` : ''}`;
  }

  const order = ['overview', 'problem', 'role', 'goals', 'personas', 'research', 'process', 'decisions', 'impact', 'live', 'work', 'outcomes', 'tradeoffs', 'vodacom-internal', 'checks', 'conclusion'];
  const sections = [...project.sections].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const facts = [
    { label: 'Client', value: project.client },
    { label: 'My role', value: project.role },
    { label: 'Location', value: project.location },
    { label: 'Year / status', value: `${project.year} · ${project.status}` },
  ];

  host.innerHTML = `
    <article>
      <header class="case-hero">
        <div class="shell shell--narrow">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="work.html">Work</a><span aria-hidden="true">/</span><span>${esc(project.category)}</span></nav>
          <p class="eyebrow">${esc(project.category)} · ${esc(project.subtitle)}</p>
          <h1>${esc(project.title)}</h1>
          <p class="lede">${esc(project.summary || project.description)}</p>
          <dl class="factbar">${facts.map((fact) => `<div class="fact"><dt>${esc(fact.label)}</dt><dd>${esc(fact.value)}</dd></div>`).join('')}</dl>
          <div class="chips" style="margin-top:1.4rem">${project.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}</div>
          <div class="row" style="margin-top:1.5rem">
            ${project.liveUrl ? `<a class="btn btn--accent btn--sm" href="${esc(project.liveUrl)}" target="_blank" rel="noopener">Open live product ↗</a>` : ''}
            <a class="btn btn--ghost btn--sm" href="${esc(project.sourceUrl)}" target="_blank" rel="noopener">Read on my portfolio ↗</a>
          </div>
        </div>
        ${project.cover ? `<div class="shell"><div class="case-cover"><div class="media media--16x9"><img src="${window.asset(project.cover)}" alt="${esc(project.title)} overview" fetchpriority="high"></div></div></div>` : ''}
      </header>
      <div class="case-body"><div class="shell">
        ${sections.map((section, i) => `
          <section class="case-section${section.id === 'checks' ? ' case-section--evidence' : ''}" id="${esc(section.id)}">
            <div class="case-section__intro"><span class="case-section__num">${String(i + 1).padStart(2, '0')} · ${esc(section.kicker)}</span><h2>${esc(section.title)}</h2></div>
            ${sectionBody(section)}
          </section>`).join('')}
      </div></div>
      <section class="section section--tight"><div class="shell"><div class="band">
        <p class="eyebrow eyebrow--bare" style="justify-content:center">Work with me</p>
        <h2>Need this kind of thinking on your product?</h2>
        <p>I’m Lulamile Mkhungela — based in Johannesburg, working remotely. Let’s talk about the problem before the screen.</p>
        <div class="row"><a class="btn btn--accent" href="contact.html">Start a conversation</a><a class="btn btn--ghost" href="work.html">More work</a></div>
      </div></div></section>
      <section class="section section--tight"><div class="shell"><a class="case-next" href="${esc(next.url)}"${/^https?:/.test(next.url) ? ' target="_blank" rel="noopener"' : ''}><span><span class="meta">Next project</span><h3>${esc(next.title)}</h3><p>${esc(next.category)} · ${esc(next.location)}</p></span><span class="btn btn--ghost btn--sm">Open →</span></a></div></section>
    </article>`;
})();
