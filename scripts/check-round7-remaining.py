from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT=Path('/home/ubuntu/irbroker')
OUT=ROOT/'assets/round7/review'
ORIGIN='https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
records=json.loads((ROOT/'assets/round7/content-exact.json').read_text())
results={}
errors=[]
with sync_playwright() as p:
    b=p.chromium.connect_over_cdp('http://localhost:9222')
    for width in [375,414]:
        page=b.contexts[0].new_page()
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_viewport_size({'width':width,'height':896})
        page.goto(ORIGIN+'/conteudos',wait_until='load')
        page.wait_for_function('getComputedStyle(document.querySelector(".site-header")).position==="fixed"')
        page.evaluate('document.fonts.ready')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.locator('.menu-toggle').click()
        assert page.locator('#main-navigation > a.nav-link').all_inner_texts()==['Sobre','Conteúdos','Contato']
        with page.expect_navigation(wait_until='load'):
            page.locator('#main-navigation').get_by_role('link',name='Conteúdos',exact=True).click()
        page.wait_for_function('getComputedStyle(document.querySelector(".site-header")).position==="fixed"')
        page.wait_for_timeout(150)
        assert page.locator('.contents-radar').is_visible()
        assert page.locator('.radar-note').count()==4
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.screenshot(path=str(OUT/f'conteudos-{width}-final.png'))
        results[f'mobile-{width}']={'menuOrderAndLink':True,'stylesLoadedAfterNavigation':True,'noOverflow':True}
        print(width,'menu e navegação carregados',flush=True)
        page.close()
    page=b.contexts[0].new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_viewport_size({'width':375,'height':896})
    for guide in records['guides']:
        page.goto(ORIGIN+guide['slug'],wait_until='load')
        page.wait_for_function('getComputedStyle(document.querySelector(".site-header")).position==="fixed"')
        page.evaluate('document.fonts.ready')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        styles=page.locator('.guide-body p').first.evaluate('e=>({font:getComputedStyle(e).fontSize,line:getComputedStyle(e).lineHeight,width:e.getBoundingClientRect().width})')
        assert styles['font']=='18px' and abs(float(styles['line'].rstrip('px'))-30.6)<.1
        assert page.locator('.other-guides .guide-list-item').count()==3
        if guide==records['guides'][0]:page.screenshot(path=str(OUT/'guia-375-final.png'))
        results[guide['slug']]={'typography':styles,'otherGuides3':True,'noOverflow':True}
        print(guide['slug'],'leitura18px/1.7',flush=True)
    page.goto(ORIGIN,wait_until='load')
    page.wait_for_selector('.home-radar-notes article')
    assert page.locator('.home-radar-notes article').count()==3
    assert page.locator('.home-radar').evaluate('e=>e.nextElementSibling.classList.contains("final-cta")')
    assert page.locator('.home-radar .radar-impact').count()==0
    results['home']={'3MostRecentMetadataOnly':True,'beforeCTA':True}
    for slug,count in [('transporte-de-cargas',1),('comex-broker',1),('corporate',1),('wellcare',1),('construcao-e-imoveis',0)]:
        page.goto(ORIGIN+'/'+slug,wait_until='load')
        page.wait_for_selector('.vertical-page')
        assert page.locator('.front-radar .radar-note').count()==count
        results[slug]={'frontRadarCount':count}
    page.close()
results['pageErrors']=errors
assert not errors,errors
(OUT/'remaining-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
