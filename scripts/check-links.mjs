/**
 * Static integrity checks for the professional site.
 *   node scripts/check-links.mjs
 * Checks internal links, local assets, data shape, image files, attribution
 * hygiene and the free/paid prompt boundary. No network access required.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index.html', 'resources.html', 'work.html', 'services.html', 'about.html', 'contact.html', '404.html', 'case-study.html'];
const exists = (file) => fs.existsSync(path.join(ROOT, file));
let failures = 0;
const fail = (message) => { failures += 1; console.error(`✗ ${message}`); };
const ok = (message) => console.log(`✓ ${message}`);

const context = { window: {} };
vm.createContext(context);
for (const file of ['data.js', 'projects.data.js', 'prompts.data.js', 'resources.data.js', 'toolkit.data.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js', file), 'utf8'), context, { filename: file });
}
const { SITE, PROJECTS, PROMPTS, RESOURCES_DATA, TOOLKIT_DATA } = context.window;

for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const issues = [];
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(href) || href.includes('${')) continue;
    const [target, fragment] = href.split('#');
    if (target && !exists(target.split('?')[0])) issues.push(`broken link → ${href}`);
    const dynamicFragments = new Set(['toolkit', 'prompts', 'reading', ...SITE.services.map((service) => service.id)]);
    if (!target && fragment && !ids.has(fragment) && !dynamicFragments.has(fragment)) issues.push(`missing fragment → ${href}`);
  }
  for (const match of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
    if (!exists(match[1])) issues.push(`missing asset → ${match[1]}`);
  }
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (page !== 'case-study.html' && h1s !== 1) issues.push(`expected one static <h1>, found ${h1s}`);
  if (/shubham|pasio-banking|gojo|sr-theme/i.test(html)) issues.push('legacy source attribution or theme key');
  if (issues.length) issues.forEach((issue) => fail(`${page}: ${issue}`));
  else ok(page);
}

/* Project collection: exactly the public desktop selection, in source categories. */
const expected = [
  ['employee-engagement-app-redesign', 'Product'], ['foodiezone-pwa', 'Impact'],
  ['designops-design-system', 'Product'], ['forma-design-system', 'Product'],
  ['prodops', 'Product'], ['toyota-mobility-brand', 'Brand'],
];
if (PROJECTS.length !== expected.length) fail(`expected ${expected.length} projects, found ${PROJECTS.length}`);
for (const [id, category] of expected) {
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) { fail(`missing project ${id}`); continue; }
  if (project.category !== category) fail(`${id}: category ${project.category}, expected ${category}`);
  if (!project.sourceUrl.startsWith('https://lulamilemkhungela.github.io/portfolio.github.io/')) fail(`${id}: wrong source`);
  if (project.cover && !exists(`assets/img/projects/${project.cover}`)) fail(`${id}: missing cover ${project.cover}`);
  for (const section of project.sections) for (const image of section.images) {
    if (!exists(`assets/img/projects/${image.src}`)) fail(`${id}: missing image ${image.src}`);
  }
}
ok(`${PROJECTS.length} projects · ${SITE.categories.map((c) => `${c.label} ${PROJECTS.filter((p) => p.category === c.id).length}`).join(' · ')}`);

/* Prompt boundary: free text is present; paid bodies never enter the repo. */
const free = PROMPTS.filter((prompt) => prompt.access === 'free');
const paid = PROMPTS.filter((prompt) => prompt.access === 'paid');
for (const prompt of PROMPTS) {
  if (prompt.author !== SITE.name) fail(`prompt ${prompt.id}: wrong author`);
  if (prompt.cover && !exists(`assets/img/prompts/${prompt.cover}`)) fail(`prompt ${prompt.id}: missing cover`);
  if (prompt.access === 'free' && !prompt.prompt.trim()) fail(`free prompt ${prompt.id}: empty text`);
  if (prompt.access === 'paid' && (prompt.prompt || !prompt.url.startsWith('https://selar.com/'))) fail(`paid prompt ${prompt.id}: unsafe boundary`);
}
ok(`${PROMPTS.length} prompts · ${free.length} free · ${paid.length} paid · no paid bodies`);

/* Resources: grouped, credited, and access-labelled. */
const groupedTools = TOOLKIT_DATA.groups.flatMap((group) => group.tools);
if (groupedTools.length !== TOOLKIT_DATA.tools.length || new Set(groupedTools).size !== TOOLKIT_DATA.tools.length) fail('toolkit groups must contain every tool exactly once');
for (const item of RESOURCES_DATA.items) {
  if (!['free', 'paid', 'freemium'].includes(item.access) || !item.price || !item.provider) fail(`resource ${item.id}: missing access/provider metadata`);
  if (!/^https:\/\//.test(item.url)) fail(`resource ${item.id}: invalid URL`);
}
ok(`${TOOLKIT_DATA.tools.length} tools in ${TOOLKIT_DATA.groups.length} groups · ${RESOURCES_DATA.items.length} credited external resources`);

/* No training documents or legacy mirror are part of the site. */
const walk = (dir) => fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((entry) => {
  const rel = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(rel) : [rel];
});
const files = walk('assets').concat(walk('reference'));
if (files.some((file) => /certificate|source-mirror/i.test(file))) fail('training documents or legacy source mirror found');
for (const file of files.filter((file) => /\.(js|html|json|css)$/.test(file))) {
  const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (/shubhamranjan|pasio-banking-app|Gojo & Company|sr-theme/.test(text)) fail(`legacy content in ${file}`);
}
ok('no training documents, legacy mirror or borrowed project attribution');

/* Original my-new-site UI/interaction hooks must remain in place. */
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const resourcesHtml = fs.readFileSync(path.join(ROOT, 'resources.html'), 'utf8');
const siteCss = fs.readFileSync(path.join(ROOT, 'assets/css/site.css'), 'utf8');
const baseCss = fs.readFileSync(path.join(ROOT, 'assets/css/base.css'), 'utf8');
const shellJs = fs.readFileSync(path.join(ROOT, 'assets/js/shell.js'), 'utf8');
const resourcesJs = fs.readFileSync(path.join(ROOT, 'assets/js/resources.js'), 'utf8');
const homeJs = fs.readFileSync(path.join(ROOT, 'assets/js/home.js'), 'utf8');
if (!indexHtml.includes('data-marquee') || !indexHtml.includes('logo-note')) fail('home marquee structure missing');
if (!siteCss.includes('@keyframes marquee') || !baseCss.includes('[data-reveal]') || !baseCss.includes('.site-header.is-hidden')) fail('original animation/reveal/sticky CSS missing');
if (!shellJs.includes("label: 'Process'") || !shellJs.includes('data-sticky') || !shellJs.includes('data-drawer')) fail('original header/drawer/nav hooks missing');
if (!homeJs.includes('setInterval') || !homeJs.includes('data-quote-next')) fail('original testimonial carousel interaction missing');
if (!resourcesHtml.includes('tools-hero') || !resourcesJs.includes('data-tool-tabs') || !resourcesJs.includes('tool-panel') || !resourcesJs.includes('data-grant')) fail('original Resources tab/panel/access interaction missing');
ok('original my-new-site UI, animations and interaction hooks present');

if (failures) { console.error(`\n${failures} problem(s)`); process.exit(1); }
console.log('\nAll static checks passed.');
