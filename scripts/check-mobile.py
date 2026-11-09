import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ORIGIN = 'https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
OUTPUT = Path('/home/ubuntu/irbroker/assets/round2/review')
OUTPUT.mkdir(exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp('http://localhost:9222')
    context = browser.contexts[0]
    page = context.new_page()
    page.set_viewport_size({'width': 375, 'height': 812})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(ORIGIN, wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    page.screenshot(path=str(OUTPUT / 'home-375.png'))
    home = page.evaluate('''() => ({width:innerWidth, scrollWidth:document.documentElement.scrollWidth, logos:document.querySelectorAll('.partner-logo').length, panels:document.querySelectorAll('.vertical-panel').length, facetOpacity:getComputedStyle(document.querySelector('.facets-hero')).opacity, menuHidden:getComputedStyle(document.querySelector('#main-navigation')).display})''')
    page.locator('.menu-toggle').click()
    page.locator('.solutions-toggle').click()
    menu = page.evaluate('''() => ({expanded:document.querySelector('.menu-toggle').getAttribute('aria-expanded'), verticalLinks:document.querySelectorAll('#solutions-navigation a').length, navWidth:document.querySelector('#main-navigation').getBoundingClientRect().width, navHeight:document.querySelector('#main-navigation').getBoundingClientRect().height})''')
    page.screenshot(path=str(OUTPUT / 'menu-375.png'))
    page.keyboard.press('Escape')
    page.locator('#verticais').scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    panel = page.evaluate('''() => {let el=document.querySelector('.vertical-panels');el.scrollLeft=el.scrollWidth;return {width:el.clientWidth, scrollWidth:el.scrollWidth, scrollLeft:el.scrollLeft};}''')
    page.wait_for_timeout(350)
    page.screenshot(path=str(OUTPUT / 'verticals-375.png'))
    page.locator('.partners-section').scroll_into_view_if_needed()
    page.wait_for_timeout(350)
    partners = page.evaluate('''() => ({count:document.querySelectorAll('.partner-logo img').length, loaded:[...document.querySelectorAll('.partner-logo img')].filter(i=>i.complete&&i.naturalWidth>0).length, gridColumns:getComputedStyle(document.querySelector('.partner-logo-grid')).gridTemplateColumns})''')
    page.screenshot(path=str(OUTPUT / 'logos-375.png'))
    route_results = []
    routes = ['/transporte-de-cargas','/construcao-e-imoveis','/corporate','/comex-broker','/wellcare','/sobre','/contato']
    for route in routes:
        page.goto(ORIGIN+route, wait_until='networkidle')
        data=page.evaluate('''() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelector('h1').innerText,heroPhoto:document.querySelector('.hero-photo')?.getAttribute('src'),loaded:[...document.querySelectorAll('img')].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.alt)})''')
        route_results.append({'route':route,**data})
        if route in ['/wellcare','/comex-broker','/contato']:
            page.screenshot(path=str(OUTPUT / (route[1:]+'-375.png')))
    page.locator('footer').scroll_into_view_if_needed()
    page.evaluate("document.querySelector('.site').scrollTo(0,document.querySelector('.site').scrollHeight)")
    page.wait_for_timeout(300)
    footer = page.evaluate('''() => {const a=document.querySelector('.footer-bottom').getBoundingClientRect(),b=document.querySelector('.whatsapp-link').getBoundingClientRect();return {footerBottom:a.bottom,whatsappTop:b.top,overlap:a.bottom>b.top};}''')
    page.screenshot(path=str(OUTPUT / 'footer-375.png'))
    page.set_viewport_size({'width':1440,'height':1000})
    page.goto(ORIGIN,wait_until='networkidle')
    page.screenshot(path=str(OUTPUT / 'home-desktop.png'))
    page.locator('.triggers-split').scroll_into_view_if_needed()
    page.screenshot(path=str(OUTPUT / 'gatilhos-desktop.png'))
    page.locator('.process-section').scroll_into_view_if_needed()
    page.screenshot(path=str(OUTPUT / 'processo-desktop.png'))
    page.locator('#verticais').scroll_into_view_if_needed()
    page.screenshot(path=str(OUTPUT / 'verticals-desktop.png'))
    result={'home':home,'menu':menu,'panels':panel,'partners':partners,'routes':route_results,'footer':footer,'pageErrors':errors}
    (OUTPUT/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print(json.dumps(result,ensure_ascii=False,indent=2))
    page.close()
