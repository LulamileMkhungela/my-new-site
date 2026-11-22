import assert from 'node:assert/strict';import fs from 'node:fs';import {chromium} from 'playwright-core';import Chromium from '@sparticuz/chromium';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';const {routes}=JSON.parse(fs.readFileSync('assets/js/publication.data.json','utf8'));
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],issues=[];page.on('pageerror',e=>errors.push(e.message));
// Inspect HTML geometry independently of WebGL, covered in its own suite.
await page.route('**/*',r=>r.request().url().startsWith(origin)&&!r.request().url().includes('interactive-scenes')?r.continue():r.abort());
const paths=process.env.SPACING_ROUTES?process.env.SPACING_ROUTES.split(','):[...Object.keys(routes).filter(route=>route!=='/404'),'/portfolio/?filter=apps','/portfolio/?filter=ai-prompt'];
for(const width of (process.env.SPACING_WIDTHS||'320,768,1440').split(',').map(Number)){await page.setViewportSize({width,height:1000});for(const route of paths){await page.goto(origin+route,{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});
 const failures=await page.evaluate(()=>{
  const problems=[];
  if(document.documentElement.scrollWidth>innerWidth)problems.push('Horizontal page overflow');
  for(const el of document.querySelectorAll('main .unified-container,main .studio-panel-inner,main .hm-panel-inner,main .hybrid-hero-inner,.contact-next-layout')){
   const r=el.getBoundingClientRect();if(r.width&&r.height&&(r.left<15||r.right>innerWidth-15))problems.push('Page gutter: '+el.className+' '+r.left.toFixed(1)+'/'+(innerWidth-r.right).toFixed(1));
  }
  const selector='.contact-direct a,.contact-secondary a,.contact-extra-actions a,.contact-extra-actions button,.hybrid-button,.svc-button,.hm-link-primary,.studio-link-primary,.pf-action-bar,.footer-icon-frame,.enquiry-close,.pf-category-toggle,.rhino-menu-button,.rhino-about-dropdown>button';
  for(const el of document.querySelectorAll(selector)){
   const rect=el.getBoundingClientRect();if(!rect.width||!rect.height)continue;
   for(const svg of el.querySelectorAll('svg')){const r=svg.getBoundingClientRect();if(!r.width||!r.height)continue;const inset=Math.min(r.left-rect.left,rect.right-r.right,r.top-rect.top,rect.bottom-r.bottom);if(inset<7.5)problems.push('Icon inset '+inset.toFixed(1)+'px: '+(el.className||el.textContent.trim().slice(0,35)));}
  }
  return problems;
 });if(failures.length)issues.push({route,width,failures});
 }console.log('✓ Inspected '+paths.length+' routes at '+width+'px');}
await page.goto(origin+'/contact/');await page.locator('.site-back-to-top').waitFor({state:'attached'});await page.screenshot({path:'/tmp/contact-spacing-desktop.png'});
await page.getByRole('button',{name:'Send an enquiry',exact:true}).click();assert.ok(await page.locator('.enquiry-close').evaluate(el=>{const b=el.getBoundingClientRect(),i=el.querySelector('svg').getBoundingClientRect();return i.left-b.left>=10&&b.right-i.right>=10}));await page.getByRole('button',{name:'Close enquiry form'}).click();
assert.deepEqual(issues,[]);assert.deepEqual(errors,[]);await browser.close();console.log('✓ Page gutters and boxed icon spacing throughout all main routes; enquiry dialog spacing');
