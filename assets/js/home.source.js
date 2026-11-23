/** Numbered Home chapters, original artwork and supplied recommendations. */
function LocalHomeTitle({lines,level='h2',id}) {
  const h=g.createElement;
  return h(level,{className:'hm-title',id},...lines.map((line,index)=>h('span',{key:index,className:index===1?'hm-outline':index===2?'hm-green':''},line)));
}
function LocalHomeLink({to,children,primary=false}) {
  const h=g.createElement;
  return h(ve,{to,className:primary?'hm-link hm-link-primary':'hm-link'},children,h(LocalUiIcon,{name:'arrow-up-right'}));
}
/** Seven original, locally authored SVG scenes; no generated image textures. */
function LocalHomeVisual({kind}) {
  const h=g.createElement;
  return h('div',{key:kind,className:'hm-visual hm-visual-'+kind,'data-scene-kind':kind,'aria-hidden':true},
    h('img',{className:'hm-vector-art',src:'/assets/img/home/'+kind+'.svg?v='+localHomeArtworkVersion,alt:'',width:640,height:570,loading:kind==='studio'?'eager':'lazy',fetchPriority:kind==='studio'?'high':undefined,decoding:'async'}));
}
function LocalHomeProcess() {
  const h=g.createElement;
  return h('section',{id:'process',className:'hm-panel hm-process','data-background-text':'THE PROCESS','aria-labelledby':'hm-process-title'},
    h('div',{className:'unified-container'},h('div',{className:'hm-restored-heading'},h('div',null,h('p',{className:'hybrid-eyebrow'},'10 / How we work'),h('h2',{id:'hm-process-title'},'Process')),h('p',null,'A conversation. A clear plan. Something that works.')),
      h('div',{className:'hm-process-grid'},...localSiteContent.process.map((step,index)=>h('article',{className:'hm-process-card',key:step.num},
        h('div',{className:'hm-process-top'},h('span',null,step.num),h(LocalServiceIcon,{name:['chat','layout','flow'][index]})),h('h3',null,step.title),h('p',null,step.body),h('span',{className:'hm-process-track','aria-hidden':true},h('i'),h('i'),h('i')))))));
}
/** Native hash links also work before hydration and without JavaScript. */
function LocalHomeNavigator() {
  const h=g.createElement;
  const chapters=[{id:'home',label:'Welcome'},...localHomeContent.sections.map(item=>({id:item.id,label:item.eyebrow})),{id:'home-portfolio',label:'Portfolio'},{id:'home-about',label:'About'},{id:'process',label:'Process'},{id:'testimonials',label:'Testimonials'}];
  const [position,setPosition]=g.useState({active:'home',progress:0});
  g.useEffect(()=>{
    let frame=0;
    const update=()=>{
      frame=0;
      const header=document.querySelector('.rhino-header')?.getBoundingClientRect().height||144;
      const readingLine=header+Math.min(180,(innerHeight-header)*.3);
      let active=chapters[0].id;
      for(const chapter of chapters)if(document.getElementById(chapter.id)?.getBoundingClientRect().top<=readingLine)active=chapter.id;
      const max=document.documentElement.scrollHeight-innerHeight;
      const progress=max>0?Math.round(Math.max(0,Math.min(1,scrollY/max))*100):0;
      setPosition(previous=>previous.active===active&&previous.progress===progress?previous:{active,progress});
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
    const observer=typeof ResizeObserver==='function'?new ResizeObserver(schedule):null;
    observer?.observe(document.body);schedule();
    return()=>{cancelAnimationFrame(frame);observer?.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[]);
  return h('div',{className:'hm-chapter-rail'},
    h('span',{className:'hm-rail-hint'},'Scroll to explore',h(LocalUiIcon,{name:'arrow-down'})),
    h('nav',{'aria-label':'Home sections'},h('ol',null,...chapters.map((chapter,index)=>h('li',{key:chapter.id},h('a',{href:'#'+chapter.id,'aria-label':String(index+1).padStart(2,'0')+' — '+chapter.label,'aria-current':position.active===chapter.id?'location':undefined,title:chapter.label,onClick:()=>{
      // Focus the destination for keyboard/screen-reader users, without a second scroll.
      const target=document.getElementById(chapter.id);target?.setAttribute('tabindex','-1');target?.focus({preventScroll:true});
    }},String(index+1).padStart(2,'0')))))),
    h('span',{className:'hm-rail-current','aria-hidden':true},chapters.find(chapter=>chapter.id===position.active)?.label),
    h('div',{className:'hm-scroll-progress',role:'progressbar','aria-label':'Page scroll progress','aria-valuemin':0,'aria-valuemax':100,'aria-valuenow':position.progress},h('span',{style:{transform:'scaleX('+position.progress/100+')'}})));
}
function LocalHomeTestimonials() {
  const h=g.createElement,track=g.useRef(null);
  const [slide,setSlide]=g.useState(0);
  const [enhanced,setEnhanced]=g.useState(false);
  const [edges,setEdges]=g.useState({start:true,end:false});
  g.useEffect(()=>{
    const el=track.current;if(!el)return;
    setEnhanced(true);
    let frame=0;
    const update=()=>{
      frame=0;const cards=[...el.children],left=el.getBoundingClientRect().left;
      const index=cards.reduce((best,card,i)=>Math.abs(card.getBoundingClientRect().left-left)<Math.abs(cards[best].getBoundingClientRect().left-left)?i:best,0);
      setSlide(index);setEdges({start:el.scrollLeft<2,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-2});
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    el.addEventListener('scroll',schedule,{passive:true});
    const observer=typeof ResizeObserver==='function'?new ResizeObserver(schedule):null;observer?.observe(el);schedule();
    return()=>{cancelAnimationFrame(frame);observer?.disconnect();el.removeEventListener('scroll',schedule);};
  },[]);
  const move=direction=>{
    const el=track.current;if(!el)return;
    const card=el.children[0],distance=card.getBoundingClientRect().width+parseFloat(getComputedStyle(el).columnGap||0);
    el.scrollBy({left:direction*distance,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  return h('section',{id:'testimonials',className:'hm-panel hm-testimonials','data-background-text':'KIND WORDS','aria-labelledby':'hm-testimonials-title'},
    h('div',{className:'unified-container hm-testimonials-layout'},
      h('div',{className:'hm-quote-art','aria-hidden':true},h('div',{className:'hm-quote-orbit'}),h('span',{className:'hm-quote-sculpture'},'“'),h('span',{className:'hm-quote-spark'},'+'),h('span',{className:'hm-quote-art-caption'},'Good work starts with people.')),
      h('div',{className:'hm-testimonials-copy'},
        h('p',{className:'hybrid-eyebrow'},'11 / Notes from people I’ve worked with'),
        h(LocalHomeTitle,{id:'hm-testimonials-title',lines:['Good work.','Real people.','Their words.']}),
        h('p',{className:'hm-description'},'A project is also a working relationship. A few words from the people behind the work.'),
        h('div',{className:'hm-testimonial-carousel',role:'region','aria-roledescription':'carousel','aria-label':'Recommendations'},
          h('div',{className:'hm-testimonial-controls'},h('span',null,'Shared recommendations'),h('div',null,
            h('button',{type:'button','aria-label':'Previous testimonial','aria-controls':'hm-testimonial-track',disabled:!enhanced||edges.start,onClick:()=>move(-1)},h(LocalUiIcon,{name:'arrow-left'})),
            h('button',{type:'button','aria-label':'Next testimonial','aria-controls':'hm-testimonial-track',disabled:!enhanced||edges.end,onClick:()=>move(1)},h(LocalUiIcon,{name:'arrow-right'})))),
          h('div',{id:'hm-testimonial-track',className:'hm-testimonial-grid',ref:track,tabIndex:0,'aria-label':'Swipe or use arrow keys to browse testimonials',onKeyDown:event=>{if(event.target===event.currentTarget&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();if(event.key==='Home'||event.key==='End')track.current.scrollTo({left:event.key==='Home'?0:track.current.scrollWidth,behavior:'instant'});else move(event.key==='ArrowLeft'?-1:1);}}},...localSiteContent.testimonials.map((person,index)=>{
            const preview=person.message.length>190?person.message.slice(0,person.message.lastIndexOf(' ',190))+'…':person.message;
            return h('article',{className:'hm-testimonial-card',key:person.name,'aria-label':'Recommendation '+(index+1)+' of '+localSiteContent.testimonials.length},
              h('div',{className:'hm-testimonial-author'},h('span',{className:'hm-author-initials','aria-hidden':true},person.name.split(' ').map(word=>word[0]).slice(0,2).join('')),h('div',null,h('h3',null,person.name),h('p',null,person.designation+' · '+person.company),h('time',null,person.period))),
              h('span',{className:'hm-quote-mark','aria-hidden':true},'“'),
              h('details',{className:'hm-quote-details'},h('summary',null,h('span',{className:'hm-quote-preview'},preview),h('span',{className:'hm-quote-toggle'},h('span',{className:'hm-quote-more'},'Read full note'),h('span',{className:'hm-quote-less'},'Close full note'),h(LocalUiIcon,{name:'chevron-down'}))),h('blockquote',null,person.message)));
          })),
          h('p',{className:'hm-carousel-status',role:'status','aria-live':'polite'},'Showing from '+(slide+1)+' of '+localSiteContent.testimonials.length+' · Swipe or use the arrows')))));
}
function LocalHomePage() {
  const h=g.createElement;
  const content=localHomeContent;
  const label=(number,eyebrow)=>h('div',{className:'hm-section-label'},h('p',{className:'hybrid-eyebrow'},h('span'),number+' / '+eyebrow));
  const section=item=>h('section',{key:item.id,id:item.id,className:'hm-panel hm-service-panel','aria-labelledby':'hm-heading-'+item.id},
    h('div',{className:'hm-watermark','aria-hidden':true},item.watermark),
    h('div',{className:'unified-container hm-panel-inner'},h('div',{className:'hm-copy'},label(item.number,item.eyebrow),h(LocalHomeTitle,{lines:item.lines,id:'hm-heading-'+item.id}),h('p',{className:'hm-description'},item.description),
      item.points&&h('ul',{className:'hm-points'},...item.points.map((point,index)=>h('li',{key:point},h('span',null,point),h('small',null,String(index+1).padStart(2,'0'))))),
      item.note&&h('p',{className:'hm-scope-note'},item.note),h('div',{className:'hm-actions'},...item.links.map((link,index)=>h(LocalHomeLink,{key:link.to,to:link.to,primary:index===0},link.label)))),h(LocalHomeVisual,{kind:item.visual})));
  return h(LocalPageFrame,{title:'LulaZel — Devzigner, Design & Frontend Development',description:content.hero.description,className:'hm-page'},
    h('section',{id:'home',className:'hm-panel hm-hero','aria-labelledby':'hm-home-title'},h('div',{className:'hm-watermark','aria-hidden':true},'HELLO.'),
      h('div',{className:'unified-container hm-panel-inner'},h('div',{className:'hm-copy'},label('01',content.hero.eyebrow),h(LocalHomeTitle,{lines:content.hero.lines,level:'h1',id:'hm-home-title'}),h('p',{className:'hm-description'},content.hero.description),h('p',{className:'hm-location'},localSiteContent.location),h('a',{href:'#hosting',className:'hybrid-button hm-ride'},content.hero.action,h(LocalUiIcon,{name:'arrow-down'}))),h(LocalHomeVisual,{kind:'studio'})),
      h('div',{className:'unified-container hm-panel-bottom'},h('a',{href:'#hosting'},'Scroll to explore',h(LocalUiIcon,{name:'arrow-down'})),h('span',null,'Independent expertise. Connected solutions.'))),
    ...content.sections.map(section),
    h('section',{id:'home-portfolio',className:'hm-panel hm-portfolio','aria-labelledby':'hm-portfolio-title'},h('div',{className:'hm-watermark','aria-hidden':true},'MY WORK.'),h('div',{className:'unified-container'},h('div',{className:'hm-portfolio-heading'},h('div',null,label(content.portfolio.number,content.portfolio.eyebrow),h(LocalHomeTitle,{lines:content.portfolio.lines,id:'hm-portfolio-title'})),h('div',null,h('p',{className:'hm-description'},content.portfolio.description),h(LocalHomeLink,{to:'/portfolio',primary:true},content.portfolio.action))),
      h('div',{className:'hm-project-previews pf-featured'},...localPortfolioProjects.filter(project=>project.featured).sort((a,b)=>a.homeOrder-b.homeOrder).map((project,index)=>h(LocalPortfolioCard,{key:project.id,project,index,total:5,category:'home'}))))),
    h('section',{id:'home-about',className:'hm-panel hm-about','aria-labelledby':'hm-about-title'},h('div',{className:'hm-watermark','aria-hidden':true},'LULAMILE.'),h('div',{className:'unified-container hm-panel-inner'},h('div',{className:'hm-copy'},label(content.about.number,content.about.eyebrow),h(LocalHomeTitle,{lines:content.about.lines,id:'hm-about-title'}),h('p',{className:'hm-description'},content.about.description),h('p',{className:'hm-description'},content.about.second),h('div',{className:'hm-actions'},h(LocalHomeLink,{to:'/about',primary:true},content.about.action))),
      h('div',{className:'hm-portrait-wrap'},h('div',{className:'hm-portrait-frame'},h('img',{src:'/assets/img/lulamile.webp',alt:localSiteContent.name+' — designer, founder and builder',width:900,height:900,loading:'lazy'})),h('div',{className:'hm-portrait-caption'},h('span',null,localSiteContent.name),h('small',null,'South Africa · Anywhere remote'))))),h(LocalHomeProcess),h(LocalHomeTestimonials),h(LocalHomeNavigator));
}
