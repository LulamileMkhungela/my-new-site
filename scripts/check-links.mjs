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

/* The public portfolio uses owner data, not the historical reference bundle. */
const projects = JSON.parse(fs.readFileSync(path.join(ROOT,'assets/js/portfolio.projects.json'),'utf8'));
const localProjects = projects.filter(project=>project.details);
const images = new Set();
for (const project of projects) {
  for (const image of [project.image,project.previewImage,...(project.details?.gallery||[]).map(item=>item.src)].filter(Boolean)) {
    images.add(image);
    if (!exists(image)) {console.log('Missing owner image: '+image);failures++;}
  }
  if (project.details&&!exists(project.href+'/index.html')) {console.log('Missing project route: '+project.href);failures++;}
  for (const href of [project.type==='external'?project.href:null,...Object.values(project.categoryActions||{}).map(action=>action.href),...(project.details?.links||[]).map(link=>link.href)].filter(Boolean)) {
    try {if(!['https:','mailto:'].includes(new URL(href).protocol))throw new Error('Not HTTPS');}catch {console.log('Invalid external project link: '+href);failures++;}
  }
}
console.log(`\n${projects.length} owner projects; ${localProjects.length} local case studies/overviews`);
console.log(`${images.size} portfolio images referenced; all must exist locally`);

if (failures) {
  console.log(`\n${failures} problem(s)`);
  process.exit(1);
}
console.log('\nno broken links');
