"""Original conceptual SVG collection: section-specific scalable service narratives.
No raster embeds, traced screenshots, mascot borrowing or fake app interfaces.
Run: python3 scripts/generate-home-artwork.py && npm run build
"""
from pathlib import Path
from html import escape
ROOT=Path(__file__).resolve().parent.parent
DEFS='''<defs>
<linearGradient id="emerald" x2=".8" y2="1"><stop stop-color="#6af2bc"/><stop offset=".35" stop-color="#18cd8a"/><stop offset="1" stop-color="#00734f"/></linearGradient>
<linearGradient id="ivory" x2=".65" y2="1"><stop stop-color="#fff9df"/><stop offset=".65" stop-color="#e3e7c9"/><stop offset="1" stop-color="#acbea4"/></linearGradient>
<linearGradient id="forest" x2=".8" y2="1"><stop stop-color="#537d6a"/><stop offset=".55" stop-color="#284d42"/><stop offset="1" stop-color="#142f2b"/></linearGradient>
<linearGradient id="lime" x2=".8" y2="1"><stop stop-color="#f0f5b7"/><stop offset=".55" stop-color="#c6dd75"/><stop offset="1" stop-color="#7ba34c"/></linearGradient>
<linearGradient id="coral" x2=".6" y2="1"><stop stop-color="#ffc5a1"/><stop offset=".5" stop-color="#ee916e"/><stop offset="1" stop-color="#ae5147"/></linearGradient>
<linearGradient id="ink" x2=".7" y2="1"><stop stop-color="#35555c"/><stop offset="1" stop-color="#10262e"/></linearGradient>
<linearGradient id="steel" x2=".8" y2="1"><stop stop-color="#e6eede"/><stop offset=".2" stop-color="#6f9782"/><stop offset=".6" stop-color="#b2c9b4"/><stop offset="1" stop-color="#3d6654"/></linearGradient>
<radialGradient id="pearl" cx=".3" cy=".25" r=".8"><stop stop-color="#ffffed"/><stop offset=".35" stop-color="#dbedaa"/><stop offset=".8" stop-color="#8eb86b"/><stop offset="1" stop-color="#427651"/></radialGradient>
<filter id="cast" x="-70%" y="-70%" width="240%" height="260%"><feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#020e16" flood-opacity=".55"/></filter>
<filter id="soft" x="-60%" y="-100%" width="220%" height="300%"><feGaussianBlur stdDeviation="13"/></filter>
</defs>'''
def path(d,fill='none',stroke=None,w=2,extra=''):
 return f'<path d="{d}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"' if stroke else '')+f' {extra}/>'
def rect(x,y,w,h,fill,rx=0,stroke=None,extra=''):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"'+(f' stroke="{stroke}"' if stroke else '')+f' {extra}/>'
def circle(x,y,r,fill,stroke=None,w=2,extra=''):
 return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{w}"' if stroke else '')+f' {extra}/>'
def ellipse(x,y,rx,ry,fill,extra=''):
 return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" {extra}/>'
def group(body,t='',extra=''):return f'<g transform="{t}" {extra}>{body}</g>'
def line(d,c='#759f89',w=2):return path(d,stroke=c,w=w)
def extrude(d,top='url(#emerald)',side='#075b42',depth=13):
 return path(d,side,extra=f'transform="translate(0 {depth})"')+path(d,top,'#d5f9de33',1.3)
def ground():return ellipse(320,491,211,24,'#020e16','opacity=".6" filter="url(#soft)"')
def sparkle(x,y,r=12):return path(f'M{x-r} {y}h{r*2}M{x} {y-r}v{r*2}',stroke='#a8d8b0',w=1.5)+circle(x,y,2,'#dbf2cc')
def bead(x,y,r=10,c='url(#coral)'):return circle(x+3,y+6,r,'#061c23')+circle(x,y,r,c)
def arrow(d,c='#a6c972',w=5):return path(d,stroke=c,w=w)
def cursor(x,y,scale=1,angle=0):
 d='M0 0 0 103 27 78 49 123 68 113 44 69 82 63Z'
 return group(extrude(d,'url(#ivory)','#729d86',8),f'translate({x} {y}) rotate({angle}) scale({scale})',extra='filter="url(#cast)"')
def check(x,y,scale=1,c='#174633'):
 return group(line('m-16 0 11 11L20-15',c,6),f'translate({x} {y}) scale({scale})')
