/** Locally authored, real WebGL geometry. No raster textures or remote model service.
 * Progressive enhancement: SVG stays visible if WebGL is unavailable. */
import * as T from 'three';
import pageArtwork from './page-artwork.json';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const names={studio:'Creative studio',hosting:'Web hosting',websites:'Ecommerce',systems:'Business systems',automation:'Workflow automation',assistants:'AI assistants',design:'Graphic design','website-design':'Website design',search:'SEO and search',advertising:'Advertising',strategy:'Product strategy',portfolio:'Selected work',toolkit:'Builder toolkit',...Object.fromEntries(Object.entries(pageArtwork).map(([id,recipe])=>[id,recipe.title]))};
const colors={green:0x00ce7b,ivory:0xf0efd4,dark:0x244d41,lime:0xc8df8a,coral:0xee9b7b,metal:0x8cbaa2};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
function model(kind){
 const root=new T.Group(),parts=[],materials=new Map();
 const mat=color=>{if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color:colors[color]||color,roughness:.32,metalness:color==='metal'?.5:.12}));return materials.get(color)};
 function part(x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);g.userData.base=g.position.clone();root.add(g);parts.push(g);return g;}
 function mesh(geo,color,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(p,x,y,z,w,h,d,c,r=.08){return mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)),c,p,x,y,z)}
 const ball=(p,x,y,z,r,c)=>mesh(new T.SphereGeometry(r,24,16),c,p,x,y,z);
 const ring=(p,x,y,z,r,t,c)=>mesh(new T.TorusGeometry(r,t,12,48),c,p,x,y,z);
 function tube(p,points,c,r=.04){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),40,r,10,false),c,p);}
 function shape(p,pts,c,depth=.2){const s=new T.Shape();pts.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return mesh(new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.04,bevelThickness:.04}),c,p);}
 function check(p,x,y,z,size=.4){tube(p,[[x-size*.6,y,z],[x-size*.15,y-size*.4,z],[x+size*.65,y+size*.55,z]],'ivory',.045);}
 function page(x,y,z,scale=1){const p=part(x,y,z);p.scale.setScalar(scale);box(p,0,0,0,2.6,1.9,.16,'ivory');box(p,0,.76,.1,2.45,.23,.06,'dark');for(let i=0;i<3;i++)ball(p,-1+i*.15,.76,.16,.035,['coral','lime','green'][i]);return p;}
 function result(p){box(p,-.65,.04,.15,.8,1,.05,'green');for(let i=0;i<3;i++)box(p,.5,.35-i*.23,.15,.85-i*.12,.055,.04,'metal',.01);box(p,.43,-.45,.16,.7,.17,.05,'coral');}
 function cursor(p,x,y,z,scale=1){const c=new T.Group();p.add(c);c.position.set(x,y,z);c.scale.setScalar(scale);shape(c,[[-.4,.65],[-.4,-.55],[-.05,-.28],[.2,-.88],[.45,-.75],[.16,-.16],[.65,-.16]],'ivory');return c;}
 function shield(p){shape(p,[[-.55,.65],[0,.47],[.55,.65],[.52,-.05],[.35,-.45],[0,-.72],[-.35,-.45],[-.52,-.05]],'green',.17);check(p,0,-.02,.25,.5);}
 function chat(x,y,z,c){const p=part(x,y,z);box(p,0,0,0,1.65,1.05,.26,c,.14);shape(p,[[-.48,-.4],[-.48,-.85],[-.05,-.45]],c,.2);return p;}
 function compass(x,y,z){const p=part(x,y,z);mesh(new T.CylinderGeometry(.7,.7,.18,48),'dark',p).rotation.x=Math.PI/2;ring(p,0,0,.12,.59,.035,'metal');shape(p,[[0,.45],[-.16,-.1],[.16,-.1]],'coral',.04);shape(p,[[0,-.45],[-.16,-.1],[.16,-.1]],'ivory',.04);ball(p,0,-.1,.14,.06,'green');return p;}
 if(pageArtwork[kind]){
  for(const component of pageArtwork[kind].parts){
   const p=part(...component.p);if(component.r)p.rotation.set(...component.r);
   for(const item of component.items){
    let object;
    if(item.type==='box')object=box(p,...item.p,...item.s,item.c);
    else if(item.type==='sphere')object=ball(p,...item.p,item.s[0],item.c);
    else if(item.type==='ring')object=ring(p,...item.p,...item.s,item.c);
    else if(item.type==='cylinder')object=mesh(new T.CylinderGeometry(item.s[0],item.s[0],item.s[1],32),item.c,p,...item.p);
    else if(item.type==='tube')object=tube(p,item.points,item.c,item.radius);
    if(object&&item.r)object.rotation.set(...item.r);
   }
  }
  return{root,parts};
 }
 if(kind==='hosting'){
  for(let i=0;i<3;i++){const p=part(0,-.7+i*.65,0);box(p,0,0,0,2.5,.45,1.25,'dark');box(p,-.25,0,.65,1.35,.07,.05,'metal');for(let j=0;j<2;j++)ball(p,.85+j*.2,0,.66,.055,j?'green':'lime');}
  const cloud=part(0,1.7,-.3);for(const[x,y,r]of[[-.65,0,.46],[0,.22,.65],[.65,0,.45]])ball(cloud,x,y,0,r,'ivory');const p=part(1.3,-.6,1);shield(p);
 }else if(kind==='studio'){
  const p=part(-.1,.15,0);cursor(p,0,0,0,1.7);p.rotation.z=-.22;const idea=part(-.65,1.2,.3);ball(idea,0,0,0,.48,'lime');
  tube(part(0,-1,0),[[-1.7,0,0],[-.8,-.15,.25],[.4,.12,.3],[1.55,.28,0]],'green',.13);const plane=part(1.35,.35,.35);shape(plane,[[-.55,.2],[.7,.55],[.1,-.5],[-.05,-.03]],'coral',.08);
 }else if(['websites','website-design','search','portfolio'].includes(kind)){
  const p=page(-.25,.2,-.15);p.rotation.y=-.12;
  if(kind==='websites'){
   box(p,0,.32,.2,2.1,.28,.3,'green');for(let i=0;i<5;i++)box(p,-.84+i*.42,.32,.38,.2,.28,.06,'ivory');box(p,0,-.3,.14,1.2,.8,.05,'dark');
   const bag=part(1,-.75,.65);box(bag,0,0,0,.95,1.05,.5,'coral');ring(bag,0,.6,0,.28,.045,'dark');check(bag,0,-.05,.29,.35);
  }else if(kind==='search'){
   for(let i=0;i<4;i++)box(p,-.15,.3-i*.28,.14,1.8-i*.14,.07,.04,'metal');const glass=part(.9,-.05,1);ring(glass,0,0,0,.65,.11,'green');tube(glass,[[.45,-.45,0],[1,-1,0]],'dark',.13);tube(glass,[[-.3,-.1,0],[-.1,.18,0],[.08,.04,0],[.32,.3,0]],'coral',.05);
  }else{result(p);const mini=page(1,-.7,.7,.58);mini.rotation.z=-.16;result(mini);if(kind==='portfolio')cursor(part(-1.4,-.9,.7),0,0,0,.65);}
 }else if(kind==='systems'){
  for(const[x,y,z,c]of[[-1,-.5,.3,'dark'],[.8,-.5,.7,'green'],[0,.6,-.5,'ivory']]){const p=part(x,y,z);box(p,0,0,0,1.15,1.15,1.15,c);if(c==='green')check(p,0,0,.62,.45);}
  tube(part(),[[-1,.2,.3],[-.8,1,-.5],[0,1.25,-.5],[.8,.2,.7]],'lime',.12);
 }else if(kind==='automation'){
  const base=part(0,-.9,0);box(base,0,0,0,3.2,.2,1.5,'dark');for(let i=0;i<7;i++){const roller=mesh(new T.CylinderGeometry(.12,.12,1.2,20),'metal',base,-1.3+i*.43,.2,0);roller.rotation.x=Math.PI/2;}
  const gate=part(0,0,-.1);box(gate,-.55,.1,0,.2,1.9,.35,'green');box(gate,.55,.1,0,.2,1.9,.35,'green');box(gate,0,1,0,1.3,.23,.35,'green');
  for(const[x,c]of[[-1.25,'coral'],[1.25,'ivory']]){const p=part(x,-.2,.25);box(p,0,0,0,.65,.9,.1,c);p.rotation.z=x<0?.2:-.2;if(x>0)check(p,0,0,.12,.3);}
 }else if(kind==='assistants'){
  const book=part(0,-1,0);const left=box(book,-.7,0,0,1.4,.18,1.4,'ivory'),right=box(book,.7,0,0,1.4,.18,1.4,'ivory');left.rotation.z=-.1;right.rotation.z=.1;
  const a=chat(-.7,.8,-.2,'ivory');for(let i=0;i<3;i++)ball(a,-.4+i*.4,0,.18,.065,'dark');check(chat(.7,-.05,.5,'green'),0,0,.18,.45);
 }else if(kind==='design'){
  const p=part(.1,0,-.2);box(p,0,0,0,2,2.45,.16,'ivory');p.rotation.z=.1;tube(p,[[-.65,-.5,.2],[-.6,.6,.2],[.35,.7,.2],[.4,-.5,.2],[.75,-.6,.2]],'green',.12);
  for(let i=0;i<4;i++){const p=part(-1.15,-.9,i*.07);box(p,0,.5,0,.4,1.45,.09,['dark','green','lime','coral'][i]);p.rotation.z=.2+i*.23;}
 }else if(kind==='advertising'){
  const p=part(-.25,.25,0);const cone=mesh(new T.CylinderGeometry(.8,.3,1.8,48,1,true),'green',p);cone.rotation.z=-Math.PI/2;const mouth=ring(p,.9,0,0,.8,.08,'dark');mouth.rotation.y=Math.PI/2;box(p,-.35,-.8,0,.3,1,.4,'coral');
  const target=part(1.35,-.75,.5);for(const[r,c]of[[.6,'ivory'],[.44,'green'],[.29,'ivory'],[.14,'coral']]){const disk=mesh(new T.CylinderGeometry(r,r,.04,40),c,target,0,0,.7-r*.1);disk.rotation.x=Math.PI/2;}
 }else if(kind==='strategy'){
  const p=page(-.45,.25,-.3);tube(p,[[-.8,-.5,.2],[-.3,-.5,.2],[-.3,0,.2],[.3,0,.2],[.3,.4,.2],[.8,.4,.2]],'green',.065);for(const[x,y]of[[-.8,-.5],[-.3,0],[.8,.4]])ball(p,x,y,.23,.1,'coral');compass(1,-.7,.65);
 }else{
  const base=part(0,-.75,0);box(base,0,0,0,2.5,1.05,1.5,'green');box(base,0,.53,0,2.2,.08,1.2,'dark');tube(base,[[-.6,.5,0],[-.6,1.65,0],[.6,1.65,0],[.6,.5,0]],'metal',.09);
  const ruler=part(-.75,.65,.25);box(ruler,0,0,0,.28,2,.12,'lime');ruler.rotation.z=.25;for(let i=0;i<6;i++)box(ruler,.05,-.75+i*.27,.08,.15,.035,.03,'dark');
  const wrench=part(.85,.6,.1);box(wrench,0,-.2,0,.2,1.7,.18,'metal');ring(wrench,0,.65,0,.28,.1,'metal');wrench.rotation.z=-.3;
 }
 return{root,parts};
}
let sequence=0;
function mount(host,kind){
 const img=host.querySelector('img'),shell=document.createElement('div');shell.className='scene-shell';shell.dataset.scene=kind;
 const stage=document.createElement('div');stage.className='scene-stage';img.before(shell);shell.append(stage);stage.append(img);
 let renderer;try{renderer=new T.WebGLRenderer({alpha:true,antialias:devicePixelRatio<2,powerPreference:'low-power'});}catch{shell.dataset.state='fallback';return()=>{shell.before(img);shell.remove();};}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,640/570,.1,40);camera.position.set(4,2.6,8.5);camera.lookAt(0,.05,0);
 scene.add(new T.HemisphereLight(0xe9ffef,0x14222e,2.5));const key=new T.DirectionalLight(0xfff3d8,4);key.position.set(-3,6,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);const rim=new T.DirectionalLight(0x62ffc1,2);rim.position.set(4,2,-4);scene.add(rim);
 const {root,parts}=model(kind);scene.add(root);const ground=new T.Mesh(new T.PlaneGeometry(20,20),new T.ShadowMaterial({opacity:.18}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.65;ground.receiveShadow=true;scene.add(ground);
 const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',names[kind]+': interactive 3D model. Use arrow keys to rotate, Enter to separate parts, Escape to reset.');stage.append(canvas);
 const id='scene-help-'+(++sequence);canvas.setAttribute('aria-describedby',id);
 const controls=document.createElement('div');controls.className='scene-controls';controls.innerHTML=`<span id="${id}">${finePointer.matches?'Move cursor to tilt · Drag to rotate · Click to separate':'Drag to rotate · Tap to separate'}</span><button type="button" aria-pressed="false">Separate parts</button><button type="button">Reset</button>`;shell.append(controls);const[explodeButton,resetButton]=controls.querySelectorAll('button');
 host.removeAttribute('aria-hidden');shell.dataset.state='ready';
 let disposed=false,raf=0,angleX=0,angleY=0,targetX=0,targetY=0,hoverX=0,hoverY=0,spread=0,targetSpread=0,drag=null,moved=false;
 function frame(){raf=0;if(disposed)return;const ease=reduced.matches?1:.18;angleX+=(targetX+hoverX-angleX)*ease;angleY+=(targetY+hoverY-angleY)*ease;spread+=(targetSpread-spread)*ease;root.rotation.set(angleX,angleY,0);
  for(let i=0;i<parts.length;i++){const p=parts[i],b=p.userData.base;p.position.copy(b);p.position.x+=spread*(b.x||((i%2?1:-1)*.5))*.55;p.position.y+=spread*(b.y||.2)*.35;p.position.z+=spread*((i%3)-1)*.5;}
  renderer.render(scene,camera);shell.dataset.rotation=angleX.toFixed(3)+','+angleY.toFixed(3);shell.dataset.spread=spread.toFixed(3);
  if(Math.abs(targetX+hoverX-angleX)+Math.abs(targetY+hoverY-angleY)+Math.abs(targetSpread-spread)>.002)request();
 }
 function request(){if(!raf&&!disposed)raf=requestAnimationFrame(frame);}
 function toggle(){targetSpread=targetSpread?0:1;explodeButton.setAttribute('aria-pressed',String(!!targetSpread));explodeButton.textContent=targetSpread?'Assemble parts':'Separate parts';request();}
 function reset(){targetX=targetY=hoverX=hoverY=targetSpread=0;explodeButton.setAttribute('aria-pressed','false');explodeButton.textContent='Separate parts';request();}
 canvas.addEventListener('pointerdown',e=>{targetX=angleX;targetY=angleY;hoverX=hoverY=0;drag={x:e.clientX,y:e.clientY,rx:targetX,ry:targetY};moved=false;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag){
   if(!finePointer.matches||reduced.matches||e.pointerType==='touch')return;
   const bounds=canvas.getBoundingClientRect();
   hoverY=Math.max(-.25,Math.min(.25,((e.clientX-bounds.left)/bounds.width-.5)*.5));
   hoverX=Math.max(-.12,Math.min(.12,((e.clientY-bounds.top)/bounds.height-.5)*.24));
   request();return;
  }const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>7)moved=true;targetY=Math.max(-1.2,Math.min(1.2,drag.ry+dx*.008));targetX=Math.max(-.5,Math.min(.5,drag.rx+dy*.005));request();});
 const cancel=()=>{drag=null;};
 canvas.addEventListener('pointerleave',()=>{hoverX=hoverY=0;request();});canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('pointerup',e=>{if(drag&&!moved){const b=canvas.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1),camera);if(ray.intersectObject(root,true).length)toggle();}cancel();});
 canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' ','Escape'].includes(e.key))e.preventDefault();else return;if(e.key==='Escape')reset();else if(e.key==='Enter'||e.key===' ')toggle();else{targetY=Math.max(-1.2,Math.min(1.2,targetY+(e.key==='ArrowLeft'?-.2:e.key==='ArrowRight'?.2:0)));targetX=Math.max(-.5,Math.min(.5,targetX+(e.key==='ArrowUp'?-.15:e.key==='ArrowDown'?.15:0)));request();}});
 explodeButton.addEventListener('click',toggle);resetButton.addEventListener('click',reset);const motionChange=()=>{hoverX=hoverY=0;request();};reduced.addEventListener('change',motionChange);finePointer.addEventListener('change',motionChange);
 const resize=new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;if(w&&h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();request();}});resize.observe(stage);
 const lost=e=>{e.preventDefault();shell.dataset.state='fallback';controls.hidden=true;};canvas.addEventListener('webglcontextlost',lost);
 request();
 return()=>{disposed=true;cancelAnimationFrame(raf);resize.disconnect();reduced.removeEventListener('change',motionChange);finePointer.removeEventListener('change',motionChange);scene.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();});renderer.dispose();renderer.forceContextLoss();shell.before(img);shell.remove();};
}
// Observe only original illustrations, never client screenshots or Contact artwork.
const selector='.hm-visual,.studio-visual,.studio-original-visual';
const tracked=new Map();
const observer=new IntersectionObserver(entries=>{for(const{target,isIntersecting}of entries){const record=tracked.get(target);if(!record)continue;if(isIntersecting&&!record.dispose)record.dispose=mount(target,record.kind);else if(!isIntersecting&&record.dispose){record.dispose();record.dispose=null;}}},{rootMargin:'60px'});
function kindFor(host){return host.dataset.sceneKind||(host.querySelector('img')?.getAttribute('src')||'').match(/\/home\/([^/?]+)\.svg/)?.[1];}
function scan(){
 // React can reuse a figure when navigating between service routes. The image
 // src changes without inserting a new host: dispose the old geometry as well.
 for(const[host,record]of tracked){
  if(!host.isConnected||kindFor(host)!==record.kind){
   record.dispose?.();observer.unobserve(host);tracked.delete(host);
  }
 }
 for(const host of document.querySelectorAll(selector)){
  if(tracked.has(host))continue;
  const kind=kindFor(host);if(!names[kind])continue;
  tracked.set(host,{kind,dispose:null});observer.observe(host);
 }
}
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','data-scene-kind']});scan();
