import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const canonicalPath=p=>p==='/'?'/':p.replace(/\/$/,'')+'/';
export function publicationConfig(root){
 const config=JSON.parse(fs.readFileSync(path.join(root,'assets/js/site.config.json'),'utf8'));
 const isPreview=(process.env.CONTEXT&&process.env.CONTEXT!=='production')||(process.env.VERCEL_ENV&&process.env.VERCEL_ENV!=='production');
 const input=isPreview?'':process.env.SITE_URL||config.url;
 config.url='';
 if(input){const u=new URL(input);if(u.protocol!=='https:'||u.pathname!=='/'||u.search||u.hash||u.username||u.password)throw new Error('SITE_URL must be an HTTPS origin, for example https://your-domain.co.za (no path/query/credentials)');config.url=u.origin;}
 return config;
}
export function seoRoutes(config,catalogue,strategies,projects){
 const record=(title,description,extra={})=>({title:title+' | Lulamile M',description,...extra});
 const routes={
  '/':{title:config.title,description:config.description},
  '/about':record('About Lulamile Mkhungela','Meet Lulamile Mkhungela, a South African designer, founder and builder working across product design, websites and business systems.'),
  '/contact':record('Let’s Talk','Discuss your website, product design or business systems project with Lulamile Mkhungela. Send an enquiry, call or connect on WhatsApp.'),
  '/portfolio':record('Portfolio','Explore Lulamile Mkhungela’s websites, apps, product-design case studies, frontend projects and premium and free AI design prompts.'),
  '/services':record('My Services','Product design, websites, ecommerce, business systems, automation, AI and digital marketing services by Lulamile Mkhungela.'),
  '/privacy':record('Privacy & image rights','How portfolio enquiries, third-party services, personal information and image rights are handled.'),
  '/tools':record('Tools','A collection of practical design and development resources.',{noindex:true}),
  '/404':record('Page not found','This page could not be found. Explore services and projects by Lulamile Mkhungela.',{noindex:true})
 };
 for(const service of [...catalogue.services,...strategies])routes[service.path||'/services/'+service.slug]=record(service.title,service.summary);
 for(const project of projects.filter(p=>p.details))routes[project.href]=record(project.client,project.description);
 for(const [p,meta]of Object.entries(routes))meta.canonical=canonicalPath(p);
 return routes;
}
export function structuredData(config,p,meta){
 if(!config.url||meta.noindex)return null;
 const origin=config.url,url=origin+meta.canonical;
 const data=[{'@type':'Person','@id':origin+'/#person',name:config.name,url:origin+'/',email:config.email,telephone:config.telephone,sameAs:[config.linkedin],jobTitle:'Designer, Founder & Builder'}, {'@type':'WebSite','@id':origin+'/#website',name:config.name,url:origin+'/',inLanguage:config.language,publisher:{'@id':origin+'/#person'}}, {'@type':'WebPage','@id':url+'#webpage',name:meta.title,description:meta.description,url,inLanguage:config.language,isPartOf:{'@id':origin+'/#website'},about:{'@id':origin+'/#person'}}];
 if(p!=='/')data.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:meta.title.split(' | ')[0],item:url}]});
 if(p.startsWith('/services/')||p==='/product-design-strategy')data.push({'@type':'Service',name:meta.title.split(' | ')[0],description:meta.description,url,provider:{'@id':origin+'/#person'},areaServed:{'@type':'Country',name:'South Africa'}});
 return {'@context':'https://schema.org','@graph':data};
}
export function seoHead(config,p,meta){
 const e=escapeHtml,url=config.url?config.url+meta.canonical:'';
 const tags=[`<title>${e(meta.title)}</title>`,`<meta name="description" content="${e(meta.description)}" />`,`<meta name="robots" content="${url&&!meta.noindex?'index,follow,max-image-preview:large':'noindex,follow'}" />`,`<meta property="og:type" content="website" />`,`<meta property="og:locale" content="${e(config.locale)}" />`,`<meta property="og:site_name" content="${e(config.name)}" />`,`<meta property="og:title" content="${e(meta.title)}" />`,`<meta property="og:description" content="${e(meta.description)}" />`,`<meta name="twitter:card" content="summary_large_image" />`,`<meta name="twitter:title" content="${e(meta.title)}" />`,`<meta name="twitter:description" content="${e(meta.description)}" />`];
 if(url)tags.push(`<link rel="canonical" href="${e(url)}" />`,`<meta property="og:url" content="${e(url)}" />`);
 if(config.url)tags.push(`<meta property="og:image" content="${e(config.url+config.socialImage)}" />`,`<meta property="og:image:width" content="1200" />`,`<meta property="og:image:height" content="630" />`,`<meta property="og:image:alt" content="Lulamile M — Designer, Founder and Builder" />`,`<meta name="twitter:image" content="${e(config.url+config.socialImage)}" />`);
 const schema=structuredData(config,p,meta);if(schema)tags.push(`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`);
 return tags.join('\n  ').replace(/<(meta|link|script|title)(?=[ >])/g,'<$1 data-rh="true"');
}
/** Dependency-free static rendering of the SAME readable page components.
 * React replaces these on startup; no crawler-only or divergent SEO copy. */
export function prerender(root,route,component,data){
 const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
 const serialize=node=>{
  if(node==null||typeof node==='boolean')return '';
  if(Array.isArray(node))return node.map(serialize).join('');
  if(typeof node!=='object')return escapeHtml(node);
  if(node.type==='metadata')return '';
  if(node.type==='fragment')return serialize(node.children);
  let type=node.type==='link'?'a':node.type;
  if(typeof type!=='string')throw new Error('Unknown static element');
  const attrs=[];
  const rename={className:'class',htmlFor:'for',tabIndex:'tabindex',fetchPriority:'fetchpriority',autoComplete:'autocomplete',maxLength:'maxlength',strokeWidth:'stroke-width',strokeLinecap:'stroke-linecap',strokeLinejoin:'stroke-linejoin',defaultValue:'value',readOnly:'readonly',charSet:'charset'};
  for(let [key,value]of Object.entries(node.props)){
   if(key==='children'||key==='key'||key==='ref'||key.startsWith('on')||value==null||value===false)continue;
   if(key==='to'){key='href';if(typeof value==='object')value=value.pathname+(value.search||'');}
   if(key==='style'){value=Object.entries(value).map(([k,v])=>k.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())+':'+v).join(';');}
   key=rename[key]||key;
   attrs.push(value===true&&!key.startsWith('aria-')?key:`${key}="${escapeHtml(value)}"`);
  }
  const open='<'+type+(attrs.length?' '+attrs.join(' '):'')+'>';
  return open+(voids.has(type)?'':serialize(node.children)+'</'+type+'>');
 };
 const parsed=new URL(route,'https://static.invalid');
 const context={...data,URLSearchParams,Date,g:{createElement:(type,props,...children)=>typeof type==='function'?type({...props,children}):({type,props:props||{},children}),Fragment:'fragment',useState:v=>[v,()=>{}],useEffect:()=>{},useRef:v=>({current:v})},Qt:()=>({pathname:parsed.pathname,search:parsed.search}),va:()=>()=>{},XA:'metadata',ve:'link'};
 const source=['services','hybrid','pages','portfolio','home'].map(name=>fs.readFileSync(path.join(root,`assets/js/${name}.source.js`),'utf8')).join('\n');
 const tree=vm.runInNewContext(source+'\nvar Bn=LocalSiteHeader;var zn=LocalSiteFooter;'+component+'();',context,{timeout:3000});
 return serialize(tree);
}
