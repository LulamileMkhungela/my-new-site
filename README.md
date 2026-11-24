# LulaZel — portfolio and digital services

Responsive navy/emerald portfolio with a Digital Rhino–inspired chapter layout,
original artwork, local owner content, and shared navigation/footer. Digital Rhino
is a layout reference, not the site's branding or an imported site template.

## Install, build and test

Requires Node.js 22 or later.

```sh
npm ci --include=dev
npm run build
npm test
npm run preview
```

The preview serves `dist/` at port 3000 on `0.0.0.0`. Deploy **only `dist/`**.
GitHub Actions installs the locked production/build dependencies before building
and testing. Browser regression tools are optional (see below).

## Current architecture

The old captured source mirror, its generated runtime/styles, legacy standalone
page scripts, historical project-data extractor/downloader, obsolete images and
duplicate compiled assets have been removed. The current application is built
from readable local components and standard npm dependencies (React, React DOM,
React Router and React Helmet Async), not string patches to a captured UI bundle.

- `assets/js/app.source.js`: current router, scroll lifecycle and application entry.
- `assets/js/{home,services,pages,portfolio,hybrid,publication}.source.js`: current
  page components, shared header/footer, accessible controls and metadata.
- `assets/js/site.content.json`, `home.content.json`, `tools.content.json`: owner
  identity, Home content, Process/testimonials, About and toolkit content.
- `assets/js/services.catalogue.json`, `strategy.services.json`: nine service
  offerings and Product Design & Strategy (a service, not a projects page).
- `assets/js/portfolio.projects.json`, `portfolio.categories.json`: owner projects,
  source-backed statuses, category actions, local imagery and free prompt text.
- `assets/js/legacy.routes.json`: compatibility destinations only; old UI is not
  retained to support these URLs.
- `assets/css/foundation.css`: small local browser reset; other CSS sources contain
  the current component styles, navy theme, motion, dimensional effects and spacing.
- `scripts/build-site.mjs`: bundles current JS, removes unused CSS selectors,
  prerenders the same page components, and produces metadata/manifests/aliases.
- `scripts/prepare-deploy.mjs`: creates a restricted production directory without
  source components, data files, scripts, caches, credentials or development files.

Generated output consists of `assets/js/site-app.js`, a versioned scene engine,
a versioned behaviour loader, and one versioned `assets/css/site-*.css`. Unversioned
copies of compiled CSS/scene/loader bundles are not published. Old hashed output
is removed during builds.

## Routes and navigation

Home, My Services, Portfolio, About and Contact use the same two-row sticky header
and consistent footer. Home remains directly available on mobile. The About
chevron is flat/2D, with keyboard, click and mouse-hover access to Contact. Mobile
navigation closes on selection, Escape, outside click and focus leaving it.

- `/`: illustrated chapters 01–09, selected work, biography, original Process and
  seven source-attributed testimonials (not Google reviews).
- `/services/`: three directory chapters with their own illustrations.
- `/services/:slug/`: intro, practical features and project requirements.
- `/product-design-strategy/`: the same three-chapter service structure.
- `/portfolio/`: category tabs and five visible desktop project cards per row,
  with horizontal browsing for additional cards and expand/collapse controls.
- `/project/:id/`: local case studies, overviews or free prompt details.
- `/about/`, `/contact/`, `/tools/`, `/privacy/`: current dedicated pages.

Historical `.html` entry points and retired project/service URLs remain as
compatibility routes/hosting redirects. They render current content or point to
a current destination; they do not load the old UI.

## Portfolio content safeguards

31 unique owner projects/resources yield 32 category entries (categories overlap):
Website 8, Product Design 4, Apps 6, Frontend Dev 3 and AI Prompt 11. Category tabs
persist in the URL. Lawmania and Ai-LifeOS are labelled Coming soon,
include web/mobile platforms, and have no fabricated cases or repository links.
HeritageBites remains in testing/in progress; editorial GBV imagery is labelled.
LulaFind uses the owner-supplied Android APK link, with store links disabled. ProdOps is a documentation-based overview with a
prefilled email request, not a public repository link.

