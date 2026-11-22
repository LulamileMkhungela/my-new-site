/** Shared icons, navigation and Digital Rhino-inspired layout helpers.
 * Built into site-app.js. All content and artwork retain Lulamile branding.
 */
function LocalUiIcon({name='arrow-up-right',className=''}) {
  const h=g.createElement;
  const paths={
    'arrow-up-right':['M5 19 19 5M5 5h14v14'],
    'arrow-up':['M12 21V3M5 10l7-7 7 7'],
    'arrow-down':['M12 3v18M5 14l7 7 7-7'],
    'chevron-down':['m6 9 6 6 6-6'],
    'plus':['M12 5v14M5 12h14'],
    'minus':['M5 12h14'],
    'filter':['M4 6h16M7 12h10M10 18h4'],
    'monitor':['M3 4h18v13H3zM8 21h8M12 17v4'],
    'layers':['m12 3 10 5-10 5L2 8l10-5zM2 12l10 5 10-5M2 16l10 5 10-5'],
    'handset':['M6 3 3 5c0 8 6 14 14 16l4-4-5-3-2 2c-3-1-5-3-6-6l2-2-4-5z'],
    'phone':['M7 2h10v20H7zM11 18h2'],
    'whatsapp':['M20.5 11.5a8.5 8.5 0 0 1-12.8 7.3L3 20l1.2-4.5a8.5 8.5 0 1 1 16.3-4z','M8 7c-1 3 2 7 6 8l2-2-3-1-1 1-2-2 1-1-1-3H8z'],
    'linkedin':['M4 9h4v12H4zM6 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4M12 21V9h4v2c1-3 6-3 6 2v8h-4v-7c0-3-2-3-2 0v7'],
    'mail':['M3 5h18v14H3zM3 6l9 7 9-7'],
    'calendar':['M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14h2M14 14h2M8 17h2'],
    'form':['M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h5'],
    'send':['m3 3 18 9-18 9 4-9-4-9zM7 12h14'],
    'check':['m5 12 4 4L19 6'],
    'archive':['M3 3h18v5H3zM5 8v13h14V8M10 12h4'],
    'grid':['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
    'menu':['M3 6h18M3 12h18M3 18h18'],
    'close':['m5 5 14 14M19 5 5 19']
  };
  return h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6,strokeLinecap:'round',strokeLinejoin:'round',className:'ui-line-icon '+className,'aria-hidden':true,focusable:false},...(paths[name]||paths['arrow-up-right']).map((d,index)=>h('path',{d,key:index})));
}
function LocalServiceNav({active=''}) {
  const h=g.createElement;
  return h('nav',{className:'hybrid-service-nav','aria-label':'Explore services'},
    h('div',{className:'hybrid-service-nav-inner'},
      ...localServiceCatalogue.services.map(item=>h(ve,{key:item.slug,to:'/services/'+item.slug,className:active===item.slug?'is-active':'','aria-current':active===item.slug?'page':undefined},item.title)),
      ...localStrategyServices.map(item=>h(ve,{key:item.path,to:item.path,className:active===item.path?'is-active':'','aria-current':active===item.path?'page':undefined},item.title))));
}
/** Original local vector instead of the old sculpture placeholder. */
function LocalDigitalVisual({label='Design × technology',icon='grid'}) {
  const h=g.createElement,kind=({portfolio:'portfolio',toolkit:'toolkit'})[icon];
  return h('div',{key:kind,className:'hybrid-visual studio-original-visual','data-scene-kind':kind,'aria-hidden':true},
    h('img',{src:'/assets/img/home/'+kind+'.svg?v='+localHomeArtworkVersion,alt:'',width:640,height:570,fetchPriority:'high'}),h('div',{className:'hybrid-visual-caption'},h('span'),label));
}
function LocalHybridHero({eyebrow,line1,line2,line3,description,primary,secondary,label,icon,children,id}) {
  const h=g.createElement;
  return h('section',{className:'hybrid-hero',id},
    h('div',{className:'hybrid-hero-watermark','aria-hidden':true},(label||'DESIGN. BUILD.').toUpperCase()),
    h('div',{className:'hybrid-hero-inner'},
      h('div',{className:'hybrid-hero-copy'},
        h('p',{className:'hybrid-eyebrow'},h('span'),eyebrow),
        h('h1',null,h('span',null,line1),h('span',{className:'hybrid-outline'},line2),h('span',{className:'hybrid-green'},line3)),
        h('p',{className:'hybrid-hero-description'},description),
        children,
        h('div',{className:'hybrid-actions'},
          primary.href.startsWith('#') ? h('a',{href:primary.href,className:'hybrid-button'},primary.label,h(LocalUiIcon,{name:'arrow-down'})) : h(ve,{to:primary.href,className:'hybrid-button'},primary.label,h(LocalUiIcon,{name:'arrow-up-right'})),
          secondary.href.startsWith('#') ? h('a',{href:secondary.href,className:'hybrid-text-link'},secondary.label,h(LocalUiIcon,{name:'arrow-up-right'})) : h(ve,{to:secondary.href,className:'hybrid-text-link'},secondary.label,h(LocalUiIcon,{name:'arrow-up-right'})))),
      h(LocalDigitalVisual,{label,icon})),
    h('div',{className:'hybrid-hero-bottom'},h('span',null,'South Africa · Anywhere remote'),h('span',null,'Independent thinking. Connected solutions.')));
}
function LocalHeaderContactCard({mobile=false}) {
  const h=g.createElement;
  return h('a',{href:'https://wa.me/27837195064',target:'_blank',rel:'noopener noreferrer',className:mobile?'rhino-contact rhino-contact-mobile':'rhino-contact','aria-label':'Let’s talk on WhatsApp — +27 83 719 5064'},
    h('span',{className:'rhino-contact-symbol','aria-hidden':true},h(LocalUiIcon,{name:'whatsapp'})),
    h('span',{className:'rhino-contact-copy'},h('span',{className:'rhino-contact-eyebrow'},'Have an idea?'),h('strong',null,'Let’s talk'),h('span',{className:'rhino-contact-channel'},'On WhatsApp')));
}
/** Split About link + accessible disclosure; native links remain navigable. */
function LocalContactDropdown({pathname}) {
  const h=g.createElement,[expanded,setExpanded]=g.useState(false),ref=g.useRef(null);
  g.useEffect(()=>setExpanded(false),[pathname]);
  g.useEffect(()=>{
    const close=event=>{if(event.type==='keydown'&&event.key==='Escape'){if(ref.current?.contains(document.activeElement)){setExpanded(false);ref.current.querySelector('button')?.focus();}}else if(event.type==='pointerdown'&&!ref.current?.contains(event.target))setExpanded(false);};
    document.addEventListener('pointerdown',close);document.addEventListener('keydown',close);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',close);};
  },[]);
  return h('div',{className:'rhino-about-dropdown',ref,
    onPointerEnter:event=>{if(event.pointerType==='mouse'&&matchMedia('(hover: hover) and (pointer: fine)').matches)setExpanded(true);},
    onPointerLeave:event=>{if(!event.currentTarget.contains(document.activeElement))setExpanded(false);},
    onBlur:event=>{if(!event.currentTarget.contains(event.relatedTarget))setExpanded(false);}},
    h(ve,{to:'/about',className:pathname==='/about'?'is-active':'','aria-current':pathname==='/about'?'page':undefined},'About'),
    h('button',{type:'button','aria-label':'About and contact links','aria-expanded':expanded,'aria-controls':'rhino-about-links',onClick:()=>setExpanded(!expanded)},h(LocalUiIcon,{name:'chevron-down'})),
    expanded&&h('div',{id:'rhino-about-links',className:'rhino-about-links'},h(ve,{to:'/contact','aria-current':pathname==='/contact'?'page':undefined,onClick:()=>setExpanded(false)},'Contact',h(LocalUiIcon,{name:'arrow-up-right'}))));
}
function LocalSiteHeader() {
  const h=g.createElement;
  const pathname=Qt().pathname.replace(/\/$/,'')||'/';
  const [open,setOpen]=g.useState(false);
  const headerRef=g.useRef(null);
  g.useEffect(()=>setOpen(false),[pathname]);
  g.useEffect(()=>{
    if(!open)return;
    const close=event=>{
      if(event.type==='keydown'&&event.key==='Escape'){
        setOpen(false);headerRef.current?.querySelector('.rhino-menu-button')?.focus();
      }else if((event.type==='pointerdown'||event.type==='focusin')&&!headerRef.current?.contains(event.target))setOpen(false);
    };
    const desktop=matchMedia('(min-width: 801px)');
    const resize=()=>{if(desktop.matches)setOpen(false)};
    document.addEventListener('keydown',close);document.addEventListener('pointerdown',close);document.addEventListener('focusin',close);desktop.addEventListener('change',resize);
    return()=>{document.removeEventListener('keydown',close);document.removeEventListener('pointerdown',close);document.removeEventListener('focusin',close);desktop.removeEventListener('change',resize);};
  },[open]);
  const links=[{label:'Home',href:'/'},{label:'My Services',href:'/services'},{label:'Portfolio',href:'/portfolio'},{label:'About',href:'/about'}];
  const active=item=>item.href==='/services'?pathname==='/services'||pathname.startsWith('/services/')||localStrategyServices.some(service=>service.path===pathname):item.href==='/portfolio'?pathname==='/portfolio'||/^\/(project|graphic|amazon)\//.test(pathname):pathname===item.href;
  return h('header',{className:'rhino-header',ref:headerRef,onClick:event=>{if(event.target.closest('a'))setOpen(false);}},
    h('a',{href:'#main',className:'rhino-skip'},'Skip to content'),
    h('div',{className:'rhino-header-main'},
      h(ve,{to:'/',className:'rhino-wordmark','aria-label':'LulaZel — Home'},h('img',{src:'/assets/img/logo.svg',alt:'LulaZel',width:252,height:64,fetchPriority:'high'})),
      h('nav',{className:'rhino-primary','aria-label':'Main navigation'},...links.filter(item=>item.href!=='/about').map(item=>h(ve,{key:item.href,to:item.href,className:active(item)?'is-active':'','aria-current':active(item)?'page':undefined},item.label)),h(LocalContactDropdown,{pathname})),
      h('div',{className:'rhino-header-actions'},h(ve,{to:'/services',className:'rhino-mobile-services'},'My Services'),
        h(LocalHeaderContactCard,{}),
        h('button',{type:'button',className:'rhino-menu-button','aria-label':open?'Close navigation':'Open navigation','aria-expanded':open,'aria-controls':'rhino-mobile-menu',onClick:()=>setOpen(!open)},h(LocalUiIcon,{name:open?'close':'menu'})))),
    open&&h('nav',{id:'rhino-mobile-menu',className:'rhino-mobile-menu','aria-label':'Mobile navigation'},...links.map(item=>h(ve,{key:item.href,to:item.href,'aria-current':active(item)?'page':undefined},item.label)),h(ve,{to:'/contact','aria-current':pathname==='/contact'?'page':undefined,onClick:()=>setOpen(false)},'Contact'),h(LocalHeaderContactCard,{mobile:true})),
    h(LocalServiceNav,{active:localStrategyServices.some(item=>item.path===pathname)?pathname:pathname.startsWith('/services/')?pathname.slice(10):pathname==='/services'?'':'home'}));
}
