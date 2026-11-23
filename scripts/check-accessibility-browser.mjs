/** Optional automated WCAG checks; not a substitute for assistive-tech review. */
import fs from 'node:fs';import {chromium} from 'playwright-core';import Chromium from '@sparticuz/chromium';
const browser=await chromium.launch({args:Chromium.args,executablePath:await Chromium.executablePath(),headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';const reports=[];
await page.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
try{
for(const width of [1440,390]){await page.setViewportSize({width,height:1000});for(const route of ['/','/services/website-design/','/portfolio/?filter=ai-prompt','/about/','/tools/','/contact/']){
 await page.goto(origin+route,{waitUntil:'load'});await page.locator('.site-back-to-top').waitFor({state:'attached'});await page.addScriptTag({content:fs.readFileSync('node_modules/axe-core/axe.min.js','utf8')});
 const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
 const violations=result.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));reports.push({width,route,violations,incomplete:result.incomplete.map(v=>({id:v.id,count:v.nodes.length}))});console.log(JSON.stringify({width,route,violations}));
}}
fs.writeFileSync('/tmp/accessibility-audit.json',JSON.stringify(reports,null,2));if(reports.some(r=>r.violations.length))process.exitCode=1;
}finally{await browser.close();}
