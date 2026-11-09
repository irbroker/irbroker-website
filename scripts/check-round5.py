import json
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright

ORIGIN='https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
OUT=Path('/home/ubuntu/irbroker/assets/round5')
OUT.mkdir(parents=True,exist_ok=True)
results={}
with sync_playwright() as p:
    b=p.chromium.connect_over_cdp('http://localhost:9222')
    page=b.contexts[0].new_page()
    page.set_viewport_size({'width':1440,'height':1000})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(ORIGIN,wait_until='domcontentloaded')
    page.wait_for_selector('video')
    page.wait_for_function('document.querySelector("video").readyState>=2')
    page.wait_for_function('!document.querySelector("video").paused')
    button=page.locator('.video-toggle')
    assert button.get_attribute('aria-label')=='Pausar vídeo'
    button.click()
    assert page.locator('video').evaluate('e=>e.paused')
    assert button.get_attribute('aria-label')=='Retomar vídeo'
    page.locator('video').evaluate('e=>{e.currentTime=1}')
    page.wait_for_timeout(350)
    assert page.locator('.video-caption').inner_text().strip()=='Grupo irbroker'
    assert page.locator('.video-caption a').count()==0
    page.locator('video').evaluate('e=>{e.currentTime=6}')
    page.wait_for_timeout(350)
    assert page.locator('.video-caption a').inner_text()=='Comex Broker'
    assert page.locator('.video-caption a').get_attribute('href')=='/comex-broker'
    button.click()
    page.wait_for_function('!document.querySelector("video").paused')
    assert button.get_attribute('aria-label')=='Pausar vídeo'
    page.locator('video').evaluate('e=>e.pause()')
    assert page.locator('.hero-kicker').inner_text()=='Grupo irbroker'
    assert page.locator('.trigger-copy .section-label').inner_text()=='Quando revisar'
    assert page.locator('.process-descriptions p').first.inner_text()=='A empresa mostra como a operação funciona: atividade, contratos, frota, equipe e patrimônio.'
    assert page.locator('.partner-line').count()==0
    assert page.locator('.header-contact').inner_text()=='Falar com um especialista'
    for width in [1440,1024,768]:
        page.set_viewport_size({'width':width,'height':1000})
        page.locator('#verticais').scroll_into_view_if_needed()
        page.locator('.vertical-panel').nth(1).hover()
        page.wait_for_timeout(650)
        names=page.locator('.panel-copy h3').evaluate_all('(es)=>es.map(e=>({name:e.textContent,visible:getComputedStyle(e).visibility,display:getComputedStyle(e).display,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,innerWidth:e.clientWidth,scrollWidth:e.scrollWidth}))')
        assert len(names)==5 and all(n['visible']=='visible' and n['display']!='none' and n['scrollWidth']<=n['innerWidth']+1 for n in names),names
        results[f'panels-{width}']=names
    page.set_viewport_size({'width':375,'height':896})
    page.goto(ORIGIN+'/contato?frente=WellCare',wait_until='domcontentloaded')
    page.wait_for_function('document.querySelector("[name=frente]").value==="WellCare"')
    assert page.locator('.contact-form button[type=submit]').inner_text()=='Enviar mensagem'
    assert page.locator('.privacy-checkbox').inner_text()=='Li e aceito a Política de privacidade.'
    assert not page.locator('[name=aceite]').is_checked()
    page.locator('.privacy-checkbox button').click()
    assert page.locator('#privacy-policy-dialog').is_visible()
    assert not page.locator('[name=aceite]').is_checked()
    page.keyboard.press('Escape')
    assert page.locator('#privacy-policy-dialog').is_hidden()
    page.locator('.privacy-checkbox button').focus()
    page.keyboard.press('Enter')
    assert page.locator('#privacy-policy-dialog').is_visible()
    page.locator('#privacy-policy-dialog .dialog-close').click()
    assert page.locator('#privacy-policy-dialog').is_hidden()
    contacts=page.locator('.contact-information .address p').all_inner_texts()
    footer=page.locator('.footer-column-addresses .address p').all_inner_texts()
    assert contacts==footer==['Rua José Versolato, 101, 12º andar, Torre A, Centro, São Bernardo do Campo/SP, 09750-730','Av. Presidente Juscelino Kubitschek, 1455, 4º andar, Faria Lima, São Paulo/SP, 04543-011']
    results['privacy']={'clickOpens':True,'keyboardOpens':True,'doesNotAcceptAutomatically':True,'submit':'Enviar mensagem','addressesEqual':True}
    for slug,name in [('comex-broker','Comex Broker'),('wellcare','WellCare')]:
        page.goto(ORIGIN+'/'+slug,wait_until='domcontentloaded')
        link=page.locator('.hero-actions .button')
        assert link.inner_text()=='Falar com a '+name
        assert parse_qs(urlparse(link.get_attribute('href')).query)=={'frente':[name]}
        link.click()
        page.wait_for_url('**/contato?frente=*')
        page.wait_for_function('(name)=>document.querySelector("[name=frente]").value===name',arg=name)
        results[slug]={'text':'Falar com a '+name,'contactPreselected':True}
    results['video']={'pauseLabel':'Retomar vídeo','playLabel':'Pausar vídeo','saoPauloGroupOnlyNoLink':True,'frontLinkRetained':True}
    results['pageErrors']=errors
    assert not errors
    (OUT/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
    print(json.dumps(results,ensure_ascii=False,indent=2))
    page.close()
