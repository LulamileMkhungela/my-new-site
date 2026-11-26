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
assert.equal(catalogue.services.length, 13);
assert.equal(new Set(catalogue.services.map(item=>item.slug)).size, 13);
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
    g: {createElement:(type,props,...children)=>typeof type==='function' ? type({...props,children}) : ({type,props:props||{},children}),Fragment:'fragment',useState:value=>[value,()=>{}],useEffect:()=>{},useRef:value=>({current:value})},
    Qt:()=>({pathname:url}), XA:'metadata', ve:'link', Bn:'header', zn:'footer',
    localServiceCatalogue:catalogue,localSiteContent:JSON.parse(read('assets/js/site.content.json')),localPortfolioProjects:JSON.parse(read('assets/js/portfolio.projects.json')),localHomeArtworkVersion:"test",localStrategyServices:[
      {path:'/product-design-strategy', title:'Product Design & Strategy', summary:'Product strategy'}
    ]
  };
  return vm.runInNewContext(read('assets/js/services.source.js')+'\n'+read('assets/js/hybrid.source.js')+'\nLocalServicesPage();',context);
}
const overview = render('/services');
const overviewNodes = nodes(overview);
assert.equal(overviewNodes.filter(n=>n.type==='h1').length,1);
assert.equal(overviewNodes.filter(n=>n.props.className==='studio-service-row').length,catalogue.services.length+1);
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
  assert.equal(elements.filter(n=>n.props.className==='studio-panel').length,service.work?.length?7:6);
  assert.deepEqual(Array.from(elements.filter(n=>n.props.className==='studio-panel'),n=>n.props.id),['service-intro','service-features',...(service.work?.length?['service-work']:[]),'service-process','service-why','service-faq','service-contact']);
  // Selected work: only real portfolio projects, max three.
  const workCards=elements.filter(n=>n.props.className==='studio-work-card');
  assert.equal(workCards.length,Math.min(3,(service.work||[]).length),'Selected work on '+route);
  // Why LulaZel + fit lists (cosmos structure).
  assert.equal(service.fit.good.length,3);assert.equal(service.fit.notFor.length,3);
  assert.equal(nodes(elements.find(n=>n.props.className==='studio-fit-good')).filter(n=>n.type==='li').length,3,'Strong-fit list on '+route);
  assert.ok(!/Lulamile/.test(text(elements.find(n=>n.props.id==='service-why'))),'Why chapter stays brand-first');
  // FAQ answers come only from the page's own content and published price.
  const faqItems=nodes(elements.find(n=>n.props.className==='studio-faq')).filter(n=>n.type==='details');
  assert.equal(faqItems.length,5,'Five service FAQs');
  assert.ok(text(detail).includes(service.prepare[0])&&text(detail).includes('Do you work outside Johannesburg?'));
  assert.ok(!/Lulamile/.test(text(elements.find(n=>n.props.id==='service-faq'))),'FAQ chapter stays brand-first');
  // How a project runs: 6 shared steps + 5 roles, linked to the full page; brand-first.
  const process=elements.find(n=>n.props.id==='service-process');
  assert.equal(nodes(process).filter(n=>n.type==='li').length,6,'Six project steps');
  assert.equal(nodes(process).filter(n=>n.type==='dt').length,JSON.parse(read('assets/js/site.content.json')).howWeWork.roles.length,'Every role in Who builds what');
  assert.ok(nodes(process).some(n=>n.props.to==='/how-we-work'));
  assert.ok(!/Lulamile/.test(text(process)),'Process chapter stays brand-first');
  // Related articles: 1–3 real blog posts.
  const postLinks=nodes(elements.find(n=>n.props.className==='studio-posts')).filter(n=>/^\/blog\/.+/.test(n.props.to||''));
  assert.ok(postLinks.length>=1&&postLinks.length<=3,'Related blog articles on '+route);
  const html=read(route.slice(1)+'/index.html'),graph=JSON.parse(html.match(/application\/ld\+json">(.*?)<\/script>/)[1])['@graph'];
  assert.equal(graph.find(n=>n['@type']==='FAQPage')?.mainEntity.length,5,'Service FAQ structured data');
  assert.match(html.match(/<title[^>]*>([^<]*)/)[1],/ \| LulaZel Digital Studio$/);
  assert.equal(graph.find(n=>n['@type']==='Service').name,service.title);
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
for(const phrase of ['Hosting setup & deployment','Technical performance','SSL & HTTPS','rollback']) assert.ok(hosting.includes(phrase));
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
assert.ok(read("assets/js/hybrid.source.js").includes("{label:'Services',href:'/services'}"));
console.log('✓ Concise overview, all detail pages, scope, related links, metadata and legacy entry point');

assert.ok(text(website).includes("HTML email design & development"));
assert.ok(text(website).includes("unsubscribe handling"));
assert.ok(text(overview).includes("HTML email design"));
console.log("✓ HTML email design discoverable under Website Design with compatibility and delivery scope");

// Owner scope: integrate and manage external providers, not claim ownership of
// hosting infrastructure, payment processing or the underlying AI models.
assert.ok(hosting.includes('external provider’s infrastructure'));
assert.ok(hosting.includes('Choose the right provider'));
assert.ok(hosting.includes('Website care & provider support'));
assert.ok(hosting.includes('provider’s terms'));
assert.ok(website.includes('Provider selection & integrations'));
assert.ok(website.includes('frontend development'));
assert.ok(website.includes('supported APIs and permissions'));
assert.ok(ecommerce.includes('chosen providers'));
assert.ok(text(render('/services/ai-assistants')).includes('AI models and infrastructure come from the selected providers'));
const homeContent=JSON.parse(read('assets/js/home.content.json'));
assert.equal(homeContent.sections.find(s=>s.id==='hosting').eyebrow,'Hosting Setup & Management');
assert.ok(homeContent.sections.find(s=>s.id==='hosting').description.includes('hosting provider'));
assert.ok(!JSON.stringify(homeContent).includes('malware protection and automated backups'));
const seo=JSON.parse(read('assets/js/publication.data.json'));
assert.ok(seo.routes['/services/web-hosting'].description.startsWith(catalogue.services.find(s=>s.slug==='web-hosting').seoDescription));
assert.match(seo.routes['/services/web-hosting'].description,/chosen provider/,'Hosting metadata makes the provider relationship explicit');
console.log('✓ Provider-backed hosting, end-to-end integrations and AI/payment responsibilities are clear in Home, services and metadata');

assert.ok(catalogue.services.filter(service=>/^I\b/.test(service.intro)).length<=2,'Vary service introductions instead of repeatedly opening with I');
assert.ok(homeContent.sections.filter(section=>/^I\b/.test(section.description)).length<=2,'Vary Home service copy while retaining a personal voice');
const sceneSource=read('assets/js/interactive-scenes.source.js');
for(const removed of ['Move cursor to tilt','Separate parts','Click to separate','scene-controls'])assert.ok(!sceneSource.includes(removed),'Removed vector controls/instructions must not return: '+removed);
console.log('✓ Varied first-person service wording and no generated vector control strip');
// Models auto-rotate a full turn: every model path must dress its back faces.
assert.equal((sceneSource.match(/dressBacks\(parts\);return\{root,parts\};/g)||[]).length,2,'Both recipe and hand-built models get decorated backs');
assert.ok(sceneSource.includes("back.rotation.y=Math.PI"),'Back details are turned, not mirrored, so they read correctly from behind');
console.log('✓ Rotating 3D models show details on their back faces');
