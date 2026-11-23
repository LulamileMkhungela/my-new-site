import assert from 'node:assert/strict';
import fs from 'node:fs';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const apps=JSON.parse(fs.readFileSync('assets/js/portfolio.projects.json')).filter(p=>p.categories.includes('apps'));
const apk='https://github.com/LulamileMkhungela/LulaFind/releases/download/apk-latest/LulaFind.apk';
for(const javaScriptEnabled of[true,false]){
 const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath(),headless:true});
 try{
  const page=await browser.newPage({javaScriptEnabled,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
  for(const width of[320,390,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(origin+'/portfolio/?filter=apps');
   if(javaScriptEnabled)await page.locator('.site-back-to-top').waitFor({state:'attached'});
   for(const project of apps){
    const card=page.locator('.pf-card[data-project="'+project.id+'"]');
    for(const store of['App Store','Google Play']){
     const control=card.getByRole('button',{name:store+' — '+project.client+' (link not added yet)',exact:true});
     assert.equal(await control.isDisabled(),true);assert.equal(await control.locator('svg').count(),1);assert.equal(await control.getAttribute('href'),null);
    }
    assert.equal(await card.locator('.pf-store-links a').count(),0);
    if(project.type==='coming-soon')assert.equal(await card.locator('a,button:not(:disabled)').count(),0);
    const geometry=await card.locator('.pf-store-links').evaluate(el=>{const r=el.getBoundingClientRect();return [...el.children].every(c=>{const b=c.getBoundingClientRect();return b.left>=r.left-.5&&b.right<=r.right+.5&&b.height>=44&&c.scrollWidth<=c.clientWidth+1;});});assert.equal(geometry,true,project.id+' store controls fit');
   }
   const find=page.locator('[data-project="lulafind"]');
   assert.equal(await find.getByRole('link',{name:'Download APK — LulaFind'}).getAttribute('href'),apk);
   assert.equal(await find.locator('.pf-card-status').textContent(),'Android APK');
   assert.ok(!/Coming soon|Pending Google Play review|source ZIP/i.test(await find.textContent()));
   await page.goto(origin+'/project/lulafind/');
   if(javaScriptEnabled)await page.locator('.site-back-to-top').waitFor({state:'attached'});
   assert.equal(await page.getByRole('link',{name:'Download Android APK — LulaFind'}).getAttribute('href'),apk);
   assert.equal(await page.locator('main .pf-store-links button:disabled').count(),2);
   assert.equal(await page.locator('main a[href$="main.zip"]').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.ok(!(await page.locator('main').textContent()).includes('Pending Google Play'));
   if(javaScriptEnabled&&width===1440)await page.screenshot({path:'/tmp/lulafind-apk-store-controls.png'});
   console.log('✓ LulaFind APK URL/status, no source-ZIP confusion, disabled App Store/Google Play on all six app projects, controls fit: '+width+'px; JS '+javaScriptEnabled);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
}
