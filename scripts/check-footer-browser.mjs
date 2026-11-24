/** Optional: same browser dependencies/server setup as check-portfolio-browser.mjs. */
import assert from 'node:assert/strict';
import Chromium from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});
const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:3000')?r.continue():r.abort());
const root='http://127.0.0.1:3000';
for(const width of [320,1440]){
 await page.setViewportSize({width,height:900});
 for(const reducedMotion of ['no-preference','reduce']){
  await page.emulateMedia({reducedMotion});
  await page.goto(root+'/portfolio/?filter=ai-prompt',{waitUntil:'domcontentloaded'});
  await page.locator('footer').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
  assert.ok(await page.evaluate(()=>scrollY>200));
  assert.deepEqual(await page.locator('footer nav a').allTextContents(),['My Services','Portfolio','About']);
  assert.deepEqual(await page.locator('.footer-icon-label').allTextContents(),['Call','Email','Meeting','Enquiry']);
  assert.equal(await page.getByRole('link',{name:'Call +27 83 719 5064',exact:true}).getAttribute('href'),'tel:+27837195064');
  assert.equal(await page.locator('#footer-call-options').count(),0);
  await page.getByRole('button',{name:'Enquiry — open enquiry form'}).click();
  assert.ok(await page.locator('#footer-enquiry').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('audio').count(),0);
  assert.equal(await page.getByRole('button',{name:/music/i}).count(),0);
  assert.equal(await page.getByRole('button',{name:'Back to top',exact:true}).count(),1);
  await page.getByRole('button',{name:'Back to top',exact:true}).focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>scrollY<2);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  console.log('✓ Footer links, keyboard Back to top: '+width+'px / '+reducedMotion);
 }
}
await page.goto(root+'/project/prompt-service-provider-app/',{waitUntil:'domcontentloaded'});
await page.getByRole('button',{name:'Copy prompt'}).click();
await page.getByRole('status').filter({hasText:'Prompt copied.'}).waitFor();
assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),await page.locator('.owner-prompt pre').innerText());
await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('Not allowed'))}});document.execCommand=()=>false;});
await page.getByRole('button',{name:'Copy prompt'}).click();
await page.getByRole('status').filter({hasText:'Copy is unavailable here.'}).waitFor();
assert.ok(await page.getByRole('link',{name:'Download prompt (.txt)'}).isVisible());
assert.deepEqual(errors,[]);
console.log('✓ Free prompt copy succeeds; denied clipboard shows manual-copy/download fallback');
await browser.close();
