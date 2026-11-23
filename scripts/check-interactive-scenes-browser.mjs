import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import Chromium from '@sparticuz/chromium';
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});
const root='http://127.0.0.1:3000',errors=[];
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',r=>r.request().url().startsWith(root)?r.continue():r.abort());
const cases={'/':'studio','/services/':'web-services','/services/web-hosting/':'hosting-service','/services/website-design/':'website-design','/services/ecommerce/':'commerce-service','/services/business-systems/':'system-service','/services/workflow-automation/':'workflow-service','/services/ai-assistants/':'assistant-service','/services/basic-graphic-design/':'graphic-service','/services/seo-and-search/':'search','/services/google-ads/':'advertising','/product-design-strategy/':'strategy','/portfolio/':'portfolio','/tools/':'toolkit'};
for(const[route,kind]of Object.entries(cases).filter(([route])=>!process.env.SCENE_ROUTES||process.env.SCENE_ROUTES.split(',').includes(route))){
 await page.goto(root+route,{waitUntil:'load'});
 const shell=page.locator(`.scene-shell[data-scene='${kind}'][data-state=ready]`).first();await shell.waitFor();await page.waitForFunction(k=>document.querySelector(`.scene-shell[data-scene='${k}']`)?.dataset.rotation!==undefined,kind);
 const canvas=shell.locator('canvas');assert.ok((await canvas.boundingBox()).width>200);
 await shell.getByRole('button',{name:'Separate parts',exact:true}).click();await page.waitForFunction(k=>Number(document.querySelector(`.scene-shell[data-scene='${k}']`)?.dataset.spread)>.98,kind);
 await shell.getByRole('button',{name:'Reset',exact:true}).click();
 if(route==='/'){
  await canvas.focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>Number(document.querySelector('.scene-shell').dataset.rotation.split(',')[1])>.15);
  await page.keyboard.press('Enter');assert.equal(await shell.getByRole('button',{name:'Assemble parts'}).getAttribute('aria-pressed'),'true');
  await page.keyboard.press('Escape');await page.waitForFunction(()=>Number(document.querySelector('.scene-shell')?.dataset.spread)<.02);
  const box=await canvas.boundingBox();await canvas.click({position:{x:box.width/2,y:box.height/2}});assert.equal(await shell.getByRole('button',{name:'Assemble parts'}).getAttribute('aria-pressed'),'true');await shell.getByRole('button',{name:'Reset',exact:true}).click();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+95,box.y+box.height/2-30,{steps:8});await page.mouse.up();await page.waitForFunction(()=>Number(document.querySelector('.scene-shell').dataset.rotation.split(',')[1])>.5);
  await page.emulateMedia({reducedMotion:'reduce'});await shell.getByRole('button',{name:'Separate parts',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.scene-shell').dataset.spread==='1.000');await page.emulateMedia({reducedMotion:'no-preference'});
  for(const section of await page.locator('.hm-visual').all()){await section.scrollIntoViewIfNeeded();await page.waitForTimeout(100);assert.ok(await page.locator('.scene-shell canvas').count()<=3);}
 }
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 console.log('✓ True WebGL '+kind+' scene: '+route+'; separate/reset controls');
}
await page.goto(root+'/contact/',{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});assert.equal(await page.locator('.scene-shell').count(),0);assert.equal(await page.locator('.contact-art img,.contact-next-visual img').count(),2);
// Non-WebGL devices retain the original image and never get broken controls.
const fallback=await browser.newPage();await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:original.call(this,type,...args)};});
await fallback.goto(root+'/');await fallback.locator('.scene-shell[data-state=fallback]').waitFor();assert.equal(await fallback.locator('.scene-shell').first().locator('img').isVisible(),true);assert.equal(await fallback.locator('.scene-controls').count(),0);await fallback.close();
await page.close();await browser.close();
const mobileBrowser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});const mobile=await mobileBrowser.newPage({viewport:{width:390,height:900},hasTouch:true,isMobile:true});mobile.on('pageerror',e=>errors.push(e.message));
for(const width of[320,390,768]){
 await mobile.setViewportSize({width,height:900});await mobile.goto(root+'/services/web-hosting/',{waitUntil:'load'});const shell=mobile.locator('.scene-shell[data-state=ready]').first();await shell.scrollIntoViewIfNeeded();await shell.waitFor();assert.equal(await shell.locator('canvas').evaluate(el=>getComputedStyle(el).touchAction),'pan-y');await shell.getByRole('button',{name:'Separate parts',exact:true}).tap();assert.equal(await shell.getByRole('button',{name:'Assemble parts'}).getAttribute('aria-pressed'),'true');assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));console.log('✓ Touch controls, vertical page scroll allowed, no overflow at '+width);
}
assert.deepEqual(errors,[]);await mobileBrowser.close();
console.log('✓ Keyboard, drag rotation, reduced motion, visibility cleanup, WebGL fallback; Contact unchanged');
