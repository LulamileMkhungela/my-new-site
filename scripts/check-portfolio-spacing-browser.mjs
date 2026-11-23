import assert from 'node:assert/strict';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
for(const javaScriptEnabled of [true,false]){
 const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath(),headless:true});
 try{
  const page=await browser.newPage({javaScriptEnabled,reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
  for(const width of[320,390,768,1024,1120,1440]){
   await page.setViewportSize({width,height:1000});
   // Default prerender contains every category, including both prompt rows.
   await page.goto(origin+'/portfolio/');
   if(javaScriptEnabled)await page.locator('.site-back-to-top').waitFor({state:'attached'});
   await page.evaluate(()=>document.fonts.ready);
   const report=await page.locator('.pf-card').evaluateAll(cards=>cards.map(card=>{
    const r=card.getBoundingClientRect(),title=card.querySelector('h3'),t=title.getBoundingClientRect(),action=card.querySelector('.pf-action-bar,.pf-copy-prompt'),a=action.getBoundingClientRect(),image=card.querySelector('.pf-card-art').getBoundingClientRect();
    const metadata=[...card.querySelectorAll('.pf-platforms,.pf-card-status,.pf-copy-status')].filter(el=>el.textContent.trim());
    const bottom=metadata.length?metadata.at(-1).getBoundingClientRect().bottom:t.bottom;
    return{id:card.dataset.project,imageInset:Math.min(image.left-r.left,r.right-image.right,image.top-r.top),actionInset:Math.min(a.left-r.left,r.right-a.right),titleInset:Math.min(t.left-r.left,r.right-t.right),titleGap:t.top-a.bottom,bottomInset:r.bottom-bottom,titleClipped:title.scrollWidth>title.clientWidth+1||title.scrollHeight>title.clientHeight+1,actionHeight:a.height};
   }));
   for(const card of report){
    for(const key of['imageInset','actionInset','titleInset','bottomInset'])assert.ok(card[key]>=11.5,card.id+' '+key+': '+JSON.stringify(card));
    assert.ok(card.titleGap>=15,JSON.stringify(card));assert.ok(card.actionHeight>=44,card.id);assert.equal(card.titleClipped,false,card.id);
   }
   const tracks=await page.locator('.pf-grid').evaluateAll(grids=>grids.map(el=>{
    const r=el.getBoundingClientRect(),cards=[...el.children].map(card=>card.getBoundingClientRect());
    return{left:r.left,right:innerWidth-r.right,total:cards.length,visible:cards.filter(c=>c.left>=r.left-1&&c.right<=r.right+1).length,singleRow:cards.every(c=>Math.abs(c.top-cards[0].top)<1)};
   }));
   for(const track of tracks){assert.ok(track.left>=23&&track.right>=23);assert.equal(track.singleRow,true);if(width>900)assert.equal(track.visible,Math.min(5,track.total));}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('.pf-grid').first().evaluate(el=>el.scrollLeft=el.scrollWidth);
   assert.ok(await page.locator('.pf-grid').first().evaluate(el=>el.lastElementChild.getBoundingClientRect().right<=el.getBoundingClientRect().right-3),'Last card must have track inset');
   if(javaScriptEnabled&&(width===1120||width===390)){
    await page.goto(origin+'/portfolio/?filter=ai-prompt#pf-premium-title');
    await page.waitForFunction(()=>document.querySelectorAll('.pf-category-section').length===1);
    await page.waitForFunction(()=>{const y=document.getElementById('pf-premium-title').getBoundingClientRect().top,h=document.querySelector('header').getBoundingClientRect().bottom;return y>=h&&y<h+40;});
    await page.locator('.pf-prompt-group img').evaluateAll(async imgs=>{for(const img of imgs)img.loading='eager';await Promise.all(imgs.map(img=>img.decode().catch(()=>{})));});
    await page.waitForTimeout(250);
    await page.screenshot({path:'/tmp/portfolio-spacing-'+width+'.png'});
   }
   console.log('✓ Portfolio cards: image/action/title/metadata insets, full wrapping names, action gaps, one row, desktop five-across and no page overflow: '+width+'px; JS '+javaScriptEnabled);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
}
