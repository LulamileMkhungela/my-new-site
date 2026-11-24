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
 assert.ok(html.includes(':root.light'));assert.ok(html.includes('class="dark"'));
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
assert.equal(illustrationOwners.size,47);
console.log('✓ All 47 large illustrations have a single page owner in prerendered output');
