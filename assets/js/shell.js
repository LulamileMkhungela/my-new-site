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
  /**
   * Stand-in art for an image that has not been fetched yet (scripts/fetch-assets.sh
   * pulls the real ones). Logos get a wordmark; covers get a tinted plate with the
   * project name, so a page without its images still reads as a design, not as a
   * hole.
   */
  function placeholder(name) {
    const file = String(name || 'image');
    const base = file.split('/').pop().replace(/\.[a-z0-9]+$/i, '');
    const isLogo = /\.svg$/i.test(file) || /logo/i.test(file);
    const label = base
      .replace(/^(cover|img|image)[-_]/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b(logo|cover|desktop|mobile|flow|webp)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    const pretty = label.replace(/\b\w/g, (c) => c.toUpperCase());
    const safe = pretty.replace(/[<>&"]/g, '');

    if (isLogo) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 56">
        <text x="100" y="36" text-anchor="middle" font-family="Inter, system-ui, sans-serif"
          font-size="19" font-weight="600" letter-spacing="-0.4"
          fill="#3a2f63" fill-opacity="0.55">${safe}</text>
      </svg>`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' '))}`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ded8ef"/>
          <stop offset="0.55" stop-color="#d3cbe8"/>
          <stop offset="1" stop-color="#c6bbdf"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0" r="0.8">
          <stop offset="0" stop-color="#ff6b35" stop-opacity="0.18"/>
          <stop offset="1" stop-color="#ff6b35" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#g)"/>
      <rect width="800" height="600" fill="url(#glow)"/>
      <circle cx="400" cy="250" r="64" fill="none" stroke="#3a2f63" stroke-opacity="0.14" stroke-width="2"/>
      <circle cx="400" cy="250" r="8" fill="#3a2f63" fill-opacity="0.18"/>
      <text x="400" y="380" text-anchor="middle" font-family="Inter, system-ui, sans-serif"
        font-size="30" font-weight="600" letter-spacing="-0.6"
        fill="#3a2f63" fill-opacity="0.72">${safe}</text>
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

    /* While the fallback chain is running, a broken image paints the alt text
       and the browser's broken-image glyph inside the frame. Hide it until it
       has decoded something, so a missing cover never leaks its filename. */
    const settle = () => {
      img.classList.remove('is-pending');
      if (img.naturalWidth > 0) img.classList.add('is-ready');
    };
    if (!(img.complete && img.naturalWidth > 0)) img.classList.add('is-pending');
    img.addEventListener('load', settle);

    /* One attempt per destination, tracked in a Set rather than a single
       `stage` string, so an error that arrives after the placeholder has been
       assigned can't start the chain over from the top and loop forever. */
    const tried = new Set();
    if (img.src.indexOf(REMOTE) !== -1) tried.add('remote');

    const advance = () => {
      if (!tried.has('remote')) {
        tried.add('remote');
        img.src = REMOTE + file;
        return;
      }
      if (!tried.has('placeholder')) {
        tried.add('placeholder');
        img.src = placeholder(file);
      }
    };

    img.addEventListener('error', advance, { once: false });

    /* The local file may have already 404'd before this ran — a `complete` image
       with no intrinsic width is broken, and its error event has been and gone.
       Advance by hand instead of leaving the frame empty forever. */
    if (img.complete && img.naturalWidth === 0 && !tried.has('remote')) advance();
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
  // The reference nav: Home, then a dropdown for the areas of practice,
  // then About, and one accent pill for the call.
  // Exactly the reference nav, in its order: Home, the Expertise dropdown,
  // About, and one accent pill. Work and Tools stay reachable from the drawer
  // and the footer rather than crowding the bar.
  const NAV = [
    { label: 'Home', href: 'index.html' },
    { label: 'About', href: 'about.html' },
  ];

  // Secondary links — drawer and footer only.
  const MORE = [
    { label: 'Work', href: 'work.html' },
    { label: 'Tools', href: 'tools.html' },
    { label: 'Services', href: 'services.html' },
    { label: 'Contact', href: 'contact.html' },
  ];

  // Exactly the four areas of work, each anchoring to its block on
  // expertise.html. ProdOps is not a fifth entry — it is filed inside Product
  // Design & Strategy (#prodops), the area it belongs to.
  const EXPERTISE = [
    {
      label: 'Product Design & Strategy',
      href: 'service.html?id=product',
      icon: 'PD',
      hue: 220,
      description: 'From messy problem to working product.',
    },
    {
      label: 'Brand Strategy & Amazon Growth',
      href: 'service.html?id=brand',
      icon: 'BR',
      hue: 30,
      description: 'From invisible listing to converting brand.',
    },
    {
      label: 'Microfinance & Impact Consulting',
      href: 'service.html?id=impact',
      icon: 'MF',
      hue: 160,
      description: 'Designing for the people most products forget.',
    },
    {
      label: 'Website Design & Conversion',
      href: 'service.html?id=web',
      icon: 'WD',
      hue: 260,
      description: 'A website that works as hard as you do.',
    },
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

    const onExpertise = here === 'expertise.html' || here === 'service.html';
    const hereId = here === 'service.html'
      ? (new URLSearchParams(location.search).get('id') || 'product')
      : here === 'expertise.html'
        ? (location.hash || '').replace('#', '')
        : '';
    const navLink = (item) => {
      const current = isCurrent(item.href) ? ' aria-current="page"' : '';
      return `<a href="${item.href}" data-nav${current}>${item.label}</a>`;
    };

    host.innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <header class="site-header" data-sticky>
        <div class="shell header-inner">
          <a class="brand" href="index.html" aria-label="${SITE.name} — home">
            <span class="brand__mark">
              <img data-asset="lulamile.webp" src="assets/img/lulamile.webp" alt="" width="40" height="40" />
            </span>
            <span>${SITE.name}<small>${SITE.location}</small></span>
          </a>
          <div class="header-actions">
            <nav class="nav" aria-label="Primary" data-nav-list>
              ${navLink(NAV[0])}
              <div class="nav-drop" data-nav-drop>
                <button type="button" aria-haspopup="true" aria-expanded="false" aria-controls="expertise-panel"${onExpertise ? ' aria-current="page"' : ''}>
                  Expertise
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div class="nav-drop__panel" id="expertise-panel">
                  <div class="nav-drop__list">
                    ${EXPERTISE.map(
                      (item) => `
                      <a class="nav-drop__item" href="${item.href}"${item.href.endsWith('=' + hereId) ? ' aria-current="page"' : ''}>
                        <span class="nav-drop__icon" style="background:hsl(${item.hue} 60% 55% / 0.12);color:hsl(${item.hue} 60% 55%)">${item.icon}</span>
                        <span><strong>${item.label}</strong><span>${item.description}</span></span>
                      </a>`,
                    ).join('')}
                  </div>
                </div>
              </div>
              ${navLink(NAV[1])}
              <a class="btn btn--accent" href="contact.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>
                Book a Call
              </a>
            </nav>
            <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Toggle colour theme">
              <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
              <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
            </button>
            <button class="icon-btn menu-btn" type="button" data-menu-open aria-label="Open menu" aria-expanded="false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
          </div>
        </div>
      </header>
      <div class="drawer" data-drawer role="dialog" aria-modal="true" aria-label="Menu">
        <div class="drawer__top">
          <span class="brand">
            <span class="brand__mark"><img data-asset="lulamile.webp" src="assets/img/lulamile.webp" alt="" width="40" height="40" /></span>
            <span>${SITE.name}<small>Menu</small></span>
          </span>
          <button class="icon-btn" type="button" data-menu-close aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <nav aria-label="Mobile">
          ${NAV.map((item) => `<a href="${item.href}" data-nav${isCurrent(item.href) ? ' aria-current="page"' : ''}>${item.label}</a>`).join('')}
          <p class="drawer__label">Expertise</p>
          ${EXPERTISE.map(
            (item) => `<a href="${item.href}" data-nav>${item.label}</a>`,
          ).join('')}
          <p class="drawer__label">More</p>
          ${MORE.filter((item) => item.href !== 'contact.html').map((item) => `<a href="${item.href}" data-nav${isCurrent(item.href) ? ' aria-current="page"' : ''}>${item.label}</a>`).join('')}
          <div class="drawer__foot">
            <a class="btn btn--accent" href="contact.html">Book a Call</a>
            <a class="btn btn--ghost" href="${SITE.resume}" target="_blank" rel="noopener">Download Resume</a>
          </div>
        </nav>
      </div>`;

    mark();

    /* Expertise panel: opens on hover and on click, closes on Escape/blur. */
    const drop = host.querySelector('[data-nav-drop]');
    const dropBtn = drop.querySelector('button');
    let closeTimer;
    let openedByHover = false;
    const setOpen = (open) => {
      drop.toggleAttribute('data-open', open);
      dropBtn.setAttribute('aria-expanded', String(open));
      if (!open) openedByHover = false;
    };
    const openNow = () => {
      clearTimeout(closeTimer);
      if (!drop.hasAttribute('data-open')) openedByHover = true;
      setOpen(true);
    };
    const closeSoon = () => {
      closeTimer = setTimeout(() => setOpen(false), 180);
    };
    drop.addEventListener('mouseenter', openNow);
    drop.addEventListener('mouseleave', closeSoon);

    // A click on the trigger must not close a panel that hover just opened —
    // that is what made the items impossible to reach with a mouse. Once the
    // pointer leaves, the panel is hover-driven again.
    dropBtn.addEventListener('click', () => {
      if (drop.hasAttribute('data-open') && openedByHover) {
        openedByHover = false;
        return;
      }
      setOpen(!drop.hasAttribute('data-open'));
    });

    // Keyboard: open with Enter/Space (native button), move with the arrow keys.
    drop.addEventListener('keydown', (event) => {
      const items = [...drop.querySelectorAll('.nav-drop__item')];
      const at = items.indexOf(document.activeElement);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setOpen(true);
        (items[at + 1] || items[0])?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        (items[at - 1] || items[items.length - 1])?.focus();
      }
    });
    drop.addEventListener('focusout', (event) => {
      if (!drop.contains(event.relatedTarget)) setOpen(false);
    });
    document.addEventListener('mousedown', (event) => {
      if (!drop.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && drop.hasAttribute('data-open')) {
        setOpen(false);
        dropBtn.focus();
      }
    });

    const drawer = host.querySelector('[data-drawer]');
    const openBtn = host.querySelector('[data-menu-open]');
    const closeBtn = host.querySelector('[data-menu-close]');

    const setDrawer = (open) => {
      drawer.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) drawer.querySelector('a, button')?.focus();
      else openBtn.focus();
    };

    openBtn.addEventListener('click', () => setDrawer(true));
    closeBtn.addEventListener('click', () => setDrawer(false));
    drawer.addEventListener('click', (event) => {
      if (event.target.closest('a')) setDrawer(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
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
          bar.classList.toggle('is-hidden', y >= 60 && y > last + 4);
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
              <h3>${SITE.name}</h3>
              <p>${SITE.contactMessage}</p>
            </div>
            <div class="footer-inline">
              <a href="mailto:${SITE.email}">${SITE.email}</a>
              <div class="footer-social">
                <a href="${SITE.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.9 8.65 23 11 23 14.3V21h-4v-6c0-1.5-.54-2.5-1.9-2.5-1.04 0-1.66.7-1.93 1.37-.1.24-.13.58-.13.92V21h-4z"/></svg>
                </a>
                <a href="https://github.com/LulamileMkhungela" target="_blank" rel="noopener" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
                </a>
                <a href="${SITE.behance}" target="_blank" rel="noopener" aria-label="Portfolio archive">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 4h7a4 4 0 0 1 0 8H4zM4 12h7.5a4 4 0 0 1 0 8H4z"/><path d="M16.5 6h5M15.5 14h6a3 3 0 0 0-6 0v1a3 3 0 0 0 5.4 1.8"/></svg>
                </a>
              </div>
            </div>
          </div>
          <nav class="footer-nav" aria-label="Footer">
            ${[...NAV, ...MORE].filter((item, index, list) => list.findIndex((other) => other.href === item.href) === index)
              .map((item) => `<a href="${item.href}"${isCurrent(item.href) ? ' aria-current="page"' : ''}>${item.label}</a>`)
              .join('')}
            ${EXPERTISE.map((item) => `<a href="${item.href}">${item.label}</a>`).join('')}
          </nav>
          <div class="footer-bottom">
            <span>© ${year} ${SITE.name}. All rights reserved. ${SITE.location}.</span>
            <span>Case-study content from the portfolio archive · Tools from <a href="https://github.com/LulamileMkhungela/devzigner" target="_blank" rel="noopener">devzigner</a></span>
          </div>
        </div>
      </footer>`;
  }

  /* ---- Page transitions -------------------------------------------------- */
  /**
   * The reference wipes between pages with two accent panels that close over the
   * old page and part again on the new one. Same idea here, done with the
   * ordinary multi-page navigation: intercept an internal link, close the
   * curtains, then go. Links keep working with JS off, in a new tab, and for
   * anything the script should not own (external, mailto, hash, downloads).
   */
  function transitions() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const curtain = document.createElement('div');
    curtain.className = 'curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.innerHTML = '<span></span><span></span>';
    document.body.appendChild(curtain);

    const here = location.pathname.split('/').pop() || 'index.html';
    const samePage = (href) => {
      const [path, hash] = href.split('#');
      const file = path.split('/').pop() || here;
      return file === here || (!path && hash);
    };

    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || /^(https?:|mailto:|tel:|#|data:)/.test(href)) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      if (samePage(href)) return; // in-page anchors and same-document links stay instant
      if (!/\.html(\?|#|$)/.test(href)) return;

      event.preventDefault();
      curtain.classList.add('is-closing');
      setTimeout(() => {
        location.href = href;
      }, 430);
    });

    // Coming back via the bfcache should never leave the curtain closed.
    window.addEventListener('pageshow', () => curtain.classList.remove('is-closing'));
  }

  /* ---- Ambient music player ---------------------------------------------- */
  /**
   * The reference's floating player: three ambient tracks, a volume slider and
   * a now-playing line. Off by default, never autoplays (browsers block it and
   * it would be rude), remembers the volume for the session.
   */
  const TRACKS = [
    { id: 'focus-1', label: 'Sentimental Jazzy', genre: 'Lo-fi', src: 'https://cdn.pixabay.com/audio/2026/01/25/audio_1dd7f3126d.mp3' },
    { id: 'focus-2', label: 'Peaceful Piano', genre: 'Modern Classical', src: 'https://cdn.pixabay.com/audio/2024/08/15/audio_6a3249cbfa.mp3' },
    { id: 'focus-3', label: 'Focus & Relaxation', genre: 'Ambient', src: 'https://cdn.pixabay.com/audio/2025/05/15/audio_ba956a1042.mp3' },
  ];

  function player() {
    if (document.querySelector('[data-player]')) return;

    const host = document.createElement('div');
    host.className = 'player';
    host.setAttribute('data-player', '');
    host.innerHTML = `
      <div class="player__panel" role="dialog" aria-label="Ambient music player" aria-hidden="true">
        <div class="player__head">
          <span class="player__label"><span class="player__bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span> Ambient</span>
          <button class="player__stop" type="button" data-player-stop hidden>Stop</button>
        </div>
        <div class="player__tracks">
          ${TRACKS.map(
            (track) => `
            <button class="player__track" type="button" data-track="${track.id}">
              <span>
                <strong>${track.label}</strong>
                <small>${track.genre}</small>
              </span>
              <span class="player__play" aria-hidden="true"></span>
            </button>`,
          ).join('')}
        </div>
        <div class="player__volume">
          <span aria-hidden="true">♪</span>
          <input type="range" min="0" max="1" step="0.01" value="0.35" aria-label="Volume" data-volume />
          <span aria-hidden="true">♪♪</span>
        </div>
        <div class="player__now" data-now hidden><span>Now playing</span><strong></strong></div>
      </div>
      <button class="player__toggle" type="button" data-player-toggle aria-label="Open ambient music player" aria-expanded="false">
        <span aria-hidden="true">♫</span>
      </button>`;
    document.body.appendChild(host);

    const audio = new Audio();
    audio.loop = true;
    let volume = 0.35;
    audio.volume = volume;
    let current = null;
    let playing = false;
    const panel = host.querySelector('.player__panel');
    const toggle = host.querySelector('[data-player-toggle]');
    const stop = host.querySelector('[data-player-stop]');
    const now = host.querySelector('[data-now]');

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close music player' : 'Open ambient music player');
      panel.setAttribute('aria-hidden', String(!open));
      host.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

    const paint = () => {
      host.classList.toggle('is-playing', playing);
      stop.hidden = !playing;
      host.querySelectorAll('[data-track]').forEach((button) => {
        const isCurrent = button.dataset.track === current;
        button.classList.toggle('is-current', isCurrent);
        button.classList.toggle('is-playing', isCurrent && playing);
      });
      const track = TRACKS.find((item) => item.id === current);
      now.hidden = !(playing && track);
      if (track && playing) now.querySelector('strong').textContent = `${track.genre} — ${track.label}`;
    };

    const silence = () => {
      audio.pause();
      playing = false;
      current = null;
      paint();
    };

    host.querySelectorAll('[data-track]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.track;
        const track = TRACKS.find((item) => item.id === id);
        if (!track) return;
        if (current === id && playing) {
          audio.pause();
          playing = false;
          paint();
          return;
        }
        if (current !== id) {
          audio.src = track.src;
          audio.load();
          audio.volume = volume;
          current = id;
        }
        audio
          .play()
          .then(() => {
            playing = true;
            paint();
          })
          .catch(() => {
            playing = false;
            paint();
          });
      });
    });

    stop.addEventListener('click', silence);

    const slider = host.querySelector('[data-volume]');
    slider.addEventListener('input', () => {
      volume = Number(slider.value);
      audio.volume = volume;
      slider.style.setProperty('--v', `${volume * 100}%`);
    });
    slider.style.setProperty('--v', `${volume * 100}%`);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && host.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('mousedown', (event) => {
      if (host.classList.contains('is-open') && !host.contains(event.target)) setOpen(false);
    });

    paint();
  }

  /* ---- Intro splash ------------------------------------------------------ */
  /**
   * The reference opens on a time-of-day greeting — "Good Evening / Great
   * things take time." — with the letters rising in, a line drawing itself, then
   * the two halves of the screen sliding apart to reveal the page.
   *
   * Once per browser session (not on every navigation), skippable on click or
   * any key, and skipped entirely under prefers-reduced-motion.
   */
  function greeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { word: 'Good Morning', sub: 'The day is yours.' };
    if (hour >= 12 && hour < 17) return { word: 'Good Afternoon', sub: "Let's make it count." };
    if (hour >= 17 && hour < 21) return { word: 'Good Evening', sub: 'Great things take time.' };
    return { word: 'Good Night', sub: 'Still here. So are we.' };
  }

  function intro() {
    const KEY = 'lm-intro-seen';
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      if (reduced || sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, '1');
    } catch (e) {
      return; // storage blocked — do not risk trapping the visitor behind an overlay
    }

    const { word, sub } = greeting();
    const root = document.createElement('div');
    root.className = 'intro';
    root.setAttribute('aria-live', 'polite');
    root.setAttribute('aria-label', 'Loading');
    root.innerHTML = `
      <div class="intro__half intro__half--top"></div>
      <div class="intro__half intro__half--bottom"></div>
      <div class="intro__stage">
        <p class="intro__word" aria-hidden="true">${word
          .split('')
          .map((char, index) => `<span style="animation-delay:${index * 38}ms">${char === ' ' ? '&nbsp;' : escHtml(char)}</span>`)
          .join('')}</p>
        <p class="intro__sub" style="animation-delay:${word.length * 38 + 80}ms">${sub}</p>
        <span class="intro__line" style="animation-delay:${word.length * 38 + 200}ms"></span>
        <p class="intro__welcome" style="animation-delay:${word.length * 38 + 350}ms">Welcome</p>
      </div>`;
    document.body.appendChild(root);
    document.body.classList.add('intro-open');

    let closed = false;
    const finish = () => {
      if (closed) return;
      closed = true;
      clearTimeout(timer);
      root.classList.add('is-leaving');
      document.body.classList.remove('intro-open');
      setTimeout(() => root.remove(), 700);
    };

    // 900ms with the greeting fully drawn, then the halves part.
    const timer = setTimeout(finish, 1550);
    root.addEventListener('click', finish);
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key) finish();
      },
      { once: true },
    );

    // The real announcement, as the reference does it — opt-in and silent-safe.
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`${word}. Welcome.`);
        utterance.rate = 0.88;
        utterance.pitch = 1.05;
        utterance.volume = 0.9;
        window.speechSynthesis.cancel();
        setTimeout(() => window.speechSynthesis.speak(utterance), 300);
      }
    } catch (e) {
      /* speech is decoration */
    }
  }

  function escHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---- Ambient aurora ---------------------------------------------------- */
  /**
   * The reference's living background: five soft radial gradients drifting on a
   * canvas behind the page, tinted per theme. It is the thing that makes the
   * layout feel alive while you read it, so it is worth the one canvas.
   *
   * Pauses when the tab is hidden, respects prefers-reduced-motion (a single
   * static frame), and steps down to a smaller canvas on low-core devices.
   */
  function aurora() {
    if (document.querySelector('.aurora')) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'aurora';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = () =>
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;

    let width = 0;
    let height = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // x/y as a fraction of the viewport, r as a fraction of the short edge.
    const blobs = [
      { x: 0.2, y: 0.2, r: 0.35, speed: 0.0004, phase: 0 },
      { x: 0.8, y: 0.6, r: 0.3, speed: 0.0003, phase: 2 },
      { x: 0.5, y: 0.15, r: 0.32, speed: 0.00035, phase: 4 },
      { x: 0.35, y: 0.8, r: 0.28, speed: 0.00025, phase: 1 },
      { x: 0.85, y: 0.25, r: 0.22, speed: 0.00045, phase: 3 },
    ];

    // [hue, saturation, lightness, alpha] — light, then dark.
    const lightTints = [
      [270, 65, 65, 0.17],
      [16, 85, 55, 0.18],
      [330, 60, 65, 0.15],
      [170, 70, 50, 0],
      [45, 70, 60, 0.1],
    ];
    const darkTints = [
      [270, 50, 40, 0.2],
      [170, 80, 40, 0.1],
      [210, 60, 35, 0.11],
      [330, 45, 35, 0.2],
      [45, 50, 35, 0.15],
    ];

    const isDark = () => (document.documentElement.dataset.theme || 'light') === 'dark';

    function frame(time) {
      ctx.clearRect(0, 0, width, height);
      const tints = isDark() ? darkTints : lightTints;
      blobs.forEach((blob, index) => {
        const [hue, saturation, lightness, alpha] = tints[index];
        if (!alpha) return;
        const x = width * (blob.x + 0.08 * Math.sin(time * blob.speed + blob.phase));
        const y = height * (blob.y + 0.06 * Math.cos(time * blob.speed * 0.8 + blob.phase));
        const radius = Math.min(width, height) * blob.r;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });
    }

    let raf = 0;
    const start = () => {
      if (raf || reduced()) return;
      raf = requestAnimationFrame(function loop(time) {
        frame(time);
        raf = requestAnimationFrame(loop);
      });
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    if (reduced()) frame(0);
    else start();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    // The theme toggle swaps the tints; a static frame needs repainting.
    new MutationObserver(() => {
      if (reduced()) frame(performance.now());
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
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
    intro();
    aurora();
    player();
    transitions();
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
