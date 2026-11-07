/**
 * Resources — the original Tools browser, five-stage flow, workspace map,
 * command set and install path, with Lulamile’s grouped content.
 *
 * Toolkit content is from github.com/LulamileMkhungela/devzigner (see toolkit.data.js).
 * The tab strip is a real tablist: roles, aria-selected, arrow/Home/End keys,
 * and a panel keyed by tool so the open "access" card never follows you.
 */
(function () {
  const T = window.TOOLKIT_DATA;
  const { esc } = window.LM;
  const toolById = (id) => T.tools.find((tool) => tool.id === id);
  const tools = T.groups.flatMap((group) => group.tools.map((id) => ({ ...toolById(id), groupTitle: group.title, groupId: group.id })));

  const KIND_ICON = {
    'Agent skill':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>',
    Template:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5"/></svg>',
    Convention:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 3v12a3 3 0 0 0 3 3h9"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    Workflow:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6h6M14 6h6M4 18h6M14 18h6M10 6l4 12"/></svg>',
  };

  /* ---- Intro -------------------------------------------------------------- */
  document.querySelector('[data-intro-eyebrow]').textContent = T.intro.eyebrow;
  document.querySelector('[data-intro-title]').textContent = T.intro.title;
  document.querySelector('[data-intro-lede]').textContent = T.intro.lede;
  document.querySelector('[data-tool-stats]').innerHTML = T.intro.stats
    .map((stat) => `<div><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`)
    .join('');

  /* ---- Tabs + panel ------------------------------------------------------- */
  const tabs = document.querySelector('[data-tool-tabs]');
  const panel = document.querySelector('[data-tool-panel]');
  let active = tools[0].id;
  let granted = {};

  tabs.innerHTML = T.groups
    .map((group) => `
      <span class="meta" role="presentation" style="flex-basis:100%;margin:0.9rem 0 0.35rem;color:hsl(var(--ink-soft))">${esc(group.title)}</span>
      ${group.tools.map((id) => toolById(id)).map((tool) => `
      <button class="tool-tab" type="button" role="tab" id="tab-${esc(tool.id)}"
        data-tab="${esc(tool.id)}" aria-selected="${tool.id === active}" aria-controls="tool-panel"
        tabindex="${tool.id === active ? '0' : '-1'}" title="${esc(group.title)} — ${esc(tool.name)}">
        ${KIND_ICON[tool.kind] || ''}
        <span>${esc(tool.name)}</span>
      </button>`).join('')}`,
    )
    .join('');

  function renderPanel() {
    const tool = tools.find((item) => item.id === active) || tools[0];
    const open = Boolean(granted[tool.id]);
    panel.innerHTML = `
      <div class="tool-panel" id="tool-panel" role="tabpanel" aria-labelledby="tab-${esc(tool.id)}">
        <div class="tool-panel__head">
          <div>
            <span class="tool-panel__kind">${esc(tool.groupTitle)} · ${esc(tool.kind)}${tool.files ? ` · ${tool.files} files` : ''}</span>
            <h2>${esc(tool.name)}</h2>
            <p class="tool-panel__blurb">${esc(tool.blurb)}</p>
          </div>
          <button class="btn btn--sm ${open ? 'btn--ghost' : 'btn--accent'}" type="button" data-grant
            aria-expanded="${open}" aria-controls="access-${esc(tool.id)}">
            ${open ? 'Access granted' : 'Access free'}
          </button>
        </div>

        <ol class="tool-steps">
          ${tool.steps
            .map(
              (step, index) => `
            <li>
              <span class="n">${String(index + 1).padStart(2, '0')}</span>
              <span>${esc(step.title)}${step.file ? `<code>${esc(step.file)}</code>` : ''}</span>
            </li>`,
            )
            .join('')}
        </ol>

        <div class="tool-ships">
          <span class="meta">Ships at</span> <code>${esc(tool.ships)}</code>
        </div>

        ${
          open
            ? `<div class="tool-access" id="access-${esc(tool.id)}" role="region" aria-label="Installing ${esc(tool.name)}">
                <h3>${esc(T.free.title)}</h3>
                <p>${esc(T.free.body)}</p>
                <ol>${T.free.steps
                  .map((step) => `<li>${esc(step).replace(/\.agents\/skills\/|AGENTS\.md|CLAUDE\.md|\.claude\/skills|SKILL\.md/g, (m) => `<code>${m}</code>`)}</li>`)
                  .join('')}</ol>
                <div class="row" style="margin-top:1rem">
                  <a class="btn btn--sm" href="${esc(T.repoUrl)}${tool.kind === 'Agent skill' ? `/tree/main/.agents/skills/${esc(tool.id)}` : ''}" target="_blank" rel="noopener">${tool.kind === 'Agent skill' ? 'Read the skill' : 'Open the repository'}</a>
                  <a class="btn btn--ghost btn--sm" href="${esc(T.repoUrl)}" target="_blank" rel="noopener">Open the package</a>
                </div>
              </div>`
            : ''
        }
      </div>`;
  }

  tabs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tab]');
    if (!button) return;
    active = button.dataset.tab;
    renderPanel();
    tabs.querySelectorAll('[data-tab]').forEach((tab) => {
      const on = tab.dataset.tab === active;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
  });

  /* Arrow keys, Home and End move between tabs, as a tablist should. */
  tabs.addEventListener('keydown', (event) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const at = tools.findIndex((tool) => tool.id === active);
    const next =
      event.key === 'ArrowRight'
        ? (at + 1) % tools.length
        : event.key === 'ArrowLeft'
          ? (at - 1 + tools.length) % tools.length
          : event.key === 'Home'
            ? 0
            : tools.length - 1;
    active = tools[next].id;
    renderPanel();
    tabs.querySelectorAll('[data-tab]').forEach((tab) => {
      const on = tab.dataset.tab === active;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on) tab.focus();
    });
  });

  panel.addEventListener('click', (event) => {
    if (!event.target.closest('[data-grant]')) return;
    granted[active] = !granted[active];
    renderPanel();
    panel.querySelector('[data-grant]')?.focus();
  });

  renderPanel();

  /* ---- Five stages -------------------------------------------------------- */
  document.querySelector('[data-stages]').innerHTML = T.stages
    .map(
      (stage, index) => `
      <div class="card" data-reveal style="--delay:${index * 60}ms">
        <span class="case-section__num">${esc(stage.num)}</span>
        <h3 class="display-sm" style="margin-bottom:0.5rem">${esc(stage.title)}</h3>
        <p style="margin:0;font-size:0.88rem;color:hsl(var(--ink-soft))">${esc(stage.body)}</p>
      </div>`,
    )
    .join('');

  /* ---- Library ------------------------------------------------------------ */
  document.querySelector('[data-library]').innerHTML = T.library
    .map(
      (skill) => `
      <a class="tool-card" href="${esc(T.repoUrl)}/tree/main/.agents/skills/${esc(skill.id)}" target="_blank" rel="noopener"
         style="display:block;transition:background .2s ease">
        <span class="kind">${esc(skill.id)}${skill.files ? ` · ${skill.files} ${skill.files === 1 ? 'file' : 'files'}` : ''}</span>
        <p>${esc(skill.body)}</p>
      </a>`,
    )
    .join('');

  /* ---- Workspace ---------------------------------------------------------- */
  document.querySelector('[data-workspace]').innerHTML = T.workspace
    .map(
      (item) => `
      <div class="tool-card">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.body)}</p>
      </div>`,
    )
    .join('');

  /* ---- Commands ----------------------------------------------------------- */
  document.querySelector('[data-commands]').innerHTML = T.commands
    .map(
      (command) => `
      <div class="tool-card">
        <span class="kind">/${esc(command.name)}</span>
        <p>${esc(command.body)}</p>
      </div>`,
    )
    .join('');

  /* ---- Install ------------------------------------------------------------ */
  document.querySelector('[data-install]').innerHTML = T.install
    .map(
      (step, index) => `
      <div class="step-block" style="margin-top:${index ? '1.4rem' : '0'}">
        <h3 style="font-size:1rem">${String(index + 1).padStart(2, '0')} · ${esc(step.title)}</h3>
        <p style="font-size:0.88rem">${esc(step.body)}</p>
        <pre class="codeblock">${esc(step.code)}</pre>
      </div>`,
    )
    .join('');

  document.querySelector('[data-tree]').textContent = T.tree;
  document.querySelector('[data-repo-note]').textContent = T.note;


  /* ---- AI prompts: the same tab/panel/access pattern, not a new reader ---- */
  const prompts = window.PROMPTS || [];
  const promptFilters = document.querySelector('[data-prompt-filters]');
  const promptTabs = document.querySelector('[data-prompt-tabs]');
  const promptPanel = document.querySelector('[data-prompt-panel]');
  let promptAccess = 'all';
  let activePrompt = prompts[0] ? prompts[0].id : '';
  const promptIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 5h16v14H4z M8 9h8 M8 13h5"/></svg>';
  const visiblePrompts = () => prompts.filter((prompt) => promptAccess === 'all' || prompt.access === promptAccess);

  function renderPromptFilters() {
    if (!promptFilters) return;
    const options = [
      { id: 'all', label: 'All prompts', count: prompts.length },
      { id: 'free', label: 'Free', count: prompts.filter((p) => p.access === 'free').length },
      { id: 'paid', label: 'Paid', count: prompts.filter((p) => p.access === 'paid').length },
    ];
    promptFilters.innerHTML = options.map((option) => `
      <button class="filter${option.id === promptAccess ? ' is-active' : ''}" type="button" data-prompt-access="${option.id}" aria-pressed="${option.id === promptAccess}">
        ${esc(option.label)} <span class="count">${option.count}</span>
      </button>`).join('');
    promptFilters.querySelectorAll('[data-prompt-access]').forEach((button) => {
      button.addEventListener('click', () => {
        promptAccess = button.dataset.promptAccess;
        const visible = visiblePrompts();
        if (!visible.some((p) => p.id === activePrompt)) activePrompt = visible[0] ? visible[0].id : '';
        renderPromptFilters(); renderPromptTabs(); renderPromptPanel();
      });
    });
  }

  function renderPromptTabs() {
    if (!promptTabs) return;
    promptTabs.innerHTML = visiblePrompts().map((prompt) => `
      <button class="tool-tab" type="button" role="tab" id="prompt-tab-${esc(prompt.id)}"
        data-prompt-tab="${esc(prompt.id)}" aria-selected="${prompt.id === activePrompt}" aria-controls="prompt-panel"
        tabindex="${prompt.id === activePrompt ? '0' : '-1'}" title="${esc(prompt.category)} · ${esc(prompt.access === 'paid' ? (prompt.price || 'Paid') : 'Free')}">
        ${promptIcon}
        <span>${esc(prompt.title)}</span>
      </button>`).join('');
  }

  function renderPromptPanel() {
    if (!promptPanel) return;
    const prompt = prompts.find((item) => item.id === activePrompt);
    if (!prompt) { promptPanel.innerHTML = '<p class="quote-note">No prompts in this filter.</p>'; return; }
    const paid = prompt.access === 'paid';
    promptPanel.innerHTML = `
      <div class="tool-panel" id="prompt-panel" role="tabpanel" aria-labelledby="prompt-tab-${esc(prompt.id)}">
        <div class="tool-panel__head">
          <div>
            <span class="tool-panel__kind">${esc(prompt.category)} · ${paid ? esc(prompt.price || 'Paid') : 'Free'}</span>
            <h2>${esc(prompt.title)}</h2>
            <p class="tool-panel__blurb">${esc(prompt.format)} · By ${esc(prompt.author)}</p>
          </div>
          ${paid
            ? `<a class="btn btn--accent btn--sm" href="${esc(prompt.url)}" target="_blank" rel="noopener">View paid pack ↗</a>`
            : '<button class="btn btn--accent btn--sm" type="button" data-copy-prompt>Copy prompt</button>'}
        </div>
        ${paid
          ? `<div class="tool-access"><h3>Paid prompt pack</h3><p>The public preview is listed here; the full prompt and files are delivered by my Selar store. No paid body is copied into this site.</p><a href="${esc(prompt.url)}" target="_blank" rel="noopener">${esc(prompt.url)}</a></div>`
          : `<pre class="codeblock" data-prompt-text style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(prompt.prompt)}</pre>
             <div class="row" style="margin-top:0.8rem"><button class="btn btn--ghost btn--sm" type="button" data-select-prompt>Select all</button><span class="quote-note" data-prompt-status role="status" aria-live="polite"></span></div>`}
      </div>`;
    const copy = promptPanel.querySelector('[data-copy-prompt]');
    if (copy) copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(prompt.prompt); copy.textContent = 'Copied ✓'; }
      catch { promptPanel.querySelector('[data-prompt-status]').textContent = 'Select the prompt text and copy it manually.'; }
      setTimeout(() => { copy.textContent = 'Copy prompt'; }, 1800);
    });
    const select = promptPanel.querySelector('[data-select-prompt]');
    if (select) select.addEventListener('click', () => {
      const range = document.createRange(); range.selectNodeContents(promptPanel.querySelector('[data-prompt-text]'));
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      promptPanel.querySelector('[data-prompt-status]').textContent = 'Prompt selected. Press Ctrl/Cmd+C to copy.';
    });
  }

  function selectPrompt(id, updateHash = true) {
    if (!prompts.some((item) => item.id === id)) return;
    activePrompt = id; renderPromptTabs(); renderPromptPanel();
    if (updateHash) history.replaceState(null, '', `#prompt-${id}`);
  }

  if (promptTabs) {
    promptTabs.addEventListener('click', (event) => {
      const button = event.target.closest('[data-prompt-tab]');
      if (button) selectPrompt(button.dataset.promptTab);
    });
    promptTabs.addEventListener('keydown', (event) => {
      const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const visible = visiblePrompts();
      const at = visible.findIndex((prompt) => prompt.id === activePrompt);
      const next = event.key === 'ArrowRight' ? (at + 1) % visible.length
        : event.key === 'ArrowLeft' ? (at - 1 + visible.length) % visible.length
        : event.key === 'Home' ? 0 : visible.length - 1;
      selectPrompt(visible[next].id);
      promptTabs.querySelector(`[data-prompt-tab="${visible[next].id}"]`)?.focus();
    });
    renderPromptFilters(); renderPromptTabs(); renderPromptPanel();
    const hash = decodeURIComponent(location.hash.replace('#prompt-', ''));
    if (location.hash.startsWith('#prompt-') && prompts.some((p) => p.id === hash)) selectPrompt(hash, false);
  }

  /* ---- Reading list: original section-head + tool-grid cards, grouped by type ---- */
  const reading = window.RESOURCES_DATA;
  const readingGroups = document.querySelector('[data-reading-groups]');
  if (reading && readingGroups) {
    document.querySelector('[data-directory-links]').innerHTML = reading.directories.map((link) => `<a class="btn btn--ghost btn--sm" href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.label)} ↗</a>`).join('');
    readingGroups.innerHTML = reading.groups.map((group) => `
      <div style="margin-top:1.6rem">
        <h3 class="display-sm">${esc(group.label)}</h3>
        <p class="quote-note">${esc(group.description)}</p>
        <div class="tool-grid" style="margin-top:0.9rem">
          ${reading.items.filter((item) => item.group === group.id).map((item) => `
            <article class="tool-card">
              <span class="tool-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z M8 9h8 M8 13h5"/></svg></span>
              <h3>${esc(item.title)}</h3>
              <span class="kind">${esc(item.provider)} · ${esc(item.price || item.access)}</span>
              <p class="blurb">${esc(item.description)}</p>
              <p class="quote-note">${esc(item.note)}</p>
              <a class="btn btn--ghost btn--sm" href="${esc(item.url)}" target="_blank" rel="noopener">Open resource ↗</a>
            </article>`).join('')}
        </div>
      </div>`).join('');
    document.querySelector('[data-resource-disclosure]').textContent = reading.disclosure;
  }

})();
