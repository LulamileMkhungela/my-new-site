/** Shared icons, navigation and Digital Rhino-inspired layout helpers.
 * Built into site-app.js. All content and artwork retain Lulamile branding.
 */
function LocalUiIcon({name='arrow-up-right',className=''}) {
  const h=g.createElement;
  const paths={
    'arrow-up-right':['M5 19 19 5M5 5h14v14'],
    'arrow-up':['M12 21V3M5 10l7-7 7 7'],
    'arrow-down':['M12 3v18M5 14l7 7 7-7'],
    'download':['M12 3v12M7 10l5 5 5-5M4 16v5h16v-5'],
    'google-play':['m5 3 15 9-15 9V3zM5 3l10 14M5 21 15 7'],
    'app-store':['M7 19 15 4M9 4l8 15M4 15h16M6 20l1-2M17 18l1 2'],
    'arrow-left':['M21 12H3M10 5l-7 7 7 7'],
    'arrow-right':['M3 12h18M14 5l7 7-7 7'],
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
    'facebook':['M14 21v-8h3l.5-4H14V7c0-1 .4-2 2-2h2V2h-3c-3 0-5 2-5 5v2H7v4h3v8'],
    'instagram':['M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z','M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z','M17.5 6.5h.01'],
    'mail':['M3 5h18v14H3zM3 6l9 7 9-7'],
    'calendar':['M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14h2M14 14h2M8 17h2'],
    'form':['M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h5'],
    'send':['m3 3 18 9-18 9 4-9-4-9zM7 12h14'],
    'check':['m5 12 4 4L19 6'],
    'sun':['M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2M12 21v2M4 12H2M22 12h-2M5 5 4 4M20 20l-1-1M19 5l1-1M4 20l1 1'],
    'moon':['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'],
    'sparkles':['M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8zM19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9zM5 15l.7 1.6L7 17l-1.3.4L5 19l-.7-1.6L3 17l1.3-.4z'],
    'archive':['M3 3h18v5H3zM5 8v13h14V8M10 12h4'],
    'grid':['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
    'menu':['M3 6h18M3 12h18M3 18h18'],
    'close':['m5 5 14 14M19 5 5 19']
  };
  return h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6,strokeLinecap:'round',strokeLinejoin:'round',className:'ui-line-icon '+className,'aria-hidden':true,focusable:false},...(paths[name]||paths['arrow-up-right']).map((d,index)=>h('path',{d,key:index})));
}
function LocalServiceNav({active=''}) {
  const h=g.createElement,track=g.useRef(null);
  const [edges,setEdges]=g.useState({start:true,end:false,overflow:false});
  g.useEffect(()=>{
    const el=track.current;if(!el)return;
    const measure=()=>{const next={start:el.scrollLeft<2,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-2,overflow:el.scrollWidth>el.clientWidth+2};setEdges(previous=>Object.keys(next).every(key=>next[key]===previous[key])?previous:next);};
    const observer=new ResizeObserver(measure);observer.observe(el);
    el.addEventListener('scroll',measure,{passive:true});measure();
    return()=>{observer.disconnect();el.removeEventListener('scroll',measure);};
  },[]);
  const move=direction=>track.current?.scrollBy({left:direction*track.current.clientWidth*.75,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  const arrow=(direction,label,disabled)=>h('button',{type:'button',className:'service-nav-arrow',hidden:!edges.overflow,disabled,'aria-label':label,onClick:()=>move(direction)},h(LocalUiIcon,{name:direction<0?'arrow-left':'arrow-right'}));
  return h('nav',{className:'hybrid-service-nav','aria-label':'Explore services'},
    arrow(-1,'Previous services',edges.start),
    h('div',{className:'hybrid-service-nav-inner',ref:track},
      ...localServiceCatalogue.services.map(item=>h(ve,{key:item.slug,to:'/services/'+item.slug,className:active===item.slug?'is-active':'','aria-current':active===item.slug?'page':undefined},item.title)),
      ...localStrategyServices.map(item=>h(ve,{key:item.path,to:item.path,className:active===item.path?'is-active':'','aria-current':active===item.path?'page':undefined},item.title))),
    arrow(1,'More services',edges.end));
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
  return h('a',{href:'https://wa.me/27837195064',target:'_blank',rel:'noopener noreferrer',className:(mobile?'rhino-contact rhino-contact-mobile':'rhino-contact'),'aria-label':'Let’s talk on WhatsApp — +27 83 719 5064'},
    h('span',{className:'rhino-contact-symbol','aria-hidden':true},h(LocalUiIcon,{name:'whatsapp'})),
    h('span',{className:'rhino-contact-copy'},h('span',{className:'rhino-contact-eyebrow'},'Have an idea?'),h('strong',null,'Let’s talk'),h('span',{className:'rhino-contact-channel'},'On WhatsApp')));
}
/** Generic numbered section rail. Renders on every page, scanning main for
 * section[id] elements and building a fixed bottom rail of numbered links that
 * jump to each section. Hovering a number reveals the full label (e.g.
 * "07 / Basic Graphic Design, SEO & Google Ads"). Replaces the homepage-only
 * navigator so the quick-jump numbers exist site-wide. */
function LocalSectionRail() {
  const h=g.createElement;
  const location=Qt();
  const [chapters,setChapters]=g.useState([]);
  const [active,setActive]=g.useState('');
  const [progress,setProgress]=g.useState(0);
  const collect=()=>{
    const root=document.querySelector('main');if(!root)return;
    const seen=new Set();const list=[];
    root.querySelectorAll('section[id]').forEach(el=>{
      if(el.id==='main'||el.classList.contains('hm-chapter-rail')||el.closest('.hm-chapter-rail'))return;
      if(seen.has(el.id))return;seen.add(el.id);
      const eyebrow=el.querySelector('.hybrid-eyebrow,.contact-section-label,.svc-kicker');
      let label=el.id;
      if(eyebrow){let text=eyebrow.textContent.trim().replace(/^\d+\s*\/\s*/,'');if(text)label=text;}
      else{const heading=el.querySelector('h1,h2');if(heading&&heading.textContent.trim())label=heading.textContent.trim();}
      list.push({id:el.id,label});
    });
    setChapters(prev=>prev.length===list.length&&prev.every((c,i)=>c.id===list[i].id&&c.label===list[i].label)?prev:list);
  };
  g.useEffect(()=>{
    collect();
    const t=setTimeout(collect,500);
    let frame=0;
    const update=()=>{
      frame=0;
      const header=document.querySelector('.rhino-header')?.getBoundingClientRect().height||144;
      const readingLine=header+Math.min(180,(innerHeight-header)*.3);
      let cur='';
      for(const chapter of chapters)if(document.getElementById(chapter.id)?.getBoundingClientRect().top<=readingLine)cur=chapter.id;
      const composed=document.querySelector('.hm-page[data-scene-active]')?.dataset.sceneActive;
      if(composed)cur=composed;
      setActive(prev=>prev===cur?prev:cur);
      const max=document.documentElement.scrollHeight-innerHeight;
      const p=max>0?Math.round(Math.max(0,Math.min(1,scrollY/max))*100):0;
      setProgress(prev=>prev===p?prev:p);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
    document.addEventListener('lulazel-scene-update',schedule);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);document.removeEventListener('lulazel-scene-update',schedule);clearTimeout(t);};
  },[location.pathname,chapters]);
  if(!chapters.length)return null;
  return h('div',{className:'hm-chapter-rail'},
    h('span',{className:'hm-rail-hint'},'Scroll to explore',h(LocalUiIcon,{name:'arrow-down'})),
    h('nav',{'aria-label':'Page sections'},h('ol',null,...chapters.map((chapter,index)=>h('li',{key:chapter.id},
      h('a',{href:'#'+chapter.id,'data-rail-label':String(index+1).padStart(2,'0')+' / '+chapter.label,'aria-label':String(index+1).padStart(2,'0')+' — '+chapter.label,'aria-current':active===chapter.id?'location':undefined,onClick:event=>{
        event.preventDefault();
        const target=document.getElementById(chapter.id);
        if(!target)return;
        if(target.hasAttribute('data-scene-start')){document.dispatchEvent(new CustomEvent('lulazel-scene-focus',{detail:chapter.id}));window.scrollTo({top:Number(target.dataset.sceneStart),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
        else{const header=document.querySelector('.rhino-header')?.getBoundingClientRect().height||0;target.setAttribute('tabindex','-1');target.focus({preventScroll:true});window.scrollTo({top:target.getBoundingClientRect().top+scrollY-header,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
      }},String(index+1).padStart(2,'0')))))),
    h('span',{className:'hm-rail-current','aria-hidden':true},chapters.find(chapter=>chapter.id===active)?.label),
    h('div',{className:'hm-scroll-progress',role:'progressbar','aria-label':'Page scroll progress','aria-valuemin':0,'aria-valuemax':100,'aria-valuenow':progress},h('span',{style:{transform:'scaleX('+progress/100+')'}})));
}
/** Logo tagline cycler — the wordmark with a tagline that swipes/swaps on a
 * loop, mirroring the cosmos navbar_logo-anim behaviour. All taglines are
 * stacked absolutely and cycled purely by CSS keyframes so the swipe is smooth. */
function LocalLogoAnim() {
  const h=g.createElement;
  const taglines=['Design & build studio','Product design partner','UI/UX & frontend studio','South African digital craft'];
  return h('span',{className:'logo-anim-wrap'},
    h(ve,{to:'/',className:'rhino-wordmark','aria-label':'LulaZel — Home'},h('img',{src:'/assets/img/logo.svg?v=abstract-1',alt:'LulaZel',width:248,height:80,fetchPriority:'high'})),
    h('span',{className:'logo-anim-tag','aria-live':'polite'},...taglines.map((tag,index)=>h('span',{key:tag,className:'logo-anim-tag-item'+(index===0?' is-on':''),style:{animationDelay:(index*3.2)+'s'}},tag))));
}
/** Light / dark theme toggle. Lives after the WhatsApp contact button. */
function LocalThemeToggle({mobile=false}) {
  const h=g.createElement;
  const [light,setLight]=g.useState(()=>{try{return localStorage.getItem('lz-theme')==='light';}catch(e){return false;}});
  g.useEffect(()=>{const root=document.documentElement;if(light)root.classList.add('light');else root.classList.remove('light');try{localStorage.setItem('lz-theme',light?'light':'dark');}catch(e){}},[light]);
  return h('button',{type:'button',className:(mobile?'rhino-theme rhino-theme-mobile':'rhino-theme'),'aria-label':light?'Switch to dark theme':'Switch to light theme','aria-pressed':light,onClick:()=>setLight(value=>!value)},
    h('span',{className:'rhino-theme-icon','aria-hidden':true},h(LocalUiIcon,{name:light?'sun':'moon'})));
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
        setOpen(false);headerRef.current?.querySelector('.rhino-menu-button')?.focus({preventScroll:true});
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
      h(LocalLogoAnim),
      h('nav',{className:'rhino-primary','aria-label':'Main navigation'},...links.filter(item=>item.href!=='/about').map(item=>h(ve,{key:item.href,to:item.href,className:active(item)?'is-active':'','aria-current':active(item)?'page':undefined},item.label)),h(LocalContactDropdown,{pathname})),
      h('div',{className:'rhino-header-actions'},h(ve,{to:'/services',className:'rhino-mobile-services'},'My Services'),
        h(LocalHeaderContactCard,{}),
        h(LocalThemeToggle,{}),
        h('button',{type:'button',className:'rhino-menu-button','aria-label':open?'Close navigation':'Open navigation','aria-expanded':open,'aria-controls':'rhino-mobile-menu',onClick:()=>setOpen(!open)},h(LocalUiIcon,{name:open?'close':'menu'})))),
    open&&h('nav',{id:'rhino-mobile-menu',className:'rhino-mobile-menu','aria-label':'Mobile navigation'},...links.map(item=>h(ve,{key:item.href,to:item.href,'aria-current':active(item)?'page':undefined},item.label)),h(ve,{to:'/contact','aria-current':pathname==='/contact'?'page':undefined,onClick:()=>setOpen(false)},'Contact'),h(LocalHeaderContactCard,{mobile:true}),h(LocalThemeToggle,{mobile:true})),
    h(LocalServiceNav,{active:localStrategyServices.some(item=>item.path===pathname)?pathname:pathname.startsWith('/services/')?pathname.slice(10):pathname==='/services'?'':'home'}));
}
