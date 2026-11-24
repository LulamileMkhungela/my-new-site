import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {chromium} from 'playwright-core';import Chromium from '@sparticuz/chromium';
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000',errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
const pixelSignatures=new Map(),engineRequests=[];page.on('request',r=>{if(r.url().includes('interactive-scenes'))engineRequests.push(r.url());});
const cases=[['Web Hosting','hosting-service'],['Website Design','website-design'],['Business Systems','system-service'],['Ecommerce','commerce-service'],['Workflow Automation & AI','workflow-service'],['AI Assistants','assistant-service'],['Basic Graphic Design','graphic-service'],['SEO & Search','search'],['Google Ads','advertising'],['Product Design & Strategy','strategy'],['Web Hosting','hosting-service']];
const featureKinds={'hosting-service':'web-hosting-features','website-design':'website-design-features','system-service':'business-systems-features','commerce-service':'ecommerce-features','workflow-service':'workflow-automation-features','assistant-service':'ai-assistants-features','graphic-service':'basic-graphic-design-features',search:'seo-and-search-features',advertising:'google-ads-features',strategy:'product-design-strategy-features'};
const verify=async kind=>{
 await page.waitForFunction(expected=>{const host=document.querySelector('#service-intro .studio-visual'),shell=host?.querySelector('.scene-shell');return shell?.dataset.scene===expected&&shell.dataset.state==='ready'&&shell.dataset.rotation!==undefined;},kind);
 const hero=page.locator('#service-intro .studio-visual');assert.equal(await hero.locator('.scene-shell').count(),1);assert.equal(await hero.locator('canvas').count(),1);assert.ok((await hero.locator('img').getAttribute('src')).includes('/'+kind+'.svg?'));assert.equal(await hero.locator('canvas').getAttribute('aria-label').then(label=>label.includes('interactive 3D model')),true);
 if(!pixelSignatures.has(kind)){
  const canvas=hero.locator('canvas');await canvas.evaluate(el=>el.style.backgroundColor='#151f29');
  const pixels=await canvas.screenshot({path:'/tmp/service-model-'+kind+'.png'}),signature=createHash('sha256').update(pixels).digest('hex');
  for(const[other,hash]of pixelSignatures)assert.notEqual(signature,hash,'Rendered geometry must differ: '+kind+' vs '+other);
  pixelSignatures.set(kind,signature);
 }

};
try{
 await page.goto(origin+'/services/');await page.locator('.scene-shell[data-state=ready]').first().waitFor();
 for(const[label,kind]of cases){
  const link=page.getByRole('navigation',{name:'Explore services'}).getByRole('link',{name:label,exact:true});const href=await link.getAttribute('href');await link.click();await page.waitForURL(origin+href);await verify(kind);
  const features=page.locator('#service-features .studio-visual');await features.scrollIntoViewIfNeeded();await page.waitForFunction(expected=>document.querySelector('#service-features .scene-shell')?.dataset.scene===expected,featureKinds[kind]);assert.equal(await features.locator('.scene-shell').count(),1);assert.notEqual(featureKinds[kind],kind);const sources=await page.locator('main .studio-visual img').evaluateAll(images=>images.map(img=>new URL(img.src).pathname));assert.equal(new Set(sources).size,sources.length,'No duplicate illustrations within '+label);const closing=page.locator('#service-contact .studio-visual');await closing.scrollIntoViewIfNeeded();await page.waitForFunction(expected=>document.querySelector('#service-contact .scene-shell')?.dataset.scene===expected,href.split('/').filter(Boolean).at(-1)+'-brief');assert.equal(await closing.locator('canvas').count(),1);await page.locator('#service-intro').scrollIntoViewIfNeeded();await verify(kind);
  console.log('✓ Click navigation updates hero and feature model: '+label+' → '+kind+' / '+featureKinds[kind]);
 }
 await page.goBack();await verify('strategy');await page.goForward();await verify('hosting-service');
 // Keyboard interaction remains available without a visible control strip.
 const hero=page.locator('#service-intro .scene-shell');assert.equal(await hero.locator('button,.scene-controls').count(),0);
 await hero.locator('canvas').focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>Number(document.querySelector('#service-intro .scene-shell').dataset.rotation.split(',')[1])>.15);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>Math.abs(Number(document.querySelector('#service-intro .scene-shell').dataset.rotation.split(',')[1]))<.01);
 assert.equal(pixelSignatures.size,10);assert.ok(engineRequests.some(url=>/interactive-scenes-[a-f0-9]{10}\.js/.test(url)));assert.ok(!engineRequests.some(url=>/\/interactive-scenes\.js/.test(url)));assert.deepEqual(errors,[]);console.log('✓ Browser Back/Forward and keyboard rotation after repeated service changes; no stale/nested renderers or page errors');
}finally{await browser.close();}
