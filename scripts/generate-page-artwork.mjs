/** Page-exclusive compositions shared by WebGL and native SVG fallbacks.
 * Primitives are shared like drawing tools; no complete composition is reused. */
import fs from 'node:fs';
const scenes={};
const B=(p,s,c='green',r)=>({type:'box',p,s,c,r});
const S=(p,r,c='ivory')=>({type:'sphere',p,s:[r],c});
const C=(p,r,h,c='metal',rot)=>({type:'cylinder',p,s:[r,h],c,r:rot});
const R=(p,r,t=.06,c='green',rot)=>({type:'ring',p,s:[r,t],c,r:rot});
const L=(points,c='lime',radius=.045)=>({type:'tube',points,c,radius});
const G=(p,items,r)=>({p,items,r});
const check=(x=0,y=0,z=.2,k=.5)=>L([[x-k*.5,y,z],[x-k*.1,y-k*.4,z],[x+k*.6,y+k*.5,z]],'green',.05);
const xmark=(x=0,y=0,z=.2,k=.5)=>[L([[x-k*.5,y-k*.5,z],[x+k*.5,y+k*.5,z]],'coral',.05),L([[x+k*.5,y-k*.5,z],[x-k*.5,y+k*.5,z]],'coral',.05)];
const lines=(x,y,z,count=3,w=1.1)=>Array.from({length:count},(_,i)=>B([x,y-i*.22,z],[w-i*.12,.055,.035],'metal'));
const document=(w=1.6,h=2,c='ivory')=>[B([0,0,0],[w,h,.13],c),...lines(-.03,h*.28,.1,3,w*.65)];
const cog=(r=.65)=>[R([0,0,0],r,.17,'metal'),...Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return B([Math.sin(a)*(r+.12),Math.cos(a)*(r+.12),0],[.2,.32,.26],'metal',[0,0,-a]);})];
const clock=(r=.75)=>[C([0,0,0],r,.14,'ivory',[Math.PI/2,0,0]),R([0,0,.1],r,.055,'dark'),L([[0,.45,.15],[0,0,.15],[.32,-.14,.15]],'dark',.05),S([0,0,.16],.07,'coral')];
const bars=(values=[.5,.9,1.4])=>values.map((h,i)=>B([-.6+i*.6,h/2-.8,0],[.35,h,.4],['lime','green','coral'][i]));
const pin=()=>[S([0,.2,0],.45,'coral'),C([0,-.3,0],.12,.7,'metal'),R([0,.2,.4],.16,.05,'ivory')];
function add(id,title,parts){if(scenes[id])throw Error('Duplicate scene '+id);scenes[id]={title,parts};}
// Service directory: connection, orchestration and audience discovery.
add('web-services','Connected digital foundations',[
 G([0,.2,0],[S([0,0,0],.85,'green'),R([0,0,0],.88,.025,'ivory'),R([0,0,0],.88,.025,'ivory',[0,Math.PI/2,0])]),
 G([-1.5,-.8,.1],[B([0,0,0],[.8,.6,.3],'ivory'),B([0,-.4,0],[.5,.1,.4],'metal')]),G([1.4,.9,0],[B([0,0,0],[.6,.95,.15],'dark'),B([0,0,.1],[.42,.65,.04],'lime')]),
 G([0,0,0],[L([[-1.5,-.8,0],[-1.3,.8,0],[1.4,.9,0]],'coral',.05)])]);
add('connected-services','An orchestration hub',[
 G([0,0,0],[C([0,0,0],.7,.4,'green'),R([0,.23,0],.5,.04,'ivory',[Math.PI/2,0,0])]),
 ...[[-1.4,.7,0],[1.3,.4,.2],[.3,-.8,1]].map((p,i)=>G(p,[B([0,0,0],[.7,.7,.7],['ivory','coral','dark'][i]),S([0,.45,0],.1,'lime')])),
 G([0,0,0],[L([[-1.4,.7,0],[0,.3,0],[1.3,.4,.2]],'metal',.06),L([[0,.3,0],[.3,-.8,1]],'metal',.06)])]);
add('growth-services','A recognisable message reaches people',[
 G([-.5,.2,0],[B([0,0,0],[1.3,1.8,.2],'ivory'),R([0,.2,.17],.4,.09,'green'),B([0,-.55,.17],[.75,.1,.04],'coral')],[0,0,.15]),
 ...[[1.2,.8,.1],[1.5,-.5,.5],[-1.4,-.7,.5]].map((p,i)=>G(p,[S([0,.23,0],.2,i===1?'coral':'lime'),B([0,-.18,0],[.5,.4,.3],'dark')]))]);
