/** One shared application shell for Portfolio, About, Contact and Tools. */
function LocalPageFrame({title,description,children,className=''}) {
  const h=g.createElement;
  return h(g.Fragment,null,
    h(Bn),h('main',{id:'main',className},children),h(zn));
}
function LocalEnquiryDialog() {
  const h=g.createElement;
  const [status,setStatus]=g.useState('idle');
  const [error,setError]=g.useState('');
  const submit=async event=>{
    event.preventDefault();
    if(status==='sending') return;
    const form=event.currentTarget;
    if(!form.reportValidity()) return;
    setStatus('sending');setError('');
    try {
      const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
      if(!response.ok) throw new Error('Submission failed');
      setStatus('success');form.reset();
    } catch {
      setStatus('error');setError('Your message could not be sent. Please try again, or email '+localSiteContent.email+'.');
    }
  };
  const close=event=>event.currentTarget.closest('dialog').close();
  return h('dialog',{id:'footer-enquiry',className:'enquiry-dialog','aria-labelledby':'enquiry-title','aria-describedby':'enquiry-description',onKeyDown:event=>{if(event.key!=='Tab')return;const fields=[...event.currentTarget.querySelectorAll('button:not(:disabled), input:not([type="hidden"]), select, textarea, a[href]')].filter(field=>field.tabIndex>=0&&field.getClientRects().length);const first=fields[0],last=fields[fields.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}},onClick:event=>{if(event.target===event.currentTarget){const box=event.currentTarget.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)event.currentTarget.close();}}},
    h('div',{className:'enquiry-dialog-heading'},h('p',{className:'hybrid-eyebrow'},'A good place to start'),h('button',{type:'button',className:'enquiry-close','aria-label':'Close enquiry form',onClick:close},h(LocalUiIcon,{name:'close'}))),
    h('h2',{id:'enquiry-title'},'Let’s make it work.'),h('p',{id:'enquiry-description'},'Tell me a little about your idea. I’ll take it from there.'),
    status==='success'?h('div',{className:'enquiry-success',role:'status'},h(LocalUiIcon,{name:'check'}),h('h3',null,'Message sent.'),h('p',null,'Thanks for getting in touch. I’ll reply to the email address you shared.'),h('button',{type:'button',className:'hybrid-button',onClick:()=>setStatus('idle')},'Send another message')):
    h('form',{action:'https://formspree.io/f/xvkgqalq',method:'POST',className:'unified-contact-form enquiry-form',onSubmit:submit,'aria-busy':status==='sending'},
      h('input',{type:'hidden',name:'_subject',value:'New website enquiry — LulaZel'}),
      h('div',{hidden:true,'aria-hidden':true},h('label',null,'Leave this empty',h('input',{name:'_gotcha',tabIndex:-1,autoComplete:'off'}))),
      h('div',{className:'enquiry-fields'},h('label',null,'Your name',h('input',{name:'name',required:true,autoComplete:'name',placeholder:'Your name',maxLength:100})),h('label',null,'Email address',h('input',{name:'email',type:'email',required:true,autoComplete:'email',placeholder:'you@business.com',maxLength:200}))),
      h('label',null,'Phone number (optional)',h('input',{name:'phone',type:'tel',autoComplete:'tel',placeholder:'+27',maxLength:40})),
      h('label',null,'I’m interested in',h('select',{name:'service',defaultValue:''},h('option',{value:''},'Let’s work it out together'),...localServiceCatalogue.services.concat(localStrategyServices).map(item=>h('option',{key:item.slug,value:item.title},item.title)))),
      h('label',null,'What do you have in mind?',h('textarea',{name:'message',required:true,rows:4,placeholder:'Your idea, goals and rough timeline…',maxLength:5000})),
      h('p',{className:'unified-form-note'},'Your details and message are sent via Formspree so I can respond to your enquiry. ',h(ve,{to:'/privacy'},'Privacy notice')),
      h('p',{className:'enquiry-status',role:status==='error'?'alert':'status','aria-live':'polite'},status==='sending'?'Sending your message…':error),
      h('button',{type:'submit',className:'hybrid-button',disabled:status==='sending'},status==='sending'?'Sending…':'Send enquiry',h(LocalUiIcon,{name:'send'}))));
}
function LocalSiteFooter() {
  const h=g.createElement;
  const isContact=Qt().pathname.replace(/\/$/,'')==='/contact';
  const iconBody=(icon,caption)=>[h('span',{className:'footer-icon-frame',key:'icon'},h(LocalUiIcon,{name:icon})),h('span',{className:'footer-icon-label',key:'label'},caption)];
  const action=(icon,caption,label,href,external=false)=>h('a',{href,className:'footer-contact-icon','aria-label':label,title:label,...(external?{target:'_blank',rel:'noopener noreferrer'}:{})},...iconBody(icon,caption));
  return h('footer',{className:'unified-footer'},h('div',{className:'unified-container'},
    !isContact&&h('div',{className:'unified-footer-top'},h('div',null,h('p',{className:'hybrid-eyebrow'},'Have something in mind?'),h('h2',null,'Let’s make it ',h('span',null,'work.'))),
      h('div',{className:'footer-contact-icons',role:'group','aria-label':'Ways to connect'},
        action('linkedin','LinkedIn','Connect with Lulamile on LinkedIn','https://www.linkedin.com/in/lulamile-mkhungela/',true),
        action('handset','Call','Call +27 83 719 5064','tel:+27837195064'),
        action('mail','Email','Email '+localSiteContent.email,'mailto:'+localSiteContent.email),
        action('calendar','Meeting','Meeting — book a meeting with Lulamile','https://calendly.com/lulamile_m/meet-lulamile?month=2026-11',true),
        h('button',{type:'button',className:'footer-contact-icon','aria-label':'Enquiry — open enquiry form',title:'Send an enquiry','aria-haspopup':'dialog','aria-controls':'footer-enquiry',onClick:event=>{const dialog=event.currentTarget.closest('footer').querySelector('#footer-enquiry');dialog.showModal();dialog.querySelector('input[name="name"]')?.focus();}},...iconBody('form','Enquiry')))),
    h('div',{className:'unified-footer-bottom'},h('p',null,'© '+new Date().getFullYear()+' LulaZel · by Lulamile M · South Africa'),h(ve,{to:'/privacy',className:'footer-privacy'},'Privacy & image rights'),
      h('nav',{'aria-label':'Footer'},h(ve,{to:'/services'},'My Services'),h(ve,{to:'/portfolio'},'Portfolio'),h(ve,{to:'/about'},'About')))),h(LocalEnquiryDialog));
}
function LocalPortfolioPage() {
  const h=g.createElement;
  const location=Qt();
  const navigate=va();
  const requested=new URLSearchParams(location.search).get('filter') || 'all';
  const selected=localPortfolioCategories.some(item=>item.id===requested)?requested:'all';
  const visible=localPortfolioProjects.filter(item=>selected==='all'||item.categories.includes(selected));
  const [collapsed,setCollapsed]=g.useState({});
  const groups=localPortfolioCategories.filter(item=>item.id!=='all'&&(selected==='all'||item.id===selected)).map(category=>({category,projects:localPortfolioProjects.filter(project=>project.categories.includes(category.id))}));
  const renderCards=(projects,category)=>h('div',{className:'pf-grid',role:'region',tabIndex:0,'aria-label':category+' project previews'},...projects.map((project,index)=>h(LocalPortfolioCard,{key:project.id,project,index,total:projects.length,category})));
  const descriptions={website:'Business websites shaped around clear information and a useful next step.','product-design':'Products and experiences shaped around real needs.',apps:'Cross-platform products and mobile experiences.','frontend-dev':'Interfaces, tools and frontend builds.','ai-prompt':'Premium design resources and free prompts to make your own.'};
  g.useEffect(()=>{
    const id=location.hash?.slice(1);
    if(id&&(/^(portfolio-projects|pf-free-title)$/.test(id)||id.startsWith('portfolio-category-')))requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'}));
  },[selected,location.hash]);

  return h(LocalPageFrame,{title:'Portfolio',description:'Websites, apps, frontend work and product-design projects from LulaZel.',className:'pf-page'},
    h('section',{className:'pf-hero'},h('div',{className:'unified-container pf-hero-inner'},
      h('div',{className:'pf-hero-copy'},h('p',{className:'hybrid-eyebrow'},h('span'),'01 / My Portfolio'),
        h('p',{className:'pf-hero-overline'},'Real challenges. Individual solutions.'),
        h('h1',null,h('span',null,'My work.'),h('span',{className:'hybrid-outline'},'Your next'),h('span',{className:'hybrid-green'},'inspiration.')),
        h('p',{className:'pf-hero-description'},'Explore products, websites and digital experiences shaped around real needs. Different businesses, different challenges—one considered approach to design.'),
        h('div',{className:'pf-hero-actions'},h('a',{href:'#portfolio-projects',className:'hybrid-button'},'Explore the projects',h(LocalUiIcon,{name:'arrow-down'})),h(ve,{to:'/contact',className:'hybrid-text-link'},'Discuss your project',h(LocalUiIcon,{name:'arrow-up-right'})))),
      h(LocalDigitalVisual,{label:'Design × real-world challenges',icon:'portfolio'})),
      h('div',{className:'pf-hero-bottom unified-container'},h('a',{href:'#portfolio-projects'},'Scroll to explore',h(LocalUiIcon,{name:'arrow-down'})),h('span',null,localPortfolioProjects.length+' selected projects & studies'),h('span',null,'Websites · Apps · Product design')),
      h('div',{className:'pf-watermark','aria-hidden':true},'MY PORTFOLIO')),
    h('section',{id:'portfolio-projects',className:'pf-projects unified-container','aria-labelledby':'portfolio-heading'},
      h('div',{className:'pf-toolbar'},h('div',null,h('p',{className:'hybrid-eyebrow'},'Explore the work'),h('h2',{id:'portfolio-heading',className:'sr-only'},'Portfolio projects'))),
      h('nav',{className:'pf-category-jumps','aria-label':'Portfolio categories'},...localPortfolioCategories.map(category=>h(ve,{key:category.id,to:category.id==='all'?'/portfolio/#portfolio-projects':'/portfolio/?filter='+category.id+'#portfolio-projects','aria-current':selected===category.id?'page':undefined,className:selected===category.id?'is-active':''},category.label))),
      h('div',{className:'pf-category-sections'},...groups.map(({category,projects})=>{
        const expanded=!collapsed[category.id],region='pf-category-content-'+category.id;
        return h('section',{key:category.id,id:'portfolio-category-'+category.id,className:'pf-category-section','aria-labelledby':'pf-category-title-'+category.id},
          h('div',{className:'pf-category-heading'},h('div',null,h('p',{className:'hybrid-eyebrow'},category.label+' projects'),h('h2',{id:'pf-category-title-'+category.id},category.label+' projects'),h('p',null,descriptions[category.id])),
            h('button',{type:'button',className:'pf-category-toggle','aria-label':(expanded?'Collapse ':'Expand ')+category.label+' projects','aria-expanded':expanded,'aria-controls':region,onClick:()=>setCollapsed(previous=>({...previous,[category.id]:!previous[category.id]}))},h(LocalUiIcon,{name:expanded?'minus':'plus'}))),
          h('div',{id:region,className:'pf-category-content',hidden:!expanded},category.id==='ai-prompt'?
            h('div',{className:'pf-prompt-groups'},...['premium','free'].map(tier=>h('section',{key:tier,className:'pf-prompt-group','aria-labelledby':'pf-'+tier+'-title'},h('div',{className:'pf-prompt-group-heading'},h('h3',{id:'pf-'+tier+'-title'},tier==='premium'?'Premium resources':'Free prompts')),renderCards(projects.filter(project=>project.promptTier===tier),category.id)))):renderCards(projects,category.id)));
      }))));

}
function LocalAboutPage() {
  const h=g.createElement;
  return h(LocalPageFrame,{title:'About',description:'Lulamile M — designer, founder and builder based in South Africa.',className:'unified-page'},
    h('section',{className:'unified-about-hero','data-background-text':'ABOUT LULAMILE'},h('div',{className:'unified-container unified-about-grid'},
      h('div',null,h('p',{className:'hybrid-eyebrow'},h('span'),'About / Lulamile M'),h('h1',null,'Curious by nature.',h('br'),h('span',{className:'hybrid-outline'},'Designer by craft.'),h('br'),h('span',{className:'hybrid-green'},'Builder at heart.')),h('p',{className:'hybrid-hero-description'},localSiteContent.about.intro)),
      h('img',{src:'/assets/img/lulamile.webp',alt:'Lulamile M',width:900,height:900}))),
    h('section',{className:'unified-container unified-about-copy'},h('p',{className:'svc-kicker'},'The person behind the work'),h('h2',null,'Design is a way of seeing.'),...localSiteContent.about.paragraphs.map((paragraph,index)=>h('p',{key:index},paragraph)),h('p',{className:'unified-about-close'},localSiteContent.about.close)));
}
function LocalContactPage() {
  const h=g.createElement;
  return h(LocalPageFrame,{title:'Let’s Talk',description:'Discuss your next website, product or digital project with LulaZel.',className:'unified-contact-page'},
    h('section',{className:'contact-intro unified-container',id:'contact-intro','data-background-text':'LET’S TALK'},
      h('div',{className:'contact-intro-copy'},h('p',{className:'contact-section-label'},h('span',{'aria-hidden':true}),'01 / Contact LulaZel'),h('p',{className:'contact-section-subtitle'},'South Africa & remote enquiries welcome.'),
        h('h1',null,h('span',null,'Let’s talk.'),h('span',{className:'contact-title-outline'},'Your ideas.'),h('span',{className:'hybrid-green'},'Our next step.')),
        h('p',{className:'hybrid-hero-description'},'Tell me what needs to work better and where you want to go. From a first idea to a clearer digital direction, a conversation is a good place to start. Share your time zone and a convenient time if you’d like to arrange a call.'),
        h('div',{className:'contact-direct'},
          h('a',{href:'tel:+27837195064'},h(LocalUiIcon,{name:'handset'}),h('span',null,'Call',h('strong',null,'+27 83 719 5064')),h(LocalUiIcon,{name:'arrow-up-right'})),
          h('a',{href:'https://wa.me/27837195064',target:'_blank',rel:'noopener noreferrer'},h(LocalUiIcon,{name:'whatsapp'}),h('span',null,'WhatsApp',h('strong',null,'+27 83 719 5064')),h(LocalUiIcon,{name:'arrow-up-right'})),
          h('a',{href:'mailto:'+localSiteContent.email},h(LocalUiIcon,{name:'mail'}),h('span',null,'Email',h('strong',null,localSiteContent.email)),h(LocalUiIcon,{name:'arrow-up-right'}))),
        h('div',{className:'contact-extra-actions'},
          h('a',{href:'https://calendly.com/lulamile_m/meet-lulamile?month=2026-11',target:'_blank',rel:'noopener noreferrer'},h(LocalUiIcon,{name:'calendar'}),'Book a meeting'),
          h('a',{href:'https://www.linkedin.com/in/lulamile-mkhungela/',target:'_blank',rel:'noopener noreferrer'},h(LocalUiIcon,{name:'linkedin'}),'LinkedIn'),
          h('button',{type:'button',onClick:()=>{const dialog=document.getElementById('footer-enquiry');dialog.showModal();dialog.querySelector('input[name="name"]')?.focus();},'aria-haspopup':'dialog','aria-controls':'footer-enquiry'},h(LocalUiIcon,{name:'form'}),'Send an enquiry')),
        h('a',{href:'#contact-next',className:'hybrid-text-link'},'What happens next?',h(LocalUiIcon,{name:'arrow-down'}))),
      h('div',{className:'contact-art'},h('img',{src:'/assets/img/portfolio/contact-conversation.svg?v='+localHomeArtworkVersion,alt:'Two conversation shapes linked by a sculptural telephone receiver',width:640,height:570}),h('p',null,'A CONVERSATION IS A GOOD PLACE TO START.'))),
    h('section',{className:'contact-next',id:'contact-next','aria-labelledby':'contact-next-title'},
      h('div',{className:'contact-next-watermark','aria-hidden':true},'NEXT STEP'),
      h('div',{className:'contact-next-layout'},
        h('figure',{className:'contact-next-visual'},
          h('img',{src:'/assets/img/portfolio/contact-next-step.svg?v='+localHomeArtworkVersion,alt:'Three dimensional milestones connect a conversation, a compass and a destination flag',width:640,height:570,loading:'lazy'}),
          h('figcaption',null,h('span',{'aria-hidden':true}),'Contact LulaZel')),
        h('div',{className:'contact-next-copy'},
          h('p',{className:'contact-section-label'},h('span',{'aria-hidden':true}),'02 / What happens next'),
          h('p',{className:'contact-section-subtitle'},'Clear communication. From the start.'),
          h('h2',{id:'contact-next-title'},h('span',null,'I listen.'),h('span',{className:'contact-title-outline'},'We define.'),h('span',{className:'hybrid-green'},'We build.')),
          h('div',{className:'contact-steps'},...[['Tell me what you need','Share your business, goals, current tools and any examples that help explain the project.'],['Agree a practical scope','We clarify requirements, deliverables, responsibilities, budget and timing before work begins.'],['Plan the work together','We agree review points, communication and the steps toward launch or handover.']].map(([title,copy],index)=>h('article',{key:title},h('h3',null,'0'+(index+1)+' / '+title),h('p',null,copy)))),
          h('p',{className:'contact-next-note'},'You don’t need a complete technical brief. Explore ',h(ve,{to:'/services'},'my digital services'),' or simply describe the problem you want to solve.'),
          h('a',{href:'#contact-intro',className:'contact-back'},'↺ Back to contact details'))),
      h('div',{className:'contact-section-bottom'},h('a',{href:'#contact-intro'},'Back to contact details ↑'),h('span',null,'01 — ',h('strong',null,'02')),h(ve,{to:'/about'},'About the designer ↓'))));

}
function LocalToolsPage() {
  const h=g.createElement;
  return h(LocalPageFrame,{title:'Tools',description:localToolsContent.intro.lede,className:'unified-page'},
    h(LocalHybridHero,{eyebrow:'Resources / The builder toolkit',line1:'Better tools.',line2:'Clearer thinking.',line3:'Build with intent.',description:localToolsContent.intro.lede,primary:{href:'#toolkit',label:'Explore tools'},secondary:{href:'/services',label:'My Services'},label:'The builder toolkit',icon:'toolkit'}),
    h('section',{id:'toolkit',className:'unified-container unified-toolkit'},h('p',{className:'svc-kicker'},'Free resources'),h('h2',null,'The builder toolkit'),h('div',{className:'unified-tool-grid'},...localToolsContent.tools.map(tool=>h('article',{className:'unified-tool',key:tool.id},h('p',{className:'svc-kicker'},tool.kind),h('h3',null,tool.name),h('p',null,tool.blurb),h('details',null,h('summary',null,'Workflow & files'),h('p',null,tool.ships),h('ol',null,...tool.steps.map((step,index)=>h('li',{key:index},step.title))))))),h('a',{href:'https://github.com/LulamileMkhungela/devzigner',target:'_blank',rel:'noopener noreferrer',className:'svc-button'},'View toolkit on GitHub ↗')));
}
function LocalNotFoundPage() {
  const h=g.createElement;
  return h(LocalPageFrame,{title:'Page not found',description:'This page could not be found.',className:'unified-page'},h('section',{className:'unified-container unified-empty-page','data-background-text':'NOT FOUND'},h('p',{className:'hybrid-eyebrow'},'404 / Page not found'),h('h1',null,'Let’s get you back on track.'),h(ve,{to:'/',className:'hybrid-button'},'Back to Home ↗')));
}
function LocalBackToTop() {
  const h=g.createElement,[visible,setVisible]=g.useState(false),returning=g.useRef(false),{pathname}=Qt();
  g.useEffect(()=>{
    returning.current=false;
    const update=()=>{
      if(window.scrollY<=2)returning.current=false;
      setVisible(window.scrollY>160||(returning.current&&window.scrollY>2));
    };
    update();
    window.addEventListener('scroll',update,{passive:true});
    window.addEventListener('pageshow',update);
    return()=>{window.removeEventListener('scroll',update);window.removeEventListener('pageshow',update);};
  },[pathname]);
  return h('button',{type:'button',className:'site-back-to-top',hidden:!visible,tabIndex:visible?0:-1,'aria-label':'Back to top',title:'Back to top',onClick:()=>{
    returning.current=true;
    const main=document.getElementById('main');
    if(main){main.setAttribute('tabindex','-1');main.focus({preventScroll:true});}
    window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }},h(LocalUiIcon,{name:'arrow-up'}));
}


