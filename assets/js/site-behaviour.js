/** Casual image-saving deterrents only. Browser-delivered artwork is not DRM. */
const isArtwork=target=>target instanceof Element&&target.closest('img,svg,.hm-visual,.pf-card-art,.owner-project-cover,.owner-project-figure');
document.addEventListener('contextmenu',event=>{if(isArtwork(event.target))event.preventDefault();});
document.addEventListener('dragstart',event=>{if(isArtwork(event.target))event.preventDefault();});

/** Single-stage scroll choreography. Reference behavior inspected 2026-11-21:
 * digitalrhino.co.za/.../site/{app,choreography,mobile-layout}.js
 * One stationary stage; ONLY transform/opacity change in the render loop.
 * Desktop uses the reference's exponential damping (9/s), alternating 240px
 * travel and special depth entries, with continuous synchronized crossfades.
 * Mobile has a separate hold/read/settle/transition timeline, not desktop pins.
 * Artwork/content remain the owner's; no reference models or branding loaded. */
if(window.CSS?.supports('transform','translate3d(0,0,0)')&&'ResizeObserver' in window){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width:760px)');
 const roots=new Map(),initialized=new WeakSet();
 let frame=0,measureFrame=0,lastTime=0;
 const clamp=n=>Math.max(0,Math.min(1,n));
 const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
 const rounded=n=>Math.round(n*10000)/10000;
 // Adjacent fades are complementary: a chapter holds near its reading
 // position, then overlaps the next throughout the transition. Their summed
 // opacity is one, so synchronizing copy/art cannot leave an empty stage.
 // Concentrate the handoff into 30–70% of the transition: outgoing content
 // reaches <5% opacity by 65%, instead of lingering as a readable ghost.
 const fade=t=>smooth((t-.3)/.4);
 const visibility=(p,i)=>1-fade(Math.abs(p-i));
 const layerSelector='.hm-copy,.hm-visual,.hm-portrait-wrap,.hm-portfolio-heading,.hm-project-previews,.hm-restored-heading,.hm-process-grid,.hm-testimonials-copy,.hm-quote-art,.hm-panel-bottom';
 const getState=(deck,y)=>{
  const local=Math.max(0,y-deck.base),scenes=deck.scenes;
  let index=0;for(let j=1;j<scenes.length;j++)if(local>=scenes[j].start)index=j;
  const scene=scenes[index],distance=local-scene.start;
  const read=Math.min(scene.read,Math.max(0,distance-scene.hold));
  const t=scene.exit?clamp((distance-scene.hold-scene.read-scene.settle)/scene.exit):0;
  return {index,read,t,p:index+t};
 };
 const draw=deck=>{
  const {root,scenes,isMobile}=deck,state=getState(deck,deck.y),p=state.p;
  const current=isMobile?Math.min(scenes.length-1,state.index+(state.t>=.5?1:0)):Math.round(p);
  root.dataset.sceneProgress=String(rounded(p));
  for(let i=0;i<scenes.length;i++){
   const scene=scenes[i],panel=scene.panel,d=p-i;
   let alpha=visibility(p,i),x=d*(i%2?-240:240),y=i===state.index?-state.read:0,scale=1;
   if(!isMobile){
    const depth=(i===3||i===5)&&d<0;
    if(depth){x=0;scale=1+Math.min(Math.abs(d),1)*.65;}
   }else{
    // A short, consistent glide keeps small-screen text and fine vector edges
    // stable, instead of alternating large zooms and long lateral excursions.
    alpha=0;x=0;y=0;scale=1;
    if(i===state.index){
     const out=smooth(state.t);alpha=1-fade(state.t);
     y=-state.read-out*24;x=-out*24;
    }else if(i===state.index+1&&state.t>0){
     const entry=smooth(state.t);alpha=fade(state.t);
     x=24*(1-entry);y=18*(1-entry);
    }
   }
   panel.dataset.sceneDistance=String(rounded(d));
   panel.dataset.sceneVisibility=String(rounded(alpha));
   if(panel.hasAttribute('data-scene-current')!==(i===current))panel.toggleAttribute('data-scene-current',i===current);
   // Keep a single interactive chapter; visually dim transitional text is not
   // an invisible tab stop. Chapter navigation remains outside the stage.
   if(panel.inert!==(i!==current))panel.inert=i!==current;
   const composited=alpha>.001?'transform,opacity':'auto';
   if(panel.style.willChange!==composited)panel.style.willChange=composited;
   // One animated parent owns the entire composition. Copy, vector and
   // controls share the exact opacity, travel, scale and transform origin;
   // neither the artwork nor mobile text blocks have a delayed entrance.
   panel.style.opacity=String(rounded(alpha));
   panel.style.visibility=alpha>.001?'visible':'hidden';
   panel.style.transform=`translate3d(${rounded(x)}px,${rounded(y)}px,0) scale(${rounded(scale)})`;

  }
  const id=scenes[current].panel.id;
  const renderKey=scenes.map((scene,i)=>Math.abs(p-i)<1?i:'').join(',');
  if(root.dataset.sceneActive!==id||deck.renderKey!==renderKey){root.dataset.sceneActive=id;deck.renderKey=renderKey;document.dispatchEvent(new Event('lulazel-scene-update'));}
  if(deck.focus===id&&Math.abs(deck.y-deck.target)<.1){
   deck.focus=null;const panel=scenes[current].panel;panel.setAttribute('tabindex','-1');panel.focus({preventScroll:true});
  }
 };
 const tick=now=>{
  frame=0;const dt=lastTime?Math.min((now-lastTime)/1000,.05):1/60;lastTime=now;
  let moving=false;
  for(const deck of roots.values()){
   deck.target=scrollY;
   deck.y=deck.y+(deck.target-deck.y)*(1-Math.exp(-dt*(deck.isMobile?18:9)));
   if(Math.abs(deck.y-deck.target)<.01)deck.y=deck.target;else moving=true;
   deck.root.dataset.sceneSettled=String(deck.y===deck.target);
   draw(deck);
  }
  if(moving)frame=requestAnimationFrame(tick);else lastTime=0;
 };
 const request=()=>{if(!frame)frame=requestAnimationFrame(tick);};
 const measure=()=>{
  measureFrame=0;
  for(const deck of roots.values()){
   const {root,stage,scenes}=deck;
   deck.isMobile=mobile.matches;
   root.classList.add('scene-deck');root.classList.toggle('scene-mobile',deck.isMobile);
   const header=Math.ceil(document.querySelector('.rhino-header')?.getBoundingClientRect().height||144);
   // Stable small-viewport height prevents browser address-bar expansion from
   // changing a mobile timeline mid-gesture. Real orientation/width changes
   // still remeasure through the resize listener and ResizeObserver.
   const height=stage.offsetHeight||innerHeight-header;
   deck.base=root.getBoundingClientRect().top+scrollY-header;
   const available=Math.max(180,height-(deck.isMobile?110:100));
   let total=0;
   for(let i=0;i<scenes.length;i++){
    const scene=scenes[i],contentHeight=scene.panel.offsetHeight;
    scene.start=total;scene.read=Math.max(0,contentHeight-available);
    scene.hold=deck.isMobile?180:0;scene.settle=deck.isMobile?140:0;
    scene.exit=i===scenes.length-1?0:deck.isMobile?Math.max(240,height*.48):innerHeight*2;
    scene.panel.dataset.sceneStart=String(Math.max(0,deck.base+total));
    scene.panel.style.setProperty('--scene-content-top',(deck.isMobile?22:Math.max(22,(height-70-Math.min(contentHeight,available))*.5))+'px');
    total+=scene.hold+scene.read+scene.settle+scene.exit;
   }
   root.style.setProperty('--scene-journey-height',Math.ceil(total+height)+'px');
   // Measurement never reads a transformed/sticky chapter rectangle or writes
   // a scroll-dependent top/height. The stage's layout is stable for every frame.
   if(deck.y===null)deck.y=scrollY;
   draw(deck);
  }
  request();
 };
 const scheduleMeasure=()=>{if(!measureFrame)measureFrame=requestAnimationFrame(measure);};
 const clear=()=>{
  for(const {root,scenes,resize}of roots.values()){
   root.classList.remove('scene-deck','scene-mobile');delete root.dataset.sceneActive;delete root.dataset.sceneProgress;delete root.dataset.sceneSettled;
   root.style.removeProperty('--scene-journey-height');
   for(const scene of scenes){
    const panel=scene.panel;panel.inert=false;panel.classList.remove('scene-art-left');
    for(const key of ['sceneStart','sceneDistance','sceneVisibility'])delete panel.dataset[key];
    panel.removeAttribute('data-scene-current');panel.style.removeProperty('--scene-content-top');
    for(const prop of ['opacity','visibility','transform','will-change'])panel.style.removeProperty(prop);
    for(const layer of scene.layers){delete layer.dataset.sceneLayer;for(const prop of ['opacity','visibility','transform'])layer.style.removeProperty(prop);}
   }
   resize.disconnect();
  }
  roots.clear();cancelAnimationFrame(frame);frame=0;lastTime=0;
 };
 const scan=()=>{
  for(const [root,deck]of roots)if(!root.isConnected){deck.resize.disconnect();roots.delete(root);}
  if(reduced.matches){clear();return;}
  for(const root of document.querySelectorAll('main.hm-page')){
   if(roots.has(root))continue;
   const stage=root.querySelector('.hm-stage');if(!stage)continue;
   const panels=[...stage.children].filter(el=>el.matches('.hm-panel'));if(!panels.length)continue;
   const first=!initialized.has(root);initialized.add(root);
   const scenes=panels.map((panel,index)=>{
    panel.classList.toggle('scene-art-left',[1,4,5].includes(index));
    const layers=[...panel.querySelectorAll(layerSelector)].filter(el=>!el.parentElement.closest(layerSelector));
    for(const layer of layers){
     layer.dataset.sceneLayer=layer.matches('.hm-visual,.hm-portrait-wrap,.hm-quote-art')?'art':'text';
    }
    return {panel,layers,start:0,read:0,hold:0,settle:0,exit:0};
   });
   const resize=new ResizeObserver(scheduleMeasure);
   const deck={root,stage,scenes,resize,base:0,y:null,target:scrollY,isMobile:mobile.matches,focus:null};
   roots.set(root,deck);measure();resize.observe(stage);panels.forEach(panel=>resize.observe(panel));
   // Initial direct hashes snap; subsequent navigation is smoothed by the same
   // frame loop as wheel/trackpad scrolling, not a separate CSS transition.
   let restored=false;try{restored=!!sessionStorage.getItem('lulazel-position-'+history.state?.key);}catch{}
   if(first&&location.hash&&!restored){
    let panel;try{panel=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{}
    if(panel?.hasAttribute('data-scene-start')){scrollTo({top:Number(panel.dataset.sceneStart),behavior:'instant'});deck.y=scrollY;draw(deck);}
   }
  }
 };
 new MutationObserver(records=>{if(records.some(r=>r.addedNodes.length||r.removedNodes.length))scan();}).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('scroll',request,{passive:true});
 let measuredWidth=innerWidth;
 window.addEventListener('resize',()=>{if(!mobile.matches||innerWidth!==measuredWidth){measuredWidth=innerWidth;scheduleMeasure();}},{passive:true});
 document.addEventListener('lulazel-scene-focus',event=>{for(const deck of roots.values())deck.focus=event.detail;});
 reduced.addEventListener('change',()=>{clear();scan();});
 mobile.addEventListener('change',scheduleMeasure);
 document.fonts?.ready.then(scheduleMeasure);scan();
}

