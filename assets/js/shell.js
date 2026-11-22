/**
 * Shell — header, mobile drawer, theme, footer, reveal-on-scroll, image fallback.
 *
 * Images live in assets/img/projects/. Anything not present locally is
 * requested from the original site, so a missing file is never a broken image:
 *   1. assets/img/projects/<name>          (local, fast, versioned)
 *   2. https://shubhamranjan-portfolio.vercel.app/projects/<name>
 *   3. an inline generated placeholder, so a failed network still reads.
 */
(function () {
  const SITE = window.SITE;
  const REMOTE = 'https://shubhamranjan-portfolio.vercel.app/projects/';
  const LOCAL = 'assets/img/projects/';

  /* ---- Image resolution -------------------------------------------------- */

  /** Inline SVG placeholder, tinted, with the asset name on it. */
  function placeholder(name) {
    const label = (name || 'image').replace(/[-_]/g, ' ').replace(/\.\w+$/, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e6e1f2"/><stop offset="1" stop-color="#d5cfe8"/>
      </linearGradient></defs>
      <rect width="640" height="480" fill="url(#g)"/>
      <circle cx="320" cy="216" r="46" fill="#3a2f63" opacity=".12"/>
      <text x="320" y="300" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="17" fill="#3a2f63" opacity=".65">${label}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' '))}`;
  }

  /**
   * Wire an <img> so it tries the local file, then the original site, then a
   * placeholder. `src` in the markup is already the local path, so nothing
   * shifts if the file is there.
   */
  function guard(img) {
    if (img.dataset.guarded) return;
    img.dataset.guarded = '1';
    const name = img.dataset.asset || img.getAttribute('src') || '';
    const file = name.split('/').pop();
    img.addEventListener(
      'error',
      () => {
        if (img.dataset.stage === 'remote') {
          img.dataset.stage = 'placeholder';
          img.src = placeholder(file);
          return;
        }
        if (img.dataset.stage === undefined) {
          img.dataset.stage = 'remote';
          if (img.src.indexOf(REMOTE) === -1) {
            img.src = REMOTE + file;
            return;
          }
        }
        img.dataset.stage = 'placeholder';
        img.src = placeholder(file);
      },
      { once: false },
    );
  }

  function guardAll(root) {
    (root || document).querySelectorAll('img[data-asset], img[data-guard]').forEach(guard);
  }

  /* ---- Asset URL helpers (used by the page scripts) ---------------------- */
  window.asset = function asset(name, folder) {
    if (!name) return placeholder('image');
    if (/^(https?:|data:|\/\/)/.test(name)) return name;
    const base = folder || 'projects';
    return `${LOCAL.replace('projects', base)}${String(name).replace(/^\/?projects\//, '')}`;
  };
  window.remoteAsset = (name) => REMOTE + String(name).replace(/^\/?projects\//, '');
  window.placeholderImage = placeholder;

  /* ---- Theme ------------------------------------------------------------- */
  const KEY = 'sr-theme';

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      /* storage blocked — the attribute still applies for this page */
    }
  }

  function currentTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  /* ---- Chrome ------------------------------------------------------------ */
  // Tools sits directly after Home, before the rest of the portfolio.
  const NAV = [
    { label: 'Home', href: 'index.html' },
    { label: 'Tools', href: 'tools.html' },
    { label: 'Work', href: 'work.html' },
    { label: 'My Services', href: 'services.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Process', href: 'index.html#process' },
    { label: 'Contact', href: 'contact.html' },
  ];

  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isCurrent = (href) => !href.includes('#') && href.toLowerCase() === here;

  function mark() {
    document.querySelectorAll('[data-nav]').forEach((a) => {
      if (isCurrent(a.getAttribute('href'))) a.setAttribute('aria-current', 'page');
    });
  }

  function renderHeader() {
    const host = document.querySelector('[data-header]');
    if (!host) return;
    const links = [
      {label:'Home',href:'/'}, {label:'Tools',href:'/tools.html'},
      {label:'My Services',href:'/services/'}, {label:'Portfolio',href:'/work.html'},
      {label:'About',href:'/about/'}
    ];
    const active = href => location.pathname.replace(/\/$/, '') === href.replace(/\/$/, '');
    const navLinks = links.map(item => `<a href="${item.href}" ${active(item.href) ? 'aria-current="page" class="is-active"' : ''}>${item.label}</a>`).join('');
    host.innerHTML = `
      <header class="rhino-header">
        <a class="rhino-skip" href="#main">Skip to content</a>
        <div class="rhino-header-main">
          <a href="/" class="rhino-wordmark" aria-label="Lulamile M — Home"><span class="rhino-monogram" aria-hidden="true">LM</span><span>Lulamile<strong>M.</strong></span></a>
          <nav class="rhino-primary" aria-label="Main navigation">${navLinks}</nav>
          <div class="rhino-header-actions">
            <a href="/services/" class="rhino-mobile-services">My Services</a>
            <a href="/contact/" class="rhino-contact">Let’s Talk <span aria-hidden="true">↗</span></a>
            <button type="button" class="rhino-menu-button" aria-label="Open navigation" aria-expanded="false" aria-controls="rhino-mobile-menu">☰</button>
          </div>
        </div>
        <nav id="rhino-mobile-menu" class="rhino-mobile-menu" aria-label="Mobile navigation" hidden>${navLinks}</nav>
        <nav class="hybrid-service-nav" aria-label="Explore services"><div class="hybrid-service-nav-inner">
          ${(window.SERVICE_NAV || []).map(item => `<a href="${item.href}">${item.title}</a>`).join('')}
        </div></nav>
      </header>`;
    const button = host.querySelector('.rhino-menu-button');
    const menu = host.querySelector('#rhino-mobile-menu');
    const setOpen = open => {
      menu.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      button.textContent = open ? '✕' : '☰';
    };
    button.addEventListener('click', () => setOpen(menu.hidden));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
    // The host spans both rows and must stay sticky on the legacy static pages.
    host.style.position = 'sticky';
    host.style.top = '0';
    host.style.zIndex = '100';
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
              <h3>${SITE.contactMessage.split('.')[0]}.</h3>
              <p class="lede" style="font-size:0.95rem">${SITE.contactMessage}</p>
              <div class="row" style="margin-top:1.2rem">
                <a class="btn btn--accent" href="contact.html">Book a Free Call</a>
                <a class="btn btn--ghost" href="${SITE.resume}" target="_blank" rel="noopener">Download Resume</a>
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
              ${SITE.twitter ? `<a href="${SITE.twitter}" target="_blank" rel="noopener">X / Twitter</a>` : ''}
              <a href="${SITE.behance}" target="_blank" rel="noopener">Behance</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${year} ${SITE.name}. ${SITE.location}.</span>
            <span>Portfolio content from <a href="https://shubhamranjan-portfolio.vercel.app/" target="_blank" rel="noopener" style="text-decoration:underline">shubhamranjan-portfolio.vercel.app</a> · Tools from <a href="https://github.com/LulamileMkhungela/devzigner" target="_blank" rel="noopener" style="text-decoration:underline">devzigner</a></span>
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
  window.SR = {
    money: (n) => n,
    initials(name) {
      return (name || '')
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0] || '')
        .join('')
        .toUpperCase();
    },
    esc(text) {
      return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },
    /**
     * Minimal markdown, block level: **bold**, *italic*, `code`, paragraphs.
     * Only safe inside a container that is not already a <p> — use mdInline()
     * when the output goes inside one.
     */
    md(text) {
      if (!text) return '';
      return `<p>${window.SR.mdInline(text).replace(/\n{2,}/g, '</p><p>')}</p>`;
    },

    /** Markdown that stays inside a single paragraph; blank lines become <br>. */
    mdInline(text) {
      if (!text) return '';
      return window.SR.esc(text)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*(?!\s)([^*]+?)\*/g, '<em>$1</em>')
        .replace(/`/g, '')
        .replace(/\n{2,}/g, '<br /><br />')
        .replace(/\n/g, '<br />');
    },
  };
})();