AI Prompt lists five premium resources before six free prompts. Premium cards
link to the shop; no premium prompt text is shipped. Free cards copy inline with
a selection-based fallback for embedded previews, and offer manual copy/download
if both clipboard methods fail. Website previews scroll naturally on hover or
keyboard focus; reduced motion avoids the automatic animation.

## Exclusive illustrations and interactive 3D

There are **44 page-exclusive large illustrations**, with no repeated composition
within a page or between pages. Home owns seven, Contact owns two unchanged SVGs,
Services overview owns three, ten service/strategy pages own three each, and
Portfolio and Tools own one each. 42 have real interactive WebGL enhancements;
Contact stays SVG as requested.

- `scripts/generate-page-artwork.mjs` generates 29 original geometric model
  recipes and matching native SVG fallbacks.
- `assets/js/page-artwork.json` is shared by the new 3D renderer recipes.
- `assets/js/interactive-scenes.source.js` contains the renderer and original
  model geometry, with subtle pointer tilt, drag rotation and keyboard access—no visible control strip.
- `scripts/build-interactive-scenes.mjs` bundles the engine under a content hash.
- `assets/js/site-behaviour.js` progressively loads it near eligible illustrations.
- `scripts/generate-home-artwork.py` is retained as an artwork authoring tool.

Shared primitives, palette and lighting are implementation tools, not duplicated
finished illustrations. Keyed scene hosts and the renderer replacement lifecycle
prevent stale models during service navigation. Reduced motion, offscreen cleanup
and SVG fallback remain available. Headings/controls have dimensional styling;
body copy stays flat. Illustrations do not obstruct ordinary vertical touch scroll.

## Back to top

The button starts hidden in prerendered HTML and outside the tab order. It appears
after 160px of scrolling and hides again near the top. On activation it remains
available until the return completes, then hides; focus moves to main content.
Reduced motion uses an immediate return. Scroll listeners are passive and cleaned
up, and route changes resynchronise visibility.

## Contact and privacy

- Call: `tel:+27837195064`
- Email: `mkhungela.l@gmail.com`
- WhatsApp: `https://wa.me/27837195064`
- Meeting: `https://calendly.com/lulamile_m/meet-lulamile?month=2026-11`
- Enquiry POST: `https://formspree.io/f/xvkgqalq`

Contact has two sections, no duplicate footer CTA or inline third-section form.
The shared enquiry dialog provides sending/error/retry/success feedback. Tests
mock delivery; they do not send real enquiries. Free prompt copying is permitted.
Image context-menu/drag deterrents are only casual protection, never DRM. Footer
privacy information is centred and LinkedIn/contact methods remain labelled.

## Publication

No production domain is assumed. Configure `SITE_URL` as a real HTTPS origin and
rebuild for canonical URLs, structured data and a populated sitemap. Until then,
staging remains `noindex`; deploy previews stay `noindex` even if a production
origin is configured. See `.env.example`; no secrets belong in public JS.

Netlify and Vercel settings are included. The production output contains hosting
security headers and compatibility redirects, without an unconditional SPA rewrite
that disguises unknown URLs as HTTP 200. For a local CSP/404 verifier:

```sh
node scripts/serve-publication.mjs --port=3102
```

Do not use this verifier as a production server. Building/testing does not deploy,
change DNS or submit forms. Safari/iOS and screen-reader manual review are still
recommended; automated accessibility checks are not a compliance certification.

## Regression checks

`npm test` checks current component rendering/data, services, links, publication
output, illustration ownership and removal of legacy resources. Optional browser
suites use `playwright-core`, `@sparticuz/chromium` and, for accessibility, `axe-core`.
Install them locally without adding them to deployment dependencies:

```sh
npm install --no-save --package-lock=false playwright-core @sparticuz/chromium axe-core
AWS_EXECUTION_ENV=AWS_Lambda_nodejs22.x node scripts/check-back-to-top-browser.mjs
AWS_EXECUTION_ENV=AWS_Lambda_nodejs22.x node scripts/check-scene-navigation-browser.mjs
AWS_EXECUTION_ENV=AWS_Lambda_nodejs22.x node scripts/check-illustration-uniqueness-browser.mjs
```

