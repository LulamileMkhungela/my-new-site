import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import C from '@sparticuz/chromium';
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath(),headless:true});
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
 const cases={'/':'studio','/services/':'web-services','/services/web-hosting/':'hosting-service','/services/website-design/':'website-design','/services/ecommerce/':'commerce-service','/services/business-systems/':'system-service','/services/workflow-automation/':'workflow-service','/services/ai-assistants/':'assistant-service','/services/basic-graphic-design/':'graphic-service','/services/seo-and-search/':'search','/services/google-ads/':'advertising','/product-design-strategy/':'strategy','/portfolio/':'portfolio','/tools/':'toolkit'};
 for(const[route,kind]of Object.entries(cases).filter(([route])=>!process.env.SCENE_ROUTES||process.env.SCENE_ROUTES.split(',').includes(route))){
  await page.goto(origin+route);const shell=page.locator(`.scene-shell[data-scene='${kind}'][data-state=ready]`).first();
  await shell.waitFor();await page.waitForFunction(kind=>document.querySelector(`.scene-shell[data-scene='${kind}']`)?.dataset.rotation!==undefined,kind);
  const canvas=shell.locator('canvas');assert.ok((await canvas.boundingBox()).width>200);
  assert.equal(await page.locator('.scene-controls').count(),0);
  assert.equal(await shell.locator('button').count(),0);
  assert.ok(!/separate|reset/i.test(await canvas.getAttribute('aria-label')),'No stale separate-parts instructions');
  await page.mouse.move(1,1);await canvas.focus();await page.keyboard.press('ArrowRight');
  await page.waitForFunction(kind=>Number(document.querySelector(`.scene-shell[data-scene='${kind}']`).dataset.rotation.split(',')[1])>.15,kind);
  await page.keyboard.press('Escape');await page.waitForFunction(kind=>Math.abs(Number(document.querySelector(`.scene-shell[data-scene='${kind}']`).dataset.rotation.split(',')[1]))<.01,kind);
  // An ordinary click must no longer separate the illustration.
  await canvas.click();assert.equal(await shell.getAttribute('data-spread'),null);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  console.log('✓ Larger, control-free model with keyboard rotation and no click-to-separate:',route);
 }
 await page.goto(origin+'/contact/');assert.equal(await page.locator('.scene-shell').count(),0);
 assert.equal(await page.locator('.contact-art img,.contact-next-visual img').count(),2);
 const fallback=await browser.newPage();await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:original.call(this,type,...args)};});
 await fallback.goto(origin+'/');await fallback.locator('.scene-shell[data-state=fallback]').first().waitFor();
 assert.equal(await fallback.locator('.scene-shell').first().locator('img').isVisible(),true);
 assert.equal(await fallback.locator('.scene-controls').count(),0);
 const mobile=await browser.newPage({viewport:{width:390,height:900},hasTouch:true,isMobile:true});
 mobile.on('pageerror',e=>errors.push(e.message));
 for(const width of[320,390,768]){
  await mobile.setViewportSize({width,height:900});await mobile.goto(origin+'/services/web-hosting/');
  const shell=mobile.locator('.scene-shell[data-state=ready]').first();await shell.scrollIntoViewIfNeeded();await shell.waitFor();
  assert.equal(await shell.locator('canvas').evaluate(el=>getComputedStyle(el).touchAction),'pan-y');
  assert.equal(await shell.locator('button,.scene-controls').count(),0);
  assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  console.log('✓ Enlarged touch artwork, vertical scroll and safe width:',width);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
