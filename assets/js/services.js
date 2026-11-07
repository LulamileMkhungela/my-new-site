/** Services — scope, deliverables and questions, without invented guarantees. */
(function () {
  const SITE = window.SITE;
  const { esc } = window.LM;
  document.querySelector('[data-services]').innerHTML = SITE.services.map((service) => `
    <section class="case-section service-detail" id="${esc(service.id)}">
      <div class="case-section__intro"><span class="case-section__num">${esc(service.number)} · ${esc(service.keyword)}</span><h2>${esc(service.title)}</h2><p class="lede">${esc(service.oneliner)}</p></div>
      <div class="card-grid">${service.offerings.map((item) => `
        <article class="note-card">
          <h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>
          <div class="chips">${item.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}</div>
          <div class="note"><strong>What you get</strong><ul class="tick-list">${item.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></div>
          <p class="service-meta"><strong>Best for:</strong> ${esc(item.bestFor)}</p>
          <p class="service-meta"><strong>Outcome:</strong> ${esc(item.outcome)}</p>
        </article>`).join('')}</div>
      <div class="faq service-faq">${service.faqs.map((item) => `<details><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join('')}</div>
      <div class="row" style="margin-top:1.4rem"><a class="btn btn--accent btn--sm" href="contact.html">Talk about ${esc(service.keyword.toLowerCase())}</a><a class="btn btn--ghost btn--sm" href="work.html">See related work</a></div>
    </section>`).join('');
  const seen = new Set();
  const pool = SITE.services.flatMap((service) => service.faqs).filter((item) => { if (seen.has(item.q)) return false; seen.add(item.q); return true; });
  document.querySelector('[data-faq]').innerHTML = pool.map((item) => `<details><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join('');
})();
