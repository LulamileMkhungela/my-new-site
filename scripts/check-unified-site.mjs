/** Dependency-free rendering/data checks. Run after build-site.mjs. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const json=name=>JSON.parse(read(name));
const data={window:{}};
data.window.SITE=JSON.parse(read('assets/js/site.content.json'));
data.window.TOOLS_DATA=JSON.parse(read('assets/js/tools.content.json'));
const catalogue=json('assets/js/services.catalogue.json');
const strategies=json('assets/js/strategy.services.json');
const categories=json('assets/js/portfolio.categories.json');
const projects=json('assets/js/portfolio.projects.json');
const nodes=tree=>Array.isArray(tree)?tree.flatMap(nodes):tree&&typeof tree==='object'?[tree,...nodes(tree.children)]:[];
const text=tree=>Array.isArray(tree)?tree.map(text).join(' '):tree===null||tree===undefined?'':typeof tree==='object'?text(tree.children):String(tree);
function render(component,url='/'){
  const parsed=new URL(url,'https://example.test');
  const navigation=[];
  const context={
    g:{createElement:(type,props,...children)=>typeof type==='function'?type({...props,children}):({type,props:props||{},children}),Fragment:'fragment',useState:value=>[value,()=>{}],useEffect:()=>{},useRef:value=>({current:value})},
    Qt:()=>({pathname:parsed.pathname,search:parsed.search}),va:()=>value=>navigation.push(value),XA:'metadata',ve:'link',Bn:'header',zn:'footer',URLSearchParams,
    localServiceCatalogue:catalogue,localStrategyServices:strategies,localPortfolioCategories:categories,localPortfolioProjects:projects,localSiteContent:data.window.SITE,localToolsContent:data.window.TOOLS_DATA,localHomeContent:json('assets/js/home.content.json'),localHomeArtworkVersion:'test'
  };
  const tree=vm.runInNewContext(read('assets/js/services.source.js')+'\n'+read('assets/js/hybrid.source.js')+'\n'+read('assets/js/pages.source.js')+'\n'+read('assets/js/portfolio.source.js')+'\n'+read('assets/js/home.source.js')+'\n'+component+'();',context);
  return {tree,navigation,elements:nodes(tree)};
}
for(const service of strategies){
  const {elements,tree}=render('LocalServicesPage',service.path);
  assert.equal(elements.filter(node=>node.type==='h1').length,1);
  assert.equal(elements.filter(node=>node.props.className==='svc-feature').length,6);
  assert.equal(elements.filter(node=>node.props.className==='pf-card').length,0);
  assert.equal(elements.filter(node=>/\/(project|graphic|amazon)\//.test(node.props.to||'')).length,0,'Services must not embed project links');
  assert.ok(text(tree).includes(service.title));
  const artworkSources=elements.filter(node=>node.type==='img').map(node=>node.props.src.split('?')[0]);
  assert.equal(new Set(artworkSources).size,artworkSources.length,'No repeated chapter artwork on '+service.title);
  console.log('✓ Shared service layout without projects: '+service.title);
}
assert.deepEqual(categories.map(item=>item.label),['All projects','Website','Product Design','Apps','Frontend Dev','AI Prompt']);
for(const category of categories){
  const {elements,navigation}=render('LocalPortfolioPage','/portfolio?filter='+category.id);
  const count=category.id==='all'?categories.filter(item=>item.id!=='all').reduce((sum,item)=>sum+projects.filter(project=>project.categories.includes(item.id)).length,0):projects.filter(project=>project.categories.includes(category.id)).length;
  assert.equal(elements.filter(node=>node.props.className==='pf-card').length,count);
  assert.equal(elements.filter(node=>node.type==='select').length,0);
  const tabs=elements.find(node=>node.props.className==='pf-category-jumps');
  assert.equal(nodes(tabs).filter(node=>node.type==='link').length,6);
  assert.ok(nodes(tabs).some(node=>node.props['aria-current']==='page'));
  if(!count)assert.ok(elements.some(node=>node.props.className==='pf-empty'));
  console.log('✓ Portfolio filter '+category.label+': '+count+' projects');
}
// Sections 08/09 are explicitly preserved; footer now has requested contact icons.
const homeContent=json('assets/js/home.content.json');
assert.equal(createHash('sha256').update(JSON.stringify([homeContent.portfolio,homeContent.about])).digest('hex'),'4c93e198175bfff34beabb08e5e0ba32770c2c91e0f8e9a8348f91674bd2f194','Preserve Home portfolio and about wording');
const footerView=render('LocalSiteFooter');
for(const href of ['tel:+27837195064','mailto:'+data.window.SITE.email,'https://calendly.com/lulamile_m/meet-lulamile?month=2026-11']) assert.ok(footerView.elements.some(node=>node.props.href===href));
assert.equal(footerView.elements.filter(node=>node.props.className==='footer-contact-icon').length,5);
const footerNav=footerView.elements.find(node=>node.type==='nav'&&node.props['aria-label']==='Footer');
assert.deepEqual(nodes(footerNav).filter(node=>node.type==='link'||node.type==='a').map(node=>text(node)),['My Services','Portfolio','About']);
assert.ok(footerView.elements.some(node=>node.type==='h2'&&text(node)==='Let’s make it  work.'));
assert.ok(!footerView.elements.some(node=>node.props.to==='/contact'),'No duplicate footer Let’s Talk button');
assert.deepEqual(footerView.elements.filter(node=>node.props.className==='footer-icon-label').map(node=>text(node).replace(/\s/g,'')),['LinkedIn','Call','Email','Meeting','Enquiry']);
const enquiryForm=footerView.elements.find(node=>node.type==='form');
assert.equal(enquiryForm.props.action,'https://formspree.io/f/xvkgqalq');
assert.equal(enquiryForm.props.method,'POST');
assert.ok(footerView.elements.some(node=>node.type==='dialog'&&node.props['aria-labelledby']==='enquiry-title'));
assert.ok(footerView.elements.some(node=>node.props['aria-haspopup']==='dialog'));
assert.ok(!/Our Services|Explore|Let’s Connect/.test(text(footerView.tree)));
assert.ok(footerView.elements.some(node=>node.props.href==='tel:+27837195064'));
assert.ok(!footerView.elements.some(node=>node.props.id==='footer-call-options'));
const backToTop=render('LocalBackToTop');
assert.ok(backToTop.elements.some(node=>node.type==='button'&&node.props['aria-label']==='Back to top'));
assert.ok(backToTop.elements.some(node=>node.type==='button'&&node.props.hidden===true&&node.props.tabIndex===-1),'Back to top starts hidden and outside tab order');
assert.ok(read('assets/js/app.source.js').includes('h(LocalBackToTop)'));
assert.ok(!read('assets/js/site-app.js').includes('Open ambient music player'));
console.log('✓ Footer: three navigation links, labelled contacts, enquiry dialog and floating Back to top');
const homeView=render('LocalHomePage');
assert.equal(homeView.elements.filter(node=>node.type==='h1').length,1);
assert.equal(homeView.elements.filter(node=>node.type==='main').length,1);
assert.equal(homeView.elements.filter(node=>(node.props.className||'').split(' ').includes('hm-panel')).length,11);
assert.equal(homeView.elements.filter(node=>node.props.className==='hm-project-preview').length,3);
assert.equal(homeView.elements.filter(node=>node.type==='footer').length,1);
assert.ok(homeView.elements.some(node=>node.props.href==='#hosting'));
assert.ok(homeView.elements.some(node=>node.type==='img'&&node.props.src==='/assets/img/lulamile.webp'));
assert.ok(!/Google reviews|Our Services|Let’s Connect|5\+ years|30\+ projects/i.test(text(homeView.tree)));
for(const service of [...catalogue.services.map(item=>({path:'/services/'+item.slug})),...strategies]) assert.ok(homeView.elements.some(node=>node.props.to===service.path),'Home links to '+service.path);
assert.ok(read('assets/js/app.source.js').includes("path:'/',element:h(LocalHomePage)"));
assert.equal(homeView.elements.filter(node=>node.props.className==='hm-process-card').length,3);
assert.equal(homeView.elements.filter(node=>node.props.className==='hm-testimonial-card').length,6);
const chapterNav=homeView.elements.find(node=>node.type==='nav'&&node.props['aria-label']==='Home sections');
const chapterLinks=nodes(chapterNav).filter(node=>node.type==='a');
assert.equal(chapterLinks.length,11);
assert.deepEqual(chapterLinks.map(node=>text(node)),Array.from({length:11},(_,i)=>String(i+1).padStart(2,'0')));
for(const link of chapterLinks)assert.ok(homeView.elements.some(node=>node.type==='section'&&'#'+node.props.id===link.props.href),'Chapter links own real Home sections');
assert.ok(homeView.elements.some(node=>node.props.role==='progressbar'&&node.props['aria-label']==='Page scroll progress'));
assert.ok(homeView.elements.some(node=>node.props['aria-roledescription']==='carousel'));
assert.ok(!homeView.elements.some(node=>node.props.className==='hm-testimonial-card'&&/Google|★|verified/i.test(text(node))),'Do not invent third-party ratings or verification');

for(const step of data.window.SITE.process) {assert.ok(text(homeView.tree).includes(step.title));assert.ok(text(homeView.tree).includes(step.body));}
assert.deepEqual(homeView.elements.filter(node=>node.type==='blockquote').map(node=>text(node)),Array.from(data.window.SITE.testimonials,person=>person.message));
assert.equal(homeView.elements.filter(node=>node.props.className==='hm-personal-mark').length,0,'No repeated owner-name stamp in Home chapters');
for(const component of ['LocalContactPage','LocalPortfolioPage','LocalToolsPage','LocalPrivacyPage']){
 const view=render(component);assert.ok(!/Lulamile/i.test(text(view.elements.find(node=>node.type==='main'))),'No repeated personal-name labels on '+component);
}
for(const service of [...catalogue.services.map(item=>({path:'/services/'+item.slug})),...strategies])assert.ok(!/Lulamile/i.test(text(render('LocalServicesPage',service.path).tree)),'Services use brand rather than repeated owner names');
assert.ok(text(footerView.tree).includes('by Lulamile M'));
assert.ok(text(render('LocalAboutPage').tree).includes('About / Lulamile M'));
assert.ok(render('LocalPrivacyPage').elements.some(node=>node.type==='article'&&node.props.className.includes('privacy-article')),'Privacy has a dedicated inner-padding surface');
const art=homeView.elements.filter(node=>node.props.className==='hm-vector-art');
assert.equal(art.length,7);
assert.equal(new Set(art.map(node=>node.props.src)).size,7);
for(const node of art) {const svg=read(node.props.src.slice(1).split('?')[0]);assert.ok(svg.includes('<svg'));assert.ok(!svg.includes('<image'));}
assert.equal(strategies.length,1);
assert.equal(strategies[0].title,'Product Design & Strategy');
const redirects=Object.fromEntries(Object.entries(json('assets/js/legacy.routes.json')).filter(([route])=>['/website-design-conversion','/brand-strategy-and-amazon-growth','/microfinance-impact-consulting'].includes(route)));
for(const [old,target] of Object.entries(redirects)) {
 assert.ok(!homeView.elements.some(node=>node.props.to===old));
 assert.ok(read(old.slice(1)+'/index.html').includes(JSON.stringify(old)+':'+JSON.stringify(target)));
}
console.log('✓ Home: seven original SVG scenes, unchanged 08/09, restored process and six original testimonials');
const portfolioView=render('LocalPortfolioPage','/portfolio');
assert.ok(portfolioView.elements.some(node=>node.props.href==='#portfolio-projects'));
assert.ok(portfolioView.elements.some(node=>node.props.className==='pf-hero-overline'));
assert.equal(portfolioView.elements.filter(node=>node.props.className==='pf-open-icon').length,0);
assert.ok(portfolioView.elements.filter(node=>node.type==='svg').every(node=>node.props['aria-hidden']===true));
assert.equal(projects.length,30);
assert.ok(!text(portfolioView.tree).includes('Archive'));
assert.ok(!JSON.stringify(projects).includes('shubhamranjan'));
const prompts=projects.filter(project=>project.categories.includes('ai-prompt'));
assert.deepEqual(prompts.map(project=>project.promptTier),[...Array(5).fill('premium'),...Array(5).fill('free')]);
assert.deepEqual(prompts.filter(project=>project.promptTier==='free').map(project=>project.client),['Service Provider App','Finance homescreen','Food delivery app home screen','OtO e-commerce website','Fashion shopping app home screen']);
for(const project of prompts) {
 if(project.promptTier==='premium') {assert.equal(project.type,'external');assert.equal(project.href,'https://selar.com/m/le-loux');assert.ok(!project.details?.prompt);}
 else {assert.ok(project.details.prompt.length>100);assert.equal(read(project.details.promptDownload.slice(1)).trim(),project.details.prompt);}
}
for(const id of ['lawmania','ai-lifeos','onescreen-business']) {
 const project=projects.find(item=>item.id===id);assert.equal(project.type,'coming-soon');assert.ok(project.description.length>100);assert.ok(!project.href);assert.ok(!project.sourcePending);
}
assert.ok(projects.find(item=>item.id==='heritagebites').status.includes('Testing link'));
assert.ok(!projects.find(item=>item.id==='wethinkcode-gbv').image.endsWith('hackathon.jpg'));
assert.ok(footerView.elements.some(node=>node.props.href==='https://www.linkedin.com/in/lulamile-mkhungela/'));

for(const category of ['website','product-design','apps','frontend-dev']) {
 const result=render('LocalPortfolioPage','/portfolio?filter='+category);
 for(const project of projects.filter(project=>project.categories.includes(category))) {
  const card=result.elements.find(node=>node.props['data-project']===project.id);
  const descendants=nodes(card);
  if(project.type==='coming-soon')assert.equal(descendants.filter(node=>node.type==='a'||node.type==='link').length,0);
  else if(project.categoryActions?.[category]?.type==='external'||project.type==='external')assert.ok(descendants.some(node=>node.type==='a'&&node.props.target==='_blank'&&node.props.rel==='noopener noreferrer'));
 }
}
const websiteFood=render('LocalPortfolioPage','/portfolio?filter=website').elements.find(node=>node.props['data-project']==='foodiezone');
assert.ok(nodes(websiteFood).some(node=>node.props.href==='https://loux91.github.io/foodiezone/'));
const productFood=render('LocalPortfolioPage','/portfolio?filter=product-design').elements.find(node=>node.props['data-project']==='foodiezone');
assert.ok(nodes(productFood).some(node=>node.props.to==='/project/foodiezone'));
for(const project of projects.filter(item=>item.details)) {
 const result=render('LocalProjectPage',project.href);
 assert.equal(result.elements.filter(node=>node.type==='h1').length,1);
 assert.ok(text(result.tree).includes(project.client));
 assert.ok(read(project.href.slice(1)+'/index.html').includes('/assets/js/site-app.js'));
}
console.log('✓ Owner portfolio: correct category actions, no linked coming-soon cards, thirteen local project pages');
for(const weight of [400,500,600,700,800]) assert.ok(fs.existsSync(path.join(root,`assets/fonts/poppins-latin-${weight}-normal.woff2`)));
const nav=render('LocalSiteHeader','/portfolio');
const primary=nav.elements.find(node=>node.props.className==='rhino-primary');
assert.deepEqual(nodes(primary).filter(node=>node.type==='link').map(node=>text(node)),['Home','My Services','Portfolio','About']);
assert.ok(nav.elements.some(node=>node.props.className==='rhino-contact'&&text(node).includes('Let’s talk')));
const headerContact=nav.elements.find(node=>node.props.className==='rhino-contact');
assert.equal(headerContact.props.href,'https://wa.me/27837195064');
assert.equal(headerContact.props.target,'_blank');
assert.ok(text(headerContact).includes('Have an idea?'));
assert.ok(text(headerContact).includes('On WhatsApp'));
assert.equal(nav.elements.filter(node=>node.props.className==='hybrid-service-nav').length,1);
const serviceNav=nav.elements.find(node=>node.props.className==='hybrid-service-nav');
assert.equal(nodes(serviceNav).filter(node=>node.type==='link').length,10);
assert.ok(!text(serviceNav).includes('All services'));
for(const component of ['LocalAboutPage','LocalContactPage','LocalToolsPage']){
  const result=render(component);
  assert.equal(result.elements.filter(node=>node.type==='h1').length,1);
  assert.equal(result.elements.filter(node=>node.type==='main').length,1);
  console.log('✓ Shared app page: '+component);
}
const html=read('index.html');
for(const name of ['work.html','services.html','about.html','contact.html','tools.html','case-study.html','404.html'])assert.ok(read(name).includes('/assets/js/site-app.js?v='),'One runtime for '+name);
assert.ok(!html.includes('assets/js/shell.js'));
assert.ok(html.includes('"/work.html":"/portfolio"'));
assert.ok(read('portfolio/index.html').includes('/assets/js/site-app.js?v='));
console.log('✓ Exact main navigation, legacy URL compatibility and one shared runtime');

assert.ok(!read("assets/js/site-app.js").includes("l.jsx(hA,{})"),"No upstream Analytics mount");
assert.ok(!read("assets/js/site-app.js").includes("l.jsx(SA,{})"),"No upstream Speed Insights mount");
assert.ok(!read("assets/js/app.source.js").includes("setTimeout"),"No delayed route remount curtains");

for(const id of ["lawmania","ai-lifeos","onescreen-business"]){
 const project=projects.find(item=>item.id===id);assert.deepEqual(project.platforms,["Web","Mobile"]);assert.equal(project.status,"Coming soon");assert.equal(project.href,null);
}
assert.equal(projects.find(item=>item.id==="lawmania").image,"/assets/img/portfolio/lawmania-feed.png");
assert.equal(projects.find(item=>item.id==="onescreen-business").image,"/assets/img/portfolio/onescreen-business-home.png");

assert.equal(projects.find(item=>item.id==="ai-lifeos").image,"/assets/img/portfolio/ai-lifeos-dashboard.png");

const grouped=render('LocalPortfolioPage','/portfolio');
assert.equal(grouped.elements.filter(node=>node.props.className==='pf-category-section').length,5);
for(const section of grouped.elements.filter(node=>node.props.className==='pf-category-section')){
 const category=section.props.id.replace('portfolio-category-','');assert.equal(nodes(section).filter(node=>node.props.className==='pf-card').length,projects.filter(project=>project.categories.includes(category)).length);
 assert.ok(nodes(section).some(node=>node.type==='button'&&node.props['aria-expanded']===true));
}
assert.equal(grouped.elements.filter(node=>node.props.className==='pf-card-description').length,0);
