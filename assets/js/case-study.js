/**
 * Case study — renders any of the twelve projects from projects.data.js.
 *
 * Three shapes come out of the source site and all three are handled here:
 *   project  long form (summary, problems, goals, personas, process, build, impact)
 *   graphic / amazon  marketing studies with flat sections (cards, sub-items, blocks)
 * and every image is resolved local-first, then remote.
 */
(function () {
  const P = window.PROJECTS;
  const { esc, md, mdInline } = window.SR;
  const id = new URLSearchParams(location.search).get('id');

  const img = (name, alt, cls) =>
    name
      ? `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt || '')}" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ''} />`
      : '';

  const media = (name, alt, ratio) =>
    name
      ? `<figure class="media media--${ratio || '16x9'}">${img(name, alt)}</figure>`
      : '';

  const all = [
    ...P.product.map((project) => ({ ...project, href: `case-study.html?id=${project.id}` })),
    ...Object.values(P.graphic).map((project) => ({ ...project, href: `case-study.html?id=${project.id}` })),
    ...Object.values(P.amazon).map((project) => ({ ...project, href: `case-study.html?id=${project.id}` })),
  ];

  const project = all.find((item) => item.id === id) || all[0];
  if (!project) return;

  document.title = `${project.title} — ${project.client} | Case study`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', project.description || project.title);

  const index = all.indexOf(project);
  const next = all[(index + 1) % all.length];

  function sectionHead(num, title) {
    return `<div class="case-section__head"><div><span class="case-section__num">${num}</span><h2>${title}</h2></div><div>`;
  }

  /* ---- Product (long form) ----------------------------------------------- */
  function productBody(c) {
    const out = [];
    let n = 1;
    const num = () => String(n++).padStart(2, '0');

    if (c.summary.body) {
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), esc(c.summary.title || 'Introduction'))}
            <div class="prose">${md(c.summary.body)}</div>
            ${c.summary.disclaimer ? `<div class="disclaimer">${md(c.summary.disclaimer)}</div>` : ''}
          </div>
        </section>`);
    }

    if (c.problem.cards.length) {
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), esc(c.problem.title))}
            <div class="card-grid">
              ${c.problem.cards
                .map(
                  (card) => `
                <div class="note-card">
                  <h3>${esc(card.heading)}</h3>
                  <div class="note-body">${md(card.body)}</div>
                  ${card.note ? `<div class="note"><strong>${esc(card.noteHeading)}</strong>${mdInline(card.note)}</div>` : ''}
                </div>`,
                )
                .join('')}
            </div>
          </div>
        </section>`);
    }

    if (c.blueprint.image) {
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), esc(c.blueprint.title || 'The blueprint'))}
            ${media(c.blueprint.image, c.blueprint.title, 'flat')}
          </div>
        </section>`);
    }

    if (c.goals.business.length || c.goals.user.length) {
      const list = (items) => `<ul class="tick-list">${items.map((item) => `<li>${mdInline(item)}</li>`).join('')}</ul>`;
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), esc(c.goals.title || 'Goals'))}
            <div class="goals">
              <div class="note-card"><h3>${esc(c.goals.businessTitle)}</h3>${list(c.goals.business)}</div>
              <div class="note-card"><h3>${esc(c.goals.userTitle)}</h3>${list(c.goals.user)}</div>
            </div>
          </div>
        </section>`);
    }

    if (c.users.personas.length) {
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), esc(c.users.title))}
            ${c.users.body ? `<div class="prose">${md(c.users.body)}</div>` : ''}
            <div class="personas" style="margin-top:1.4rem">
              ${c.users.personas
                .map(
                  (persona) => `
                <article class="persona">
                  ${persona.image ? `<div class="media">${img(persona.image, persona.name)}</div>` : ''}
                  <div class="persona__body">
                    <h3>${esc(persona.name)}</h3>
                    <p>${esc(persona.body)}</p>
                  </div>
                </article>`,
                )
                .join('')}
            </div>
          </div>
        </section>`);
    }

    if (c.process.steps.length) {
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), esc(c.process.title))}
            ${c.process.steps
              .map(
                (step) => `
              <div class="step-block">
                ${step.heading ? `<h3>${esc(step.heading)}</h3>` : ''}
                ${step.body ? `<p>${mdInline(step.body)}</p>` : ''}
                ${step.image ? media(step.image, step.heading, '16x9') : ''}
              </div>`,
              )
              .join('')}
          </div>
        </section>`);
    }

    if (c.build.sections.length || c.build.body) {
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), esc(c.build.title || 'The build'))}
            ${c.build.body ? `<div class="prose">${md(c.build.body)}</div>` : ''}
            ${c.build.sections
              .map(
                (part) => `
              <div class="step-block">
                ${part.heading ? `<h3>${esc(part.heading)}</h3>` : ''}
                ${part.body ? `<p>${mdInline(part.body)}</p>` : ''}
                ${part.image ? media(part.image, part.heading, '16x9') : ''}
              </div>`,
              )
              .join('')}
          </div>
        </section>`);
    }

    if (c.impact.body || c.impact.image) {
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), 'Impact')}
            ${c.impact.body ? `<div class="prose">${md(c.impact.body)}</div>` : ''}
            ${c.impact.image ? media(c.impact.image, 'Impact', '16x9') : ''}
          </div>
        </section>`);
    }

    if (c.localisation.body) {
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), 'Adapted for other countries')}
            <div class="prose">${md(c.localisation.body)}</div>
            ${c.localisation.image ? media(c.localisation.image, 'Localisation', '16x9') : ''}
          </div>
        </section>`);
    }

    if (c.expansion.items.length) {
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), esc(c.expansion.title || 'Expansion'))}
            ${c.expansion.items
              .map(
                (item) => `
              <div class="step-block">
                ${item.heading ? `<h3>${esc(item.heading)}</h3>` : ''}
                ${item.body ? `<p>${mdInline(item.body)}</p>` : ''}
                ${item.image ? media(item.image, item.heading, '16x9') : ''}
              </div>`,
              )
              .join('')}
          </div>
        </section>`);
    }

    if (c.learned.items.length) {
      out.push(`
        <section class="case-section">
          ${sectionHead(num(), esc(c.learned.title || 'What we learned'))}
            ${c.learned.items
              .map(
                (item) => `
              <div class="step-block">
                ${item.heading ? `<h3>${esc(item.heading)}</h3>` : ''}
                ${item.body ? `<p>${mdInline(item.body)}</p>` : ''}
              </div>`,
              )
              .join('')}
          </div>
        </section>`);
    }

    return out.join('');
  }

  /* ---- Marketing studies (flat sections) --------------------------------- */
  function sectionBody(sections) {
    return sections
      .map((section, index) => {
        const num = String(index + 1).padStart(2, '0');

        if (section.type === 'challengecards') {
          return `
            <section class="case-section">
              ${sectionHead(num, esc(section.heading))}
                ${section.body ? `<div class="prose">${md(section.body)}</div>` : ''}
                <div class="card-grid">
                  ${section.cards
                    .map((card) => `<div class="note-card"><h3>${esc(card.heading)}</h3><div class="note-body">${md(card.body)}</div></div>`)
                    .join('')}
                </div>
              </div>
            </section>`;
        }

        if (section.type === 'cards') {
          return `
            <section class="case-section">
              ${sectionHead(num, esc(section.heading))}
                <div class="results">
                  ${section.cards
                    .map(
                      (card) => `
                    <div class="result">
                      ${card.tag ? `<span class="tag">${esc(card.tag)}</span>` : ''}
                      <strong>${esc(card.heading)}</strong>
                      <p>${esc(card.body)}</p>
                    </div>`,
                    )
                    .join('')}
                </div>
              </div>
            </section>`;
        }

        /* combination1 / combination2 — body copy, sub-items and image blocks */
        return `
          <section class="case-section">
            ${sectionHead(num, esc(section.heading))}
              ${section.body ? `<div class="prose">${md(section.body)}</div>` : ''}
              ${section.image ? media(section.image, section.heading, '16x9') : ''}
              ${section.items
                .map(
                  (item) => `
                <div class="step-block">
                  ${item.heading ? `<h3>${esc(item.heading)}</h3>` : ''}
                  ${item.body ? `<p>${mdInline(item.body)}</p>` : ''}
                  ${item.image ? media(item.image, item.heading, '16x9') : ''}
                </div>`,
                )
                .join('')}
              ${section.blocks
                .map(
                  (block) => `
                <div class="step-block">
                  ${block.heading ? `<h3>${esc(block.heading)}</h3>` : ''}
                  ${block.body ? `<p>${mdInline(block.body)}</p>` : ''}
                  ${block.image ? media(block.image, block.heading, '16x9') : ''}
                </div>`,
                )
                .join('')}
            </div>
          </section>`;
      })
      .join('');
  }

  /* ---- Page --------------------------------------------------------------- */
  const isProduct = project.kind === 'project';
  const c = project.caseStudy;
  const heroImage = isProduct ? c.hero : project.hero;
  const thanks = isProduct ? c.thanks : project.thanks;

  const facts = [
    project.client && { label: 'Client', value: project.client },
    project.year && { label: 'Year', value: project.year },
    project.role && { label: 'Role', value: project.role },
    project.duration && { label: 'Duration', value: project.duration },
  ].filter(Boolean);

  document.querySelector('[data-case]').innerHTML = `
    <article>
      <header class="case-hero">
        <div class="shell shell--narrow">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="index.html">Home</a> <span aria-hidden="true">/</span>
            <a href="work.html">Work</a> <span aria-hidden="true">/</span>
            <span>${esc(project.client)}</span>
          </nav>
          <p class="eyebrow">${esc(project.kind === 'amazon' ? 'Amazon case study' : project.kind === 'graphic' ? 'Brand & communication' : 'Product case study')}</p>
          <h1>${esc(project.title)}</h1>
          <p class="lede">${esc(project.description || '')}</p>
          ${
            facts.length
              ? `<dl class="factbar">${facts
                  .map((fact) => `<div class="fact"><dt>${esc(fact.label)}</dt><dd>${esc(fact.value)}</dd></div>`)
                  .join('')}</dl>`
              : ''
          }
          ${
            (project.skills || []).length
              ? `<div class="chips" style="margin-top:1.6rem">${project.skills.map((skill) => `<span class="chip">${esc(skill)}</span>`).join('')}</div>`
              : ''
          }
        </div>
        <div class="shell">
          <div class="case-cover">${media(heroImage, project.title, '16x9')}</div>
        </div>
      </header>

      <div class="case-body">
        <div class="shell">${isProduct ? productBody(c) : sectionBody(project.sections)}</div>
      </div>

      ${
        thanks
          ? `<section class="section section--tight"><div class="shell shell--narrow"><div class="band"><p class="eyebrow eyebrow--bare" style="justify-content:center">Thanks for reading</p><h2 style="font-size:clamp(1.3rem,2.6vw,1.9rem)">${esc(thanks)}</h2><div class="row"><a class="btn btn--accent" href="contact.html">Book a Free Call</a><a class="btn btn--ghost" href="work.html">More work</a></div></div></div></section>`
          : ''
      }

      <section class="section section--tight">
        <div class="shell">
          <a class="case-next" href="${esc(next.href)}">
            <span>
              <span class="meta">Next case study</span>
              <h3>${esc(next.title)}</h3>
              <p>${esc(next.client)} · ${esc(next.year)}</p>
            </span>
            <span class="btn btn--ghost btn--sm">Open →</span>
          </a>
        </div>
      </section>
    </article>`;

  /* Progressive enhancement after render: guard the new images, reveal them. */
  document.querySelectorAll('[data-case] img').forEach((element) => {
    element.setAttribute('data-guard', '1');
  });
})();
