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
add('about-partner','One partner from idea to launch',[
 G([-1.55,.85,0],[S([0,.12,0],.42,'lime'),C([0,-.38,0],.2,.28,'metal'),R([0,.12,.38],.16,.035,'ivory')]),
 G([-.45,-.2,.25],[B([0,0,0],[1.05,.8,.1],'ivory'),B([-.22,.12,.07],[.42,.36,.04],'green'),...lines(.25,.18,.07,3,.3),B([0,-.27,.07],[.75,.07,.03],'metal')],[0,0,.08]),
 G([.6,.55,.45],[B([0,0,0],[.75,.75,.75],'dark'),L([[-.18,.05,.4],[-.32,-.08,.4],[-.18,-.2,.4]],'lime',.035),L([[.18,.05,.4],[.32,-.08,.4],[.18,-.2,.4]],'lime',.035)]),
 G([1.55,-.55,.7],[C([0,.1,0],.04,1.5,'metal'),B([.32,.6,0],[.6,.38,.05],'coral'),C([0,-.66,0],.24,.08,'dark')]),
 G([0,0,0],[L([[-1.55,.42,0],[-1.15,-.05,.1],[-.95,-.2,.25]],'green',.045),L([[.07,-.2,.25],[.3,.15,.35],[.6,.17,.45]],'green',.045),L([[.98,.55,.45],[1.35,.3,.6],[1.55,-.1,.7]],'green',.045),...[[-1.15,-.05,.1],[.3,.15,.35],[1.35,.3,.6]].map(p=>S(p,.07,'lime'))])]);
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
// UX/UI: wireframes under a usability lens, mapped journeys, a component kit.
add('ux-service','A wireframe under a usability lens',[
 G([-.45,.1,0],[B([0,0,0],[1.5,2.4,.14],'dark'),B([0,.75,.1],[1.1,.32,.05],'ivory'),B([-.25,.15,.1],[.6,.55,.05],'metal'),...lines(.05,-.45,.1,3,.95),B([0,-1.05,.1],[.7,.16,.06],'green')],[0,0,.08]),
 G([.85,-.25,.75],[R([0,0,0],.55,.1,'green'),S([0,0,-.05],.42,'#9fe8c7'),L([[.4,-.4,0],[.95,-.95,0]],'ivory',.11)]),
 G([-.85,.85,.6],[S([0,0,0],.16,'coral'),R([0,0,0],.3,.03,'coral')])]);
add('ux-ui-design-features','User journeys mapped across screens',[
 ...[[-1.35,.45,0,'ivory'],[0,-.15,.35,'green'],[1.35,.45,.7,'ivory']].map(([x,y,z,c],i)=>G([x,y,z],[B([0,0,0],[.8,1.35,.1],'dark'),B([0,.3,.07],[.6,.5,.04],c),...lines(0,-.2,.07,2,.5)],[0,(i-1)*-.2,0])),
 G([0,0,0],[L([[-1.35,-.45,.1],[-.6,-.9,.2],[0,-1,.4],[.7,-.85,.6],[1.35,-.45,.75]],'lime',.05),...[[-1.35,-.45,.1],[0,-1,.4],[1.35,-.45,.75]].map(p=>S(p,.1,'coral'))])]);
add('ux-ui-design-brief','A component library ready for handover',[
 G([-.55,.15,0],[B([0,.75,0],[1.6,.42,.18],'green'),B([0,.15,0],[1.6,.42,.18],'ivory'),B([-.4,-.45,0],[.8,.42,.18],'metal'),C([.45,-.45,.05],.2,.18,'coral',[Math.PI/2,0,0]),B([0,-1.05,0],[1.6,.14,.18],'dark')],[0,.25,0]),
 G([1.05,-.4,.7],[...document(.9,1.15),check(0,-.2,.15,.35)],[0,0,-.18])]);
// Brand identity: a mark taking shape, a colour and type system, guidelines and a deck.
add('brand-service','A brand mark taking shape',[
 G([-.25,.25,0],[B([0,0,0],[1.3,1.3,.32],'green',[0,0,Math.PI/4]),B([0,0,.18],[.62,.62,.06],'ivory',[0,0,Math.PI/4]),R([0,0,0],1.12,.04,'metal')]),
 G([1.15,-.75,.6],[...['coral','lime','ivory','dark'].map((c,i)=>B([i*.12,0,i*.06],[.42,.95,.06],c,[0,0,-.35+i*.24]))]),
 G([-1.3,-.95,.5],[C([0,0,0],.22,.5,'ivory'),C([0,-.32,0],.1,.18,'metal')],[0,0,.6])]);
