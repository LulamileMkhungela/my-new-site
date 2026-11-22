/** Restore the captured reference UI, keeping local identity and Tools.
 * Run: node scripts/build-reference-ui.mjs
 * The captured upstream files remain unchanged for provenance.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import {publicationConfig,seoRoutes,seoHead,prerender,structuredData,escapeHtml} from './publication.mjs';
const root = path.resolve(import.meta.dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, text) => {
  fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
  fs.writeFileSync(path.join(root, p), text);
};
const context = { window: {} };
vm.runInNewContext(read('assets/js/data.js'), context);
vm.runInNewContext(read('assets/js/projects.data.js'), context);
const site = context.window.SITE;
const catalogue = JSON.parse(read('assets/js/services.catalogue.json'));
const strategyServices = JSON.parse(read('assets/js/strategy.services.json'));
const serviceRedirects = JSON.parse(read('assets/js/services.redirects.json'));
let vectorSource = '';
for (const scene of fs.readdirSync(path.join(root,'assets/img/home')).filter(file=>file.endsWith('.svg')).sort().map(file=>file.slice(0,-4))) {
  const svg = read(`assets/img/home/${scene}.svg`);
  vectorSource += svg;
  if (!svg.includes('<svg') || svg.includes('<image')) throw new Error('Expected a self-contained SVG scene: '+scene);
}
for(const scene of ['contact-conversation','contact-next-step']){
  const svg=read('assets/img/portfolio/'+scene+'.svg');
  if(!svg.includes('<svg')||svg.includes('<image'))throw new Error('Expected a self-contained SVG scene: '+scene);
  vectorSource+=svg;
}
const homeArtworkVersion = createHash('sha256').update(vectorSource).digest('hex').slice(0,10);
const portfolioCategories = JSON.parse(read('assets/js/portfolio.categories.json'));
const homeContent = JSON.parse(read('assets/js/home.content.json'));
vm.runInNewContext(read('assets/js/tools.data.js'), context);
const portfolioProjects = JSON.parse(read('assets/js/portfolio.projects.json'));
const publication=publicationConfig(root);
const seo=seoRoutes(publication,catalogue,strategyServices,portfolioProjects);
for(const [route,meta]of Object.entries(seo))meta.schema=structuredData(publication,route,meta);
const originalProjects = Object.values(context.window.PROJECTS).flatMap(value=>Array.isArray(value)?value:Object.values(value));
const oldProjectRedirects = Object.fromEntries(originalProjects.filter(project=>project.kind!=='archive').map(project=>[`/${project.kind}/${project.id}`,'/portfolio']));
for (const project of portfolioProjects) {
  if (!project.categories.every(id=>portfolioCategories.some(category=>category.id===id&&id!=='all'))) throw new Error('Unknown project category: '+project.id);
  if (project.type==='coming-soon' && (project.href || project.details)) throw new Error('Coming-soon projects must not link out: '+project.id);
  if (project.promptTier==='premium' && (project.details?.prompt || project.prompt)) throw new Error('Premium prompt text must not ship: '+project.id);
  if (project.promptTier==='free' && (!project.details?.prompt || !fs.existsSync(path.join(root,project.details.promptDownload)))) throw new Error('Free prompt text/download required: '+project.id);

  for (const image of [project.image,project.previewImage,...(project.details?.gallery||[]).map(item=>item.src)].filter(Boolean)) {
    if (!image.startsWith('/assets/img/portfolio/') || !fs.existsSync(path.join(root,image))) throw new Error('Missing owner image: '+image);
  }
}
write('assets/js/portfolio.data.json', JSON.stringify(portfolioProjects, null, 2) + '\n');
let bundle = read('reference/source-mirror/assets/index-DEiHh-6e.js');
// Keep custom content in readable source files; do not edit the generated bundle.
bundle = `const localPublication=${JSON.stringify(publication)};\nconst localSeoRoutes=${JSON.stringify(seo)};\nconst localServiceCatalogue=${JSON.stringify(catalogue)};\nconst localStrategyServices=${JSON.stringify(strategyServices)};\nconst localRetiredServiceRoutes=${JSON.stringify(serviceRedirects)};\nconst localPortfolioCategories=${JSON.stringify(portfolioCategories)};\nconst localPortfolioProjects=${JSON.stringify(portfolioProjects)};\nconst localSiteContent=${JSON.stringify(site)};\nconst localToolsContent=${JSON.stringify(context.window.TOOLS_DATA)};\nconst localHomeContent=${JSON.stringify(homeContent)};\nconst localHomeArtworkVersion=${JSON.stringify(homeArtworkVersion)};\n` + bundle;
bundle = bundle.replace('path:"/services",element:l.jsx(Cu,{to:"/",replace:!0})', 'path:"/services",element:l.jsx(LocalServicesPage,{})}),l.jsx(Ct,{path:"/services/:slug",element:l.jsx(LocalServicesPage,{})');
for (const [route, component, previous] of [
  ['/','LocalHomePage','$P'],
  ['/about','LocalAboutPage','X4'], ['/contact','LocalContactPage','Y4'],
  ['/product-design-strategy','LocalServicesPage','d$'],
  ['/brand-strategy-and-amazon-growth','LocalRetiredServicePage','_$'],
  ['/microfinance-impact-consulting','LocalRetiredServicePage','L$'],
  ['/website-design-conversion','LocalRetiredServicePage','q$'],
]) {
  const original = `path:"${route}",element:l.jsx(${previous},{})`;
  if (!bundle.includes(original)) throw new Error('Route changed: '+route);
  bundle = bundle.replace(original, `path:"${route}",element:l.jsx(${component},{})`);
}
bundle = bundle.replace('path:"/project/:id",element:', 'path:"/portfolio",element:l.jsx(LocalPortfolioPage,{})}),l.jsx(Ct,{path:"/tools",element:l.jsx(LocalToolsPage,{})}),l.jsx(Ct,{path:"/project/:id",element:');
bundle = bundle.replace('path:"/portfolio",element:l.jsx(LocalPortfolioPage,{})','path:"/privacy",element:l.jsx(LocalPrivacyPage,{})}),l.jsx(Ct,{path:"/portfolio",element:l.jsx(LocalPortfolioPage,{})');
bundle = bundle.replace('path:"*",element:l.jsx(e5,{})','path:"*",element:l.jsx(LocalNotFoundPage,{})');
for (const [route,component] of [['/project/:id','DP'],['/graphic/:id','BP'],['/amazon/:id','X$']]) {
  const before=`path:"${route}",element:l.jsx(${component},{})`;
  if (!bundle.includes(before)) throw new Error('Project route changed: '+route);
  bundle=bundle.replace(before,`path:"${route}",element:l.jsx(LocalProjectPage,{})`);
}

// Local pages own metadata; never emit the captured portfolio's canonical host.
const seoStart=bundle.indexOf('function nP(){');
const seoEnd=bundle.indexOf('function rP(){',seoStart);
if(seoStart<0||seoEnd<0)throw new Error('SEO boundary changed');
bundle=bundle.slice(0,seoStart)+'function nP(){return l.jsx(LocalSeo,{})}'+bundle.slice(seoEnd);
bundle += '\n' + read('assets/js/services.reference.js') + '\n' + read('assets/js/hybrid.reference.js') + '\n' + read('assets/js/pages.reference.js') + '\n' + read('assets/js/portfolio.reference.js') + '\n' + read('assets/js/home.reference.js') + '\n' + read('assets/js/publication.reference.js');
// Replace the global audio widget, including its playback effects, with navigation.
const musicStart = bundle.indexOf('function sP(){');
const musicEnd = bundle.indexOf('function iP(){', musicStart);
if (musicStart < 0 || musicEnd < 0) throw new Error('Music widget boundary changed');
bundle = bundle.slice(0,musicStart)+'function sP(){return l.jsx(LocalBackToTop,{})}'+bundle.slice(musicEnd);
// The captured curtain transition delayed/keyed route trees, remounting the
// newly visible page after 480ms and resetting interactions. Local chapter
// entrances now own motion; navigation must render immediately and stay usable.
const transitionStart=bundle.indexOf('function oP({children:e}){');
const transitionEnd=bundle.indexOf('const lP=',transitionStart);
if(transitionStart<0||transitionEnd<0)throw new Error('Route transition boundary changed');
bundle=bundle.slice(0,transitionStart)+'function oP({children:e}){return l.jsx(l.Fragment,{children:e})}'+bundle.slice(transitionEnd);
// Never mount upstream deployment analytics/insights on the owner's site.
for(const component of ['hA','SA']){
  const mount='l.jsx('+component+',{})';
  if(!bundle.includes(mount))throw new Error('Upstream telemetry mount changed: '+component);
  bundle=bundle.replaceAll(','+mount,'');
}
// Show the design immediately instead of a blocking spoken welcome screen.
bundle = bundle.replace('const r5=()=>{const[e,t]=g.useState(!0)', 'const r5=()=>{const[e,t]=g.useState(!1)');
// Replace the portfolio header, not just its colours: two visible navigation rows.
const headerStart = bundle.indexOf('function Bn(){');
const headerEnd = bundle.indexOf('function zn(){', headerStart);
if (headerStart < 0 || headerEnd < 0) throw new Error('Upstream header boundary changed');
bundle = bundle.slice(0, headerStart) + 'function Bn(){return l.jsx(LocalSiteHeader,{})}' + bundle.slice(headerEnd);
const footerStart = bundle.indexOf('function zn(){');
const footerEnd = bundle.indexOf('function ', footerStart + 12);
if (footerStart < 0 || footerEnd < 0) throw new Error('Footer boundary changed');
bundle = bundle.slice(0, footerStart) + 'function zn(){return l.jsx(LocalSiteFooter,{})}' + bundle.slice(footerEnd);

for (const [from, to] of [
  ['Shubham Ranjan', site.name],
  ['India, Anywhere Remote', site.location],
  ['shubhamranjan542@gmail.com', site.email],
  ['https://linkedin.com/in/shubhamranjan542', site.linkedin],
  ['https://www.linkedin.com/in/shubhamranjan542/', site.linkedin],
]) bundle = bundle.replaceAll(from, to);
// Reference images are hosted upstream; the owner's portrait stays local.
bundle = bundle.replaceAll('/projects/about.webp', '/assets/img/lulamile.webp');
bundle = bundle.replaceAll('"/projects/', '"https://shubhamranjan-portfolio.vercel.app/projects/');
bundle = bundle.replaceAll('`/projects/', '`https://shubhamranjan-portfolio.vercel.app/projects/');
// Never send this portfolio's enquiries to the upstream owner's backend/calendar.
const calendarStart = bundle.indexOf('function K4(){');
const calendarEnd = bundle.indexOf('function G4(){', calendarStart);
if (calendarStart < 0 || calendarEnd < 0) throw new Error('Calendar component changed');
bundle = bundle.slice(0, calendarStart) + `function K4(){return l.jsx("a",{href:${JSON.stringify(`mailto:${site.email}`)},className:"inline-flex items-center justify-center px-6 py-4 rounded-xl border border-border font-medium",children:"Email me to arrange a free call"})}` + bundle.slice(calendarEnd);
const submitStart = bundle.indexOf('const{data:v,error:y}=await g4.functions.invoke("send-contact-email"');
const submitEnd = bundle.indexOf('i("success")', submitStart);
if (submitStart < 0 || submitEnd < 0) throw new Error('Contact handler changed');
bundle = bundle.slice(0, submitStart) + `window.location.href="mailto:${site.email}?subject="+encodeURIComponent(w.data.lookingFor||"Portfolio enquiry")+"&body="+encodeURIComponent(w.data.name+" <"+w.data.email+">\\n\\n"+w.data.message);` + bundle.slice(submitEnd);
bundle = bundle.replaceAll('Message sent!', 'Email draft opened').replaceAll('Message sent successfully', 'Email draft opened')
  .replaceAll("Your message has been sent successfully. I'll get back to you shortly.", 'Complete sending in your email app. If no draft opened, email me directly.');
write('assets/js/reference-ui.js', bundle);
const css = read('reference/source-mirror/assets/index-BfPpQAnT.css') + '\n' + read('assets/css/services.css') + '\n' + read('assets/css/hybrid.css') + '\n' + read('assets/css/navigation.css') + '\n' + read('assets/css/pages.css') + '\n' + read('assets/css/portfolio.css') + '\n' + read('assets/css/home.css') + '\n' + read('assets/css/studio.css') + '\n' + read('assets/css/theme.css') + '\n' + read('assets/css/motion.css') + '\n' + read('assets/css/dimensional.css') + '\n' + read('assets/css/spacing.css');
write('assets/css/reference-ui.css', css);
write('assets/js/navigation.data.js', '/* Generated shared navigation. */\nwindow.SERVICE_NAV = ' + JSON.stringify([
  ...catalogue.services.map(item=>({title:item.title,href:'/services/'+item.slug+'/'})),
  ...strategyServices.map(item=>({title:item.title,href:item.path+'/'})),
]) + ';\n');
const sceneHash=createHash('sha256').update(read('assets/js/interactive-scenes.js')).digest('hex').slice(0,10);
const sceneFilename=`interactive-scenes-${sceneHash}.js`;
const behaviourSource=read('assets/js/site-behaviour.js').replace("import('./interactive-scenes.js')",`import('./${sceneFilename}')`);
const behaviourVersion=createHash('sha256').update(behaviourSource).digest('hex').slice(0,10);
const behaviourFilename=`site-behaviour-${behaviourVersion}.js`;
for(const file of fs.readdirSync(path.join(root,'assets/js')))if(/^site-behaviour-[a-f0-9]{10}\.js$/.test(file)&&file!==behaviourFilename)fs.unlinkSync(path.join(root,'assets/js',file));
write('assets/js/'+behaviourFilename,behaviourSource);
const version = createHash('sha256').update(bundle + css).digest('hex').slice(0, 10);
// A new path, not only a query parameter: intermediary caches cannot serve an
// older light-theme stylesheet under the new build's CSS address.
const cssFilename=`site-${version}.css`;
for(const file of fs.readdirSync(path.join(root,'assets/css')))if(/^site-[a-f0-9]{10}\.css$/.test(file)&&file!==cssFilename)fs.unlinkSync(path.join(root,'assets/css',file));
write('assets/css/'+cssFilename,css);

