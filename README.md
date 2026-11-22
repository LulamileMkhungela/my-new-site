# Lulamile M — portfolio & services

A South African designer/founder/builder portfolio with a navy/emerald visual
style, one shared React runtime, navigation and footer. Home sections 08/09,
the original three-step Process and six testimonials are retained. No Google
review widget is installed.

## Build and preview

Requires **Node 22+**; the build and static checks have **no npm dependencies**.

```sh
npm run build
npm test
npm run preview                  # Python 3 static server, port 3000
```

Publish **`dist/` only**, never the whole repository. The builder pre-renders
30 active pages from the same readable UI components used in the browser,
including service/project deep links. Basic content and links work without JS;
JS enables mobile menus, portfolio filtering, prompt copy, modal enquiries and
inline form feedback. `404.html` is provided; do not add a wildcard 200 SPA rewrite
that makes unknown URLs appear to be valid pages.

Generated runtime/HTML is refreshed by `npm run build`. Do not edit it directly.
`dist/` is ignored and rebuilt for deployment. Old source mirrors, datasets,
`.git`, caches, source scripts and credentials are not copied into it.

## When you get a domain

1. Connect this repository to **Netlify or Vercel**. Committed configs use
   `npm run build && npm test` and publish `dist/`.
2. Add the purchased domain in the host's dashboard. Follow the host's DNS
   instructions at your registrar, select one canonical host (www or non-www),
   redirect the alternate host, and wait for its HTTPS certificate to be valid.
3. Set **`SITE_URL`** to the full canonical HTTPS origin, e.g. your real
   `https://…co.za` address, **without a subdirectory, query or credentials**.
   Configure it in the production environment. Alternatively set `url` in
   `assets/js/site.config.json`. Environment `SITE_URL` takes precedence.
4. Rebuild/redeploy. Canonicals, Open Graph URLs, structured data, `robots.txt`
   and `sitemap.xml` now use that domain. Before a domain is set, builds are
   intentionally **noindex** and robots disallows crawling. Known Netlify preview
   and Vercel non-production contexts remain noindex even if SITE_URL is set.
5. Verify Formspree endpoint `https://formspree.io/f/xvkgqalq` is activated and
   authorised for the deployed domain. Send a real enquiry after launch and
   confirm delivery to the intended inbox. Tests mock submissions; email delivery
   has **not** been verified here.
6. Test calls, WhatsApp, email drafts, Calendly, downloads, shop links and deep
   link reloads on a phone. Verify the host serves unknown paths as HTTP 404 and
   applies the committed security headers. Set up the host's deploy alerts and
   rollback history; retain repository backups.
7. Verify ownership in Google Search Console/Bing Webmaster Tools and submit
   `/sitemap.xml`. Add verification records/tokens only when issued to you.
   Indexing, ranking, Core Web Vitals and domain availability cannot be guaranteed
   by code. No analytics, ads or unnecessary cookie banner is installed.
8. Review the privacy notice, image permissions and project statuses before
   publishing; the notice is a practical disclosure, not a legal compliance audit.

Root-domain hosting is supported. A GitHub Pages *repository subdirectory* is
not supported by the absolute asset/router URLs without adapting the base path.
No domain, hosting account, payment, deployment or DNS change was made here.

## SEO, performance and security

- Unique HTML titles/descriptions and real pre-rendered content per route;
  search engines and link previews do not need to execute React to see the page.
- Canonical URLs, Open Graph/Twitter metadata, a local 1200×630 PNG social card,
  and Person / WebSite / WebPage / Breadcrumb / Service JSON-LD where relevant.
  Runtime metadata follows navigation without retaining the previous route.
- A domain-driven sitemap; historical aliases redirect/normalise to current
  pages and are not indexed as duplicates. `/tools` and 404 pages are noindex.
- Self-hosted Poppins fonts with their SIL OFL license, font preload, local
  favicons/touch icons/web manifest, lazy project imagery, responsive layout,
  accessible dialogs, visible keyboard focus and reduced-motion behaviour.
- Netlify `_headers`/`_redirects` generated into `dist`; Vercel config at the root.
  Headers include MIME-sniffing protection, referrer and permissions policy,
  HTTPS/HSTS and a baseline CSP. Inline scripts/styles remain allowed because the
  captured runtime uses them; this is not a nonce-only CSP or a security audit.
  Production blocks framing; the local verifier permits Arena's preview frame.