add('brand-identity-features','A colour and typography system',[
 G([-.75,.1,0],[...['green','lime','coral','dark','ivory'].map((c,i)=>B([-.3+i*.16,0,i*.05],[.62,1.6,.05],c,[0,0,-.5+i*.25]))]),
 G([.9,.2,.4],[B([0,0,0],[1.35,1.75,.12],'ivory'),B([-.25,.5,.09],[.62,.3,.05],'dark'),B([.08,.05,.09],[1,.11,.04],'metal'),B([-.06,-.17,.09],[.85,.08,.04],'metal'),B([-.15,-.37,.09],[.7,.08,.04],'metal'),S([.38,-.68,.1],.09,'green')],[0,0,.08])]);
add('brand-identity-brief','Guidelines beside a pitch deck',[
 G([-.75,-.25,0],[B([-.4,0,0],[.82,1.25,.08],'ivory',[0,.35,0]),B([.4,0,0],[.82,1.25,.08],'ivory',[0,-.35,0]),B([-.4,.25,.08],[.5,.35,.04],'green',[0,.35,0]),...lines(.42,.25,.1,3,.5)]),
 G([.9,.45,.35],[B([0,0,0],[1.45,.9,.08],'dark'),B([-.3,.08,.06],[.55,.38,.04],'coral'),...lines(.38,.18,.06,2,.45),C([0,-.75,0],.04,.65,'metal'),B([0,-1.1,0],[.6,.06,.3],'metal')])]);
// Motion: a storyboard in motion, keyframes on a path, a clapperboard.
add('motion-service','A storyboard coming to life',[
 G([-.4,.55,0],[B([0,0,0],[2.3,.85,.1],'dark'),...[-.72,0,.72].map((x,i)=>B([x,0,.07],[.6,.55,.04],['ivory','green','coral'][i]))],[0,0,.06]),
 G([.25,-.55,.6],[L([[-1.35,-.4,0],[-.75,.45,0],[-.15,-.4,0],[.4,.2,0],[.95,-.4,0]],'lime',.035),...[[-1.35,-.4,0,.16],[-.75,.45,0,.2],[-.15,-.4,0,.17],[.4,.2,0,.14],[.95,-.4,0,.12]].map(([x,y,z,r],i)=>S([x,y,z],r,i===1?'coral':'green'))]),
 G([1.4,.75,.2],[L([[-.18,.25,0],[.28,0,0],[-.18,-.25,0],[-.18,.25,0]],'ivory',.06)])]);
add('motion-animation-features','Keyframes along a motion path',[
 G([0,.35,0],[L([[-1.6,-.2,0],[-.8,.7,.2],[.1,.1,.35],[.9,.85,.5],[1.6,.3,.6]],'metal',.03),...[[-1.6,-.2,0],[-.8,.7,.2],[.1,.1,.35],[.9,.85,.5],[1.6,.3,.6]].map((p,i)=>S(p,.1+i*.035,i===4?'coral':'green'))]),
 G([0,-.95,.4],[B([0,0,0],[3,.12,.25],'dark'),...[-1.2,-.4,.5,1.2].map((x,i)=>B([x,0,.15],[.2,.2,.1],i===2?'coral':'lime',[0,0,Math.PI/4])),B([.15,.18,.15],[.04,.6,.04],'ivory')])]);
add('motion-animation-brief','A clapperboard ready for production',[
 G([-.25,-.3,0],[B([0,0,0],[1.9,1.25,.16],'dark'),...lines(-.15,.15,.11,3,1.2),B([0,.78,0],[1.9,.28,.16],'ivory'),...[-.6,-.05,.5].map(x=>B([x,.78,.1],[.22,.28,.04],'dark',[0,0,-.5])),B([-.1,1.15,0],[1.9,.24,.16],'ivory',[0,0,.22])]),
 G([1.25,.65,.5],[C([0,0,0],.38,.14,'green',[Math.PI/2,0,0]),C([0,0,.05],.13,.16,'dark',[Math.PI/2,0,0])])]);
