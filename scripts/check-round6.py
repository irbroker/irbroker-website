import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ORIGIN='https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
OUT=Path('/home/ubuntu/irbroker/assets/round6/review')
OUT.mkdir(parents=True,exist_ok=True)
LIA='No WhatsApp, o primeiro atendimento é da Lia, a assistente virtual da irbroker. Ela tira dúvidas gerais e passa o seu caso para uma consultora.'
LEGAL='© 2026 irbroker · CNPJ 54.769.677/0001-18 · Registro SUSEP [A PREENCHER]'
results={}
with sync_playwright() as p:
    b=p.chromium.connect_over_cdp('http://localhost:9222')
    page=b.contexts[0].new_page()
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    for width in [1440,375,414]:
        page.set_viewport_size({'width':width,'height':1000 if width==1440 else 896})
        page.goto(ORIGIN,wait_until='domcontentloaded')
        page.evaluate('document.fonts.ready')
        page.wait_for_timeout(300)
        assert page.locator('.whatsapp-link').is_hidden()
        poster=page.locator('.home-hero .hero-photo').evaluate('e=>({width:e.naturalWidth,position:getComputedStyle(e).objectPosition})')
        assert poster['position']=='50% 40%'
        assert page.locator('.home-hero .hero-photo').get_attribute('width')=='1920'
        page.locator('.process-section').scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        assert page.locator('.whatsapp-link').is_visible()
        page.locator('footer').scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        assert page.locator('.whatsapp-link').is_hidden()
        footer=page.locator('footer')
        assert footer.locator('.footer-editorial-brand img').evaluate('e=>Math.round(e.getBoundingClientRect().height)')==36
        assert 'branco' in footer.locator('.footer-editorial-brand img').get_attribute('src')
        assert footer.evaluate('e=>getComputedStyle(e).backgroundColor')=='rgb(31, 34, 37)'
        assert footer.get_by_text('Fale com a gente',exact=True).count()==1
        assert footer.get_by_text(LEGAL,exact=True).count()==1
        social=[]
        for label,href in [('irbroker no Instagram','https://www.instagram.com/irbroker_/'),('irbroker no LinkedIn','https://br.linkedin.com/company/irbroker')]:
            link=footer.get_by_role('link',name=label,exact=True)
            assert link.get_attribute('href')==href and link.get_attribute('target')=='_blank'
            assert 'noopener' in link.get_attribute('rel')
            svg=link.locator('svg').evaluate('e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})')
            assert svg['width']==20 and svg['height']==20
            social.append({'label':label,'href':href,'svg':svg})
        assert footer.locator('a[href="/transporte-de-cargas"],a[href="/comex-broker"],a[href="/construcao-e-imoveis"],a[href="/corporate"],a[href="/wellcare"]').count()==5
        phone=footer.locator('a[href="tel:+551121497244"]')
        font=phone.evaluate('e=>({size:getComputedStyle(e).fontSize,family:getComputedStyle(e).fontFamily})')
        assert font['size']==('28px' if width==1440 else '22px') and 'Source Serif 4' in font['family']
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        footer.get_by_role('button',name='Política de privacidade',exact=True).click()
        assert page.locator('#privacy-policy-dialog').is_visible()
        page.keyboard.press('Escape')
        page.locator('footer').scroll_into_view_if_needed()
        footer.screenshot(path=str(OUT/f'rodape-{width}.png'))
        results[str(width)]={'logoHeight':36,'graphite':True,'social':social,'contactFont':font,'poster':poster,'waHomeHeroHidden':True,'waMiddleVisible':True,'waFooterHidden':True,'privacyOpens':True,'noOverflow':True}
        print(f'{width}px: rodapé, redes, visibilidade do WhatsApp e poster OK',flush=True)
        page.goto(ORIGIN+'/contato',wait_until='domcontentloaded')
        page.wait_for_timeout(150)
        assert page.locator('.whatsapp-link').is_hidden()
        page.locator('.lia-note').scroll_into_view_if_needed()
        assert page.locator('.lia-note').inner_text()==LIA
        assert page.locator('.lia-note').evaluate('e=>getComputedStyle(e).fontSize')=='15px'
        assert page.locator('.lia-note').evaluate('e=>e.previousElementSibling.textContent')=='Falar no WhatsApp'
        assert page.locator('.site-header').get_by_text('Lia',exact=True).count()==0
        assert page.locator('.whatsapp-link').is_hidden()
        page.evaluate('window.scrollTo(0,0)')
        page.wait_for_timeout(150)
        assert page.locator('.whatsapp-link').is_hidden()
        results[str(width)]['waContactAlwaysHidden']=True
        results[str(width)]['liaExact15px']=True
    page.set_viewport_size({'width':1440,'height':1000})
    page.goto(ORIGIN+'/comex-broker',wait_until='domcontentloaded')
    src=page.locator('.bridge-logo').get_attribute('src')
    assert src=='/brand/comex-broker-horizontal-mono-branco.svg'
    response=page.request.get(ORIGIN+src)
    assert response.status==200 and 'svg' in response.headers.get('content-type','')
    body=response.body()
    assert body==Path('/home/ubuntu/irbroker/assets/round2/marca/comex-broker-horizontal-mono-branco.svg').read_bytes()
    assert b'<image' not in body and b'data:image' not in body
    page.goto(ORIGIN,wait_until='domcontentloaded')
    assert page.locator('.panel-logo.comex').get_attribute('src')==src
    results['comex']={'originalBytesIdentical':True,'contentType':response.headers.get('content-type'),'vectorOnly':True,'heroAndPanelSameSVG':True}
    page.emulate_media(reduced_motion='reduce')
    page.goto(ORIGIN,wait_until='domcontentloaded')
    page.locator('footer').scroll_into_view_if_needed()
    duration=page.locator('footer a[href="tel:+551121497244"]').evaluate('e=>getComputedStyle(e,"::after").transitionDuration')
    assert all(float(x.strip().rstrip('s'))==0 for x in duration.split(','))
    results['reducedMotion']={'footerUnderlineInstant':True}
    results['pageErrors']=errors
    assert not errors,errors
    (OUT/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
    print(json.dumps(results,ensure_ascii=False,indent=2))
    page.close()
