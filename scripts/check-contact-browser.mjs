import assert from 'node:assert/strict';import Chromium from '@sparticuz/chromium';import {chromium} from 'playwright-core';
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:3000')?r.continue():r.abort());
for(const width of [320,375,768,801,1024,1440]){
 await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:3000/portfolio/',{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});
 await page.getByRole('link',{name:'Discuss your project'}).click();await page.waitForURL('**/contact');await page.waitForLoadState('networkidle');await page.locator('#contact-intro').waitFor();await page.waitForFunction(()=>{const el=document.querySelector('.contact-intro-copy');return el&&getComputedStyle(el).opacity==='1'});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('main h1').count(),1);assert.ok(await page.locator('#contact-intro img').evaluate(async img=>{await img.decode();return img.naturalWidth>0}));
 assert.equal(await page.locator('main a[href="tel:+27837195064"]').count(),1);assert.equal(await page.locator('main a[href="mailto:mkhungela.l@gmail.com"]').count(),1);assert.equal(await page.locator('.contact-steps article').count(),3);
 if(width>800){const button=page.getByRole('button',{name:'About and contact links'});await button.click();await page.locator('#rhino-about-links').evaluate(async el=>{await Promise.all(el.getAnimations().map(animation=>animation.finished.catch(()=>{})));});await page.locator('#rhino-about-links').getByRole('link',{name:'Contact'}).click();assert.equal(await button.getAttribute('aria-expanded'),'false');await button.click();await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');await button.click();await page.locator('main h1').click();assert.equal(await button.getAttribute('aria-expanded'),'false');}
 else {await page.getByRole('button',{name:'Open navigation'}).click();await page.locator('#rhino-mobile-menu').evaluate(async el=>{await Promise.all(el.getAnimations().map(animation=>animation.finished.catch(()=>{})));});await page.locator('#rhino-mobile-menu').getByRole('link',{name:'Contact',exact:true}).click();assert.equal(await page.locator('#rhino-mobile-menu').count(),0);}
 await page.locator('#contact-next').scrollIntoViewIfNeeded();await page.locator('.contact-next-visual img').waitFor();
 await page.waitForFunction(()=>{const img=document.querySelector('.contact-next-visual img');return img.complete&&img.naturalWidth>0});
 const visual=await page.locator('.contact-next-visual').boundingBox(),copy=await page.locator('.contact-next-copy').boundingBox();
 if(width>800)assert.ok(visual.x+visual.width<=copy.x,'Next-step artwork must be left of copy');
 else assert.ok(visual.y<copy.y,'Next-step artwork stacks before copy');
 assert.deepEqual(await page.locator('#contact-next-title>span').allTextContents(),['I listen.','We define.','We build.']);
 const steps=await page.locator('.contact-steps article').all();const boxes=await Promise.all(steps.map(step=>step.boundingBox()));assert.ok(boxes[0].y<boxes[1].y&&boxes[1].y<boxes[2].y,'Steps must be vertical');
 assert.equal(await page.locator('.contact-next-watermark').textContent(),'NEXT STEP');
 assert.equal(await page.locator('#contact-next .contact-title-outline').evaluate(el=>getComputedStyle(el).webkitTextFillColor==='rgba(0, 0, 0, 0)'||getComputedStyle(el).color==='rgba(0, 0, 0, 0)'),true);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(width===1440)await page.screenshot({path:'/tmp/contact-next-layout.png'});
 console.log('✓ Contact and screenshot-specific next-step layout: '+width+'px');
}
await page.screenshot({path:'/tmp/contact-page.png',fullPage:true});
assert.equal(await page.locator('#contact-enquiry,.unified-footer-top').count(),0);assert.equal(await page.locator('main section').count(),2);await page.getByRole('button',{name:'Send an enquiry',exact:true}).click();await page.locator('#footer-enquiry').waitFor({state:'visible'});const form=page.locator('#footer-enquiry form');let count=0;await page.route('https://formspree.io/f/xvkgqalq',r=>{count++;return r.fulfill({status:count===1?500:200,contentType:'application/json',body:'{}'});});
await form.getByLabel('Your name').fill('Contact test');await form.getByLabel('Email address').fill('test@example.com');await form.getByLabel('What do you have in mind?').fill('Mock submission only.');await form.getByRole('button',{name:'Send enquiry'}).click();await form.getByRole('alert').waitFor();await form.getByRole('button',{name:'Send enquiry'}).click();await page.locator('#footer-enquiry .enquiry-success').waitFor();assert.equal(count,2);assert.deepEqual(errors,[]);console.log('✓ Form mock error/retry/success; no real enquiry sent; no runtime errors');await browser.close();
