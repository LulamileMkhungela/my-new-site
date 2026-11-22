/** Optional: browser dependencies as documented; repository server on 3000. */
import assert from 'node:assert/strict';import Chromium from '@sparticuz/chromium';import {chromium} from 'playwright-core';
for(const javaScriptEnabled of [true,false]){
 const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});
 const context=await browser.newContext({javaScriptEnabled,colorScheme:'light'});if(javaScriptEnabled)await context.addInitScript(()=>localStorage.setItem('theme','light'));
 const page=await context.newPage();page.setDefaultNavigationTimeout(20000);await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:3000')?r.continue():r.abort());
 for(const width of [320,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/about/','/privacy/','/services/','/services/website-design/','/portfolio/','/contact/','/tools/','/project/prodops/']){
   await page.goto('http://127.0.0.1:3000'+route,{waitUntil:'domcontentloaded'});
   await page.waitForLoadState('load');
   if(javaScriptEnabled)await page.locator('.site-back-to-top').waitFor({state:'attached'});
   const colors=await page.evaluate(()=>[document.documentElement,document.body,document.querySelector('main')].map(el=>({background:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color})));
   for(const value of colors){assert.equal(value.background,'rgb(21, 31, 41)',route+' '+JSON.stringify(colors));const rgb=value.color.match(/[\d.]+/g).map(Number);assert.ok(rgb.slice(0,3).every(c=>c>150),'Text contrast: '+route);}
   for(const card of await page.locator('.svc-card,.svc-scope,.svc-cta,.unified-tool').all()){const bg=await card.evaluate(el=>getComputedStyle(el).backgroundColor);assert.ok(bg.match(/[\d.]+/g).map(Number).slice(0,3).every(c=>c<100),'Unexpected light surface '+route+' '+bg);}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  console.log('✓ Navy pages and surfaces at '+width+'px; JavaScript '+javaScriptEnabled+'; light OS preference');
 }
 await context.close();await browser.close();
}
