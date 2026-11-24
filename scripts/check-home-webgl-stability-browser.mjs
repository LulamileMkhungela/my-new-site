import assert from 'node:assert/strict';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath()});
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Unlike the deterministic choreography suite, enable the actual WebGL loader.
  await page.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
  await page.goto(origin+'/');await page.waitForFunction(()=>!!document.querySelector('.hm-visual canvas'));
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);
  const layout=()=>page.locator('.hm-panel').evaluateAll(els=>els.map(el=>({height:el.offsetHeight,start:el.dataset.sceneStart})));
  const before=await layout();
  await page.locator('.hm-chapter-rail a[href="#assistants"]').click();
  await page.waitForFunction(()=>document.activeElement?.id==='assistants');
  await page.waitForTimeout(100);
  assert.deepEqual(await layout(),before,'Mounting/disposal must never change chapter heights or timeline offsets');
  const visibility=await page.locator('.scene-shell[data-state="ready"] .scene-stage>img').evaluateAll(els=>els.map(el=>getComputedStyle(el).visibility));
  assert.ok(visibility.length&&visibility.every(v=>v==='hidden'),'SVG fallback must not duplicate the live model');
  assert.ok(await page.locator('.hm-visual canvas').count()<=2,'Only adjacent crossfading models can be mounted');
  // A lost GPU context restores the original illustration without layout change.
  await page.locator('#assistants canvas').evaluate(el=>el.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.waitForFunction(()=>document.querySelector('#assistants .scene-shell').dataset.state==='fallback');
  assert.equal(await page.locator('#assistants .scene-stage>img').evaluate(el=>getComputedStyle(el).visibility),'visible');
  assert.equal(await page.locator('#assistants canvas').evaluate(el=>getComputedStyle(el).display),'none');
  assert.deepEqual(await layout(),before,'GPU fallback is layout-stable');
  assert.deepEqual(errors,[]);
  console.log(`✓ Real WebGL ${width}: stable heights/offsets across chapter navigation, no duplicate illustration, max two model contexts, stable SVG recovery after context loss`);
 }
}finally{await browser.close();}
