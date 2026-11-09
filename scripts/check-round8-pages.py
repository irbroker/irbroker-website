from pathlib import Path
from playwright.sync_api import sync_playwright
import json

ROOT = Path('/home/ubuntu/irbroker')
OUT = ROOT / 'assets/round8/review'
OUT.mkdir(parents=True, exist_ok=True)
ORIGIN = 'https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
ROUTES = json.loads((ROOT / 'client/public/manus-routes.json').read_text())['routes']
ORDER = ['Comex Broker', 'WellCare', 'Transporte de cargas', 'Construção e imóveis', 'Corporate']
results, errors = [], []

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp('http://localhost:9222')
    context = browser.contexts[0]
    for index, item in enumerate(ROUTES):
        slug = item['path'].strip('/').replace('/', '-') or 'home'
        prefix = f'{index:02d}-{slug}'
        for width in [1440, 375, 414]:
            page = context.new_page()
            page.set_viewport_size({'width': width, 'height': 1000 if width > 767 else 896})
            page_errors, videos_requested = [], []
            page.on('pageerror', lambda error: page_errors.append(str(error)))
            page.on('request', lambda request: videos_requested.append(request.url) if '.mp4' in request.url else None)
            row = {'route': item['path'], 'width': width, 'prefix': prefix}
            try:
                response = page.goto(ORIGIN + item['path'], wait_until='load', timeout=25000)
                page.wait_for_selector('.site-header', timeout=15000)
                page.wait_for_function('getComputedStyle(document.querySelector(".site-header")).position==="fixed"')
                page.evaluate('document.fonts.ready')
                page.wait_for_timeout(900)
                if page.locator('video').count():
                    page.locator('video').evaluate('(v) => { v.pause(); v.currentTime = 1.1; }')
                    page.wait_for_timeout(300)
                row.update(page.evaluate('''() => {
                  const site=document.querySelector('.site');
                  const h=document.querySelector('main h1');
                  const nav=document.querySelector('#main-navigation');
                  const footer=document.querySelector('footer');
                  return { title:document.title, h1:h?.textContent, weight:getComputedStyle(h).fontWeight,
                    overflow:site.scrollWidth-site.clientWidth,
                    videoCount:document.querySelectorAll('video').length,
                    footerFronts:[...footer.querySelectorAll('.footer-editorial-front-links a')].map(a=>a.textContent),
                    logoHeight:footer.querySelector('.footer-editorial-legal-brand img').getBoundingClientRect().height,
                    headerNavWidth:nav.getBoundingClientRect().width,
                    headerRight:nav.getBoundingClientRect().right,
                    viewport:innerWidth,
                    closure:footer.querySelectorAll('.footer-editorial-closure').length,
                    footerAddresses:footer.querySelectorAll('.footer-editorial-address').length,
                    finalCta:document.querySelectorAll('.final-cta,.front-final-contact').length,
                    radios:[...document.querySelectorAll('input[type=radio][name=frente]')].map(i=>i.value)};
                }'''))
                assert response.status == 200, response.status
                assert row['overflow'] <= 1, row
                assert row['weight'] == '400', row
                assert row['footerFronts'] == ORDER, row
                assert abs(row['logoHeight'] - 24) < .1, row
                assert row['finalCta'] == 0, row
                assert row['closure'] == (0 if item['path'] == '/contato' else 1), row
                assert row['footerAddresses'] == (0 if item['path'] == '/contato' else 2), row
                if width < 768:
                    assert row['videoCount'] == 0 and not videos_requested, videos_requested
                if item['path'] == '/contato':
                    assert row['radios'] == ORDER, row
                    assert page.locator('.contact-privacy').count() == 0
                    assert page.locator('.contact-map-link').count() == 2
                    assert page.locator('.whatsapp-link').is_hidden()
                if item['path'] == '/':
                    assert page.locator('.proof-number').count() == 4
                    assert page.locator('.proof-logos,.numbers-section').count() == 0
                    if width >= 1200:
                        row['grids'] = page.locator('.partner-logo-grid').evaluate_all('(gs)=>gs.map(g=>({columns:getComputedStyle(g).gridTemplateColumns.split(" ").length, count:g.querySelectorAll("img").length}))')
                        assert row['grids'] == [{'columns':7,'count':14},{'columns':6,'count':18}], row
                    row['logoSizes'] = page.locator('.partner-logo img').evaluate_all('(imgs)=>imgs.map(i=>({w:i.getBoundingClientRect().width,h:i.getBoundingClientRect().height,filter:getComputedStyle(i).filter,opacity:getComputedStyle(i).opacity,blend:getComputedStyle(i).mixBlendMode}))')
                    for size in row['logoSizes']:
                        assert abs(size['w']-(160 if width>=768 else 120))<.1 and abs(size['h']-(64 if width>=768 else 48))<.1, size
                        assert size['filter']=='none' and size['blend']=='normal', size
                if width in [1440, 375]:
                    page.screenshot(path=str(OUT / f'{prefix}-{width}-top.png'))
                page.evaluate('''() => {const s=document.querySelector('.site'); window.__reviewScroll = s.scrollHeight>s.clientHeight+1 && ['auto','scroll'].includes(getComputedStyle(s).overflowY) ? s : document.scrollingElement; }''')
                height = page.evaluate('window.__reviewScroll.scrollHeight')
                for y in range(0, int(height), 650):
                    page.evaluate('(y)=>window.__reviewScroll.scrollTop=y', y)
                    page.wait_for_timeout(140)
                page.wait_for_timeout(500)
                row['brokenImages'] = page.locator('img').evaluate_all('(imgs)=>imgs.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)')
                assert not row['brokenImages'], row['brokenImages']
                if width in [1440, 375]:
                    page.locator('footer').scroll_into_view_if_needed()
                    page.add_style_tag(content='.site-header {visibility:hidden!important;}')
                    page.locator('footer').screenshot(path=str(OUT / f'{prefix}-{width}-footer.png'))
                    page.evaluate('''() => {document.querySelector('.site-header').style.visibility='visible'; const s=document.querySelector('.site');s.style.height='auto';s.style.overflow='visible';document.body.style.overflow='visible';document.documentElement.style.overflow='visible';window.scrollTo(0,0);}''')
                    page.add_style_tag(content='.site-header {visibility:visible!important;}')
                    page.wait_for_timeout(150)
                    page.screenshot(path=str(OUT / f'{prefix}-{width}-full.png'), full_page=True)
                row['pageErrors'] = page_errors
                assert not page_errors, page_errors
                row['ok'] = True
                print(item['path'], width, 'OK', flush=True)
            except Exception as error:
                row['ok'] = False
                row['error'] = str(error)[:1600]
                row['currentUrl'] = page.url
                row['bodyStart'] = page.locator('body').inner_text(timeout=3000)[:200]
                errors.append(row)
                print(item['path'], width, 'FAIL', row['error'][:250], flush=True)
            finally:
                results.append(row)
                (OUT / 'page-results.json').write_text(json.dumps(results, ensure_ascii=False, indent=2)+'\n')
                page.close()
    (OUT / 'errors.json').write_text(json.dumps(errors, ensure_ascii=False, indent=2)+'\n')
print('Complete:', len(results), 'checks;', len(errors), 'errors', flush=True)