// Hosting page: physical infrastructure, protected backups and provisioning.
add('hosting-service','A dedicated hosting cabinet',[
 G([-.3,0,0],[B([0,0,0],[1.65,2.6,1.15],'dark'),...Array.from({length:4},(_,i)=>B([0,.9-i*.6,.62],[1.35,.4,.13],'metal')),...Array.from({length:4},(_,i)=>S([.48,.9-i*.6,.72],.045,'green'))]),
 G([1.1,-.7,.6],[R([0,0,0],.4,.1,'lime'),L([[0,0,.1],[0,.25,.1]],'ivory',.05)]),G([-1.3,1.1,-.3],[B([0,0,0],[.5,.15,1.5],'coral')])]);
add('web-hosting-features','Backup media and recovery',[
 G([-.45,-.2,0],[B([0,0,0],[1.7,1.9,.24],'metal'),C([0,.08,.2],.62,.1,'dark',[Math.PI/2,0,0]),R([0,.08,.3],.42,.045,'ivory'),S([0,.08,.33],.09,'coral'),L([[.5,-.65,.38],[.13,.15,.38]],'lime',.07)]),
 G([1.1,.8,.4],[R([0,0,0],.58,.1,'green'),B([.5,-.3,.02],[.35,.35,.16],'green',[0,0,.4])]),G([.8,-1,.7],[B([0,0,0],[.9,.28,.8],'dark')])]);
add('web-hosting-brief','Provisioning keys and access',[
 G([-.8,.5,.2],[R([0,0,0],.5,.15,'coral'),B([.65,0,0],[.9,.16,.18],'coral'),B([.95,-.17,0],[.16,.4,.18],'coral')],[0,0,.45]),
 G([.55,-.5,0],[B([0,0,0],[1.65,.6,1.05],'dark'),B([0,.2,.55],[1.2,.08,.05],'green'),S([.6,0,.56],.06,'lime')])]);
// Website design: existing responsive composition is exclusive to this page.
add('website-design-features','Responsive layout components',[
 G([-.6,.4,0],[B([0,0,0],[2.2,1.5,.18],'dark'),B([-.55,.05,.12],[.7,.95,.05],'ivory'),B([.4,.4,.12],[.8,.2,.06],'green'),...lines(.4,.05,.12,2,.7),B([0,-.95,0],[.8,.12,.55],'metal')]),
 G([1,-.55,.6],[B([0,0,0],[.65,1.2,.15],'ivory'),B([0,.2,.12],[.44,.45,.05],'coral'),...lines(0,-.2,.12,2,.35)]),G([-1.25,-1,.65],[S([0,0,0],.15,'lime')])]);
add('website-design-brief','From sketch to launch',[
 G([-.7,0,0],[...document(1.4,1.8),B([0,-.45,.13],[.9,.4,.05],'green')],[0,0,.2]),
 G([.85,.25,.5],[C([0,0,0],.2,2,'lime'),C([0,-1.1,0],.08,.25,'dark')],[0,0,-.5]),
 G([.6,-.9,.9],[B([0,0,0],[1.1,.15,.65],'dark'),check(0,.1,.1,.45)])]);
// Ecommerce: cart, delivery and order fulfilment; no Home storefront reuse.
add('commerce-service','A shopping cart with products',[
 G([-.2,-.15,0],[B([0,0,0],[1.9,.15,1.2],'green'),B([-.95,.42,0],[.1,.9,1.2],'green'),B([0,.42,-.6],[1.9,.9,.1],'green'),L([[-.95,.8,0],[-1.35,1.3,0],[-1.7,1.3,0]],'metal',.08),...[-.6,.6].map(x=>C([x,-.5,.35],.22,.14,'dark',[Math.PI/2,0,0]))]),
 G([.1,.55,.1],[B([0,0,0],[.75,.85,.75],'coral')],[0,.2,-.1]),G([.6,1,-.3],[B([0,0,0],[.5,.4,.5],'ivory')])]);