def cube(x,y,w=92,h=90,color='emerald'):
 # Front-lit isometric block: top, left and right faces remain independent shapes.
 d=f'M{x} {y} {x+w} {y-34} {x+w+57} {y-4} {x+57} {y+31}Z'
 return path(f'M{x} {y}v{h}l57 31v-{h}Z','#24483d')+path(f'M{x+57} {y+31} {x+w+57} {y-4}v{h}l-{w} 35Z',f'url(#{color})')+path(d,'url(#ivory)' if color=='ivory' else f'url(#{color})','#cbf3d533',1)+line(f'M{x+57} {y+31}v{h}','#bbebca30',1)
def sheet(x,y,w=150,h=174,angle=0):
 return group(rect(4,9,w,h,'#0c292c',7)+rect(0,0,w,h,'url(#ivory)',7,'#d9ebce'),f'translate({x} {y}) rotate({angle})')
def bubble(x,y,w=180,h=128,color='emerald',angle=0):
 d=f'M24 0H{w-24}Q{w} 0 {w} 24V{h-24}Q{w} {h} {w-24} {h}H71l-36 32v-32H24Q0 {h} 0 {h-24}V24Q0 0 24 0Z'
 return group(extrude(d,f'url(#{color})','#143f34',12),f'translate({x} {y}) rotate({angle})',extra='filter="url(#cast)"')
# Small semantic refinements to the accepted Home compositions. Contact is excluded.
ACCENTS={
 'studio':line('M91 452q-24-31-4-58','#7baa8f',2)+circle(91,452,4,'url(#ivory)')+rect(80,387,12,12,'none',2,'#8dd9ac'),
 'hosting':group(path('M-22 6a24 24 0 1 1 37 13','none','#1d8058',4)+path('m10 9 7 11 9-9','none','#1d8058',4),'translate(324 143)'),
 'websites':group(rect(4,6,58,107,'#12352d',9)+rect(0,0,58,107,'url(#forest)',9,'#91caaa')+rect(6,9,46,80,'url(#ivory)',3)+rect(14,20,30,25,'url(#emerald)',2)+line('M14 55h29M14 65h23','#719573',3)+circle(29,98,3,'#b7d7aa'),'translate(124 365) rotate(-9)',extra='filter="url(#cast)"'),
 'systems':line('M119 391h34m-34 13h34','#91caaa',3)+circle(131,391,4,'url(#ivory)')+circle(146,404,4,'url(#coral)'),
 'automation':line('M106 330h-30q-13 0-13-14v-30','#71ac87',3)+path('m55 295 8-11 8 11','none','#b6d98a',3),
 'assistants':path('m356 396 19-8v40l-10-5-9 14Z','url(#coral)')+line('M193 299q-21 31-4 49','#7aaa88',2),
 'design':line('m477 370-24 23','#e4efba',4)+path('m466 369 12-1-1 12','none','#e4efba',3),
}
def save(name,title,description,body,contact=False):
 body+=ACCENTS.get(name,'') if not contact else ''
 out=ROOT/('assets/img/portfolio' if contact else 'assets/img/home')/(name+'.svg');out.parent.mkdir(parents=True,exist_ok=True)
 out.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="570" viewBox="0 0 640 570" fill="none"><title>{escape(title)}</title><desc>{escape(description)} Original conceptual vector artwork. Every object is an editable SVG path or shape; not a product screenshot.</desc>{DEFS}{ground()}{body}</svg>\n')
