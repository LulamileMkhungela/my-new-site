import assert from 'node:assert/strict';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath(),headless:true});
try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
 const ready=()=>page.waitForFunction(()=>document.documentElement.dataset.routeReady===location.pathname+location.search+location.hash);
 for(const width of[390,1440])for(const mode of['top-link','bottom-link','browser-back','reload-back']){
  await page.setViewportSize({width,height:1000});
  await page.goto(origin+'/portfolio/?filter=apps#portfolio-category-apps');await ready();
  const card=page.locator('[data-project="lunianetwork"]');await card.scrollIntoViewIfNeeded();
  await page.evaluate(()=>document.fonts.ready);
  const before=await card.evaluate(el=>({url:location.href,y:scrollY,left:el.closest('.pf-grid').scrollLeft}));
  await card.locator('a.pf-card-link').click();await page.waitForURL('**/project/lunianetwork/');await page.locator('.owner-project-section').nth(1).waitFor();await ready();
  const gaps=await page.locator('.owner-project-section').evaluateAll(els=>els.slice(1).map((el,i)=>el.getBoundingClientRect().top-els[i].getBoundingClientRect().bottom));
  assert.ok(gaps.length>0&&gaps.every(gap=>gap>=19.5),'Project note panels have outside spacing: '+JSON.stringify(gaps));
  if(mode==='reload-back'){await page.reload();await ready();}
  if(mode==='browser-back')await page.goBack();else await page.locator('.owner-project-back')[mode==='bottom-link'?'last':'first']().click();
  await page.waitForURL(before.url);await ready();
  await page.waitForFunction(y=>Math.abs(scrollY-y)<3,before.y);
  assert.ok(Math.abs(await page.locator('.pf-grid').evaluate(el=>el.scrollLeft)-before.left)<3,'Horizontal project position restored');
  assert.equal(await page.locator('.pf-category-jumps [aria-current="page"]').textContent(),'Apps');
  console.log('✓ Project section spacing and exact filtered return: '+width+'px; '+mode);
 }
 // A collapsed earlier section must not shift the section on return.
 await page.goto(origin+'/portfolio/');await ready();
 await page.getByRole('button',{name:'Collapse Website projects',exact:true}).click();
 const card=page.locator('[data-project="sesyme"]');await card.scrollIntoViewIfNeeded();
 const before=await page.evaluate(()=>scrollY);
 await card.locator('a.pf-card-link').click();await page.waitForURL('**/project/sesyme/');
 await page.goBack();await ready();
 await page.waitForFunction(y=>Math.abs(scrollY-y)<3,before);
 assert.equal(await page.getByRole('button',{name:'Expand Website projects',exact:true}).getAttribute('aria-expanded'),'false');
 // Direct entry has no origin: both back controls fall back to the relevant category.
 await page.goto(origin+'/project/sesyme/');await ready();
 await page.locator('.owner-project-back').first().click();await page.waitForURL('**/portfolio?filter=apps#portfolio-category-apps');
 assert.deepEqual(errors,[]);
 console.log('✓ All-projects collapsed sections preserved; direct-entry fallback returns to Apps');
}finally{await browser.close();}