/** Directional, repeatable scroll entrances. Native scrolling and layout stay intact.
 * Nothing is hidden until the enhancement is running; no-JS keeps full content.
 * Independent translate/scale properties leave 3D and hover transforms alone. */
if ('IntersectionObserver' in window && 'MutationObserver' in window &&
    window.CSS?.supports('translate','1px') && window.CSS.supports('scale','.95')) {
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const copy='.studio-copy,.hm-copy,.pf-hero-copy,.contact-intro-copy,.contact-next-copy,.unified-about-grid>div,.hybrid-hero-copy,.hm-portfolio-heading>div';
  const art='.studio-visual,.studio-original-visual,.hm-visual,.hm-portrait-wrap,.pf-hero .hybrid-visual,.contact-art,.contact-next-visual,.unified-about-grid>img';
  const detail='.hm-restored-heading,.pf-category-heading,.owner-project-section,.owner-project-cover,.owner-project-figure,.owner-project-links,.owner-project-hero h1,.owner-project-tagline,.owner-project-intro,.owner-project-meta,.unified-about-copy>h2,.unified-about-copy>p,.unified-tools-intro';
  const tiles='.pf-card,.hm-process-card,.hm-testimonial-card,.unified-tool,.contact-steps article';
  const selector=[copy,art,detail,tiles].join(',');
  const targets=new Set();
  const show=element=>element.classList.add('is-in-view');
  const reveal=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting)show(entry.target);
  },{threshold:0,rootMargin:'0px 0px -6% 0px'});
  // A second, larger boundary rearms only fully departed content. Small scrolls
  // at the viewport edge never repeatedly hide/reveal what someone is reading.
  const reset=new IntersectionObserver(entries=>{
    for(const entry of entries)if(!entry.isIntersecting&&!entry.target.contains(document.activeElement)){
      entry.target.dataset.motionEdge=entry.boundingClientRect.bottom<0?'above':'below';
      entry.target.classList.remove('is-in-view');
    }
  },{threshold:0,rootMargin:'110px 0px 110px 0px'});
  const arm=element=>{
    if(preference.matches)return;
    const bounds=element.getBoundingClientRect();
    element.dataset.motionEdge=bounds.bottom<0?'above':'below';
    // Already visible at boot/route restoration stays readable with no flash.
    if(bounds.top<innerHeight&&bounds.bottom>0)show(element);
    element.classList.add('motion-enter');reveal.observe(element);reset.observe(element);
  };
  const visit=root=>{
    if(!(root instanceof Element)&&root!==document)return;
    const elements=[...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)];
    for(const element of elements){
      if(targets.has(element)||element.closest('main.hm-page')||element.parentElement?.closest('[data-motion-ready]'))continue;
      targets.add(element);element.dataset.motionReady='true';
      const siblings=element.parentElement?[...element.parentElement.children]:[];
      const index=Math.max(0,siblings.indexOf(element));
      const section=element.closest('section');
      const sectionIndex=section?[...document.querySelectorAll('main section')].indexOf(section):0;
      const reverse=section?.matches('.hm-reverse,.studio-art-left')||sectionIndex%2===1;
      const type=element.matches(art)?(sectionIndex%3===2?'depth':reverse?'left':'right'):element.matches(copy)?(reverse?'right':'left'):element.matches(tiles)?'depth':element.matches('.owner-project-cover,.owner-project-figure')?'depth':'rise';
      element.dataset.motion=type;
      element.style.setProperty('--entrance-delay',element.matches(tiles)?Math.min(index,3)*65+'ms':'0ms');
      arm(element);
    }
  };
  const mutations=new MutationObserver(records=>{
    for(const record of records)for(const node of record.addedNodes)visit(node);
    for(const target of targets)if(!target.isConnected){reveal.unobserve(target);reset.unobserve(target);targets.delete(target);}
  });
  mutations.observe(document.documentElement,{childList:true,subtree:true});visit(document);
  preference.addEventListener('change',()=>{
    reveal.disconnect();reset.disconnect();
    for(const target of targets){
      target.classList.remove('motion-enter');show(target);
      if(!preference.matches){target.classList.remove('is-in-view');arm(target);}
    }
  });
  // Keyboard focus, find/anchor scrolling and print never depend on an entrance.
  document.addEventListener('focusin',event=>{const container=event.target.closest?.('.motion-enter');if(container)show(container);});
  window.addEventListener('beforeprint',()=>{for(const target of targets)show(target);});
}