# 01 / THE STUDIO. An idea held inside a dimensional cursor-shaped doorway.
# A sketch curve enters as a thin line and leaves as a solid, built ribbon.
s=line('M69 432C19 350 157 338 143 244S92 91 214 109','#72a58a',2)
s+=path('M137 423C192 472 255 464 310 432S433 401 490 426','none','#0b382e',28)
s+=path('M137 410C192 459 255 451 310 419S433 388 490 413','none','url(#emerald)',25)
d='M225 139 409 194 335 244 362 379 315 393 287 258 225 315Z'
s+=group(extrude(d,'url(#ivory)','#809c7b',22),'rotate(-10 300 260)',extra='filter="url(#cast)"')
s+=circle(245,153,55,'url(#pearl)',extra='filter="url(#cast)"')
s+=line('M217 115 207 97m42 2 2-24m31 34 16-17','#c6e5ae',4)
s+=path('m390 345 107-47-44 104-17-42Z','url(#coral)','#f1c6a466',1)
s+=line('m390 345 46 15 61-62','#ffe8c555',2)
s+=bead(123,302,14)+sparkle(473,155,16)+circle(463,467,7,'url(#lime)')
save('studio','From a spark to something useful','An oversized sculptural cursor lifts an idea sphere as a drawn line becomes a built ribbon and a paper plane takes flight.',s)
# 02 / HOSTING. Infrastructure is tangible, protected and connected.
s=ellipse(311,447,176,55,'#17382f')+ellipse(311,434,176,55,'url(#forest)')
s+=path('M194 197C144 197 123 158 145 124c15-25 43-31 68-21 18-62 117-73 145-12 48-11 91 34 79 75-5 21-23 31-47 31Z','url(#ivory)','#eef2d766',1,extra='filter="url(#cast)"')
s+=line('M168 177q-23-31 12-43m56-16q24-44 66-23','#fff9e7',3)
for i in range(3):
 y=241+i*62
 s+=group(extrude('M0 0 174-32 209-5 35 29Z','url(#forest)','#16382e',28)+path('M35 29 209-5v27L35 58Z','url(#ink)')+line('M51 37 134 21','#648f79',4)+circle(181,14,5,'#58f2a4')+circle(166,17,2,'#c7df8d'),f'translate(181 {y})',extra='filter="url(#cast)"' if i==2 else '')
s+=line('M191 438v26q0 25-27 25h-26M363 434v41q0 17 26 17h57','#00b77b',6)
s+=circle(133,489,8,'url(#ivory)')+circle(451,492,8,'url(#ivory)')
d='M414 294q43 32 84 15v62q-2 66-48 89-47-30-50-88v-62Z'
s+=group(extrude(d,'url(#emerald)','#074c3a',10),'',extra='filter="url(#cast)"')+check(450,370,1.1,'#e2f7d8')
s+=sparkle(479,154,12)+bead(119,353,8)
save('hosting','A dependable home for your digital business','A satin cloud shelters three connected server layers; a solid shield and a clear check mark communicate protection and recovery.',s)
# 03 / WEB & ECOMMERCE. A browser becomes a physical shop, not a tiny mock screen.
s=group(extrude('M129 408 373 348 515 416 269 480Z','url(#forest)','#102e28',16),'',extra='filter="url(#cast)"')
s+=group(rect(11,13,309,252,'#0c2a29',18)+rect(0,0,309,252,'url(#ivory)',18,'#e3f0d8')+rect(0,0,309,40,'url(#forest)',18)+rect(0,22,309,18,'#355e4a')+''.join(circle(20+j*15,19,3.5,c) for j,c in enumerate(['#f2bc94','#d5e69c','#82d7a7']))+rect(102,12,162,13,'#214a3b',6), 'translate(134 124) rotate(-8 155 126)',extra='filter="url(#cast)"')
s+=path('M174 232 192 179 402 149 418 198Z','url(#emerald)')
for i in range(5):
 x=174+i*48
 s+=path(f'M{x} {232-i*7}l18-53 25-4-10 55q-11 18-33 2Z','url(#ivory)' if i%2==0 else 'url(#emerald)')
