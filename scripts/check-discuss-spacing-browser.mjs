import assert from 'node:assert/strict';
import fs from 'node:fs';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const serviceRoutes=Object.keys(JSON.parse(fs.readFileSync('assets/js/publication.data.json')).routes).filter(r=>r.startsWith('/services/'));
// Check the actual no-JS/prerendered hrefs too, not just React navigation.
for(const route of [...serviceRoutes,'/portfolio']){
 const html=fs.readFileSync('.'+route+'/index.html','utf8');
 const links=[...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter(m=>m[2].replace(/<[^>]*>/g,'').trim().startsWith('Discuss'));
 assert.ok(links.length,route);for(const link of links)assert.match(link[1],/href="\/contact"/,route);
}
const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath(),headless:true});
try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
 for(const width of(process.env.TEST_WIDTHS||'320,390,768,1440').split(',').map(Number)){
  await page.setViewportSize({width,height:900});
  for(const route of serviceRoutes){
   // Exercise all three positions, including the CTA below the final chapter.
   for(let i=0;i<3;i++){
    await page.goto(origin+route);await page.locator('.site-back-to-top').waitFor({state:'attached'});
    const link=page.locator('main a').filter({hasText:/^Discuss/}).nth(i);
    await link.scrollIntoViewIfNeeded();await link.click();await page.waitForURL('**/contact');
    await page.waitForTimeout(180);
    const result=await page.evaluate(()=>({scroll:scrollY,title:document.querySelector('main h1').getBoundingClientRect().top,header:document.querySelector('header').getBoundingClientRect().bottom}));
    assert.ok(result.scroll<=1&&result.title>result.header,route+' CTA '+i+': '+JSON.stringify(result));
   }
  }
  for(const route of['/about','/contact','/services/website-design','/portfolio']){
   await page.goto(origin+route);await page.locator('.site-back-to-top').waitFor({state:'attached'});
   const panels=await page.locator('.unified-about-grid>div,section.unified-about-copy,.contact-intro-copy,.contact-next-copy,.studio-copy,.pf-hero-copy').evaluateAll(els=>els.map(el=>{
    const box=el.getBoundingClientRect(),s=getComputedStyle(el);
    return{class:el.className,left:box.left,right:innerWidth-box.right,padding:parseFloat(s.paddingLeft),children:[...el.children].filter(c=>getComputedStyle(c).position!=='absolute').map(c=>{const r=c.getBoundingClientRect();return{left:r.left-box.left,right:box.right-r.right}})};
   }));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route);
   for(const panel of panels){assert.ok(panel.left>=19&&panel.right>=19&&panel.padding>=19,JSON.stringify(panel));for(const c of panel.children)assert.ok(c.left>=18&&c.right>=18,JSON.stringify(panel));}
   if(route==='/contact'){
    await page.locator('a[href="#contact-next"]').first().click();await page.waitForTimeout(180);
    assert.ok(await page.locator('#contact-next').evaluate(el=>el.getBoundingClientRect().top>=document.querySelector('header').getBoundingClientRect().bottom+20),'Anchor must clear sticky header');
    const steps=await page.locator('.contact-steps article').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().toJSON()));
    assert.ok(steps[1].top-steps[0].bottom>=15&&steps[2].top-steps[1].bottom>=15);
   }
   if(width===1440&&route==='/about')await page.screenshot({path:'/tmp/about-insets-fixed.png',fullPage:true});
   if(width===390&&route==='/contact')await page.screenshot({path:'/tmp/contact-insets-fixed.png',fullPage:true});
  }
  console.log('✓ Every service Discuss CTA opens Contact at top; About/Contact/service/Portfolio insets and anchor offsets: '+width+'px');
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
