import assert from 'node:assert/strict';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath()});
try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['about','contact']){
   await page.goto(origin+'/'+route+'/');
   await page.waitForFunction(()=>document.documentElement.dataset.routeReady===location.pathname);
   await page.evaluate(()=>document.fonts.ready);
   const main=page.locator('main'),social=main.getByRole('navigation',{name:'Social media'});
   assert.equal(await social.count(),1);
   const linkedin=social.getByRole('link',{name:'LinkedIn — opens in a new tab'});
   assert.equal(await linkedin.getAttribute('href'),'https://www.linkedin.com/in/lulamile-mkhungela/');
   assert.equal(await linkedin.getAttribute('rel'),'noopener noreferrer');
   for(const name of ['Facebook','Instagram']){
    const button=social.getByRole('button',{name:name+' — profile link not added yet'});
    assert.ok(await button.isDisabled());assert.equal(await button.locator('svg path').count()>0,true);
   }
   for(const control of await social.locator('a,button').all()){
    const box=await control.boundingBox();assert.ok(box.height>=44&&box.width>=44);
   }
   const text=await main.innerText();
   assert.doesNotMatch(text,/Gojo|iOCO|Vodacom|Toyota|Figma|React|Angular|employment|curriculum vitae/i);
   assert.match(text,/design|creative/i);assert.match(text,/develop|systems/i);
   if(route==='about'){
    assert.match(text,/from the first conversation to the finished experience/i);
    assert.match(text,/worldwide/i);
   }else{
    assert.match(await main.locator('h1').innerText(),/YOUR DIGITAL PARTNER\.\s*WHEREVER YOU WORK\./);
    assert.match(text,/your time zone/);assert.equal(await main.locator(':scope > section').count(),2);
    assert.equal(await main.locator('form').count(),0);
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow at '+width);
   if(width===390||width===1440)await page.screenshot({path:'/tmp/'+route+'-client-focused-'+width+'.png'});
  }
  console.log(`✓ ${width}px: client-focused About/Contact, worldwide copy, social icons/confirmed links, touch targets and no overflow`);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
