from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.parse import quote, parse_qs
from PIL import Image
import numpy as np
import io, json, re, time

ROOT=Path('/home/ubuntu/irbroker')
OUT=ROOT/'assets/round8/review'
OUT.mkdir(parents=True,exist_ok=True)
ORIGIN='https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
ENDPOINT='https://n8n.syravel.com/webhook/irb-site-contato-8b76e2cd'
ORDER=['Comex Broker','WellCare','Transporte de cargas','Construção e imóveis','Corporate']
results={'videos':[], 'contact':[], 'navigation':[]}

def lum(rgb):
    v=np.asarray(rgb,dtype=float)/255
    v=np.where(v<=.04045,v/12.92,((v+.055)/1.055)**2.4)
    return v[...,0]*.2126+v[...,1]*.7152+v[...,2]*.0722

def measure(on,off,box,color):
    x,y,w,h=map(int,[box['x'],box['y'],box['width'],box['height']])
    a=np.array(on)[max(0,y):min(on.height,y+h),max(0,x):min(on.width,x+w),:3]
    b=np.array(off)[max(0,y):min(off.height,y+h),max(0,x):min(off.width,x+w),:3]
    mask=np.max(np.abs(a.astype(int)-b.astype(int)),axis=2)>25
    vals=[float(n) for n in re.findall(r'[0-9.]+',color)]
    fg=np.array(vals[:3]);alpha=vals[3] if len(vals)==4 else 1
    if not mask.any():raise AssertionError('No visible text pixels in '+str(box))
    bg=b[mask];composite=fg*alpha+bg*(1-alpha)
    l1,l2=lum(composite),lum(bg)
    ratio=(np.maximum(l1,l2)+.05)/(np.minimum(l1,l2)+.05)
    return round(float(np.min(ratio)),3)