s+=path('m206 240 162-24v145l-162 24Z','url(#ink)')
s+=path('m225 251 120-18v115l-120 18Z','url(#forest)')+path('m239 263 90-13v85l-90 13Z','url(#lime)')
s+=line('M286 257v84','#476841',2)+line('m240 301 89-13','#476841',2)
s+=group(path('M-2 35 109 15 124 147 7 169Z','url(#coral)','#f1c2a666',1)+path('M20 34c-6-81 62-91 61-12','none','#2a5741',10)+path('M29 32c-6-63 44-70 43-9','none','#ecba8b',4)+circle(56,92,23,'#a65b48')+check(56,94,.75,'#ffeac9'),'translate(363 305) rotate(7)',extra='filter="url(#cast)"')
s+=cursor(100,357,.65,-18)+sparkle(475,153,14)
save('websites','From a first impression to an open door','A dimensional browser frame becomes a welcoming shop front, with an open window, shopping bag and a large purposeful cursor.',s)
# 04 / SYSTEMS. One path links separate modules; each piece has a purpose.
s=line('M93 330 291 221 529 341 325 458Z','#2f5e48',2)
s+=cube(96,307,112,116,'forest')+cube(319,342,113,108,'emerald')+cube(254,183,116,119,'ivory')
s+=path('M148 306 273 236 363 277 260 341 370 398','none','#063a2c',25)
s+=path('M148 292 273 222 363 263 260 327 370 384','none','url(#lime)',23)
s+=circle(151,291,19,'url(#coral)')+circle(368,383,18,'url(#ivory)')
s+=path('m294 169 37-22 39 21-38 24Z','url(#emerald)')+path('m294 169 38 23v39l-38-22Z','#0e7854')+path('m332 192 38-24v39l-38 24Z','#2bad76')
s+=line('M143 346v33m-10-16h26','#9cc19f',4)+check(427,415,.8,'#c3efbd')
s+=group(circle(0,0,24,'url(#ivory)')+circle(0,0,11,'#245342')+''.join(rect(-4,-37,8,15,'#d7e7c5',2,extra=f'transform="rotate({a})"') for a in range(0,360,60)),'translate(449 170)',extra='filter="url(#cast)"')+sparkle(140,180,13)
save('systems','Separate parts. One connected business.','Three architectural modules are joined by one continuous lime pathway, turning disconnected tasks into a coherent system.',s)
# 05 / AUTOMATION. A roller turns scattered work into a checked output.
s=path('M121 372 374 303 520 379 269 452Z','url(#forest)','#80a58d44',1)
s+=path('M121 372v31l148 78 251-74v-28l-251 73Z','#13392f')
for i in range(6):
 x=163+i*40;y=382-i*10
 s+=ellipse(x,y,17,9,'#719a82')+ellipse(x,y-4,17,9,'url(#steel)')
s+=group(sheet(0,0,107,125)+line('M22 31h60M22 46h43M22 61h56','#89a07e',4),'translate(89 213) rotate(-18)',extra='filter="url(#cast)"')
s+=path('M166 279C190 174 234 147 295 151l16 37c-65-6-81 42-92 114Z','url(#ivory)','#e6f1d9',1)
s+=path('M270 217q0-55 52-60 57-5 57 55v147l-31 8V219q0-29-25-28-24 1-24 29v158l-29-16Z','url(#emerald)','#a4f0be44',1,extra='filter="url(#cast)"')
s+=circle(322,224,30,'#164e37')+circle(322,224,20,'url(#lime)')+check(322,225,.65)
s+=group(extrude('M0 0H103V123H0Z','url(#ivory)','#789579',8)+circle(51,52,26,'url(#emerald)')+check(51,52,.75)+line('M24 99h56','#849b7e',4),'translate(407 288) rotate(13)',extra='filter="url(#cast)"')
s+=path('M252 169v-34q0-31 31-31h39','none','#6b9778',3)+path('m312 94 12 10-12 10','none','#b1d88b',3)+bead(465,209,15)+sparkle(106,157,12)
save('automation','Less repeat. A clear human checkpoint.','Loose paperwork enters a curved processing gate and becomes a checked output on a short conveyor; the visible checkpoint keeps people in control.',s)
# 06 / ASSISTANTS. Answers grow out of knowledge, never a generic robot mascot.
s=path('M135 393 312 431 488 380 323 339Z','#1c4b38')+path('M135 393v24l176 41 177-53v-25l-176 51Z','#10372d')
s+=path('M135 379q80-35 176 27v37q-99-58-176-24Z','url(#ivory)','#f5f5de55',1)+path('M311 406q91-79 177-45v44q-81-25-177 38Z','url(#ivory)','#f5f5de55',1)
s+=line('M162 392q63-16 126 19m-126-5q63-14 126 20m48-23q58-42 125-28m-125 41q58-40 125-26','#9eb18e',2)
s+=bubble(102,139,202,131,'ivory',-9)+''.join(circle(151+i*42,191,7,'#688b60') for i in range(3))
s+=bubble(309,203,197,134,'emerald',7)+check(410,275,1.1,'#e2f9da')
s+=path('M218 295c-3 56 18 69 58 76','none','#76bd91',4,extra='stroke-dasharray="4 9"')
s+=circle(321,119,23,'url(#coral)',extra='filter="url(#cast)"')+line('M320 96v-16','#92b887',2)+sparkle(462,142,13)
save('assistants','Useful answers, grounded in your knowledge','Two generous conversation forms rise from an open knowledge book. A check mark connects an answer to a shared source, without robot branding.',s)
# 07 / DESIGN & GROWTH. A mark takes shape, then radiates toward an audience.
s=group(rect(11,12,230,249,'#0d2e2c',15)+rect(0,0,230,249,'url(#ivory)',15,'#ededd8'),'translate(172 170) rotate(-12)',extra='filter="url(#cast)"')
# Oversized editable Bezier mark, with visible handles, not a miniature brand mockup.
s+=path('M233 338C192 258 279 203 327 248S304 373 373 372','none','#0a754f',26)
s+=path('M233 330C192 250 279 195 327 240S304 365 373 364','none','url(#emerald)',24)
s+=line('M216 244 287 213m41 27 25 56m20 68 32 7','#72976f',1.5)
s+=''.join(rect(x-4,y-4,8,8,'#f1f5d6',1,'#3b8055') for x,y in [(233,330),(216,244),(287,213),(327,240),(353,296),(373,364),(405,371)])
for a,col in [(-35,'forest'),(-17,'emerald'),(1,'lime'),(19,'coral')]:
 s+=group(rect(-25,-145,50,166,f'url(#{col})',12,'#d9f1cc33')+circle(0,0,5,'#174f39'),'translate(128 403) rotate('+str(a)+')',extra='filter="url(#cast)"')
