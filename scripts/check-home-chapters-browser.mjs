import assert from 'node:assert/strict';
import fs from 'node:fs';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const expected=JSON.parse(fs.readFileSync('assets/js/site.content.json')).testimonials;
for(const javaScriptEnabled of [true,false]){
 const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath(),headless:true});
 try{
  const page=await browser.newPage({javaScriptEnabled,reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
  for(const width of[320,390,768,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(origin+'/');
   if(javaScriptEnabled)await page.locator('.site-back-to-top').waitFor({state:'attached'});
   const nav=page.getByRole('navigation',{name:'Home sections'}),links=nav.getByRole('link');
   assert.equal(await links.count(),11);
   assert.ok((await page.locator('#home').textContent()).includes('Devzigner / Design + Frontend Development'));
   const surfaces=await page.locator('.hm-copy').evaluateAll(els=>els.map(el=>({sheet:getComputedStyle(el,'::after').content,background:getComputedStyle(el).backgroundColor,shadow:getComputedStyle(el).boxShadow,padding:getComputedStyle(el).paddingLeft,left:el.getBoundingClientRect().left})));
   for(const surface of surfaces){assert.equal(surface.sheet,'none');assert.equal(surface.background,'rgba(0, 0, 0, 0)');assert.equal(surface.shadow,'none');assert.equal(surface.padding,'0px');assert.ok(surface.left>=23,'Retain page gutters without cards');}
   assert.equal(await links.first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)','Current number is not a card');
   assert.equal(await page.locator('.hm-chapter-rail').evaluate(el=>getComputedStyle(el).borderTopWidth),'0px');
   let previous=0;
   for(let i=0;i<11;i++){
    const link=links.nth(i),target=await link.getAttribute('href');
    await link.click();
    if(javaScriptEnabled)await page.waitForFunction(id=>document.querySelector('.hm-chapter-rail a[aria-current="location"]')?.getAttribute('href')===id,target);
    else await page.waitForTimeout(100);
    const bounds=await page.locator(target).boundingBox(),header=await page.locator('header').boundingBox();
    assert.ok(bounds.y>=header.height-1&&bounds.y<=header.height+30,target+' visible below header: '+bounds.y);
    if(javaScriptEnabled){
     assert.equal(await link.getAttribute('aria-current'),'location',target);
     const progress=Number(await page.getByRole('progressbar',{name:'Page scroll progress'}).getAttribute('aria-valuenow'));
     assert.ok(progress>=previous&&progress<=100);previous=progress;
    }
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(javaScriptEnabled){
    const track=page.locator('#hm-testimonial-track');
    assert.equal(await page.getByRole('button',{name:'Previous testimonial',exact:true}).isDisabled(),true);
    const shown=await track.evaluate(el=>{const r=el.getBoundingClientRect();return [...el.children].filter(c=>{const b=c.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1;}).length;});
    assert.equal(shown,width<=700?1:2);
    await page.getByRole('button',{name:'Next testimonial',exact:true}).click();
    await page.waitForFunction(()=>document.getElementById('hm-testimonial-track').scrollLeft>10);
    await page.waitForTimeout(70);assert.equal(await page.getByRole('button',{name:'Previous testimonial',exact:true}).isEnabled(),true);
    await track.focus();await page.keyboard.press('End');await page.waitForTimeout(70);
    assert.equal(await page.getByRole('button',{name:'Next testimonial',exact:true}).isDisabled(),true);
    await page.keyboard.press('Home');await page.waitForTimeout(70);
    const details=page.locator('.hm-testimonial-card').first().locator('details');
    await details.locator('summary').click();assert.ok(await details.getAttribute('open')!==null);
    assert.equal(await details.locator('blockquote').textContent(),expected[0].message);
    await details.locator('summary').click();
    assert.deepEqual(await page.locator('#testimonials blockquote').allTextContents(),expected.map(p=>p.message));
    await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(100);
    assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'),'100');
    const footerLink=await page.locator('.footer-privacy').boundingBox(),rail=await page.locator('.hm-chapter-rail').boundingBox();assert.ok(footerLink.y+footerLink.height<rail.y,'Footer must not be obscured');
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(100);
    assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'),'0');
    assert.equal(await links.first().getAttribute('aria-current'),'location');
    await links.last().click();
    if(width===1440||width===390)await page.screenshot({path:'/tmp/home-testimonials-'+width+'.png'});
   }else{
    const note=page.locator('.hm-testimonial-card').first().locator('details');await note.locator('summary').click();assert.equal(await note.locator('blockquote').isVisible(),true);
   }
   console.log('✓ 11 chapter links, sticky-header clearance, no overflow'+(javaScriptEnabled?', active chapter/progress 0–100%, carousel/card count, keyboard and full quotes':' and native anchors/full quote fallback')+': '+width+'px; JS '+javaScriptEnabled);
  }
  if(javaScriptEnabled){
   // Natural scrolling, independent of the clicked hash, must move the active number.
   await page.evaluate(()=>window.scrollTo({top:document.getElementById('home-portfolio').getBoundingClientRect().top+window.scrollY+100,behavior:'instant'}));
   await page.waitForFunction(()=>document.querySelector('.hm-chapter-rail a[aria-current="location"]')?.getAttribute('href')==='#home-portfolio');
   await page.emulateMedia({reducedMotion:'no-preference'});
   await page.locator('.hm-chapter-rail a').last().click();
   await page.getByRole('button',{name:'Next testimonial',exact:true}).click();
   await page.waitForFunction(()=>document.getElementById('hm-testimonial-track').scrollLeft>100);
   await page.goto(origin+'/contact');assert.equal(await page.locator('.hm-chapter-rail').count(),0);
   console.log('✓ Natural scrolling changes the active chapter; normal-motion carousel; Home rail removed on Contact');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
}