// AI & data: data flowing into a model, a live dashboard, a guarded cloud pipeline.
add('data-service','Data flowing into a model',[
 G([-1.25,-.2,0],[C([0,-.55,0],.48,.32,'metal'),C([0,-.15,0],.48,.32,'green'),C([0,.25,0],.48,.32,'metal'),C([0,.43,0],.48,.03,'lime')]),
 G([.8,.3,.3],[S([0,0,0],.62,'green'),R([0,0,0],.85,.035,'ivory',[Math.PI/2.6,0,0]),R([0,0,0],.85,.035,'ivory',[0,Math.PI/2.4,.5]),S([.32,.3,.4],.08,'lime'),S([-.25,-.2,.5],.07,'coral')]),
 G([0,0,0],[L([[-.75,.1,0],[-.3,.45,.15],[.2,.3,.3]],'lime',.045),L([[-.75,-.35,0],[-.25,-.4,.2],[.25,0,.35]],'coral',.035)])]);
add('ai-data-engineering-features','A live operations dashboard',[
 G([-.2,.2,0],[B([0,0,0],[2.5,1.7,.14],'dark'),...[.25,.5,.35,.75].map((hh,i)=>B([-.85+i*.3,-.55+hh/2,.1],[.18,hh,.06],i===3?'green':'metal')),L([[.15,-.45,.12],[.45,-.15,.12],[.7,-.3,.12],[1.05,.35,.12]],'lime',.04),B([-.45,.6,.1],[1.3,.1,.04],'ivory'),S([.95,.6,.1],.08,'coral')]),
 G([1.25,-.95,.6],[B([0,0,0],[.6,.5,.4],'green'),S([0,.35,0],.08,'lime')])]);
add('ai-data-engineering-brief','A guarded cloud pipeline',[
 G([.05,.85,-.2],[...[[-.6,0,.4],[0,.2,.58],[.6,0,.42]].map(([x,y,r])=>S([x,y,0],r,'ivory'))]),
 G([-1.1,-.55,.3],[B([0,0,0],[.7,.5,.5],'metal'),S([0,.33,0],.06,'green')]),G([1.1,-.55,.3],[B([0,0,0],[.7,.5,.5],'metal'),S([0,.33,0],.06,'green')]),
 G([0,0,0],[L([[-1.1,-.3,.3],[-.6,.45,0],[0,.6,0],[.6,.45,0],[1.1,-.3,.3]],'lime',.05)]),
 G([0,-.75,.7],[B([0,0,0],[.6,.48,.28],'coral'),R([0,.33,0],.18,.06,'ivory'),S([0,0,.15],.06,'dark')])]);
// Blog: one hand-built composition per article (no AI imagery).
add('blog-agentic-ai','An AI agent planning and completing tasks',[
 G([0,.15,0],[S([0,0,0],.62,'green'),R([0,0,0],.82,.04,'ivory',[Math.PI/2.4,0,0]),S([-.2,.15,.55],.07,'dark'),S([.2,.15,.55],.07,'dark'),L([[-.18,-.12,.57],[0,-.22,.6],[.18,-.12,.57]],'dark',.035)]),
 G([-1.65,.75,.2],[...document(.8,1.05)],[0,0,.15]),
 G([-1.2,-1.05,.5],[B([0,0,0],[.85,.8,.18],'coral'),B([0,.33,.1],[.85,.14,.05],'ivory'),...[-.22,0,.22].flatMap(x=>[S([x,.02,.12],.05,'ivory'),S([x,-.2,.12],.05,'ivory')])],[0,0,.12]),
 G([.6,-1.15,.7],[B([0,0,0],[.8,1,.14],'lime'),...[.25,0,-.25].map(y=>check(-.2,y,.1,.18)),...[.25,0,-.25].map(y=>B([.12,y,.1],[.35,.05,.03],'dark'))],[0,0,-.1]),
 G([1.65,.2,.3],[...cog(.42)]),
 G([0,0,0],[L([[-1.65,.75,.2],[-.9,.6,.1],[-.5,.3,0]],'green',.035),L([[-1.2,-1.05,.5],[-.6,-.6,.3],[-.35,-.25,.1]],'green',.035),L([[.6,-1.15,.7],[.35,-.6,.4],[.2,-.3,.2]],'green',.035),L([[1.65,.2,.3],[1.1,.25,.2],[.62,.2,.1]],'green',.035)])]);