Browser checks target the repository preview on port 3000 unless the individual
script supports `TEST_ORIGIN`; publication checks default to the verifier on 3102.
Additional scripts cover mobile spacing, header/menu behaviour, portfolio actions,
WebGL/touch/fallbacks, reduced motion, backgrounds/themes, metadata, mocked enquiry
feedback and automated accessibility. See `docs/reference-layout-audit.md` for
layout-reference scope and visual-comparison limitations.

## LulaZel identity and link previews

The selected abstract studio symbol and outlined wordmark are supplied as `assets/img/logo.svg` (outlined
wordmark) and `assets/img/favicon.svg` (abstract mark). These are clean local vector paths adapted from the selected design, not
embedded raster images or a font-dependent wordmark. `social-card.svg` is
the editable outlined source for the 1200×630 social image.
The selected concept proof is retained under `design/` for design provenance only;
it is not deployed. `scripts/generate-brand-assets.mjs` reproducibly generates PNG favicon, touch/app
icons and the sharing image using resvg, as part of every build. Header, manifest,
browser icons and social metadata identify the site as **LulaZel**. Lulamile
Mkhungela remains the personal owner/creator in About and structured data.

Website Design includes frontend implementation; there is no extra Frontend Dev
service. Frontend Dev remains a Portfolio category.

For publicly shared links, use `SITE_URL` for an explicit production HTTPS origin.
Production Netlify `URL` and Vercel `VERCEL_PROJECT_PRODUCTION_URL` are supported
fallbacks when the configured URL is blank. Preview deployments remain noindex.
The generated HTML includes Open Graph and Twitter title/description/image tags
without requiring JavaScript, with absolute image URLs once an origin is known.
The image is PNG, 1200×630, with descriptive alt text; image/icon URLs include
versions to reduce stale caches. Social platforms choose whether/how to display
previews and can cache older results. A public URL and external crawler access
are necessary for real WhatsApp/LinkedIn/social preview verification; local
metadata tests do not prove a live crawler has refreshed its cache.

## Site-wide glass surfaces

`assets/css/glass.css` is the final material layer, composed after spacing and
dimensional rules. Sticky navigation, menus, inner-page copy sheets, cards,
contact actions, long-form content, illustrations, footer and enquiry dialog
share navy glass, emerald highlights and soft inset edges. Home's numbered
chapters intentionally use an open, unboxed composition: no frosted copy sheet,
card border or inset. The active Home number is colour-only, not a filled chip;
the bottom rail blends into the page rather than forming a bordered panel. Decorative copy sheets are
pointer-transparent pseudo-elements contained within padded columns: they never
intercept links. Copy panels have responsive inner insets so text and controls do
not touch their glass edges. Images/canvas, logo artwork and text itself are not blurred. Portfolio
row dimensions, About's flat chevron and scroll-dependent Back to top are retained.

Blur is restricted to bounded surfaces (18px desktop, 10px mobile), with no
animated filters or page-sized fixed blur layers. Opaque navy fallbacks remain
readable without backdrop-filter; reduced-transparency and forced-colours
preferences remove blur and supply solid surfaces. Reduced motion remains static.
`check-glass-browser.mjs` checks all 31 routes at 320px/1440px, plus five visible
Portfolio cards, Contact dialog/navigation, unfiltered text, intact branding and
the reduced-transparency fallback. Automated axe checks do not replace manual
assistive-technology and real-device testing.

### Brand-first copy

Repeated personal-name stamps have been removed from Home chapter labels, service
pagers/illustration labels, Contact copy, generic page/social descriptions and
repeated project-role labels. LulaZel is the primary brand. The personal name
remains in the dedicated About page, Home biography and footer attribution.
Original testimonial quotes, factual project provenance and identity-bearing
contact destinations/structured data are not rewritten as marketing copy.
`check-name-density-browser.mjs` checks the main brand-first routes at mobile and
desktop widths, with explicit exceptions for About content and original quotes.

### Discuss navigation and panel insets

