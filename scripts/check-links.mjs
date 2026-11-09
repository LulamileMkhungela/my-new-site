/**
 * Static integrity checks for the professional site.
 *   node scripts/check-links.mjs
 * The UI contract is the captured reference build; the content is Lulamile's.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = ['index.html', 'work.html', 'resources.html', 'tools.html', 'services.html', 'service.html', 'about.html', 'contact.html', 'case-study.html', '404.html'];
const exists = (file) => fs.existsSync(path.join(ROOT, file));
let failures = 0;
const fail = (m) => { failures += 1; console.error(`✗ ${m}`); };
const ok = (m) => console.log(`✓ ${m}`);

const context = { window: {} };
vm.createContext(context);
for (const file of ['data.js', 'projects.data.js', 'prompts.data.js', 'resources.data.js', 'toolkit.data.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js', file), 'utf8'), context, { filename: file });
}
const { SITE, PROJECTS, PROMPTS, RESOURCES_DATA, TOOLKIT_DATA } = context.window;

for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const issues = [];
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(href)) continue;
    if (!exists(href.split(/[?#]/)[0])) issues.push(`missing asset → ${href}`);
  }
  if (!html.includes('assets/js/app.js')) issues.push('app bundle not loaded');
  if (!html.includes('assets/css/reference.css')) issues.push('reference stylesheet not loaded');
  if (/shubham|pasio-banking|gojo|sr-theme/i.test(html)) issues.push('legacy source attribution or theme key');
  if (issues.length) issues.forEach((i) => fail(`${page}: ${i}`)); else ok(page);
}

const expected = [
  ['employee-engagement-app-redesign', 'Product'], ['foodiezone-pwa', 'Impact'],
  ['designops-design-system', 'Product'], ['forma-design-system', 'Product'],
  ['prodops', 'Product'], ['toyota-mobility-brand', 'Brand'],
];
const selected = PROJECTS.product;
if (selected.length !== expected.length) fail(`expected ${expected.length} projects, found ${selected.length}`);
for (const [id, category] of expected) {
  const p = selected.find((x) => x.id === id);
  if (!p) { fail(`missing project ${id}`); continue; }
  if (p.category !== category) fail(`${id}: category ${p.category}, expected ${category}`);
  if (!p.sourceUrl.startsWith('https://lulamilemkhungela.github.io/portfolio.github.io/')) fail(`${id}: wrong source`);
  if (p.cover && !exists(`assets/img/projects/${p.cover}`)) fail(`${id}: missing cover ${p.cover}`);
  for (const section of p.sections) for (const image of section.images) if (!exists(`assets/img/projects/${image.src}`)) fail(`${id}: missing image ${image.src}`);
  const caseImages = [p.caseStudy.hero, p.caseStudy.blueprint.image, ...p.caseStudy.build.sections.map((x) => x.image)].filter(Boolean);
  for (const image of caseImages) if (!exists(`assets/img/projects/${image}`)) fail(`${id}: missing case image ${image}`);
}
ok(`${selected.length} projects · ${SITE.filters.filter((f) => f.tag !== 'all').map((f) => `${f.label} ${selected.filter((p) => p.tags.includes(f.tag)).length}`).join(' · ')}`);

const free = PROMPTS.filter((p) => p.access === 'free');
const paid = PROMPTS.filter((p) => p.access === 'paid');
for (const prompt of PROMPTS) {
  if (prompt.author !== SITE.name) fail(`prompt ${prompt.id}: wrong author`);
  if (prompt.cover && !exists(`assets/img/prompts/${prompt.cover}`)) fail(`prompt ${prompt.id}: missing cover`);
  if (prompt.access === 'free' && !prompt.prompt.trim()) fail(`free prompt ${prompt.id}: empty text`);
  if (prompt.access === 'paid' && (prompt.prompt || !prompt.url.startsWith('https://selar.com/'))) fail(`paid prompt ${prompt.id}: unsafe boundary`);
}
ok(`${PROMPTS.length} prompts · ${free.length} free · ${paid.length} paid · no paid bodies`);

const grouped = TOOLKIT_DATA.groups.flatMap((g) => g.tools);
const ids = new Set(TOOLKIT_DATA.tools.map((t) => t.id));
if (grouped.length !== TOOLKIT_DATA.tools.length || new Set(grouped).size !== TOOLKIT_DATA.tools.length || grouped.some((id) => !ids.has(id))) fail('toolkit groups must contain every tool exactly once');
for (const item of RESOURCES_DATA.items) {
  if (!['free', 'paid', 'freemium'].includes(item.access) || !item.price || !item.provider) fail(`resource ${item.id}: missing access/provider metadata`);
  if (!/^https:\/\//.test(item.url)) fail(`resource ${item.id}: invalid URL`);
}
ok(`${TOOLKIT_DATA.tools.length} tools in ${TOOLKIT_DATA.groups.length} groups · ${RESOURCES_DATA.items.length} credited external resources`);

const walk = (dir) => fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) => {
  const rel = path.join(dir, e.name);
  return e.isDirectory() ? walk(rel) : [rel];
});
const files = walk('assets').concat(walk('reference'));
if (files.some((f) => /certificate|source-mirror/i.test(f))) fail('training documents or legacy source mirror found');
for (const file of files.filter((f) => /\.(js|html|json|css|svg)$/.test(f))) {
  const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (/shubhamranjan|pasio-banking-app|Gojo & Company|sr-theme/i.test(text)) fail(`legacy content in ${file}`);
}
ok('no training documents, legacy mirror or borrowed project attribution');

for (const font of ['assets/fonts/ClashGrotesk-Variable.woff2', 'assets/fonts/Inter-Variable.woff2']) if (!exists(font)) fail(`missing self-hosted reference font: ${font}`);
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  if (/api\.fontshare\.com|fonts\.googleapis\.com/.test(html)) fail(`${page}: external font request should be self-hosted`);
}
for (const track of ['focus-1', 'focus-2', 'focus-3']) if (!exists(`assets/audio/${track}.mp3`)) fail(`missing ambient fallback track: ${track}`);
ok('self-hosted reference fonts and ambient audio fallbacks present');

const contract = JSON.parse(fs.readFileSync(path.join(ROOT, 'reference/ui-structure.json'), 'utf8'));
const css = fs.readFileSync(path.join(ROOT, contract.cssFile));
if (crypto.createHash('sha256').update(css).digest('hex') !== contract.cssSha256) fail('reference stylesheet differs from the captured reference build');
const source = fs.readFileSync(path.join(ROOT, 'src/app.jsx'), 'utf8');
const bundle = fs.readFileSync(path.join(ROOT, 'assets/js/app.js'), 'utf8');
for (const marker of contract.requiredSourceMarkers) if (!source.includes(marker)) fail(`reference UI marker missing from source: ${marker}`);
for (const marker of contract.requiredBundleMarkers) if (!bundle.includes(marker)) fail(`reference UI marker missing from bundle: ${marker} (run npm run build)`);
const recommendations = fs.readFileSync(path.join(ROOT, 'src/recommendations.jsx'), 'utf8');
for (const marker of ['data-about-recommendations', 'data-recommendation-track', 'Hover to pause', 'marquee 70s linear infinite', 'data-home-recommendations', 'data-quote-previous', 'data-quote-next', 'setInterval(next, 6000)']) if (!recommendations.includes(marker)) fail(`reference recommendation UI marker missing: ${marker}`);
if (!source.includes('<AboutRecommendations items={SITE.testimonials} />')) fail('About must use the reference recommendation strip');
if (!source.includes('<Testimonials items={SITE.testimonials} Fade={Fade} />')) fail('Home must use the reference layered carousel');
if (SITE.testimonials.length !== 7) fail('expected the seven public colleague endorsements');
for (const path of ['/resources', '/about', '/contact', '/service/:id', '/case-study/:id']) if (!source.includes(`path="${path}"`)) fail(`clean route missing: ${path}`);
const server = fs.readFileSync(path.join(ROOT, 'scripts/preview-server.mjs'), 'utf8');
for (const marker of ["\"/resources\"", "\"/about\"", "\"/contact\"", 'service\\/', 'case-study|project']) if (!server.includes(marker)) fail(`preview server route fallback missing: ${marker}`);
ok('clean routes, preview fallbacks, seven endorsements and reference recommendation layouts present');

const additions = fs.readFileSync(path.join(ROOT, 'assets/css/additions.css'), 'utf8');
for (const keyframe of ['ls-char-in', 'ls-sub-in', 'ls-line-in', 'pt-page-in', 'hero-scroll-nudge', 'audioPulse']) if (!additions.includes(`@keyframes ${keyframe}`)) fail(`missing reference keyframes: ${keyframe}`);
ok('captured reference UI contract present (greeting, hero fill, Expertise, music, page transitions)');

if (failures) { console.error(`\n${failures} problem(s)`); process.exit(1); }
console.log('\nAll static checks passed.');
