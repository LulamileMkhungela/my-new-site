/**
 * Resources — original my-new-site tools tabs/panel/access interaction,
 * extended with grouped toolkit, AI prompt reader and credited reading list.
 */
(function () {
  const T = window.TOOLKIT_DATA;
  const P = window.PROMPTS;
  const R = window.RESOURCES_DATA;
  const { esc } = window.LM;

  const KIND_ICON = {
    'Agent skill': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>',
    Template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5"/></svg>',
    Convention: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 3v12a3 3 0 0 0 3 3h9"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    Workflow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6h6M14 6h6M4 18h6M14 18h6M10 6l4 12"/></svg>',
  };

  const badge = (access, price) => `<span class="chip access-chip${access === 'paid' ? ' access-chip--paid' : access === 'freemium' ? ' access-chip--freemium' : ''}">${esc(price || (access === 'free' ? 'Free' : access === 'paid' ? 'Paid' : 'Free + paid'))}</span>`;
  const toolUrl = (tool) => `${T.repoUrl}/tree/main/.agents/skills/${esc(tool.id)}`;

  /* ---- Intro -------------------------------------------------------------- */
  document.querySelector('[data-resource-stats]').innerHTML = [
    { value: T.tools.length, label: 'Tools in my kit' },
    { value: P.filter((p) => p.access === 'free').length, label: 'Free AI prompts' },
    { value: P.filter((p) => p.access === 'paid').length, label: 'Paid prompt packs' },
    { value: R.items.length, label: 'External recommendations' },
  ].map((stat) => `<div><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`).join('');

  /* ---- Grouped toolkit tabs + panels -------------------------------------- */
  const granted = {};
  document.querySelector('[data-toolkit-groups]').innerHTML = T.groups.map((group) => `
    <section class="tool-group" data-toolkit-group="${esc(group.id)}">
      <h3 class="display-sm">${esc(group.title)}</h3>
      <p>${esc(group.description)}</p>
      <div class="tool-tabs" data-tool-tabs="${esc(group.id)}" role="tablist" aria-label="${esc(group.title)} tools"></div>
      <div data-tool-panel="${esc(group.id)}"></div>
    </section>`).join('');

  T.groups.forEach((group) => {
    const tools = group.tools.map((id) => T.tools.find((tool) => tool.id === id)).filter(Boolean);
    const tabs = document.querySelector(`[data-tool-tabs="${group.id}"]`);
    const panel = document.querySelector(`[data-tool-panel="${group.id}"]`);
    let active = tools[0].id;

    tabs.innerHTML = tools.map((tool) => `
      <button class="tool-tab" type="button" role="tab" id="tab-${esc(tool.id)}" data-tab="${esc(tool.id)}"
        aria-selected="${tool.id === active}" aria-controls="tool-panel-${esc(group.id)}" tabindex="${tool.id === active ? '0' : '-1'}">
        ${KIND_ICON[tool.kind] || ''}<span>${esc(tool.name)}</span>
      </button>`).join('');

    function renderPanel() {
      const tool = tools.find((item) => item.id === active) || tools[0];
      const open = Boolean(granted[tool.id]);
      panel.innerHTML = `
        <div class="tool-panel" id="tool-panel-${esc(group.id)}" role="tabpanel" aria-labelledby="tab-${esc(tool.id)}">
          <div class="tool-panel__head">
            <div>
              <span class="tool-panel__kind">${esc(tool.kind)}${tool.files ? ` · ${tool.files} files` : ''}</span>
              <h2>${esc(tool.name)}</h2>
              <p class="tool-panel__blurb">${esc(tool.blurb)}</p>
            </div>
            <button class="btn btn--sm ${open ? 'btn--ghost' : 'btn--accent'}" type="button" data-grant aria-expanded="${open}" aria-controls="access-${esc(tool.id)}">
              ${open ? 'Access granted' : 'Access free'}
            </button>
          </div>
          <ol class="tool-steps">
            ${tool.steps.map((step, index) => `
              <li><span class="n">${String(index + 1).padStart(2, '0')}</span><span>${esc(step.title)}${step.file ? `<code>${esc(step.file)}</code>` : ''}</span></li>`).join('')}
          </ol>
          <div class="tool-ships"><span class="meta">Ships at</span> <code>${esc(tool.ships)}</code></div>
          ${open ? `
            <div class="tool-access" id="access-${esc(tool.id)}" role="region" aria-label="Installing ${esc(tool.name)}">
              <h3>${esc(T.free.title)}</h3>
              <p>${esc(T.free.body)}</p>
              <ol>${T.free.steps.map((step) => `<li>${esc(step).replace(/\.agents\/skills\/|AGENTS\.md|CLAUDE\.md|\.claude\/skills|SKILL\.md/g, (m) => `<code>${m}</code>`)}</li>`).join('')}</ol>
              <div class="row" style="margin-top:1rem">
                <a class="btn btn--sm" href="${toolUrl(tool)}" target="_blank" rel="noopener">Read the skill</a>
                <a class="btn btn--ghost btn--sm" href="${esc(T.repoUrl)}" target="_blank" rel="noopener">Open the package</a>
              </div>
            </div>` : ''}
        </div>`;
    }

    function select(id, focus) {
      active = id;
      renderPanel();
      tabs.querySelectorAll('[data-tab]').forEach((tab) => {
        const on = tab.dataset.tab === active;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
    }

    tabs.addEventListener('click', (event) => {
      const button = event.target.closest('[data-tab]');
      if (button) select(button.dataset.tab, false);
    });
    tabs.addEventListener('keydown', (event) => {
      const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const at = tools.findIndex((tool) => tool.id === active);
      const next = event.key === 'ArrowRight' ? (at + 1) % tools.length
        : event.key === 'ArrowLeft' ? (at - 1 + tools.length) % tools.length
        : event.key === 'Home' ? 0 : tools.length - 1;
      select(tools[next].id, true);
    });
    panel.addEventListener('click', (event) => {
      if (!event.target.closest('[data-grant]')) return;
      granted[active] = !granted[active];
      renderPanel();
      panel.querySelector('[data-grant]')?.focus();
    });
    renderPanel();
  });

  /* ---- Original repository reference sections ----------------------------- */
  document.querySelector('[data-stages]').innerHTML = T.stages.map((stage, index) => `
    <div class="card" data-reveal style="--delay:${index * 60}ms">
      <span class="case-section__num">${esc(stage.num)}</span>
      <h3 class="display-sm" style="margin-bottom:0.5rem">${esc(stage.title)}</h3>
      <p style="margin:0;font-size:0.88rem;color:hsl(var(--ink-soft))">${esc(stage.body)}</p>
    </div>`).join('');

  document.querySelector('[data-library]').innerHTML = T.library.map((skill) => `
    <a class="tool-card" href="${esc(T.repoUrl)}/tree/main/.agents/skills/${esc(skill.id)}" target="_blank" rel="noopener" style="display:block;transition:background .2s ease">
      <span class="kind">${esc(skill.id)}${skill.files ? ` · ${skill.files} ${skill.files === 1 ? 'file' : 'files'}` : ''}</span>
      <p>${esc(skill.body)}</p>
    </a>`).join('');

  document.querySelector('[data-workspace]').innerHTML = T.workspace.map((item) => `
    <div class="tool-card"><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></div>`).join('');

  document.querySelector('[data-commands]').innerHTML = T.commands.map((command) => `
    <div class="tool-card"><span class="kind">/${esc(command.name)}</span><p>${esc(command.body)}</p></div>`).join('');

  document.querySelector('[data-install]').innerHTML = T.install.map((step, index) => `
    <div class="step-block" style="margin-top:${index ? '1.4rem' : '0'}">
      <h3 style="font-size:1rem">${String(index + 1).padStart(2, '0')} · ${esc(step.title)}</h3>
      <p style="font-size:0.88rem">${esc(step.body)}</p>
      <pre class="codeblock">${esc(step.code)}</pre>
    </div>`).join('');
  document.querySelector('[data-tree]').textContent = T.tree;
  document.querySelector('[data-repo-note]').textContent = T.note;

  /* ---- AI prompts --------------------------------------------------------- */
  const promptCategories = ['all', ...new Set(P.map((prompt) => prompt.category))];
  document.querySelector('[data-prompt-categories]').innerHTML = promptCategories.map((category, index) => `
    <button class="filter" type="button" data-prompt-category="${esc(category)}" aria-pressed="${index === 0}">
      ${esc(category === 'all' ? 'All prompts' : category)}<span>${category === 'all' ? P.length : P.filter((p) => p.category === category).length}</span>
    </button>`).join('');

  document.querySelector('[data-prompt-grid]').innerHTML = P.map((prompt, index) => `
    <button class="work-card" type="button" data-resource data-type="prompts" data-access="${esc(prompt.access)}" data-prompt-category-card="${esc(prompt.category)}" data-open-prompt="${esc(prompt.id)}" data-search="${esc(`${prompt.title} ${prompt.category} ${prompt.format} ${prompt.author}`)}" data-reveal style="--delay:${(index % 2) * 60}ms" aria-label="${prompt.access === 'free' ? 'Read and copy' : 'View paid pack'}: ${esc(prompt.title)}">
      <span class="media media--16x9"><img data-asset="${esc(prompt.cover || prompt.title)}" src="${prompt.cover ? window.asset(prompt.cover, 'prompts') : window.placeholderImage(prompt.title)}" alt="${esc(prompt.alt || prompt.title)}" loading="lazy" decoding="async"></span>
      <span class="work-card__body">
        <span class="work-card__index"><span>${esc(prompt.category)}</span><span>${esc(prompt.price || (prompt.access === 'free' ? 'Free' : 'Paid'))}</span></span>
        <h3>${esc(prompt.title)}</h3>
        <p>${esc(prompt.format)} · By Lulamile Mkhungela</p>
        <span class="chips">${badge(prompt.access, prompt.price)}</span>
        <span class="work-card__foot"><span>${prompt.access === 'free' ? 'Full public prompt' : 'Delivered by Selar'}</span><span class="work-card__cta">${prompt.access === 'free' ? 'Read & copy' : 'View pack'} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></span></span>
      </span>
    </button>`).join('');

  /* ---- External reading --------------------------------------------------- */
  document.querySelector('[data-directory-links]').innerHTML = R.directories.map((link) => `
    <a class="btn btn--ghost btn--sm" href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.label)} ↗</a>`).join('');

  document.querySelector('[data-reading-groups]').innerHTML = R.groups.map((group) => `
    <section class="resource-group" data-reading-group>
      <h3 class="display-sm">${esc(group.label)}</h3>
      <p>${esc(group.description)}</p>
      <div class="tool-grid">${R.items.filter((item) => item.group === group.id).map((item) => `
        <article class="tool-card" data-resource data-type="external" data-access="${esc(item.access)}" data-search="${esc(`${item.title} ${item.description} ${item.note} ${item.provider} ${group.label}`)}">
          <div class="resource-card__top"><span class="kind">External · by ${esc(item.provider)}</span>${badge(item.access, item.price)}</div>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.description)}</p>
          <p class="curator-note"><strong>Why I keep it:</strong> ${esc(item.note)}</p>
          <div class="resource-card__foot"><span class="meta">${esc(item.format)}</span><a class="btn btn--ghost btn--sm" href="${esc(item.url)}" target="_blank" rel="noopener">${item.access === 'freemium' ? 'See plans' : item.group === 'guides' ? 'Read guide' : 'Open pack'} ↗</a></div>
        </article>`).join('')}</div>
    </section>`).join('');
  document.querySelector('[data-resource-disclosure]').textContent = R.disclosure;

  /* ---- Search and access filters ------------------------------------------ */
  const state = { access: 'all', query: '', promptCategory: 'all' };
  const access = [{ id: 'all', label: 'Any access' }, { id: 'free', label: 'Free' }, { id: 'paid', label: 'Paid' }];
  const accessHost = document.querySelector('[data-resource-access]');
  accessHost.innerHTML = access.map((item) => `<button class="filter" type="button" data-resource-access="${item.id}" aria-pressed="${item.id === 'all'}">${item.label}</button>`).join('');

  function matchesAccess(value) {
    if (state.access === 'all') return true;
    if (state.access === 'free') return value === 'free' || value === 'freemium';
    return value === 'paid' || value === 'freemium';
  }
  function apply() {
    let visible = 0;
    document.querySelectorAll('[data-resource]').forEach((card) => {
      const show = matchesAccess(card.dataset.access)
        && (!card.dataset.promptCategoryCard || state.promptCategory === 'all' || card.dataset.promptCategoryCard === state.promptCategory)
        && (!state.query || card.dataset.search.toLowerCase().includes(state.query));
      card.hidden = !show;
      if (show) visible += 1;
    });
    document.querySelectorAll('[data-reading-group]').forEach((group) => {
      group.hidden = ![...group.querySelectorAll('[data-resource]')].some((card) => !card.hidden);
    });
    document.querySelector('[data-resource-empty]').hidden = visible > 0;
    document.querySelector('[data-resource-count]').textContent = `${visible} ${visible === 1 ? 'prompt / reading item' : 'prompts and reading items'} shown`;
    accessHost.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.resourceAccess === state.access)));
    document.querySelectorAll('[data-prompt-category]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.promptCategory === state.promptCategory)));
  }
  accessHost.addEventListener('click', (event) => { const button = event.target.closest('[data-resource-access]'); if (button) { state.access = button.dataset.resourceAccess; apply(); } });
  document.querySelector('[data-prompt-categories]').addEventListener('click', (event) => { const button = event.target.closest('[data-prompt-category]'); if (button) { state.promptCategory = button.dataset.promptCategory; apply(); } });
  document.querySelector('[data-resource-search]').addEventListener('input', (event) => { state.query = event.target.value.trim().toLowerCase(); apply(); });
  document.querySelector('[data-resource-reset]').addEventListener('click', () => {
    Object.assign(state, { access: 'all', query: '', promptCategory: 'all' });
    document.querySelector('[data-resource-search]').value = '';
    apply();
    document.querySelector('[data-resource-search]').focus();
  });
  apply();

  /* ---- Prompt reader: original tool-panel / tool-access pattern ----------- */
  const reader = document.querySelector('[data-prompt-reader]');
  let copyTimer;
  let currentPrompt = null;

  function closeReader() {
    reader.hidden = true;
    reader.innerHTML = '';
    currentPrompt = null;
    clearTimeout(copyTimer);
  }

  function openPrompt(id) {
    const prompt = P.find((item) => item.id === id);
    if (!prompt) return;
    clearTimeout(copyTimer);
    currentPrompt = prompt;
    const free = prompt.access === 'free';
    reader.hidden = false;
    reader.innerHTML = `
      <div class="tool-panel" role="region" aria-label="${esc(prompt.title)} prompt">
        <div class="tool-panel__head">
          <div>
            <span class="tool-panel__kind">${esc(prompt.category)} · ${esc(prompt.price || (free ? 'Free' : 'Paid'))}</span>
            <h2>${esc(prompt.title)}</h2>
            <p class="tool-panel__blurb">${esc(prompt.format)} · Created by Lulamile Mkhungela</p>
          </div>
          <button class="btn btn--ghost btn--sm" type="button" data-prompt-close>Close</button>
        </div>
        ${free ? `
          <div class="tool-access">
            <h3>Prompt text</h3>
            <label class="sr-only" for="prompt-text">Prompt text</label>
            <textarea id="prompt-text" class="codeblock prompt-text" data-dialog-text readonly rows="12">${esc(prompt.prompt)}</textarea>
            <div class="row prompt-actions">
              <button class="btn btn--accent btn--sm" type="button" data-dialog-copy>Copy prompt</button>
              <button class="btn btn--ghost btn--sm" type="button" data-dialog-select>Select all</button>
              <span class="meta" data-dialog-status role="status" aria-live="polite"></span>
            </div>
          </div>` : `
          <div class="tool-access">
            <h3>Paid pack</h3>
            <p>This is a paid pack from my prompt library. The prompt and any included files are delivered through Selar after purchase.</p>
            <a class="btn btn--accent btn--sm" href="${esc(prompt.url)}" target="_blank" rel="noopener">View on my Selar store ↗</a>
          </div>`}
        <p class="resource-note">Review generated output against your brief, brand and real user needs before using it.</p>
      </div>`;
    reader.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    reader.querySelector('[data-prompt-close]')?.focus();
  }

  document.querySelector('[data-prompt-grid]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-open-prompt]');
    if (button) openPrompt(button.dataset.openPrompt);
  });
  reader.addEventListener('click', async (event) => {
    if (event.target.closest('[data-prompt-close]')) { closeReader(); return; }
    const text = reader.querySelector('[data-dialog-text]');
    const status = reader.querySelector('[data-dialog-status]');
    const copyButton = reader.querySelector('[data-dialog-copy]');
    if (event.target.closest('[data-dialog-select]') && text) {
      text.focus(); text.select();
      if (status) status.textContent = 'Selected. Press Ctrl+C (⌘C on Mac) to copy.';
      return;
    }
    if (!event.target.closest('[data-dialog-copy]') || !text || !currentPrompt) return;
    if (status) status.textContent = 'Copying…';
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
      if (copyButton) copyButton.textContent = 'Copied ✓';
      if (status) status.textContent = 'Prompt copied to your clipboard.';
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { if (copyButton) copyButton.textContent = 'Copy prompt'; }, 1800);
    } else {
      text.focus(); text.select();
      if (status) status.textContent = 'Clipboard unavailable. The text is selected — press Ctrl+C (⌘C on Mac).';
    }
  });
})();
