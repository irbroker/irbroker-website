from playwright.sync_api import sync_playwright
from pathlib import Path
import json
origin='https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
results=[]
with sync_playwright() as p:
 b=p.chromium.connect_over_cdp('http://localhost:9222');c=b.contexts[0]
 for path in ['/conteudos','/conteudos/vida-saude-odonto-beneficios']:
  page=c.new_page();page.set_viewport_size({'width':375,'height':896});page.goto(origin+path,wait_until='load');page.wait_for_function('document.querySelector("#root") && Object.keys(document.querySelector("#root")).some(k=>k.startsWith("__react"))');page.wait_for_timeout(400)
  assert page.locator('.whatsapp-link').is_hidden()
  assert page.locator('.skip-link').evaluate('e=>getComputedStyle(e).opacity')=='0'
  page.keyboard.press('Tab');assert page.locator('.skip-link').evaluate('e=>e===document.activeElement&&e.matches(":focus-visible")&&getComputedStyle(e).opacity==="1"');assert page.locator('.skip-link').bounding_box()['y']>=0
  results.append({'route':path,'fabNotCoveringText':True,'skipHiddenNormally':True,'skipVisibleOnTab':True});print(path,'A11y OK',flush=True);page.close()
 page=c.new_page();page.set_viewport_size({'width':1440,'height':1000});page.goto(origin+'/',wait_until='load');page.wait_for_selector('.partner-logo');logo=page.locator('.partner-logo').first;logo.scroll_into_view_if_needed();logo.hover();assert logo.locator('img').evaluate('e=>getComputedStyle(e).filter')=='none';assert logo.locator('img').evaluate('e=>getComputedStyle(e).opacity')=='1';logo.focus();assert logo.locator('img').evaluate('e=>getComputedStyle(e).filter')=='none';page.close();print('Logo hover/focus OK',flush=True)
Path('/home/ubuntu/irbroker/assets/round8/review/a11y-final.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