Every service Discuss CTA links to `/contact`, including prerendered/no-JS links.
Route changes reset scroll and move keyboard focus to main without scrolling it;
a follow-up animation frame handles route layout changes. Hash navigation uses a
measured sticky-header height plus a 24px clearance. About biography and shared
chapter sheets have real responsive inner padding, and Contact's three steps
remain a single vertical column with gaps at every breakpoint.
`check-discuss-spacing-browser.mjs` exercises every service CTA position at
320/390/768/1440px, verifies visible Contact headings, panel insets, no horizontal
overflow, and Contact anchor clearance. Use `TEST_WIDTHS=1440` to run one width.

### Home chapter index and recommendations

Home has a fixed bottom index linking 01–11 to its real sections. Native hash
links work before hydration and without JavaScript. With JavaScript, scroll and
resize events are animation-frame throttled: the current section gets
`aria-current="location"`, while the emerald progress bar tracks 0–100% of page
scroll. The rail is Home-only, keeps sticky-header clearance, reserves footer
space and sits below Back to top. It does not hijack wheel/touch scrolling.

The testimonial section uses an original CSS quote sculpture, a three-line
heading and two scroll-snap cards on desktop (one on mobile). Previous/next,
native swiping/scrolling, keyboard arrows/Home/End and expandable full notes are
supported. No autoplay. Quotes and attributions come from the owner’s linked portfolio;
unknown recommendation dates are not invented. There are no invented stars, Google marks or verification claims.
No hosting, external review service, database or API credentials are needed for
these supplied recommendations. Add approved quotes/attributions in
`assets/js/site.content.json`; publish names/photos only with permission. A live
third-party review feed is a separate integration and is not configured here.

Run `AWS_EXECUTION_ENV=AWS_Lambda_nodejs22.x node scripts/check-home-chapters-browser.mjs`
with the preview running. It checks all 11 destinations and header clearance,
active-section/manual scrolling, progress endpoints, mobile/desktop card counts,
carousel controls, keyboard, full original quotes and no-JS fallbacks at
320/390/768/1440px, plus normal-motion scrolling and route cleanup.

### Devzigner positioning

Home's introduction and the dedicated About intro describe the owner as a
**devzigner**: designing and developing end-to-end digital experiences, with a
strong frontend focus. Home/About SEO and Person job title reflect that framing.
Website Design still covers frontend development; no extra service was added.
Home About and the dedicated About page give design and development equal
weight, using the linked CV for experience. Personal-name limits are retained. The Home browser suite also guards unboxed copy, page gutters and
transparent active-number treatment at every tested width, with/without JS.

### Open project previews and spacing

Home and Portfolio project groups have a single 1px outline around the whole
project, including its thumbnail, name/details, action and copy feedback. There
is no glass fill, shadow or rounded shell. Inner padding keeps content off the
outline, while page gutters and 4px track clearance protect viewport edges.
Actions remain below the details, at least 44px high. Testimonial cards and other
requested glass surfaces are unchanged.

Project columns stretch to equal heights within each horizontal row; the existing
five-visible desktop layout and mobile horizontal browsing remain. Copy feedback
and selectable fallback stay within their project column. Preview-pan distance
uses the actual frame's fractional dimensions so full-page screenshots still
align correctly at the end of their hover pan.

`check-portfolio-spacing-browser.mjs` checks every category/card at
320/390/768/1024/1120/1440px with JavaScript on and off: inner/outer gutters,
wrapping captions, no clipping, action height/gaps, one-row geometry, five visible
desktop cards where available, end-of-track clearance and no page overflow.
The browse and prompt-card browser suites additionally cover preview panning,
reduced motion, category collapse/filtering, inline copy and embedded-preview
clipboard fallback. Remote cover requests are blocked during browser checks;
these use the existing local cover fallback instead.

### Home 08 selected projects and action order

Home's five featured projects are explicitly ordered with `featured` and
`homeOrder` in `assets/js/portfolio.projects.json`: Ai-LifeOS, Nerdma, LulaGazette,
Delivery App (the parcel-tracking free AI prompt), then FoodieZone. The old
three-case-study limit is removed. Desktop shows all five in one row; smaller
screens browse that same ordered row horizontally. Home and Portfolio now share
the same card component and inset styles (`pf-featured` / `pf-page`).

