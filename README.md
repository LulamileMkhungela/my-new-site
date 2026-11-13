# my-new-site

**Lulamile M** — designer, founder and builder, South Africa (ZA).
The portfolio, rebuilt as a static site: content and images from
**[shubhamranjan-portfolio.vercel.app](https://shubhamranjan-portfolio.vercel.app/)**, with a **Tools** section taken from
**[github.com/LulamileMkhungela/devzigner](https://github.com/LulamileMkhungela/devzigner)** sitting directly after Home in the nav.

No build step, no framework, no dependencies. Open `index.html` or serve the folder.

## The UI is the reference's, not a re-skin

`assets/css/base.css` and `assets/css/site.css` implement the reference design system directly, taken from the
captured bundle in `reference/source-mirror/` rather than approximated:

- **Tokens** — the reference's HSL custom properties, value for value (`--background 260 42% 96%`,
  `--foreground 255 45% 12%`, `--hero-accent 16 85% 55%` light / `170 80% 55%` dark, the six project tints), exposed
  here as `--bg`, `--fg`, `--accent`, `--lavender` … with the same dark-mode values.
- **Type** — Clash Grotesk display + Inter body; eyebrows are 10–11px, bold, `.22em` uppercase with an accent dot;
  headings carry the accent on the last phrase (`great design`, `spoken by others`) and are never italic.
- **Components** — sticky header at 95% background with blur and a hairline border, round avatar ringed in the accent,
  the Expertise hover/click panel, 2rem-radius media, pill buttons, pill filters filled with the accent when selected,
  full-bleed project rows with an `01 / 08` counter in white mono over the image and a 3/5 · 2/5 text split, the
  hairline process box with accent numerals, full-bleed service rows with a round numeral that fills on hover, the
  stacked quote panel with a 4px accent hairline, the ink CTA band, and the single-row footer.

Section order, copy and content are Lulamile's; only the language is the reference's.

```sh
python3 -m http.server 8080 --bind 0.0.0.0   # then open http://localhost:8080
```

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home — hero, client logos, selected work with category filters, process, areas of work, testimonials |
| `tools.html` | The builder toolkit — eight tools with their full step lists, the five-stage flow, the skill library, the command set, install |
| `work.html` | Full portfolio index — studies, the live products that are a redirect only, and the six-project archive |
| `case-study.html?id=…` | Any case study, rendered from the data file (including FoodieZone and Africa Cuisine) |
| `expertise.html` | Expertise — ProdOps (the product I own) then the five areas of practice, the stack and the training |
| `services.html` | The four areas of work — offerings, deliverables, who it's for, questions |
| `about.html` | About, portrait, quote, clients, testimonials |
| `contact.html` | Contact form (opens your mail app), links, common questions |
| `404.html` | Not found |

`?id=` accepts either a product id (`pasio-banking-app`, `foodiezone`, `africa-cuisine`), a graphic id
(`pasio-marketing-prints`) or an Amazon study (`culina-craftique`, `ELVD-Wellness`).

## Work added on top of the source site

`assets/js/extra.data.js` holds everything that did not come from the source portfolio, and
`assets/js/work.data.js` merges it with the generated data into `window.WORK` so every page sees one list.

| Kind | Entries | Behaviour |
| --- | --- | --- |
| Case study | FoodieZone, Africa Cuisine | Full studies, rendered by `case-study.html?id=…` in the same shape as the rest |
| Redirect only | SK Finds, Nerdma, SnB, ProdOps | One card each on `work.html` under *Live & linked*, opening the live product in a new tab — no case-study page |
| Coming soon | Lawmania (Lekgotla), LulaFind, AI-LifeOS | Cards in the home page's *Mobile apps, in the build* section, each with an Android APK and an iOS button |

`foodiezone-pwa.html` and `africa-cuisine-pwa.html` are kept as redirect stubs, so links to the old portfolio's
URLs still land on the new studies.

### Turning the download buttons on

Each app carries a `downloads` object. Paste the URL in and that button becomes a real download; leave it empty and
the button stays in its labelled `Not yet` state rather than pointing at nothing:

```js
downloads: { android: 'https://…/lawmania.apk', ios: 'https://testflight.apple.com/join/…' },
```

Descriptions for the three apps are placeholders where the repo is not public yet (Lawmania, AI-LifeOS); LulaFind's
copy is written from the `Find` Android repo. Replace the placeholder text with the repo's own copy when it is ready.

## Where the content comes from

```
assets/js/data.js          site copy: nav, services, process, testimonials, about  (from the live site)
assets/js/projects.data.js case studies, generated — do not hand-edit             (from the live site)
assets/js/tools.data.js    the eight tools, skills, commands, stages, install     (from devzigner)
assets/js/extra.data.js    added work: two studies, four redirects, three apps    (hand-written, this site)
assets/js/work.data.js     merges the two project files into window.WORK          (derived, never edited)
assets/js/expertise.data.js expertise areas, ProdOps block, stack, training       (from ProdOps + this site)
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
