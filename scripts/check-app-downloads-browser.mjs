import assert from 'node:assert/strict';
import fs from 'node:fs';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const apps=JSON.parse(fs.readFileSync('assets/js/portfolio.projects.json')).filter(p=>p.categories.includes('apps'));
const apk='https://drive.google.com/file/d/1aMZrI_pVEF5nQMmvbquNJGIeG2kXNFWT/view?usp=sharing';
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
    assert.equal(await card.locator('.pf-history-description').textContent(),project.cardDescription);
    assert.equal(await card.locator('.pf-history-description').evaluate(el=>{const r=el.getBoundingClientRect(),c=el.closest('.pf-card').getBoundingClientRect();return r.left>=c.left+12&&r.right<=c.right-12&&el.scrollWidth<=el.clientWidth+1;}),true,project.id+' description fits');
    const summary=await card.locator('.pf-history-description').evaluate(el=>{const style=getComputedStyle(el);return{height:el.getBoundingClientRect().height,line:parseFloat(style.lineHeight),clamp:style.webkitLineClamp,overflow:style.overflow};});
    assert.equal(summary.clamp,'3');assert.equal(summary.overflow,'hidden');
    assert.ok(Math.abs(summary.height-summary.line*3)<1,project.id+' reserves exactly three description lines');
    if(!project.historical)for(const store of['App Store','Google Play']){
     const control=card.getByRole('button',{name:store+' — '+project.client+' (link not added yet)',exact:true});
     assert.equal(await control.isDisabled(),true);assert.equal(await control.locator('svg').count(),1);assert.equal(await control.getAttribute('href'),null);
    }
    assert.equal(await card.locator('.pf-store-links a').count(),project.apkUrl||project.androidReleaseUrl?1:0);
    if(project.apkUrl||project.androidReleaseUrl)assert.equal(await card.locator('.pf-action-bar').count(),0,'No separate download row');
    if(project.type==='coming-soon')assert.equal(await card.locator('a,button:not(:disabled)').count(),0);
    if(project.historical){assert.equal(await card.locator('.pf-card-info').evaluate(el=>el.querySelector('.pf-card-status').getBoundingClientRect().top>=el.querySelector('.pf-history-description').getBoundingClientRect().bottom),true,'Historical app label follows summary');assert.equal(await card.locator('.pf-app-downloads').count(),0);assert.ok((await card.textContent()).includes('2019'));continue;}
    const geometry=await card.locator('.pf-store-links').evaluate(el=>{const r=el.getBoundingClientRect();return [...el.children].every(c=>{const b=c.getBoundingClientRect();return b.left>=r.left-.5&&b.right<=r.right+.5&&Math.abs(b.top-r.top)<1&&Math.abs(b.bottom-r.bottom)<1&&b.height>=44&&c.scrollWidth<=c.clientWidth+1;});});assert.equal(geometry,true,project.id+' store controls fit');
   }
   const release=page.locator('[data-project="onescreen-business"]');
   assert.equal(await release.getByRole('link',{name:'Android release — OneScreen Business'}).getAttribute('href'),apps.find(p=>p.id==='onescreen-business').androidReleaseUrl);
   assert.equal(await release.locator('.pf-release-badge').count(),0);
   const find=page.locator('[data-project="lulafind"]');
   assert.equal(await find.getByRole('link',{name:'Download APK — LulaFind'}).getAttribute('href'),apk);
   assert.equal(await find.locator('.pf-card-status').textContent(),'Android APK');
   assert.ok(!/Coming soon|Pending Google Play review|source ZIP/i.test(await find.textContent()));
   await page.goto(origin+'/project/lulafind/');
   if(javaScriptEnabled)await page.locator('.site-back-to-top').waitFor({state:'attached'});
   assert.equal(await page.getByRole('link',{name:'Download Android APK — LulaFind'}).getAttribute('href'),apk);
   assert.equal(await page.locator('main .pf-store-links button:disabled').count(),2);
   assert.equal(await page.locator('main .pf-store-links .pf-apk-download').count(),1);
   assert.equal(await page.locator('main .pf-store-links').evaluate(el=>{const boxes=[...el.children].map(c=>c.getBoundingClientRect());return boxes.length===3&&boxes.every(r=>Math.abs(r.top-boxes[0].top)<1&&r.height>=44);}),true,'Detail download and stores share a row');
   assert.equal(await page.locator('main a[href$="main.zip"]').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.ok(!(await page.locator('main').textContent()).includes('Pending Google Play'));
   if(javaScriptEnabled&&width===1440)await page.screenshot({path:'/tmp/lulafind-apk-store-controls.png'});
   console.log('✓ LulaFind APK URL/status, no source-ZIP confusion, disabled stores on current apps, historical descriptions only, controls fit: '+width+'px; JS '+javaScriptEnabled);
  }
  await page.goto(origin+'/project/lunianetwork/');
  if(javaScriptEnabled)await page.locator('.site-back-to-top').waitFor({state:'attached'});
  assert.match(await page.locator('main').textContent(),/removed in 2024 because I was no longer updating it/);
  assert.equal(await page.locator('main .pf-app-downloads').count(),0);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
}
