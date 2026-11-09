import json
import sys
from pathlib import Path
from urllib.parse import parse_qs
from playwright.sync_api import sync_playwright

ORIGIN = 'https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
ENDPOINT = 'https://n8n.syravel.com/webhook/irb-site-contato-8b76e2cd'
OUT = Path('/home/ubuntu/irbroker/assets/round3/review')
OUT.mkdir(exist_ok=True)
SUCCESS = 'Recebemos seu contato. A equipe da irbroker vai retornar pelo telefone ou e-mail informado.'
NETWORK = 'Não foi possível enviar agora. Fale com a gente pelo WhatsApp ou pelo comercial@irbroker.com.br.'
results = {}

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp('http://localhost:9222')
    context = browser.contexts[0]
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    mp4 = []
    page.on('request', lambda request: mp4.append(request.url) if '.mp4' in request.url else None)
    for width in ([] if '--remaining' in sys.argv else [375, 414]):
        page.set_viewport_size({'width': width, 'height': 896})
        page.emulate_media(reduced_motion='no-preference')
        mp4.clear()
        page.goto(ORIGIN, wait_until='networkidle')
        page.evaluate('document.fonts.ready')
        home = page.evaluate('''() => ({width:innerWidth, scrollWidth:document.documentElement.scrollWidth,siteWidth:document.querySelector('.site').clientWidth,siteScroll:document.querySelector('.site').scrollWidth, videoCount:document.querySelectorAll('video').length,titleSize:getComputedStyle(document.querySelector('h1')).fontSize,bodySize:getComputedStyle(document.body).fontSize,lineHeight:getComputedStyle(document.body).lineHeight,proofLogos:document.querySelectorAll('.proof-logos img').length,facets:document.querySelectorAll('.brand-facets').length,imagesWithoutDimensions:[...document.images].filter(i=>!i.hasAttribute('width')||!i.hasAttribute('height')).map(i=>i.alt),nonWebP:[...document.images].filter(i=>!i.src.endsWith('.webp')&&!i.src.endsWith('.svg')).map(i=>i.src)})''')
        assert home['videoCount'] == 0 and len(mp4) == 0
        assert home['siteScroll'] <= home['siteWidth']
        assert 44 <= float(home['titleSize'].replace('px','')) <= 52
        assert home['proofLogos'] == 6 and home['bodySize'] == '17px'
        assert not home['imagesWithoutDimensions'] and not home['nonWebP']
        page.screenshot(path=str(OUT / f'hero-{width}.png'))
        page.locator('.menu-toggle').click()
        page.locator('.solutions-toggle').click()
        menu = page.locator('.site-header').evaluate('e=>({top:e.getBoundingClientRect().top,height:e.getBoundingClientRect().height,links:e.querySelectorAll("#solutions-navigation a").length})')
        assert menu['top'] == 0 and menu['height'] == 896 and menu['links'] == 5
        page.screenshot(path=str(OUT / f'menu-{width}.png'))
        page.keyboard.press('Escape')
        assert page.locator('.menu-toggle').get_attribute('aria-expanded') == 'false'
        page.locator('#verticais').scroll_into_view_if_needed()
        page.locator('.vertical-indicator button').nth(3).click()
        page.wait_for_timeout(700)
        assert page.locator('.vertical-indicator button[aria-current]').get_attribute('aria-label') == 'Corporate'
        panels = page.locator('.vertical-panels').evaluate('e=>({clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,scrollLeft:e.scrollLeft})')
        assert panels['scrollWidth'] > panels['clientWidth'] and panels['scrollLeft'] > 0
        page.screenshot(path=str(OUT / f'verticais-{width}.png'))
        page.goto(ORIGIN+'/contato',wait_until='networkidle')
        page.locator('button[type="submit"]').scroll_into_view_if_needed()
        sending = page.evaluate('''() => ({buttonBottom:document.querySelector('button[type="submit"]').getBoundingClientRect().bottom,whatsappTop:document.querySelector('.whatsapp-link').getBoundingClientRect().top, formWidth:document.querySelector('form').getBoundingClientRect().width, pageWidth:document.documentElement.scrollWidth})''')
        assert sending['buttonBottom'] <= sending['whatsappTop']
        page.screenshot(path=str(OUT / f'contato-{width}.png'))
        page.locator('.site').evaluate('e=>e.scrollTo(0,e.scrollHeight)')
        page.wait_for_timeout(300)
        footer = page.evaluate('''() => ({footerBottom:document.querySelector('.footer-bottom').getBoundingClientRect().bottom,whatsappTop:document.querySelector('.whatsapp-link').getBoundingClientRect().top})''')
        assert footer['footerBottom'] <= footer['whatsappTop']
        results[str(width)] = {'home':home,'menu':menu,'panels':panels,'sending':sending,'footer':footer,'videoRequests':len(mp4)}

    page.set_viewport_size({'width':1440,'height':1000})
    page.emulate_media(reduced_motion='reduce')
    mp4.clear()
    page.goto(ORIGIN,wait_until='networkidle')
    assert page.locator('video').count() == 0 and len(mp4) == 0
    results['reducedMotion'] = {'videoCount':0,'requests':0}
    print('Poster e movimento reduzido: OK', flush=True)
    page.emulate_media(reduced_motion='no-preference')
    page.reload(wait_until='domcontentloaded')
    page.wait_for_function('document.querySelector("video")?.readyState>=2',timeout=30000)
    video = page.locator('video').evaluate('e=>({muted:e.muted,loop:e.loop,playsInline:e.playsInline,preload:e.preload,width:e.videoWidth,height:e.videoHeight,paused:e.paused,duration:e.duration})')
    page.locator('[aria-label="Pausar vídeo"]').click()
    assert page.locator('video').evaluate('e=>e.paused')
    page.locator('[aria-label="Retomar vídeo"]').click()
    page.wait_for_timeout(150)
    assert not page.locator('video').evaluate('e=>e.paused')
    page.screenshot(path=str(OUT/'hero-desktop.png'))
    results['desktopVideo'] = video
    print('Vídeo, pausar e retomar: OK', flush=True)
    page.locator('.skip-link').focus()
    assert page.locator('.skip-link').evaluate('e=>e.getBoundingClientRect().top>=0')
    page.keyboard.press('Enter')
    assert page.evaluate('document.activeElement.id') == 'conteudo'

    # Real endpoint receives only an empty, invalid payload: no invented contact/lead.
    results['webhookValidation'] = page.evaluate('''async (url) => {try {const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams()});return {status:r.status,data:await r.json()};}catch(e){return {error:String(e)};}}''',ENDPOINT)

    page.set_viewport_size({'width':375,'height':896})
    page.goto(ORIGIN+'/contato',wait_until='networkidle')
    payloads = []
    def invalid_response(route):
        payloads.append({'body':parse_qs(route.request.post_data or '',keep_blank_values=True),'contentType':route.request.headers.get('content-type'),'method':route.request.method})
        route.fulfill(status=400,content_type='application/json',body=json.dumps({'ok':False,'erros':['E-mail inválido.']}),headers={'Access-Control-Allow-Origin':'*'})
    page.route(ENDPOINT,invalid_response)
    page.locator('button[type="submit"]').click()
    assert not payloads # Native required validation must block empty form.
    page.locator('[name="nome"]').fill('Teste local interceptado')
    page.locator('[name="empresa"]').fill('Teste local')
    page.locator('[name="email"]').fill('teste@example.com')
    page.locator('[name="telefone"]').fill('11987654321')
    assert page.locator('[name="telefone"]').input_value() == '(11) 98765-4321'
    page.locator('[name="frente"]').select_option('Corporate')
    page.locator('[name="mensagem"]').fill('Teste apenas no navegador, não enviado ao webhook.')
    page.locator('[name="aceite"]').check()
    page.locator('button[type="submit"]').click()
    page.wait_for_function('document.querySelector("#contact-errors").textContent.includes("E-mail inválido.")')
    assert page.locator('[name="nome"]').input_value() == 'Teste local interceptado'
    body=payloads[-1]['body']
    assert set(body)=={'nome','empresa','email','telefone','frente','mensagem','aceite','site','pagina','t0'}
    assert body['aceite']==['on'] and body['pagina']==['/contato'] and int(body['t0'][0])>0 and body['site']==['']
    assert payloads[-1]['contentType'].startswith('application/x-www-form-urlencoded')
    honey=page.locator('[name="site"]').evaluate('e=>({display:getComputedStyle(e).display,left:e.getBoundingClientRect().left,tab:e.tabIndex,auto:e.autocomplete,aria:e.getAttribute("aria-hidden")})')
    assert honey['display']!='none' and honey['left']<0 and honey['tab']==-1
    page.screenshot(path=str(OUT/'contato-erros.png'))
    page.unroute(ENDPOINT)
    page.route(ENDPOINT,lambda route:route.abort('failed'))
    page.locator('button[type="submit"]').click()
    page.wait_for_function('(text)=>document.querySelector("#contact-errors").textContent.includes(text)',arg=NETWORK)
    assert page.locator('[name="empresa"]').input_value()=='Teste local'
    page.unroute(ENDPOINT)
    def success_response(route):
        payloads.append({'body':parse_qs(route.request.post_data or '',keep_blank_values=True),'contentType':route.request.headers.get('content-type'),'method':route.request.method})
        page.wait_for_timeout(400)
        results['sendingLabel']=page.locator('button[type="submit"]').inner_text()
        results['sendingDisabled']=page.locator('button[type="submit"]').is_disabled()
        route.fulfill(status=200,content_type='application/json',body='{"ok":true}',headers={'Access-Control-Allow-Origin':'*'})
    page.route(ENDPOINT,success_response)
    page.locator('button[type="submit"]').click()
    page.wait_for_selector('.contact-success')
    assert page.locator('.contact-success').inner_text()==SUCCESS and page.locator('form').count()==0
    assert body['t0']==payloads[-1]['body']['t0']
    assert results['sendingLabel']=='Enviando…' and results['sendingDisabled']
    page.screenshot(path=str(OUT/'contato-sucesso.png'))
    results['form']={'validationBlockedEmpty':True,'mask':True,'fields':list(body),'honeypot':honey,'400Retained':True,'networkRetained':True,'successReplaced':True,'stableT0':True,'mockRequests':len(payloads)}
    results['pageErrors']=errors
    page.unroute(ENDPOINT)
    page.close()

(OUT/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