- No secrets or private backend keys belong in public JS. Formspree handles the
  submissions; no database or Supabase backend is needed for the current site.
  GitHub Actions runs build/static checks on pushes and pull requests.

Image context menus, dragging and touch callouts are discouraged on images and
SVG artwork only. **Browser-visible images cannot be made impossible to copy,
screenshot, inspect or save.** For stronger protection use lower-resolution or
watermarked previews and keep full-resolution originals off the public server.
Normal text selection, accessibility and deliberate free-prompt copying remain
available; no keyboard/devtools blocking is used.

## Contact behaviour

- Header: compact **Have an idea? / Let’s talk / On WhatsApp** outlined card at
  **188×54px** (172px wide on medium desktops), reduced 6px in both dimensions
  from its predecessor. WhatsApp mark, divider and smaller type; the same card
  appears inside the mobile menu to avoid crowding the header.
- Footer: **LinkedIn · Call · Email · Meeting · Enquiry**. Call is a direct
  `tel:+27837195064` handset link again; the Call/WhatsApp chooser is removed.
  WhatsApp remains available through the header at `https://wa.me/27837195064`.
- Meeting uses the exact supplied
  `https://calendly.com/lulamile_m/meet-lulamile?month=2026-11` link. The fixed
  month is owner-supplied; update it if you want a different booking default.
- Main Contact and footer Enquiry POST to the supplied Formspree endpoint, with
  required-field checks, honeypot, sending state, timeout, confirmed success and
  recoverable errors. No success is claimed on a failed response. Privacy links
  explain the third-party processing. Direct email stays available as fallback.
- About's “Let’s work together” button is removed.
- ProdOps has **Request ProdOps**: a `mailto:mkhungela.l@gmail.com` link with a
  prefilled subject and request body. It requires an email app and does not send
  automatically. No GitHub or live-preview link remains on that project page.
- Floating music is replaced with **Back to top**, including keyboard and
  reduced-motion support. Bottom footer links: My Services, Portfolio and About;
  privacy/image-rights notice appears by the copyright, with no Tools/Email text
  navigation links and no duplicate Let’s Talk button.

## Routes and editable sources

| Route | Purpose |
| --- | --- |
| `/` | Eleven numbered Home sections |
| `/services`, `/services/:slug` | Concise directory and substantive service pages |
| `/product-design-strategy` | Service details, no embedded projects |
| `/portfolio?filter=…` | All / Website / Product Design / Apps / Frontend Dev / AI Prompt |
| `/project/:id` | Eight owner overviews/case studies and five free prompt pages |
| `/about`, `/contact`, `/privacy` | Owner information, enquiry and privacy |
| `/tools` | Directly accessible legacy resources, noindex |

Old `.html`, retired-service and reference-project paths use compatibility
redirects/normalisation. Archive is removed, not another category.

Main source files:

- `assets/js/site.config.json`: domain-independent publication identity.
- `assets/js/home.content.json`, `home.reference.js`: Home layout/copy; authored
  SVGs in `assets/img/home/`. Regenerate with
  `python3 scripts/generate-home-artwork.py`, then rebuild. The generator authors
  44 page-exclusive SVG illustrations (42 with interactive 3D enhancements and two unchanged Contact scenes),
  **not screenshots or embedded rasters**: a cursor shaping an idea, protected
  infrastructure, a browser becoming a storefront, connected architectural
  modules, an automation checkpoint, knowledge-backed conversation, a Bezier
  design study, a human conversation and ascending project milestones. Dedicated
  responsive website, search, advertising, strategy, portfolio and toolkit
  illustrations now replace generic artwork on their matching pages. Large
  objects, consistent emerald/ivory/coral materials and text-free compositions
  keep the meaning readable on mobile. The shared artwork hash versions every
  illustration, including page-exclusive service and contact artwork.
- `assets/js/services.catalogue.json`, `strategy.services.json`: ten offerings
  total. Website/conversion content lives in Website Design; hosting includes
  deployment; relevant former brand/Amazon and microfinance content was reused
  in Ecommerce, marketing, business systems and Product Design. Basic Graphic
  Design stays basic. `services.redirects.json` maps the retired offerings.