Project groups render image, project name/details, then action. Ai-LifeOS stays
non-linked Coming soon. Nerdma, FoodieZone and LulaGazette say **Visit site** and
open their existing live websites in a new tab. Their local case-study URLs,
where present, are retained. LulaGazette belongs to Website, not Frontend Dev.
The Delivery App copies its original free parcel-tracking prompt inline,
including denied-clipboard/manual-selection fallback, without navigating away.
No project status or case study was invented to feature these items.

`check-home-featured-browser.mjs` verifies exact order/count, five desktop cards,
mobile scrolling, spacing/action order, correct destinations, Coming soon,
inline prompt copy/expiry and live-site destinations at 320/390/768/1024/1440px. The static,
Portfolio spacing/browse/detail, prompt-card and Home chapter suites cover the
shared component and navigation regressions.

### Current scroll behavior

Home uses **one sticky stage**, not individually sticky sections. Its chapter
panels are absolutely positioned inside that stage. Render frames only change
composited transforms, visibility and opacity; they never change layout, sticky
positions or scroll offsets. This replaces the earlier offset-compensation
implementation which could appear to vibrate during entry.

The public Digital Rhino implementation was inspected on 2026-11-21:
- `https://digitalrhino.co.za/wp-content/plugins/digital-rhino-main-pages/site/app.js`
- `https://digitalrhino.co.za/wp-content/plugins/digital-rhino-main-pages/site/choreography.js`
- `https://digitalrhino.co.za/wp-content/plugins/digital-rhino-main-pages/site/mobile-layout.js?v=1.0.6`
- `https://digitalrhino.co.za/wp-content/plugins/digital-rhino-main-pages/site/style.css`

Desktop follows its exponential scroll damping (9/s), alternating 240px text
travel and 0.65 depth entries for chapters 04/06, with roughly two viewports
per chapter transition. Fades now overlap continuously: after grouping content
and artwork, the original text-only visibility windows left blank gaps. Adjacent
chapter opacities now sum to one on both desktop and mobile, so stopping halfway
through a transition always leaves at least one chapter at 50% visibility.
The crossfade is concentrated into 30–70% of transition travel: by 65%, the
outgoing group is below 5% opacity and the incoming group is above 95%, avoiding
the previous long, weak ghosting. Mobile uses the same stronger fade while
retaining its existing movement and full-content reading intervals.
Hosting, automation and assistants switch copy/art sides as in the reference.
Each chapter's content and original vector now animate as **one parent group**:
shared travel, scale, fade and transform origin, on both desktop and mobile.
There is no independent artwork arrival/rotation or staggered mobile text entry.
Digital Rhino's mascot, animation clips, models and branding are NOT used.
The owner-specific portfolio, process and testimonial content is retained.
This is a source-informed adaptation, not an assertion of identical visuals.

Mobile (≤760px) follows a distinct hold/read/settle/transition timeline: 180px
hold, enough distance to read the full content, 140px settle, then an outgoing
shrink/slide and incoming mode-specific reveal. Taller desktop content also gets
a reading interval rather than being clipped permanently. Stable `svh` stage
height avoids mobile browser-chrome changes pumping the timeline. Scrolling
remains native; no wheel/touch interception or snapping. Chapter links and SPA
history use measured timeline positions rather than absolute-panel rectangles.

Only the current chapter is interactive; inactive chapters are inert. Keyboard
chapter navigation focuses its destination after settling. Reduced-motion,
unsupported and no-JS browsers retain readable natural-flow sections; print
resets the stage. Other pages retain their lightweight directional entrances,
with Home explicitly excluded to prevent competing animation writers.

`check-scroll-motion-browser.mjs` compares computed transforms/opacity with the
travel/depth formulas and complementary fade coverage, checks a 76-frame
monotonic scroll sweep for blank frames, reversals,
stage/layout movement and idle drift, and tests reverse playback, chapter links,
keyboard focus, tall-content reading, SPA Back, reduced-motion, print, footer
access and no-JS visibility. `check-home-webgl-stability-browser.mjs` enables
real WebGL, verifies mounting/disposal cannot change any chapter height/timeline
offset, checks that SVG fallbacks are hidden behind ready models, limits live
contexts to adjacent scenes, and exercises layout-stable GPU fallback recovery.
Illustrations have no visible instruction strip, separate-parts or reset controls.
There is no reserved control-row gap. Model bounds are framed to fill their
viewport with a safe margin; mobile Home artwork can use up to 360px of width.
Subtle pointer tilt, drag rotation and keyboard arrow/Escape support remain.
Click-to-separate was removed alongside the control panel. Browser suites need optional Playwright/Chromium.


