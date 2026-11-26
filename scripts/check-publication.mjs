import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {publicationConfig,seoRoutes,seoHead} from './publication.mjs';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const {publication,routes,aliases}=JSON.parse(read('assets/js/publication.data.json'));
for(const [route,meta]of Object.entries(routes)){
 const file=route==='/'?'index.html':route==='/404'?'404.html':route.slice(1)+'/index.html';const html=read(file);
 assert.ok(html.includes(meta.title.replaceAll('&','&amp;')));
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route+' needs real prerendered content');
 assert.equal((html.match(/<title[ >]/g)||[]).length,1);
 const css=html.match(/href="(\/assets\/css\/site-[a-f0-9]{10}\.css)"/);assert.ok(css,'CSS needs a build-specific filename');assert.ok(fs.existsSync(path.join(root,css[1])));assert.ok(fs.existsSync(path.join(root,'dist',css[1])));
 assert.ok(!html.includes(':root.light'),'light theme CSS must not ship');assert.ok(!html.includes('rhino-theme'),'theme toggle must not ship');assert.ok(html.includes('class="dark"'));
 assert.ok(html.includes('property="og:title"'));assert.ok(html.includes('name="twitter:card"'));
 assert.ok(!html.includes('api.fontshare.com'));assert.ok(!html.includes('fonts.googleapis.com'));
 const production=!!publication.url&&!meta.noindex;
 assert.ok(html.includes(production?'index,follow,max-image-preview:large':'noindex,follow'));
 assert.ok(fs.existsSync(path.join(root,'dist',file)));
 if(publication.url&&!meta.noindex){assert.ok(read('sitemap.xml').includes(publication.url+meta.canonical));assert.ok(html.includes('application/ld+json'));}
}
assert.ok(!read('about/index.html').includes('Let’s work together'));
const prod=JSON.parse(read('assets/js/portfolio.projects.json')).find(p=>p.id==='prodops');
assert.equal(prod.details.links.length,1);assert.equal(prod.details.links[0].label,'Request ProdOps');
const request=new URL(prod.details.links[0].href);assert.equal(request.protocol,'mailto:');assert.equal(request.pathname,'mkhungela.l@gmail.com');assert.equal(request.searchParams.get('subject'),'Request ProdOps');assert.ok(request.searchParams.get('body').includes('request access to ProdOps'));
assert.ok(!read('project/prodops/index.html').includes('href="https://github.com'));
for(const forbidden of ['.git','reference','scripts','.cache','assets/js/portfolio.projects.json','assets/js/data.js'])assert.ok(!fs.existsSync(path.join(root,'dist',forbidden)));
assert.ok(read('dist/_headers').includes('Content-Security-Policy:'));
assert.ok(!read('dist/_redirects').includes('/* /index.html 200'));
for(const [source,target]of Object.entries(aliases).filter(([p])=>p!=='/index.html'))assert.ok(read('dist/_redirects').includes(source+' '+(target==='/'?'/':target+'/')+' 301'));
const old=process.env.SITE_URL;const oldContext=process.env.CONTEXT;const oldVercel=process.env.VERCEL_ENV;
try{
 process.env.CONTEXT='production';process.env.VERCEL_ENV='production';process.env.SITE_URL='https://portfolio.example';const config=publicationConfig(root);assert.equal(config.url,'https://portfolio.example');
 const head=seoHead(config,'/',routes['/']);assert.ok(head.includes('rel="canonical" href="https://portfolio.example/"'));assert.ok(head.includes('application/ld+json'));assert.ok(!head.includes('noindex'));
 process.env.CONTEXT='deploy-preview';assert.equal(publicationConfig(root).url,'');process.env.CONTEXT='production';
 process.env.SITE_URL='https://portfolio.example/subfolder';assert.throws(()=>publicationConfig(root));
}finally{if(oldContext===undefined)delete process.env.CONTEXT;else process.env.CONTEXT=oldContext;if(oldVercel===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=oldVercel;if(old===undefined)delete process.env.SITE_URL;else process.env.SITE_URL=old;}
assert.ok(read('assets/js/site-behaviour.js').includes("'contextmenu'"));assert.ok(!read('assets/js/site-behaviour.js').includes("'copy'"));
console.log('✓ Prerendered route SEO, sitemap/staging safety, request email, privacy and isolated production output');

// 3D code and its loader must have content-versioned URLs, not stale module URLs.
const behaviourFile=read('index.html').match(/src="(\/assets\/js\/site-behaviour-[a-f0-9]{10}\.js)"/)?.[1];
assert.ok(behaviourFile,'Versioned behaviour loader required');
assert.ok(fs.existsSync(path.join(root,'dist',behaviourFile)));
const sceneFile=read(behaviourFile.slice(1)).match(/import\('\.\/(interactive-scenes-[a-f0-9]{10}\.js)'\)/)?.[1];
assert.ok(sceneFile,'Versioned 3D chunk required');
assert.ok(fs.existsSync(path.join(root,'dist/assets/js',sceneFile)));
console.log('✓ Content-versioned 3D engine and loader included in production output');
// Complete large compositions have one canonical page owner site-wide.
const illustrationOwners=new Map();
for(const route of Object.keys(routes)){
 const file=route==='/'?'index.html':route==='/404'?'404.html':route.slice(1)+'/index.html';
 for(const match of read(file).matchAll(/<img\b[^>]*\bsrc="(\/assets\/img\/(?:home\/[^"?]+\.svg|portfolio\/contact-[^"?]+\.svg))(?:\?[^\"]*)?"/g)){
  const source=match[1];assert.ok(!illustrationOwners.has(source),'Illustration repeated on '+route+' and '+illustrationOwners.get(source)+': '+source);illustrationOwners.set(source,route);
 }
}
assert.equal(illustrationOwners.size,48);
console.log('✓ All 48 large illustrations have a single page owner in prerendered output');

// Discoverability: search engines + AI answer engines.
{
 const cfg=JSON.parse(fs.readFileSync(path.join(root,'assets/js/site.config.json'),'utf8'));
 const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');
 for(const bot of ['Googlebot','Bingbot','OAI-SearchBot','GPTBot','PerplexityBot','ClaudeBot','Google-Extended'])assert.ok(robots.includes('User-agent: '+bot),'robots.txt welcomes '+bot);
 assert.ok(!/^Disallow: \/$/m.test(robots),'Production robots.txt must not block the site');
 const llms=fs.readFileSync(path.join(root,'llms.txt'),'utf8');
 assert.ok(llms.startsWith('# LulaZel Digital Studio')&&llms.includes('from R18,000')&&llms.includes('Johannesburg'),'llms.txt summarises the studio, location and prices');
 assert.ok(fs.existsSync(path.join(root,'dist/llms.txt')),'llms.txt is deployed');
 assert.match(cfg.indexNowKey,/^[a-f0-9]{32}$/);
 assert.equal(fs.readFileSync(path.join(root,cfg.indexNowKey+'.txt'),'utf8'),cfg.indexNowKey,'IndexNow key file served at the site root');
 assert.ok(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes('<lastmod>'+cfg.lastUpdated+'</lastmod>'));
 const graph=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8').match(/application\/ld\+json">(.*?)<\/script>/)[1])['@graph'];
 const home=graph('index.html'),org=home.find(item=>item['@type']==='ProfessionalService');
 assert.ok(org.alternateName.includes('Lulazel')&&org.alternateName.includes('LulaZel'),'Brand spellings declared for search');
 assert.equal(org.hasOfferCatalog.itemListElement.find(item=>item.priceSpecification)?.priceSpecification.minPrice,18000);
 assert.ok(graph('contact/index.html').some(item=>item['@type']==='FAQPage'&&item.mainEntity.length>=6),'Contact FAQ is marked up');
 assert.ok(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('LulaZel is a Johannesburg digital studio'),'Home states the brand entity in visible copy');
 console.log('✓ Discoverability: AI-crawler-friendly robots, llms.txt, IndexNow key, sitemap lastmod, brand/offer/FAQ structured data');
}
