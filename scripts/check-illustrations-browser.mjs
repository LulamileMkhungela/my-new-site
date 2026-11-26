import assert from 'node:assert/strict';import fs from 'node:fs';import Chromium from '@sparticuz/chromium';import {chromium} from 'playwright-core';
const artwork=[...fs.readdirSync('assets/img/home').filter(file=>file.endsWith('.svg')).map(file=>file.slice(0,-4)).map(name=>'assets/img/home/'+name+'.svg')];
for(const file of artwork){const svg=fs.readFileSync(file,'utf8');assert.ok(svg.includes('<title>')&&svg.includes('<desc>'));assert.ok(!/<image|<script|<foreignObject|https?:\/\/(?!www.w3.org\/2000\/svg)/i.test(svg),file+' must be self-contained actual vectors');assert.equal((svg.match(/<text\b/g)||[]).length,0,file+' must not depend on tiny labels');}
const scenes={'/services/website-design/':'website-design','/services/ecommerce/':'commerce-service','/services/seo-and-search/':'search','/services/google-ads/':'advertising','/product-design-strategy/':'strategy','/tools/':'toolkit','/portfolio/?filter=apps':'portfolio'};
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:3000')?r.continue():r.abort());
for(const width of [320,768,1440]){
 await page.setViewportSize({width,height:900});
 for(const route of ['/','/services/','/contact/',...Object.keys(scenes)]){
  await page.goto('http://127.0.0.1:3000'+route,{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});
  if(scenes[route]){const selector=route.startsWith('/services/')||route.startsWith('/product-design')?'.studio-visual img':'.hybrid-visual img';assert.ok((await page.locator(selector).first().getAttribute('src')).includes('/'+scenes[route]+'.svg?v='));}
  for(const img of await page.locator('.hm-vector-art,.studio-visual img,.hybrid-visual img,.contact-art img,.contact-next-visual img').all()){
   await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());assert.ok(await img.evaluate(el=>el.naturalWidth===640&&el.naturalHeight===570));assert.ok((await img.getAttribute('src')).includes('?v='));
  }
  if(route.includes('filter=apps'))for(const id of ['lawmania','ai-lifeos']){
   const card=page.locator(`[data-project="${id}"]`);assert.equal(await card.locator('a,button:not(:disabled),.pf-open-icon').count(),0);assert.equal(await card.locator('.pf-platforms').innerText(),'Cross-platform · Web · Mobile');assert.equal(await card.locator('.pf-action-unavailable').textContent(),'Coming soon');
   const img=card.locator('img');await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());if(id==='ai-lifeos')assert.ok((await img.getAttribute('src')).endsWith('/ai-lifeos-dashboard.png'));
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflows at '+width);
 }
 console.log('✓ Section-matched vectors load/version across Home, Services, Strategy, Portfolio and Tools; Contact preserved; Apps screenshots and non-linked statuses intact at '+width+'px');
}
assert.deepEqual(errors,[]);await browser.close();