- `assets/js/portfolio.projects.json`, `portfolio.categories.json`: owner work
  and category data. `portfolio.reference.js` renders contextual actions/details.
- `assets/js/pages.reference.js`, `hybrid.reference.js`: shared pages, contact,
  header/footer/icons. `publication.reference.js`: runtime SEO.
- `assets/js/site-behaviour.js`: limited image-saving deterrents.
- `assets/css/{home,portfolio,pages,navigation,services,hybrid}.css`: editable CSS.
- `scripts/build-reference-ui.mjs`, `publication.mjs`, `prepare-deploy.mjs`:
  compiled runtime, static rendering/SEO and isolated deployment output.

## Project provenance and honest status

There are **30 unique projects/resources**, with overlapping category counts:
Website 7, Product Design 4, Apps 6, Frontend Dev 4, AI Prompt 10. FoodieZone is
live-linked under Website and opens its local study under Product Design/All.

- Owner content/covers originate from
  `https://github.com/LulamileMkhungela/portfolio.github.io`. Nerdma, SNB,
  FoodieZone, Sesyme, LuniaNetwork, LulaFind, ProdOps and Forma have local details.
  Original copy was condensed without fabricated impact statistics. Historical
  app mockups do not assert current app-store availability.
- Explicit redirect projects retain the owner-supplied live/test/deck/press URLs.
  HeritageBites is **In progress · Testing link**; its corrected actual social
  artwork comes from `heritagebite-tes/public/img/social-card.jpg`.
- ITWeb's GBV article names Lulamile on the winning HashScape team. No team photo
  was supplied, so the cover is a **labelled editorial SVG**, not the unrelated
  hackathon image or the article's foundation-leader portrait.
- Lawmania (`lekgotla`), AI LifeOS and OneScreen Business descriptions use their
  now-accessible READMEs. All remain unlinked **Coming soon**. AI LifeOS uses its
  repository's safe-to-spend screenshot; OneScreen uses its store icon (branding,
  not a screenshot). No existing Lawmania screenshot was found in the repo tree.
- LulaFind includes its documented home screenshot, the owner-supplied pending
  Google Play review status and a **source ZIP**, not an APK/store-release claim.
- ProdOps is a short README-grounded product-design study, with an actual locally
  built worked-example screenshot. Workflow gates are not described as security;
  server-dependent AI/imports are distinguished from static browser editing.
- Forma is work in progress, with original illustrative workflow/Review Lab
  diagrams, not claimed production adoption or an accessibility audit.
- Frontend Dev includes the original FNB financial-inclusion and Geekulcha
  community-financial-hubs hackathon decks. They open their source decks.
- AI Prompt: all five premium products come first (Spin the wheel, ID card,
  HalfMan, Fitness, Finance App Flow), linking the original Selar shop. **No paid
  prompt body ships.** Original catalogue prices are not checkout guarantees.
  The five free items are only Service Provider App, Finance homescreen, Food
  delivery, OtO e-commerce and Fashion shopping; original prompts have read,
  copy and `.txt` download actions. No unavailable Figma download is promised.
- Three premium thumbnails retain their exact original public-storage URLs,
  with clearly editorial local fallbacks; other active imagery is local. External
  links and store availability can change and were not purchase-tested.

Visual provenance: the initial captured portfolio reference is retained unchanged
in `reference/source-mirror/`; the current site mixes that structure with the
owner-requested Digital Rhino-inspired visual/service direction. It is not Rhino
branding or an affiliation claim. The captured bundle contains historical unused
reference code/data, but those studies and its backend/contact actions are not
active pages. Review rights to third-party screenshots/brand marks before launch.

## Checks

```sh
npm run build && npm test
node scripts/serve-publication.mjs --port=3102
# Optional, in another terminal, after installing transient browser dependencies:
# npm install --no-save --package-lock=false playwright-core @sparticuz/chromium
AWS_EXECUTION_ENV=AWS_Lambda_nodejs22.x node scripts/check-publication-browser.mjs
```

