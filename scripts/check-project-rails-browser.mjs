import assert from 'node:assert/strict';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath()});
try{
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
  await page.goto(origin+'/portfolio/');
  const apps=page.locator('#portfolio-category-apps'),track=apps.locator('.pf-grid');
  await apps.scrollIntoViewIfNeeded();
  assert.deepEqual((await track.locator('.pf-card').evaluateAll(els=>els.map(e=>e.dataset.project))).slice(0,4),['lulafind','onescreen-business','ai-lifeos','lawmania']);
  for(const rail of await page.locator('.pf-project-rail').all()){
   const overflowing=await rail.locator('.pf-grid').evaluate(el=>el.scrollWidth>el.clientWidth+2);
   assert.equal(await rail.locator('.pf-rail-controls').isVisible(),overflowing,'Only overflowing galleries show arrows');
  }
  const next=apps.getByRole('button',{name:'More apps projects',exact:true});
  await next.click();await page.waitForFunction(()=>document.querySelector('#portfolio-category-apps .pf-grid').scrollLeft>20);
  await page.waitForFunction(()=>!document.querySelector('#portfolio-category-apps .pf-rail-arrow').disabled);
  await apps.getByRole('button',{name:'Previous apps projects',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#portfolio-category-apps .pf-grid').scrollLeft<2);
  // Vertical wheel gestures over the inner rail must scroll the outer document
  // immediately, both at the start and after browsing to the end of the rail.
  for(const end of [false,true]){
   await track.evaluate((el,end)=>{el.scrollLeft=end?el.scrollWidth:0;window.scrollTo({top:el.getBoundingClientRect().top+scrollY-300,behavior:'instant'});},end);
   const box=await track.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+60);
   const before=await page.evaluate(()=>scrollY);
   await page.mouse.wheel(0,240);
   await page.waitForFunction(y=>scrollY>=y+180,before,{timeout:3000});
   assert.equal(await track.evaluate(el=>el.scrollTop),0,'No nested vertical scroll area');
  }
  assert.equal(await track.evaluate(el=>getComputedStyle(el).scrollSnapType),'none');
  assert.equal(await track.evaluate(el=>getComputedStyle(el).overscrollBehaviorY),'auto');
  await track.evaluate(el=>{el.scrollLeft=0;window.scrollTo({top:el.closest('section').getBoundingClientRect().top+scrollY-170,behavior:'instant'});});
  if(width===390||width===1440)await page.screenshot({path:'/tmp/project-rails-'+width+'.png'});
  await apps.getByRole('button',{name:'Collapse Apps projects'}).click();
  assert.equal(await track.isVisible(),false);
  await apps.getByRole('button',{name:'Expand Apps projects'}).click();
  await next.waitFor({state:'visible'});
  // Filtered Apps page uses the same ordering and controls.
  await page.goto(origin+'/portfolio/?filter=apps#portfolio-projects');
  assert.equal(await page.locator('.pf-category-section').count(),1);
  assert.equal(await page.locator('.pf-card').first().getAttribute('data-project'),'lulafind');
  await page.goto(origin+'/about/');
  const about=await page.locator('main').innerText();
  assert.match(about,/design and development/i);assert.doesNotMatch(about,/Gojo|iOCO|Vodacom|Toyota|designer’s playbook|millions of screens/);
  await page.goto(origin+'/');
  const home=page.locator('#home-portfolio');await home.scrollIntoViewIfNeeded();
  const overflow=await home.locator('.hm-project-previews').evaluate(el=>el.scrollWidth>el.clientWidth+2);
  assert.equal(await home.locator('.pf-rail-controls').isVisible(),overflow);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);
  console.log(`✓ ${width}px: app order, overflow arrows, forward/back, collapse/filter, uninterrupted vertical wheel, balanced About and Home gallery`);
  // Keep contexts alive: Lambda Chromium's single-process mode cannot recreate
  // a context after its last one has closed. The browser closes them in finally.
 }
 // Touch swipes over Apps must continue the main page, not latch into the rail.
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
 await page.goto(origin+'/portfolio/');
 await page.waitForFunction(()=>document.documentElement.dataset.routeReady===location.pathname+location.search+location.hash);
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const track=page.locator('#portfolio-category-apps .pf-grid');
 await track.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-300,behavior:'instant'}));
 const y=await page.evaluate(()=>scrollY),box=await track.boundingBox(),session=await context.newCDPSession(page);
 const x=Math.round(box.x+box.width/2),startY=Math.round(box.y+150);
 await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y:startY}]});
 for(const distance of [30,70,110,150,200,250]){
  await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:startY-distance}]});
  await page.waitForTimeout(25);
 }
 await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await page.waitForFunction(y=>scrollY>y+150,y,{timeout:3000});
 assert.equal(await track.evaluate(el=>el.scrollTop),0);
 console.log('✓ Mobile touch scroll over Apps continues the outer page');
}finally{await browser.close();}
