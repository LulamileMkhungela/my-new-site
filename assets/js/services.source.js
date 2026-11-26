/** Current page-exclusive service directory and detail views.
 * Consumed by scripts/build-site.mjs; not loaded separately.
 */
function LocalServiceIcon({name}) {
  const paths = {
    server: ['M4 4h16v6H4zM4 14h16v6H4z', 'M7 7h.01M7 17h.01M11 7h6M11 17h6'],
    layout: ['M3 4h18v16H3zM3 9h18M9 9v11'],
    bag: ['M5 7h14l1 14H4L5 7z', 'M9 8V6a3 3 0 0 1 6 0v2'],
    grid: ['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
    flow: ['M4 3h6v6H4zM14 15h6v6h-6zM7 9v8h7M10 6h7v9'],
    chat: ['M4 4h16v12H9l-5 4V4zM8 9h8M8 12h5'],
    pen: ['m4 16-1 5 5-1L20 8l-4-4L4 16zM13 7l4 4'],
    search: ['M15 15l6 6', 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0'],
    target: ['M21 12a9 9 0 1 1-9-9M17 12a5 5 0 1 1-5-5M12 12l9-9M16 3h5v5'],
    eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z','M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0'],
    brand: ['M12 3l8 6-8 12L4 9l8-6z','M4 9h16M12 3v18'],
    motion: ['M4 5h16v14H4z','M10 9v6l5-3-5-3z'],
    data: ['M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z','M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3']
  };
  return g.createElement('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.5,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':true},
    ...(paths[name] || paths.grid).map((d,i)=>g.createElement('path',{d,key:i})));
}
/** Shared three-line editorial title; no duplicate animated text for readers. */
function LocalStudioTitle({lines,level='h2',id}) {
  const h=g.createElement;
  return h(level,{className:'studio-title',id},...lines.map((line,index)=>h('span',{key:index,className:index===1?'studio-outline':index===2?'studio-green':''},line)));
}
function LocalStudioVisual({kind='studio',caption='LulaZel · Independent digital partner',eager=false,small=false}) {
  const h=g.createElement;
  return h('figure',{key:kind,className:'studio-visual'+(small?' studio-visual-small':''),'data-reveal':'art','data-scene-kind':kind},h('img',{src:'/assets/img/home/'+kind+'.svg?v='+localHomeArtworkVersion,alt:'Original '+kind+' vector illustration for LulaZel',width:640,height:570,loading:'eager',decoding:'async',fetchPriority:eager?'high':undefined}),h('figcaption',null,h('i',{'aria-hidden':true}),caption));
}
/** Service FAQ built only from what the page already states (intro, features,
 * preparation, scope note) plus the published starting price. Shared by the
 * page and its FAQPage structured data, so the two can never disagree. */
function localServiceFaq(service,pricePackage) {
  const title=service.title;
  return [
    {question:'What does '+title+' include?',answer:service.intro+' Typical work covers: '+service.features.map(([name])=>name).join('; ')+'.'},
    {question:'How much does '+title+' cost?',answer:pricePackage
      ?'Projects start from '+localRand(pricePackage.from)+'. Your written quote depends on scope — pages, features, integrations and timeline — and excludes third-party costs such as hosting plans, domains, subscriptions and ad spend.'
      :title+' is quoted to your scope after a short conversation, because provider plans and ongoing effort vary. You receive a written quote before work begins; third-party costs such as provider plans, subscriptions and ad spend are billed separately.'},
    {question:'What should I prepare before we talk?',answer:'It helps to have: '+service.prepare.join('; ')+'. A complete technical brief is not required.'},
    {question:'What is and isn’t included in the scope?',answer:service.note},
    {question:'Do you work outside Johannesburg?',answer:'Yes. LulaZel Digital Studio is based in Johannesburg and works with businesses across South Africa and remotely, whatever your time zone.'}
  ];
}
/** Blog articles mapped to a service (site.content.json → blog.items[].services). */
function localPostsFor(slug,limit=3){
  const items=localSiteContent.blog.items,matched=items.filter(item=>(item.services||[]).includes(slug));
  return (matched.length?matched:items).slice(0,limit);
}
function LocalStudioPager({sections,current,next}) {
  const h=g.createElement;
  return h('div',{className:'studio-panel-bottom'},h('a',{href:'#'+(next||sections[0].id)},next?'Scroll to explore ↓':'Back to overview ↑'),
    h('nav',{'aria-label':'Page chapters'},...sections.map((section,index)=>h('a',{key:section.id,href:'#'+section.id,'aria-label':'Chapter '+(index+1)+': '+section.label,'aria-current':index===current?'step':undefined},String(index+1).padStart(2,'0')))),h(ve,{to:'/about'},'About LulaZel ↓'));
}
function LocalServicesPage() {
  const h=g.createElement;
  const pathname=Qt().pathname.replace(/\/$/,'');
  const slug=pathname.startsWith('/services/')?pathname.slice(10):'';
  const catalogue=localServiceCatalogue;
  const service=catalogue.services.find(item=>item.slug===slug)||localStrategyServices.find(item=>item.path===pathname||item.slug===slug);
  const label=(number,title,subtitle)=>h('div',{className:'studio-section-heading'},h('p',{className:'studio-kicker'},h('span',{'aria-hidden':true}),number+' / '+title),h('p',{className:'studio-subtitle'},subtitle));
  const row=item=>h(ve,{key:item.slug||item.path,to:item.path||'/services/'+item.slug,className:'studio-service-row'},h('span',{className:'studio-row-title'},item.title,h(LocalUiIcon,{name:'arrow-up-right'})),h('span',{className:'studio-row-summary'},item.summary));
  const panel=(id,watermark,children,key=id)=>h('section',{key,id,className:'studio-panel','data-background-text':watermark},children);
  if(slug&&!service)return h(g.Fragment,null,h(Bn),h('main',{id:'main',className:'svc-page'},h('section',{className:'unified-container unified-empty-page','data-background-text':'SERVICES'},h('h1',null,'Service not found.'),h(ve,{to:'/services'},'Browse all services'))),h(LocalSectionRail),h(zn));
  if(!service){
    const groups=[
      {id:'web',label:'Web & ecommerce',lines:['Digital services.','Your business.','Connected.'],description:'From design and development to choosing providers, connecting services and launch — we bring the pieces together so your website works end to end.',art:'web-services',watermark:'SERVICES'},
      {id:'systems',label:'Systems & AI',lines:['Custom systems.','Smarter work.','Your way.'],description:'Scope one focused solution or connect several services around your specific requirements.',art:'connected-services',watermark:'SMARTER WORK'},
      {id:'growth',label:'Design & marketing',lines:['Your brand.','Your audience.','Make contact.'],description:'Give your business a consistent visual presence and connect it with relevant customers.',art:'growth-services',watermark:'MAKE CONTACT'}
    ];
    return h(g.Fragment,null,h(Bn),h('main',{id:'main',className:'svc-page studio-services'},...groups.map((group,index)=>panel(group.id,group.watermark,
      h(g.Fragment,null,h('div',{className:'studio-panel-inner'+(index===1?' studio-art-left':'')},
        h('div',{className:'studio-copy','data-reveal':'copy'},label('0'+(index+1),'Services','Choose your next step.'),h(LocalStudioTitle,{lines:group.lines,level:index===0?'h1':'h2',id:'heading-'+group.id}),h('p',{className:'studio-description'},group.description),
          h('div',{className:'studio-service-list'},...catalogue.services.filter(item=>item.group===group.id).map(row)),
          index===2&&h('div',{id:'strategy',className:'studio-strategy'},h('p',{className:'studio-subtitle'},'Also / Product & strategy'),...localStrategyServices.map(row)),
          index===2&&h('a',{href:'#web',className:'studio-back'},'↺ Back to all services')),
        h(LocalStudioVisual,{kind:group.art,eager:index===0,caption:group.label+' · Original vector study'})),h(LocalStudioPager,{sections:groups,current:index,next:groups[index+1]?.id}))))) ,h(LocalSectionRail),h(zn));
  }
  const presentation={
    'web-hosting':{intro:['Hosting setup.','Connected.','Managed.'],features:['Choose well.','Set it up.','Keep it running.'],contact:['Your website.','Your providers.','Let’s connect.'],featureLabel:'What we set up & manage',subtitle:'Choose. Connect. Maintain.',mark:'SET UP & SUPPORTED'},
    'website-design':{intro:['Website','design.','With purpose.'],features:['Look sharp.','Work hard.','Make it easy.'],contact:['Your vision.','Our craft.','Let’s build.'],featureLabel:'Design & development',subtitle:'Thought through. From the start.',mark:'DESIGNED AROUND YOU'},
    ecommerce:{intro:['Ecommerce.','Built to','sell online.'],features:['Easy to find.','Easy to buy.','Built for you.'],contact:['Your store.','Next chapter.','Starts here.'],featureLabel:'Your online store',subtitle:'From first look to checkout.',mark:'SELL ONLINE'},
    'business-systems':{intro:['Business','systems.','Built for you.'],features:['Less friction.','More control.','Your system.'],contact:['Your challenge.','Our starting','point.'],featureLabel:'What could we build?',subtitle:'Your processes. Your possibilities.',mark:'BUILT AROUND YOUR BUSINESS'},
    'workflow-automation':{intro:['Workflow','automation.','Practical AI.'],features:['Less repeat.','More flow.','Your way.'],contact:['Your process.','Next level.','Let’s connect.'],featureLabel:'What could work better?',subtitle:'Small tasks. Connected processes.',mark:'KEEP MOVING'},
    'ai-assistants':{intro:['AI assistants.','Real support.','Your business.'],features:['Help customers.','Support teams.','Make it useful.'],contact:['Your knowledge.','Your assistant.','Let’s shape it.'],featureLabel:'AI assistants',subtitle:'Purposeful work. Practical detail.',mark:'USEFUL AI'},
    'basic-graphic-design':{intro:['Basic graphic','design.','Your brand.'],features:['Look distinct.','Stay consistent.','Be remembered.'],contact:['Your message.','Our design.','Let’s create.'],featureLabel:'Basic graphic design',subtitle:'Purposeful work. Practical detail.',mark:'YOUR BRAND'},
    'seo-and-search':{intro:['SEO & search.','Get discovered.','Build relevance.'],features:['Strong basics.','Build relevance.','Keep improving.'],contact:['Your audience.','Your priorities.','Let’s get clear.'],featureLabel:'SEO & search',subtitle:'Purposeful work. Practical detail.',mark:'GET FOUND'},
    'ux-ui-design':{intro:['UX/UI design.','Easy to use.','Built to convert.'],features:['Find friction.','Map journeys.','Design clearly.'],contact:['Your users.','Their journey.','Let’s improve it.'],featureLabel:'UX/UI design & audit',subtitle:'Research. Journeys. Interfaces.',mark:'USABLE BY DESIGN'},
    'brand-identity':{intro:['Brand identity.','Distinct.','Consistent.'],features:['Find your voice.','Shape the look.','Use it well.'],contact:['Your story.','Your identity.','Let’s shape it.'],featureLabel:'Brand identity',subtitle:'Strategy. Identity. Guidelines.',mark:'RECOGNISABLE'},
    'motion-animation':{intro:['Motion design.','Ideas in','motion.'],features:['Plan the story.','Animate it.','Share it.'],contact:['Your message.','In motion.','Let’s animate.'],featureLabel:'Motion design & animation',subtitle:'Script. Storyboard. Animation.',mark:'IN MOTION'},
    'ai-data-engineering':{intro:['AI & data','engineering.','Built properly.'],features:['Clean data.','Solid backends.','Useful AI.'],contact:['Your data.','Your decisions.','Let’s engineer it.'],featureLabel:'AI & data engineering',subtitle:'Pipelines. Platforms. Practical AI.',mark:'ENGINEERED FOR AI'},
    'google-ads':{intro:['Google Ads.','Relevant reach.','Clear goals.'],features:['Right audience.','Clear message.','Track the value.'],contact:['Your offer.','Your goals.','Let’s plan.'],featureLabel:'Google Ads',subtitle:'Purposeful work. Practical detail.',mark:'RELEVANT REACH'}
  };
  const design=presentation[service.slug]||{intro:['Product design.','Clear strategy.','Better products.'],features:['Understand.','Define.','Design.'],contact:['Your challenge.','Clear direction.','Let’s shape it.'],featureLabel:'Product design & strategy',subtitle:'Research. Direction. Useful design.',mark:'PRODUCT STRATEGY'};
  const pricePackage=localSiteContent.pricing.packages.find(item=>item.path===(service.path||'/services/'+service.slug));
  // Each complete composition belongs to one page only. Home and Contact
  // keep their original artwork; service chapters never borrow it.
  const introArtwork={
    'web-hosting':'hosting-service','website-design':'website-design',
    ecommerce:'commerce-service','business-systems':'system-service',
    'workflow-automation':'workflow-service','ai-assistants':'assistant-service',
    'basic-graphic-design':'graphic-service','seo-and-search':'search',
    'google-ads':'advertising','product-design-strategy':'strategy',
    'ux-ui-design':'ux-service','brand-identity':'brand-service',
    'motion-animation':'motion-service','ai-data-engineering':'data-service'
  }[service.slug];
  const featureArtwork={kind:service.slug+'-features',caption:service.title+' · Practical features'};
  // Chapter order follows the cosmos service-page structure: what's included →
  // selected work → how a project runs → why us & fit → questions (with
  // related articles and client words) → next step.
  // Real projects only (never borrowed case studies); pages without matching
  // work simply skip the chapter.
  const projects=(typeof localPortfolioProjects!=='undefined'?localPortfolioProjects:[]);
  const workItems=(service.work||[]).map(id=>projects.find(project=>project.id===id)).filter(Boolean).slice(0,3);
  const sections=[{id:'service-intro',label:service.title},{id:'service-features',label:'Features'},...(workItems.length?[{id:'service-work',label:'Selected work'}]:[]),{id:'service-process',label:'How a project runs'},{id:'service-why',label:'Why LulaZel'},{id:'service-faq',label:'Questions'},{id:'service-contact',label:'Your next project'}];
  const at=id=>sections.findIndex(section=>section.id===id),num=id=>String(at(id)+1).padStart(2,'0');
  const pager=id=>h(LocalStudioPager,{sections,current:at(id),next:sections[at(id)+1]?.id});
  const projectLink=project=>{const href=project.siteUrl||project.href;if(project.type==='coming-soon'||!href)return h('span',{className:'studio-work-soon'},'Coming soon');
    return /^https?:/.test(href)?h('a',{href,target:'_blank',rel:'noopener noreferrer',className:'studio-text-link','aria-label':'Open '+project.client+' — opens in a new tab'},'Open project',h(LocalUiIcon,{name:'arrow-up-right'})):h(ve,{to:href,className:'studio-text-link','aria-label':'View '+project.client+' case study'},project.type==='case-study'?'View case study':'View project',h(LocalUiIcon,{name:'arrow-up-right'}));};
  const work=localSiteContent.howWeWork,posts=localPostsFor(service.slug);
  const faq=localServiceFaq(service,pricePackage);
  // Client words are quoted verbatim with their attribution; only notes that
  // keep service pages brand-first (no personal name) are reused here.
  const quote=service.testimonial&&localSiteContent.testimonials.find(item=>item.company===service.testimonial);
  return h(g.Fragment,null,h(Bn),h('main',{id:'main',className:'svc-page studio-service-detail'},
    panel('service-intro',service.title.toUpperCase(),h(g.Fragment,null,h('div',{className:'studio-panel-inner'},
      h('div',{className:'studio-copy','data-reveal':'copy'},label('01',service.title,'Built around your business.'),h(LocalStudioTitle,{lines:design.intro,level:'h1'}),h('p',{className:'studio-description'},service.intro),h('p',{className:'studio-tags'},service.tags.join(' · ')),h('div',{className:'studio-actions'},h('a',{href:'#service-features',className:'studio-link-primary'},'Explore '+service.title,h(LocalUiIcon,{name:'arrow-down'})),h(ve,{to:'/contact',className:'studio-text-link'},'Discuss your project',h(LocalUiIcon,{name:'arrow-up-right'})))),
      h(LocalStudioVisual,{kind:introArtwork,eager:true,caption:service.title+' · Original vector study'})),h(LocalStudioPager,{sections,current:0,next:'service-features'}))),
    panel('service-features',design.mark,h(g.Fragment,null,h('div',{className:'studio-panel-inner studio-art-left studio-panel-features'},
      h('div',{className:'studio-copy','data-reveal':'copy'},label(num('service-features'),design.featureLabel,design.subtitle),h(LocalStudioTitle,{lines:design.features}),
        h('div',{className:'studio-feature-list'},...service.features.map(([title,body],index)=>h('article',{className:'svc-feature',key:title},h('span',{className:'studio-feature-number'},String(index+1).padStart(2,'0')),h('h3',null,title),h('p',null,body)))),
        service.specialisms&&h('details',{className:'studio-specialisms'},h('summary',null,'Focused support & additional options'),...service.specialisms.map(([title,body])=>h('div',{key:title},h('h3',null,title),h('p',null,body)))),
        h('p',{className:'studio-scope'},service.note),h(ve,{to:'/contact',className:'studio-text-link'},'Discuss your requirements',h(LocalUiIcon,{name:'arrow-up-right'}))),
      h(LocalStudioVisual,{kind:featureArtwork.kind,caption:featureArtwork.caption})),pager('service-features'))),
    workItems.length?panel('service-work','SELECTED WORK',h(g.Fragment,null,h('div',{className:'studio-panel-inner studio-panel-work'},
      h('div',{className:'studio-copy','data-reveal':'copy'},label(num('service-work'),'Selected work','Real projects. Real businesses.'),h(LocalStudioTitle,{lines:['Real projects.','Real','businesses.']}),
        h('div',{className:'studio-work-grid'},...workItems.map(project=>h('article',{className:'studio-work-card',key:project.id},
          project.image&&h('div',{className:'studio-work-media'},h('img',{src:project.image,alt:project.client+' project preview',loading:'lazy',decoding:'async'})),
          h('div',{className:'studio-work-body'},h('p',{className:'studio-work-client'},project.client+(project.year?' · '+project.year:'')),h('h3',null,project.title),h('p',null,project.description),projectLink(project))))),
        h(ve,{to:'/portfolio',className:'studio-text-link'},'See all work',h(LocalUiIcon,{name:'arrow-up-right'})))),pager('service-work'))):null,
    panel('service-process','HOW IT RUNS',h(g.Fragment,null,h('div',{className:'studio-panel-inner studio-panel-process'},
      h('div',{className:'studio-copy','data-reveal':'copy'},label(num('service-process'),'How a project runs','Clear steps. Clear roles.'),h(LocalStudioTitle,{lines:['Clear steps.','Clear roles.','No surprises.']}),
        h('ol',{className:'studio-steps'},...work.steps.map((step,index)=>h('li',{key:step.title},h('span',{className:'studio-feature-number'},String(index+1).padStart(2,'0')),h('h3',null,step.title),h('p',null,step.body))))),
      h('aside',{className:'studio-roles','aria-labelledby':'studio-roles-title'},h('h3',{id:'studio-roles-title'},'Who builds what'),
        h('dl',null,...work.roles.map(role=>h(g.Fragment,{key:role.who},h('dt',null,role.who),h('dd',null,role.what)))),
        h(ve,{to:'/how-we-work',className:'studio-text-link'},'How we work in detail',h(LocalUiIcon,{name:'arrow-up-right'})))),pager('service-process'))),
    panel('service-why','WHY LULAZEL',h(g.Fragment,null,h('div',{className:'studio-panel-inner studio-panel-why'},
      h('div',{className:'studio-copy','data-reveal':'copy'},label(num('service-why'),'Why LulaZel','Before you book a call.'),h(LocalStudioTitle,{lines:['Why LulaZel.','Is it','a fit?']}),
        h('div',{className:'studio-why-list'},...(work.why||[]).map((item,index)=>h('article',{className:'studio-why-item',key:item.title},h('span',{className:'studio-feature-number'},String(index+1).padStart(2,'0')),h('h3',null,item.title),h('p',null,item.body)))),
        h('div',{className:'studio-sync'},h('h3',null,'Always in sync'),h('ul',null,...work.rhythm.map(line=>h('li',{key:line},line))))),
      service.fit&&h('aside',{className:'studio-fit','aria-labelledby':'studio-fit-title'},h('h3',{id:'studio-fit-title'},'Is '+service.title+' right for you?'),
        h('p',{className:'studio-fit-label'},'A strong fit if:'),h('ul',{className:'studio-fit-good'},...service.fit.good.map(line=>h('li',{key:line},h(LocalUiIcon,{name:'check'}),h('span',null,line)))),
        h('p',{className:'studio-fit-label'},'Probably not the right choice if:'),h('ul',{className:'studio-fit-no'},...service.fit.notFor.map(line=>h('li',{key:line},h(LocalUiIcon,{name:'close'}),h('span',null,line)))),
        h(ve,{to:'/how-we-work',className:'studio-text-link'},'How you can work with us',h(LocalUiIcon,{name:'arrow-up-right'})))),pager('service-why'))),
    panel('service-faq','FAQ',h(g.Fragment,null,h('div',{className:'studio-panel-inner studio-panel-faq'},
      h('div',{className:'studio-copy','data-reveal':'copy'},label(num('service-faq'),'Questions about '+service.title,'Straight answers before you enquire.'),h(LocalStudioTitle,{lines:['Good questions.','Clear','answers.']}),
        h('div',{className:'studio-faq'},...faq.map((item,index)=>h('details',{key:item.question,open:index===0||undefined},h('summary',null,h('h3',null,item.question),h(LocalUiIcon,{name:'plus'})),h('p',null,item.answer)))),
        h(ve,{to:'/contact',className:'studio-text-link'},'More questions? Talk to us',h(LocalUiIcon,{name:'arrow-up-right'}))),
      h('div',{className:'studio-faq-side'},quote&&h('figure',{className:'studio-quote'},h('blockquote',null,h('p',null,'“'+quote.message+'”')),h('figcaption',null,h('strong',null,quote.name),' · '+quote.designation+', '+quote.company)),
        h('nav',{className:'studio-posts','aria-labelledby':'studio-posts-title'},h('h3',{id:'studio-posts-title'},'Read before you start'),h('ul',null,...posts.map(post=>h('li',{key:post.slug},h(ve,{to:'/blog/'+post.slug},h('span',null,post.title),h('small',null,post.minutes+' min read')))))),h(ve,{to:'/blog',className:'studio-back'},'All articles →'))),pager('service-faq'))),
    panel('service-contact','YOUR NEXT STEP',h(g.Fragment,null,h('div',{className:'studio-panel-inner'},
      h('div',{className:'studio-copy','data-reveal':'copy'},label(num('service-contact'),'Your next digital project','A clear plan. A personal approach.'),h(LocalStudioTitle,{lines:design.contact}),h('p',{className:'studio-description'},'Tell us what needs to work better. We’ll agree what to design, build, configure or connect, along with provider access, costs, testing, ongoing support and handover.'),
        h('ol',{className:'studio-prepare'},...service.prepare.map((item,index)=>h('li',{key:item},h('span',null,item),h('strong',null,String(index+1).padStart(2,'0'))))),
        h('p',{className:'studio-related'},'Works well with ',...service.related.map((slug,index)=>{const item=catalogue.services.find(s=>s.slug===slug);return h(g.Fragment,{key:slug},index>0?' and ':null,h(ve,{to:'/services/'+slug},item.title));}),'.'),
        h('p',{className:'studio-price'},...(pricePackage?['Projects start from ',h('strong',{key:'price'},localRand(pricePackage.from)),'. ']:['Quoted to your scope. ']),h(ve,{to:'/pricing'},'See pricing')),
        h('div',{className:'studio-actions'},h(LocalQuoteLink,{service:service.title,className:'studio-text-link',label:'Get a quote — '+service.title},'Get a quote',h(LocalUiIcon,{name:'arrow-up-right'})),h('a',{href:'#service-intro',className:'studio-back'},'↺ Back to overview'),h(ve,{to:'/services',className:'studio-back'},'← All services'))),
      h(LocalStudioVisual,{kind:service.slug+'-brief',caption:service.title+' · Your project brief'})),pager('service-contact')))),h(LocalSectionRail),h(zn));
}

/** Compatibility only: retired offerings never render as separate services. */