Other optional suites: `check-portfolio-browser.mjs`, `check-footer-browser.mjs`
and `check-header-browser.mjs` (repository server on 3000). Browser tooling is
not a runtime/build dependency. Browser tests cover route reloads, filters,
responsive widths 320–1440, clipboard success/denial, limited image deterrents,
form error/retry/success with mocked submissions, request-email content, metadata
changes, reduced-motion scrolling, native dialog behaviour and actual HTTP 404.
Production-mode SEO was also tested using a temporary `.example` origin then
restored to staging noindex; no placeholder is left as the published domain.

### Theme and responsive regression coverage

`assets/css/theme.css` is the authoritative navy/emerald palette. It is embedded
as critical CSS and appended after component styles. Both light and dark saved
preferences resolve to this one site theme; SSR starts with the dark class.
Each build also emits a new `assets/css/site-<hash>.css` filename, avoiding proxies
that ignore query-string cache versions. After an already-open old preview,
refresh once to load the latest document and stylesheet.

`check-responsive-theme-browser.mjs` covers all 30 active routes at 320, 375,
768, 1024 and 1440px with a light OS and stored light preference, page/background
colours, readable foregrounds and document overflow. It also checks SPA desktop
and mobile navigation. `check-theme-browser.mjs` tests representative pages with
and without JavaScript. `check-theme-cache-browser.mjs` deliberately substitutes
an old light stylesheet to verify the critical palette still wins.

Mobile navigation controls/service links have 44px touch targets. Enquiry fields
use at least 16px type on small screens to avoid iOS focus zoom. Long service
navigation scrolls within its own row instead of overflowing the page. Project
screenshots/mockups retain their original colours; they are not recoloured to
simulate a dark page background.

### Reference-led shared page layouts

See `docs/reference-layout-audit.md` for the owner/reference route map, intentional
owner differences, preserved content, motion implementation and visual-verification
limits. The service directory now uses three illustrated link-row chapters;
service detail pages use overview, feature and contact chapters. Shared layout
styles live in `assets/css/studio.css`, with headings/data rendering in
`assets/js/services.reference.js`. All artwork is local and original; no Digital
Rhino mascot is used. `scripts/check-studio-layout-browser.mjs` provides the
optional responsive/interaction audit. Full-page reference screenshots and a
recording are still needed for an exact pixel/motion comparison.

### Portfolio browsing and screenshot previews

The default Portfolio view is grouped by category, with **five compact previews
across one desktop row** (four where a category only contains four projects).
Additional projects stay in the same horizontally scrollable row; no projects
are removed. Tablets and phones show a swipeable row with fewer visible cards.
Category tabs replace the dropdown, persist in the URL, and include All projects.
Each category has a far-right collapse/expand button with keyboard support and
`aria-expanded`/`aria-controls`. Cards show a thumbnail, short action bar, name
and relevant status/platform information rather than long descriptive copy.
All 30 source projects remain available. AI Prompt retains premium resources
first and five free copy-in-place prompts below. A project may appear in more
than one category with its correct category-specific action.

`previewScroll: true` in `portfolio.projects.json` enables a natural-height
screenshot inside a clipped preview window, as used by Digital Rhino's full-page
portfolio captures. On fine-pointer hover or keyboard focus, a linear translate
moves exactly `rendered image height − window height` pixels, revealing the footer
without overshooting. Leaving returns to the top. A ResizeObserver and image load
handler recalculate travel; duration scales with distance (6–24 seconds). Reduced
motion disables translation, and touch shows a static contained preview. Short
screenshots with no vertical overflow do not animate or stretch.

An optional `previewImage` points to a full-page capture for cards only, keeping
the original `image` for case-study covers. Current Nerdma/other hero-only captures
**do not contain the rest of the website**. They must be replaced with genuine
full-page screenshots; never generate fictional lower sections. The optional
capture utility can produce these on a machine with access to the project sites:

```sh
# Requires playwright-core and @sparticuz/chromium (optional browser test tools).
AWS_EXECUTION_ENV=AWS_Lambda_nodejs22.x node scripts/capture-project-preview.mjs nerdma
npm run build
```

This utility visits the project's existing HTTPS website link, scrolls to load
lazy content, returns to the top and saves a full-page PNG. It only updates
`previewImage` after a successful capture; it does not deploy or submit forms.
The sandbox cannot currently reach Nerdma, so no full-page Nerdma asset is claimed.