function LocalPrivacyPage() {
  const h=g.createElement;
  return h(LocalPageFrame,{title:'Privacy & image rights',description:'How enquiries and images are handled on LulaZel.',className:'unified-page'},
    h('article',{className:'unified-container unified-about-copy','data-background-text':'YOUR PRIVACY'},h('p',{className:'hybrid-eyebrow'},'Privacy & image rights'),h('h1',null,'Your details. Your choices.'),
      h('h2',null,'Who to contact'),h('p',null,'LulaZel is an independent practice based in South Africa. For privacy questions, correction or deletion requests, email ',h('a',{href:'mailto:mkhungela.l@gmail.com'},'mkhungela.l@gmail.com'),'.'),
      h('h2',null,'When you send an enquiry'),h('p',null,'The contact forms send your name, email, selected service, message and optional phone number to Formspree to deliver your enquiry. This information is used to respond and discuss your request. Please do not submit passwords, identity numbers, financial records or sensitive personal information.'),
      h('p',null,'Formspree processes submissions on its infrastructure, which may be outside South Africa. Its own privacy policy applies to that processing. You can email directly instead. Request access, correction or deletion using the email above; relevant legal or business-record obligations may affect what can be removed.'),h('a',{href:'https://formspree.io/legal/privacy-policy/',target:'_blank',rel:'noopener noreferrer'},'Formspree privacy policy'),
      h('h2',null,'External services and display preferences'),h('p',null,'WhatsApp, LinkedIn, Calendly, shop links and other external project destinations have their own privacy terms. Some original premium cover images load from external storage, which receives the ordinary network information needed to deliver them. The site may store display preferences in your browser. No advertising or analytics tracking is intentionally installed in this release.'),
      h('h2',null,'Images and design resources'),h('p',null,'Portfolio images and brand marks remain the property of their respective owners. They are displayed to document the work, not offered as an image library. Do not reuse them without permission. Free prompt text is intentionally available to copy or download; premium products are accessed through the linked shop.'),
      h('p',null,'Image right-click and dragging are discouraged, but browser-visible images cannot be made impossible to save or capture. For reuse permission, contact LulaZel.'),
      h('p',null,'Last updated: 21 November 2026.')));
}