const legacyRoutes = {'/index.html':'/','/services.html':'/services','/work.html':'/portfolio','/work':'/portfolio','/about.html':'/about','/contact.html':'/contact','/tools.html':'/tools',...serviceRedirects,...oldProjectRedirects};
const projectRoutes = Object.fromEntries(portfolioProjects.filter(project=>project.details).map(project=>[project.id,project.href]));
const renderData={localPublication:publication,localSeoRoutes:seo,localServiceCatalogue:catalogue,localStrategyServices:strategyServices,localRetiredServiceRoutes:serviceRedirects,localPortfolioCategories:portfolioCategories,localPortfolioProjects:portfolioProjects,localSiteContent:site,localToolsContent:context.window.TOOLS_DATA,localHomeContent:homeContent,localHomeArtworkVersion:homeArtworkVersion};
const componentFor=route=>route==='/'?'LocalHomePage':route==='/about'?'LocalAboutPage':route==='/contact'?'LocalContactPage':route==='/privacy'?'LocalPrivacyPage':route==='/portfolio'?'LocalPortfolioPage':route==='/tools'?'LocalToolsPage':route==='/services'||route.startsWith('/services/')||route==='/product-design-strategy'?'LocalServicesPage':route.startsWith('/project/')?'LocalProjectPage':'LocalNotFoundPage';
function htmlFor(route,{alias=false}={}) {
  const meta={...(seo[route]||seo['/404']),...(alias?{noindex:true}:{})};
  const markup=prerender(root,route,componentFor(route),renderData);
  return `<!doctype html>
<html lang="en-ZA" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#151f29" />
  <meta name="color-scheme" content="dark" />
  <style>${read('assets/css/theme.css')}body{margin:0}</style>
  ${seoHead(publication,route,meta)}
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/assets/img/favicon.png" sizes="32x32" />
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="preload" href="/assets/fonts/poppins-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/assets/css/${cssFilename}" />
  <script>(function(){var routes=${JSON.stringify(legacyRoutes)},projects=${JSON.stringify(projectRoutes)},target=routes[location.pathname]||routes[location.pathname.endsWith('/')?location.pathname.slice(0,-1):location.pathname];if(location.pathname==='/case-study.html'){target=projects[new URLSearchParams(location.search).get('id')]||'/portfolio';history.replaceState(null,'',target+location.hash);}else if(target){history.replaceState(null,'',target+location.search+location.hash);}})();</script>
  <script type="module" src="/assets/js/reference-ui.js?v=${version}"></script>
  <script type="module" src="/assets/js/${behaviourFilename}"></script>
</head>
<body>
  <div id="root">${markup}</div>
  <noscript><p>JavaScript enables filtering, navigation menus and inline enquiry feedback. You can still browse the links, submit an enquiry or <a href="mailto:${site.email}">email Lulamile</a>.</p></noscript>
</body>
</html>
`;
}
const activeRoutes=Object.keys(seo).filter(route=>route!=='/404');
write('index.html',htmlFor('/'));
write('404.html',htmlFor('/404'));
for(const route of activeRoutes.filter(route=>route!=='/'))write(route.slice(1)+'/index.html',htmlFor(route));
for(const [alias,destination]of Object.entries(legacyRoutes)) {
 if(alias==='/index.html')continue;
 const file=alias.endsWith('.html')?alias:alias+'/index.html';
 write(file.slice(1),htmlFor(destination,{alias:true}));
}
write('case-study.html',htmlFor('/portfolio',{alias:true}));
write('robots.txt',publication.url?`User-agent: *
Allow: /
Disallow: /reference/
Disallow: /scripts/
Sitemap: ${publication.url}/sitemap.xml
`:`User-agent: *
Disallow: /
# Set SITE_URL and rebuild when the production domain is ready.
`);
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publication.url?Object.entries(seo).filter(([,meta])=>!meta.noindex).map(([,meta])=>'  <url><loc>'+escapeHtml(publication.url+meta.canonical)+'</loc></url>').join('\n'):''}
</urlset>
`);
write('site.webmanifest',JSON.stringify({name:publication.name,short_name:'Lulamile M',start_url:'/',display:'browser',background_color:'#151f29',theme_color:'#151f29',icons:[{src:'/assets/img/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/assets/img/icon-512.png',sizes:'512x512',type:'image/png'}]},null,2)+'\n');
write('assets/js/publication.data.json',JSON.stringify({publication,routes:seo,aliases:legacyRoutes},null,2)+'\n');
console.log(`Generated ${activeRoutes.length} prerendered pages plus aliases. SEO: ${publication.url||'staging noindex (set SITE_URL for launch)'}`);
