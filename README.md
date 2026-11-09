# Lulamile Mkhungela — professional site

Professional site for **Lulamile Mkhungela**, product designer and UI developer based in **Johannesburg, South Africa**.

The interface is the captured reference build preserved in this repository’s Git history: time-based greeting screen, split-screen exit, scroll-filled hero headline, Expertise dropdown, sticky hide/show header, mobile drawer, theme toggle, ambient background, page transitions, work filters, testimonial carousel and ambient music control. The stylesheet is the captured reference stylesheet byte-for-byte; the content, projects, resources and identity are Lulamile’s. The reference fonts (Clash Grotesk and Inter) are self-hosted so the preview does not depend on external font hosts.

## Run

```sh
npm install
npm run build
python3 -m http.server 8080 --bind 0.0.0.0
```

`src/app.jsx` is the source. `assets/js/app.js` is the committed production bundle, so the site can also be served statically without rebuilding.

## Pages

| Page | Content |
| --- | --- |
| `index.html` | Greeting, hero, clients marquee, selected work + Archive, process, expertise rows, about teaser, endorsements, contact band |
| `work.html` | Six public portfolio projects: **Product 4 · Impact 1 · Brand 1**, with category filters and Archive |
| `case-study.html?id=…` | Local case studies with role, process, outcomes and evidence boundaries |
| `resources.html` | Grouped builder toolkit, AI design prompts, credited external reading list |
| `services.html` / `service.html?id=…` | Expertise overview and service detail |
| `about.html` | Bio, portrait, quote, clients, endorsements |
| `contact.html` | Book-a-call / email tabs, mail-app form, contact links |
| `tools.html` | Legacy route rendered as Resources |

## Content sources

- Projects and prompts: <https://lulamilemkhungela.github.io/portfolio.github.io/>
- Toolkit: <https://github.com/LulamileMkhungela/devzigner>
- External reading: <https://90n.ai/resources> and <https://90n.ai/guides>, plus Lantern. Publishers retain authorship; access labels were checked on 2026-11-07.

```text
src/app.jsx                       React source for the reference UI + Lulamile content
assets/js/app.js                  committed production bundle
assets/css/reference.css          captured reference stylesheet (unchanged)
assets/css/additions.css          self-hosted font faces, keyframes and content-page utilities
assets/fonts/                     Clash Grotesk + Inter variable fonts and notices
assets/audio/                     local ambient fallback loops for the music control
assets/js/data.js                 professional copy, services, bio, endorsements
assets/js/projects.data.js        imported public project content (generated)
assets/js/prompts.data.js         imported public prompt text/metadata (generated)
assets/js/toolkit.data.js         grouped devzigner toolkit
assets/js/resources.data.js       curated external reading with access labels
reference/ui-structure.json       UI contract: stylesheet hash + required reference markers
reference/portfolio-manifest.json import scope and provenance
```

Refresh public imports:

```sh
python3 scripts/sync-portfolio.py
# or: python3 scripts/sync-portfolio.py --source-dir /path/to/portfolio.github.io
```

The importer reads only the six public desktop projects and the public prompt library. It does not import certificates, locked studies or paid prompt bodies.

## Boundaries

- No certificates or training-document galleries.
- Paid prompt bodies are not stored; paid packs link to the owner’s Selar store.
- External guides are linked, not copied, so they do not need a separate Git repository.
- The reference UI is used as the design baseline; no reference-site personal identity, projects or attribution are presented as Lulamile’s.
- The music control tries the reference ambient tracks first and falls back to local procedural loops when remote audio is blocked.

## Checks

```sh
npm run build
node scripts/check-links.mjs
```

Checks internal assets, project categories/counts, prompt authorship and free/paid boundary, resource grouping, the captured reference stylesheet hash, required greeting/hero/Expertise/music/page-transition markers, self-hosted fonts/audio fallbacks, and the absence of legacy borrowed content.