### Delivery App source and copy feedback

The featured Delivery App is **not** the food-ordering prompt. Its original cover
and prompt were imported from the owner's earlier portfolio:
`LulamileMkhungela/portfolio.github.io`,
`public/images/promptsite-covers/delivery-app-concepts.jpg` (Git blob
`0103c35c8c8ad7b08288b0549967b27f412cd18f`) and the **Delivery App** entry in
`portfolio/lula-design-library.html`. The cover is stored locally as
`assets/img/portfolio/prompt-delivery-app.jpg`; the verbatim prompt is in
`assets/prompts/prompt-delivery-app.txt` and project data. It compares three
parcel-tracking UI concepts. The separate food-delivery prompt remains available
in AI Prompt rather than being deleted or mislabeled. There are now five premium
and six free prompts, with the same premium access restrictions.

`LocalUseCopyStatus` shares feedback behavior between project previews and prompt
detail pages: successful **Prompt copied.** text and **Copied!** button state reset
after 2000ms. Repeated successes restart that timer; unmount cleans it up. Failure
messages and manual-copy text do not auto-dismiss. The prompt browser suite uses
Playwright's controlled clock for timing checks, alongside real clipboard and
embedded-preview fallback checks.

### APK and app-store availability

LulaFind's primary action is **Download APK**, using the owner's exact Google
Drive share URL in `apkUrl`. Its preview/detail status is **Android APK**, not
Coming soon or Pending Google Play review. The detail page explains saving the
APK and approving installation on Android; it cannot install on iOS. The old
GitHub/source-ZIP targets are no longer used. Drive permissions and actual device
installation have not been verified.

OneScreen's **Android release** action opens the owner's exact GitHub release
page for `v2.1.0-apk`. The public page returned HTTP 404 and the integration
could not inspect its assets, so no APK asset filename is invented. Supply a
public direct APK URL to offer a direct download. No iOS build/distribution link
was supplied; an Android APK cannot serve as an iOS installer.

Current app projects have App Store and Google Play icon controls, including
Home's Ai-LifeOS feature and LulaFind's local overview. Both are native
**disabled** buttons while `storeLinks.appStore` / `storeLinks.googlePlay` are
`null`, with explicit accessible names and no fake hrefs. Add the real listing
URL to the relevant project's `storeLinks` field when ready; that control then
becomes a normal external link. Historical Sesyme (employment project, 2019)
and LuniaNetwork (personal app published in 2019, removed from Google Play in
2024 because it was no longer being updated) show their descriptions and overview links instead of store placeholders.

All six app cards include short factual product descriptions, including unreleased
projects, so their information areas are not empty. Card summaries use equal-height
three-line slots with overflow clamped; complete descriptions remain in accessible
project copy and on available detail pages.

Coming soon is a small corner badge on the whole-project border, freeing the
bottom row for compact 44px store controls. APK downloads (and OneScreen’s
Android release) share that same row with App Store and Google Play, on cards
and app details, rather than occupying a separate action row. Home previews use taller 4:3 windows
without stretching: app art retains its proportions and website captures crop
or pan naturally. Five-across desktop/horizontal mobile layouts are preserved.

Home/Portfolio show **Personal Web project** under LulaGazette. On Home only,
Delivery App shows **Ai prompt app** and Ai-LifeOS hides its short summary;
Portfolio app summaries remain unchanged. DesignOps is **Personal project**; AddmoreDigital
and SNB are **Work project**. The premium design-app prompt is named
**Design App Home screen flow**, retaining its Selar destination.

`check-app-downloads-browser.mjs` checks exact APK destinations/status, absence
of ZIP/review confusion, genuinely disabled store controls on current apps, historical descriptions,
LulaFind detail controls and responsive geometry at five widths with JS on/off.
The Home-featured suite additionally guards both project labels and disabled
Home store icons. APK responses are not mocked or counted as successful downloads
by these UI tests; external navigation is blocked.

