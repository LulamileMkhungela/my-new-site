import assert from 'node:assert/strict';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath()});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
 await page.addInitScript(()=>{
  window.__glCreates=0;const original=HTMLCanvasElement.prototype.getContext,seen=new WeakSet();
  HTMLCanvasElement.prototype.getContext=function(type,...args){const result=original.call(this,type,...args);if(/webgl/.test(type)&&result&&!seen.has(this)){seen.add(this);window.__glCreates++;}return result;};
 });
 const session=await page.context().newCDPSession(page);
 const swipe=async(x,y,dx,dy)=>{
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=8;i++){
   await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/8,y:y+dy*i/8}]});
   await page.waitForTimeout(22);
  }
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 };
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:844});await page.goto(origin+'/');
  await page.waitForFunction(()=>!!document.documentElement.dataset.routeReady);
  const rail=page.locator('.rhino-header .hybrid-service-nav-inner');
  await page.getByRole('button',{name:'More services',exact:true}).waitFor();
  const box=await rail.boundingBox(),startX=box.x+box.width-12,y=box.y+box.height/2;
  const route=page.url();await swipe(startX,y,-Math.min(200,box.width-30),0);
  await page.waitForFunction(()=>document.querySelector('.hybrid-service-nav-inner').scrollLeft>40);
  assert.equal(page.url(),route,'A swipe must not activate the link beneath it');
  assert.equal(await page.evaluate(()=>scrollY),0,'Horizontal service browsing does not move the document');
  const previous=page.getByRole('button',{name:'Previous services',exact:true});
  for(let i=0;i<12&&await previous.isEnabled();i++){
   await previous.evaluate(el=>el.click());await page.waitForTimeout(500);
  }
  await page.waitForFunction(()=>document.querySelector('.hybrid-service-nav-inner').scrollLeft<5);
  const next=page.getByRole('button',{name:'More services',exact:true});
  // Buttons provide an accessible alternative on devices with awkward gestures.
  for(let i=0;i<12&&await next.isEnabled();i++){
   await next.evaluate(el=>el.click());await page.waitForTimeout(500);
  }
  assert.ok(await next.isDisabled());
  await page.getByRole('navigation',{name:'Explore services'}).getByRole('link',{name:'Product Design & Strategy',exact:true}).click();
  await page.waitForURL('**/product-design-strategy');
  await page.waitForFunction(()=>document.documentElement.dataset.routeReady===location.pathname);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.equal(await page.locator('.rhino-header').evaluate(el=>getComputedStyle(el).backdropFilter),'none');
  console.log(`✓ ${width}px: actual touch swipe, category arrows/endpoints, last service navigation, no page overflow or mobile header blur`);
 }
 await page.setViewportSize({width:390,height:844});await page.goto(origin+'/services/web-hosting/');
 const canvas=page.locator('.scene-shell[data-state="ready"] canvas').first();await canvas.waitFor();
 const quality=await canvas.evaluate(el=>({ratio:el.width/el.clientWidth,antialias:el.getContext('webgl2').getContextAttributes().antialias}));
 assert.ok(Math.abs(quality.ratio-2)<.02,'Mobile high-DPI models use a capped 2x drawing buffer');
 assert.equal(quality.antialias,true,'Curved/vector edges retain antialiasing on high-DPI devices');
 await canvas.evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-240,behavior:'instant'}));
 const box=await canvas.boundingBox(),y=await page.evaluate(()=>scrollY);
 await swipe(Math.round(box.x+box.width/2),Math.round(Math.min(730,box.y+box.height-25)),0,-220);
 await page.waitForFunction(y=>scrollY>y+100,y);
 console.log('✓ High-DPI antialiased models and a real vertical touch swipe over artwork scrolls the page');
 await page.goto(origin+'/');await page.waitForFunction(()=>!!document.querySelector('.hm-visual canvas'));
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);
 const sampling=await page.evaluate(async()=>{
  const main=document.querySelector('main'),start=Number(document.querySelector('#hosting').dataset.sceneStart)-200;
  scrollTo({top:start,behavior:'instant'});await new Promise(r=>setTimeout(r,400));
  const before=window.__glCreates,samples=[];
  for(let i=0;i<50;i++){
   scrollTo({top:start+i*25,behavior:'instant'});
   await new Promise(requestAnimationFrame);
   samples.push({p:Number(main.dataset.sceneProgress),creates:window.__glCreates,max:Math.max(...[...document.querySelectorAll('.hm-panel')].map(p=>Number(p.dataset.sceneVisibility)))});
  }
  return {before,samples};
 });
 assert.ok(sampling.samples.every(s=>s.creates===sampling.before),'No new WebGL context/shader setup during continuous mobile scrolling');
 assert.ok(sampling.samples.every(s=>s.max>=.499),'No blank transition frames');
 assert.ok(sampling.samples.every((s,i,a)=>!i||s.p>=a[i-1].p-.001),'Smoothed progress never vibrates backwards');
 await page.waitForFunction(()=>document.querySelector('main').dataset.sceneSettled==='true');
 await page.waitForTimeout(700);
 const live=await page.locator('.scene-shell').count();assert.ok(live<=2,'Bounded live WebGL contexts after scrolling');
 assert.deepEqual(errors,[]);
 console.log('✓ Continuous mobile scroll: no WebGL setup in flight, synchronized nonblank transitions, monotonic progress and bounded contexts');
}finally{await browser.close();}
