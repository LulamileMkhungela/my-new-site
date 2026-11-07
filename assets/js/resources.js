/** Resources — grouped toolkit, Lulamile's prompt library and credited external reading. */
(function () {
  const T = window.TOOLKIT_DATA;
  const P = window.PROMPTS;
  const R = window.RESOURCES_DATA;
  const { esc } = window.LM;
  const state = { type: 'all', access: 'all', query: '', promptCategory: 'all' };

  const badge = (access, price) => `<span class="access-badge access-badge--${esc(access)}">${esc(price || (access === 'free' ? 'Free' : access === 'paid' ? 'Paid' : 'Free + paid'))}</span>`;
  const toolUrl = (tool) => {
    if (['prd-creator', 'skill-builder', 'design-system', 'favicon-creator'].includes(tool.id)) return `${T.repoUrl}/tree/main/.agents/skills/${tool.id}`;
    if (tool.id === 'starter') return `${T.repoUrl}/tree/main/template/starter`;
    return T.repoUrl;
  };

  document.querySelector('[data-resource-stats]').innerHTML = [
    { value: T.tools.length, label: 'Tools in my kit' },
    { value: P.filter((p) => p.access === 'free').length, label: 'Free AI prompts' },
    { value: P.filter((p) => p.access === 'paid').length, label: 'Paid prompt packs' },
    { value: R.items.length, label: 'External recommendations' },
  ].map((stat) => `<div class="stat"><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`).join('');

  /* ---- My toolkit, grouped by job --------------------------------------- */
  document.querySelector('[data-toolkit-groups]').innerHTML = T.groups.map((group) => `
    <section class="resource-group" data-toolkit-group>
      <div class="resource-group__head"><h3 class="display-sm">${esc(group.title)}</h3><p>${esc(group.description)}</p></div>
      <div class="resource-grid">${group.tools.map((id) => {
        const tool = T.tools.find((item) => item.id === id);
        return `
        <article class="resource-card" data-resource data-type="toolkit" data-access="free" data-search="${esc(`${tool.name} ${tool.kind} ${tool.blurb} ${group.title} Lulamile Mkhungela`)}">
          <div class="resource-card__top"><span class="kind">${esc(tool.kind)}</span>${badge('free')}</div>
          <h4>${esc(tool.name)}</h4><p>${esc(tool.blurb)}</p>
          <details class="resource-details"><summary>Steps &amp; source path <span aria-hidden="true">+</span></summary>
            <ol class="tool-steps">${tool.steps.map((step, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${esc(step.title)}${step.file ? `<code>${esc(step.file)}</code>` : ''}</span></li>`).join('')}</ol>
            <p class="resource-path"><strong>Ships at</strong> <code>${esc(tool.ships)}</code></p>
          </details>
          <div class="resource-card__foot"><span class="meta">By Lulamile Mkhungela</span><a class="text-link" href="${esc(toolUrl(tool))}" target="_blank" rel="noopener">Open source ↗</a></div>
        </article>`;
      }).join('')}</div>
    </section>`).join('');

  document.querySelector('[data-toolkit-reference]').innerHTML = `
    <h3 class="display-sm">The five-stage ProdOps flow</h3>
    <div class="grid grid--3 reference-grid">${T.stages.map((stage) => `<div class="note-card"><span class="case-section__num">${esc(stage.num)}</span><h4>${esc(stage.title)}</h4><p>${esc(stage.body)}</p></div>`).join('')}</div>
    <h3 class="display-sm">Skill library</h3>
    <div class="resource-grid reference-grid">${T.library.map((skill) => `<a class="note-card" href="${T.repoUrl}/tree/main/.agents/skills/${esc(skill.id)}" target="_blank" rel="noopener"><h4>${esc(skill.id)}</h4><p>${esc(skill.body)}</p><span class="meta">${skill.files} ${skill.files === 1 ? 'file' : 'files'} ↗</span></a>`).join('')}</div>
    <h3 class="display-sm">Stage commands</h3>
    <div class="resource-grid reference-grid">${T.commands.map((command) => `<div class="note-card"><h4><code>/${esc(command.name)}</code></h4><p>${esc(command.body)}</p></div>`).join('')}</div>
    <h3 class="display-sm">Run it locally</h3>
    ${T.install.map((step) => `<div class="step-block"><h4>${esc(step.title)}</h4><p>${esc(step.body)}</p><pre class="codeblock">${esc(step.code)}</pre></div>`).join('')}
    <pre class="tree">${esc(T.tree)}</pre><p class="meta">${esc(T.note)}</p>`;

  /* ---- My AI prompts ----------------------------------------------------- */
  const promptCategories = ['all', ...new Set(P.map((prompt) => prompt.category))];
  document.querySelector('[data-prompt-categories]').innerHTML = promptCategories.map((category, index) => `<button class="filter" type="button" data-prompt-category="${esc(category)}" aria-pressed="${index === 0}">${esc(category === 'all' ? 'All prompts' : category)}<span>${category === 'all' ? P.length : P.filter((p) => p.category === category).length}</span></button>`).join('');

  document.querySelector('[data-prompt-grid]').innerHTML = P.map((prompt) => `
    <article class="prompt-card" data-resource data-type="prompts" data-access="${esc(prompt.access)}" data-prompt-category-card="${esc(prompt.category)}" data-search="${esc(`${prompt.title} ${prompt.category} ${prompt.format} ${prompt.author}`)}">
      <button class="prompt-card__open" type="button" data-open-prompt="${esc(prompt.id)}" aria-label="${prompt.access === 'free' ? 'Read and copy' : 'View paid pack'}: ${esc(prompt.title)}">
        ${prompt.cover ? `<span class="media media--16x9"><img src="${window.asset(prompt.cover, 'prompts')}" alt="${esc(prompt.alt)}" loading="lazy" decoding="async"></span>` : `<span class="prompt-cover" aria-hidden="true"><span>LM / PROMPTS</span><strong>${esc(prompt.title)}</strong><small>${esc(prompt.format)}</small></span>`}
        <span class="prompt-card__body">
          <span class="resource-card__top"><span class="kind">${esc(prompt.category)}</span>${badge(prompt.access, prompt.price || 'Free')}</span>
          <span class="prompt-card__title">${esc(prompt.title)}</span>
          <span class="meta">${esc(prompt.format)} · By Lulamile Mkhungela</span>
          <span class="text-link">${prompt.access === 'free' ? 'Read & copy prompt' : `View pack${prompt.price ? ` · ${esc(prompt.price)}` : ''}`} <span aria-hidden="true">→</span></span>
        </span>
      </button>
    </article>`).join('');

  /* ---- External reading, with publisher credit -------------------------- */
  document.querySelector('[data-directory-links]').innerHTML = R.directories.map((link) => `<a class="btn btn--ghost btn--sm" href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.label)} ↗</a>`).join('');
  document.querySelector('[data-reading-groups]').innerHTML = R.groups.map((group) => `
    <section class="resource-group" data-reading-group>
      <div class="resource-group__head"><h3 class="display-sm">${esc(group.label)}</h3><p>${esc(group.description)}</p></div>
      <div class="resource-grid">${R.items.filter((item) => item.group === group.id).map((item) => `
        <article class="resource-card" data-resource data-type="external" data-access="${esc(item.access)}" data-search="${esc(`${item.title} ${item.description} ${item.note} ${item.provider} ${group.label}`)}">
          <div class="resource-card__top"><span class="kind">External · by ${esc(item.provider)}</span>${badge(item.access, item.price)}</div>
          <h4>${esc(item.title)}</h4><p>${esc(item.description)}</p>
          <p class="curator-note"><strong>Why I keep it:</strong> ${esc(item.note)}</p>
          <div class="resource-card__foot"><span class="meta">${esc(item.format)}</span><a class="text-link" href="${esc(item.url)}" target="_blank" rel="noopener">${item.access === 'freemium' ? 'See plans' : item.group === 'guides' ? 'Read guide' : 'Open pack'} ↗</a></div>
        </article>`).join('')}</div>
    </section>`).join('');
  document.querySelector('[data-resource-disclosure]').textContent = R.disclosure;

  /* ---- Shared search and filters ---------------------------------------- */
  const types = [{ id: 'all', label: 'All resources' }, { id: 'toolkit', label: 'My toolkit' }, { id: 'prompts', label: 'AI prompts' }, { id: 'external', label: 'External reading' }];
  const access = [{ id: 'all', label: 'Any access' }, { id: 'free', label: 'Free' }, { id: 'paid', label: 'Paid' }];
  const typeHost = document.querySelector('[data-resource-types]');
  const accessHost = document.querySelector('[data-resource-access]');
  typeHost.innerHTML = types.map((item) => `<button class="filter" type="button" data-resource-type="${item.id}" aria-pressed="${item.id === 'all'}">${item.label}</button>`).join('');
  accessHost.innerHTML = access.map((item) => `<button class="filter" type="button" data-resource-access="${item.id}" aria-pressed="${item.id === 'all'}">${item.label}</button>`).join('');

  function matchesAccess(value) {
    if (state.access === 'all') return true;
    if (state.access === 'free') return value === 'free' || value === 'freemium';
    return value === 'paid' || value === 'freemium';
  }
  function apply() {
    let visible = 0;
    document.querySelectorAll('[data-resource]').forEach((card) => {
      const show = (state.type === 'all' || card.dataset.type === state.type)
        && matchesAccess(card.dataset.access)
        && (!card.dataset.promptCategoryCard || state.promptCategory === 'all' || card.dataset.promptCategoryCard === state.promptCategory)
        && (!state.query || card.dataset.search.toLowerCase().includes(state.query));
      card.hidden = !show;
      if (show) visible += 1;
    });
    document.querySelectorAll('[data-toolkit-group], [data-reading-group]').forEach((group) => {
      group.hidden = ![...group.querySelectorAll('[data-resource]')].some((card) => !card.hidden);
    });
    document.querySelectorAll('[data-resource-section]').forEach((section) => {
      const cards = [...section.querySelectorAll('[data-resource]')];
      section.hidden = !cards.some((card) => !card.hidden);
    });
    document.querySelector('[data-prompt-categories]').hidden = state.type !== 'all' && state.type !== 'prompts';
    document.querySelector('.toolkit-reference').hidden = state.type !== 'all' && state.type !== 'toolkit';
    document.querySelector('[data-resource-empty]').hidden = visible > 0;
    document.querySelector('[data-resource-count]').textContent = `${visible} ${visible === 1 ? 'resource' : 'resources'} shown`;
    typeHost.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.resourceType === state.type)));
    accessHost.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.resourceAccess === state.access)));
    document.querySelectorAll('[data-prompt-category]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.promptCategory === state.promptCategory)));
  }
  typeHost.addEventListener('click', (event) => { const button = event.target.closest('[data-resource-type]'); if (button) { state.type = button.dataset.resourceType; apply(); } });
  accessHost.addEventListener('click', (event) => { const button = event.target.closest('[data-resource-access]'); if (button) { state.access = button.dataset.resourceAccess; apply(); } });
  document.querySelector('[data-prompt-categories]').addEventListener('click', (event) => { const button = event.target.closest('[data-prompt-category]'); if (button) { state.promptCategory = button.dataset.promptCategory; apply(); } });
  document.querySelector('[data-resource-search]').addEventListener('input', (event) => { state.query = event.target.value.trim().toLowerCase(); apply(); });
  document.querySelector('[data-resource-reset]').addEventListener('click', () => {
    Object.assign(state, { type: 'all', access: 'all', query: '', promptCategory: 'all' });
    document.querySelector('[data-resource-search]').value = '';
    apply();
    document.querySelector('[data-resource-search]').focus();
  });
  document.querySelectorAll('.resource-jumps a').forEach((link) => link.addEventListener('click', () => {
    state.type = { '#toolkit': 'toolkit', '#prompts': 'prompts', '#reading': 'external' }[link.getAttribute('href')] || 'all';
    apply();
  }));
  apply();

  /* ---- Prompt dialog: free text copies; paid bodies stay behind checkout - */
  const dialog = document.querySelector('[data-prompt-dialog]');
  const text = dialog.querySelector('[data-dialog-text]');
  const copyButton = dialog.querySelector('[data-dialog-copy]');
  const status = dialog.querySelector('[data-dialog-status]');
  let copyTimer;
  function openPrompt(id) {
    const prompt = P.find((item) => item.id === id);
    if (!prompt) return;
    clearTimeout(copyTimer);
    const free = prompt.access === 'free';
    dialog.querySelector('[data-dialog-title]').textContent = prompt.title;
    dialog.querySelector('[data-dialog-meta]').textContent = `${prompt.format}${prompt.price ? ` · ${prompt.price}` : ''} · Created by Lulamile Mkhungela`;
    const badgeEl = dialog.querySelector('[data-dialog-badge]');
    badgeEl.className = `access-badge access-badge--${prompt.access}`;
    badgeEl.textContent = prompt.price || 'Free';
    const media = dialog.querySelector('[data-dialog-media]');
    media.hidden = !prompt.cover;
    if (prompt.cover) {
      const image = dialog.querySelector('[data-dialog-image]');
      image.src = window.asset(prompt.cover, 'prompts');
      image.alt = prompt.alt;
    }
    dialog.querySelector('[data-dialog-free]').hidden = !free;
    dialog.querySelector('[data-dialog-paid]').hidden = free;
    text.value = free ? prompt.prompt : '';
    copyButton.textContent = 'Copy prompt';
    status.textContent = '';
    if (!free) dialog.querySelector('[data-dialog-buy]').href = prompt.url;
    dialog.showModal();
    dialog.querySelector('[data-dialog-close]').focus();
  }
  document.querySelector('[data-prompt-grid]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-open-prompt]');
    if (button) openPrompt(button.dataset.openPrompt);
  });
  dialog.querySelector('[data-dialog-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { text.value = ''; clearTimeout(copyTimer); });
  dialog.querySelector('[data-dialog-select]').addEventListener('click', () => { text.focus(); text.select(); status.textContent = 'Selected. Press Ctrl+C (⌘C on Mac) to copy.'; });
  copyButton.addEventListener('click', async () => {
    status.textContent = 'Copying…';
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await Promise.race([
          navigator.clipboard.writeText(text.value),
          new Promise((_, reject) => setTimeout(() => reject(new Error('clipboard timeout')), 1200)),
        ]);
        copied = true;
      } catch (e) { /* fall back to selection below */ }
    }
    if (!copied) {
      text.focus(); text.select();
      try { copied = document.execCommand('copy'); } catch (e) { copied = false; }
    }
    if (copied) {
      copyButton.textContent = 'Copied ✓';
      status.textContent = 'Prompt copied to your clipboard.';
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { copyButton.textContent = 'Copy prompt'; }, 1800);
    } else {
      text.focus(); text.select();
      status.textContent = 'Clipboard unavailable. The text is selected — press Ctrl+C (⌘C on Mac).';
    }
  });
})();