### Project details: spacing and return navigation

Project-note panels have an outside 20–40px responsive gap, separate from their
internal padding. Internal project links carry their originating URL; both detail
Back links use browser history when that origin is known. Per-entry scroll
snapshots restore vertical position and horizontal project tracks on Back/Forward,
with a session-storage fallback across detail refreshes. Portfolio filters remain
in the original URL and collapsed groups are saved per history entry. Canonical
trailing-slash project links avoid a static-server redirect erasing origin state
on refresh. Directly opened detail pages fall back to their relevant Portfolio
category, rather than assuming a previous in-site page exists.

`check-project-return-browser.mjs` checks the top/bottom Back links, browser Back,
refresh then Back, horizontal track position, filters, collapsed sections,
direct-entry fallback and visible note-panel gaps at mobile/desktop widths.

### Apps ordering, gallery scrolling and biography corrections

Apps start with LulaFind, OneScreen Business, Ai-LifeOS and Lawmania, followed
by the remaining apps in their previous relative order. This is data ordering,
so the filtered Apps view and the Apps section of All projects agree.
`LocalProjectRail` adds previous/next chevrons only to overflowing galleries,
including Home on small screens. Boundary buttons are disabled; controls remeasure
on resize, expanding a category and font loading. Horizontal scrolling remains
native; project rails no longer use scroll snapping or overscroll containment,
and never cancel wheel/touch events or convert vertical movement to sideways
movement. Arrows respect reduced motion.

Biography and attribution source checked on 2026-11-21:
- Owner portfolio: <https://lulamilemkhungela.github.io/portfolio.github.io/index.html>
- Its CV/About content: <https://github.com/LulamileMkhungela/portfolio.github.io/blob/main/js/desktop.js>
  (`NOTES_DATA.about` / `NOTES_DATA.cv`). This supports design/UI development
  through iOCO, including Vodacom/Toyota engagements; FoodieZone, Nerdma,
  AddmoreDigital; and UI/UX plus Android work at Sesyme/SmartServe and mLab.
- Recommendations: <https://github.com/LulamileMkhungela/portfolio.github.io/blob/main/js/testimonials-data.js>
  (`TESTIMONIALS`). The seven messages, names, roles and companies are copied
  from that source. Digital Academy notes carry programme context (2018–2019),
  not an invented recommendation date; other dates are omitted.

The incorrect Gojo employment claim and unrelated testimonial attributions were
removed, not reassigned to another employer. Unsubstantiated millions-of-screens,
four-year tenure and serveware-brand claims were removed from the About copy.
Design and development are explicit throughout About, Home About, Portfolio
intro and About navigation; the owner’s concrete Figma/React/Angular/Ionic work
replaces vague designer-only positioning.

Browser regression: `AWS_EXECUTION_ENV=AWS_Lambda_nodejs22.x node scripts/check-project-rails-browser.mjs`
checks ordering, responsive arrows, forward/back browsing, category filtering,
collapse/expand, vertical wheel and mobile touch scrolling, plus About copy.

### Client-focused About and worldwide Contact

The later owner direction supersedes the CV-style About wording above: About
now explains the value of one design-and-development partner, from understanding
the brief to interfaces, implementation, integrations, testing and launch. It
contains no employers, role chronology or technical skills list. Home About is
also benefit-focused. Contact leads with “Your digital partner. Wherever you
work.” and invites goals, requirements and time-zone details. The existing two
Contact sections and original illustrations remain intact.

`site.content.json` → `socialProfiles` powers the same labelled icons on About
and Contact. LinkedIn is confirmed and live. Facebook and Instagram are null
until the owner supplies their profile URLs; they render disabled controls, not
platform-homepage links or guessed handles. Unknown dates/URLs are never invented.

`AWS_EXECUTION_ENV=AWS_Lambda_nodejs22.x node scripts/check-about-contact-browser.mjs`
checks client-focused text, three social icons, confirmed/disabled link states,
44px targets, the two-section Contact layout and no overflow at 320/390/768/1440px.
