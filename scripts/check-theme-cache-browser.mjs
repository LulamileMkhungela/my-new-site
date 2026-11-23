/** Regression for the reported old/light About page; no JS and stale CSS. */
import assert from 'node:assert/strict';import Chromium from '@sparticuz/chromium';import {chromium} from 'playwright-core';
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});
const page=await browser.newPage({javaScriptEnabled:false,colorScheme:'light'});
await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:3000')?r.continue():r.abort());
await page.route('**/assets/css/site-*.css',r=>r.fulfill({contentType:'text/css',body:':root{--background:260 42% 96%;--foreground:255 45% 12%}.dark{--background:255 45% 12%;--foreground:260 42% 96%}body,.unified-page,.svc-page{background:hsl(var(--background));color:hsl(var(--foreground))}'}));
for(const route of ['/about/','/privacy/','/services/']){
 await page.goto('http://127.0.0.1:3000'+route,{waitUntil:'load'});
 const backgrounds=await page.evaluate(()=>[document.documentElement,document.body,document.querySelector('main')].map(el=>getComputedStyle(el).backgroundColor));
 assert.ok(backgrounds.every(color=>color==='rgb(21, 31, 41)'),route+': '+backgrounds);
}
console.log('✓ Critical theme survives an old light stylesheet and disabled JavaScript');await browser.close();
