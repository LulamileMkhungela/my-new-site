/** Publish only the compiled site, never .git, caches, source mirrors or scripts. */
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'dist');
const {routes,aliases}=JSON.parse(fs.readFileSync(path.join(root,'assets/js/publication.data.json'),'utf8'));
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const copy=(source,target=source)=>{fs.mkdirSync(path.dirname(path.join(out,target)),{recursive:true});fs.cpSync(path.join(root,source),path.join(out,target),{recursive:true});};
for(const name of ['index.html','404.html','case-study.html','robots.txt','sitemap.xml','site.webmanifest','llms.txt'])copy(name);
for(const name of fs.readdirSync(root).filter(name=>/^[a-f0-9]{32}\.txt$/.test(name)))copy(name);
for(const route of Object.keys(routes).filter(p=>p!=='/'&&p!=='/404'))copy(route.slice(1)+'/index.html');
for(const alias of Object.keys(aliases).filter(p=>p!=='/index.html'))copy(alias.slice(1)+(alias.endsWith('.html')?'':'/index.html'));
for(const file of ['assets/js/site-app.js','assets/img/home','assets/img/portfolio','assets/img/lulamile.webp','assets/img/blog','assets/img/logo.svg','assets/img/favicon.svg','assets/img/favicon.png','assets/img/apple-touch-icon.png','assets/img/icon-192.png','assets/img/icon-512.png','assets/img/social-card.png','assets/fonts','assets/prompts'])copy(file);
for(const file of fs.readdirSync(path.join(root,'assets/js')).filter(file=>/^(interactive-scenes|site-behaviour)-[a-f0-9]{10}\.js$/.test(file)))copy('assets/js/'+file);
for(const file of fs.readdirSync(path.join(root,'assets/css')).filter(file=>/^site-[a-f0-9]{10}\.css$/.test(file)))copy('assets/css/'+file);
const headers=`/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://usdgvwhhpqriqenjanpe.supabase.co; font-src 'self'; connect-src 'self' https://formspree.io; form-action 'self' https://formspree.io; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; upgrade-insecure-requests
  Cache-Control: public, max-age=0, must-revalidate
/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/assets/img/*
  Cache-Control: public, max-age=86400
`;
fs.writeFileSync(path.join(out,'_headers'),headers);
const redirects=Object.entries(aliases).filter(([p])=>p!=='/index.html').map(([p,target])=>`${p} ${target==='/'?'/':target+'/'} 301`).join('\n');
fs.writeFileSync(path.join(out,'_redirects'),redirects+'\n');
console.log('Publish-ready dist/ created. No deployment, DNS changes or form submissions performed.');