with sync_playwright() as p:
    b=p.chromium.connect_over_cdp('http://localhost:9222');c=b.contexts[0]
    for path, points in [('/',[(1.1,None),(3.5,'Comex Broker'),(6.1,'WellCare'),(8.7,'Transporte de cargas'),(11.3,'Construção e imóveis'),(13.9,'Corporate'),(15.4,None)]),('/comex-broker',[(.5,None),(2,None),(3.5,None),(5,None),(6.5,None),(7.5,None)])]:
        page=c.new_page();page.set_viewport_size({'width':1440,'height':1000});page.goto(ORIGIN+path,wait_until='load');page.evaluate('document.fonts.ready');page.wait_for_function('document.querySelector("video")?.readyState>=2');page.wait_for_timeout(1000)
        video=page.locator('video');video.evaluate('v=>v.pause()')
        assert video.evaluate('v=>v.muted&&v.loop&&v.playsInline&&v.autoplay')
        toggle=page.locator('.video-toggle');assert toggle.get_attribute('aria-label')=='Retomar vídeo';assert toggle.evaluate('e=>getComputedStyle(e).clipPath')=='inset(50%)'
        toggle.focus();assert toggle.evaluate('e=>getComputedStyle(e).clipPath')=='none';toggle.press('Enter');page.wait_for_timeout(100);assert toggle.get_attribute('aria-label')=='Pausar vídeo';toggle.press('Enter');assert toggle.get_attribute('aria-label')=='Retomar vídeo';page.locator('a.wordmark').focus()
        for timestamp, scene in points:
            video.evaluate('(v,t)=>{v.pause();v.currentTime=t}',timestamp)
            page.wait_for_function('(t)=>Math.abs(document.querySelector("video").currentTime-t)<.05&&document.querySelector("video").readyState>=2',arg=timestamp)
            page.wait_for_timeout(450)
            if path=='/':
                name=page.locator('.video-caption-name a')
                assert (name.inner_text() if name.count() else None)==scene
            selectors=['.hero-content h1','.hero-description']
            if path=='/': selectors += ['.hero-actions .button-outline','.video-caption > p']+(['.video-caption-name a'] if scene else [])
            geometry={s:{'box':page.locator(s).bounding_box(),'color':page.locator(s).evaluate('e=>getComputedStyle(e).color')} for s in selectors}
            on=Image.open(io.BytesIO(page.screenshot())).convert('RGB')
            style=page.add_style_tag(content=', '.join(selectors)+' {visibility:hidden!important;}')
            off=Image.open(io.BytesIO(page.screenshot())).convert('RGB');style.evaluate('e=>e.remove()')
            ratios={s:measure(on,off,d['box'],d['color']) for s,d in geometry.items()}
            row={'route':path,'time':timestamp,'scene':scene or ('São Paulo' if path=='/' else 'Comex'),'contrast':ratios}
            results['videos'].append(row);on.save(OUT/f'video-{ "home" if path=="/" else "comex" }-{timestamp}.png');print('Contrast',row,flush=True)
            assert all(r>=4.5 for r in ratios.values()),row
            assert video.evaluate('v=>v.paused')
        page.close()
        page=c.new_page();page.set_viewport_size({'width':1440,'height':1000});page.emulate_media(reduced_motion='reduce');requests=[];page.on('request',lambda r:requests.append(r.url) if '.mp4' in r.url else None);page.goto(ORIGIN+path,wait_until='load');page.wait_for_timeout(500);assert page.locator('video,.video-caption,.video-toggle').count()==0 and not requests;page.close()
    # Native keyboard menu, front order, and sticky filter positioning.
    for width in [375,414,768,1024,1440]:
        page=c.new_page();page.set_viewport_size({'width':width,'height':896});page.goto(ORIGIN+'/conteudos',wait_until='load');page.wait_for_timeout(300)
        if width<768:
            page.locator('.menu-toggle').click();page.locator('.solutions-toggle').click();assert page.locator('.solutions-dropdown a').all_inner_texts()==ORDER;assert page.locator('.site-header').evaluate('e=>Math.abs(e.getBoundingClientRect().height-innerHeight)<2');page.keyboard.press('Escape')
        else:
            right=page.locator('#main-navigation').bounding_box();assert right['x']+right['width']<=width+1,(width,right)
        page.locator('.content-filters').evaluate('e=>e.scrollIntoView()');page.wait_for_timeout(220);top=page.locator('.content-filters').bounding_box()['y'];assert top>=63 and top<=66,(width,top)
        results['navigation'].append({'width':width,'filterTop':top});page.close()
    # Preselection and mocked submit states: no webhook request leaves the browser.
    for name in ORDER:
        page=c.new_page();page.set_viewport_size({'width':375,'height':896});page.goto(ORIGIN+'/contato?frente='+quote(name),wait_until='load');page.wait_for_function('(n)=>document.querySelector("input[name=frente]:checked")?.value===n',arg=name);assert page.locator('input[name=frente]:checked').count()==1;page.close()
    page=c.new_page();page.set_viewport_size({'width':375,'height':896});page.goto(ORIGIN+'/contato?frente=Comex%20Broker',wait_until='load');page.wait_for_timeout(400)
    state={'mode':'400','payload':None}
    def mock(route):
        state['payload']={'headers':route.request.headers,'body':parse_qs(route.request.post_data or '',keep_blank_values=True)}
        if state['mode']=='network':route.abort('failed')
        else:route.fulfill(status=400 if state['mode']=='400' else 200,content_type='application/json',body=json.dumps({'ok':False,'erros':['Erro de validação de teste']} if state['mode']=='400' else {'ok':True}))
    page.route(ENDPOINT,mock)
    page.locator('input[name=nome]').fill('Teste local');page.locator('input[name=empresa]').fill('Empresa de teste');page.locator('input[name=email]').fill('teste@example.com');page.locator('input[name=telefone]').fill('11987654321');assert page.locator('input[name=telefone]').input_value()=='(11) 98765-4321';page.locator('textarea[name=mensagem]').fill('Teste interceptado; não enviar lead');page.locator('input[name=aceite]').check()
    submit=page.locator('button[type=submit]');submit.click();page.wait_for_selector('#contact-errors p');assert page.locator('input[name=nome]').input_value()=='Teste local';assert page.locator('#contact-errors').inner_text()=='Erro de validação de teste';body=state['payload']['body'];assert body['frente']==['Comex Broker'] and body['aceite']==['on'] and body['pagina']==['/contato'] and body['site']==[''] and int(body['t0'][0])>0;assert state['payload']['headers']['content-type'].startswith('application/x-www-form-urlencoded')
    state['mode']='network';submit.click();page.wait_for_function('document.querySelector("#contact-errors").textContent.startsWith("Não foi possível enviar agora.")')
    state['mode']='success';submit.click();page.wait_for_selector('.contact-success');assert page.locator('form').count()==0;assert page.locator('.contact-success').inner_text()=='Recebemos seu contato. A equipe da irbroker vai retornar pelo telefone ou e-mail informado.';results['contact'].append({'preselections':ORDER,'payload':body,'validation400':True,'network':True,'success':True,'externalRequests':0});page.close()
(OUT/'interaction-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print('Interactions complete',flush=True)
