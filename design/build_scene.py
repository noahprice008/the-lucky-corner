"""Generates the illustrated Lucky Corner storefront and exports web images.
Run: python3 design/build_scene.py   (needs Pillow + Playwright/Chromium)
"""
import random
from pathlib import Path
random.seed(7)
W,H=1600,900
o=[]
a=o.append
a(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="DejaVu Sans, FreeSans, Liberation Sans, sans-serif">')
a('''<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec9ee"/><stop offset="1" stop-color="#fbe9c8"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8f6ff" stop-opacity=".38"/><stop offset="1" stop-color="#bfe3f7" stop-opacity=".16"/></linearGradient>
<linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8573a"/><stop offset="1" stop-color="#a23d27"/></linearGradient>
<linearGradient id="warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd98a" stop-opacity=".0"/><stop offset="1" stop-color="#ffb35c" stop-opacity=".28"/></linearGradient>
</defs>''')
a(f'<rect width="{W}" height="{H}" fill="url(#sky)"/>')
# distant buildings
a('<rect x="-20" y="330" width="520" height="250" fill="#d9cdb8"/><rect x="20" y="370" width="440" height="22" fill="#c4b79f"/>')
for i in range(7): a(f'<rect x="{50+i*62}" y="410" width="34" height="46" fill="#9fb7c7"/>')
a('<rect x="1330" y="360" width="300" height="220" fill="#e2d3b4"/><rect x="1350" y="395" width="60" height="50" fill="#a9bfcd"/><rect x="1450" y="395" width="60" height="50" fill="#a9bfcd"/>')
# trees
def tree(x,y,r,c1,c2):
    a(f'<rect x="{x-9}" y="{y}" width="18" height="{r*1.2}" fill="#6b4a32"/>')
    a(f'<circle cx="{x}" cy="{y-r*0.2}" r="{r}" fill="{c1}"/><circle cx="{x-r*0.55}" cy="{y+r*0.1}" r="{r*0.7}" fill="{c2}"/><circle cx="{x+r*0.6}" cy="{y}" r="{r*0.75}" fill="{c2}"/>')
tree(330,300,120,'#4f8f45','#5da650'); tree(520,260,100,'#5a9a49','#6bb35a'); tree(1230,270,105,'#4f8f45','#62a953')
a('<path d="M1490 560 C1440 450 1470 330 1500 210 C1530 330 1560 450 1510 560Z" fill="#244a30"/>')
# ground
a('<rect y="560" width="1600" height="340" fill="#6c6f74"/>')
a('<rect y="560" width="1600" height="200" fill="#cfc6b6"/><rect y="752" width="1600" height="14" fill="#a9a091"/>')
for i in range(9): a(f'<rect x="{80+i*190}" y="822" width="110" height="14" rx="3" fill="#eeeeee" opacity=".85"/>')
# railings (green)
for i in range(11):
    x=110+i*38
    a(f'<rect x="{x}" y="640" width="6" height="52" fill="#2f8a57"/>')
a('<path d="M104 650 H514 M104 676 H514" stroke="#2f8a57" stroke-width="6" fill="none"/>')
# blue freezer
a('<rect x="470" y="600" width="130" height="90" rx="8" fill="#2f77c9"/><rect x="482" y="610" width="106" height="30" rx="4" fill="#e9f3ff"/><text x="535" y="633" font-size="20" font-weight="700" text-anchor="middle" fill="#1b4f8f">Ice</text>')
# KIOSK
a('<rect x="520" y="400" width="640" height="270" fill="#f1e2c4"/>')
a('<rect x="520" y="400" width="640" height="14" fill="#e0cfa8"/>')
# roof (hip, red tile)
a('<polygon points="610,255 1070,255 1230,405 450,405" fill="url(#roof)"/>')
for k in range(1,6):
    y=255+k*25; a(f'<line x1="{610-(k*30)}" y1="{y}" x2="{1070+(k*30)}" y2="{y}" stroke="#8d3220" stroke-width="2" opacity=".55"/>')
for k in range(0,21):
    x=520+k*34; a(f'<line x1="{610+(x-520)*0.28}" y1="255" x2="{x-10}" y2="405" stroke="#8d3220" stroke-width="1.5" opacity=".35"/>')
a('<rect x="440" y="402" width="800" height="14" rx="3" fill="#7f2c1d"/>')
# NEW SIGN
a('<rect x="590" y="424" width="500" height="84" rx="12" fill="#16392b" stroke="#e9b949" stroke-width="5"/>')
a('<rect x="600" y="434" width="480" height="64" rx="8" fill="none" stroke="#e9b949" stroke-width="1.5" opacity=".7"/>')
# clover icon
cx,cy=648,466
for dx,dy in ((-9,-9),(9,-9),(-9,9),(9,9)): a(f'<circle cx="{cx+dx}" cy="{cy+dy}" r="10" fill="#46b36b"/>')
a(f'<rect x="{cx-1.5}" y="{cy+8}" width="3" height="18" rx="1.5" fill="#2e8a50" transform="rotate(18 {cx} {cy+8})"/>')
a('<text x="860" y="470" font-size="46" font-weight="700" text-anchor="middle" fill="#f6d36b" direction="rtl">פינת המזל</text>')
a('<text x="860" y="492" font-size="15" letter-spacing="4" text-anchor="middle" fill="#cfe9d8">THE LUCKY CORNER</text>')
# wall interior (shop window behind glass)
a('<rect x="560" y="545" width="560" height="125" fill="#3a2f27"/><rect x="570" y="552" width="540" height="12" fill="#6a5646"/>')
cols=['#e5483a','#f0b429','#3d8bd9','#4cae6a','#e86aa6','#f08a3c']
for i in range(18):
    a(f'<rect x="{578+i*30}" y="{566+ (i%2)*0}" width="22" height="30" rx="4" fill="{cols[i%6]}"/>')
a('<rect x="570" y="600" width="540" height="10" fill="#6a5646"/>')
for i in range(18):
    a(f'<rect x="{582+i*30}" y="{614}" width="20" height="34" rx="4" fill="{cols[(i+2)%6]}"/>')
# counter
a('<rect x="560" y="660" width="560" height="22" fill="#8a5a3a"/>')
# PEOPLE + tables inside enclosure
def person(x,y,skin,shirt,hair,flip=1,cup=True):
    a(f'<rect x="{x-17}" y="{y+22}" width="34" height="44" rx="12" fill="{shirt}"/>')
    a(f'<circle cx="{x}" cy="{y}" r="17" fill="{skin}"/>')
    a(f'<path d="M{x-17} {y-3} Q{x} {y-26} {x+17} {y-3} Q{x} {y-12} {x-17} {y-3}Z" fill="{hair}"/>')
    if cup: a(f'<rect x="{x+14*flip-5}" y="{y+34}" width="11" height="14" rx="2" fill="#ffffff"/>')
def chair(x,y): a(f'<rect x="{x-17}" y="{y}" width="34" height="8" rx="3" fill="#f4f4f4"/><rect x="{x-14}" y="{y+8}" width="4" height="28" fill="#d7d7d7"/><rect x="{x+10}" y="{y+8}" width="4" height="28" fill="#d7d7d7"/>')
def table(x,y):
    a(f'<ellipse cx="{x}" cy="{y}" rx="42" ry="9" fill="#ffffff"/><rect x="{x-3}" y="{y}" width="6" height="34" fill="#c9c9c9"/>')
# tables at ground level below counter, in front of kiosk
for (tx,skin1,sh1,hr1,skin2,sh2,hr2) in ((600,'#f2c9a0','#d9503f','#3b2a20','#8d5a3a','#3d8bd9','#1c1410'),(840,'#e8b88a','#46b36b','#6b4423','#f5d3b0','#f0b429','#a0522d'),(1080,'#c98d5f','#e86aa6','#1c1410','#f2c9a0','#6a4fb3','#2e2118')):
    chair(tx-70,672); chair(tx+70,672)
    person(tx-70,646,skin1,sh1,hr1,1); person(tx+70,646,skin2,sh2,hr2,-1)
    table(tx,700)
# standing owner at counter
person(1010,592,'#e0ae84','#f4f1ea','#2a2018',1,False)
a('<rect x="990" y="622" width="40" height="40" rx="8" fill="#16392b"/>')
# AWNING (new, enclosed all the way around)
stripe=['#d94b3a','#fff6e6']
# front band
a('<polygon points="400,506 1240,506 1290,568 350,568" fill="#d94b3a"/>')
for i in range(21):
    x=350+i*(940/21); x2=x+940/21
    if i%2==0:
        top1=400+ (x-350)*(840/940); top2=400+(x2-350)*(840/940)
        a(f'<polygon points="{top1},506 {top2},506 {x2},568 {x},568" fill="#fff6e6"/>')
# scalloped valance
for i in range(21):
    x=350+i*(940/21); w=940/21
    col=stripe[1] if i%2==0 else stripe[0]
    a(f'<path d="M{x} 568 h{w} a{w/2} 14 0 0 1 -{w} 0z" fill="{col}"/>')
a('<rect x="350" y="564" width="940" height="6" fill="#00000022"/>')
# side panel (right) of awning
a('<polygon points="1290,568 1290,732 1380,714 1380,540" fill="url(#glass)" stroke="#e8f1f7" stroke-width="3"/>')
# front glass enclosure
a('<rect x="350" y="568" width="940" height="164" fill="url(#glass)"/>')
for i in range(0,10): a(f'<rect x="{350+i*104}" y="568" width="6" height="164" fill="#e9f0f5" opacity=".9"/>')
a('<rect x="350" y="568" width="940" height="6" fill="#e9f0f5"/><rect x="350" y="726" width="940" height="8" fill="#e9f0f5"/>')
# open door gap marks
a('<rect x="1160" y="580" width="3" height="144" fill="#ffffff" opacity=".8"/>')
# fairy lights under awning
for i in range(24):
    x=372+i*38; a(f'<circle cx="{x}" cy="{576+ (i%2)*6}" r="4.5" fill="#ffe08a"/>')
# planter + bin right
a('<rect x="1330" y="640" width="46" height="60" rx="8" fill="#3d7d57"/>')
a('<ellipse cx="1353" cy="640" rx="30" ry="8" fill="#3a8f5a"/>')
for dx in (-18,0,18): a(f'<circle cx="{1353+dx}" cy="628" r="15" fill="#4cae6a"/>')
# warm light overlay
a(f'<rect y="0" width="{W}" height="{H}" fill="url(#warm)"/>')
a('</svg>')
svg=''.join(o)
here=Path(__file__).parent
(here/'store-scene.svg').write_text(svg,encoding='utf-8')
from playwright.sync_api import sync_playwright
from PIL import Image, ImageFilter, ImageEnhance
out=here/'out'; out.mkdir(exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':W,'height':H})
    pg.set_content(f'<html><body style="margin:0">{svg}</body></html>'); pg.screenshot(path=str(here/'_scene.png')); b.close()
im=Image.open(here/'_scene.png').convert('RGB')
im.resize((1280,720),Image.LANCZOS).save(out/'store.webp',quality=82)
bg=im.filter(ImageFilter.GaussianBlur(14)); bg=ImageEnhance.Brightness(bg).enhance(0.82)
bg.resize((1280,720),Image.LANCZOS).save(out/'store-bg.webp',quality=70)
(here/'_scene.png').unlink()
print('ok')
