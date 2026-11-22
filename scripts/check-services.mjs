/** Dependency-free checks for the services catalogue, renderer and deep links.
 * Run after generation: node scripts/build-site.mjs && node scripts/check-services.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root = path.resolve(import.meta.dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const catalogue = JSON.parse(read('assets/js/services.catalogue.json'));
assert.equal(catalogue.services.length, 9);
assert.equal(new Set(catalogue.services.map(item=>item.slug)).size, 9);
const nodes = tree => {
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...nodes(tree.children)];
};
const text = tree => {
  if (Array.isArray(tree)) return tree.map(text).join(' ');
  if (tree === null || tree === undefined) return '';
  return typeof tree === 'object' ? text(tree.children) : String(tree);
};
function render(url) {
  const context = {
    g: {createElement:(type,props,...children)=>typeof type==='function' ? type({...props,children}) : ({type,props:props||{},children}),Fragment:'fragment'},
    Qt:()=>({pathname:url}), XA:'metadata', ve:'link', Bn:'header', zn:'footer',
    localServiceCatalogue:catalogue,localHomeArtworkVersion:"test",localStrategyServices:[
      {path:'/product-design-strategy', title:'Product Design & Strategy', summary:'Product strategy'}
    ]
  };
  return vm.runInNewContext(read('assets/js/services.source.js')+'\n'+read('assets/js/hybrid.source.js')+'\nLocalServicesPage();',context);
}
const overview = render('/services');
const overviewNodes = nodes(overview);
assert.equal(overviewNodes.filter(n=>n.type==='h1').length,1);
assert.equal(overviewNodes.filter(n=>n.props.className==='studio-service-row').length,10);
assert.equal(overviewNodes.filter(n=>n.props.className==='studio-panel').length,3);
assert.equal(overviewNodes.filter(n=>n.props.className==='svc-card').length,0);
assert.equal(overviewNodes.filter(n=>n.type==='img').length,3);
assert.equal(overviewNodes.filter(n=>n.props.className==='svc-feature').length,0,'Overview should not show detail content');
assert.ok(text(overview).includes('Basic Graphic Design'));
for (const service of catalogue.services) {
  assert.ok(catalogue.groups.some(group=>group.id===service.group));
  assert.ok(service.summary.split(/\s+/).length <= 16,`${service.title}: summary must stay short`);
  assert.equal(service.features.length,6);
  assert.equal(service.prepare.length,3);
  for (const related of service.related) assert.ok(catalogue.services.some(item=>item.slug===related));
  const route = '/services/'+service.slug;
  const detail = render(route+'/');
  const elements = nodes(detail);
  assert.equal(elements.filter(n=>n.props.className==='studio-contact-links').length,0,'Contact methods belong in the shared footer, not repeated in service content');
  assert.equal(elements.filter(n=>/^(tel:|mailto:|https:\/\/wa\.me\/)/.test(n.props.href||'')).length,0,'No duplicate contact-method links in service body');
  assert.equal(elements.filter(n=>n.type==='h1').length,1);
  assert.equal(elements.filter(n=>n.props.className==='studio-panel').length,3);
  assert.deepEqual(Array.from(elements.filter(n=>n.props.className==='studio-panel'),n=>n.props.id),['service-intro','service-features','service-contact']);
  assert.equal(elements.filter(n=>n.props.className==='studio-visual').length,3);
  const illustrationSources=elements.filter(n=>n.type==='img').map(n=>n.props.src.split('?')[0]);
  assert.equal(new Set(illustrationSources).size,illustrationSources.length,'Each chapter must have a different illustration');
  assert.equal(elements.filter(n=>n.props.className==='studio-prepare').length,1);
  assert.ok(!elements.some(n=>n.props.className==='svc-cta'||n.props.className==='svc-related-grid'));

  assert.ok(text(detail).includes(service.title));
  assert.ok(text(detail).includes(service.note));
  assert.equal(elements.filter(n=>n.props.className==='svc-feature').length,6);
  assert.ok(elements.some(n=>n.props.to==='/services'),'Back link missing');
  assert.ok(elements.some(n=>n.props.to==='/contact'),'Contact CTA missing');
  assert.ok(read(route.slice(1)+'/index.html').includes('/assets/js/site-app.js'));
  console.log('✓ '+route);
}
const website=text(render('/services/website-design'));
for(const phrase of ['Website & conversion review','Focused landing pages','Positioning & content structure','Measurement & iteration','Marketing & SaaS websites']) assert.ok(website.includes(phrase));
const hosting=text(render('/services/web-hosting'));
for(const phrase of ['Deployment & server setup','Technical performance','SSL & HTTPS','rollback']) assert.ok(hosting.includes(phrase));
const ecommerce=text(render('/services/ecommerce'));
for(const phrase of ['Product & marketplace content','Amazon listings','Offer & competitor review','Storefront & conversion review']) assert.ok(ecommerce.includes(phrase));
const strategy=JSON.parse(read('assets/js/strategy.services.json'));
assert.equal(strategy.length,1);
assert.equal(strategy[0].slug,'product-design-strategy');
assert.ok(strategy[0].features.some(([,body])=>body.includes('Field interviews')));
for(const label of ['Website Design & Conversion','Brand Strategy & Amazon Growth','Microfinance & Impact Consulting']) assert.ok(!text(overview).includes(label));
console.log('✓ Retired service content consolidated into relevant categories; only one strategy offering');
assert.ok(text(render('/services/not-a-service')).includes('Service not found.'));
const basic = render('/services/basic-graphic-design');
assert.ok(text(basic).includes('Full rebrands'));
assert.ok(text(basic).includes('excluded'));
assert.ok(read('services.html').includes('"/services.html":"/services"'),'Legacy services URL must reach the new catalogue');
const bundle = read('assets/js/site-app.js');
assert.ok(read('assets/js/app.source.js').includes("path:'/services',element:h(LocalServicesPage)"));
assert.ok(read('assets/js/app.source.js').includes("path:'/services/:slug',element:h(LocalServicesPage)"));
assert.ok(read("assets/js/hybrid.source.js").includes("{label:'My Services',href:'/services'}"));
console.log('✓ Concise overview, all detail pages, scope, related links, metadata and legacy entry point');

assert.ok(text(website).includes("HTML email design & development"));
assert.ok(text(website).includes("unsubscribe handling"));
assert.ok(text(overview).includes("HTML email design"));
console.log("✓ HTML email design discoverable under Website Design with compatibility and delivery scope");