s+=group(rect(0,0,19,200,'url(#lime)',3)+path('M0 200h19l-10 33Z','#d9bd8d')+path('m5 219 4 14 4-14','#203b2b')+rect(0,0,19,19,'url(#steel)',2),'translate(446 152) rotate(24)',extra='filter="url(#cast)"')
s+=circle(453,393,38,'none','#629b78',4)+circle(453,393,22,'none','#86ba88',4)+circle(453,393,6,'url(#coral)')+sparkle(125,163,16)
save('design','An idea with a recognisable signature','A bold Bezier curve is shaped with visible control handles, supported by a rich colour fan, dimensional pencil and a focused audience target.',s)
# 08 / CONTACT. A connection, with a visible turn from listening to speaking.
s=bubble(93,145,233,153,'ivory',-12)+bubble(306,258,225,146,'emerald',9)
s+=''.join(circle(151+i*48,202,8,'#537b5c') for i in range(3))
s+=path('M225 333c-50 70-110 37-95 2m305-122c68-62 95-8 67 21','none','#7cae82',3,extra='stroke-dasharray="4 9"')
# A classic handset joins both sides, with satin surface and clear readable shape.
d='M261 212q-15-3-25 8l-15 17q-11 13-3 35 39 103 135 137 21 7 33-6l17-20q10-12 4-24l-39-26q-12-7-22 3l-14 14q-40-16-63-57l14-16q9-12 1-24Z'
s+=group(extrude(d,'url(#coral)','#9b4a40',11),'rotate(-8 311 314)',extra='filter="url(#cast)"')
s+=line('M377 307q25-22 16-49m4 64q40-37 26-78','#d6f3bd',4)
s+=circle(478,143,26,'url(#pearl)',extra='filter="url(#cast)"')+sparkle(149,416,16)
save('contact-conversation','Good conversations connect both sides','Two physical conversation shapes are bridged by a warm coral telephone receiver: a direct and human invitation to talk.',s,True)
# 09 / NEXT STEP. Three ascending milestones, a path and a clear destination.
s=path('M106 452C126 362 233 393 246 314S384 327 411 219','none','#0c3a30',24)
s+=cube(89,397,110,74,'forest')+cube(253,319,110,92,'ivory')+cube(366,217,110,121,'emerald')
s+=path('M150 399C174 371 216 387 270 344S354 320 419 248','none','url(#lime)',16)
# Listen: speech form. Define: compass/calipers. Build: destination flag.
s+=group(bubble(0,0,108,71,'ivory',-5)+circle(29,30,4,'#54835b')+circle(52,30,4,'#54835b')+circle(75,30,4,'#54835b'),'translate(105 283)',extra='filter="url(#cast)"')
s+=group(circle(0,0,31,'url(#forest)','#91bb87',2)+path('m0-22 10 24-26 15Z','url(#coral)')+path('m0-22-8 23 18 1Z','url(#ivory)')+circle(0,0,4,'#eff2d5'),'translate(319 267)',extra='filter="url(#cast)"')
s+=path('M423 217V91','none','#cae9bf',6)+path('M426 94q41-26 78 1v65q-41-23-78 2Z','url(#coral)','#f1c2a466',1)+line('M434 104q28-17 60-3','#ffe3c6',2)
s+=circle(417,218,8,'url(#lime)')+check(462,278,.9,'#dff9d5')
s+=line('M117 479v8m170-49v8m153-97v8','#94ba8a',2)+sparkle(174,192,13)+bead(510,379,11)
save('contact-next-step','Listen. Define. Build.','Three ascending sculptural milestones connect a conversation, a compass and a destination flag, making the path from brief to delivery immediately visible.',s,True)