add('ecommerce-features','Delivery and order tracking',[
 G([-.3,-.15,0],[B([-.35,.1,0],[1.6,1.25,1.1],'ivory'),B([.9,-.12,0],[.85,.8,1.1],'green'),B([.9,.28,.57],[.55,.35,.04],'dark'),...[-.8,.85].map(x=>C([x,-.65,.4],.27,.2,'dark',[Math.PI/2,0,0]))]),
 G([.6,1.05,-.1],[...pin()]),G([-1.15,-1,.6],[B([0,0,0],[.65,.5,.65],'coral')])]);
add('ecommerce-brief','Preparing an order for handover',[
 G([-.35,-.35,0],[B([0,0,0],[1.8,1.25,1.4],'coral'),B([0,.65,0],[.22,.08,1.4],'ivory'),B([0,0,.73],[.22,1.25,.04],'ivory')]),
 G([.8,.85,.5],[...document(.85,1.15),check(0,-.25,.15,.35)],[0,0,-.2]),G([-1.1,1,0],[R([0,0,0],.32,.08,'green')])]);
// Systems: records/control, permissions and requirements.
add('system-service','A shared data and control desk',[
 G([-.85,-.1,0],[...[-.45,0,.45].map(y=>C([0,y,0],.6,.4,'green'))]),
 G([.65,.3,.25],[B([0,0,0],[1.7,1.45,.2],'dark'),...bars([.4,.8,1.1]).map(o=>({...o,p:[o.p[0],o.p[1]+.3,.22],s:[o.s[0],o.s[1],.12]}))]),G([.6,-.8,.3],[B([0,0,0],[1.7,.15,.8],'metal')])]);
add('business-systems-features','Roles and controlled access',[
 G([0,0,0],[B([0,0,0],[1.35,1.2,.45],'green'),R([0,.8,0],.46,.1,'metal'),C([0,.05,.26],.12,.04,'dark',[Math.PI/2,0,0])]),
 ...[[-1.3,-.7,.1],[1.3,.8,-.1]].map((p,i)=>G(p,[S([0,.2,0],.2,i?'coral':'ivory'),B([0,-.2,0],[.6,.5,.3],'dark'),L([[0,0,0],[-p[0]*.6,-p[1]*.6,0]],'lime',.04)]))]);
add('business-systems-brief','A requirements board with priorities',[
 G([0,.1,0],[B([0,0,0],[2.4,1.9,.15],'ivory'),...[-.75,0,.75].flatMap((x,i)=>[B([x,.5,.12],[.5,.16,.06],['green','dark','coral'][i]),B([x,.05,.12],[.5,.5,.08],'lime'),B([x,-.55,.12],[.5,.38,.08],'metal')])]),
 G([0,-1.1,0],[B([0,0,0],[2.2,.12,.8],'dark')])]);
// Automation: branching flow, interacting gears, a scheduled run.
add('workflow-service','A branching workflow with a human checkpoint',[
 G([0,0,0],[L([[-1.25,.8,0],[0,.8,0],[0,-.8,0],[1.2,-.8,0]],'metal',.09),L([[0,.8,0],[1.2,.8,0]],'metal',.09)]),
 ...[[-1.3,.8,0,'ivory'],[0,.8,0,'coral'],[1.25,.8,0,'green'],[1.25,-.8,0,'lime']].map(([x,y,z,c],i)=>G([x,y,z],[B([0,0,0],[.65,.65,.4],c),...(i===1?[R([0,0,.25],.17,.04,'ivory')]:[])]))]);
add('workflow-automation-features','Repeatable operations driven together',[
 G([-.65,.3,0],cog(.65)),G([.65,-.55,0],cog(.45)),G([.8,.95,.2],[B([0,0,0],[.95,.65,.15],'green'),check(0,0,.15,.4)]),G([-1.25,-1.1,0],[B([0,0,0],[2.4,.16,1],'dark')])]);
add('workflow-automation-brief','A scheduled process ready to run',[
 G([-.45,.35,0],clock(.9)),G([.9,-.65,.5],[B([0,0,0],[1,.75,.3],'green'),L([[-.15,-.2,.2],[.2,0,.2],[-.15,.2,.2],[-.15,-.2,.2]],'ivory',.055)]),G([-.9,-1,.2],[B([0,0,0],[1.8,.15,.7],'dark')])]);
// Assistants: service kiosk, grounded sources and guardrails.
add('assistant-service','A useful support assistant',[
 G([0,0,0],[B([0,0,0],[1.9,1.6,.35],'green'),...[-.5,0,.5].map(x=>S([x,.15,.23],.11,'ivory')),B([-.5,-.85,0],[.25,.5,.25],'green')]),
 G([0,-1.15,0],[B([0,0,0],[2.5,.2,1.1],'dark')]),G([1.25,.9,.3],[R([0,0,0],.32,.07,'coral')])]);
