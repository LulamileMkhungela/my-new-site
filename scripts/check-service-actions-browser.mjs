import assert from 'node:assert/strict';
import fs from 'node:fs';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const services=JSON.parse(fs.readFileSync('assets/js/services.catalogue.json')).services;
const strategies=JSON.parse(fs.readFileSync('assets/js/strategy.services.json'));
const routes=[...services.map(s=>'/services/'+s.slug),...strategies.map(s=>s.path)];
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath()});
try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:1000});
  for(const route of routes){
   await page.goto(origin+route+'/');
   await page.waitForFunction(()=>document.documentElement.dataset.routeReady===location.pathname+location.search+location.hash);
   await page.evaluate(()=>document.fonts.ready);
   const actions=page.locator('#service-contact .studio-actions');
   const links=await actions.locator(':scope > a').evaluateAll(els=>els.map(el=>{
    const box=el.getBoundingClientRect(),range=document.createRange();range.selectNode(el.firstChild);
    const text=range.getBoundingClientRect(),style=getComputedStyle(el);
    return {top:box.top,height:box.height,left:box.left,right:box.right,textCenter:text.top+text.height/2,marginTop:style.marginTop,href:el.getAttribute('href')};
   }));
   assert.equal(links.length,3,route);
   assert.deepEqual(links.map(l=>l.href),['/contact','#service-intro','/services']);
   for(const link of links){
    assert.equal(link.marginTop,'0px',route+' action row must not inherit standalone back-link margin');
    assert.equal(link.height,48,route+' links have equal 48px targets');
    assert.ok(link.left>=23&&link.right<=width-23,route+' safe gutters');
   }
   for(let i=0;i<links.length;i++)for(let j=i+1;j<links.length;j++){
    if(Math.abs(links[i].top-links[j].top)<1)assert.ok(Math.abs(links[i].textCenter-links[j].textCenter)<.5,route+' text aligns within each wrapped row');
   }
   if(width>=1440)assert.ok(links.every(l=>Math.abs(l.top-links[0].top)<.5),route+' all three actions align on desktop');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' no overflow');
  }
  console.log(`✓ All ${routes.length} service pages: Discuss/Back/My Services aligned, equal targets, mobile wrapping and safe gutters at ${width}px`);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
