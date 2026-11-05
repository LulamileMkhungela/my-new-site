/**
 * Services — the four areas of work, each with its offerings, audience, and
 * the questions people ask before they get in touch.
 */
(function () {
  const SITE = window.SITE;
  const { esc, mdInline } = window.SR;

  const img = (name, alt) =>
    `<img data-asset="${esc(name)}" src="${window.asset(name)}" alt="${esc(alt)}" loading="lazy" decoding="async" />`;

  const offerings = (items) =>
    items
      .map(
        (item) => `
      <div class="note-card">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.description)}</p>
        <div class="chips" style="margin-top:0.8rem">${item.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}</div>
        <div class="note">
          <strong>What you get</strong>
          <ul class="tick-list" style="margin-top:0.3rem">
            ${item.deliverables.map((deliverable) => `<li>${esc(deliverable)}</li>`).join('')}
          </ul>
        </div>
        <p style="margin-top:0.9rem;font-size:0.82rem"><strong style="color:hsl(var(--fg))">Best for:</strong> ${esc(item.bestFor)}</p>
        <p style="font-size:0.82rem"><strong style="color:hsl(var(--fg))">Outcome:</strong> ${esc(item.outcome)}</p>
      </div>`,
      )
      .join('');

  document.querySelector('[data-services]').innerHTML = SITE.services
    .map((service, index) => {
      const detail = SITE.serviceDetail[service.id];
      return `
      <section class="case-section" id="${esc(service.id)}">
        <div class="case-section__head">
          <div>
            <span class="case-section__num">${esc(service.number)}</span>
            <h2>${esc(service.title)}</h2>
            <p class="meta" style="margin-top:0.8rem">${esc(service.keyword)}</p>
          </div>
          <div>
            <p class="lede">${esc(detail.whatIntro)}</p>
            <div class="media media--16x9" style="margin-top:1.4rem">${img(service.image, service.title)}</div>

            <h3 class="sub-heading">What I offer</h3>
            <div class="card-grid">${offerings(detail.offerings)}</div>

            <h3 class="sub-heading">Who this is for</h3>
            <div class="card-grid">
              ${detail.audiences
                .map(
                  (audience) => `
                <div class="note-card">
                  <span class="case-section__num" style="font-size:1.1rem">${esc(audience.icon)}</span>
                  <h3>${esc(audience.name)}</h3>
                  <p>${esc(audience.body)}</p>
                </div>`,
                )
                .join('')}
            </div>

            <h3 class="sub-heading">Questions people ask</h3>
            <div class="faq">
              ${detail.faqs
                .map(
                  (item, i) => `
                <details${i === 0 && index === 0 ? ' open' : ''}>
                  <summary>${esc(item.q)}</summary>
                  <p>${esc(item.a)}</p>
                </details>`,
                )
                .join('')}
              <div class="row" style="margin-top:1.4rem">
                <a class="btn btn--accent btn--sm" href="contact.html">Book a call about ${esc(service.keyword.toLowerCase())}</a>
                ${
                  index === 0
                    ? '<a class="btn btn--ghost btn--sm" href="tools.html">See the toolkit</a>'
                    : ''
                }
              </div>
            </div>
          </div>
        </div>
      </section>`;
    })
    .join('');

  /* A single pooled FAQ at the bottom, so the page has one obvious place to answer. */
  const pool = SITE.services.flatMap((service) => SITE.serviceDetail[service.id].faqs);
  document.querySelector('[data-faq]').innerHTML = pool
    .map(
      (item) => `
      <details>
        <summary>${esc(item.q)}</summary>
        <p>${mdInline(item.a)}</p>
      </details>`,
    )
    .join('');
})();
