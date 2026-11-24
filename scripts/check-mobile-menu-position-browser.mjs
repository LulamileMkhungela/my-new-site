import assert from 'node:assert/strict';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath()});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
 const frames=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const tap=async locator=>{const box=await locator.boundingBox();await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);};
 const mouseClick=async locator=>{const box=await locator.boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);};
 const snapshot=()=>page.evaluate(()=>({
  y:scrollY,header:document.querySelector('.rhino-header').offsetHeight,headerVariable:getComputedStyle(document.documentElement).getPropertyValue('--site-header-height'),
  stage:document.querySelector('.hm-stage').offsetHeight,journey:document.querySelector('main').offsetHeight,
  active:document.querySelector('main').dataset.sceneActive,progress:document.querySelector('main').dataset.sceneProgress,
  starts:[...document.querySelectorAll('.hm-panel')].map(el=>el.dataset.sceneStart)
 }));
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:844});await page.goto(origin+'/');
  await page.waitForFunction(()=>!!document.querySelector('#systems[data-scene-start]'));
  await page.evaluate(()=>document.fonts.ready);await frames();
  for(const id of ['systems','design-growth','testimonials']){
   await page.locator(`.hm-chapter-rail a[href="#${id}"]`).click();
   await page.waitForFunction(id=>document.querySelector('main').dataset.sceneActive===id&&document.querySelector('main').dataset.sceneSettled==='true',id);
   await frames();const before=await snapshot();
   // Check toggle, Escape and outside-pointer dismissal at the same chapter.
   for(const close of ['toggle','escape','outside']){
    await tap(page.getByRole('button',{name:'Open navigation',exact:true}));
    await page.getByRole('navigation',{name:'Mobile navigation'}).waitFor();await frames();
    assert.deepEqual(await snapshot(),before,`${width}px ${id}: opening menu must preserve scroll, header, stage, progress and every chapter offset`);
    assert.equal(await page.locator('.rhino-mobile-menu').evaluate(el=>getComputedStyle(el).position),'absolute');
    if(close==='toggle')await tap(page.getByRole('button',{name:'Close navigation',exact:true}));
    else if(close==='escape'){
     await page.keyboard.press('Escape');
     assert.equal(await page.evaluate(()=>document.activeElement?.className),'rhino-menu-button');
    }else await page.locator('main').dispatchEvent('pointerdown',{pointerType:'touch'});
    await page.getByRole('navigation',{name:'Mobile navigation'}).waitFor({state:'detached'});await frames();
    assert.deepEqual(await snapshot(),before,`${width}px ${id}: ${close} dismissal must keep the chapter still`);
   }
  }
  console.log(`✓ ${width}px: steps 4/7/11 remain unchanged through menu open, toggle, Escape and outside dismissal (real WebGL)`);
 }
 // A short screen scrolls within the overlay rather than resizing the stage.
 await page.setViewportSize({width:390,height:480});await page.goto(origin+'/');
 await page.waitForFunction(()=>!!document.querySelector('#systems[data-scene-start]'));
 await page.locator('.hm-chapter-rail a[href="#systems"]').click();
 await page.waitForFunction(()=>document.querySelector('main').dataset.sceneActive==='systems'&&document.querySelector('main').dataset.sceneSettled==='true');
 const before=await snapshot();await tap(page.getByRole('button',{name:'Open navigation',exact:true}));
 const menu=page.getByRole('navigation',{name:'Mobile navigation'});await menu.evaluate(el=>el.scrollTo({top:el.scrollHeight,behavior:'instant'}));
 await frames();assert.deepEqual(await snapshot(),before);
 await tap(menu.getByRole('link',{name:'Contact',exact:true}));await page.waitForURL('**/contact');
 assert.equal(await page.locator('.rhino-mobile-menu').count(),0);
 console.log('✓ Short mobile screen: overlay scroll does not move Home; menu route links still navigate and close');
 for(const width of [1024,1440]){
  await page.setViewportSize({width,height:900});await page.goto(origin+'/');
  await page.waitForFunction(()=>!!document.querySelector('#systems[data-scene-start]'));
  await page.locator('.hm-chapter-rail a[href="#systems"]').click();
  await page.waitForFunction(()=>document.querySelector('main').dataset.sceneActive==='systems'&&document.querySelector('main').dataset.sceneSettled==='true');
  await frames();const before=await snapshot();
  await mouseClick(page.getByRole('button',{name:'About and contact links'}));await frames();
  assert.deepEqual(await snapshot(),before);await page.keyboard.press('Escape');await frames();assert.deepEqual(await snapshot(),before);
  assert.equal(await page.locator('.rhino-menu-button').isVisible(),false);
  console.log(`✓ ${width}px desktop: dropdown does not alter step 4, scroll position or animation timeline`);
 }
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(origin+'/');
 await page.evaluate(()=>document.fonts.ready);await page.locator('#systems').scrollIntoViewIfNeeded();await frames();
 const still=await snapshot();await tap(page.getByRole('button',{name:'Open navigation',exact:true}));await frames();assert.deepEqual(await snapshot(),still);
 await page.keyboard.press('Escape');await frames();assert.deepEqual(await snapshot(),still);
 console.log('✓ Reduced motion: menu open/Escape also preserves the static reading position');
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
