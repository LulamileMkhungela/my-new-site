/** Owner application: only current pages; no captured template/runtime code. */
import * as g from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,Navigate,Link as ve,useLocation as Qt,useNavigate as va,useNavigationType} from 'react-router-dom';
import {HelmetProvider,Helmet as XA} from 'react-helmet-async';

const Bn=LocalSiteHeader,zn=LocalSiteFooter;
function LocalRouteEffects(){
 const {pathname,search,hash,key}=Qt(),navigationType=useNavigationType(),previousPath=g.useRef(null);
 g.useLayoutEffect(()=>{
  const header=document.querySelector('.rhino-header');
  const measure=()=>document.documentElement.style.setProperty('--site-header-height',Math.ceil(header?.getBoundingClientRect().height||144)+'px');
  measure();
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;
  if(header)observer?.observe(header);
  window.addEventListener('resize',measure,{passive:true});
  return()=>{observer?.disconnect();window.removeEventListener('resize',measure);};
 },[pathname]);
 g.useLayoutEffect(()=>{
  if(previousPath.current!==null&&previousPath.current!==pathname){
   const main=document.getElementById('main');
   main?.setAttribute('tabindex','-1');main?.focus({preventScroll:true});
  }
  previousPath.current=pathname;
  const saved=navigationType==='POP'?LocalReadRoutePosition(key):null;
  const previousRestoration=history.scrollRestoration;
  history.scrollRestoration='manual';
  const place=()=>{
   if(saved){
    document.querySelectorAll('.pf-grid,.hm-project-previews').forEach((track,index)=>{track.scrollLeft=saved.tracks?.[index]||0;});
    window.scrollTo({top:saved.y,left:saved.x,behavior:'instant'});return;
   }
   let id='';try{id=decodeURIComponent(hash.slice(1));}catch{}
   const target=id?document.getElementById(id):null;
   if(target?.hasAttribute('data-scene-start'))window.scrollTo({top:Number(target.dataset.sceneStart),behavior:'instant'});
   else if(target)target.scrollIntoView({behavior:'instant',block:'start'});
   else window.scrollTo({top:0,behavior:'instant'});
  };
  place();
  document.documentElement.dataset.routeReady=pathname+search+hash;
  // One follow-up frame avoids retaining the old chapter's scroll position
  // while the replacement route and late image dimensions finish committing.
  const frame=requestAnimationFrame(place);
  let snapshot;
  const capture=()=>{snapshot={x:window.scrollX,y:window.scrollY,tracks:[...document.querySelectorAll('.pf-grid,.hm-project-previews')].map(track=>track.scrollLeft)};};
  capture();
  window.addEventListener('scroll',capture,true);
  const persist=()=>{localRoutePositions.set(key,snapshot);try{sessionStorage.setItem('lulazel-position-'+key,JSON.stringify(snapshot));}catch{}};
  window.addEventListener('pagehide',persist);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',capture,true);window.removeEventListener('pagehide',persist);persist();history.scrollRestoration=previousRestoration;};
 },[pathname,search,hash,key]);
 return null;
}
function LocalApplication(){
 const h=g.createElement;
 return h(g.Fragment,null,h(LocalSeo),h(LocalRouteEffects),
  h(Routes,null,
   h(Route,{path:'/',element:h(LocalHomePage)}),
   h(Route,{path:'/services',element:h(LocalServicesPage)}),
   h(Route,{path:'/services/:slug',element:h(LocalServicesPage)}),
   h(Route,{path:'/product-design-strategy',element:h(LocalServicesPage)}),
   h(Route,{path:'/portfolio',element:h(LocalPortfolioPage)}),
   h(Route,{path:'/project/:id',element:h(LocalProjectPage)}),
   h(Route,{path:'/pricing',element:h(LocalPricingPage)}),
   h(Route,{path:'/blog',element:h(LocalBlogPage)}),
   h(Route,{path:'/blog/:slug',element:h(LocalBlogPostPage)}),
   h(Route,{path:'/how-we-work',element:h(LocalHowWeWorkPage)}),
   h(Route,{path:'/about',element:h(LocalAboutPage)}),
   h(Route,{path:'/contact',element:h(LocalContactPage)}),
   h(Route,{path:'/tools',element:h(LocalToolsPage)}),
   h(Route,{path:'/privacy',element:h(LocalPrivacyPage)}),
   ...Object.entries(localLegacyRoutes).filter(([path])=>path!=='/index.html').map(([path,to])=>h(Route,{key:path,path,element:h(Navigate,{to,replace:true})})),
   h(Route,{path:'*',element:h(LocalNotFoundPage)})),h(LocalBackToTop));
}
createRoot(document.getElementById('root')).render(
 g.createElement(HelmetProvider,null,g.createElement(BrowserRouter,null,g.createElement(LocalApplication))));
