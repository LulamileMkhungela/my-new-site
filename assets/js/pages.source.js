/** Per-history-entry positions, with a session fallback for refreshed details. */
const localRoutePositions=new Map();
function LocalReadRoutePosition(key){
 if(localRoutePositions.has(key))return localRoutePositions.get(key);
 try{return JSON.parse(sessionStorage.getItem('lulazel-position-'+key)||'null');}catch{return null;}
}
/** One shared application shell for Portfolio, About, Contact and Tools. */
/** Auto-type text. Reveals the sentence character-by-character once it enters
 * the viewport. Contact page only — used on the hero invitation line. */
function LocalTypedText({text,className=''}) {
  const h=g.createElement;
  const ref=g.useRef(null);
  const [count,setCount]=g.useState(0);
  g.useEffect(()=>{
    const node=ref.current;if(!node)return;
    const reduced=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced||!('IntersectionObserver' in window)){setCount(text.length);return;}
    let timer=0;
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          io.disconnect();
          let i=0;
          const tick=()=>{i++;setCount(i);if(i<text.length)timer=setTimeout(tick,32+Math.random()*40);};
          tick();
        }
      });
    },{threshold:.4});
    io.observe(node);
    return()=>{io.disconnect();if(timer)clearTimeout(timer);};
  },[text]);
  return h('span',{ref,className:'typed-text '+className,'aria-label':text},text.slice(0,count));
}
function LocalPageFrame({title,description,children,className=''}) {
  const h=g.createElement;
  return h(g.Fragment,null,
    h(Bn),h('main',{id:'main',className},children),h(LocalSectionRail),h(zn));
}
function LocalEnquiryDialog() {
  const h=g.createElement;
  const [status,setStatus]=g.useState('idle');
  const [error,setError]=g.useState('');
  const submit=async event=>{
    event.preventDefault();
    if(status==='sending') return;
    const form=event.currentTarget;
    // Email or phone: at least one is needed so we can reply.
    const email=form.elements.email,phone=form.elements.phone;
    email.setCustomValidity(!email.value.trim()&&!phone.value.trim()?'Please add an email address or a phone number so we can reply.':'');
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
    h('h2',{id:'enquiry-title'},'Let’s make it work.'),h('p',{id:'enquiry-description'},'Tell us a little about your project. We’ll reply with next steps and, where possible, a starting quote.'),
    status==='success'?h('div',{className:'enquiry-success',role:'status'},h(LocalUiIcon,{name:'check'}),h('h3',null,'Message sent.'),h('p',null,'Thanks for getting in touch. We’ll reply using the email or phone number you shared.'),h('button',{type:'button',className:'hybrid-button',onClick:()=>setStatus('idle')},'Send another message')):
    h('form',{action:'https://formspree.io/f/xvkgqalq',method:'POST',className:'unified-contact-form enquiry-form',onSubmit:submit,'aria-busy':status==='sending'},
      h('input',{type:'hidden',name:'_subject',value:'New website enquiry — LulaZel'}),
      h('div',{hidden:true,'aria-hidden':true},h('label',null,'Leave this empty',h('input',{name:'_gotcha',tabIndex:-1,autoComplete:'off'}))),
      h('div',{className:'enquiry-fields'},h('label',null,'Your name',h('input',{name:'name',required:true,autoComplete:'name',placeholder:'Your name',maxLength:100})),h('label',null,'Email address',h('input',{name:'email',type:'email',autoComplete:'email',placeholder:'you@business.com',maxLength:200,'aria-describedby':'enquiry-reach-note',onInput:event=>event.currentTarget.setCustomValidity('')}))),
      h('label',null,'Phone number',h('input',{name:'phone',type:'tel',autoComplete:'tel',placeholder:'+27',maxLength:40,pattern:'[0-9+\\(\\)\\s\\-]{7,40}',title:'Digits, spaces and + ( ) - only','aria-describedby':'enquiry-reach-note',onInput:event=>event.currentTarget.form.elements.email.setCustomValidity('')})),
      h('p',{id:'enquiry-reach-note',className:'enquiry-reach-note'},'Email or phone — we need at least one to reply. The other is optional.'),
      h('label',null,'What do you need?',h('select',{name:'service',defaultValue:''},h('option',{value:''},'Not sure yet — let’s work it out together'),...localServiceCatalogue.services.concat(localStrategyServices).map(item=>h('option',{key:item.slug,value:item.title},item.title)))),
      h('div',{className:'enquiry-fields'},h('label',null,'Budget (optional)',h('select',{name:'budget',defaultValue:''},...[['','Select a range'],['Under R20,000'],['R20,000 – R50,000'],['R50,000 – R100,000'],['R100,000+'],['Not sure yet']].map(([value,text])=>h('option',{key:value,value},text||value)))),h('label',null,'Timeline (optional)',h('select',{name:'timeline',defaultValue:''},...[['','Select a timeline'],['As soon as possible'],['Within 1–2 months'],['In 3+ months'],['Flexible']].map(([value,text])=>h('option',{key:value,value},text||value))))),
      h('label',null,'What do you have in mind?',h('textarea',{name:'message',required:true,rows:4,placeholder:'Your idea, goals and rough timeline…',maxLength:5000})),
      h('p',{className:'unified-form-note'},'Your details and message are sent via Formspree so we can respond to your enquiry. ',h(ve,{to:'/privacy'},'Privacy notice')),
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
        action('handset','Call','Call +27 83 719 5064','tel:+27837195064'),
        action('mail','Email','Email '+localSiteContent.email,'mailto:'+localSiteContent.email),
        action('calendar','Meeting','Meeting — book a meeting with LulaZel','https://calendly.com/lulamile_m/meet-lulamile?month=2026-11',true),
        h('button',{type:'button',className:'footer-contact-icon','aria-label':'Enquiry — open enquiry form',title:'Send an enquiry','aria-haspopup':'dialog','aria-controls':'footer-enquiry',onClick:event=>{const dialog=event.currentTarget.closest('footer').querySelector('#footer-enquiry');dialog.showModal();dialog.querySelector('input[name="name"]')?.focus();}},...iconBody('form','Enquiry')))),
    h('div',{className:'unified-footer-bottom'},h('p',null,'© '+new Date().getFullYear()+' LulaZel Digital Studio · Johannesburg, South Africa'),h(ve,{to:'/privacy',className:'footer-privacy'},'Privacy & image rights'),
      h('nav',{'aria-label':'Footer'},h(ve,{to:'/services'},'Services'),h(ve,{to:'/portfolio'},'Work'),h(ve,{to:'/pricing'},'Pricing'),h(ve,{to:'/blog'},'Blog'),h(ve,{to:'/how-we-work'},'How we work'),h(ve,{to:'/about'},'About')))),h(LocalEnquiryDialog));
}
/** Instant project estimate in South African rand.
 * Multi-step wizard: project type → scope questions → a Rand range.
 * Selecting an answer auto-advances to the next step (no Next button).
 * "Send my estimate" submits the estimate details to the Formspree endpoint. */
