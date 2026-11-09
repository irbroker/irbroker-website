from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.parse import quote, parse_qs
import json

ROOT=Path('/home/ubuntu/irbroker');OUT=ROOT/'assets/round8/review'
ORIGIN='https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
ENDPOINT='https://n8n.syravel.com/webhook/irb-site-contato-8b76e2cd'
ORDER=['Comex Broker','WellCare','Transporte de cargas','Construção e imóveis','Corporate']
results={'preselection':[],'quality':[],'mockContact':{},'previewRetries':[]}

def open_ready(page,path):
    page.goto(ORIGIN+path,wait_until='load')
    try:page.wait_for_function('document.querySelector("#root") && Object.keys(document.querySelector("#root")).some(k=>k.startsWith("__react"))',timeout=4000)
    except Exception:
        results['previewRetries'].append(path)
        page.reload(wait_until='load')
        page.wait_for_function('document.querySelector("#root") && Object.keys(document.querySelector("#root")).some(k=>k.startsWith("__react"))',timeout=10000)
    page.evaluate('document.fonts.ready')

with sync_playwright() as p:
    b=p.chromium.connect_over_cdp('http://localhost:9222');c=b.contexts[0]
    for path,width in [('/corporate',375),('/corporate',414),('/contato',1440),('/',375),('/conteudos',375),('/conteudos/vida-saude-odonto-beneficios',375)]:
        page=c.new_page();page.set_viewport_size({'width':width,'height':1000 if width>=768 else 896});open_ready(page,path);page.wait_for_timeout(600)
        row={'route':path,'width':width}
        if path=='/corporate':
            row['h1']=page.locator('h1').evaluate('e=>({client:e.clientWidth,scroll:e.scrollWidth,font:getComputedStyle(e).fontSize})');assert row['h1']['scroll']<=row['h1']['client']+1,row
            page.screenshot(path=str(OUT/f'corporate-{width}-corrected.png'))
        if path=='/contato':
            row['columns']=page.locator('.contact-aside,.contact-form-column').evaluate_all('(es)=>es.map(e=>e.getBoundingClientRect().bottom)');assert abs(row['columns'][0]-row['columns'][1])<1
            row['footerMargin']=page.locator('footer').evaluate('e=>getComputedStyle(e).marginTop');assert row['footerMargin']=='0px';page.screenshot(path=str(OUT/'contact-desktop-corrected.png'),full_page=True)
        page.locator('footer').scroll_into_view_if_needed();page.wait_for_function('document.querySelector(".site-header").classList.contains("header-scrolled")');page.wait_for_timeout(250);row['headerHeight']=page.locator('.site-header').bounding_box()['height'];assert abs(row['headerHeight']-64)<1,row
        row['footerEndGap']=page.evaluate('()=>{const f=document.querySelector("footer");return Math.abs(document.documentElement.scrollHeight-(f.getBoundingClientRect().bottom+scrollY))}');assert row['footerEndGap']<=1,row
        assert page.locator('.whatsapp-link').is_hidden();assert page.locator('.skip-link').evaluate('e=>getComputedStyle(e).opacity')=='0'
        if path=='/' and width==375:
            page.set_viewport_size({'width':375,'height':1600});page.locator('footer').scroll_into_view_if_needed();page.wait_for_timeout(350);page.add_style_tag(content='.site-header {visibility:hidden!important}');page.locator('footer').screenshot(path=str(OUT/'footer-mobile-corrected.png'))
        results['quality'].append(row);print('Quality',path,width,'OK',flush=True);page.close()
    for path in ['/conteudos','/conteudos/vida-saude-odonto-beneficios']:
        page=c.new_page();page.set_viewport_size({'width':375,'height':896});open_ready(page,path);page.wait_for_timeout(250)
        # At the initial reading location the FAB must not obscure the paragraph.
        assert page.locator('.whatsapp-link').is_hidden();page.keyboard.press('Tab');assert page.locator('.skip-link').evaluate('e=>e.matches(":focus-visible")&&getComputedStyle(e).visibility==="visible"');assert page.locator('.skip-link').bounding_box()['y']>=0;page.close()
(OUT/'quality-final.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print('Quality corrections complete',flush=True)
