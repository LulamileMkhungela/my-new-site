/**
 * Shared chrome for Lulamile Mkhungela's professional site.
 * Images are local-first; nothing falls back to another designer's website.
 */
(function () {
  const SITE = window.SITE;
  const THEME_KEY = 'lm-theme';

  function placeholder(name) {
    const label = String(name || 'Preview').replace(/[-_]/g, ' ').replace(/\.\w+$/, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><rect width="640" height="400" fill="#e8e4f0"/><rect x="24" y="24" width="592" height="352" rx="18" fill="none" stroke="#b9b0cc"/><text x="320" y="190" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" font-weight="600" fill="#39304f">${label.replace(/[<>&"']/g, '')}</text><text x="320" y="226" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" fill="#655b78">Lulamile Mkhungela</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function asset(name, folder) {
    if (!name) return placeholder('Preview');
    if (/^(https?:|data:|\/\/)/.test(name)) return name;
    const base = folder || 'projects';
    return `assets/img/${base}/${String(name).replace(/^\/+/, '')}`;
  }

  function guard(img) {
    if (img.dataset.guarded) return;
    img.dataset.guarded = '1';
    img.addEventListener('error', () => {
      if (img.dataset.failed) return;
      img.dataset.failed = '1';
      img.src = placeholder(img.dataset.asset || img.alt || 'Preview');
    });
  }
  function guardAll(root) {
    (root || document).querySelectorAll('img').forEach(guard);
  }

  window.asset = asset;
  window.placeholderImage = placeholder;

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage may be blocked */ }
  }
  function currentTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  const NAV = [
    { label: 'Home', href: 'index.html' },
    { label: 'Resources', href: 'resources.html' },
    { label: 'Work', href: 'work.html' },
    { label: 'Services', href: 'services.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Contact', href: 'contact.html' },
  ];
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isCurrent = (href) => !href.includes('#') && (href.toLowerCase() === here || (href === 'resources.html' && here === 'tools.html'));

  function renderHeader() {
    const host = document.querySelector('[data-header]');
    if (!host) return;
    host.innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <header class="site-header" data-sticky>
        <div class="shell header-inner">
          <a class="brand" href="index.html" aria-label="${SITE.name} — home">
            <span class="brand__mark"><img src="assets/img/lulamile.webp" alt="" width="32" height="32" /></span>
            <span>${SITE.name}<small>${SITE.brandLine}</small></span>
          </a>
          <nav class="nav" aria-label="Primary">
            ${NAV.map((item) => `<a href="${item.href}" data-nav${isCurrent(item.href) ? ' aria-current="page"' : ''}>${item.label}</a>`).join('')}
          </nav>
          <div class="header-actions">
            <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Toggle colour theme">
              <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
              <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
            </button>
            <a class="btn btn--accent header-cta" href="contact.html">Let’s talk</a>
            <button class="icon-btn menu-btn" type="button" data-menu-open aria-label="Open menu" aria-expanded="false" aria-controls="site-menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
          </div>
        </div>
      </header>
      <div class="drawer" id="site-menu" data-drawer role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true">
        <div class="drawer__top">
          <span class="brand"><span>${SITE.shortName}<small>Menu</small></span></span>
          <button class="icon-btn" type="button" data-menu-close aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <nav aria-label="Mobile">
          ${NAV.map((item) => `<a href="${item.href}" data-nav${isCurrent(item.href) ? ' aria-current="page"' : ''}>${item.label}</a>`).join('')}
          <div class="drawer__foot">
            <a class="btn btn--accent" href="contact.html">Let’s talk</a>
            <a class="btn btn--ghost" href="${SITE.resume}" target="_blank" rel="noopener">View CV</a>
          </div>
        </nav>
      </div>`;

    const drawer = host.querySelector('[data-drawer]');
    const openBtn = host.querySelector('[data-menu-open]');
    const closeBtn = host.querySelector('[data-menu-close]');
    const pageContent = [document.querySelector('main'), document.querySelector('[data-footer]')];
    const setOpen = (open) => {
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('nav-open', open);
      openBtn.setAttribute('aria-expanded', String(open));
      pageContent.forEach((el) => { if (el) el.inert = open; });
      if (open) closeBtn.focus();
      else openBtn.focus();
    };
    openBtn.addEventListener('click', () => setOpen(true));
    closeBtn.addEventListener('click', () => setOpen(false));
    drawer.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (event) => {
      if (!drawer.classList.contains('is-open')) return;
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Tab') {
        const focusable = [...drawer.querySelectorAll('a[href], button:not([disabled])')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    host.querySelector('[data-theme-toggle]').addEventListener('click', () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'));

    const bar = host.querySelector('[data-sticky]');
    let last = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 220 && y > last + 4) bar.classList.add('is-hidden');
        else if (y < last - 4 || y < 120) bar.classList.remove('is-hidden');
        last = y;
        ticking = false;
      });
    }, { passive: true });
  }

  function renderFooter() {
    const host = document.querySelector('[data-footer]');
    if (!host) return;
    host.innerHTML = `
      <footer class="site-footer">
        <div class="shell">
          <div class="footer-top">
            <div>
              <h3>Let’s make the next step clear.</h3>
              <p class="lede" style="font-size:.95rem">${SITE.contactMessage}</p>
              <div class="row" style="margin-top:1.2rem">
                <a class="btn btn--accent" href="contact.html">Start a conversation</a>
                <a class="btn btn--ghost" href="${SITE.resume}" target="_blank" rel="noopener">View CV</a>
              </div>
            </div>
            <div class="footer-col">
              <h4>Explore</h4>
              ${NAV.map((item) => `<a href="${item.href}">${item.label}</a>`).join('')}
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
            <span>© ${new Date().getFullYear()} ${SITE.name}. ${SITE.location}.</span>
            <span>Designed &amp; built by Lulamile Mkhungela · Independent professional practice</span>
          </div>
        </div>
      </footer>`;
  }

  function reveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    items.forEach((el) => io.observe(el));
  }

  const esc = (text) => String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  window.LM = {
    esc,
    initials: (name) => String(name || '').split(/\s+/).slice(0, 2).map((word) => word[0] || '').join('').toUpperCase(),
    mdInline(text) {
      return esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*(?!\s)([^*]+?)\*/g, '<em>$1</em>').replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
    },
    md(text) { return text ? `<p>${window.LM.mdInline(text).replace(/(<br>){2,}/g, '</p><p>')}</p>` : ''; },
    reveal,
    guardAll,
  };

  function boot() {
    renderHeader();
    renderFooter();
    guardAll(document);
    reveal();
    new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG') guard(node);
        guardAll(node);
        if (node.hasAttribute('data-reveal') || node.querySelector?.('[data-reveal]')) reveal();
      }));
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
