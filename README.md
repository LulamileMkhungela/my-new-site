# my-new-site

**Lulamile M** — designer, founder and builder, South Africa (ZA).
The portfolio, rebuilt as a static site: content and images from
**[shubhamranjan-portfolio.vercel.app](https://shubhamranjan-portfolio.vercel.app/)**, with a **Tools** section taken from
**[github.com/LulamileMkhungela/devzigner](https://github.com/LulamileMkhungela/devzigner)** sitting directly after Home in the nav.

No build step, no framework, no dependencies. Open `index.html` or serve the folder.

```sh
python3 -m http.server 8080 --bind 0.0.0.0   # then open http://localhost:8080
```

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home — hero, client logos, selected work with category filters, process, areas of work, testimonials |
| `tools.html` | The builder toolkit — eight tools with their full step lists, the five-stage flow, the skill library, the command set, install |
| `work.html` | Full portfolio index plus the six-project archive |
| `case-study.html?id=…` | Any of the twelve case studies, rendered from the data file |
| `services.html` | The four areas of work — offerings, deliverables, who it's for, questions |
| `about.html` | About, portrait, quote, clients, testimonials |
| `contact.html` | Contact form (opens your mail app), links, common questions |
| `404.html` | Not found |

`?id=` accepts either a product id (`pasio-banking-app`), a graphic id (`pasio-marketing-prints`) or an Amazon study
(`culina-craftique`, `ELVD-Wellness`).

## Where the content comes from

```
assets/js/data.js          site copy: nav, services, process, testimonials, about  (from the live site)
assets/js/projects.data.js case studies, generated — do not hand-edit             (from the live site)
assets/js/tools.data.js    the eight tools, skills, commands, stages, install     (from devzigner)
reference/source-mirror/   the captured React bundle and CSS the generator reads   (provenance)
```

`projects.data.js` is produced by reading the project arrays out of the source site's captured bundle:

```sh
node scripts/build-data.mjs
```

That keeps the case studies faithful to 1:1 rather than retyped. Edit `data.js` for site copy; re-run the generator
for case studies.

## Images

Images are resolved in three steps, so a missing file is never a broken image:

1. `assets/img/projects/<name>` — local, fast, versioned;
2. `https://shubhamranjan-portfolio.vercel.app/projects/<name>` — the original site;
3. an inline generated placeholder that still reads (tinted block with the asset name).

To make everything local:

```sh
scripts/fetch-assets.sh            # only what is missing
scripts/fetch-assets.sh --force    # re-fetch everything
```

The script takes the list straight from `assets/js/projects.data.js`, plus the client logos and the portrait.

## Checks

```sh
node scripts/build-data.mjs   # regenerate case studies from the source bundle
node scripts/check-links.mjs  # every internal link and local image path resolves
```

## Notes on the two sources

- **Identity** (name, location, email, LinkedIn, portrait, favicon) is Lulamile M's. **Location** is
  South Africa (ZA) throughout — hero, about, contact and footer.
- **Case studies, copy, services, testimonials, filters and logo order** come from the live portfolio. Where the live
  site only had a one-line description, that is what is used — nothing was invented to fill a gap.
- **The Tools section** mirrors the devzigner repo: the eight tools in its order, the step sequences its `SKILL.md`
  files actually define, the paths each one ships at, the five ProdOps stages, the workspace map, the command set and
  the install commands from its README.
- Fonts (Clash Grotesk, Inter) load from Fontshare and Google Fonts. Palette, radii and type scale follow the source
  site's tokens, with a dark theme and a mobile drawer added.
