"""Illustrated 'market' and 'cellar' images for the home gateways. Run: python3 design/build_gateways.py"""
import random
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
random.seed(3)
W,H=1000,640
def wrap(body,defs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><defs>{defs}</defs>{body}</svg>'
cols=['#e5483a','#f0b429','#3d8bd9','#4cae6a','#e86aa6','#f08a3c','#7b5bc4']
m=['<rect width="1000" height="640" fill="#fbefd7"/><rect y="470" width="1000" height="170" fill="#c9a77c"/>']
for row,y in enumerate((70,200,330)):
    m.append(f'<rect x="40" y="{y+92}" width="920" height="12" rx="4" fill="#8a5a3a"/>')
    x=60
    while x<930:
        w=random.choice((34,40,46)); h=random.choice((58,68,80))
        c=random.choice(cols)
        m.append(f'<rect x="{x}" y="{y+92-h}" width="{w}" height="{h}" rx="6" fill="{c}"/><rect x="{x+5}" y="{y+92-h+10}" width="{w-10}" height="{h*0.25}" rx="3" fill="#ffffff" opacity=".55"/>')
        x+=w+8
m.append('<rect x="40" y="460" width="300" height="140" rx="10" fill="#2f77c9"/><rect x="55" y="475" width="270" height="40" rx="6" fill="#e9f3ff"/>')
m.append('<circle cx="760" cy="540" r="52" fill="#f0b429"/><circle cx="760" cy="540" r="52" fill="none" stroke="#d99a14" stroke-width="6"/>')
m.append('<rect x="620" y="500" width="110" height="100" rx="12" fill="#4cae6a"/><rect x="835" y="510" width="110" height="90" rx="12" fill="#e5483a"/>')
c=['<rect width="1000" height="640" fill="#2a1418"/><rect y="500" width="1000" height="140" fill="#3b1f19"/>']
for row in range(3):
    y=70+row*150
    c.append(f'<rect x="50" y="{y+95}" width="900" height="10" rx="4" fill="#6b4423"/>')
    for i in range(17):
        x=70+i*52; col=('#5a1824','#2f5a3a','#7a3a1c')[(i+row)%3]
        c.append(f'<rect x="{x}" y="{y+8}" width="26" height="86" rx="8" fill="{col}"/><rect x="{x+8}" y="{y-12}" width="10" height="26" rx="3" fill="{col}"/><rect x="{x+3}" y="{y+40}" width="20" height="26" rx="3" fill="#f3e7c8" opacity=".9"/>')
c.append('<ellipse cx="170" cy="540" rx="110" ry="80" fill="#6b4423"/><ellipse cx="170" cy="540" rx="110" ry="80" fill="none" stroke="#3b2412" stroke-width="8"/>')
c.append('<ellipse cx="500" cy="560" rx="90" ry="64" fill="#7a4e2a"/><ellipse cx="830" cy="540" rx="110" ry="80" fill="#6b4423"/>')
out=Path(__file__).parent.parent/'public'/'images'
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':W,'height':H})
    for name,body in (('groceries',''.join(m)),('cellar',''.join(c))):
        pg.set_content(f'<html><body style="margin:0">{wrap(body)}</body></html>'); pg.screenshot(path='/tmp/g.png')
        Image.open('/tmp/g.png').convert('RGB').save(out/f'{name}.webp',quality=80)
    b.close()
print('ok')
