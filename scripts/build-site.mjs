/** Build the owner's current UI from local sources and npm dependencies. */
import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';
import {PurgeCSS} from 'purgecss';
import { createHash } from 'node:crypto';
import {publicationConfig,seoRoutes,seoHead,prerender,structuredData,escapeHtml} from './publication.mjs';
const root = path.resolve(import.meta.dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, text) => {
  fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
  fs.writeFileSync(path.join(root, p), text);
};
const site=JSON.parse(read('assets/js/site.content.json'));
const tools=JSON.parse(read('assets/js/tools.content.json'));
const catalogue = JSON.parse(read('assets/js/services.catalogue.json'));
const strategyServices = JSON.parse(read('assets/js/strategy.services.json'));
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
const portfolioProjects = JSON.parse(read('assets/js/portfolio.projects.json'));
const publication=publicationConfig(root);
const seo=seoRoutes(publication,catalogue,strategyServices,portfolioProjects);
for(const [route,meta]of Object.entries(seo))meta.schema=structuredData(publication,route,meta);
for (const project of portfolioProjects) {
  if (!project.categories.every(id=>portfolioCategories.some(category=>category.id===id&&id!=='all'))) throw new Error('Unknown project category: '+project.id);
  if (project.type==='coming-soon' && (project.href || project.details)) throw new Error('Coming-soon projects must not link out: '+project.id);
  if (project.promptTier==='premium' && (project.details?.prompt || project.prompt)) throw new Error('Premium prompt text must not ship: '+project.id);
  if (project.promptTier==='free' && (!project.details?.prompt || !fs.existsSync(path.join(root,project.details.promptDownload)))) throw new Error('Free prompt text/download required: '+project.id);

  for (const image of [project.image,project.previewImage,...(project.details?.gallery||[]).map(item=>item.src)].filter(Boolean)) {
    if (!image.startsWith('/assets/img/portfolio/') || !fs.existsSync(path.join(root,image))) throw new Error('Missing owner image: '+image);
  }
}
const legacyRoutes=JSON.parse(read('assets/js/legacy.routes.json'));
const renderData={localPublication:publication,localSeoRoutes:seo,localServiceCatalogue:catalogue,localStrategyServices:strategyServices,localPortfolioCategories:portfolioCategories,localPortfolioProjects:portfolioProjects,localSiteContent:site,localToolsContent:tools,localHomeContent:homeContent,localHomeArtworkVersion:homeArtworkVersion,localLegacyRoutes:legacyRoutes};
const pageSource=['services','hybrid','pages','portfolio','home','publication'].map(name=>read(`assets/js/${name}.source.js`)).join('\n');
const declarations=Object.entries(renderData).map(([name,value])=>'const '+name+'='+JSON.stringify(value)+';').join('\n');
const result=await build({stdin:{contents:declarations+'\n'+pageSource+'\n'+read('assets/js/app.source.js'),resolveDir:path.join(root,'assets/js'),sourcefile:'app.entry.js'},bundle:true,write:false,format:'esm',target:'es2020',minify:true,legalComments:'eof',define:{'process.env.NODE_ENV':'"production"'}});
const bundle=result.outputFiles[0].text;
write('assets/js/site-app.js',bundle);
const cssSources=['foundation','services','hybrid','navigation','pages','portfolio','home','studio','theme','motion','dimensional','spacing'].map(name=>read('assets/css/'+name+'.css')).join('\n');
const [{css}]=await new PurgeCSS().purge({content:[{raw:pageSource+read('assets/js/site-behaviour.js')+read('assets/js/interactive-scenes.source.js')+JSON.stringify(renderData),extension:'js'}],css:[{raw:cssSources}],safelist:{standard:[/^scene-/,/^hm-visual-/,/^studio-visual-/,/^is-/,/^motion-/,/^pf-card-/,/^dark$/,/^light$/]}});
const sceneFiles=fs.readdirSync(path.join(root,'assets/js')).filter(file=>/^interactive-scenes-[a-f0-9]{10}\.js$/.test(file));
if(sceneFiles.length!==1)throw new Error('Build exactly one versioned 3D engine first');
const sceneFilename=sceneFiles[0];
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

const projectRoutes = Object.fromEntries(portfolioProjects.filter(project=>project.details).map(project=>[project.id,project.href]));
const componentFor=route=>route==='/'?'LocalHomePage':route==='/about'?'LocalAboutPage':route==='/contact'?'LocalContactPage':route==='/privacy'?'LocalPrivacyPage':route==='/portfolio'?'LocalPortfolioPage':route==='/tools'?'LocalToolsPage':route==='/services'||route.startsWith('/services/')||route==='/product-design-strategy'?'LocalServicesPage':route.startsWith('/project/')?'LocalProjectPage':'LocalNotFoundPage';
function htmlFor(route,{alias=false}={}) {
  const meta={...(seo[route]||seo['/404']),...(alias?{noindex:true}:{})};
  const markup=prerender(root,route,componentFor(route),renderData);
  const brandVersion=createHash('sha256').update(read('assets/img/favicon.svg')).digest('hex').slice(0,10);
  return `<!doctype html>
<html lang="en-ZA" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#151f29" />
  <meta name="color-scheme" content="dark" />
  <style>${read('assets/css/theme.css')}body{margin:0}</style>
  ${seoHead(publication,route,meta)}
  <link rel="icon" href="/assets/img/favicon.svg?v=${brandVersion}" type="image/svg+xml" />
  <link rel="icon" href="/assets/img/favicon.png?v=${brandVersion}" sizes="32x32" />
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png?v=${brandVersion}" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="preload" href="/assets/fonts/poppins-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/assets/css/${cssFilename}" />
  <script>(function(){var routes=${JSON.stringify(legacyRoutes)},projects=${JSON.stringify(projectRoutes)},target=routes[location.pathname]||routes[location.pathname.endsWith('/')?location.pathname.slice(0,-1):location.pathname];if(location.pathname==='/case-study.html'){target=projects[new URLSearchParams(location.search).get('id')]||'/portfolio';history.replaceState(null,'',target+location.hash);}else if(target){history.replaceState(null,'',target+location.search+location.hash);}})();</script>
  <script type="module" src="/assets/js/site-app.js?v=${version}"></script>
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
write('site.webmanifest',JSON.stringify({name:publication.name,short_name:'LulaZel',start_url:'/',display:'browser',background_color:'#151f29',theme_color:'#151f29',icons:[{src:'/assets/img/icon-192.png?v='+createHash('sha256').update(read('assets/img/favicon.svg')).digest('hex').slice(0,10),sizes:'192x192',type:'image/png'},{src:'/assets/img/icon-512.png?v='+createHash('sha256').update(read('assets/img/favicon.svg')).digest('hex').slice(0,10),sizes:'512x512',type:'image/png'}]},null,2)+'\n');
write('assets/js/publication.data.json',JSON.stringify({publication,routes:seo,aliases:legacyRoutes},null,2)+'\n');
console.log(`Generated ${activeRoutes.length} prerendered pages plus aliases. SEO: ${publication.url||'staging noindex (set SITE_URL for launch)'}`);
