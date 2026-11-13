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
  const NAV = [
    { label: 'Home', href: 'index.html' },
    { label: 'Tools', href: 'tools.html' },
    { label: 'Work', href: 'work.html' },
    { label: 'Services', href: 'services.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Process', href: 'index.html#process' },
    { label: 'Contact', href: 'contact.html' },
  ];

  // Expertise is a hover/click dropdown, not a flat nav item: the four areas of
  // practice, each anchoring to its block on expertise.html, plus ProdOps.
  const EXPERTISE = [
    { label: 'Product design & strategy', href: 'expertise.html#product', icon: '01', blurb: 'Research, flows, prototyping, the system underneath.' },
    { label: 'Brand & growth', href: 'expertise.html#brand', icon: '02', blurb: 'Positioning, Amazon listings, conversion.' },
    { label: 'Microfinance & impact', href: 'expertise.html#impact', icon: '03', blurb: 'Products for the people most products forget.' },
    { label: 'Web design & conversion', href: 'expertise.html#web', icon: '04', blurb: 'Sites that earn trust and turn visitors into customers.' },
    { label: 'ProdOps', href: 'expertise.html#prodops', icon: 'PO', blurb: 'The role-based product workspace I own and build.' },
  ];

  // The dropdown sits where Expertise sits: after Work.
  const EXPERTISE_AFTER = 'work.html';

  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isCurrent = (href) => !href.includes('#') && href.toLowerCase() === here;

  function mark() {
    document.querySelectorAll('[data-nav]').forEach((a) => {
      if (isCurrent(a.getAttribute('href'))) a.setAttribute('aria-current', 'page');
    });
  }

  /** The Expertise dropdown markup — a button plus its panel. */
  function expertiseDrop() {
    const onExpertise = here === 'expertise.html';
    return `
      <div class="nav-drop" data-nav-drop>
        <button type="button" class="nav-drop__btn" aria-haspopup="true" aria-expanded="false" aria-controls="expertise-menu"${onExpertise ? ' aria-current="page"' : ''}>
          Expertise
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="nav-drop__panel" id="expertise-menu" role="menu" aria-label="Expertise">
          <p class="nav-drop__label">Areas of practice</p>
          ${EXPERTISE.map(
            (entry) => `
            <a class="nav-drop__item" role="menuitem" href="${entry.href}">
              <span class="nav-drop__num">${entry.icon}</span>
              <span class="nav-drop__text">
                <strong>${entry.label}</strong>
                <span>${entry.blurb}</span>
              </span>
            </a>`,
          ).join('')}
        </div>
      </div>`;
  }

  /** Hover opens the panel, click pins it, Escape and outside clicks close it. */
  function wireDrop(host) {
    const drop = host.querySelector('[data-nav-drop]');
    if (!drop) return;
    const btn = drop.querySelector('.nav-drop__btn');
    let closeTimer;

    const setOpen = (open) => {
      drop.toggleAttribute('data-open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    const openNow = () => {
      clearTimeout(closeTimer);
      setOpen(true);
    };
    const closeSoon = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => setOpen(false), 140);
    };

    drop.addEventListener('mouseenter', openNow);
    drop.addEventListener('mouseleave', closeSoon);
    drop.addEventListener('focusin', openNow);
    btn.addEventListener('click', () => setOpen(!drop.hasAttribute('data-open')));
    document.addEventListener('click', (event) => {
      if (!drop.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (drop.hasAttribute('data-open')) {
        setOpen(false);
        btn.focus();
      }
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
            ${NAV.map((item) => {
              const link = `<a href="${item.href}" data-nav ${item.href === 'tools.html' ? 'data-flag title="Tools — the builder toolkit"' : ''}>${item.label}</a>`;
              return item.href === EXPERTISE_AFTER ? link + expertiseDrop() : link;
            }).join('')}
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
          ${NAV.map((item) => {
            const link = `<a href="${item.href}" data-nav>${item.label}</a>`;
            return item.href === EXPERTISE_AFTER
              ? link +
                  `<p class="drawer__label">Expertise</p>` +
                  EXPERTISE.map(
                    (entry) => `<a href="${entry.href}" data-nav>${entry.label}</a>`,
                  ).join('')
              : link;
          }).join('')}
          <div class="drawer__foot">
            <a class="btn btn--accent" href="contact.html">Book a Free Call</a>
            <a class="btn btn--ghost" href="${SITE.resume}" target="_blank" rel="noopener">Download Resume</a>
          </div>
        </nav>
      </div>`;

    mark();
    wireDrop(host);

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
              <a href="https://github.com/LulamileMkhungela" target="_blank" rel="noopener">GitHub</a>
              <a href="https://lulamilemkhungela.github.io/ProdOps/" target="_blank" rel="noopener">ProdOps</a>
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
