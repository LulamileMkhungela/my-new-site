/** LulaZel identity and server-rendered sharing metadata, independent of crawlers. */
import fs from 'node:fs';import assert from 'node:assert/strict';import {seoHead,seoRoutes,structuredData} from './publication.mjs';
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p)),config=json('assets/js/site.config.json');assert.equal(config.name,'LulaZel');assert.equal(config.ownerName,'Lulamile Mkhungela');
const catalogue=json('assets/js/services.catalogue.json'),strategies=json('assets/js/strategy.services.json');assert.ok(!catalogue.services.some(s=>/frontend/i.test(s.title)));assert.ok(json('assets/js/portfolio.categories.json').some(c=>c.label==='Frontend Dev'));
const production={...config,url:'https://lulazel.example'},routes=seoRoutes(production,catalogue,strategies,json('assets/js/portfolio.projects.json'));
for(const [route,meta]of Object.entries(routes)){
 assert.ok(meta.title.includes('LulaZel'));const html=seoHead(production,route,meta);
 for(const expected of ['property="og:site_name" content="LulaZel"','property="og:image" content="https://lulazel.example/assets/img/social-card.png"','property="og:image:type" content="image/png"','property="og:image:width" content="1200"','property="og:image:height" content="630"','name="twitter:card" content="summary_large_image"','name="twitter:image" content="https://lulazel.example/assets/img/social-card.png"'])assert.ok(html.includes(expected),route+': '+expected);
}
const schema=structuredData(production,'/',routes['/'])['@graph'];assert.equal(schema.find(n=>n['@type']==='WebSite').name,'LulaZel');assert.equal(schema.find(n=>n['@type']==='Person').name,'Lulamile Mkhungela');
const dims=p=>{const b=fs.readFileSync(p);assert.equal(b.subarray(1,4).toString(),'PNG');return[b.readUInt32BE(16),b.readUInt32BE(20)];};
for(const [name,size]of [['favicon.png',32],['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]])assert.deepEqual(dims('dist/assets/img/'+name),[size,size]);assert.deepEqual(dims('dist/assets/img/social-card.png'),[1200,630]);
assert.equal(json('dist/site.webmanifest').short_name,'LulaZel');assert.ok(read('index.html').includes('/assets/img/favicon.svg?v='));assert.ok(read('index.html').includes('/assets/img/logo.svg'));assert.ok(!read('index.html').includes('>LM<'));
console.log('✓ LulaZel logo/icons, manifest, 31 branded route titles and complete absolute social metadata with a configured origin; personal owner and service scope preserved');
