import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const canonicalPath=p=>p==='/'?'/':p.replace(/\/$/,'')+'/';
export function publicationConfig(root){
 const config=JSON.parse(fs.readFileSync(path.join(root,'assets/js/site.config.json'),'utf8'));
 const isPreview=(process.env.CONTEXT&&process.env.CONTEXT!=='production')||(process.env.VERCEL_ENV&&process.env.VERCEL_ENV!=='production');
 const input=isPreview?'':process.env.SITE_URL||config.url||process.env.URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?'https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL:'');
 config.url='';
 if(input){const u=new URL(input);if(u.protocol!=='https:'||u.pathname!=='/'||u.search||u.hash||u.username||u.password)throw new Error('SITE_URL must be an HTTPS origin, for example https://your-domain.co.za (no path/query/credentials)');config.url=u.origin;}
 config.socialImage+='?v='+createHash('sha256').update(fs.readFileSync(path.join(root,'assets/img/social-card.png'))).digest('hex').slice(0,10);
 return config;
}
export function seoRoutes(config,catalogue,strategies,projects,content){
 const pricing=content?.pricing;
 const record=(title,description,extra={})=>({title:title+' | '+(config.legalName||config.name),description,...extra});
 const routes={
  '/':{title:config.title,description:config.description},
  '/about':record('About','LulaZel Digital Studio is a Johannesburg design and development studio. We turn business ideas into websites, apps and connected systems — from strategy and design to development, integrations and launch.'),
  '/contact':record('Contact & Book a Meeting','Contact LulaZel Digital Studio to discuss a website, online store, app or business system. Book a meeting, send an enquiry or get an instant estimate. Johannesburg and remote.'),
  '/portfolio':record('Work','Selected work by LulaZel Digital Studio: websites, apps, product-design case studies and frontend builds for South African and international clients, plus AI design resources.'),
  '/services':record('Services','Services by LulaZel Digital Studio in South Africa: websites, UX/UI, ecommerce, business systems, automation, AI, data engineering, branding, motion, SEO and Google Ads.'),
  '/pricing':record('Pricing','Starting prices from LulaZel Digital Studio: websites from R18,000, online stores from R40,000, apps from R38,000, business systems from R50,000 and graphic design from R14,000. Written quote before work begins.'),
  '/privacy':record('Privacy & image rights','How enquiries, third-party services, personal information and image rights are handled.'),
  '/tools':record('Tools','A collection of practical design and development resources.',{noindex:true}),
  '/404':record('Page not found','This page could not be found. Explore services and projects from LulaZel.',{noindex:true})
 };
 // Service titles/descriptions are written for search intent (service + place),
 // with the published starting price when one exists.
 for(const service of [...catalogue.services,...strategies]){
  const path=service.path||'/services/'+service.slug,from=pricing?.packages.find(item=>item.path===path)?.from;
  const price=from?' From R'+String(from).replace(/\B(?=(\d{3})+(?!\d))/g,',')+'.':pricing?' Custom quote.':'';
  routes[path]=record(service.seoTitle||service.title,(service.seoDescription||service.summary)+price,{label:service.title});
 }
 if(content?.howWeWork)routes['/how-we-work']=record('How We Work: Process, Roles & Ways to Work With Us',content.howWeWork.intro,{label:'How we work'});
 if(content?.blog){
  routes['/blog']=record('Blog: AI, Tech Trends & Buzzwords Explained for Business',content.blog.intro,{label:'Blog'});
  for(const post of content.blog.items)routes['/blog/'+post.slug]=record(post.seoTitle||post.title,post.description,{label:post.title,article:{published:post.published},image:post.shareImage,imageAlt:post.imageAlt});
 }
 for(const project of projects.filter(p=>p.details))routes[project.href]=record(project.client,project.description);
 for(const [p,meta]of Object.entries(routes))meta.canonical=canonicalPath(p);
 return routes;
}
export function structuredData(config,p,meta,content={}){
 if(!config.url||meta.noindex)return null;
 const origin=config.url,url=origin+meta.canonical;
 const org={'@id':origin+'/#organization'};
 const names=[...new Set([config.name,...(config.alternateNames||[])])];
 const pricing=content.site?.pricing,faq=content.site?.faq||[];
 // Starting prices exactly as published on /pricing; never invented figures.
 const offers=pricing?{'@type':'OfferCatalog',name:'Services and starting prices',itemListElement:[...pricing.packages.map(item=>({'@type':'Offer',url:origin+'/pricing/',itemOffered:{'@type':'Service',name:item.service,url:origin+canonicalPath(item.path)},priceSpecification:{'@type':'PriceSpecification',minPrice:item.from,priceCurrency:'ZAR'}})),...pricing.custom.map(item=>({'@type':'Offer',url:origin+'/pricing/',itemOffered:{'@type':'Service',name:item.service,url:origin+canonicalPath(item.path)}}))]}:undefined;
 const data=[{'@type':'ProfessionalService','@id':origin+'/#organization',name:config.legalName||config.name,alternateName:names,description:config.description,slogan:config.slogan,foundingDate:config.foundingDate,knowsAbout:content.services,hasOfferCatalog:offers,contactPoint:{'@type':'ContactPoint',contactType:'sales',telephone:config.telephone,email:config.email,areaServed:'ZA',availableLanguage:['English']},url:origin+'/',logo:origin+'/assets/img/icon-512.png',image:config.url+config.socialImage,email:config.email,telephone:config.telephone,priceRange:'R14,000+',founder:{'@id':origin+'/#person'},sameAs:[config.linkedin],address:{'@type':'PostalAddress',streetAddress:content.site?.address?.street,addressLocality:content.site?.address?.city||'Johannesburg',postalCode:content.site?.address?.postalCode,addressRegion:'Gauteng',addressCountry:'ZA'},areaServed:{'@type':'Country',name:'South Africa'}},
  {'@type':'Person','@id':origin+'/#person',name:config.ownerName,url:origin+'/about/',sameAs:[config.linkedin],jobTitle:'Founder',worksFor:org,homeLocation:{'@type':'Place','name':'Johannesburg, South Africa'}},
  ...(content.site?.team?.members||[]).filter(m=>m.id!=='lulamile').map(m=>({'@type':'Person','@id':origin+'/#'+m.id,name:m.name,jobTitle:m.role,url:origin+'/about/',sameAs:[m.links.linkedin],worksFor:org})),
  {'@type':'WebSite','@id':origin+'/#website',name:config.name,alternateName:[config.legalName,...names.filter(n=>n!==config.name)],description:config.description,url:origin+'/',inLanguage:config.language,publisher:org},
  {'@type':'WebPage','@id':url+'#webpage',name:meta.title,description:meta.description,url,inLanguage:config.language,isPartOf:{'@id':origin+'/#website'},about:org}];
 if(p!=='/')data.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:meta.label||meta.title.split(' | ')[0],item:url}]});
 if(p.startsWith('/services/')||p==='/product-design-strategy')data.push({'@type':'Service',name:meta.label||meta.title.split(' | ')[0],description:meta.description,url,provider:org,areaServed:{'@type':'Country',name:'South Africa'}});
 if(meta.article)data.push({'@type':'Article','@id':url+'#article',headline:meta.label,description:meta.description,datePublished:meta.article.published,dateModified:meta.article.published,inLanguage:config.language,mainEntityOfPage:{'@id':url+'#webpage'},image:config.url+(meta.image||config.socialImage),author:org,publisher:org});
 const serviceFaq=content.serviceFaqs?.[p];
 if(serviceFaq)data.push({'@type':'FAQPage','@id':url+'#faq',mainEntity:serviceFaq.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))});
 if(p==='/contact'&&faq.length)data.push({'@type':'FAQPage','@id':url+'#faq',mainEntity:faq.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))});
 return {'@context':'https://schema.org','@graph':data};
}
export function seoHead(config,p,meta){
 const e=escapeHtml,url=config.url?config.url+meta.canonical:'';
 const tags=[`<title>${e(meta.title)}</title>`,`<meta name="description" content="${e(meta.description)}" />`,`<meta name="robots" content="${url&&!meta.noindex?'index,follow,max-image-preview:large':'noindex,follow'}" />`,`<meta property="og:type" content="website" />`,`<meta property="og:locale" content="${e(config.locale)}" />`,`<meta property="og:site_name" content="${e(config.name)}" />`,`<meta property="og:title" content="${e(meta.title)}" />`,`<meta property="og:description" content="${e(meta.description)}" />`,`<meta name="twitter:card" content="summary_large_image" />`,`<meta name="twitter:title" content="${e(meta.title)}" />`,`<meta name="twitter:description" content="${e(meta.description)}" />`];
 if(url)tags.push(`<link rel="canonical" href="${e(url)}" />`,`<meta property="og:url" content="${e(url)}" />`);
 const verify={google:'google-site-verification',bing:'msvalidate.01',yandex:'yandex-verification',pinterest:'p:domain_verify'};for(const [k,name] of Object.entries(verify)){const v=config.siteVerification?.[k];if(v)tags.push(`<meta name="${name}" content="${e(v)}" />`);}
 if(config.url){const img=meta.image?[meta.image,'image/png',1200,630,meta.imageAlt]:[config.socialImage,'image/png',1200,630,config.socialImageAlt];tags.push(`<meta property="og:image" content="${e(config.url+img[0])}" />`,`<meta property="og:image:type" content="${img[1]}" />`,`<meta property="og:image:width" content="${img[2]}" />`,`<meta property="og:image:height" content="${img[3]}" />`,`<meta property="og:image:alt" content="${e(img[4])}" />`,`<meta name="twitter:image" content="${e(config.url+img[0])}" />`,`<meta name="twitter:image:alt" content="${e(img[4])}" />`);}
 const schema=meta.schema!==undefined?meta.schema:structuredData(config,p,meta);if(schema)tags.push(`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`);
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
