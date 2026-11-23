/** Raster variants share the same original outlined LulaZel logo sources. */
import fs from 'node:fs';import {Resvg} from '@resvg/resvg-js';
const render=(source,destination,width)=>fs.writeFileSync(destination,new Resvg(fs.readFileSync(source),{fitTo:{mode:'width',value:width}}).render().asPng());
for(const [name,size]of [['favicon.png',32],['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]])render('assets/img/favicon.svg','assets/img/'+name,size);
render('assets/img/social-card.svg','assets/img/social-card.png',1200);
console.log('Generated LulaZel browser/touch icons and 1200×630 social card.');
