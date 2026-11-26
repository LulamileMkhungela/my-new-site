/** Clipboard API may be denied by an embedded preview's Permissions Policy.
 * Keep the selection-based fallback in the click gesture for embedded contexts. */
async function LocalCopyPrompt(text) {
  if(typeof text!=='string'||!text.trim())throw new Error('Prompt text is unavailable.');
  const selectionCopy=()=>{
    const active=document.activeElement,selection=window.getSelection();
    const ranges=selection?Array.from({length:selection.rangeCount},(_,i)=>selection.getRangeAt(i).cloneRange()):[];
    const field=document.createElement('textarea');
    field.value=text;field.readOnly=true;field.tabIndex=-1;
    field.setAttribute('aria-label','Copying prompt');
    Object.assign(field.style,{position:'fixed',top:'0',left:'0',width:'1px',height:'1px',opacity:'0',fontSize:'16px'});
    document.body.appendChild(field);
    let copied=false;
    try {field.focus({preventScroll:true});field.select();field.setSelectionRange(0,text.length);copied=document.execCommand('copy');}
    catch {} finally {
      field.remove();
      if(active instanceof HTMLElement)active.focus({preventScroll:true});
      if(selection){selection.removeAllRanges();for(const range of ranges)selection.addRange(range);}
    }
    return copied;
  };
  if((window.self!==window.top||!navigator.clipboard?.writeText)&&selectionCopy())return;
  try {
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard API unavailable.');
    await navigator.clipboard.writeText(text);
  } catch(error) {
    if(!selectionCopy())throw error;
  }
}

