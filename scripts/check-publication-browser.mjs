/** Optional browser check: start serve-publication.mjs on 3102 first. */
import assert from 'node:assert/strict';import fs from 'node:fs';import Chromium from '@sparticuz/chromium';import {chromium} from 'playwright-core';
const root=process.env.TEST_ORIGIN||'http://127.0.0.1:3102';const {publication,routes}=JSON.parse(fs.readFileSync('assets/js/publication.data.json','utf8'));
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});const page=await browser.newPage({permissions:['clipboard-read','clipboard-write'],viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith(root)?r.continue():r.abort());
for(const route of ['/','/about/','/contact/','/privacy/','/project/prodops/','/services/website-design/']){
 const response=await page.goto(root+route,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!document.querySelector('.site-back-to-top'));
 assert.equal(response.status(),200);const meta=routes[route.replace(/\/$/,'')||'/'];await page.waitForFunction(title=>document.title===title,meta.title);
 assert.equal(await page.locator('head meta[name="description"]').count(),1);assert.equal(await page.locator('head meta[property="og:title"]').getAttribute('content'),meta.title);assert.equal(await page.locator('head meta[name="robots"]').count(),1);
 if(publication.url){assert.equal(await page.locator('head link[rel="canonical"]').getAttribute('href'),publication.url+meta.canonical);assert.equal(await page.locator('head script[type="application/ld+json"]').count(),1);}
 else assert.equal(await page.locator('head link[rel="canonical"]').count(),0);
 assert.equal(await page.locator('main h1').count(),1);
 console.log('✓ Production HTML/runtime metadata: '+route);
}
await page.goto(root+'/about/',{waitUntil:'domcontentloaded'});assert.equal(await page.getByRole('link',{name:/Let’s work together/}).count(),0);
await page.goto(root+'/project/prodops/',{waitUntil:'domcontentloaded'});const request=page.getByRole('link',{name:'Request ProdOps'});const mail=new URL(await request.getAttribute('href'));assert.equal(mail.protocol,'mailto:');assert.equal(mail.searchParams.get('subject'),'Request ProdOps');assert.ok(mail.searchParams.get('body').includes('request access'));assert.equal(await page.locator('main a[href*="github.com"]').count(),0);
for(const width of [320,390,768,801,1024,1440]){
 await page.setViewportSize({width,height:900});await page.goto(root+'/',{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('footer a[href="tel:+27837195064"] .footer-icon-label').innerText(),'Call');assert.equal(await page.locator('#footer-call-options').count(),0);
 if(width>800){const size=await page.locator('.rhino-header-actions .rhino-contact').boundingBox();assert.ok(size.height<=54.5,JSON.stringify(size));assert.ok(size.width<=188);}
 console.log('✓ Reduced card/direct Call responsive: '+width+'px');
}
await page.goto(root+'/project/prompt-service-provider-app/',{waitUntil:'domcontentloaded'});
assert.equal(await page.locator('main img').first().evaluate(image=>!image.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true}))),true);
assert.equal(await page.locator('main img').first().evaluate(image=>!image.dispatchEvent(new Event('dragstart',{bubbles:true,cancelable:true}))),true);
assert.equal(await page.locator('.owner-prompt pre').evaluate(el=>el.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true}))),true);
await page.getByRole('button',{name:'Copy prompt'}).click();await page.getByText('Prompt copied.',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),await page.locator('.owner-prompt pre').innerText());
console.log('✓ Image deterrents only; free prompt copying remains available');
await page.goto(root+'/contact/',{waitUntil:'domcontentloaded'});await page.locator('.site-back-to-top').waitFor({state:'attached'});await page.getByRole('button',{name:'Send an enquiry',exact:true}).click();const form=page.locator('#footer-enquiry form');let sent=0;
await page.route('https://formspree.io/f/xvkgqalq',async route=>{sent++;assert.equal(route.request().method(),'POST');assert.ok(route.request().postData().includes('Test Person'));await route.fulfill({status:sent===1?500:200,contentType:'application/json',body:sent===1?'{}':'{"ok":true}'});});
await form.getByLabel('Your name').fill('Test Person');await form.getByLabel('Email address').fill('test@example.com');await form.getByLabel('What do you have in mind?').fill('A mocked production form regression test.');await form.getByRole('button',{name:'Send enquiry'}).click();await form.getByRole('alert').waitFor();assert.equal(await form.getByLabel('Your name').inputValue(),'Test Person');await form.getByRole('button',{name:'Send enquiry'}).click();await page.locator('#footer-enquiry .enquiry-success').waitFor();assert.equal(sent,2);
console.log('✓ Contact Formspree error/retry/success states, no real message sent');
const response=await page.goto(root+'/this-page-does-not-exist/',{waitUntil:'domcontentloaded'});assert.equal(response.status(),404);await page.getByRole('heading',{name:'Let’s get you back on track.'}).waitFor();assert.ok((await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'));
assert.deepEqual(errors,[]);console.log('✓ True HTTP 404, no runtime errors under production CSP');await browser.close();