# Dedicated service/page scenes keep the accepted materials and generous scale.
def browser_sheet(x=128,y=151,w=310,h=235):
 return group(rect(9,12,w,h,'#0b292a',14)+rect(0,0,w,h,'url(#ivory)',14,'#e6efd7')+rect(0,0,w,39,'url(#forest)',14)+rect(0,22,w,17,'#355e4a')+''.join(circle(20+i*16,19,3.5,c) for i,c in enumerate(['#f2bc94','#d5e69c','#82d7a7'])),f'translate({x} {y}) rotate(-8 {w/2} {h/2})',extra='filter="url(#cast)"')
# Website design: a composed browser and responsive phone, separate from ecommerce.
s=browser_sheet()+group(rect(24,64,124,116,'url(#emerald)',8)+path('M40 156 69 114 92 141 117 97 136 156Z','url(#lime)')+circle(57,91,11,'url(#ivory)')+line('M171 76h100M171 94h79M171 118h94M171 134h82','#6e8e73',5)+rect(171,157,86,21,'url(#forest)',5)+line('M25 204h87M130 204h72M219 204h58','#9daf91',4),'translate(128 151) rotate(-8 155 117)')
s+=group(rect(7,9,101,183,'#0b292b',15)+rect(0,0,101,183,'url(#forest)',15,'#96bf9c')+rect(8,14,85,150,'url(#ivory)',8)+rect(19,32,63,58,'url(#emerald)',5)+line('M20 108h60M20 121h50','#7e9b7a',5)+rect(20,137,44,13,'url(#coral)',4)+line('M40 173h23','#b3d8b0',4),'translate(397 291) rotate(9)',extra='filter="url(#cast)"')
s+=cursor(112,361,.62,-12)+sparkle(478,133,13)
save('website-design','One considered design. Every screen.','A balanced desktop composition and a matching mobile page express responsive web design, content hierarchy and a clear next action.',s)
# Search: a real visual metaphor for discovery, not a generic studio cursor.
s=browser_sheet(120,170)+group(rect(25,62,245,34,'#c7d6b4',16)+circle(44,79,8,'none','#3d7152',3)+line('m50 85 7 7','#3d7152',3)+line('M28 126h143M28 147h206M28 164h182M28 199h114','#77966f',5),'translate(120 170) rotate(-8 155 117)')
s+=group(line('M35 41 103 119','#0c3b32',29)+line('M35 31 103 109','url(#emerald)',27)+circle(0,0,79,'url(#forest)','#98c7a0',3)+circle(0,0,61,'url(#ivory)')+path('m-30 17 17-24 21 13 25-33','none','#0a9363',9)+path('m14-26 20-2-1 20','none','#0a9363',6),'translate(370 309) rotate(-8)',extra='filter="url(#cast)"')
s+=sparkle(464,142,13)+bead(109,424,12)
save('search','Make the right information easier to find','A large magnifying glass brings a clear result into focus over a structured search page. An upward path suggests ongoing improvement, not guaranteed rankings.',s)
# Advertising: a purposeful message reaches an audience, with a measurable target.
s=group(path('M151 251 351 177v210l-200-66Z','url(#emerald)','#a5dfba55',1)+path('M151 251v70l-41-8v-51Z','url(#ivory)')+ellipse(351,282,43,105,'url(#forest)')+ellipse(349,282,27,78,'#122f2b')+path('m181 332 60 21-15 102-39-10Z','url(#coral)')+path('M132 320v34q-1 29 34 28h18','none','#b8cc9f',8),'rotate(-12 250 300)',extra='filter="url(#cast)"')
s+=line('M421 214 462 192m-32 81h55m-66 57 43 25','#a0c397',5)
s+=circle(450,423,54,'url(#ivory)',extra='filter="url(#cast)"')+circle(450,423,37,'none','#208c5c',6)+circle(450,423,20,'none','#208c5c',6)+circle(450,423,6,'url(#coral)')+line('m450 423 49-47','#274f3d',5)+path('m487 374 14-1-1 14','none','#83c18d',5)+sparkle(160,146,13)
save('advertising','A clear message. Relevant reach.','A sculptural megaphone sends a focused message toward a distinct target, connecting campaign creative with audience relevance and measurement.',s)
# Product strategy: discovery and prioritisation, not code or a project screenshot.
s=group(sheet(0,0,244,239)+line('M31 44h91M31 64h151','#839b79',5)+path('M41 172h49v-43h63v-35h54','none','#15835a',11)+circle(41,172,11,'url(#coral)')+circle(153,129,10,'url(#emerald)')+check(205,94,.65),'translate(148 173) rotate(-10)',extra='filter="url(#cast)"')
s+=group(circle(0,0,73,'url(#forest)','#98be96',3)+circle(0,0,58,'url(#ivory)')+path('M0-43 17 9-37 34Z','url(#coral)')+path('M0-43-14 6 17 9Z','url(#emerald)')+circle(0,0,7,'#254b39'),'translate(429 341) rotate(17)',extra='filter="url(#cast)"')
s+=line('M106 401q-36-108 19-170','#6fa481',2)+sparkle(449,157,13)+bead(119,426,11)
save('strategy','Understand the challenge. Choose a direction.','A prioritised path across a planning sheet meets a large compass: research, decisions and a clear product direction rather than a promised outcome.',s)
# Portfolio: a small curated collection, not the basic graphic-design colour fan.
s=group(sheet(0,0,246,242)+rect(23,28,200,125,'url(#forest)',8)+path('M42 132 89 76 125 111 171 55 205 132Z','url(#emerald)')+circle(64,60,14,'url(#lime)')+line('M26 179h149M26 199h114','#839b78',6),'translate(119 167) rotate(-12)',extra='filter="url(#cast)"')
s+=group(sheet(0,0,171,207)+rect(20,25,131,111,'url(#emerald)',8)+circle(85,80,35,'url(#ivory)')+path('m65 86 15 13 28-38','none','#198258',8)+line('M22 161h101M22 179h75','#839b78',5),'translate(345 262) rotate(12)',extra='filter="url(#cast)"')
s+=cursor(100,373,.53,-17)+sparkle(470,163,14)+bead(377,140,10)
save('portfolio','Different challenges. A considered collection.','Two substantial overlapping work samples and an inviting cursor express a curated portfolio. Abstract compositions are illustrations, not fabricated client screens.',s)
# Tools: a proper builder toolkit, not another general studio symbol.
s=path('M125 308 347 253 502 315 280 376Z','url(#ivory)','#cbe6c655',1)+path('M125 308v113l155 73V376Z','url(#forest)')+path('M280 376 502 315v111l-222 68Z','url(#emerald)')
s+=path('M224 282V187q0-30 31-30h68q30 0 30 30v64','none','#b0c9a1',17)
s+=group(rect(0,0,28,180,'url(#lime)',4)+path('M0 180h28l-14 35Z','url(#ivory)')+path('m9 203 5 12 5-12','#2b4d38')+line('M6 24h16M6 48h10M6 72h16M6 96h10M6 120h16','#738e58',2),'translate(165 145) rotate(-17)',extra='filter="url(#cast)"')
s+=group(path('M-23-61q-18 38 12 54v119q13 16 27 0V-7q30-16 12-54L10-37H-7Z','url(#steel)','#d6e7ce66',1),'translate(414 234) rotate(18)',extra='filter="url(#cast)"')
s+=path('M126 308 280 376l-37 36-155-71Z','url(#forest)')+path('m280 376 222-61 37 33-224 65Z','url(#forest)')+rect(354,398,52,21,'url(#ivory)',5,extra='transform="rotate(-15 380 408)"')+sparkle(482,170,13)
save('toolkit','Choose the right tool for the job','An open dimensional toolbox holds a measuring pencil and wrench, representing a practical collection of resources rather than a particular software endorsement.',s)
print('Created 15 original SVG illustrations: seven refined Home scenes, six dedicated page scenes, two unchanged Contact scenes.')
