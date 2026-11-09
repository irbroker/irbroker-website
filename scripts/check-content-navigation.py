from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
    b=p.chromium.connect_over_cdp('http://localhost:9222')
    page=b.contexts[0].new_page()
    page.set_viewport_size({'width':375,'height':896})
    events=[]
    page.on('pageerror',lambda e:events.append({'error':str(e)}))
    page.on('console',lambda e:events.append({'console':e.text}) if e.type=='error' else None)
    page.on('requestfailed',lambda r:events.append({'failed':r.url,'reason':r.failure}))
    page.on('response',lambda r:events.append({'response':r.url,'status':r.status,'type':r.headers.get('content-type')}) if r.status>=400 else None)
    page.goto('https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer/conteudos',wait_until='load')
    page.wait_for_timeout(300)
    print('Before',page.evaluate('({pos:getComputedStyle(document.querySelector(".site-header")).position,styles:document.styleSheets.length,scripts:[...document.scripts].map(s=>({src:s.src,type:s.type}))})'),flush=True)
    page.locator('.menu-toggle').click()
    with page.expect_navigation(wait_until='load'):
        page.locator('#main-navigation').get_by_role('link',name='Conteúdos',exact=True).click()
    page.wait_for_timeout(1500)
    print('After',page.evaluate('({url:location.href,pos:getComputedStyle(document.querySelector(".site-header")).position,styles:document.styleSheets.length,scripts:[...document.scripts].map(s=>({src:s.src,type:s.type})),links:[...document.querySelectorAll("link")].map(e=>e.outerHTML)})'),flush=True)
    print(json.dumps(events,ensure_ascii=False,indent=2),flush=True)
    page.close()
