/**
 * Shell — original my-new-site header, mobile drawer, theme, footer,
 * reveal-on-scroll and image fallback. Images are local-first; nothing falls
 * back to another designer's website.
 */
(function () {
  const SITE = window.SITE;
  const LOCAL = 'assets/img/projects/';
  const THEME_KEY = 'lm-theme';

  /* ---- Image resolution -------------------------------------------------- */
  function placeholder(name) {
    const label = (name || 'image').replace(/[-_]/g, ' ').replace(/\.\w+$/, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e6e1f2"/><stop offset="1" stop-color="#d5cfe8"/>
      </linearGradient></defs>
      <rect width="640" height="480" fill="url(#g)"/>
      <circle cx="320" cy="216" r="46" fill="#3a2f63" opacity=".12"/>
      <text x="320" y="300" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="17" fill="#3a2f63" opacity=".65">${label.replace(/[<>&"']/g, '')}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' '))}`;
  }

  function guard(img) {
    if (img.dataset.guarded) return;
    img.dataset.guarded = '1';
    img.addEventListener('error', () => {
      if (img.dataset.failed) return;
      img.dataset.failed = '1';
      img.src = placeholder(img.dataset.asset || img.alt || 'image');
    });
  }

  function guardAll(root) {
    (root || document).querySelectorAll('img[data-asset], img[data-guard], img').forEach(guard);
  }

  window.asset = function asset(name, folder) {
    if (!name) return placeholder('image');
    if (/^(https?:|data:|\/\/)/.test(name)) return name;
    const base = folder || 'projects';
    return `${LOCAL.replace('projects', base)}${String(name).replace(/^\/?projects\//, '')}`;
  };
  window.placeholderImage = placeholder;

  /* ---- Theme ------------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage blocked */ }
  }
  function currentTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  /* ---- Chrome ------------------------------------------------------------ */
  // Resources sits directly after Home, before the rest of the portfolio.
  const NAV = [
    { label: 'Home', href: 'index.html' },
    { label: 'Resources', href: 'resources.html' },
    { label: 'Work', href: 'work.html' },
    { label: 'Services', href: 'services.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Process', href: 'index.html#process' },
    { label: 'Contact', href: 'contact.html' },
  ];

  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isCurrent = (href) => !href.includes('#') && (href.toLowerCase() === here || (href === 'resources.html' && here === 'tools.html'));

  function mark() {
    document.querySelectorAll('[data-nav]').forEach((a) => {
      if (isCurrent(a.getAttribute('href'))) a.setAttribute('aria-current', 'page');
    });
  }

  function renderHeader() {
    const host = document.querySelector('[data-header]');
    if (!host) return;
    host.innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <header class="site-header" data-sticky>
        <div class="shell header-inner">
          <a class="brand" href="index.html" aria-label="${SITE.name} — home">
            <span class="brand__mark">
              <img data-asset="lulamile.webp" src="assets/img/lulamile.webp" alt="" width="32" height="32" />
            </span>
            <span>${SITE.name}<small>${SITE.brandLine}</small></span>
          </a>
          <nav class="nav" aria-label="Primary" data-nav-list>
            ${NAV.map((item) => `<a href="${item.href}" data-nav ${item.href === 'resources.html' ? 'data-flag title="Resources — toolkit, prompts and reading"' : ''}>${item.label}</a>`).join('')}
          </nav>
          <div class="header-actions">
            <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Toggle colour theme">
              <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
              <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
            </button>
            <a class="btn btn--accent" href="contact.html">Book a Free Call</a>
            <button class="icon-btn menu-btn" type="button" data-menu-open aria-label="Open menu" aria-expanded="false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
          </div>
        </div>
      </header>
      <div class="drawer" data-drawer role="dialog" aria-modal="true" aria-label="Menu">
        <div class="drawer__top">
          <span class="brand"><span>${SITE.name}<small>Menu</small></span></span>
          <button class="icon-btn" type="button" data-menu-close aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <nav aria-label="Mobile">
          ${NAV.map((item) => `<a href="${item.href}" data-nav>${item.label}</a>`).join('')}
          <div class="drawer__foot">
            <a class="btn btn--accent" href="contact.html">Book a Free Call</a>
            <a class="btn btn--ghost" href="${SITE.resume}" target="_blank" rel="noopener">View CV</a>
          </div>
        </nav>
      </div>`;

    mark();

    const drawer = host.querySelector('[data-drawer]');
    const openBtn = host.querySelector('[data-menu-open]');
    const closeBtn = host.querySelector('[data-menu-close]');

    const setOpen = (open) => {
      drawer.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) drawer.querySelector('a, button')?.focus();
      else openBtn.focus();
    };

    openBtn.addEventListener('click', () => setOpen(true));
    closeBtn.addEventListener('click', () => setOpen(false));
    drawer.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) setOpen(false);
    });

    host.querySelector('[data-theme-toggle]').addEventListener('click', () => {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });

    /* Sticky header hides on scroll down, returns on scroll up. */
    const bar = host.querySelector('[data-sticky]');
    let last = window.scrollY;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y > 220 && y > last + 4) bar.classList.add('is-hidden');
          else if (y < last - 4 || y < 120) bar.classList.remove('is-hidden');
          last = y;
          ticking = false;
        });
      },
      { passive: true },
    );
  }

  function renderFooter() {
    const host = document.querySelector('[data-footer]');
    if (!host) return;
    const year = new Date().getFullYear();
    host.innerHTML = `
      <footer class="site-footer">
        <div class="shell">
          <div class="footer-top">
            <div>
              <h3>Thanks for the visit.</h3>
              <p class="lede" style="font-size:0.95rem">${SITE.contactMessage}</p>
              <div class="row" style="margin-top:1.2rem">
                <a class="btn btn--accent" href="contact.html">Book a Free Call</a>
                <a class="btn btn--ghost" href="${SITE.resume}" target="_blank" rel="noopener">View CV</a>
              </div>
            </div>
            <div class="footer-col">
              <h4>Explore</h4>
              ${NAV.filter((item) => !item.href.includes('#'))
                .map((item) => `<a href="${item.href}">${item.label}</a>`)
                .join('')}
            </div>
            <div class="footer-col">
              <h4>Elsewhere</h4>
              <a href="mailto:${SITE.email}">${SITE.email}</a>
              <a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
              <a href="${SITE.github}" target="_blank" rel="noopener">GitHub</a>
              <a href="${SITE.portfolio}" target="_blank" rel="noopener">Original portfolio</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${year} ${SITE.name}. ${SITE.location}.</span>
            <span>Designed &amp; built by Lulamile Mkhungela · Independent professional practice</span>
          </div>
        </div>
      </footer>`;
  }

  /* ---- Reveal on scroll -------------------------------------------------- */
  function reveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---- Boot -------------------------------------------------------------- */
  function boot() {
    renderHeader();
    renderFooter();
    guardAll(document);
    reveal();

    // Anything injected later (filtering, tabs, carousels) is guarded too.
    new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.tagName === 'IMG') guard(node);
          guardAll(node);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* Small shared helpers */
  const esc = (text) => String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  window.LM = {
    esc,
    initials(name) {
      return String(name || '').split(/\s+/).slice(0, 2).map((word) => word[0] || '').join('').toUpperCase();
    },
    mdInline(text) {
      if (!text) return '';
      return esc(text)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*(?!\s)([^*]+?)\*/g, '<em>$1</em>')
        .replace(/\n{2,}/g, '<br /><br />')
        .replace(/\n/g, '<br />');
    },
    md(text) {
      if (!text) return '';
      return `<p>${window.LM.mdInline(text).replace(/(<br \/>){2,}/g, '</p><p>')}</p>`;
    },
    reveal,
    guardAll,
  };
})();
