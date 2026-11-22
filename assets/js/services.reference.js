/** Custom service views inside the captured portfolio shell.
 * Consumed by scripts/build-reference-ui.mjs; not loaded separately.
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
    target: ['M21 12a9 9 0 1 1-9-9M17 12a5 5 0 1 1-5-5M12 12l9-9M16 3h5v5']
  };
  return g.createElement('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.5,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':true},
    ...(paths[name] || paths.grid).map((d,i)=>g.createElement('path',{d,key:i})));
}
/** Shared three-line editorial title; no duplicate animated text for readers. */
function LocalStudioTitle({lines,level='h2',id}) {
  const h=g.createElement;
  return h(level,{className:'studio-title',id},...lines.map((line,index)=>h('span',{key:index,className:index===1?'studio-outline':index===2?'studio-green':''},line)));
}
function LocalStudioVisual({kind='studio',caption='Lulamile M · Independent digital partner',eager=false}) {
  const h=g.createElement;
  return h('figure',{key:kind,className:'studio-visual','data-reveal':'art','data-scene-kind':kind},h('img',{src:'/assets/img/home/'+kind+'.svg?v='+localHomeArtworkVersion,alt:'Original '+kind+' vector illustration by Lulamile M',width:640,height:570,loading:eager?'eager':'lazy',decoding:'async',fetchPriority:eager?'high':undefined}),h('figcaption',null,h('i',{'aria-hidden':true}),caption));
}
function LocalStudioPager({sections,current,next}) {
  const h=g.createElement;
  return h('div',{className:'studio-panel-bottom'},h('a',{href:'#'+(next||sections[0].id)},next?'Scroll to explore ↓':'Back to overview ↑'),
    h('nav',{'aria-label':'Page chapters'},...sections.map((section,index)=>h('a',{key:section.id,href:'#'+section.id,'aria-label':'Chapter '+(index+1)+': '+section.label,'aria-current':index===current?'step':undefined},String(index+1).padStart(2,'0')))),h(ve,{to:'/about'},'More about Lulamile ↓'));
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
  if(slug&&!service)return h(g.Fragment,null,h(Bn),h('main',{id:'main',className:'svc-page'},h('section',{className:'unified-container unified-empty-page','data-background-text':'MY SERVICES'},h('h1',null,'Service not found.'),h(ve,{to:'/services'},'Browse My Services'))),h(zn));
  if(!service){
    const groups=[
      {id:'web',label:'Web & ecommerce',lines:['Digital services.','Your business.','Connected.'],description:'Start with the service you need. I can connect the pieces around your wider goals.',art:'web-services',watermark:'MY SERVICES'},
      {id:'systems',label:'Systems & AI',lines:['Custom systems.','Smarter work.','Your way.'],description:'Scope one focused solution or connect several services around your specific requirements.',art:'connected-services',watermark:'SMARTER WORK'},
      {id:'growth',label:'Design & marketing',lines:['Your brand.','Your audience.','Make contact.'],description:'Give your business a consistent visual presence and connect it with relevant customers.',art:'growth-services',watermark:'MAKE CONTACT'}
    ];
    return h(g.Fragment,null,h(Bn),h('main',{id:'main',className:'svc-page studio-services'},...groups.map((group,index)=>panel(group.id,group.watermark,
      h(g.Fragment,null,h('div',{className:'studio-panel-inner'+(index===1?' studio-art-left':'')},
        h('div',{className:'studio-copy','data-reveal':'copy'},label('0'+(index+1),'My Services','Choose your next step.'),h(LocalStudioTitle,{lines:group.lines,level:index===0?'h1':'h2',id:'heading-'+group.id}),h('p',{className:'studio-description'},group.description),
          h('div',{className:'studio-service-list'},...catalogue.services.filter(item=>item.group===group.id).map(row)),
          index===2&&h('div',{id:'strategy',className:'studio-strategy'},h('p',{className:'studio-subtitle'},'Also / Product & strategy'),...localStrategyServices.map(row)),
          index===2&&h('a',{href:'#web',className:'studio-back'},'↺ Back to My Services')),
        h(LocalStudioVisual,{kind:group.art,eager:index===0,caption:group.label+' · Original vector study'})),h(LocalStudioPager,{sections:groups,current:index,next:groups[index+1]?.id}))))) ,h(zn));
  }
  const presentation={
    'web-hosting':{intro:['Business web','hosting.','Ready for more.'],features:['Built to','perform.','Ready to recover.'],contact:['The right','hosting.','Starts with you.'],art:'hosting',featureLabel:'Hosting features',subtitle:'Performance. Protection. Recovery.',mark:'A STRONG FOUNDATION'},
    'website-design':{intro:['Website','design.','With purpose.'],features:['Look sharp.','Work hard.','Make it easy.'],contact:['Your vision.','My craft.','Let’s build.'],art:'website-design',featureLabel:'Design & development',subtitle:'Thought through. From the start.',mark:'DESIGNED AROUND YOU'},
    ecommerce:{intro:['Ecommerce.','Built to','sell online.'],features:['Easy to find.','Easy to buy.','Built for you.'],contact:['Your store.','Next chapter.','Starts here.'],art:'websites',featureLabel:'Your online store',subtitle:'From first look to checkout.',mark:'SELL ONLINE'},
    'business-systems':{intro:['Business','systems.','Built for you.'],features:['Less friction.','More control.','Your system.'],contact:['Your challenge.','My starting','point.'],art:'systems',featureLabel:'What could we build?',subtitle:'Your processes. Your possibilities.',mark:'BUILT AROUND YOUR BUSINESS'},
    'workflow-automation':{intro:['Workflow','automation.','Practical AI.'],features:['Less repeat.','More flow.','Your way.'],contact:['Your process.','Next level.','Let’s connect.'],art:'automation',featureLabel:'What could work better?',subtitle:'Small tasks. Connected processes.',mark:'KEEP MOVING'},
    'ai-assistants':{intro:['AI assistants.','Real support.','Your business.'],features:['Help customers.','Support teams.','Make it useful.'],contact:['Your knowledge.','Your assistant.','Let’s shape it.'],art:'assistants',featureLabel:'AI assistants',subtitle:'Purposeful work. Practical detail.',mark:'USEFUL AI'},
    'basic-graphic-design':{intro:['Basic graphic','design.','Your brand.'],features:['Look distinct.','Stay consistent.','Be remembered.'],contact:['Your message.','My design.','Let’s create.'],art:'design',featureLabel:'Basic graphic design',subtitle:'Purposeful work. Practical detail.',mark:'YOUR BRAND'},
    'seo-and-search':{intro:['SEO & search.','Get discovered.','Build relevance.'],features:['Strong basics.','Build relevance.','Keep improving.'],contact:['Your audience.','Your priorities.','Let’s get clear.'],art:'search',featureLabel:'SEO & search',subtitle:'Purposeful work. Practical detail.',mark:'GET FOUND'},
    'google-ads':{intro:['Google Ads.','Relevant reach.','Clear goals.'],features:['Right audience.','Clear message.','Track the value.'],contact:['Your offer.','Your goals.','Let’s plan.'],art:'advertising',featureLabel:'Google Ads',subtitle:'Purposeful work. Practical detail.',mark:'RELEVANT REACH'}
  };
  const design=presentation[service.slug]||{intro:['Product design.','Clear strategy.','Better products.'],features:['Understand.','Define.','Design.'],contact:['Your challenge.','Clear direction.','Let’s shape it.'],art:'strategy',featureLabel:'Product design & strategy',subtitle:'Research. Direction. Useful design.',mark:'PRODUCT STRATEGY'};
  // Each complete composition belongs to one page only. Home and Contact
  // keep their original artwork; service chapters never borrow it.
  const introArtwork={
    'web-hosting':'hosting-service','website-design':'website-design',
    ecommerce:'commerce-service','business-systems':'system-service',
    'workflow-automation':'workflow-service','ai-assistants':'assistant-service',
    'basic-graphic-design':'graphic-service','seo-and-search':'search',
    'google-ads':'advertising','product-design-strategy':'strategy'
  }[service.slug];
  const featureArtwork={kind:service.slug+'-features',caption:service.title+' · Practical features'};
  const sections=[{id:'service-intro',label:service.title},{id:'service-features',label:'Features'},{id:'service-contact',label:'Your next project'}];
  return h(g.Fragment,null,h(Bn),h('main',{id:'main',className:'svc-page studio-service-detail'},
    panel('service-intro',service.title.toUpperCase(),h(g.Fragment,null,h('div',{className:'studio-panel-inner'},
      h('div',{className:'studio-copy','data-reveal':'copy'},label('01',service.title,'Built around your business.'),h(LocalStudioTitle,{lines:design.intro,level:'h1'}),h('p',{className:'studio-description'},service.intro),h('p',{className:'studio-tags'},service.tags.join(' · ')),h('div',{className:'studio-actions'},h('a',{href:'#service-features',className:'studio-link-primary'},'Explore '+service.title,h(LocalUiIcon,{name:'arrow-down'})),h(ve,{to:'/contact',className:'studio-text-link'},'Discuss your project',h(LocalUiIcon,{name:'arrow-up-right'})))),
      h(LocalStudioVisual,{kind:introArtwork,eager:true,caption:service.title+' · Original vector study'})),h(LocalStudioPager,{sections,current:0,next:'service-features'}))),
    panel('service-features',design.mark,h(g.Fragment,null,h('div',{className:'studio-panel-inner studio-art-left studio-panel-features'},
      h('div',{className:'studio-copy','data-reveal':'copy'},label('02',design.featureLabel,design.subtitle),h(LocalStudioTitle,{lines:design.features}),
        h('div',{className:'studio-feature-list'},...service.features.map(([title,body],index)=>h('article',{className:'svc-feature',key:title},h('span',{className:'studio-feature-number'},String(index+1).padStart(2,'0')),h('h3',null,title),h('p',null,body)))),
        service.specialisms&&h('details',{className:'studio-specialisms'},h('summary',null,'Focused support & additional options'),...service.specialisms.map(([title,body])=>h('div',{key:title},h('h3',null,title),h('p',null,body)))),
        h('p',{className:'studio-scope'},service.note),h('a',{href:'#service-contact',className:'studio-text-link'},'Discuss your requirements',h(LocalUiIcon,{name:'arrow-up-right'}))),
      h(LocalStudioVisual,{kind:featureArtwork.kind,caption:featureArtwork.caption})),h(LocalStudioPager,{sections,current:1,next:'service-contact'}))),
    panel('service-contact','YOUR NEXT STEP',h(g.Fragment,null,h('div',{className:'studio-panel-inner'},
      h('div',{className:'studio-copy','data-reveal':'copy'},label('03','Your next digital project','A clear plan. A personal approach.'),h(LocalStudioTitle,{lines:design.contact}),h('p',{className:'studio-description'},'Tell me what needs to work better. We’ll agree the requirements, content responsibilities, budget and timeline before design, build and review.'),
        h('ol',{className:'studio-prepare'},...service.prepare.map((item,index)=>h('li',{key:item},h('span',null,item),h('strong',null,String(index+1).padStart(2,'0'))))),
        h('p',{className:'studio-related'},'Works well with ',...service.related.map((slug,index)=>{const item=catalogue.services.find(s=>s.slug===slug);return h(g.Fragment,{key:slug},index>0?' and ':null,h(ve,{to:'/services/'+slug},item.title));}),'.'),
        h('div',{className:'studio-actions'},h(ve,{to:'/contact',className:'studio-text-link'},'Discuss '+service.title,h(LocalUiIcon,{name:'arrow-up-right'})),h('a',{href:'#service-intro',className:'studio-back'},'↺ Back to overview'),h(ve,{to:'/services',className:'studio-back'},'← My Services'))),
      h(LocalStudioVisual,{kind:service.slug+'-brief',caption:service.title+' · Your project brief'})),h(LocalStudioPager,{sections,current:2})))),h(zn));
}

/** Compatibility only: retired offerings never render as separate services. */
function LocalRetiredServicePage() {
  const navigate=va();
  const pathname=Qt().pathname.replace(/\/$/,'');
  const destination=localRetiredServiceRoutes[pathname]||'/services';
  g.useEffect(()=>navigate(destination,{replace:true}),[destination,navigate]);
  return null;
}
