import assert from 'node:assert/strict';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath(),headless:true});
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
// Complementary fades keep at least one synchronized chapter visible after
// the text/vector grouping (the reference's isolated mascot hid text gaps).
const fade=t=>smooth((t-.3)/.4);
const chapterVisibility=(p,i)=>1-fade(Math.abs(p-i));
const ready=async page=>{
 await page.waitForFunction(()=>document.documentElement.dataset.routeReady===location.pathname+location.search+location.hash);
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>!!document.querySelector('#assistants[data-scene-start]'));
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
};
const jump=async(page,y,p)=>{
 await page.evaluate(top=>scrollTo({top,behavior:'instant'}),y);
 await page.waitForFunction(expected=>document.querySelector('main').dataset.sceneSettled==='true'&&Math.abs(Number(document.querySelector('main').dataset.sceneProgress)-expected)<.003,p);
 // Wait for damping to stop before asserting stationary/reversible transforms.
 await page.waitForTimeout(700);
};
const snapshot=page=>page.locator('.hm-stage').evaluate(stage=>({
 top:stage.getBoundingClientRect().top,height:stage.offsetHeight,journey:stage.parentElement.offsetHeight,
 p:Number(stage.parentElement.dataset.sceneProgress),
 panels:[...stage.querySelectorAll('.hm-panel')].map(panel=>({
  id:panel.id,position:getComputedStyle(panel).position,d:Number(panel.dataset.sceneDistance),alpha:Number(panel.dataset.sceneVisibility),height:panel.offsetHeight,
  layers:[...panel.querySelectorAll('[data-scene-layer]')].map(el=>({kind:el.dataset.sceneLayer,transform:getComputedStyle(el).transform,opacity:getComputedStyle(el).opacity})),
  text:[...panel.querySelectorAll('[data-scene-layer="text"]')].filter(el=>getComputedStyle(el).display!=='none').map(el=>({opacity:Number(getComputedStyle(panel).opacity),matrix:getComputedStyle(panel).transform,scale:new DOMMatrixReadOnly(getComputedStyle(panel).transform).a,x:new DOMMatrixReadOnly(getComputedStyle(panel).transform).m41}))
 }))
}));
try{
 for(const [width,height] of (process.env.TEST_SHORT?[[1440,650]]:[[390,1000],[1024,900],[1440,1000],[1440,650]])){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'no-preference'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
  await page.goto(origin+'/');await ready(page);
  const isMobile=width<=760;
  assert.equal(await page.locator('.scene-deck>.hm-stage').count(),1,'Exactly one sticky stage');
  assert.equal(await page.locator('.hm-page .motion-enter').count(),0,'No competing timed entry observers on Home');
  const positions=await page.locator('.hm-panel').evaluateAll(els=>els.map(el=>Number(el.dataset.sceneStart)));
  const stageHeight=await page.locator('.hm-stage').evaluate(el=>el.offsetHeight);
  const exit=isMobile?Math.max(240,stageHeight*.48):height*2;
  // Compare actual composited text against the source curves, not just presence
  // of classes. Include depth entries and the special portfolio/about overlap.
  const checks=isMobile?[3.3,3.5,3.65,3.7,6.72,7.55]:[.5,1.5,2.8,3.2,3.65,4.8,6.5,6.72,7.55,8.6];
  for(const desired of checks){
   const i=Math.floor(desired),fraction=desired-i;
   await jump(page,positions[i+1]-exit+fraction*exit,desired);
   const state=await snapshot(page);
   assert.ok(state.panels.every(panel=>panel.position==='absolute'),'No independently sticky chapters');
   if(Math.abs(fraction-.65)<.001){
    assert.ok(state.panels[i].alpha<.05,'Outgoing chapter fades decisively below 5% by 65% travel');
    assert.ok(state.panels[i+1].alpha>.95,'Incoming chapter is strongly visible without a blank gap');
   }
   assert.ok(Math.max(...state.panels.map(panel=>panel.alpha))>=.4999,'At least one chapter remains visible at intermediate scroll stops');
   assert.ok(state.panels.reduce((sum,panel)=>sum+panel.alpha,0)>=.9998,'Complementary text/vector fades must not leave an empty stage');
   for(const panel of state.panels)for(const layer of panel.layers){
    assert.equal(layer.transform,'none','Content/vector must inherit one shared chapter transform, with no independent travel or stagger');
    assert.equal(layer.opacity,'1','Content/vector must share the chapter fade, with no independent arrival curve');
   }
   if(!isMobile)for(let j=0;j<state.panels.length;j++){
    const panel=state.panels[j],d=state.p-j,depth=(j===3||j===5)&&d<0;
    assert.ok(Math.abs(panel.alpha-chapterVisibility(state.p,j))<.001,'Continuous chapter visibility '+j);
    for(const text of panel.text){
     assert.ok(Math.abs(text.scale-(1+Math.min(Math.abs(d),1)*(depth?.65:0)))<.001,'Matches reference depth entry');
     assert.ok(Math.abs(text.x-(depth?0:d*(j%2?-240:240)))<.05,`Matches reference alternating travel: width=${width} p=${state.p} chapter=${j} x=${text.x} expected=${depth?0:d*(j%2?-240:240)} matrix=${text.matrix}`);
    }
   }
   else{
    const t=state.p-i,outgoing=1-fade(t),incoming=fade(t);
    assert.ok(Math.abs(state.panels[i].alpha-outgoing)<.003,'Synchronized mobile outgoing fade');
    assert.ok(Math.abs(state.panels[i+1].alpha-incoming)<.003,'Synchronized mobile incoming fade');
   }
  }
  // Frame-by-frame regression for the reported vibration. Monotonic physical
  // scroll must never reverse rendered progress, resize the journey, or move
  // the stage. Sample an entire entrance, rather than static screenshots only.
  const from=positions[4]-exit,to=positions[4];
  await jump(page,from,3);
  const frames=await page.evaluate(async({from,to})=>{
   const samples=[];
   for(let i=0;i<=75;i++){
    scrollTo({top:from+(to-from)*i/75,behavior:'instant'});
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    const stage=document.querySelector('.hm-stage'),root=stage.parentElement;
    samples.push({y:scrollY,p:Number(root.dataset.sceneProgress),top:stage.getBoundingClientRect().top,height:root.offsetHeight,maxAlpha:Math.max(...[...stage.querySelectorAll('.hm-panel')].map(el=>Number(el.dataset.sceneVisibility)))});
   }
   return samples;
  },{from,to});
  for(let i=1;i<frames.length;i++){
   assert.ok(frames[i].p>=frames[i-1].p,'No backwards frame during monotonic scroll');
   assert.ok(frames[i].maxAlpha>=.4999,'No blank frame while scrolling between chapters');
   assert.ok(Math.abs(frames[i].top-frames[0].top)<.1,'Stage cannot vibrate vertically');
   assert.equal(frames[i].height,frames[0].height,'No scroll/render layout feedback');
  }
  await jump(page,positions[4],4);const still=await snapshot(page);
  await page.waitForTimeout(250);assert.deepEqual(await snapshot(page),still,'No idle vibration or competing transform');
  await jump(page,positions[4]-exit*.2,3.8);const forward=await snapshot(page);
  await jump(page,positions[4],4);await jump(page,positions[4]-exit*.2,3.8);
  assert.deepEqual(await snapshot(page),forward,'Reverse scroll converges on the same composition');
  // Chapter links use cached timeline positions (not absolute panel geometry).
  for(const id of ['home','hosting','assistants','home-portfolio','testimonials']){
   await page.locator('.hm-chapter-rail a[href="#'+id+'"]').click();
   await page.waitForFunction(id=>document.activeElement?.id===id,id);
   assert.equal(await page.locator('#'+id).getAttribute('data-scene-visibility'),'1');
   assert.equal(await page.locator('#'+id).evaluate(el=>el.inert),false);
  }
  // Tall chapters have a full reading interval before any outgoing transition.
  if(isMobile){
   await page.locator('.hm-chapter-rail a[href="#assistants"]').click();await page.waitForFunction(()=>document.activeElement?.id==='assistants');
   const y=await page.locator('#assistants').evaluate(el=>Number(el.dataset.sceneStart)+180);
   await page.evaluate(y=>scrollTo({top:y+80,behavior:'instant'}),y);await page.waitForTimeout(80);
   assert.equal(await page.locator('#assistants').getAttribute('data-scene-visibility'),'1');
  }
  await page.locator('.hm-chapter-rail a[href="#home-portfolio"]').click();await page.waitForFunction(()=>document.activeElement?.id==='home-portfolio');
  const entry=await page.evaluate(()=>history.state.key);
  await page.locator('#home-portfolio a[href="/portfolio"]').click();await page.waitForURL('**/portfolio');await page.waitForFunction(()=>document.documentElement.dataset.routeReady==='/portfolio');
  // A short viewport may scroll through the reading interval to click the
  // link. Restore that actual departure position, not its pre-click position.
  const saved=await page.evaluate(key=>JSON.parse(sessionStorage.getItem('lulazel-position-'+key)).y,entry);
  await page.goBack();await ready(page);assert.ok(Math.abs(await page.evaluate(()=>scrollY)-saved)<3,'SPA Back restores the actual departure position');
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>!document.querySelector('.scene-deck'));
  assert.equal(await page.locator('.hm-panel[inert]').count(),0);
  assert.equal(await page.locator('#websites .hm-copy').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await page.locator('#websites').evaluate(el=>getComputedStyle(el).position),'relative');
  await page.emulateMedia({reducedMotion:'no-preference'});await ready(page);
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(200);
  assert.ok(await page.locator('footer').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight+2),'Footer remains reachable');
  await page.emulateMedia({media:'print'});
  assert.equal(await page.locator('#websites .hm-copy').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);
  console.log(`✓ ${width}×${height}: synchronized ${isMobile?'mobile reading/transition':'desktop fade/depth/travel'} curves (no blank gaps); 76-frame anti-vibration sweep; reverse/idle; anchors/focus; SPA Back; reduced-motion/print/footer`);
 }
 for(const width of [390,1440]){
  const fallback=await browser.newPage({javaScriptEnabled:false,viewport:{width,height:1000}});
  await fallback.goto(origin+'/');assert.equal(await fallback.locator('.scene-deck,.motion-enter').count(),0);
  assert.equal(await fallback.locator('#websites .hm-copy').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await fallback.locator('.hm-panel').count(),12);
 }
 console.log('✓ No JavaScript: all eleven chapters remain readable on mobile and desktop');
}finally{await browser.close();}
