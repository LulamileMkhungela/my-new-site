/**
 * Expertise — renders window.EXPERTISE: the ProdOps block first (it is the one
 * practice area that is also a product I own), then the five areas, the stack
 * and the training list.
 */
(function () {
  const E = window.EXPERTISE;
  const { esc } = window.SR;

  document.querySelector('[data-exp-lede]').textContent = E.intro.lede;
  document.querySelector('[data-exp-stats]').innerHTML = E.intro.stats
    .map((stat) => `<div class="stat"><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`)
    .join('');

  /* ---- ProdOps ------------------------------------------------------------ */
  const f = E.featured;
  document.querySelector('[data-exp-featured]').innerHTML = `
    <div class="prodops__head">
      <div>
        <p class="eyebrow">${esc(f.tag)}</p>
        <h2 class="display-lg">${esc(f.name)}</h2>
        <p class="meta" style="margin-top:0.7rem">${esc(f.role)}</p>
      </div>
      <div class="prodops__actions">
        <a class="btn btn--accent" href="${esc(f.link)}" target="_blank" rel="noopener">${esc(f.linkLabel)}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
        </a>
        <a class="btn btn--ghost" href="${esc(f.repo)}" target="_blank" rel="noopener">Repository</a>
      </div>
    </div>
    <p class="lede" style="max-width:60ch">${esc(f.summary)}</p>
    <div class="card-grid prodops__grid">
      ${f.points
        .map(
          (point) => `
        <div class="note-card">
          <h3>${esc(point.title)}</h3>
          <p>${esc(point.body)}</p>
        </div>`,
        )
        .join('')}
    </div>`;

  /* ---- Areas of practice -------------------------------------------------- */
  document.querySelector('[data-exp-areas]').innerHTML = E.areas
    .map(
      (area) => `
      <article class="exp-row" id="${esc(area.id)}" data-reveal>
        <span class="exp-row__num">${esc(area.number)}</span>
        <div class="exp-row__title">
          <p class="meta">${esc(area.keyword)}</p>
          <h3 class="display-sm">${esc(area.title)}</h3>
          <p class="exp-row__summary">${esc(area.summary)}</p>
          <a class="exp-row__link" href="${esc(area.link)}">See the work
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
        <div class="exp-row__body">
          <ul class="tick-list">${area.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
          <p class="exp-row__proof">${esc(area.proof)}</p>
        </div>
      </article>`,
    )
    .join('');

  /* ---- Stack & training --------------------------------------------------- */
  document.querySelector('[data-exp-stack]').innerHTML = E.stack
    .map((tool) => `<span class="chip">${esc(tool)}</span>`)
    .join('');

  document.querySelector('[data-exp-training]').innerHTML = E.training
    .map(
      (item) => `<li><strong>${esc(item.name)}</strong><span>${esc(item.issuer)}</span></li>`,
    )
    .join('');
})();