add('ai-assistants-features','Answers grounded in source documents',[
 G([-.75,0,-.25],[...document(1.1,1.65)],[0,0,.15]),G([-.1,.3,0],[...document(1.1,1.65)],[0,0,-.1]),
 G([.95,-.4,.7],[R([0,0,0],.55,.1,'green'),L([[.4,-.4,0],[.85,-.85,0]],'coral',.11),L([[-.15,-.1,.05],[0,.15,.05],[.23,-.05,.05]],'ivory',.05)])]);
add('ai-assistants-brief','Guardrails before assistant handover',[
 G([0,0,0],[B([0,0,0],[1.7,2.05,.15],'ivory'),B([0,.55,.14],[1.2,.25,.08],'dark'),...[-.1,-.55].map(y=>B([.2,y,.15],[.65,.06,.04],'metal')),check(-.45,-.1,.2,.25)]),
 G([1,-.65,.7],[B([0,0,0],[.65,.6,.3],'green'),R([0,.42,0],.24,.06,'metal')])]);
// Basic design: printmaking, stationery and delivery packaging.
add('graphic-service','A small print and layout press',[
 G([0,-.5,0],[B([0,0,0],[2.5,.7,1.3],'dark'),B([0,.4,.1],[2,.18,1],'ivory'),C([0,.8,-.1],.22,2.3,'green',[0,0,Math.PI/2])]),
 G([.3,.2,.8],[B([0,0,0],[1.3,1.4,.09],'ivory'),B([0,.2,.08],[.8,.65,.05],'coral'),...lines(0,-.3,.08,2,.8)],[.45,0,0])]);
add('basic-graphic-design-features','A coordinated stationery set',[
 G([-.75,.2,0],[B([0,0,0],[1.5,2,.12],'ivory'),R([0,.5,.1],.25,.07,'green'),...lines(0,-.15,.1,3,1)]),
 G([.8,-.65,.5],[B([0,0,0],[1.55,.9,.16],'dark'),R([-.4,0,.12],.18,.05,'coral'),B([.3,0,.12],[.5,.07,.03],'metal')],[0,0,-.2])]);
add('basic-graphic-design-brief','Design files ready for delivery',[
 G([-.2,-.25,0],[B([0,0,0],[2.2,1.5,.25],'coral'),L([[-1.05,.65,.16],[0,-.1,.16],[1.05,.65,.16]],'ivory',.045)]),
 G([.5,.9,-.2],[B([0,0,0],[1.2,1.4,.1],'ivory'),B([0,.15,.1],[.75,.6,.06],'green')],[0,0,-.15])]);
// Search and ads retain their existing exclusive introduction scenes.
add('seo-and-search-features','A clear crawlable information structure',[
 G([0,0,0],[L([[0,1,0],[0,0,0],[-1.2,0,0],[-1.2,-.9,0]],'metal',.07),L([[0,0,0],[1.2,0,0],[1.2,-.9,0]],'metal',.07)]),
 ...[[0,1,0],[-1.2,-.9,0],[0,-.9,0],[1.2,-.9,0]].map((p,i)=>G(p,[B([0,0,0],[.65,.6,.3],i?'ivory':'green'),B([0,0,.19],[.35,.06,.03],'coral')]))]);
add('seo-and-search-brief','A discovery route with a clear destination',[
 G([0,-.6,0],[B([0,0,0],[2.7,.2,1.7],'ivory'),L([[-1,.15,.45],[-.6,.15,-.4],[.3,.15,.1],[.9,.15,-.5]],'green',.07)]),
 G([.9,.3,-.5],[C([0,0,0],.04,1.7,'metal'),B([.35,.65,0],[.65,.45,.08],'coral')]),G([-1,-.35,.45],[S([0,0,0],.13,'lime')])]);
add('google-ads-features','Campaign measurement against a clear goal',[
 G([-.25,0,0],[B([0,0,-.2],[2.5,2,.12],'dark'),...bars([.5,.95,1.4]),L([[-.95,-.65,.25],[-.35,-.1,.25],[.3,-.25,.25],[.95,.65,.25]],'ivory',.055)]),
 G([1.15,-.85,.6],[C([0,0,0],.4,.13,'lime',[Math.PI/2,0,0]),R([0,0,.1],.27,.045,'green')])]);
