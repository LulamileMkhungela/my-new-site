/** Optional genuine full-page capture. Run where the project's site is reachable.
 * Usage: node scripts/capture-project-preview.mjs nerdma
 * No forms submitted, no deployment, no generated/synthetic website content. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import Chromium from '@sparticuz/chromium';
import {chromium} from 'playwright-core';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dataPath=path.join(root,'assets/js/portfolio.projects.json');
const projects=JSON.parse(await fs.readFile(dataPath,'utf8'));
const id=process.argv[2];
const project=projects.find(item=>item.id===id&&item.previewScroll);
if(!project)throw new Error('Specify an existing previewScroll project, for example: nerdma');
const candidates=[project.categoryActions?.website,project.categoryActions?.['frontend-dev'],{href:project.href},...(project.details?.links||[])];
const link=candidates.find(item=>item?.href?.startsWith('https://')&&!/github\.com|selar\.com/.test(new URL(item.href).hostname));
if(!link)throw new Error('No existing HTTPS website link found for '+id);
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 page.on('dialog',dialog=>dialog.dismiss());
 console.log('Capturing actual website: '+link.href);
 const response=await page.goto(link.href,{waitUntil:'load',timeout:45000});
 if(!response?.ok())throw new Error('Website failed: HTTP '+response?.status());
 await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,10000))]));
 // Bound lazy-loading traversal so infinite pages cannot loop indefinitely.
 for(let y=0;y<30000;y+=750){
  const height=await page.evaluate(()=>document.documentElement.scrollHeight);
  if(height>30000)throw new Error('Page exceeds 30,000px; review it manually before capturing.');
  await page.evaluate(top=>window.scrollTo({top,behavior:'instant'}),y);
  await page.waitForTimeout(150);
  if(y+900>=height)break;
 }
 await page.evaluate(()=>Promise.race([Promise.all([...document.images].map(image=>image.decode().catch(()=>{}))),new Promise(resolve=>setTimeout(resolve,10000))]));
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForTimeout(500);
 const relative='assets/img/portfolio/previews/'+id+'.png';
 await fs.mkdir(path.dirname(path.join(root,relative)),{recursive:true});
 await page.screenshot({path:path.join(root,relative),fullPage:true,animations:'disabled'});
 // Re-read to avoid overwriting unrelated edits made during network capture.
 const latest=JSON.parse(await fs.readFile(dataPath,'utf8'));
 const current=latest.find(item=>item.id===id);
 current.previewImage='/'+relative;
 await fs.writeFile(dataPath,JSON.stringify(latest,null,2)+'\n');
 console.log('Saved '+relative+'. Review the image, then run npm run build.');
} finally {await browser.close();}
