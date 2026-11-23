import assert from 'node:assert/strict';
import fs from 'node:fs';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const ids=['ai-lifeos','nerdma','lulagazette','prompt-delivery-app','foodiezone'];
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath(),headless:true});
try{
 const page=await browser.newPage({reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
 for(const width of[320,390,768,1024,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(origin+'/#home-portfolio');
  await page.locator('.site-back-to-top').waitFor({state:'attached'});
  const section=page.locator('#home-portfolio'),cards=section.locator('.pf-card');
  assert.deepEqual(await cards.evaluateAll(els=>els.map(el=>el.dataset.project)),ids);
  assert.equal(await section.locator('[data-project="lulagazette"] .pf-card-status').textContent(),'Personal Web project');
  assert.equal(await section.locator('[data-project="prompt-delivery-app"] .pf-card-status').count(),0);
  assert.equal(await section.locator('[data-project="ai-lifeos"] .pf-store-links button:disabled').count(),2);
  await page.waitForFunction(()=>document.querySelector('.hm-chapter-rail a[aria-current="location"]')?.getAttribute('href')==='#home-portfolio');
  const layout=await section.locator('.hm-project-previews').evaluate(el=>{
   const r=el.getBoundingClientRect(),cards=[...el.children].map(card=>{
    const b=card.getBoundingClientRect(),img=card.querySelector('.pf-card-art').getBoundingClientRect(),info=card.querySelector('.pf-card-info').getBoundingClientRect(),action=card.querySelector('.pf-action-bar,.pf-copy-prompt,.pf-store-links').getBoundingClientRect();
    const style=getComputedStyle(card);
    return{background:style.backgroundColor,shadow:style.boxShadow,border:style.borderTopWidth,radius:style.borderRadius,left:b.left,right:b.right,top:b.top,padding:img.left-b.left,imageBottom:img.bottom,infoTop:info.top,infoBottom:info.bottom,actionTop:action.top,actionBottom:action.bottom,bottom:b.bottom};
   });return{left:r.left,right:innerWidth-r.right,visible:cards.filter(c=>c.left>=r.left-1&&c.right<=r.right+1).length,cards};
  });
  assert.ok(layout.left>=23&&layout.right>=23);
  for(const card of layout.cards){assert.ok(card.padding>=12.5);assert.equal(card.background,'rgba(0, 0, 0, 0)');assert.equal(card.shadow,'none');assert.equal(card.border,'1px');assert.equal(card.radius,'0px');assert.ok(card.infoTop>=card.imageBottom-.5&&card.actionTop>=card.infoBottom-.5);assert.ok(card.bottom-card.actionBottom>=7.5);assert.ok(Math.abs(card.top-layout.cards[0].top)<1);}
  if(width>900)assert.equal(layout.visible,5);else assert.ok(layout.visible>=1);
  assert.equal(await section.locator('[data-project="ai-lifeos"] a,[data-project="ai-lifeos"] button:not(:disabled)').count(),0);
  assert.equal(await section.locator('[data-project="ai-lifeos"] .pf-action-unavailable').textContent(),'Coming soon');
  assert.equal(await section.locator('[data-project="nerdma"] a').getAttribute('href'),'https://www.nerdma.co.za');
  assert.equal(await section.locator('[data-project="lulagazette"] a').getAttribute('href'),'https://lulamilemkhungela.github.io/LulaGazette/');
  assert.equal(await section.locator('[data-project="foodiezone"] a').getAttribute('href'),'https://loux91.github.io/foodiezone/');
  const delivery=section.locator('[data-project="prompt-delivery-app"]');
  assert.equal(await delivery.locator('a').count(),0);const url=page.url();await delivery.getByRole('button').click();await delivery.getByRole('status').filter({hasText:'Prompt copied.'}).waitFor();
  const prompt=JSON.parse(fs.readFileSync('assets/js/portfolio.projects.json')).find(p=>p.id===ids[3]).details.prompt;
  assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),prompt);assert.equal(page.url(),url);
  assert.equal(await delivery.locator('img').getAttribute('src'),'/assets/img/portfolio/prompt-delivery-app.jpg');
  assert.equal(await delivery.locator('h3').textContent(),'Delivery App');
  await page.waitForFunction(()=>document.querySelector('#home-portfolio [data-project="prompt-delivery-app"] .pf-copy-status').textContent==='',{},{timeout:3000});
  assert.equal(await delivery.getByRole('button').textContent(),'Copy prompt');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(width===1440){await section.locator('.hm-project-previews img').evaluateAll(async imgs=>{for(const img of imgs)img.loading='eager';await Promise.all(imgs.map(img=>img.decode().catch(()=>{})));});await page.screenshot({path:'/tmp/home-five-selected-projects.png'});}
  console.log('✓ Home 08: five requested projects in order, thumbnail/name/details/action order, safe gutters, correct links/coming-soon and inline delivery prompt: '+width+'px');
 }
 for(const id of['nerdma','foodiezone','lulagazette']){const link=page.locator('#home-portfolio [data-project="'+id+'"] a');assert.equal(await link.getAttribute('target'),'_blank');assert.equal(await link.locator('.pf-action-bar').textContent(),'Visit site');}
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
