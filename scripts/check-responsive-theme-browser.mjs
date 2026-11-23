/** Complete active-route mobile/theme audit. Serve repository on port 3000. */
import assert from 'node:assert/strict';import fs from 'node:fs';import Chromium from '@sparticuz/chromium';import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const routes=Object.keys(JSON.parse(fs.readFileSync('assets/js/publication.data.json','utf8')).routes).filter(path=>path!=='/404');
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});
const context=await browser.newContext({colorScheme:'light'});await context.addInitScript(()=>localStorage.setItem('theme','light'));
const page=await context.newPage();page.setDefaultNavigationTimeout(20000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
await page.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
for(const width of (process.argv.includes('--navigation-only')?[]:[320,375,768,1024,1440])){
 await page.setViewportSize({width,height:900});
 for(const route of routes){
  await page.goto(origin+route,{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});
  const surfaces=await page.evaluate(()=>[document.documentElement,document.body,document.querySelector('main'),...document.querySelectorAll('.unified-about-copy')].map(el=>({class:el.className,bg:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color})));
  for(const surface of surfaces){assert.equal(surface.bg,'rgb(21, 31, 41)',route+' '+JSON.stringify(surface));assert.ok(surface.color.match(/[\d.]+/g).map(Number).slice(0,3).every(c=>c>150),route+' light text');}
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflows '+width);
  if(route==='/contact'&&width<701)for(const field of await page.locator('main form input:not([type=hidden]),main form select,main form textarea').all()){if(await field.isVisible())assert.ok(await field.evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=16));}
 }
 console.log('✓ All '+routes.length+' active pages: navy surfaces, light text, no page overflow at '+width+'px (light OS/stored preference)');
}
// Verify the exact About section in the reported screenshot after SPA navigation.
await page.goto(origin+'/',{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});await page.locator('.rhino-primary').getByRole('link',{name:'About',exact:true}).click();await page.waitForURL('**/about');await page.locator('.site-back-to-top').waitFor({state:'attached'});await page.locator('.unified-about-copy').evaluate(el=>el.scrollIntoView({behavior:'instant'}));assert.equal(await page.locator('.unified-about-copy').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(21, 31, 41)');await page.screenshot({path:'/tmp/about-navy-confirmed.png'});
await page.setViewportSize({width:320,height:850});await page.goto(origin+'/',{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});const menu=page.getByRole('button',{name:'Open navigation'});const target=await menu.boundingBox();assert.ok(target.width>=44&&target.height>=44);await menu.click();await page.locator('#rhino-mobile-menu').getByRole('link',{name:'About',exact:true}).click();assert.ok(await page.getByRole('button',{name:'Open navigation'}).isVisible());
await page.getByRole('button',{name:'Open navigation'}).click();await page.keyboard.press('Escape');assert.equal(await page.locator('#rhino-mobile-menu').count(),0);
assert.deepEqual(errors,[]);console.log('✓ Desktop/mobile SPA navigation, 44px menu target, Escape dismissal, no runtime errors');await browser.close();