The mobile menu closes on outside pointer/touch, keyboard focus leaving the
header, Escape, all navigation links (including same-route links) and switching
to the desktop breakpoint. `check-portfolio-browse-browser.mjs` checks the five-across row, category tabs,
collapse controls, screenshot panning/reduced motion and mobile row scrolling,
outside-tap dismissal and page overflow.

### Copy prompt in embedded previews

Free prompt cards and detail pages share `LocalCopyPrompt`. Embedded frames can
block `navigator.clipboard.writeText` through their parent Permissions Policy.
In a frame (or without the Clipboard API), a temporary selected textarea attempts
copy synchronously during the button click; top-level pages prefer the Clipboard
API with the same selection fallback if denied. The temporary field is removed
and focus/selection restored. Success is announced only when a method reports
success; if both fail, selectable prompt text stays available in-place.
`check-prompt-cards-browser.mjs` tests actual clipboard text, including a real
iframe denying clipboard-write, missing/denied API and both-methods-blocked cases.

### Interactive 3D artwork

Home, service introductions/features, Strategy, Portfolio and Tools progressively
upgrade their matching SVG illustrations into **real Three.js/WebGL geometry**
with bevelled meshes, perspective, lights, materials and shadows. Contact artwork
and client project screenshots are excluded. SVGs remain the no-JS/no-WebGL
fallback; no externally hosted models, textures or 3D service is required.

- Drag a model to rotate it; click a model or **Separate parts** to animate its
  components apart, and **Reset** to restore its assembled view.
- Focus the canvas and use arrow keys, Enter/Space, or Escape. Buttons have normal
  keyboard focus and the separate/assemble toggle announces its pressed state.
- Touch supports horizontal rotation while allowing vertical page scrolling.
- Reduced motion applies changes immediately; there is no idle auto-rotation.
- The engine is loaded near eligible artwork. Only visible/nearby models allocate
  WebGL contexts; leaving a section or navigating disposes its renderer, geometry,
  materials, observers and animation frames. Rendering runs only for interaction
  and resize updates, not an endless background animation loop.

Edit `assets/js/interactive-scenes.source.js`. `npm run build` bundles Three.js
locally using esbuild into `interactive-scenes.js` and includes it in `dist/`.
`check-interactive-scenes-browser.mjs` covers introduction models across 14 routes,
controls, rotation, keyboard, reduced motion, WebGL failure and mobile sizing.

### Dimensional controls and surfaces

`assets/css/dimensional.css` is the final UI layer: bevelled emerald CTAs, raised
secondary buttons/tabs, inset input wells and quieter depth on service rows,
process/testimonial cards, tool cards, preview frames and footer icons. These
remain semantic HTML controls, not WebGL hit targets. Fine-pointer movement adds
a bounded four-degree tilt; press states compress the raised edge. Keyboard
focus remains explicit, disabled controls remain visibly disabled, reduced motion
removes transforms, and forced-colors mode restores plain system borders.
`check-dimensional-ui-browser.mjs` checks press/tilt/focus and responsive layouts;
clipboard regression tests separately verify prompt actions still copy correctly.

Display headlines also use a selectable, CSS-extruded 3D text treatment: lit
ivory/emerald faces with stepped side shading and a soft cast shadow. Hollow
middle lines retain transparent faces and receive offset outline depth instead.
Body paragraphs/navigation remain flat; mobile uses shallower headline shadows,
and print/forced-colors remove the decorative depth. Regression coverage:
`scripts/check-dimensional-text-browser.mjs` (six routes at 320/768/1440px).

### Accessibility and hosting verification status

`check-accessibility-browser.mjs` uses optional axe-core/Playwright tooling against
six main routes at 1440px and 390px (WCAG 2 A/AA, 2.1 AA and 2.2 AA rules). The
latest production-output run reported no automatically detected violations.
Gradient/3D-shadow contrast and an inline contact-link distinction still require
manual review; this is **not** a WCAG conformance certification. A footer contact
group was given its missing group role during the audit. Existing browser suites
cover focus/keyboard controls, reduced motion, clipboard permissions, WebGL
fallback and responsive layouts. Screen-reader, zoom/reflow, Safari/iOS and real
low-powered-device review are still required before claiming broad compatibility.

