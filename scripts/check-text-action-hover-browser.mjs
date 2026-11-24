import assert from 'node:assert/strict';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath()});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
 const state=el=>{const s=getComputedStyle(el),b=el.getBoundingClientRect();return {background:s.backgroundColor,color:s.color,decoration:s.textDecorationLine,thickness:s.textDecorationThickness,shadow:s.boxShadow,outline:s.outlineWidth,width:b.width,height:b.height,icon:el.querySelector('svg')?getComputedStyle(el.querySelector('svg')).color:null};};
 for(const [route,selectors] of [
  ['/services/seo-and-search/',['#service-contact .studio-text-link','#service-contact .studio-back','.rhino-primary a','.hybrid-service-nav a','.footer-privacy']],
  ['/portfolio/',['.hybrid-text-link']],
  ['/contact/',['.contact-extra-actions a','.contact-extra-actions button','.contact-back','.contact-section-bottom a']],
  ['/about/',['.page-socials a']],
  ['/project/lulafind/',['.owner-project-back']]
 ]){
  await page.goto(origin+route);await page.waitForFunction(()=>document.documentElement.dataset.routeReady===location.pathname);
  assert.equal(await page.locator('footer a[href*="linkedin.com"]').count(),0);
  for(const selector of selectors){
   const link=page.locator(selector).first();await link.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
   const before=await link.evaluate(state);
   await link.hover();const hovered=await link.evaluate(state);
   assert.equal(hovered.background,'rgba(0, 0, 0, 0)',selector+' no filled highlight');
   assert.ok(!hovered.shadow.includes('rgb(0, 206, 123)'),selector+' no green halo (existing dimensional button edges are retained)');
   assert.equal(hovered.thickness,'1px',selector+' fine underline');
   assert.equal(hovered.color,'rgb(123, 223, 183)',selector+' soft green text');
   assert.equal(hovered.decoration,'underline');
   assert.equal(hovered.width,before.width,selector+' no layout shift');assert.equal(hovered.height,before.height);
   if(hovered.icon)assert.equal(hovered.icon,hovered.color,selector+' contrasting icon');
   await page.mouse.move(0,0);await link.focus();const focused=await link.evaluate(state);
   assert.equal(focused.background,hovered.background,selector+' keyboard focus matches');
   assert.equal(focused.outline,'1px',selector+' understated keyboard outline');
   await link.evaluate(el=>el.blur());
  }
  console.log('✓ Subtle hover/focus, no fill/glow and stable geometry: '+route);
 }
 for(const route of ['/about/','/contact/']){
  await page.goto(origin+route);assert.equal(await page.locator('main .page-socials a[href*="linkedin.com"]').count(),1);
 }
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(origin+'/portfolio/');
  assert.deepEqual(await page.locator('.footer-icon-label').allTextContents(),['Call','Email','Meeting','Enquiry']);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 assert.deepEqual(errors,[]);
 console.log('✓ Footer has four actions, no LinkedIn; About/Contact LinkedIn preserved; responsive gutters intact');
}finally{await browser.close();}