add('google-ads-brief','Budget and launch dates agreed',[
 G([-.55,.15,0],[B([0,0,0],[1.9,1.9,.15],'ivory'),B([0,.65,.1],[1.75,.3,.07],'green'),...[-.5,0,.5].flatMap(x=>[-.25,-.7].map(y=>B([x,y,.12],[.28,.25,.05],'metal'))),...[-.55,.55].map(x=>R([x,.95,0],.15,.045,'coral'))]),
 G([1,-.75,.5],[C([0,0,0],.45,.16,'coral',[Math.PI/2,0,0]),R([0,0,.12],.3,.03,'ivory')])]);
// Product strategy: its compass/roadmap introduction is not used elsewhere.
add('product-design-strategy-features','Prototype options ready for comparison',[
 ...[[-.9,.15,-.2],[.1,.55,0],[1,-.35,.3]].map((p,i)=>G(p,[B([0,0,0],[.85,1.4,.12],'ivory'),B([0,.25,.1],[.6,.4,.05],['green','coral','dark'][i]),...lines(0,-.2,.1,2,.5)],[0,0,(i-1)*-.12])),
 G([0,-1,0],[B([0,0,0],[2.8,.15,1],'dark')])]);
add('product-design-strategy-brief','A prioritised decision for the next step',[
 G([-.7,-.4,0],[B([0,0,0],[.8,.7,.8],'dark')]),G([.25,-.1,0],[B([0,0,0],[.8,1.3,.8],'green')]),G([1.2,.3,0],[B([0,0,0],[.8,2.1,.8],'ivory')]),
 G([1.2,1.65,0],[C([0,0,0],.045,1.1,'metal'),B([.3,.35,0],[.6,.4,.08],'coral')])]);
// About: a project kept in motion with the client in the loop, and a clear scope boundary.
// Contact: questions raised and answered, exclusive to the FAQ section.
add('about-principles','Your project at the centre of the loop',[
 G([0,.1,0],[R([0,.1,0],.72,.15,'green'),S([0,.1,0],.34,'lime')]),
 ...[[-1.35,.85,0,'ivory'],[1.3,.7,.15,'coral'],[0,-1.05,.4,'dark']].map(([x,y,z,c],i)=>G([x,y,z],[B([0,0,0],[.66,.66,.66],c,[0,i*.5,0]),S([0,.5,0],.08,'green')])),
 G([0,0,0],[L([[-1.35,.85,0],[0,.1,0],[1.3,.7,.15]],'metal',.055),L([[0,.1,0],[0,-1.05,.4]],'metal',.055)])]);
add('about-scope','A clear boundary around the work',[
 G([0,.1,0],[B([0,0,0],[1.8,2.2,.16],'ivory'),...[-.5,.1,.7].map(y=>B([.15,y,.12],[.95,.075,.04],'metal')),...[-.5,.1,.7].flatMap(y=>xmark(-.55,y,.14,.34))]),
 G([0,.1,0],[R([0,.1,0],1.6,.08,'coral')])]);
// Contact: conversation — two linked shapes connected by a sculptural line.
add('contact-conversation','A conversation that starts a project',[
 G([-.5,.1,.2],[B([0,0,0],[.9,.7,.4],'ivory'),S([.25,.35,0],.06,'green')]),
 G([.5,.1,-.1],[B([0,0,0],[.9,.7,.4],'coral'),S([.25,.35,0],.06,'green')]),
 G([0,.1,0],[L([[-.5,.1,.2],[.5,.1,-.1]],'metal',.05),S([0,.1,0],.08,'green')]),
 G([0,-.5,.3],[B([0,0,0],[.6,.5,.3],'dark'),S([.15,.2,0],.05,'lime')])]);
add('contact-faq','Questions answered, in plain language',[
 G([-.72,.6,0],[B([0,0,0],[1.35,.85,.3],'ivory'),B([-.36,-.5,0],[.3,.35,.3],'ivory'),...[-.35,0,.35].map(x=>S([x,.6,.2],.075,'dark'))]),
 G([.88,-.55,.4],[B([0,0,0],[1.5,.9,.3],'green'),B([.36,-.53,0],[.3,.33,.3],'green'),L([[-.26,-.56,.22],[-.05,-.74,.22],[.28,-.35,.22]],'dark',.05)])]);
