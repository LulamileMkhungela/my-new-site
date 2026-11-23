import assert from 'node:assert/strict';import fs from 'node:fs';import Chromium from '@sparticuz/chromium';import {chromium} from 'playwright-core';
const projects=JSON.parse(fs.readFileSync('assets/js/portfolio.projects.json','utf8'));
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});const page=await browser.newPage({permissions:['clipboard-read','clipboard-write']});await page.emulateMedia({reducedMotion:'reduce'});await page.clock.install();const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:3000')?r.continue():r.abort());
for(const width of [320,1440]){
 await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:3000/portfolio/?filter=ai-prompt',{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});const url=page.url();
 for(const project of projects.filter(p=>p.promptTier==='free')){
  const card=page.locator(`[data-project="${project.id}"]`);assert.equal(await card.locator('a,.pf-open-icon,.pf-view-label').count(),0);
  await card.getByRole('button',{name:'Copy prompt — '+project.client}).click();await card.getByRole('status').filter({hasText:'Prompt copied.'}).waitFor();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),project.details.prompt);assert.equal(page.url(),url);
  await card.locator('.pf-card-art').click();assert.equal(page.url(),url);
 }
 for(const project of projects.filter(p=>p.promptTier==='premium')){const link=page.locator(`[data-project="${project.id}"] a`);assert.equal(await link.getAttribute('href'),'https://selar.com/m/le-loux');assert.equal(await link.getAttribute('target'),'_blank');}
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));console.log('✓ Six free prompts copy in-place with no links/arrows; five premium cards point to Selar at '+width+'px');
}
// Denied modern API still copies through the selection fallback.
await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{value:async()=>{throw new Error('Denied')},configurable:true}));
const card=page.locator('[data-project="prompt-service-provider-app"]'),prompt=projects.find(p=>p.id==='prompt-service-provider-app').details.prompt;
await card.getByRole('button').focus();await page.keyboard.press('Enter');await card.getByRole('status').filter({hasText:'Prompt copied.'}).waitFor();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),prompt);
assert.equal(await card.getByRole('button').evaluate(el=>el===document.activeElement),true);
console.log('✓ Denied Clipboard API copies via selection fallback and restores keyboard focus');
await page.evaluate(()=>{window.originalExecCommand=document.execCommand;document.execCommand=()=>false;});
await card.getByRole('button').click();await card.locator('.pf-copy-fallback').waitFor();assert.equal(await card.locator('.pf-copy-fallback').textContent(),prompt);assert.equal(await card.locator('.pf-copy-fallback').evaluate(el=>getComputedStyle(el).userSelect),'text');assert.ok(!(await card.getByRole('status').innerText()).includes('Prompt copied.'));
await page.clock.fastForward(2200);assert.ok((await card.getByRole('status').innerText()).includes('Copy unavailable'));assert.equal(await card.locator('.pf-copy-fallback').isVisible(),true);
console.log('✓ Both clipboard methods blocked: no false success; selectable manual fallback stays visible after two seconds');
// Real Permissions Policy restriction in an iframe, matching embedded previews.
await page.goto('http://127.0.0.1:3000/portfolio/?filter=ai-prompt',{waitUntil:'load'});
await page.setContent(`<iframe title="Embedded portfolio" src="http://127.0.0.1:3000/portfolio/?filter=ai-prompt" allow="clipboard-write 'none'; clipboard-read 'none'" style="width:100%;height:850px"></iframe>`);
const frame=page.frameLocator('iframe');await frame.locator('.site-back-to-top').waitFor({state:'attached'});
assert.equal(await frame.locator('body').evaluate(async()=>{try{await navigator.clipboard.writeText('must be blocked');return false}catch{return true}}),true);
const embedded=frame.locator('[data-project="prompt-service-provider-app"]');await embedded.getByRole('button').click();await embedded.getByRole('status').filter({hasText:'Prompt copied.'}).waitFor();
await page.locator('iframe').evaluate(el=>el.blur());await page.locator('body').click({position:{x:1,y:1}});assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),prompt);
console.log('✓ Embedded iframe with clipboard-write denied still copies actual prompt text');
await page.goto('http://127.0.0.1:3000/project/prompt-service-provider-app/',{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});
await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:undefined,configurable:true}));
await page.getByRole('button',{name:'Copy prompt',exact:true}).click();await page.locator('.owner-prompt-status').filter({hasText:'Prompt copied.'}).waitFor();
assert.equal(await page.locator('textarea[aria-label="Copying prompt"]').count(),0);
await page.clock.fastForward(2100);await page.waitForFunction(()=>document.querySelector('.owner-prompt-status').textContent==='',{},{timeout:3000});
console.log('✓ Detail-page copy works without Clipboard API; temporary field cleaned up; success expires after two seconds');
// A second success restarts the two-second window, rather than inheriting a stale timer.
await page.getByRole('button',{name:'Copy prompt',exact:true}).click();await page.locator('.owner-prompt-status').filter({hasText:'Prompt copied.'}).waitFor();
await page.clock.fastForward(1100);await page.getByRole('button',{name:'Copy prompt',exact:true}).click();await page.clock.fastForward(1100);
assert.equal(await page.locator('.owner-prompt-status').textContent(),'Prompt copied.');
await page.clock.fastForward(1100);await page.waitForFunction(()=>document.querySelector('.owner-prompt-status').textContent==='',{},{timeout:3000});
console.log('✓ Repeat copy resets the confirmation timer');
assert.deepEqual(errors,[]);await browser.close();
