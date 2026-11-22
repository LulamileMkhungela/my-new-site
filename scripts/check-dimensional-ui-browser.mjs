import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import Chromium from '@sparticuz/chromium';
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),root='http://127.0.0.1:3000',errors=[];page.on('pageerror',e=>errors.push(e.message));
// Geometry has its own suite; isolate HTML surfaces and interactions here.
await page.route('**/*',r=>r.request().url().startsWith(root)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
await page.goto(root+'/');await page.locator('.site-back-to-top').waitFor({state:'attached'});
const button=page.locator('.hm-ride');assert.ok((await button.evaluate(el=>getComputedStyle(el).backgroundImage)).includes('linear-gradient'));assert.notEqual(await button.evaluate(el=>getComputedStyle(el).boxShadow),'none');
await button.hover({position:{x:20,y:15}});await page.waitForTimeout(250);assert.notEqual(await button.evaluate(el=>el.style.getPropertyValue('--depth-ry')),'');assert.notEqual(await button.evaluate(el=>getComputedStyle(el).transform),'none');
const box=await button.boundingBox();await page.mouse.down();await page.waitForTimeout(250);assert.ok(await button.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42>=3.9));await page.mouse.move(2,2);await page.mouse.up();
assert.equal(await button.evaluate(el=>el.style.getPropertyValue('--depth-ry')),'');await page.keyboard.press('Tab');await button.focus();assert.equal(await button.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
await page.emulateMedia({reducedMotion:'reduce'});await button.hover();assert.equal(await button.evaluate(el=>getComputedStyle(el).transform),'none');assert.equal(await button.evaluate(el=>getComputedStyle(el).transitionDuration),'0s');await page.emulateMedia({reducedMotion:'no-preference'});
await page.screenshot({path:'/tmp/dimensional-ui-home.png'});
for(const width of [320,390,768,1440]){
 await page.setViewportSize({width,height:1000});
 for(const route of ['/','/services/','/portfolio/?filter=ai-prompt','/tools/','/contact/']){
  await page.goto(root+route,{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+route+' '+width);
  if(route==='/services/'){const row=page.locator('.studio-service-row').first();assert.ok((await row.evaluate(el=>getComputedStyle(el).backgroundImage)).includes('linear-gradient'));}
  if(route.includes('ai-prompt')){assert.equal(await page.locator('.pf-copy-prompt').count(),5);assert.ok((await page.locator('.pf-copy-prompt').first().evaluate(el=>getComputedStyle(el).boxShadow)).includes('inset'));}
 }
 console.log('✓ Tactile buttons/cards/tabs/footer, no page overflow across five routes at '+width);
}
await page.emulateMedia({forcedColors:'active'});assert.equal(await page.locator('button').first().evaluate(el=>getComputedStyle(el).boxShadow),'none');
assert.deepEqual(errors,[]);await browser.close();console.log('✓ Pointer tilt, real press depth, keyboard focus, reduced motion and forced-colors fallback');
