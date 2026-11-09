import json
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright

ORIGIN = 'https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
OUT = Path('/home/ubuntu/irbroker/assets/round4/review')
OUT.mkdir(parents=True, exist_ok=True)
results = {}

with sync_playwright() as p:
    browser=p.chromium.connect_over_cdp('http://localhost:9222')
    page=browser.contexts[0].new_page()
    page.set_viewport_size({'width':1440,'height':1000})
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(ORIGIN,wait_until='domcontentloaded')
    page.wait_for_function('document.querySelector("video")?.readyState>=2',timeout=30000)
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(900)
    assert page.locator('.brand-facets').count()==0
    assert page.locator('img[src*="irbroker-simbolo"]').count()==1
    assert page.locator('.hero-title-mask').count()>=2
    top=page.locator('.site-header').evaluate('e=>({position:getComputedStyle(e).position,height:e.getBoundingClientRect().height,background:getComputedStyle(e).backgroundColor,logo:e.querySelector("img").src})')
    assert top['position']=='fixed'
    page.locator('video').evaluate('e=>e.pause()')
    scenes=[]
    for time,name,href in [(1,'São Paulo','/'),(3,'Transporte de cargas','/transporte-de-cargas'),(6,'Comex Broker','/comex-broker'),(8,'Construção e imóveis','/construcao-e-imoveis'),(11,'Corporate','/corporate'),(13.8,'WellCare','/wellcare'),(15.3,'São Paulo','/')]:
        page.locator('video').evaluate('(e,t)=>{e.currentTime=t}',time)
        page.wait_for_timeout(380)
        actual=page.locator('.video-caption-name a').inner_text()
        link=page.locator('.video-caption-name a').get_attribute('href')
        assert actual==name and link==href,(time,actual,link)
        scenes.append({'time':time,'name':actual,'href':link})
    progress1=page.locator('.video-caption-track span').evaluate('e=>getComputedStyle(e).transform')
    time1=page.locator('video').evaluate('e=>e.currentTime')
    page.wait_for_timeout(500)
    assert progress1==page.locator('.video-caption-track span').evaluate('e=>getComputedStyle(e).transform')
    assert time1==page.locator('video').evaluate('e=>e.currentTime')
    page.locator('video').evaluate('e=>{e.currentTime=6}')
    page.wait_for_timeout(350)
    page.screenshot(path=str(OUT/'hero-desktop.png'))
    page.evaluate('window.scrollTo(0,100)')
    page.wait_for_timeout(300)
    scrolled=page.locator('.site-header').evaluate('e=>({height:e.getBoundingClientRect().height,background:getComputedStyle(e).backgroundColor,logo:e.querySelector("img").src,border:getComputedStyle(e.querySelector(".header-inner")).borderBottomWidth})')
    assert scrolled['height']==64 and '245, 244, 241' in scrolled['background'] and 'escuro' in scrolled['logo']
    page.locator('#verticais').scroll_into_view_if_needed()
    panel=page.locator('.vertical-panel').nth(1)
    panel.hover()
    page.wait_for_timeout(650)
    widths=page.locator('.vertical-panel').evaluate_all('(es)=>es.map(e=>({width:e.getBoundingClientRect().width,flex:getComputedStyle(e).flexGrow,active:e.classList.contains("panel-active"),hidden:e.querySelector(".panel-details").getAttribute("aria-hidden")}))')
    assert float(widths[1]['flex'])==2.4 and widths[1]['width']>widths[0]['width']*2.3
    assert widths[0]['hidden']=='true' and widths[1]['hidden'] is None
    page.screenshot(path=str(OUT/'verticais-hover-desktop.png'))
    page.mouse.move(5,5)
    page.locator('.vertical-panel').nth(3).focus()
    page.wait_for_timeout(650)
    assert page.locator('.vertical-panel').nth(3).evaluate('e=>getComputedStyle(e).flexGrow')=='2.4'
    page.locator('.process-diagram').scroll_into_view_if_needed()
    page.wait_for_timeout(750)
    paths=page.locator('.process-line-horizontal path').evaluate_all('(es)=>es.map(e=>({length:e.getAttribute("pathLength"),dash:e.getAttribute("stroke-dasharray")}))')
    page.screenshot(path=str(OUT/'diagrama-desktop.png'))
    page.locator('.partners-section').scroll_into_view_if_needed()
    page.wait_for_timeout(600)
    logos=page.locator('.partner-logo img').evaluate_all('(es)=>es.map(e=>({alt:e.alt,height:e.getBoundingClientRect().height,blend:getComputedStyle(e).mixBlendMode,opacity:getComputedStyle(e).opacity,filter:getComputedStyle(e).filter}))')
    assert len(logos)==32 and all(x['blend']=='multiply' and 28<=x['height']<=32 for x in logos)
    assert next(x for x in logos if 'AXA' in x['alt'])['opacity']=='0.55'
    page.screenshot(path=str(OUT/'logos-desktop.png'))
    page.locator('footer').scroll_into_view_if_needed()
    page.wait_for_timeout(350)
    assert page.locator('.whatsapp-link').is_hidden()
    footer=page.locator('.footer-columns').evaluate('e=>({columns:getComputedStyle(e).gridTemplateColumns,addresses:e.querySelectorAll(".address").length,contact:e.querySelector(".footer-contact-link").getAttribute("href")})')
    assert footer['addresses']==2 and footer['contact']=='/contato'
    page.screenshot(path=str(OUT/'rodape-desktop.png'))
    results['desktop']={'top':top,'scrolled':scrolled,'scenes':scenes,'pauseStable':True,'panels':widths,'paths':paths,'logos':logos,'footer':footer}
    print('Desktop: legenda, pausa, header, painéis, logos e rodapé OK',flush=True)

    for width in [375,414]:
        page.set_viewport_size({'width':width,'height':896})
        page.goto(ORIGIN,wait_until='networkidle')
        page.evaluate('document.fonts.ready')
        page.wait_for_timeout(750)
        assert page.locator('.video-caption').count()==0 and page.locator('video').count()==0
        assert page.locator('.brand-facets').count()==0
        mobile=page.evaluate('''() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,body:getComputedStyle(document.body).fontSize,lineHeight:getComputedStyle(document.body).lineHeight,whatsapp:{width:document.querySelector('.whatsapp-link').getBoundingClientRect().width,height:document.querySelector('.whatsapp-link').getBoundingClientRect().height,radius:getComputedStyle(document.querySelector('.whatsapp-link')).borderRadius,label:document.querySelector('.whatsapp-link').getAttribute('aria-label')}, title:getComputedStyle(document.querySelector('h1')).fontSize})''')
        assert mobile['scrollWidth']<=width and mobile['body']=='17px'
        assert mobile['whatsapp']['width']==52 and mobile['whatsapp']['height']==52
        page.screenshot(path=str(OUT/f'hero-{width}.png'))
        page.locator('.menu-toggle').click()
        page.locator('.solutions-toggle').click()
        assert page.locator('.site-header').evaluate('e=>e.getBoundingClientRect().height')==896
        assert page.evaluate('getComputedStyle(document.body).overflow')=='hidden'
        page.keyboard.press('Escape')
        page.locator('.process-diagram').scroll_into_view_if_needed()
        page.wait_for_timeout(700)
        nodeTops=page.locator('.process-node').evaluate_all('(es)=>es.map(e=>e.getBoundingClientRect().top)')
        assert nodeTops[0]<nodeTops[1]<nodeTops[2]
        assert page.locator('.process-line-vertical').first.is_visible()
        page.screenshot(path=str(OUT/f'diagrama-{width}.png'))
        page.locator('#verticais').scroll_into_view_if_needed()
        page.locator('.vertical-indicator button').nth(4).click()
        page.wait_for_timeout(650)
        assert page.locator('.vertical-panels').evaluate('e=>e.scrollWidth>e.clientWidth&&e.scrollLeft>0')
        page.screenshot(path=str(OUT/f'verticais-{width}.png'))
        page.goto(ORIGIN+'/contato?frente=Corporate',wait_until='networkidle')
        assert page.locator('[name="frente"]').input_value()=='Corporate'
        page.locator('.contact-form').scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        assert page.locator('.whatsapp-link').is_hidden()
        assert page.locator('[name="mensagem"]').evaluate('e=>getComputedStyle(e).fontSize')=='17px'
        page.screenshot(path=str(OUT/f'contato-{width}.png'))
        results[str(width)]={'mobile':mobile,'nodeTops':nodeTops,'carousel':True,'formWhatsAppHidden':True,'preselected':True}
        print(f'Mobile {width}: diagrama vertical, carrossel, WhatsApp e formulário OK',flush=True)

    routes=[]
    for slug,name in [('transporte-de-cargas','Transporte de cargas'),('comex-broker','Comex Broker'),('construcao-e-imoveis','Construção e imóveis'),('corporate','Corporate'),('wellcare','WellCare')]:
        page.goto(ORIGIN+'/'+slug,wait_until='networkidle')
        assert page.locator('.solution-accordion,details,summary,.accordion-plus').count()==0
        button=page.locator('.front-final-contact .button')
        assert button.inner_text()=='Falar sobre '+name
        assert parse_qs(urlparse(button.get_attribute('href')).query)['frente']==[name]
        assert page.locator('.other-fronts nav a').count()==4
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        routes.append({'slug':slug,'solutions':page.locator('.solution-list li').count(),'button':button.inner_text(),'others':4})
    results['fronts']=routes
    page.set_viewport_size({'width':1440,'height':1000})
    page.emulate_media(reduced_motion='reduce')
    page.goto(ORIGIN,wait_until='networkidle')
    page.wait_for_timeout(200)
    assert page.locator('video').count()==0
    assert page.locator('.hero-title-line').evaluate_all('(es)=>es.every(e=>getComputedStyle(e).transform==="none"||getComputedStyle(e).transform==="matrix(1, 0, 0, 1, 0, 0)")')
    page.locator('#verticais').scroll_into_view_if_needed()
    page.locator('.vertical-panel').nth(0).hover()
    page.wait_for_timeout(30)
    assert page.locator('.vertical-panel').first.evaluate('e=>getComputedStyle(e).flexGrow')=='2.4'
    results['reducedMotion']={'posterOnly':True,'staticTitles':True,'instantPanels':True}
    results['pageErrors']=errors
    (OUT/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
    print(json.dumps(results,ensure_ascii=False,indent=2))
    page.close()