The compiled `dist/` output was also served locally with the configured CSP:
interactive WebGL, tested deep links and local assets loaded without page/HTTP
errors. This does not verify a deployed host. Publish `dist/`, use Node 22 for the
build, enable HTTPS, set `SITE_URL` to the final public domain (currently unset,
so staging stays noindex), and smoke-test redirects, contact submission/delivery
and external links on that host. No live forms were submitted during this audit.

### Raised-control spacing

`assets/css/spacing.css` is applied last. Contact cards now have 16–20px inline
insets and separated rows; secondary contact actions have padded faces rather
than text-link padding inside a raised border. Primary action bars, scene
controls, icon-only keys and scroll-strip end spacing follow the same spacing
pass. Footer enquiry's outer label wrapper is flat (only its icon frame is
raised), avoiding a second tight box. `check-spacing-browser.mjs` measures page
gutters, boxed SVG icon insets and horizontal overflow across 32 routes at
320/768/1440px; representative routes, including the 404 page, are also checked
at 390/801/1024px. Optional `SPACING_WIDTHS`/`SPACING_ROUTES` select smaller runs.

3D models also follow fine-pointer movement without a drag: a bounded hover offset
is added to the user's chosen orientation and eased away on pointer leave. Drag,
keyboard rotation and separate/reset remain available. The visible hint explains
the interaction; reduced-motion and touch do not receive passive hover movement.
There is no always-running idle animation. About's chevron is a flat 2D exception
to the raised-control theme, and hovering the About group reveals Contact; click,
keyboard disclosure, Escape, outside dismissal and normal About navigation remain
supported. `check-hover-interactions-browser.mjs` covers these hover behaviours.

The 3D scene observer also watches illustration `src` changes. Service-to-service
SPA navigation can reuse the same figure: when its scene kind changes, the old
renderer is disposed and the correct model is mounted rather than retaining the
first service's geometry. `check-scene-navigation-browser.mjs` exercises actual
header-link clicks across all 10 services, hero/feature models, Back/Forward and
controls after repeated scene replacements (not just direct page loads).

Service figures also carry explicit scene identities and use keyed root elements,
so changing a service replaces the illustration host instead of retaining a
mutated canvas container. Builds emit content-hashed `interactive-scenes-*.js`
and `site-behaviour-*.js` URLs; the loader references the versioned engine and
both are verified in `dist/`. Refreshing an already-open preview is still needed
to replace JavaScript already running in that document. Scene-navigation tests
now compare rendered canvas image hashes on a uniform background for all ten
service models, rather than checking only data attributes. The same test passes
against the locally served production output using `TEST_ORIGIN`.

### Page-exclusive illustration ownership

No complete large illustration is shared across pages or repeated within a page.
Home owns its seven original scenes; Contact owns its two unchanged SVG scenes.
Services overview owns three new compositions, each service/strategy page owns
three illustrations, and Portfolio and Tools each own one. There are **44 unique
illustrations**, of which 42 support interactive WebGL.

`scripts/generate-page-artwork.mjs` defines 29 new compositions as geometric
recipes, writes `assets/js/page-artwork.json`, and projects native SVG fallbacks.
These are separate subjects/compositions—not renamed or recoloured copies. The
existing 15 SVGs complete the collection. Shared primitives, lighting and palette
maintain a consistent visual style, not shared finished models. Service closing
chapters now illustrate the relevant project brief instead of borrowing Contact's
conversation artwork.

`check-illustration-uniqueness-browser.mjs` tracks ownership across all 31 main/error
pages and fails on any intra-page or cross-page reuse. Navigation tests cover all
three 3D chapters on each service page, plus rendered introduction image hashes.

### Scroll-dependent Back to top

The floating button starts hidden (including in prerendered HTML) and out of the
tab order. It appears after 160px of scrolling and hides again near the top.
When activated, it remains available until its return animation finishes, then
hides; keyboard focus moves to the main-content destination rather than a hidden
button. Reduced motion uses an immediate scroll. Passive scroll/pageshow listeners
are cleaned up and route changes resynchronise visibility.
`check-back-to-top-browser.mjs` covers initial/near-top hiding, scrolling, mouse/
keyboard activation, reduced motion and navigation at mobile/desktop widths.