function LocalCalculator({number='04'}={}) {
  const h=g.createElement;
  const [step,setStep]=g.useState(0);
  const [answers,setAnswers]=g.useState({});
  const [otherText,setOtherText]=g.useState('');
  const [done,setDone]=g.useState(false);
  const [sending,setSending]=g.useState(false);
  const [sent,setSent]=g.useState(false);
  const FORMSPREE='https://formspree.io/f/xvkgqalq';
  const types=[
    ...localSiteContent.pricing.packages.map(item=>({id:item.id,label:item.calculatorLabel,base:[item.from,item.to],hint:item.hint,icon:item.icon})),
    {id:'other',label:'Something else',base:[18000,55000],hint:'Tell us what you have in mind',icon:'plus'}
  ];
  const type=types.find(item=>item.id===answers.type)||types[0];
  // Integration add-ons are context-sensitive: each project type only offers
  // the add-ons that make sense for it (a branding project has none).
  const integrationSets={
    website:[{v:'forms',l:'Forms / CRM',d:.12},{v:'booking',l:'Booking / calendar',d:.15},{v:'payments',l:'Payments / shop',d:.2},{v:'ai',l:'AI assistant',d:.25}],
    ecommerce:[{v:'payments',l:'Payments / shop',d:.2},{v:'forms',l:'Forms / CRM',d:.12},{v:'ai',l:'AI assistant',d:.25}],
    app:[{v:'forms',l:'Forms / CRM',d:.12},{v:'booking',l:'Booking / calendar',d:.15},{v:'payments',l:'Payments / shop',d:.2},{v:'ai',l:'AI assistant',d:.25}],
    system:[{v:'forms',l:'Forms / CRM',d:.12},{v:'booking',l:'Booking / calendar',d:.15},{v:'payments',l:'Payments / shop',d:.2},{v:'ai',l:'AI assistant',d:.25}],
    brand:[],
    other:[{v:'forms',l:'Forms / CRM',d:.12},{v:'booking',l:'Booking / calendar',d:.15},{v:'payments',l:'Payments / shop',d:.2},{v:'ai',l:'AI assistant',d:.25}]
  };
  const questions=[
    {id:'level',q:'What level of finish are you aiming for?',type:'single',opts:[{v:'std',l:'Clean & polished',d:1},{v:'prem',l:'Award-level, custom',d:1.8}]},
    {id:'pages',q:'How many pages or screens?',type:'single',opts:[{v:'s1',l:'Up to 5',d:.8},{v:'s5',l:'6–15',d:1},{v:'s15',l:'16+',d:1.35}]},
    ...(integrationSets[type.id].length?[{id:'integrations',q:'Need forms, booking, payments or integrations?',type:'multi',opts:integrationSets[type.id]}]:[]),
    {id:'timeline',q:'How soon do you need it?',type:'single',opts:[{v:'flex',l:'Flexible',d:1},{v:'soon',l:'Within a month',d:1.15},{v:'urgent',l:'ASAP',d:1.3}]}
  ];
  const q=id=>questions.find(item=>item.id===id);
  const estimate=()=>{
    let lo=type.base[0],hi=type.base[1];
    const level=(q('level').opts.find(o=>o.v===answers.level)||{d:1}).d;
    const pages=(q('pages').opts.find(o=>o.v===answers.pages)||{d:1}).d;
    const timeline=(q('timeline').opts.find(o=>o.v===answers.timeline)||{d:1}).d;
    let extra=0;
    (answers.integrations||[]).forEach(v=>{const o=q('integrations')?.opts.find(x=>x.v===v);if(o)extra+=o.d;});
    lo=Math.round((lo*level*pages+lo*extra)*1000)/1000;
    hi=Math.round((hi*level*pages+hi*extra)*timeline*1000)/1000;
    return {lo:Math.max(8000,Math.round(lo/1000)*1000),hi:Math.round(hi/1000)*1000};
  };
  const range=estimate();
  // Position the band on a scale from the project type's base range.
  const rangeSpan=type.base[1]-type.base[0]||1;
  const loPct=Math.max(0,Math.min(100,((range.lo-type.base[0])/rangeSpan)*100));
  const hiPct=Math.max(0,Math.min(100,((range.hi-type.base[0])/rangeSpan)*100));
  const chips=[];
  if(answers.level)chips.push(q('level').opts.find(o=>o.v===answers.level)?.l);
  if(answers.pages)chips.push(q('pages').opts.find(o=>o.v===answers.pages)?.l);
  if(answers.timeline)chips.push(q('timeline').opts.find(o=>o.v===answers.timeline)?.l);
  (answers.integrations||[]).forEach(v=>{const label=q('integrations')?.opts.find(o=>o.v===v)?.l;if(label)chips.push(label);});
  // Auto-advance: tapping any option advances to the next step immediately.
  // Multi-select options accumulate — each tap adds/toggles and advances.
  // "Other" type does not auto-advance on selection — the user types their description.
  const pick=key=>value=>{
    setAnswers(prev=>{
      const current=prev[key];
      if(key==='integrations'){
        const list=Array.isArray(current)?current:[];
        const next=list.includes(value)?list.filter(v=>v!==value):[...list,value];
        return {...prev,[key]:next};
      }
      return {...prev,[key]:value};
    });
    if(!(key==='type'&&value==='other'))advance();
  };
  const advance=()=>{if(step<questions.length-1)setStep(step+1);else setDone(true);};
  const back=()=>{if(step>0)setStep(step-1);if(done)setDone(false);};
  const fmt=localRand;
  const sendEstimate=async()=>{
    if(sending)return;
    setSending(true);
    const selected=(q('level')?.opts.find(o=>o.v===answers.level)?.l||'')+', '+(q('pages')?.opts.find(o=>o.v===answers.pages)?.l||'')+', '+(q('timeline')?.opts.find(o=>o.v===answers.timeline)?.l||'');
    const integrations=(answers.integrations||[]).map(v=>q('integrations')?.opts.find(o=>o.v===v)?.l).filter(Boolean).join(', ');
    const data=new FormData();
    data.append('estimate_project',type.label);
    data.append('estimate_range',fmt(range.lo)+' – '+fmt(range.hi));
    data.append('estimate_details',selected+(integrations?'; integrations: '+integrations:'')+(answers.type==='other'&&otherText.trim()?'; other: '+otherText.trim():''));
    data.append('estimate_source','Website instant estimate calculator');
    data.append('_replyto',localSiteContent.email);
    try{
      const response=await fetch(FORMSPREE,{method:'POST',body:data,headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
      if(!response.ok)throw new Error('Submission failed');
      setSent(true);
    }catch{
      setSent(false);
    }finally{setSending(false);}
  };
  const current=questions[step];
  const multiHint=current.type==='multi'&&(answers[current.id]||[]).length>0;
  const renderOptions=()=>current.opts.map(o=>{
    const on=current.type==='multi'?(answers[current.id]||[]).includes(o.v):answers[current.id]===o.v;
    const click=()=>pick(current.id)(o.v);
    return h('button',{key:o.v,type:'button',className:'calc-opt'+(on?' is-active':''),'aria-pressed':on,onClick:click},
      current.type==='multi'?h('span',{className:'calc-check','aria-hidden':true},h(LocalUiIcon,{name:'check'})):null,o.l);
  });
  return h('div',{id:'calculator',className:'calc-card','aria-labelledby':'calc-title'},
    h('div',{className:'calc-head'},
      h('p',{className:'hybrid-eyebrow'},h('span',{'aria-hidden':true}),number+' / Instant estimate'),
      h('h2',{id:'calc-title'},'See a price range in rand.'),
      h('p',{className:'calc-lead'},'Answer a few questions about your project and get an instant estimate in South African rand — about two minutes, no email required.')),
    h('div',{className:'calc-app'},
      h('div',{className:'calc-progress'},h('div',{className:'calc-progress-bar','aria-hidden':true,style:{transform:'scaleX('+((done?questions.length+1:step+1)/(questions.length+1))+')'}})),
      done?
        h('div',{className:'calc-result','data-anim':'result'},
          h('div',{className:'calc-result-head'},h('span',{className:'calc-mono'},'Your estimate'),h('h3',null,type.label)),
          h('div',{className:'calc-range'},h('span',{className:'calc-range-lo'},fmt(range.lo)),h('span',{className:'calc-range-sep'},'–'),h('span',{className:'calc-range-hi'},fmt(range.hi))),
          h('div',{className:'calc-meter','aria-hidden':true},
            h('div',{className:'calc-meter-track'},h('div',{className:'calc-meter-fill',style:{left:loPct+'%',width:Math.max(4,hiPct-loPct)+'%'}})),
            h('div',{className:'calc-meter-labels'},h('span',null,'Starts near '+fmt(type.base[0])),h('span',null,'Range '+fmt(type.base[0])+' – '+fmt(type.base[1])))),
          chips.length&&h('div',{className:'calc-chips'},...chips.map((chip,index)=>h('span',{key:index,className:'calc-chip'},h(LocalUiIcon,{name:'check'}),chip))),
          h('p',{className:'calc-result-note'},'This is a starting estimate based on your answers — it is not a final price and can change once the scope is confirmed. After a short conversation you get a clear, written quote covering scope, deliverables and timing — nothing starts until you approve it.'),
          sent?
            h('div',{className:'calc-sent'},h(LocalUiIcon,{name:'check'}),'Your estimate has been sent. We\'ll be in touch shortly.'):
            h('div',{className:'calc-actions'},
              h('button',{type:'button',className:'hybrid-button',onClick:()=>{setStep(0);setAnswers({});setDone(false);setSent(false);}},'Restart'),
              h('button',{type:'button',className:'hybrid-button',onClick:sendEstimate,disabled:sending},sending?'Sending…':'Send my estimate',h(LocalUiIcon,{name:'send'})))):
        h('div',{className:'calc-question','data-anim':'step',key:'step-'+step},
          step===0?
            h('div',null,
              h('div',{className:'calc-type-grid'},...types.map(item=>h('button',{key:item.id,type:'button',className:'calc-type'+(answers.type===item.id?' is-active':''),'aria-pressed':answers.type===item.id,onClick:()=>{const keep=integrationSets[item.id];setAnswers(prev=>{const list=(Array.isArray(prev.integrations)?prev.integrations:[]).filter(v=>keep.some(o=>o.v===v));return{...prev,integrations:keep.length?list:[]};});pick('type')(item.id);}},h('span',{className:'calc-type-icon','aria-hidden':true},h(LocalUiIcon,{name:item.icon})),h('span',{className:'calc-type-label'},item.label),h('span',{className:'calc-type-hint'},item.hint)))),
              answers.type==='other'&&h('div',{className:'calc-other'},
                h('label',{className:'calc-other-label',htmlFor:'calc-other-input'},'Tell us about it'),
                h('input',{id:'calc-other-input',className:'calc-other-input',type:'text',value:otherText,placeholder:'e.g. a booking platform for my salon, a membership portal…',onChange:e=>{const v=e.target.value;setOtherText(v);if(v.trim().length>=4)setTimeout(()=>{if(document.getElementById('calc-other-input')?.value.trim().length>=4)advance(1);},400);},onKeyDown:e=>{if(e.key==='Enter'&&e.target.value.trim().length>=4){e.preventDefault();advance(1);}},'aria-label':'Describe your project'}),
                h('p',{className:'calc-multi-hint'},'Press Enter or keep typing to continue →'))):
            h('div',null,
              h('div',{className:'calc-q-head'},h('span',{className:'calc-mono'},'Step '+String(step+1).padStart(2,'0')),h('p',null,current.q)),
              current.type==='multi'?
                h('div',{className:'calc-opts'},...renderOptions(),
                  multiHint&&h('p',{className:'calc-multi-hint'},'Tap to add or remove, then continue →')):
                h('div',{className:'calc-opts'},...renderOptions()),
              h('div',{className:'calc-nav'},
                step>0&&h('button',{type:'button',className:'calc-back',onClick:back},'← Back'))))),
    h('p',{className:'calc-disclaimer'},'Estimates are indicative ranges for planning, not fixed quotes. Final pricing depends on the scope agreed after a conversation, and provider costs (hosting, payments, AI) are billed separately by those providers.'));
}
/** Horizontal browsing is explicit: never consume a vertical wheel/touch gesture. */
function LocalProjectRail({projects,category,className='pf-grid'}) {
  const h=g.createElement,track=g.useRef(null);
  const [edges,setEdges]=g.useState({overflow:false,start:true,end:false});
  g.useEffect(()=>{
    const el=track.current;if(!el)return;
    let frame=0,disposed=false;
    const measure=()=>{
      if(disposed)return;
      const next={overflow:el.scrollWidth>el.clientWidth+2,start:el.scrollLeft<2,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-2};
      setEdges(previous=>Object.keys(next).every(key=>previous[key]===next[key])?previous:next);
    };
    const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
    const observer=new ResizeObserver(schedule);observer.observe(el);
    [...el.children].forEach(child=>observer.observe(child));
    el.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
    document.fonts?.ready.then(schedule);measure();
    return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();el.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[projects]);
  const move=direction=>{
    const el=track.current;if(!el)return;
    const card=el.firstElementChild,step=card?card.getBoundingClientRect().width+(parseFloat(getComputedStyle(el).columnGap)||0):el.clientWidth;
    el.scrollBy({left:direction*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  return h('div',{className:'pf-project-rail'},
    h('div',{className,ref:track,role:'region',tabIndex:0,'aria-label':category+' project previews'},...projects.map((project,index)=>h(LocalPortfolioCard,{key:project.id,project,index,total:projects.length,category}))),
    h('div',{className:'pf-rail-controls',hidden:!edges.overflow,role:'group','aria-label':'Browse '+category+' projects'},
      h('button',{type:'button',className:'pf-rail-arrow',disabled:edges.start,'aria-label':'Previous '+category+' projects',onClick:()=>move(-1)},h('span',{'aria-hidden':true},'‹')),
      h('button',{type:'button',className:'pf-rail-arrow',disabled:edges.end,'aria-label':'More '+category+' projects',onClick:()=>move(1)},h('span',{'aria-hidden':true},'›'))));
}
function LocalPortfolioPage() {
  const h=g.createElement;
  const location=Qt();
  const navigate=va();
  const requested=new URLSearchParams(location.search).get('filter') || 'all';
  const selected=localPortfolioCategories.some(item=>item.id===requested)?requested:'all';
  const visible=localPortfolioProjects.filter(item=>selected==='all'||item.categories.includes(selected));
  const [collapsed,setCollapsed]=g.useState(()=>{try{return JSON.parse(sessionStorage.getItem('lulazel-collapsed-'+location.key)||'{}');}catch{return {};}});
  const groups=localPortfolioCategories.filter(item=>item.id!=='all'&&(selected==='all'||item.id===selected)).map(category=>({category,projects:localPortfolioProjects.filter(project=>project.categories.includes(category.id))}));
  const renderCards=(projects,category)=>h(LocalProjectRail,{projects,category});
  const descriptions={website:'Business websites shaped around clear information and a useful next step.','product-design':'Products and experiences shaped around real needs.',apps:'Cross-platform products and mobile experiences.','frontend-dev':'Interfaces, tools and frontend builds.','ai-prompt':'Premium design resources and free prompts to make your own.'};
  g.useEffect(()=>{
    if(LocalReadRoutePosition(location.key))return;
    const id=location.hash?.slice(1);
    if(id&&(/^(portfolio-projects|pf-free-title)$/.test(id)||id.startsWith('portfolio-category-')))requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'}));
  },[selected,location.hash]);

  return h(LocalPageFrame,{title:'Work',description:'Websites, apps, frontend work and product-design projects from LulaZel Digital Studio.',className:'pf-page'},
    h('section',{className:'pf-hero'},h('div',{className:'unified-container pf-hero-inner'},
      h('div',{className:'pf-hero-copy'},h('p',{className:'hybrid-eyebrow'},h('span'),'01 / Our work'),
        h('p',{className:'pf-hero-overline'},'Real challenges. Individual solutions.'),
        h('h1',null,h('span',null,'Our work.'),h('span',{className:'hybrid-outline'},'Your next'),h('span',{className:'hybrid-green'},'inspiration.')),
        h('p',{className:'pf-hero-description'},'Explore products, websites and digital experiences shaped around real needs. Different businesses, different challenges — design and development working together.'),
        h('div',{className:'pf-hero-actions'},h('a',{href:'#portfolio-projects',className:'hybrid-button'},'Explore the projects',h(LocalUiIcon,{name:'arrow-down'})),h(LocalQuoteLink,{className:'hybrid-text-link'},'Get a quote',h(LocalUiIcon,{name:'arrow-up-right'})))),
      h(LocalDigitalVisual,{label:'Design + development × real-world challenges',icon:'portfolio'})),
      h('div',{className:'pf-hero-bottom unified-container'},h('a',{href:'#portfolio-projects'},'Scroll to explore',h(LocalUiIcon,{name:'arrow-down'})),h('span',null,localPortfolioProjects.length+' selected projects & studies'),h('span',null,'Websites · Apps · Product design')),
      h('div',{className:'pf-watermark','aria-hidden':true},'OUR WORK')),
    h('section',{id:'portfolio-projects',className:'pf-projects unified-container','aria-labelledby':'portfolio-heading'},
      h('div',{className:'pf-toolbar'},h('div',null,h('p',{className:'hybrid-eyebrow'},'Explore the work'),h('h2',{id:'portfolio-heading',className:'sr-only'},'Projects'))),
      h('nav',{className:'pf-category-jumps','aria-label':'Work categories'},...localPortfolioCategories.map(category=>h(ve,{key:category.id,to:category.id==='all'?'/portfolio/#portfolio-projects':'/portfolio/?filter='+category.id+'#portfolio-projects','aria-current':selected===category.id?'page':undefined,className:selected===category.id?'is-active':''},category.label))),
      h('div',{className:'pf-category-sections'},...groups.map(({category,projects})=>{
        const expanded=!collapsed[category.id],region='pf-category-content-'+category.id;
        return h('section',{key:category.id,id:'portfolio-category-'+category.id,className:'pf-category-section','aria-labelledby':'pf-category-title-'+category.id},
          h('div',{className:'pf-category-heading'},h('div',null,h('p',{className:'hybrid-eyebrow'},category.label+' projects'),h('h2',{id:'pf-category-title-'+category.id},category.label+' projects'),h('p',null,descriptions[category.id])),
            h('button',{type:'button',className:'pf-category-toggle','aria-label':(expanded?'Collapse ':'Expand ')+category.label+' projects','aria-expanded':expanded,'aria-controls':region,onClick:()=>setCollapsed(previous=>{const next={...previous,[category.id]:!previous[category.id]};try{sessionStorage.setItem('lulazel-collapsed-'+location.key,JSON.stringify(next));}catch{}return next;})},h(LocalUiIcon,{name:expanded?'minus':'plus'}))),
          h('div',{id:region,className:'pf-category-content',hidden:!expanded},category.id==='ai-prompt'?
            h('div',{className:'pf-prompt-groups'},...['premium','free'].map(tier=>h('section',{key:tier,className:'pf-prompt-group','aria-labelledby':'pf-'+tier+'-title'},h('div',{className:'pf-prompt-group-heading'},h('h3',{id:'pf-'+tier+'-title'},tier==='premium'?'Premium resources':'Free prompts')),renderCards(projects.filter(project=>project.promptTier===tier),category.id)))):renderCards(projects,category.id)));
      }))));

}
/** Only owner-confirmed profile URLs become live links. */
function LocalSocialProfiles() {
  const h=g.createElement;
  return h('nav',{className:'page-socials','aria-label':'Social media'},...localSiteContent.socialProfiles.map(profile=>{
    const children=[h(LocalUiIcon,{name:profile.icon,key:'icon'}),h('span',{key:'label'},profile.name)];
    return profile.url?h('a',{key:profile.name,href:profile.url,target:'_blank',rel:'noopener noreferrer','aria-label':profile.name+' — opens in a new tab'},...children):
      h('button',{key:profile.name,type:'button',disabled:true,title:profile.name+' profile link not added yet','aria-label':profile.name+' — profile link not added yet'},...children);
  }));
}
/** Team cards modelled on the founder card: photo with a name tag and round
 * LinkedIn / email / phone buttons over it, write-up below. Members without a
 * supplied photo get a monogram portrait instead of a stock or guessed image. */
function LocalTeamCard({member}) {
  const h=g.createElement,links=member.links||{},initials=member.name.split(' ').filter((_,i,a)=>i===0||i===a.length-1).map(w=>w[0]).join('');
  const social=[links.linkedin&&{href:links.linkedin,icon:'linkedin',label:member.name+' on LinkedIn',external:true},links.email&&{href:'mailto:'+links.email,icon:'mail',label:'Email '+member.name},links.phone&&{href:'tel:'+links.phone,icon:'handset',label:'Call '+member.name+(links.phoneDisplay?' on '+links.phoneDisplay:'')}].filter(Boolean);
  return h('article',{className:'team-card','aria-labelledby':'team-'+member.id},
    h('div',{className:'team-photo'+(member.photo?'':' team-photo-monogram')},
      member.photo?h('img',{src:member.photo,alt:member.name+', '+member.role,width:900,height:900,loading:'lazy',decoding:'async'}):h('span',{className:'team-monogram','aria-hidden':true},initials),
      h('div',{className:'team-tag'},h('div',null,h('h3',{id:'team-'+member.id},member.name),h('p',null,member.role)),
        h('div',{className:'team-social'},...social.map(item=>h('a',{key:item.icon,href:item.href,'aria-label':item.label,...(item.external?{target:'_blank',rel:'noopener noreferrer'}:{})},h(LocalUiIcon,{name:item.icon})))))),
    h('div',{className:'team-bio'},...member.bio.map((text,i)=>h('p',{key:i},text))));
}
function LocalTeamSection() {
  const h=g.createElement,team=localSiteContent.team;
  if(!team)return null;
  return h('section',{id:'about-team',className:'unified-about-panel team-section','aria-labelledby':'team-title','data-background-text':'THE TEAM'},h('div',{className:'unified-container'},
    h('p',{className:'svc-kicker'},'The team'),h('h2',{id:'team-title'},team.title),h('p',{className:'unified-scope-intro'},team.intro),
    h('div',{className:'team-grid'},...team.members.map(member=>h(LocalTeamCard,{key:member.id,member})))));
}
function LocalAboutPage() {
  const h=g.createElement;
  return h(LocalPageFrame,{title:'About LulaZel Digital Studio',description:'LulaZel Digital Studio combines design, development and connected services to help businesses go from idea to launch.',className:'unified-page'},
    h('section',{id:'about-intro',className:'unified-about-hero','data-background-text':'ABOUT LULAZEL'},h('div',{className:'unified-container unified-about-grid'},
      h('div',null,h('p',{className:'hybrid-eyebrow'},h('span'),'About / LulaZel'),h('h1',null,'Your vision.',h('br'),h('span',{className:'hybrid-outline'},'Designed & built.'),h('br'),h('span',{className:'hybrid-green'},'Ready for the world.')),h('p',{className:'hybrid-hero-description'},localSiteContent.about.intro),h('p',{className:'about-founder'},h('strong',null,'Founded by Lulamile Mkhungela'),' — designer and frontend developer, leading every project from strategy to launch.'),h(LocalSocialProfiles)),
      h('img',{src:'/assets/img/lulamile.webp',alt:'Lulamile Mkhungela, founder of LulaZel Digital Studio',width:900,height:900,loading:'eager',decoding:'async',fetchPriority:'high'}))),
    h(LocalTeamSection),
    h('section',{id:'about-partner',className:'unified-about-panel unified-partner-card','aria-labelledby':'partner-title','data-background-text':'ONE PARTNER'},h('div',{className:'unified-container unified-panel-grid'},h('div',{className:'unified-panel-copy unified-partner-card-col'},h('p',{className:'svc-kicker'},'One partner. From idea to launch.'),h('h2',{id:'partner-title'},'Good design opens the door. Great development makes it work.'),...localSiteContent.about.paragraphs.map((paragraph,index)=>h('p',{key:index},paragraph)),h('p',{className:'unified-about-close'},localSiteContent.about.close)),h(LocalStudioVisual,{kind:'about-partner',caption:'One partner, idea to launch · Original vector study'}))),h('section',{id:'about-principles',className:'unified-about-panel','aria-labelledby':'principles-title','data-background-text':'HOW WE WORK'},h('div',{className:'unified-container unified-panel-grid'},h('div',{className:'unified-panel-copy'},h('p',{className:'svc-kicker'},'How we work'),h('h2',{id:'principles-title'},'Principles you can rely on.'),h('ol',{className:'unified-principles-list'},...localSiteContent.about.principles.map((principle,index)=>h('li',{key:principle.title},h('span',{className:'unified-list-number'},String(index+1).padStart(2,'0')),h('div',null,h('h3',null,principle.title),h('p',null,principle.body)))))),h(LocalStudioVisual,{kind:'about-principles',caption:'How LulaZel works · Original vector study'}))),h('section',{id:'about-scope',className:'unified-about-panel unified-scope','aria-labelledby':'scope-title','data-background-text':'HONEST SCOPE'},h('div',{className:'unified-container unified-panel-grid unified-art-left'},h(LocalStudioVisual,{kind:'about-scope',caption:'Honest scope · Original vector study'}),h('div',{className:'unified-panel-copy'},h('p',{className:'svc-kicker'},'Honest scope'),h('h2',{id:'scope-title'},'What LulaZel doesn’t take on.'),h('p',{className:'unified-scope-intro'},'If a request is not the right fit, that is said up front — saving you time, money and frustration.'),h('ul',{className:'unified-scope-list'},...localSiteContent.about.outOfScope.map((item,index)=>h('li',{key:item.title},h('span',{className:'unified-list-number'},String(index+1).padStart(2,'0')),h('div',null,h('h3',null,item.title),h('p',null,item.body))))))),
    h('section',{id:'about-governance',className:'unified-about-panel unified-governance','aria-labelledby':'governance-title','data-background-text':'AI GOVERNANCE'},h('div',{className:'unified-container unified-panel-grid unified-art-left'},h(LocalStudioVisual,{kind:'about-governance',caption:'AI governance · Original vector study'}),h('div',{className:'unified-panel-copy'},h('p',{className:'svc-kicker'},'AI governance'),h('h2',{id:'governance-title'},localSiteContent.about.governance.title),h('p',{className:'unified-scope-intro'},localSiteContent.about.governance.body),h('ul',{className:'unified-scope-list'},...localSiteContent.about.governance.points.map((item,index)=>h('li',{key:item},h('span',{className:'unified-list-number'},String(index+1).padStart(2,'0')),h('div',null,h('h3',null,item),h('p',null,''))))))))));
}
function LocalContactPage() {
  const h=g.createElement;
  return h(LocalPageFrame,{title:'Let’s Talk',description:'Discuss your next website, product or digital project with LulaZel.',className:'unified-contact-page'},
    h('section',{className:'contact-intro unified-container',id:'contact-intro','data-background-text':'LET’S TALK'},
      h('div',{className:'contact-intro-copy'},h('p',{className:'contact-section-label'},h('span',{'aria-hidden':true}),'01 / Contact LulaZel'),h('p',{className:'contact-section-subtitle'},'South Africa & remote enquiries welcome.'),
        h('h1',null,h('span',null,'Your digital partner.'),h('span',{className:'hybrid-green'},'Wherever you work.')),
        h('p',{className:'hybrid-hero-description'},'Websites, hosting setup, business systems, automation, AI and creative services for businesses worldwide.'),
        h('p',{className:'contact-invitation'},h(LocalTypedText,{text:'Tell us your goals, your requirements and your time zone. Let’s discuss a solution that fits your business.'})),
        h('div',{className:'contact-direct'},
          h('a',{href:'tel:+27837195064'},h(LocalUiIcon,{name:'handset'}),h('span',null,'Call',h('strong',null,'+27 83 719 5064')),h(LocalUiIcon,{name:'arrow-up-right'})),
          h('a',{href:'https://wa.me/27837195064',target:'_blank',rel:'noopener noreferrer'},h(LocalUiIcon,{name:'whatsapp'}),h('span',null,'WhatsApp',h('strong',null,'+27 83 719 5064')),h(LocalUiIcon,{name:'arrow-up-right'})),
          h('a',{href:'mailto:'+localSiteContent.email},h(LocalUiIcon,{name:'mail'}),h('span',null,'Email',h('strong',null,localSiteContent.email)),h(LocalUiIcon,{name:'arrow-up-right'})),
          localSiteContent.address&&h('a',{href:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(localSiteContent.address.display),target:'_blank',rel:'noopener noreferrer'},h(LocalUiIcon,{name:'layers'}),h('span',null,'Studio',h('strong',null,localSiteContent.address.display)),h(LocalUiIcon,{name:'arrow-up-right'}))),
        h('div',{className:'contact-extra-actions'},
          h('a',{href:'https://calendly.com/lulamile_m/meet-lulamile?month=2026-11',target:'_blank',rel:'noopener noreferrer',className:'hybrid-button cta-glow','data-cc-glow':true},h(LocalUiIcon,{name:'calendar'}),'Book a meeting'),
          h('button',{type:'button',onClick:()=>{const dialog=document.getElementById('footer-enquiry');dialog.showModal();dialog.querySelector('input[name="name"]')?.focus();},'aria-haspopup':'dialog','aria-controls':'footer-enquiry'},h(LocalUiIcon,{name:'form'}),'Send an enquiry')),
        h(LocalSocialProfiles),
        h('a',{href:'#contact-next',className:'hybrid-text-link'},'What happens next?',h(LocalUiIcon,{name:'arrow-down'}))),
      h('div',{className:'contact-art'},h(LocalStudioVisual,{kind:'contact-conversation',caption:'A conversation · Original vector study'}),h('p',null,'A CONVERSATION IS A GOOD PLACE TO START.'))),
    h('section',{className:'contact-next',id:'contact-next','aria-labelledby':'contact-next-title'},
      h('div',{className:'contact-next-watermark','aria-hidden':true},'NEXT STEP'),
      h('div',{className:'contact-next-layout'},
        h('div',{className:'contact-next-copy'},
          h('p',{className:'contact-section-label'},h('span',{'aria-hidden':true}),'02 / What happens next'),
          h('p',{className:'contact-section-subtitle'},'Clear communication. From the start.'),
          h('h2',{id:'contact-next-title'},h('span',null,'We listen.'),h('span',{className:'contact-title-outline'},'We define.'),h('span',{className:'hybrid-green'},'We build.')),
          h('div',{className:'contact-steps'},...[['Tell us what you need','Share your business, goals, current tools and any examples that help explain the project.'],['Agree a practical scope','We clarify requirements, deliverables, responsibilities, budget and timing before work begins.'],['Plan the work together','We agree review points, communication and the steps toward launch or handover.']].map(([title,copy],index)=>h('article',{key:title},h('h3',null,'0'+(index+1)+' / '+title),h('p',null,copy)))),
          h('p',{className:'contact-next-note'},'You don’t need a complete technical brief. Explore ',h(ve,{to:'/services'},'our services'),', check our ',h(ve,{to:'/pricing'},'starting prices'),' or simply describe the problem you want to solve.'),
          h('a',{href:'#contact-intro',className:'contact-back'},'↺ Back to contact details')),
        LocalCalculator({number:'03'})),
      h('div',{className:'contact-section-bottom'},h('a',{href:'#contact-intro'},'Back to contact details ↑'),h(ve,{to:'/about'},'About LulaZel ↓')),h('section',{className:'unified-faq','aria-labelledby':'contact-faq-title','data-background-text':'COMMON QUESTIONS'},h('div',{className:'unified-container unified-faq-layout'},h(LocalStudioVisual,{kind:'contact-faq',caption:'Common questions · Original vector study'}),h('div',{className:'unified-faq-copy'},h('p',{className:'contact-section-label'},h('span',{'aria-hidden':true}),'04 / Before you ask'),h('h2',{id:'contact-faq-title'},'Common questions.'),...localSiteContent.faq.map(item=>h('details',{className:'unified-faq-item',key:item.question},h('summary',null,item.question),h('p',null,item.answer))))))));

}
function LocalToolsPage() {
  const h=g.createElement;
  return h(LocalPageFrame,{title:'Tools',description:localToolsContent.intro.lede,className:'unified-page'},
    h(LocalHybridHero,{eyebrow:'Resources / The builder toolkit',line1:'Better tools.',line2:'Clearer thinking.',line3:'Build with intent.',description:localToolsContent.intro.lede,primary:{href:'#toolkit',label:'Explore tools'},secondary:{href:'/services',label:'Services'},label:'The builder toolkit',icon:'toolkit'}),
    h('section',{id:'toolkit',className:'unified-container unified-toolkit'},h('p',{className:'svc-kicker'},'Free resources'),h('h2',null,'The builder toolkit'),h('div',{className:'unified-tool-grid'},...localToolsContent.tools.map(tool=>h('article',{className:'unified-tool',key:tool.id},h('p',{className:'svc-kicker'},tool.kind),h('h3',null,tool.name),h('p',null,tool.blurb),h('details',null,h('summary',null,'Workflow & files'),h('p',null,tool.ships),h('ol',null,...tool.steps.map((step,index)=>h('li',{key:index},step.title))))))),h('a',{href:'https://github.com/LulamileMkhungela/devzigner',target:'_blank',rel:'noopener noreferrer',className:'svc-button'},'View toolkit on GitHub ↗')));
}
/** Starting prices come from the same data as the instant estimate calculator. */
function LocalPricingPage() {
  const h=g.createElement,pricing=localSiteContent.pricing,fmt=localRand;
  const heading=(number,kicker,title,id,intro)=>h('div',{className:'pricing-heading'},h('p',{className:'svc-kicker'},number+' / '+kicker),h('h2',{id},title),intro&&h('p',null,intro));
  return h(LocalPageFrame,{title:'Pricing',description:pricing.intro,className:'unified-page pricing-page'},
    h(LocalHybridHero,{id:'pricing-intro',eyebrow:'01 / Pricing',line1:'Clear prices.',line2:'Honest scope.',line3:'No surprises.',description:pricing.intro,primary:{href:'#packages',label:'See starting prices'},secondary:{href:'#calculator',label:'Get an instant estimate'},label:'Transparent pricing',icon:'pricing'}),
    h('section',{id:'packages',className:'unified-container pricing-section','aria-labelledby':'pricing-packages-title','data-background-text':'STARTING PRICES'},
      heading('02','Project packages','Starting prices','pricing-packages-title','Typical projects start here. Your written quote reflects your exact pages, features and timeline.'),
      h('div',{className:'pricing-grid'},...pricing.packages.map(item=>h('article',{key:item.id,className:'pricing-card','aria-labelledby':'pricing-'+item.id},
        h('div',{className:'pricing-card-top'},h('h3',{id:'pricing-'+item.id},item.label),h('p',{className:'pricing-price'},h('small',null,'From'),h('strong',null,fmt(item.from)))),
        h('p',{className:'pricing-best'},item.bestFor),
        h('ul',{className:'pricing-includes','aria-label':item.label+' includes'},...item.includes.map(line=>h('li',{key:line},h(LocalUiIcon,{name:'check'}),h('span',null,line)))),
        h('div',{className:'pricing-actions'},h(LocalQuoteLink,{service:item.service,label:'Get a quote — '+item.label},'Get a quote',h(LocalUiIcon,{name:'arrow-up-right'})),h(ve,{to:item.path,className:'hybrid-text-link','aria-label':'Service details — '+item.label},'Service details',h(LocalUiIcon,{name:'arrow-up-right'}))))),
        h('article',{className:'pricing-card pricing-card-open','aria-labelledby':'pricing-open'},
          h('div',{className:'pricing-card-top'},h('h3',{id:'pricing-open'},pricing.open.label),h('p',{className:'pricing-price'},h('strong',null,'Custom quote'))),
          h('p',{className:'pricing-best'},pricing.open.bestFor),
          h('ul',{className:'pricing-includes','aria-label':pricing.open.label+' includes'},...pricing.open.includes.map(line=>h('li',{key:line},h(LocalUiIcon,{name:'check'}),h('span',null,line)))),
          h('div',{className:'pricing-actions'},h(LocalQuoteLink,{label:'Get a quote — '+pricing.open.label},'Tell us your idea',h(LocalUiIcon,{name:'arrow-up-right'})),h('a',{href:'#calculator',className:'hybrid-text-link'},'Instant estimate',h(LocalUiIcon,{name:'arrow-down'})))))),
    h('section',{id:'custom-quote',className:'unified-container pricing-section','aria-labelledby':'pricing-custom-title'},
      heading('03','Ongoing & growth services','Custom quote','pricing-custom-title','Scope, provider plans and ongoing effort vary, so these are quoted after a short conversation.'),
      h('div',{className:'pricing-custom-list'},...pricing.custom.map(item=>h('article',{key:item.label,className:'pricing-custom-row'},
        h('div',null,h('h3',null,h(ve,{to:item.path},item.label)),h('p',null,item.summary)),
        h('span',{className:'pricing-custom-tag'},'Custom quote'),
        h(LocalQuoteLink,{service:item.service,className:'hybrid-text-link',label:'Request a quote — '+item.label},'Request a quote',h(LocalUiIcon,{name:'arrow-up-right'})))))),
    h('section',{id:'how-pricing-works',className:'unified-container pricing-section','aria-labelledby':'pricing-terms-title'},
      heading('04','How pricing works','No surprises.','pricing-terms-title'),
      h('ol',{className:'pricing-terms'},...pricing.terms.map((term,index)=>h('li',{key:term.title},h('span',{className:'unified-list-number'},String(index+1).padStart(2,'0')),h('div',null,h('h3',null,term.title),h('p',null,term.body))))),
      h('p',{className:'pricing-guide-link'},'New to website budgets? ',h(ve,{to:'/blog/website-cost-south-africa'},'Read: How much does a website cost in South Africa?'),' · ',h(ve,{to:'/how-we-work#work-with-us'},'Three ways to work with us'))),
    h('section',{id:'estimate',className:'unified-container pricing-section pricing-estimate','aria-label':'Instant estimate'},h(LocalCalculator,{number:'05'})));
}
/** Blog: plain, crawlable articles built from site.content.json → blog.
 * {from:id} tokens render the published starting price, so articles never drift from Pricing. */
const localFill=text=>String(text).replace(/\{from:(\w+)\}/g,(match,id)=>{const item=localSiteContent.pricing.packages.find(pkg=>pkg.id===id);return item?localRand(item.from):match;});
function localPageLink(path){
  const service=[...localServiceCatalogue.services,...localStrategyServices].find(item=>(item.path||'/services/'+item.slug)===path);
  const project=localPortfolioProjects.find(item=>item.href===path);
  const post=localSiteContent.blog.items.find(item=>'/blog/'+item.slug===path);
  return service?service.title:project?project.client+' project':post?post.title:{'/pricing':'Pricing & instant estimate','/contact':'Contact us','/how-we-work':'How we work','/services':'All services'}[path]||path;
}
function localPostDate(value){const [y,m,d]=value.split('-').map(Number);return d+' '+['January','February','March','April','May','June','July','August','September','October','November','December'][m-1]+' '+y;}
function LocalPostCard({item,headingLevel='h2'}) {
  const h=g.createElement;
  return h('article',{className:'guide-card'},
    item.image&&h(ve,{to:'/blog/'+item.slug,className:'guide-card-media',tabIndex:-1,'aria-hidden':true},h('img',{src:item.image,alt:'',width:640,height:570,loading:'lazy',decoding:'async'})),
    h('p',{className:'guide-meta'},localPostDate(item.published)+' · '+item.minutes+' min read'),
    h(headingLevel,null,h(ve,{to:'/blog/'+item.slug},item.title)),h('p',null,item.description),
    h(ve,{to:'/blog/'+item.slug,className:'hybrid-text-link','aria-label':'Read: '+item.title},'Read the article',h(LocalUiIcon,{name:'arrow-up-right'})));
}
function LocalBlogPage() {
  const h=g.createElement,blog=localSiteContent.blog;
  return h(LocalPageFrame,{title:'Blog',description:blog.intro,className:'unified-page guides-page'},
    h('section',{className:'unified-container guides-index','aria-labelledby':'blog-title'},
      h('p',{className:'hybrid-eyebrow'},h('span',{'aria-hidden':true}),'Blog'),h('h1',{id:'blog-title'},h(g.Fragment,null,'Tech, trends & buzzwords. ',h('span',{className:'hybrid-green'},'Explained.'))),h('p',{className:'guides-lede'},blog.intro),
      h('div',{className:'guides-grid'},...blog.items.map(item=>h(LocalPostCard,{key:item.slug,item})))));
}
function LocalBlogPostPage() {
  const h=g.createElement,location=Qt(),slug=location.pathname.replace(/\/$/,'').split('/').pop();
  const post=localSiteContent.blog.items.find(item=>item.slug===slug);
  if(!post)return h(LocalNotFoundPage);
  const dynamic={
    prices:()=>h('ul',{className:'guide-prices'},...localSiteContent.pricing.packages.map(item=>h('li',{key:item.id},h('span',null,item.label),h('strong',null,'from '+localRand(item.from)))),h('li',{key:'custom'},h('span',null,'Hosting, automation, AI assistants, SEO & Google Ads'),h('strong',null,'custom quote'))),
    process:()=>h('ol',{className:'guide-process'},...localSiteContent.process.map(step=>h('li',{key:step.num},h('strong',null,step.title),h('span',null,step.body))))
  };
  const more=localSiteContent.blog.items.filter(item=>item.slug!==post.slug).slice(0,3);
  return h(LocalPageFrame,{title:post.title,description:post.description,className:'unified-page guides-page'},
    h('article',{className:'unified-container guide-article'},
      h('p',{className:'hybrid-eyebrow'},h('span',{'aria-hidden':true}),h(ve,{to:'/blog'},'Blog')),
      h('h1',null,post.title),
      h('p',{className:'guide-meta'},'By LulaZel Digital Studio · ',h('time',{dateTime:post.published},localPostDate(post.published)),' · '+post.minutes+' min read'),
      h('div',{className:'guide-hero'},h(LocalStudioVisual,{kind:'blog-'+post.slug,eager:true,caption:'Original 3D vector study · LulaZel'})),
      post.takeaways&&h('aside',{className:'guide-takeaways','aria-label':'Key takeaways'},h('h2',null,'Key takeaways'),h('ul',null,...post.takeaways.map(item=>h('li',{key:item},localFill(item))))),
      ...post.sections.map((section,index)=>h(g.Fragment,{key:index},
        section.h&&h('h2',null,section.h),
        ...(section.p||[]).map((text,i)=>h('p',{key:'p'+i},localFill(text))),
        section.list&&h('ul',{className:'guide-list'},...section.list.map(item=>h('li',{key:item},localFill(item)))),
        section.table&&h('div',{className:'guide-table-wrap'},h('table',{className:'guide-table'},h('thead',null,h('tr',null,...section.table.head.map((cell,i)=>h('th',{key:i,scope:'col'},cell)))),h('tbody',null,...section.table.rows.map((row,r)=>h('tr',{key:r},...row.map((cell,i)=>i===0?h('th',{key:i,scope:'row'},cell):h('td',{key:i},localFill(cell)))))))),
        section.dynamic&&dynamic[section.dynamic]())),
      h('aside',{className:'guide-next','aria-label':'Next steps'},
        h('h2',null,'Ready to talk about your project?'),
        h('div',{className:'pricing-actions'},h(LocalQuoteLink,{label:'Get a quote'},'Get a quote',h(LocalUiIcon,{name:'arrow-up-right'})),h(ve,{to:'/how-we-work',className:'hybrid-text-link'},'How we work',h(LocalUiIcon,{name:'arrow-up-right'}))),
        h('p',{className:'guide-related'},'Related: ',...post.related.map((path,index)=>h(g.Fragment,{key:path},index?' · ':null,h(ve,{to:path},localPageLink(path)))))),
      h('section',{className:'guide-more','aria-labelledby':'more-articles'},h('h2',{id:'more-articles'},'More from the blog'),h('div',{className:'guides-grid'},...more.map(item=>h(LocalPostCard,{key:item.slug,item,headingLevel:'h3'}))),h(ve,{to:'/blog',className:'studio-back'},'← All articles'))));
}
/** How we work: process, roles and engagement options from site.content.json → howWeWork.
 * Service pages render a condensed version of the same data. */
function LocalHowWeWorkPage() {
  const h=g.createElement,data=localSiteContent.howWeWork;
  const heading=(number,eyebrow,title,id)=>h('div',{className:'hww-heading'},h('p',{className:'hybrid-eyebrow'},h('span',{'aria-hidden':true}),number+' / '+eyebrow),h('h2',{id},title));
  const faqs=localSiteContent.faq.filter(item=>/start working|Who will work|working with you|after launch|technical brief/.test(item.question));
  return h(LocalPageFrame,{title:'How we work',description:data.intro,className:'unified-page hww-page'},
    h('section',{className:'unified-container hww-hero','aria-labelledby':'hww-title'},
      h('p',{className:'hybrid-eyebrow'},h('span',{'aria-hidden':true}),'How we work'),h('h1',{id:'hww-title'},'Clear steps. Clear roles. ',h('span',{className:'hybrid-green'},'No surprises.')),h('p',{className:'guides-lede'},data.intro),
      h('nav',{className:'hww-jump','aria-label':'On this page'},h('a',{href:'#how-a-project-runs'},'How a project runs'),h('a',{href:'#who-builds-what'},'Who builds what'),h('a',{href:'#work-with-us'},'Ways to work with us'))),
    h('section',{id:'how-a-project-runs',className:'unified-container hww-section','aria-labelledby':'hww-steps'},heading('01','How a project runs','Six steps from first message to launch.','hww-steps'),
      h('ol',{className:'hww-steps'},...data.steps.map((step,index)=>h('li',{key:step.title},h('span',{className:'hww-step-number'},String(index+1).padStart(2,'0')),h('h3',null,step.title),h('p',null,step.body)))),
      h('ul',{className:'hww-rhythm'},...data.rhythm.map(item=>h('li',{key:item},h(LocalUiIcon,{name:'check'}),h('span',null,item))))),
    h('section',{id:'who-builds-what',className:'unified-container hww-section','aria-labelledby':'hww-roles'},heading('02','Who builds what','Everyone knows their part.','hww-roles'),
      h('div',{className:'hww-roles'},...data.roles.map(role=>h('article',{key:role.who},h('h3',null,role.who),h('p',null,role.what))))),
    h('section',{id:'work-with-us',className:'unified-container hww-section','aria-labelledby':'hww-ways'},heading('03','Ways to work with us','Start where it makes sense.','hww-ways'),
      h('div',{className:'hww-ways'},...data.ways.map((way,index)=>h('article',{key:way.title},h('span',{className:'hww-step-number'},String(index+1).padStart(2,'0')),h('h3',null,way.title),h('p',null,way.body),h(ve,{to:way.link,className:'hybrid-text-link'},way.linkLabel,h(LocalUiIcon,{name:'arrow-up-right'})))))),
    h('section',{className:'unified-container hww-section','aria-labelledby':'hww-faq'},heading('04','Questions','Before you get in touch.','hww-faq'),
      h('div',{className:'hww-faq'},...faqs.map(item=>h('details',{className:'unified-faq-item',key:item.question},h('summary',null,item.question),h('p',null,item.answer)))),
      h('div',{className:'pricing-actions hww-cta'},h(LocalQuoteLink,{label:'Get a quote'},'Get a quote',h(LocalUiIcon,{name:'arrow-up-right'})),h(ve,{to:'/contact',className:'hybrid-text-link'},'Book a meeting',h(LocalUiIcon,{name:'arrow-up-right'})))));
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
    h('article',{className:'unified-container unified-about-copy privacy-article','data-background-text':'YOUR PRIVACY'},h('p',{className:'hybrid-eyebrow'},'Privacy & image rights'),h('h1',null,'Your details. Your choices.'),
      h('h2',null,'Who to contact'),h('p',null,'LulaZel Digital Studio is an independent design and development studio based in Johannesburg, South Africa. For privacy questions, correction or deletion requests, email ',h('a',{href:'mailto:mkhungela.l@gmail.com'},'mkhungela.l@gmail.com'),'.'),
      h('h2',null,'When you send an enquiry'),h('p',null,'The contact forms send your name, email, selected service, message and optional phone number to Formspree to deliver your enquiry. This information is used to respond and discuss your request. Please do not submit passwords, identity numbers, financial records or sensitive personal information.'),
      h('p',null,'Formspree processes submissions on its infrastructure, which may be outside South Africa. Its own privacy policy applies to that processing. You can email directly instead. Request access, correction or deletion using the email above; relevant legal or business-record obligations may affect what can be removed.'),h('a',{href:'https://formspree.io/legal/privacy-policy/',target:'_blank',rel:'noopener noreferrer'},'Formspree privacy policy'),
      h('h2',null,'External services and display preferences'),h('p',null,'WhatsApp, LinkedIn, Calendly, shop links and other external project destinations have their own privacy terms. Some original premium cover images load from external storage, which receives the ordinary network information needed to deliver them. The site may store display preferences in your browser. No advertising or analytics tracking is intentionally installed in this release.'),
      h('h2',null,'Images and design resources'),h('p',null,'Project images and brand marks remain the property of their respective owners. They are displayed to document the work, not offered as an image library. Do not reuse them without permission. Free prompt text is intentionally available to copy or download; premium products are accessed through the linked shop.'),
      h('p',null,'Image right-click and dragging are discouraged, but browser-visible images cannot be made impossible to save or capture. For reuse permission, contact LulaZel.'),
      h('p',null,'Last updated: 26 November 2026.')));
}