add('blog-model-context-protocol','One standard connector between AI and many tools',[
 G([0,0,0],[C([0,0,0],.62,.42,'green'),...[[-.22,.08],[.22,.08]].map(([x,z])=>C([x,.22,z],.07,.06,'dark')),R([0,.23,0],.42,.04,'ivory',[Math.PI/2,0,0])]),
 G([-1.65,.75,0],[C([0,-.3,0],.36,.22,'ivory'),C([0,-.05,0],.36,.22,'metal'),C([0,.2,0],.36,.22,'ivory')]),
 G([1.6,.8,.1],[B([0,0,0],[.8,.55,.1],'coral',[0,0,.12]),B([.05,.1,.12],[.8,.55,.1],'coral',[0,0,.05]),B([.1,.2,.24],[.8,.55,.1],'ivory'),...lines(.1,.32,.31,2,.5)]),
 G([-1.4,-1.05,.5],[B([0,0,0],[.8,.75,.16],'metal'),B([0,.3,.1],[.8,.13,.05],'dark'),...[-.2,0,.2].map(x=>S([x,-.05,.12],.05,'dark'))]),
 G([1.4,-1,.6],[B([0,0,0],[.85,.55,.2],'lime'),B([-.25,-.32,0],[.2,.2,.2],'lime',[0,0,Math.PI/4]),...[-.2,0,.2].map(x=>S([x,0,.13],.05,'dark'))]),
 G([0,0,0],[L([[-1.65,.55,0],[-.9,.4,0],[-.55,.1,0]],'metal',.05),L([[1.6,.6,.1],[.95,.4,.05],[.55,.12,0]],'metal',.05),L([[-1.4,-.8,.5],[-.8,-.5,.3],[-.45,-.15,.1]],'metal',.05),L([[1.4,-.8,.6],[.8,-.5,.3],[.45,-.15,.1]],'metal',.05)])]);
add('blog-retrieval-augmented-generation','Relevant passages lifted from documents into an answer',[
 G([-1.2,-.55,0],[B([0,0,0],[1.6,.9,1],'dark'),B([0,0,.52],[.5,.12,.05],'metal'),...[-.5,-.2,.1,.4].map((x,i)=>B([x,.6,0],[.24,.5,.8],i===2?'coral':'ivory',[0,0,(i-1.5)*.06]))]),
 G([-.4,.75,.5],[B([0,0,0],[.6,.78,.06],'coral',[0,0,-.2]),...lines(-.02,.15,.05,3,.4)]),
 G([.15,.55,.9],[R([0,0,0],.42,.08,'green'),S([0,0,-.03],.33,'#9fe8c7'),L([[.3,-.3,0],[.65,-.65,0]],'ivory',.08)]),
 G([1.45,.2,.2],[B([0,0,0],[1.15,.8,.25],'lime'),B([-.35,-.48,0],[.25,.25,.25],'lime',[0,0,Math.PI/4]),...lines(0,.15,.15,3,.75)]),
 G([0,0,0],[L([[-.4,.75,.5],[.4,1.05,.5],[1.1,.65,.25]],'green',.035),...[[0,.98,.5],[.55,1,.45],[.95,.8,.3]].map(p=>S(p,.06,'lime'))])]);
add('blog-vibe-coding','AI-generated code stacked high, with one brick slipping',[
 G([-.3,-1.05,0],[B([0,0,0],[2.4,.12,1.3],'dark'),B([0,.07,.3],[.7,.03,.35],'metal')]),
 G([-.3,-.35,-.62],[B([0,0,0],[2.3,1.35,.1],'dark'),B([0,0,.06],[2.05,1.12,.03],'#1d3a32')],[-.12,0,0]),
 G([-.3,.1,.1],[...[['ivory',1.1,-.15],['lime',.85,.05],['green',1.25,-.05],['ivory',.7,.15],['lime',1,0]].map(([c,w,x],i)=>B([x,i*.26-.3,0],[w,.2,.35],c))]),
 G([1.25,.55,.4],[B([0,0,0],[.75,.2,.35],'coral',[0,0,-.55]),L([[-.12,.12,.2],[0,-.02,.2],[.1,.1,.2]],'dark',.025)]),
 G([-1.6,1,.3],[S([0,0,0],.12,'green'),S([.35,.28,0],.07,'lime'),S([.1,.5,.1],.05,'green')]),
 G([1.55,-.55,.6],[...[0,1,2].map(i=>S([i*.14-.1,-i*.16,0],.07-i*.012,'coral'))])]);
