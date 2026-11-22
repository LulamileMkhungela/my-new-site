import assert from 'node:assert/strict';import fs from 'node:fs';import Chromium from '@sparticuz/chromium';import {chromium} from 'playwright-core';
const routes=Object.keys(JSON.parse(fs.readFileSync('assets/js/publication.data.json','utf8')).routes);
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});const page=await browser.newPage({colorScheme:'light'});await page.addInitScript(()=>localStorage.setItem('theme','light'));await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:3000')?r.continue():r.abort());
for(const width of [320,768,1440]){
 await page.setViewportSize({width,height:900});
 for(const route of routes){
  await page.goto('http://127.0.0.1:3000'+(route==='/404'?'/404.html':route),{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});
  const result=await page.evaluate(()=>{
   const mark=document.querySelector('main .hm-watermark,main .pf-watermark,main .hybrid-hero-watermark,main [data-background-text]');
   if(!mark)return {missing:true};const pseudo=mark.hasAttribute('data-background-text'),style=getComputedStyle(mark,pseudo?'::after':null),container=pseudo?mark:mark.parentElement;
   return {text:pseudo?mark.dataset.backgroundText:mark.textContent,stroke:style.webkitTextStrokeColor,width:style.webkitTextStrokeWidth,color:style.color,font:style.fontFamily,size:parseFloat(style.fontSize),hidden:mark.getAttribute('aria-hidden'),content:style.content,background:getComputedStyle(container).backgroundColor,glow:getComputedStyle(container,'::before').backgroundImage,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert.ok(!result.missing,route+' missing watermark');assert.ok(result.text.length>0,route);assert.equal(result.stroke,'rgba(147, 194, 181, 0.07)',route);assert.equal(result.width,'1px',route);assert.equal(result.color,'rgba(0, 0, 0, 0)',route);assert.ok(result.size>=100,route);assert.equal(result.background,'rgb(21, 31, 41)',route);assert.ok(result.glow.includes('radial-gradient'),route);assert.equal(result.overflow,false,route+' overflow');
 }
 console.log('✓ All '+routes.length+' routes: shared navy, emerald glow, visible-size outlined background text, no overflow at '+width+'px');
}
await browser.close();
