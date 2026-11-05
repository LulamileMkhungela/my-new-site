/**
 * Generates assets/js/projects.data.js from the captured source bundle.
 *
 * The portfolio at https://shubhamranjan-portfolio.vercel.app/ ships as a React
 * build, so its content lives inside the bundle rather than in HTML. The bundle
 * captured in reference/source-mirror/ is read here, the project arrays are
 * parsed out of it, and the result is written as a plain script file the static
 * pages can load. Nothing is invented: every string below comes from the site.
 *
 *   node scripts/build-data.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const BUNDLE = path.join(ROOT, 'reference/source-mirror/assets/index-DEiHh-6e.js');
const OUT = path.join(ROOT, 'assets/js/projects.data.js');

const src = fs.readFileSync(BUNDLE, 'utf8');

/** Balanced-bracket slice, so a nested array of objects survives intact. */
function slice(start) {
  let depth = 0;
  let str = null;
  for (let i = start; i < src.length; i += 1) {
    const c = src[i];
    if (str) {
      if (c === '\\') i += 1;
      else if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') str = c;
    else if (c === '[' || c === '{' || c === '(') depth += 1;
    else if (c === ']' || c === '}' || c === ')') {
      depth -= 1;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error('unbalanced');
}

/** Every `name = [{...}]` literal in the bundle, evaluated safely. */
function arrays() {
  const found = {};
  const re = /([A-Za-z0-9_$]+)\s*=\s*\[\{/g;
  let match;
  while ((match = re.exec(src))) {
    const start = src.indexOf('[', match.index);
    try {
      found[match[1]] = new Function(`return (${slice(start)})`)();
    } catch {
      /* not a data literal — skip */
    }
  }
  return found;
}

const data = arrays();

// The minified names differ from build to build, so the arrays are identified by
// their shape rather than by name.
const all = Object.values(data);
const projects = all.find((a) => a.length === 3 && a[0]?.caseStudy && a[0].id === 'pasio-banking-app');
const graphics = all.find((a) => a.length === 1 && a[0]?.id === 'pasio-marketing-prints');
const amazon = all.find((a) => Array.isArray(a) && a.length === 2 && a.some?.((p) => p.id === 'culina-craftique'));
const archive = all.find((a) => a.length === 6 && a[0]?.id === 'archive-1');

if (!projects || !graphics || !amazon || !archive) {
  throw new Error('Could not locate the project arrays in the bundle');
}

const text = (value) => (typeof value === 'string' ? value.trim() : '');
/** Image names are stored bare ("cover-pasio.webp"); the pages add the folder. */
const image = (value) => text(value).replace(/^\/?projects\//, '');
const list = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

function blocks(section) {
  return list(section.blocks).map((block) => ({
    heading: text(block.subHeading || block.heading),
    body: text(block.body),
    image: image(block.image),
  }));
}

function subItems(section) {
  return list(section.subItems).map((item) => ({
    heading: text(item.subHeading || item.heading),
    body: text(item.body),
    image: image(item.image),
  }));
}

/** A case study built from the long `caseStudy` object on the product projects. */
function caseStudy(project) {
  const c = project.caseStudy ?? {};
  const intro = c.introduction ?? {};
  const problem = c.problem ?? {};
  const goals = c.goals ?? {};
  const users = c.ourUsers ?? {};
  const process = c.process ?? {};
  const continued = c.designContinued ?? {};
  const expansion = c.expansion ?? {};
  const learned = c.whatWeLearned ?? {};

  return {
    hero: image(c.heroImage) || image(project.image),
    summary: {
      title: text(intro.title) || 'Introduction',
      body: text(intro.body),
      disclaimer: text(intro.disclaimer),
    },
    problem: {
      title: text(problem.title) || 'The problem',
      cards: list(problem.cards).map((card) => ({
        heading: text(card.heading),
        body: text(card.body),
        noteHeading: text(card.subHeading),
        note: text(card.subBody),
      })),
    },
    blueprint: {
      title: text(c.definingProblem?.title),
      image: image(c.definingProblem?.image),
    },
    goals: {
      title: text(goals.title),
      businessTitle: text(goals.businessGoalsTitle) || 'Business goals',
      business: list(goals.businessGoals).map(text),
      userTitle: text(goals.userGoalsTitle) || 'User goals',
      user: list(goals.userGoals).map(text),
    },
    users: {
      title: text(users.title) || 'Users',
      body: text(users.body),
      personas: list(users.personas).map((persona) => ({
        image: image(persona.image),
        name: text(persona.name),
        body: text(persona.description),
      })),
    },
    process: {
      title: text(process.title) || 'Process',
      steps: list(process.steps).map((step) => ({
        heading: text(step.subHeading),
        body: text(step.body),
        image: image(step.image),
      })),
    },
    build: {
      title: text(continued.title),
      body: text(continued.body),
      sections: list(continued.subSections).map((section) => ({
        heading: text(section.subHeading),
        body: text(section.body),
        image: image(section.image),
      })),
    },
    impact: {
      body: text(c.impact?.body),
      image: image(c.impact?.image),
    },
    localisation: {
      body: text(c.adaptedForOtherCountries?.body),
      image: image(c.adaptedForOtherCountries?.image),
    },
    expansion: {
      title: text(expansion.title),
      items: list(expansion.items).map((item) => ({
        heading: text(item.subHeading),
        body: text(item.body),
        image: image(item.image),
      })),
    },
    learned: {
      title: text(learned.title),
      items: list(learned.items).map((item) => ({
        heading: text(item.subHeading),
        body: text(item.body),
        image: image(item.image),
      })),
    },
    thanks: text(c.thankYouMessage),
  };
}

/** Marketing case studies carry a flat `sections` list instead. */
function sections(project) {
  return list(project.sections).map((section) => ({
    type: section.type,
    heading: text(section.heading),
    body: text(section.body),
    image: image(section.image),
    cards: list(section.cards).map((card) => ({
      tag: text(card.tag),
      heading: text(card.heading),
      body: text(card.body),
    })),
    items: subItems(section),
    blocks: blocks(section),
  }));
}

function base(project, kind, slug) {
  return {
    kind,
    slug,
    id: project.id,
    title: text(project.title),
    client: text(project.company),
    year: text(project.year),
    description: text(project.description),
    role: text(project.role),
    team: text(project.team),
    duration: text(project.duration),
    skills: list(project.skills).map(text),
    tags: list(project.tags).map(text),
    cover: image(project.image),
    url: text(project.url),
  };
}

const out = {
  product: projects.map((p) => {
    const entry = base(p, 'project', p.id);
    entry.caseStudy = caseStudy(p);
    return entry;
  }),
  graphic: Object.fromEntries(
    graphics.map((p) => {
      const entry = base(p, 'graphic', p.id);
      entry.hero = image(p.heroImage) || entry.cover;
      entry.summary = text(p.introduction);
      entry.sections = sections(p);
      entry.thanks = text(p.thankYouMessage);
      return [p.id, entry];
    }),
  ),
  amazon: Object.fromEntries(
    amazon.map((p) => {
      const entry = base(p, 'amazon', p.id);
      entry.hero = image(p.heroImage) || entry.cover;
      entry.sections = sections(p);
      return [p.id, entry];
    }),
  ),
  archive: archive.map((p) => base(p, 'archive', p.id)),
};

const header = `/**
 * Project content, generated from the live portfolio bundle.
 *
 *   node scripts/build-data.mjs
 *
 * Source: https://shubhamranjan-portfolio.vercel.app/ (captured React build in
 * reference/source-mirror/). Do not hand-edit — change the source and re-run.
 */
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${header}window.PROJECTS = ${JSON.stringify(out, null, 2)};\n`);

const count = out.product.length + Object.keys(out.graphic).length + Object.keys(out.amazon).length + out.archive.length;
console.log(`wrote ${path.relative(ROOT, OUT)} — ${count} case studies`);