// About: AI governance — a shielded lock around the model, with review nodes above it.
add('about-governance','Data guarded, review before anything ships',[
 G([0,-.2,0],[B([0,0,0],[1.7,2.1,.2],'dark'),...[-.5,.1,.7].map(y=>B([.12,y,.1],[.9,.07,.04],'metal'))]),
 G([0,.2,0],[R([0,.2,0],.9,.06,'green'),S([0,.2,0],.4,'lime'),...[-.55,0,.55].map(x=>S([x,.2,.25],.06,'coral'))])]);
// Project primitive geometry to native SVG, giving every new model a matching
// page-exclusive fallback, not a renamed copy of another page's illustration.
const palette={green:'#00ce7b',ivory:'#f0efd4',dark:'#244d41',lime:'#c8df8a',coral:'#ee9b7b',metal:'#8cbaa2'};
const project=([x,y,z])=>[320+(x-z*.42)*82,285-y*82+z*23];
function rotate([x,y,z],[rx=0,ry=0,rz=0]=[]){let a=y*Math.cos(rx)-z*Math.sin(rx),b=y*Math.sin(rx)+z*Math.cos(rx);y=a;z=b;a=x*Math.cos(ry)+z*Math.sin(ry);b=-x*Math.sin(ry)+z*Math.cos(ry);x=a;z=b;return[x*Math.cos(rz)-y*Math.sin(rz),x*Math.sin(rz)+y*Math.cos(rz),z];}
const point=(p,g)=>project(rotate(p,g.r).map((n,i)=>n+g.p[i]));
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.round(parseInt(v,16)*f).toString(16).padStart(2,'0')).join('');
const poly=(points,fill)=>`<polygon points="${points.map(p=>p.map(n=>n.toFixed(1)).join(',')).join(' ')}" fill="${fill}" stroke="#d7f2dc22" stroke-width="1"/>`;
function primitive(o,g){const c=palette[o.c]||o.c;
 if(o.type==='tube'){return `<polyline points="${o.points.map(p=>point(p,g).join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="${o.radius*164}" stroke-linecap="round" stroke-linejoin="round"/>`;}
 const p=point(o.p,g);
 if(o.type==='sphere')return `<circle cx="${p[0]}" cy="${p[1]+5}" r="${o.s[0]*82}" fill="${shade(c,.55)}"/><circle cx="${p[0]}" cy="${p[1]}" r="${o.s[0]*82}" fill="${c}"/><circle cx="${p[0]-o.s[0]*24}" cy="${p[1]-o.s[0]*24}" r="${o.s[0]*28}" fill="#ffffff33"/>`;
 if(o.type==='ring')return `<circle cx="${p[0]}" cy="${p[1]}" r="${o.s[0]*82}" fill="none" stroke="${c}" stroke-width="${o.s[1]*164}"/>`;
 let [w,h,d]=o.type==='cylinder'?[o.s[0]*2,o.s[1],o.s[0]*2]:o.s;
 // Apply local object rotation before the part's rotation/translation.
 const vertex=(x,y,z)=>point(rotate([x,y,z],o.r).map((n,i)=>n+o.p[i]),g);
 const a=vertex(-w/2,h/2,d/2),b=vertex(w/2,h/2,d/2),cc=vertex(w/2,-h/2,d/2),dd=vertex(-w/2,-h/2,d/2),e=vertex(-w/2,h/2,-d/2),f=vertex(w/2,h/2,-d/2),j=vertex(w/2,-h/2,-d/2);
 return poly([b,f,j,cc],shade(c,.62))+poly([a,b,f,e],shade(c,.92))+poly([a,b,cc,dd],c);
}
for(const[id,scene]of Object.entries(scenes)){
 const body=scene.parts.map(g=>g.items.map(o=>primitive(o,g)).join('')).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="570" viewBox="0 0 640 570"><title>${scene.title}</title><desc>Original page-exclusive geometric illustration. Static fallback for its interactive 3D composition; not a product screenshot.</desc><ellipse cx="320" cy="467" rx="174" ry="20" fill="#05131a" opacity=".45"/>${body}</svg>\n`;
 fs.writeFileSync('assets/img/home/'+id+'.svg',svg);
}
fs.writeFileSync('assets/js/page-artwork.json',JSON.stringify(scenes,null,2)+'\n');
console.log('Generated '+Object.keys(scenes).length+' page-exclusive model recipes and native SVG fallbacks.');
