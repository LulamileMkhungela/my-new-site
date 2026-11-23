/** Guard against restoring obsolete UI or shipping unused/duplicate resources. */
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8'),exists=file=>fs.existsSync(path.join(root,file));
const obsolete=['reference','assets/js/shell.js','assets/js/home.js','assets/js/work.js','assets/js/services.js','assets/js/tools.js','assets/js/case-study.js','assets/js/data.js','assets/js/tools.data.js','assets/js/projects.data.js','assets/js/portfolio.data.json','assets/js/navigation.data.js','assets/js/reference-ui.js','assets/js/interactive-scenes.js','assets/css/base.css','assets/css/site.css','assets/css/reference-ui.css','assets/img/projects','assets/img/digital-sculpture.webp','scripts/build-data.mjs','scripts/fetch-assets.sh','scripts/build-reference-ui.mjs'];
for(const file of obsolete){assert.ok(!exists(file),'Obsolete UI resource remains: '+file);assert.ok(!exists('dist/'+file),'Obsolete resource is deployed: '+file);}
const bundle=read('assets/js/site-app.js');
for(const marker of ['shubhamranjan','send-contact-email','Open ambient music player','Elara_Hero.png','@supabase/supabase-js'])assert.ok(!bundle.includes(marker),'Historical code/content in app: '+marker);
const js=fs.readdirSync(path.join(root,'dist/assets/js'));
assert.equal(js.length,3,'Publish only the app, versioned engine and versioned loader');
assert.ok(js.includes('site-app.js'));
assert.equal(js.filter(file=>/^interactive-scenes-[a-f0-9]{10}\.js$/.test(file)).length,1);
assert.equal(js.filter(file=>/^site-behaviour-[a-f0-9]{10}\.js$/.test(file)).length,1);
const css=fs.readdirSync(path.join(root,'dist/assets/css'));
assert.equal(css.length,1);assert.match(css[0],/^site-[a-f0-9]{10}\.css$/);
assert.ok(!read('scripts/build-site.mjs').includes('source-mirror'));
const distributionText=bundle+read('dist/site.webmanifest')+read('scripts/prepare-deploy.mjs');
// Compositions with dynamically assembled SVG URLs are checked by canonical
// page ownership in check-publication; every portfolio raster/SVG is literal.
for(const name of fs.readdirSync(path.join(root,'assets/img/portfolio'))){assert.ok(distributionText.includes(name),'Unreferenced portfolio image: '+name);assert.ok(exists('dist/assets/img/portfolio/'+name));}
const stylesheet=read('dist/assets/css/'+css[0]);
assert.ok(stylesheet.includes('var(--preview-travel'),'Runtime-measured website preview panning must survive CSS pruning');
for(const token of ['--glass-blur','--glass-panel-alpha','backdrop-filter:blur','prefers-reduced-transparency:reduce','forced-colors:active'])assert.ok(stylesheet.includes(token),'Compiled glass fallback/style missing: '+token);
for(const font of fs.readdirSync(path.join(root,'assets/fonts')).filter(name=>name.endsWith('.woff2')))assert.ok(stylesheet.includes(font),'Unused font: '+font);
console.log('✓ No old UI/source mirror, unused portfolio images/fonts, or duplicate deployed JS/CSS');
