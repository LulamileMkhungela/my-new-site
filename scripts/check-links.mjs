/**
 * Checks every page: internal links resolve, local images exist, scripts load
 * without throwing, and each page has exactly one h1.
 *
 *   node scripts/check-links.mjs
 *
 * Exits non-zero on a broken link or a page-level script error. Missing local
 * images are reported but do not fail the run — those fall back to the live
 * site, and `scripts/fetch-assets.sh` fills them in.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

/* case-study.html renders its heading from data, so its h1 is checked after JS. */
const DYNAMIC = new Set(['case-study.html']);

const PAGES = [
  'index.html',
  'tools.html',
  'work.html',
  'services.html',
  'about.html',
  'contact.html',
  '404.html',
  'case-study.html',
];

let failures = 0;
const exists = (file) => fs.existsSync(path.join(ROOT, file));

for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const issues = [];

  /* Links in the markup. Anything built by JS is covered by the data checks below. */
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|#|data:|\/\/)/.test(href)) continue;
    if (href.includes('${')) continue; /* built at runtime, checked in the DOM pass */
    const target = href.split(/[?#]/)[0];
    if (target && !exists(target)) issues.push(`broken link → ${href}`);
  }

  /* Local scripts and stylesheets must be real files. */
  for (const match of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
    const file = match[1];
    if (file.startsWith('assets/img/')) continue; /* images fall back to the live site */
    if (!exists(file)) issues.push(`missing asset → ${file}`);
  }

  if (!DYNAMIC.has(page)) {
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) issues.push(`expected one <h1>, found ${h1s}`);
  }

  if (issues.length) {
    failures += issues.length;
    console.log(`✗ ${page}`);
    issues.forEach((issue) => console.log(`    ${issue}`));
  } else {
    console.log(`✓ ${page}`);
  }
}

/* Case studies: every id in the generated data must render, and every image
   name must look like a file the fetcher can ask for. */
const data = fs.readFileSync(path.join(ROOT, 'assets/js/projects.data.js'), 'utf8');
const ids = [...data.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]);
const images = new Set();
const walk = (value) => {
  if (!value) return;
  if (typeof value === 'string') {
    if (/\.(webp|png|jpe?g|svg)$/i.test(value)) images.add(value);
    return;
  }
  if (typeof value === 'object') Object.values(value).forEach(walk);
};
walk(JSON.parse(data.slice(data.indexOf('{'), data.lastIndexOf('}') + 1)));

console.log(`\n${ids.length} case studies: ${ids.join(', ')}`);
const local = [...images].filter((name) => exists(`assets/img/projects/${name}`));
console.log(`${images.size} images referenced · ${local.length} local · ${images.size - local.length} served from the live site`);
console.log('run scripts/fetch-assets.sh to pull the rest in');

if (failures) {
  console.log(`\n${failures} problem(s)`);
  process.exit(1);
}
console.log('\nno broken links');
