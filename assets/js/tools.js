/**
 * Tools — the eight-tool browser, the five-stage flow, the workspace map, the
 * command set and the install path.
 *
 * Content is from github.com/LulamileMkhungela/devzigner (see tools.data.js).
 * The tab strip is a real tablist: roles, aria-selected, arrow/Home/End keys,
 * and a panel keyed by tool so the open "access" card never follows you.
 */
(function () {
  const T = window.TOOLS_DATA;
  const { esc } = window.SR;

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
  let active = T.tools[0].id;
  let granted = {};

  tabs.innerHTML = T.tools
    .map(
      (tool) => `
      <button class="tool-tab" type="button" role="tab" id="tab-${esc(tool.id)}"
        data-tab="${esc(tool.id)}" aria-selected="${tool.id === active}" aria-controls="tool-panel"
        tabindex="${tool.id === active ? '0' : '-1'}">
        ${KIND_ICON[tool.kind] || ''}
        <span>${esc(tool.name)}</span>
      </button>`,
    )
    .join('');

  function renderPanel() {
    const tool = T.tools.find((item) => item.id === active) || T.tools[0];
    const open = Boolean(granted[tool.id]);
    panel.innerHTML = `
      <div class="tool-panel" id="tool-panel" role="tabpanel" aria-labelledby="tab-${esc(tool.id)}">
        <div class="tool-panel__head">
          <div>
            <span class="tool-panel__kind">${esc(tool.kind)}${tool.files ? ` · ${tool.files} files` : ''}</span>
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
                  <a class="btn btn--sm" href="${esc(T.repoUrl)}/tree/main/.agents/skills/${esc(tool.id)}" target="_blank" rel="noopener">Read the skill</a>
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
    const at = T.tools.findIndex((tool) => tool.id === active);
    const next =
      event.key === 'ArrowRight'
        ? (at + 1) % T.tools.length
        : event.key === 'ArrowLeft'
          ? (at - 1 + T.tools.length) % T.tools.length
          : event.key === 'Home'
            ? 0
            : T.tools.length - 1;
    active = T.tools[next].id;
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
})();
