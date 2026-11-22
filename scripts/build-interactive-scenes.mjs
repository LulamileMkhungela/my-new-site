import {build} from 'esbuild';
await build({entryPoints:['assets/js/interactive-scenes.source.js'],outfile:'assets/js/interactive-scenes.js',bundle:true,minify:true,format:'esm',target:'es2020',legalComments:'eof'});
// Use a new URL when geometry/lifecycle code changes, not a cached module URL.
const fs=await import('node:fs');const {createHash}=await import('node:crypto');
const output=fs.readFileSync('assets/js/interactive-scenes.js');
const name='interactive-scenes-'+createHash('sha256').update(output).digest('hex').slice(0,10)+'.js';
for(const file of fs.readdirSync('assets/js'))if(/^interactive-scenes-[a-f0-9]{10}\.js$/.test(file)&&file!==name)fs.unlinkSync('assets/js/'+file);
fs.writeFileSync('assets/js/'+name,output);
