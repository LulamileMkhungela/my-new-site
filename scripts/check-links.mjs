/**
 * Static integrity checks for the professional site.
 *   node scripts/check-links.mjs
 * Checks internal links, local assets, data shape, image files, attribution
 * hygiene and the free/paid prompt boundary. No network access required.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

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
const selectedProjects = PROJECTS.product;
if (selectedProjects.length !== expected.length) fail(`expected ${expected.length} projects, found ${selectedProjects.length}`);
for (const [id, category] of expected) {
  const project = selectedProjects.find((item) => item.id === id);
  if (!project) { fail(`missing project ${id}`); continue; }
  if (project.category !== category) fail(`${id}: category ${project.category}, expected ${category}`);
  if (!project.sourceUrl.startsWith('https://lulamilemkhungela.github.io/portfolio.github.io/')) fail(`${id}: wrong source`);
  if (project.cover && !exists(`assets/img/projects/${project.cover}`)) fail(`${id}: missing cover ${project.cover}`);
  for (const section of project.sections) for (const image of section.images) {
    if (!exists(`assets/img/projects/${image.src}`)) fail(`${id}: missing image ${image.src}`);
  }
  const caseImages = [project.caseStudy.hero, project.caseStudy.blueprint.image, ...project.caseStudy.build.sections.map((item) => item.image)].filter(Boolean);
  for (const image of caseImages) if (!exists(`assets/img/projects/${image}`)) fail(`${id}: missing case image ${image}`);
}
ok(`${selectedProjects.length} projects · ${SITE.filters.filter((f) => f.tag !== 'all').map((f) => `${f.label} ${selectedProjects.filter((p) => p.tags.includes(f.tag)).length}`).join(' · ')} · original archive link`);

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
const toolIds = new Set(TOOLKIT_DATA.tools.map((tool) => tool.id));
if (groupedTools.length !== TOOLKIT_DATA.tools.length || new Set(groupedTools).size !== TOOLKIT_DATA.tools.length || groupedTools.some((id) => !toolIds.has(id))) fail('toolkit groups must contain every tool exactly once');
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

/* Exact original structure: content may change, page skeletons and CSS rules may not. */
const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, 'reference/ui-structure.json'), 'utf8'));
const sectionAttrs = (html) => {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  return [...main.matchAll(/<section\b([^>]*)>/g)].map((m) => m[1].replace(/\s+/g, ' ').trim());
};
for (const [page, expectedSections] of Object.entries(baseline.pageSections)) {
  const actual = sectionAttrs(fs.readFileSync(path.join(ROOT, page), 'utf8'));
  if (JSON.stringify(actual) !== JSON.stringify(expectedSections)) fail(`${page}: section structure differs from the original my-new-site`);
}
const resourceSections = sectionAttrs(fs.readFileSync(path.join(ROOT, 'resources.html'), 'utf8')).filter((attrs) => !/id="(prompts|reading)"/.test(attrs));
if (JSON.stringify(resourceSections) !== JSON.stringify(baseline.resourcesOriginalSections)) fail('resources.html: original Tools sections were changed or reordered');
const cssRules = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
for (const [file, hash] of Object.entries(baseline.cssRulesSha256)) {
  const actual = crypto.createHash('sha256').update(cssRules(fs.readFileSync(path.join(ROOT, file), 'utf8'))).digest('hex');
  if (actual !== hash) fail(`${file}: visual rules differ from the original my-new-site`);
}
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const workHtml = fs.readFileSync(path.join(ROOT, 'work.html'), 'utf8');
const resourcesHtml = fs.readFileSync(path.join(ROOT, 'resources.html'), 'utf8');
const shellJs = fs.readFileSync(path.join(ROOT, 'assets/js/shell.js'), 'utf8');
const resourcesJs = fs.readFileSync(path.join(ROOT, 'assets/js/resources.js'), 'utf8');
const homeJs = fs.readFileSync(path.join(ROOT, 'assets/js/home.js'), 'utf8');
const workJs = fs.readFileSync(path.join(ROOT, 'assets/js/work.js'), 'utf8');
if (!indexHtml.includes('data-marquee') || !indexHtml.includes('data-archive') || !workHtml.includes('data-archive')) fail('original marquee/archive structure missing');
if (!shellJs.includes("label: 'Resources'") || !shellJs.includes('data-sticky') || !shellJs.includes('data-drawer')) fail('original header/drawer/nav hooks missing');
if (!homeJs.includes('setInterval') || !homeJs.includes('data-quote-next') || !workJs.includes('data-filter')) fail('original carousel/filter interactions missing');
if (!resourcesHtml.includes('tools-hero') || !resourcesJs.includes('data-tool-tabs') || !resourcesJs.includes('tool-panel') || !resourcesJs.includes('data-grant')) fail('original Resources tab/panel/access interaction missing');
if (exists('assets/js/project-ui.js')) fail('rejected grouped project/prompt renderer is still present');
ok('original my-new-site page skeletons, CSS rules, animations and interaction hooks preserved');

if (failures) { console.error(`\n${failures} problem(s)`); process.exit(1); }
console.log('\nAll static checks passed.');
