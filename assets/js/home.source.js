/** Digital Rhino-inspired Home, with Lulamile content. No review widgets or new footer. */
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
function LocalHomeTestimonials() {
  const h=g.createElement;
  return h('section',{id:'testimonials',className:'hm-panel hm-testimonials','data-background-text':'KIND WORDS','aria-labelledby':'hm-testimonials-title'},
    h('div',{className:'unified-container'},h('div',{className:'hm-restored-heading'},h('div',null,h('p',{className:'hybrid-eyebrow'},'11 / Notes from people I’ve worked with'),h('h2',{id:'hm-testimonials-title'},'What people say')),h('p',null,'A few words from the people behind the projects.')),
      h('div',{className:'hm-testimonial-grid'},...localSiteContent.testimonials.map(person=>{
        const preview=person.message.length>190?person.message.slice(0,person.message.lastIndexOf(' ',190))+'…':person.message;
        return h('article',{className:'hm-testimonial-card',key:person.name},h('span',{className:'hm-quote-mark','aria-hidden':true},'“'),
          h('details',{className:'hm-quote-details'},h('summary',null,h('span',{className:'hm-quote-preview'},preview),h('span',{className:'hm-quote-toggle'},h('span',{className:'hm-quote-more'},'Read full note'),h('span',{className:'hm-quote-less'},'Close full note'),h(LocalUiIcon,{name:'chevron-down'}))),h('blockquote',null,person.message)),
          h('div',{className:'hm-testimonial-author'},h('span',{className:'hm-author-initials','aria-hidden':true},person.name.split(' ').map(word=>word[0]).slice(0,2).join('')),h('div',null,h('h3',null,person.name),h('p',null,person.designation+' · '+person.company),h('time',null,person.period))));
      }))));
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
  return h(LocalPageFrame,{title:'LulaZel — Websites, Products & Digital Systems',description:content.hero.description,className:'hm-page'},
    h('section',{id:'home',className:'hm-panel hm-hero','aria-labelledby':'hm-home-title'},h('div',{className:'hm-watermark','aria-hidden':true},'HELLO.'),
      h('div',{className:'unified-container hm-panel-inner'},h('div',{className:'hm-copy'},label('01',content.hero.eyebrow),h(LocalHomeTitle,{lines:content.hero.lines,level:'h1',id:'hm-home-title'}),h('p',{className:'hm-description'},content.hero.description),h('p',{className:'hm-location'},localSiteContent.location),h('a',{href:'#hosting',className:'hybrid-button hm-ride'},content.hero.action,h(LocalUiIcon,{name:'arrow-down'}))),h(LocalHomeVisual,{kind:'studio'})),
      h('div',{className:'unified-container hm-panel-bottom'},h('a',{href:'#hosting'},'Scroll to explore',h(LocalUiIcon,{name:'arrow-down'})),h('span',null,'Independent expertise. Connected solutions.'))),
    ...content.sections.map(section),
    h('section',{id:'home-portfolio',className:'hm-panel hm-portfolio','aria-labelledby':'hm-portfolio-title'},h('div',{className:'hm-watermark','aria-hidden':true},'MY WORK.'),h('div',{className:'unified-container'},h('div',{className:'hm-portfolio-heading'},h('div',null,label(content.portfolio.number,content.portfolio.eyebrow),h(LocalHomeTitle,{lines:content.portfolio.lines,id:'hm-portfolio-title'})),h('div',null,h('p',{className:'hm-description'},content.portfolio.description),h(LocalHomeLink,{to:'/portfolio',primary:true},content.portfolio.action))),
      h('div',{className:'hm-project-previews'},...localPortfolioProjects.filter(project=>project.featured&&project.details).slice(0,3).map((project,index)=>h(ve,{key:project.id,to:project.href,className:'hm-project-preview'},h('div',{className:'hm-project-art','data-tone':index},h('span',{className:'hm-project-client'},project.client),h('img',{src:project.image,alt:project.title,loading:'lazy',decoding:'async',onError:event=>{event.currentTarget.style.display='none'}}),h('span',{className:'hm-project-open'},h(LocalUiIcon,{name:'arrow-up-right'}))),h('span',{className:'hm-project-caption'},project.client,h(LocalUiIcon,{name:'arrow-up-right'}))))))),
    h('section',{id:'home-about',className:'hm-panel hm-about','aria-labelledby':'hm-about-title'},h('div',{className:'hm-watermark','aria-hidden':true},'LULAMILE.'),h('div',{className:'unified-container hm-panel-inner'},h('div',{className:'hm-copy'},label(content.about.number,content.about.eyebrow),h(LocalHomeTitle,{lines:content.about.lines,id:'hm-about-title'}),h('p',{className:'hm-description'},content.about.description),h('p',{className:'hm-description'},content.about.second),h('div',{className:'hm-actions'},h(LocalHomeLink,{to:'/about',primary:true},content.about.action))),
      h('div',{className:'hm-portrait-wrap'},h('div',{className:'hm-portrait-frame'},h('img',{src:'/assets/img/lulamile.webp',alt:localSiteContent.name+' — designer, founder and builder',width:900,height:900,loading:'lazy'})),h('div',{className:'hm-portrait-caption'},h('span',null,localSiteContent.name),h('small',null,'South Africa · Anywhere remote'))))),h(LocalHomeProcess),h(LocalHomeTestimonials));
}
