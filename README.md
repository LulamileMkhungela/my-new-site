# Lulamile Mkhungela — professional site

Static professional site for **Lulamile Mkhungela**, product designer and UI developer based in **Johannesburg, South Africa**.

No framework and no runtime dependencies. Open `index.html` or serve the folder:

```sh
python3 -m http.server 8080 --bind 0.0.0.0
```

## What is on the site

| Page | Content |
| --- | --- |
| `index.html` | Positioning, selected work by category, process, services, resources, endorsements |
| `work.html` | The six public desktop projects from the owner's portfolio: **Product 4 · Impact 1 · Brand 1** |
| `case-study.html?id=…` | Local case studies with the source project's role, process, outcomes and evidence boundaries |
| `resources.html` | **Resources** (formerly Tools): grouped builder toolkit, AI design prompts, external reading list |
| `services.html` | Product/UX design, design systems/UI development, websites, brand |
| `about.html` | Professional bio, selected experience and verified endorsements |
| `contact.html` | Mail-app contact form, email, LinkedIn, GitHub and CV |
| `tools.html` | Legacy redirect to `resources.html` |

The portfolio currently exposes **six** desktop project folders, so the site uses those six rather than inventing extra projects to reach a number:

- **Product:** Vodacom Engage, DesignOps, Forma Design System, ProdOps
- **Impact:** FoodieZone (Pimville, Soweto)
- **Brand:** Toyota Mobility Brand (Toyota South Africa, via iOCO)

ProdOps and Forma are labelled **in progress**. Locked/archive studies are not imported.

## Resources and authorship

- **My toolkit:** eight tools from [LulamileMkhungela/devzigner](https://github.com/LulamileMkhungela/devzigner), grouped into product planning, design/front-end build, and agent workflows/standards.
- **AI prompts:** the owner's public [AI Design Prompts library](https://lulamilemkhungela.github.io/portfolio.github.io/portfolio/lula-design-library.html). Ten free prompts include copyable text; five paid packs link to the owner's Selar store. Paid prompt bodies and files are **not** stored here.
- **External reading:** selected free packs and guides from [90n Resources](https://90n.ai/resources) and [90n Guides](https://90n.ai/guides), plus Lantern’s free trial/paid plans. Every external card names its publisher. These are recommendations, not claims that Lulamile created them or that 90n endorses this site.
- Search, type/access filters and prompt-category filters work together. Free includes resources with a free tier; Paid includes paid packs and paid tiers.

The site, portfolio work and prompt library are branded as Lulamile Mkhungela’s. External publishers retain credit for their own material.

## Content sources

Primary source: <https://lulamilemkhungela.github.io/portfolio.github.io/>

```text
assets/js/data.js            professional copy, services, bio, endorsements
assets/js/projects.data.js   imported public project content (generated)
assets/js/prompts.data.js    imported public prompt text/metadata (generated)
assets/js/toolkit.data.js    the owner's devzigner toolkit, grouped
assets/js/resources.data.js  curated external reading with access labels
assets/img/projects/         local project images from the owner's portfolio
assets/img/prompts/          local prompt covers from the owner's portfolio
reference/portfolio-manifest.json  import scope and provenance
```

Refresh the public portfolio imports with Python’s standard library:

```sh
python3 scripts/sync-portfolio.py
# or use an existing checkout:
python3 scripts/sync-portfolio.py --source-dir /path/to/portfolio.github.io
```

The importer reads only the six public desktop projects and the public prompt library from the owner's GitHub repository. It does **not** import training documents, locked studies or paid prompt bodies. Review upstream category/status changes before publishing a refresh.

## Professional-only boundary

This repository is a professional brand site. It deliberately contains **no certificates or training-document galleries**. The previous borrowed source mirror and unrelated project archive have been removed. Case studies keep the original evidence caveats instead of inventing metrics.

## Checks

```sh
node scripts/check-links.mjs
```

Checks internal links, local assets, project categories/counts, prompt authorship, the free/paid boundary, resource grouping, and the absence of the legacy mirror or training documents.

External access labels were checked against publisher pages on **2026-11-07**; providers can change prices and terms. Fonts load from Fontshare and Google Fonts. Theme preference is stored locally under `lm-theme`.
