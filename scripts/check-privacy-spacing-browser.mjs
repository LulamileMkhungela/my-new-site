import assert from 'node:assert/strict';
import C from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
for(const javaScriptEnabled of[true,false]){
 const browser=await chromium.launch({args:C.args,executablePath:await C.executablePath(),headless:true});
 try{
  const page=await browser.newPage({javaScriptEnabled,reducedMotion:'reduce'});
  await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
  for(const width of[320,390,768,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(origin+'/privacy/',{waitUntil:'load'});
   if(javaScriptEnabled)await page.locator('.site-back-to-top').waitFor({state:'attached'});
   const result=await page.locator('.privacy-article').evaluate(article=>{
    const a=article.getBoundingClientRect(),s=getComputedStyle(article),children=[...article.children].map(child=>child.getBoundingClientRect());
    return{overflow:document.documentElement.scrollWidth>innerWidth,left:a.left,right:innerWidth-a.right,paddingLeft:parseFloat(s.paddingLeft),paddingRight:parseFloat(s.paddingRight),topInset:children[0].top-a.top,bottomInset:a.bottom-children.at(-1).bottom,minInset:Math.min(...children.flatMap(r=>[r.left-a.left,a.right-r.right])),headerGap:a.top-document.querySelector('header').getBoundingClientRect().bottom,footerGap:document.querySelector('footer').getBoundingClientRect().top-a.bottom,titleGap:article.querySelector('h2').getBoundingClientRect().top-article.querySelector('h1').getBoundingClientRect().bottom};
   });
   assert.equal(result.overflow,false);assert.ok(result.left>=23&&result.right>=23,JSON.stringify(result));
   assert.ok(result.paddingLeft>=20&&result.paddingRight>=20);assert.ok(result.topInset>=27&&result.bottomInset>=27);
   assert.ok(result.minInset>=19.5,JSON.stringify(result));assert.ok(result.headerGap>=23&&result.footerGap>=23,JSON.stringify(result));assert.ok(result.titleGap>=31,JSON.stringify(result));
   if(javaScriptEnabled&&width===1440)await page.screenshot({path:'/tmp/privacy-spacing-fixed.png'});
   console.log('✓ Privacy panel inner/outer gutters, heading spacing, no overflow: '+width+'px; JS '+javaScriptEnabled);
  }
 }finally{await browser.close();}
}
