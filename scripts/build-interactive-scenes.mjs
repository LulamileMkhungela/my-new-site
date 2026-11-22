import {build} from 'esbuild';
import fs from 'node:fs';import {createHash} from 'node:crypto';
const result=await build({entryPoints:['assets/js/interactive-scenes.source.js'],write:false,bundle:true,minify:true,format:'esm',target:'es2020',legalComments:'eof'});
const output=result.outputFiles[0].contents;
const name='interactive-scenes-'+createHash('sha256').update(output).digest('hex').slice(0,10)+'.js';
for(const file of fs.readdirSync('assets/js'))if(/^interactive-scenes-[a-f0-9]{10}\.js$/.test(file)&&file!==name)fs.unlinkSync('assets/js/'+file);
fs.writeFileSync('assets/js/'+name,output);
