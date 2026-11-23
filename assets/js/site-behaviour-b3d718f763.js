/** Casual image-saving deterrents only. Browser-delivered artwork is not DRM. */
const isArtwork=target=>target instanceof Element&&target.closest('img,svg,.hm-visual,.pf-card-art,.owner-project-cover,.owner-project-figure');
document.addEventListener('contextmenu',event=>{if(isArtwork(event.target))event.preventDefault();});
document.addEventListener('dragstart',event=>{if(isArtwork(event.target))event.preventDefault();});

/** Progressive chapter entrances: no loader, scroll hijacking or hidden no-JS content. */
if ('IntersectionObserver' in window && 'MutationObserver' in window) {
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const selector='.studio-copy,.studio-visual,.hm-copy,.hm-visual,.pf-hero-copy,.pf-hero .hybrid-visual,.contact-intro-copy,.contact-art,.contact-next-visual,.contact-next-copy,.unified-about-grid>div,.unified-about-grid>img,.hybrid-hero-copy';
  const targets=new Set();
  const reveal=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in-view');reveal.unobserve(entry.target);targets.delete(entry.target);}
  },{threshold:.06,rootMargin:'0px 0px -12px 0px'});
  const visit=root=>{
    if(!(root instanceof Element)&&root!==document)return;
    const elements=[...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)];
    for(const element of elements){
      if(element.dataset.motionReady)continue;
      element.dataset.motionReady='true';
      if(preference.matches)continue;
      element.classList.add('motion-enter');targets.add(element);reveal.observe(element);
    }
  };
  const mutations=new MutationObserver(records=>{
    for(const record of records){
      for(const node of record.addedNodes)visit(node);
      for(const node of record.removedNodes)if(node instanceof Element)for(const target of targets)if(node===target||node.contains(target)){reveal.unobserve(target);targets.delete(target);}
    }
  });
  mutations.observe(document.documentElement,{childList:true,subtree:true});visit(document);
  preference.addEventListener('change',()=>{if(preference.matches){for(const target of targets){target.classList.add('is-in-view');reveal.unobserve(target);}targets.clear();}});
  // Anchors and keyboard focus always take precedence over decorative motion.
  document.addEventListener('focusin',event=>{const container=event.target.closest?.('.motion-enter');if(container)container.classList.add('is-in-view');});
}

/** Load the local 3D engine only near an eligible illustration. Contact stays SVG. */
if('IntersectionObserver' in window){
 let requested=false;
 const seen=new WeakSet();
 const near=new IntersectionObserver(entries=>{
  if(!requested&&entries.some(entry=>entry.isIntersecting)){
   requested=true;near.disconnect();watch.disconnect();
   import('./interactive-scenes-72693c6135.js').catch(()=>{/* Original SVG remains usable. */});
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
