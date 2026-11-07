/**
 * Services — original my-new-site two-column case-section layout, with
 * Lulamile's offerings, deliverables and questions.
 */
(function () {
  const SITE = window.SITE;
  const { esc } = window.LM;

  const img = (name, alt) =>
    `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt)}" loading="lazy" decoding="async" />`;

  const offerings = (items) => items.map((item) => `
    <div class="note-card">
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
      <div class="chips" style="margin-top:0.8rem">${item.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}</div>
      <div class="note">
        <strong>What you get</strong>
        <ul class="tick-list" style="margin-top:0.3rem">${item.deliverables.map((deliverable) => `<li>${esc(deliverable)}</li>`).join('')}</ul>
      </div>
      <p style="margin-top:0.9rem;font-size:0.82rem"><strong style="color:hsl(var(--fg))">Best for:</strong> ${esc(item.bestFor)}</p>
      <p style="font-size:0.82rem"><strong style="color:hsl(var(--fg))">Outcome:</strong> ${esc(item.outcome)}</p>
    </div>`).join('');

  document.querySelector('[data-services]').innerHTML = SITE.services.map((service, index) => `
    <section class="case-section" id="${esc(service.id)}">
      <div class="case-section__head">
        <div>
          <span class="case-section__num">${esc(service.number)}</span>
          <h2>${esc(service.title)}</h2>
          <p class="meta" style="margin-top:0.8rem">${esc(service.keyword)}</p>
        </div>
        <div>
          <p class="lede">${esc(service.oneliner)}</p>
          <div class="media media--16x9" style="margin-top:1.4rem">${img(service.image, service.title)}</div>
          <h3 class="sub-heading">What I offer</h3>
          <div class="card-grid">${offerings(service.offerings)}</div>
          <h3 class="sub-heading">Questions people ask</h3>
          <div class="faq">
            ${service.faqs.map((item, i) => `<details${i === 0 && index === 0 ? ' open' : ''}><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join('')}
            <div class="row" style="margin-top:1.4rem">
              <a class="btn btn--accent btn--sm" href="contact.html">Book a call about ${esc(service.keyword.toLowerCase())}</a>
              ${index === 0 ? '<a class="btn btn--ghost btn--sm" href="resources.html">See the resources</a>' : ''}
            </div>
          </div>
        </div>
      </div>
    </section>`).join('');

  const seen = new Set();
  const pool = SITE.services.flatMap((service) => service.faqs).filter((item) => { if (seen.has(item.q)) return false; seen.add(item.q); return true; });
  document.querySelector('[data-faq]').innerHTML = pool.map((item) => `<details><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join('');
})();