/** Load the local 3D engine only near an eligible illustration. Contact stays SVG. */
if('IntersectionObserver' in window){
 let requested=false;
 const seen=new WeakSet();
 const near=new IntersectionObserver(entries=>{
  if(!requested&&entries.some(entry=>entry.isIntersecting)){
   requested=true;near.disconnect();watch.disconnect();
   import('./interactive-scenes.js').catch(()=>{/* Original SVG remains usable. */});
  }
 },{rootMargin:'160px'});
 const scan=()=>{for(const img of document.querySelectorAll('.hm-visual img,.studio-visual img,.studio-original-visual img')){
  if(!seen.has(img)&&img.getAttribute('src')?.includes('/assets/img/home/')){seen.add(img);near.observe(img);}
 }};
 const watch=new MutationObserver(scan);watch.observe(document.body,{childList:true,subtree:true});scan();
}

/** Small pointer-follow tilt for tactile HTML controls, never for text or canvas. */
{
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const selector='button:not(:disabled):not([aria-controls="rhino-about-links"]),.hybrid-button,.svc-button,.hm-link-primary,.studio-link-primary,.pf-category-jumps a,.rhino-contact';
 let active=null,frame=0,x=0,y=0;
 const reset=()=>{cancelAnimationFrame(frame);frame=0;if(active){active.style.removeProperty('--depth-rx');active.style.removeProperty('--depth-ry');active=null;}};
 document.addEventListener('pointermove',event=>{
  if(!fine.matches||reduce.matches||event.pointerType==='touch')return;
  const control=event.target.closest?.(selector);if(!control){reset();return;}
  if(active!==control){reset();active=control;}
  const bounds=control.getBoundingClientRect();
  x=Math.max(-4,Math.min(4,-(event.clientY-bounds.top-bounds.height/2)/bounds.height*8));
  y=Math.max(-4,Math.min(4,(event.clientX-bounds.left-bounds.width/2)/bounds.width*8));
  if(!frame)frame=requestAnimationFrame(()=>{frame=0;if(active){active.style.setProperty('--depth-rx',x.toFixed(2)+'deg');active.style.setProperty('--depth-ry',y.toFixed(2)+'deg');}});
 },{passive:true});
 document.addEventListener('pointerout',event=>{if(active&&!active.contains(event.relatedTarget))reset();},{passive:true});
 window.addEventListener('blur',reset);reduce.addEventListener('change',reset);fine.addEventListener('change',reset);
}