add('blog-passkeys','A fingerprint unlocks the account; the password falls away',[
 G([-1.05,.05,0],[B([0,0,0],[1.15,2.1,.16],'dark'),B([0,0,.09],[.98,1.85,.03],'#203241'),...[.12,.22,.32,.42].map((r,i)=>R([0,.05,.12],r,.03,'green')),S([0,.05,.12],.05,'green')]),
 G([.55,.2,.3],[R([0,.55,0],.28,.08,'ivory'),B([0,-.15,0],[.13,1,.12],'ivory'),B([.14,-.5,0],[.17,.09,.12],'ivory'),B([.14,-.32,0],[.13,.09,.12],'ivory')]),
 G([1.55,-.05,.2],[B([0,-.25,0],[.85,.7,.4],'coral'),L([[-.27,.1,0],[-.27,.45,0],[-.15,.65,0],[.12,.65,0],[.27,.45,0],[.27,.3,0]],'metal',.07),C([0,-.22,.21],.07,.04,'dark',[Math.PI/2,0,0]),B([0,-.36,.21],[.05,.16,.03],'dark')]),
 G([.4,-1.05,.8],[...Array.from({length:8},(_,i)=>S([i*.2-.7,-(i%3)*.05-(i>4?.12*(i-4):0),0],.07,'metal'))])]);
add('blog-digital-twins','A physical plant beside its live digital twin',[
 G([-1.35,-.15,0],[B([0,-.85,0],[1.7,.08,1.2],'dark'),B([-.45,-.15,0],[.42,1.35,.42],'ivory'),B([-.45,.62,0],[.6,.18,.5],'coral'),R([-.45,.45,.25],.16,.04,'coral'),C([.45,-.25,0],.27,1.15,'ivory'),B([.05,-.35,.3],[1.2,.1,.22],'metal',[0,0,.55]),B([0,-.62,.4],[.6,.38,.3],'ivory')]),
 G([1.35,-.15,0],[...[[-.45,-.15,.42,1.35],[.45,-.25,.54,1.15]].flatMap(([x,y,w,hh])=>{const a=w/2,b=hh/2;return[L([[x-a,y-b,0],[x-a,y+b,0],[x+a,y+b,0],[x+a,y-b,0],[x-a,y-b,0]],'green',.022),L([[x-a,y+b,0],[x-a+.15,y+b+.1,-.3],[x+a+.15,y+b+.1,-.3],[x+a,y+b,0]],'green',.022),L([[x+a+.15,y+b+.1,-.3],[x+a+.15,y-b+.1,-.3],[x+a,y-b,0]],'green',.022)];}),L([[-.65,-.62,.3],[.6,.08,.3]],'lime',.022),L([[-.85,-.85,0],[.85,-.85,0]],'green',.022),S([-.45,.62,0],.06,'lime'),S([.45,.35,0],.06,'lime')]),
 G([0,0,0],[...[[-.3,.25,.2],[-.1,.35,.25],[.1,.3,.25],[.3,.2,.2],[-.3,-.35,.3],[-.05,-.28,.3],[.2,-.3,.3]].map((p,i)=>S(p,.045,i%2?'lime':'green'))])]);
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
// Pricing page: an approved written quote, a stack of coins and a price tag.
add('pricing','Clear prices and an agreed scope',[
 G([-.6,.15,0],[B([0,0,0],[1.5,1.95,.14],'ivory'),...lines(-.05,.6,.1,3,1),check(-.1,-.45,.13,.6)],[0,0,.12]),
 G([1.05,-.6,.35],[C([0,0,0],.42,.12,'green'),C([0,.14,0],.42,.12,'lime'),C([0,.28,0],.42,.12,'green'),C([0,.42,0],.42,.12,'lime')]),
 G([1.1,.95,.15],[B([0,0,0],[.95,.55,.1],'coral',[0,0,-.35]),R([-.28,.1,.08],.07,.03,'ivory')]),
 G([0,0,0],[L([[-.6,-1.1,.2],[.35,-1.15,.3],[1.05,-.65,.35]],'metal',.04)])]);
for(const[id,scene]of Object.entries(scenes)){
 const body=scene.parts.map(g=>g.items.map(o=>primitive(o,g)).join('')).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="570" viewBox="0 0 640 570"><title>${scene.title}</title><desc>Original page-exclusive geometric illustration. Static fallback for its interactive 3D composition; not a product screenshot.</desc><ellipse cx="320" cy="467" rx="174" ry="20" fill="#05131a" opacity=".45"/>${body}</svg>\n`;
 fs.writeFileSync('assets/img/home/'+id+'.svg',svg);
 if(id.startsWith('blog-')){fs.mkdirSync('assets/img/blog',{recursive:true});fs.writeFileSync('assets/img/blog/'+id.slice(5)+'.svg',svg);}
}
fs.writeFileSync('assets/js/page-artwork.json',JSON.stringify(scenes,null,2)+'\n');
console.log('Generated '+Object.keys(scenes).length+' page-exclusive model recipes and native SVG fallbacks.');
