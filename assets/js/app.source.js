/** Owner application: only current pages; no captured template/runtime code. */
import * as g from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,Navigate,Link as ve,useLocation as Qt,useNavigate as va} from 'react-router-dom';
import {HelmetProvider,Helmet as XA} from 'react-helmet-async';

const Bn=LocalSiteHeader,zn=LocalSiteFooter;
function LocalRouteEffects(){
 const {pathname,hash}=Qt();
 g.useLayoutEffect(()=>{
  if(hash){const target=document.getElementById(decodeURIComponent(hash.slice(1)));if(target)target.scrollIntoView();}
  else window.scrollTo({top:0,behavior:'instant'});
 },[pathname]);
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
   h(Route,{path:'/about',element:h(LocalAboutPage)}),
   h(Route,{path:'/contact',element:h(LocalContactPage)}),
   h(Route,{path:'/tools',element:h(LocalToolsPage)}),
   h(Route,{path:'/privacy',element:h(LocalPrivacyPage)}),
   ...Object.entries(localLegacyRoutes).filter(([path])=>path!=='/index.html').map(([path,to])=>h(Route,{key:path,path,element:h(Navigate,{to,replace:true})})),
   h(Route,{path:'*',element:h(LocalNotFoundPage)})),h(LocalBackToTop));
}
createRoot(document.getElementById('root')).render(
 g.createElement(HelmetProvider,null,g.createElement(BrowserRouter,null,g.createElement(LocalApplication))));
