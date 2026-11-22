# Shared-page layout audit

Reference: public Digital Rhino pages retrieved during this implementation.
This is a structural audit, **not** a pixel-diff or animation-timing certification.
Only the Contact second panel has a supplied reference screenshot. The page-text
retriever exposes headings, section order and links, not CSS, live scroll behaviour
or keyframe timing. Full-page reference screenshots (desktop/mobile) and a short
recording of scrolling/hover are needed for a verified visual/motion comparison.

## Shared page map

| Owner route | Reference route | Structure applied / checked |
| --- | --- | --- |
| `/` | `/` | Numbered illustrated chapters 01–09; owner portfolio/biography; original Process and testimonials retained |
| `/services/` | `/our-services/` | Three illustrated chapters, three-line headings, descriptive service-link rows, alternating art placement, chapter links and watermarks |
| `/services/web-hosting/` | `/web-hosting/` | Overview → six features → requirements/contact |
| `/services/website-design/` | `/website-design/` | Overview → six features → requirements/contact; owner HTML email/landing-page/conversion support retained in expandable scope |
| `/services/ecommerce/` | `/ecommerce-website-development/` | Same three chapters; owner marketplace/content work retained |
| `/services/business-systems/` | `/business-systems/` | Same three chapters; requirements-based, no invented fixed product |
| `/services/workflow-automation/` | `/workflow-automation/` | Same three chapters; AI optional and human oversight retained |
| `/services/ai-assistants/` | `/ai-assistants-chatbots/` | Same three chapters; approved knowledge and human handover scope retained |
| `/services/basic-graphic-design/` | `/graphic-design/` | Same three chapters; explicitly **basic** scope, no expanded rebranding promises |
| `/services/seo-and-search/` | `/seo-and-search/` | Same three chapters; no ranking guarantees |
| `/services/google-ads/` | `/google-ad-campaigns/` | Same three chapters; ad spend and results limitations retained |
| `/portfolio/` | `/our-portfolio/` | Three-line intro, original illustration, preview grid and outward actions; owner categories, 30 projects and free/premium prompt interactions retained |
| `/contact/` | `/contact-us/` | Contact details → next steps; original vector on left of next-step copy, outlined middle headline, vertical divided steps and NEXT STEP watermark |

Owner-only About, project details, privacy, resources and Product Design & Strategy
remain. Strategy uses the same new service-detail template; it is listed within
the final directory chapter, not deleted to force the reference's nine services.

## Shared visual / interaction implementation

- Original navy/emerald palette and radial glow: `assets/css/theme.css`.
- Public-page gutters aligned; chapter typography has explicit selectors that
  override the retired generic service heading sizes.
- Three-line solid / outlined / emerald titles, numbered kickers, small uppercase
  subtitles and oversized outline watermarks.
- Directory link rows replace the previous separate hero + card directory.
- All ten detail pages share overview, six-feature and contact/brief chapters.
  Additional owner scope is available through a native accessible disclosure.
- New imagery references only owner-authored local SVGs; no Rhino mascot,
  founder portrait, project image or other Digital Rhino artwork is reused.
- Scroll-entry fades and lifts, staggered headline lines, artwork hover movement,
  animated row arrows/underlines and chapter anchor links. These are independent
  implementations, not verified replicas of the reference's exact timings.
- Removed the captured 480ms blocking route-curtain/remount transition and upstream
  Vercel telemetry mounts. Route changes render immediately without resetting menus.
- No artificial loading percentage, audio, forced scroll hijacking or unneeded
  cookie banner. Reduced motion disables animations. Content is visible without JS.
- SPA additions get the same entry behaviour; removed elements are unobserved.
- Anchor destinations clear the sticky two-row header.

## Preserved explicit owner differences

Home 08/09 wording and original testimonials/process; compact WhatsApp header;
About/dropdown Contact; centered privacy footer link; five labelled footer contact
actions (except the intentionally simplified contact-page footer); 30 projects;
free prompt copy-in-place with no outbound/detail icon; premium cards to Selar;
HTML email design under Website Design; coming-soon status honesty and all exact
owner contacts. No Google reviews, Rhino branding or borrowed mascot artwork.

## Verification

- `npm run build && npm test`
- `AWS_EXECUTION_ENV=AWS_Lambda_nodejs22.x node scripts/check-studio-layout-browser.mjs`
- Existing contact, prompt-card, motion and background-system browser regressions.

The new studio regression covers all 11 service routes at 320, 375, 768, 801,
1024 and 1440px, directory row counts, three chapters per route, vector placement,
six features, three brief points, direct contact links, no horizontal page
scroll, anchor alignment, SPA navigation, no-JS visibility and reduced motion.