/** Owner projects: live redirects, case studies, overviews and non-linked releases. */
function LocalProjectAction(project,category='all') {
  if(project.apkUrl)return {type:'external',href:project.apkUrl,label:'Download APK'};
  if(project.androidReleaseUrl)return {type:'external',href:project.androidReleaseUrl,label:'Android release'};
  if(project.siteUrl)return {type:'external',href:project.siteUrl,label:'Visit site'};
  const override=project.categoryActions?.[category];
  const type=override?.type||project.type;
  return {type,href:override?.href||project.href,label:override?.label||project.actionLabel||(type==='coming-soon'?'Coming soon':type==='external'?'Open project':type==='overview'?'View project':'View case study')};
}
/** Success messages expire; errors/manual-copy instructions stay until retried. */
function LocalUseCopyStatus() {
  const [status,setStatus]=g.useState(''),timer=g.useRef(null);
  g.useEffect(()=>()=>clearTimeout(timer.current),[]);
  const announce=message=>{
    clearTimeout(timer.current);setStatus(message);
    if(message==='Prompt copied.')timer.current=setTimeout(()=>setStatus(''),2000);
  };
  return [status,announce];
}
/** App-store placeholders stay genuinely disabled until the owner adds each URL. */
function LocalAppDownloads({project,showApk=false}) {
  const h=g.createElement;
  if(project.historical)return null;
  const downloadUrl=project.apkUrl||project.androidReleaseUrl;
  const stores=[{id:'appStore',label:'App Store',icon:'app-store'},{id:'googlePlay',label:'Google Play',icon:'google-play'}];
  return h('div',{className:'pf-app-downloads'},
    h('div',{className:'pf-store-links'+(downloadUrl?' pf-store-links-with-apk':''),role:'group','aria-label':project.client+' app downloads'},
      downloadUrl&&h('a',{href:downloadUrl,target:'_blank',rel:'noopener noreferrer',className:'pf-store-control pf-apk-download','aria-label':(project.apkUrl?(showApk?'Download Android APK':'Download APK'):'Android release')+' — '+project.client,title:project.apkUrl?'Download Android APK':'Open Android release'},h(LocalUiIcon,{name:'download'}),h('span',{className:'pf-download-label'},showApk?(project.apkUrl?'Download APK':'Android release'):(project.apkUrl?'APK':'Android'))),
      ...stores.map(store=>{
      const url=project.storeLinks?.[store.id],label=store.label+' — '+project.client+(url?'':' (link not added yet)');
      const children=[h(LocalUiIcon,{name:store.icon,key:'icon'}),h('span',{key:'label'},store.label)];
      return url?h('a',{key:store.id,href:url,target:'_blank',rel:'noopener noreferrer',className:'pf-store-control','aria-label':label},...children):
        h('button',{key:store.id,type:'button',disabled:true,className:'pf-store-control','aria-label':label,title:store.label+' link not added yet'},...children);
    })),
    !stores.some(store=>project.storeLinks?.[store.id])&&h('p',{className:'pf-store-note'},'Store links not added yet'));
}
/** Compact reference-style thumbnail and action bar, with no long card copy. */
function LocalPortfolioCard({project,index,total,category='all'}) {
  const h=g.createElement,freePrompt=project.promptTier==='free',location=Qt();
  const [copyStatus,setCopyStatus]=LocalUseCopyStatus();
  const previewRef=g.useRef(null);
  const previewImage=project.previewImage||project.imageRemote||project.image;
  // Render full-page captures at their natural aspect ratio, never stretched.
  const measurePreview=()=>{
    const frame=previewRef.current,img=frame?.querySelector('img');
    if(!frame||!img?.naturalWidth||!project.previewScroll)return;
    const bounds=frame.getBoundingClientRect();
    const distance=Math.max(0,bounds.width*img.naturalHeight/img.naturalWidth-bounds.height);
    frame.style.setProperty('--preview-travel',distance+'px');
    frame.style.setProperty('--preview-duration',Math.min(24,Math.max(6,distance/40))+'s');
    frame.dataset.scrollable=distance>1?'true':'false';
  };
  g.useEffect(()=>{
    if(!project.previewScroll)return;
    measurePreview();
    const observer=new ResizeObserver(measurePreview);
    if(previewRef.current)observer.observe(previewRef.current);
    return()=>observer.disconnect();
  },[previewImage,project.previewScroll]);
  const copyPrompt=async()=>{
    try {await LocalCopyPrompt(project.details.prompt);setCopyStatus('Prompt copied.');}
    catch {setCopyStatus('Copy unavailable. Select and copy the prompt below.');}
  };
  const action=LocalProjectAction(project,category);
  const groupedDownload=!!(project.apkUrl||project.androidReleaseUrl);
  const linked=!groupedDownload&&!freePrompt&&action.type!=='coming-soon'&&!!action.href;
  const web=category==='website'||category==='frontend-dev';
  const label=freePrompt?'Copy prompt':action.type==='coming-soon'?'Coming soon':project.promptTier==='premium'?'View on Selar':project.apkUrl?'Download APK':project.androidReleaseUrl?'Android release':project.siteUrl?'Visit site':action.type==='external'?(web?'Visit website':'Open project'):'View project';
  const cardDescription=category==='home'?(project.homeCardDescription??project.cardDescription):project.cardDescription;
  const projectLabel=category==='home'?(project.homeProjectLabel??project.projectLabel):project.projectLabel;
  const descriptionId='pf-description-'+category+'-'+project.id;
  const body=h(g.Fragment,null,
    h('div',{className:'pf-card-art',ref:previewRef},
      h('div',{className:'pf-art-fallback','aria-hidden':true},h('span',{className:'pf-art-word'},project.client)),
      project.image&&h('img',{src:previewImage,onLoad:measurePreview,alt:project.imageAlt||project.client+' project preview',loading:'eager',decoding:'async',className:project.imageFit==='contain'?'pf-image-contain':undefined,onError:event=>{if(project.imageRemote&&!event.currentTarget.dataset.localFallback){event.currentTarget.dataset.localFallback='true';event.currentTarget.src=project.image;}else event.currentTarget.style.display='none';}})),
    h('div',{className:'pf-card-info'},h('h3',{className:'pf-compact-name'},project.client),
      h('p',{className:'sr-only',id:descriptionId},project.description),
      cardDescription&&h('p',{className:'pf-history-description'},cardDescription),
      projectLabel&&h('p',{className:'pf-card-status'},projectLabel),
      project.status&&!['Coming soon','Previous work','Premium','Free'].includes(project.status)&&h('p',{className:'pf-card-status'},project.status),
      project.platforms&&h('p',{className:'pf-platforms'},'Cross-platform · '+project.platforms.join(' · '))),
    action.type==='coming-soon'||groupedDownload?null:freePrompt?h('button',{type:'button',className:'pf-copy-prompt','aria-label':'Copy prompt — '+project.client,onClick:copyPrompt},copyStatus==='Prompt copied.'?'Copied!':'Copy prompt'):
      h('span',{className:'pf-action-bar'+(linked?'':' pf-action-unavailable')},h('span',null,label),linked&&h(LocalUiIcon,{name:project.apkUrl||project.androidReleaseUrl?'download':'arrow-up-right'})));
  return h('article',{className:'pf-card','data-project':project.id,'data-prompt-tier':project.promptTier,'data-web-preview':project.previewScroll?'true':undefined},
    linked?h(action.type==='external'?'a':ve,action.type==='external'?{href:action.href,target:'_blank',rel:'noopener noreferrer',className:'pf-card-link','aria-label':label+' — '+project.client,'aria-describedby':descriptionId}:{to:action.href.startsWith('/project/')?action.href.replace(/\/$/,'')+'/':action.href,state:{projectReturn:location.pathname+(location.search||'')+(location.hash||'')},className:'pf-card-link','aria-label':label+' — '+project.client,'aria-describedby':descriptionId},body):h('div',{className:freePrompt?'pf-card-link pf-card-free':'pf-card-link pf-card-static'},body),
    freePrompt&&h('p',{className:'pf-copy-status',role:'status','aria-live':'polite'},copyStatus),
    freePrompt&&copyStatus.startsWith('Copy unavailable')&&h('pre',{className:'pf-copy-fallback',tabIndex:0,'aria-label':'Select prompt — '+project.client},project.details.prompt),
    project.categories.includes('apps')&&h(LocalAppDownloads,{project}),
    action.type==='coming-soon'&&h('span',{className:'pf-release-badge pf-action-unavailable'},'Coming soon'));
}
function LocalProjectPage() {
  const h=g.createElement;
  const location=Qt(),navigate=va();
  const id=location.pathname.replace(/\/$/,'').split('/').pop();
  const project=localPortfolioProjects.find(item=>item.id===id&&item.details);
  if(!project)return h(LocalNotFoundPage);
  const details=project.details;
  const origin=location.state?.projectReturn;
  const backTo=origin||'/portfolio?filter='+project.categories[0]+'#portfolio-category-'+project.categories[0];
  const goBack=event=>{if(origin&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey&&event.button===0){event.preventDefault();navigate(-1);}};
  return h(LocalPageFrame,{title:project.client,description:project.description,className:'owner-project'},
    h('section',{className:'owner-project-hero','data-background-text':project.client.toUpperCase()},h('div',{className:'unified-container'},
      h(ve,{to:backTo,onClick:goBack,className:'owner-project-back'},'← Back to work'),
      h('p',{className:'hybrid-eyebrow'},project.type==='overview'?'Project overview':'Selected work / Case study'),
      h('h1',null,project.client),h('p',{className:'owner-project-tagline'},project.title),h('p',{className:'owner-project-intro'},project.description),
      h('dl',{className:'owner-project-meta'},h('div',null,h('dt',null,'Role'),h('dd',null,details.role)),h('div',null,h('dt',null,'Context'),h('dd',null,details.context)),h('div',null,h('dt',null,'Status'),h('dd',null,project.status||'Selected project'))),
      project.categories.includes('apps')&&h(LocalAppDownloads,{project,showApk:true}),
      project.image&&h('figure',{className:'owner-project-cover '+(project.imageFit==='contain'?'is-contain':'')},h('img',{src:project.image,alt:project.client+' project preview',fetchPriority:'high'}),h('figcaption',null,project.promptTier?'AI-assisted UI exploration from the original design library; not a shipped product.':project.id==='prodops'?'Actual local build of ProdOps, displaying the repository’s worked example.':project.id==='forma'?'Design-system illustration from the original portfolio; not a product screenshot.':project.type==='overview'?'Original project material. See the notes below for context.':'Project visual imported from the original portfolio.')))),
    h('div',{className:'unified-container owner-project-content'},...details.sections.map((section,index)=>h('section',{className:'owner-project-section',key:section.title},h('div',null,h('p',{className:'hybrid-eyebrow'},String(index+1).padStart(2,'0')+' / '+(project.type==='overview'?'Project notes':'The story')),h('h2',null,section.title)),h('div',null,...section.paragraphs.map((paragraph,i)=>h('p',{key:i},paragraph))))),
      details.prompt&&h(LocalPromptContent,{details}),
      ...details.gallery.filter(item=>item.src!==project.image).map(item=>h('figure',{key:item.src,className:'owner-project-figure'},h('img',{src:item.src,alt:item.alt,loading:'eager',decoding:'async'}),h('figcaption',null,item.caption))),
      details.links.length>0&&h('section',{className:'owner-project-links','aria-label':'Project links'},h('h2',null,'Explore the project'),...details.links.map(link=>h('a',{key:link.href,href:link.href,...(link.href.startsWith('mailto:')?{}:{target:'_blank',rel:'noopener noreferrer'}),className:'hybrid-button'},link.label,h(LocalUiIcon,{name:'arrow-up-right'})))),
      h(ve,{to:backTo,onClick:goBack,className:'owner-project-back'},'← All projects')));
}

/** Free resources only: premium prompt text is never included in runtime data. */
function LocalPromptContent({details}) {
  const h=g.createElement;
  const [status,setStatus]=LocalUseCopyStatus();
  const copy=async()=>{
    try {await LocalCopyPrompt(details.prompt);setStatus('Prompt copied.');}
    catch {setStatus('Copy is unavailable here. Select the prompt text below or download the text file.');}
  };
  return h('section',{className:'owner-prompt','aria-labelledby':'owner-prompt-title'},
    h('p',{className:'hybrid-eyebrow'},'Free design resource'),h('h2',{id:'owner-prompt-title'},'Make it your starting point.'),
    h('p',null,'Use the original prompt below, then adapt it to your own brief.'),
    h('div',{className:'owner-prompt-actions'},h('button',{type:'button',className:'hybrid-button',onClick:copy},'Copy prompt',h(LocalUiIcon,{name:'layers'})),h('a',{href:details.promptDownload,download:true,className:'hybrid-text-link'},'Download prompt (.txt)',h(LocalUiIcon,{name:'arrow-down'}))),
    h('p',{role:'status','aria-live':'polite',className:'owner-prompt-status'},status),h('pre',{tabIndex:0,'aria-label':'Free design prompt'},details.prompt));
}
