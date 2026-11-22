/** Local production-output verifier. Netlify/Vercel apply the committed host config.
 * node scripts/serve-publication.mjs --port=3102; not intended as a public server. */
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../dist');
const port=Number(process.argv.find(a=>a.startsWith('--port='))?.split('=')[1]||3102);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.webmanifest':'application/manifest+json'};
http.createServer((req,res)=>{
 const u=new URL(req.url,'http://test.invalid');let decoded;try{decoded=decodeURIComponent(u.pathname)}catch{res.writeHead(400);return res.end();}
 let file=path.resolve(root,'.'+decoded);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end();}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 let status=200;if(!fs.existsSync(file)||!fs.statSync(file).isFile()){file=path.join(root,'404.html');status=404;}
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
 // Allow the Arena preview frame and HTTP test host here; production uses HTTPS
 // upgrade and frame-ancestors 'self' from its deployment configuration.
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://usdgvwhhpqriqenjanpe.supabase.co; font-src 'self'; connect-src 'self' https://formspree.io; form-action 'self' https://formspree.io; object-src 'none'; base-uri 'self'");
 res.writeHead(status,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}).listen(port,'0.0.0.0',()=>console.log('Production-output verifier listening on '+port));
