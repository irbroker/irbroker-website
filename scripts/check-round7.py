from pathlib import Path
from urllib.parse import quote
import json
import re
import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT=Path('/home/ubuntu/irbroker')
ORIGIN='https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer'
OUT=ROOT/'assets/round7/review'
OUT.mkdir(parents=True,exist_ok=True)
fronts=['Transporte de cargas','Comex Broker','Construção e imóveis','Corporate','WellCare']
expected={'Transporte de cargas':(1,1),'Comex Broker':(1,1),'Construção e imóveis':(0,1),'Corporate':(1,0),'WellCare':(1,1)}
for front,(radar,guides) in expected.items():
    response=requests.get('http://localhost:3000/conteudos?frente='+quote(front))
    assert response.status_code==200
    s=BeautifulSoup(response.text,'html.parser')
    assert len(s.select('.radar-note'))==radar,(front,'SSR radar')
    assert len(s.select('.guide-list-item'))==guides,(front,'SSR guides')
    assert s.select_one('.content-filters [aria-current=true]').get_text()==front
assert requests.get('http://localhost:3000/conteudos/nao-existe').status_code==404
s=BeautifulSoup(requests.get('http://localhost:3000/conteudos').text,'html.parser')
assert len(s.select('.radar-note'))==4 and len(s.select('.guide-list-item'))==4
assert 'TCU decide' not in s.get_text() and 'PENDENTE' not in s.get_text()
slugs=[a['href'] for a in s.select('.guide-list-item h3 a')]
expected_titles=[]
for slug in slugs:
    r=requests.get('http://localhost:3000'+slug);assert r.status_code==200
    doc=BeautifulSoup(r.text,'html.parser')
    title=doc.select_one('.guide-heading h1').get_text()
    expected_titles.append(title)
    assert doc.title.get_text()==title+' | irbroker'
    assert doc.select_one('meta[name=description]')['content']==doc.select_one('.guide-subtitle').get_text()
    assert doc.select_one('meta[property="og:type"]')['content']=='article'
    article=[json.loads(tag.string) for tag in doc.select('script[type="application/ld+json"]') if tag.string and json.loads(tag.string).get('@type')=='Article'][0]
    assert article['datePublished']=='2026-11-09' and article['headline']==title
    assert doc.select_one('.guide-informative em')
    assert len(doc.select('.other-guides .guide-list-item'))==3
    assert all(a['target']=='_blank' and a['rel']==['noopener'] for a in doc.select('.guide-sources a'))
    assert '/contato?frente=' in doc.select_one('.guide-contact a')['href']
manifest=requests.get('http://localhost:3000/manus-routes.json').json()
assert len(manifest['routes'])==13
assert set(slugs+['/conteudos'])<=set(x['path'] for x in manifest['routes'])
sitemap=requests.get('http://localhost:3000/sitemap.xml').text
for slug in slugs+['/conteudos']:assert slug in sitemap
results={'ssrFilters':expected,'guides':slugs,'seoArticle':True,'manifestCount':13,'sitemapIncludesAll':True,'pendingExcluded':True,'missingGuide404':True}
with sync_playwright() as p:
    b=p.chromium.connect_over_cdp('http://localhost:9222')
    page=b.contexts[0].new_page()
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_viewport_size({'width':1440,'height':1000})
    page.goto(ORIGIN+'/conteudos',wait_until='load')
    assert page.locator('.header-inner .wordmark img').get_attribute('src').find('escuro')!=-1
    assert page.locator('.content-page-heading h1').inner_text()=='O que muda no seguro da sua empresa.'
    for front,(radar,guides) in expected.items():
        page.locator('.content-filters').get_by_role('link',name=front,exact=True).click()
        assert 'frente=' in page.url
        assert page.locator('.radar-note').count()==radar
        assert page.locator('.guide-list-item').count()==guides
    page.go_back(wait_until='domcontentloaded')
    assert page.locator('.content-filters [aria-current=true]').inner_text()=='Corporate'
    page.locator('.content-filters').get_by_role('link',name='Todas',exact=True).click()
    assert page.locator('.radar-note').count()==4 and page.locator('.guide-list-item').count()==4
    assert [page.locator('.radar-note .content-meta').nth(i).inner_text().split('·')[0].strip() for i in range(4)]==['Comex Broker','Corporate','Transporte de cargas','WellCare']
    page.locator('.radar-note').first.locator('.content-text-link').click()
    page.wait_for_url('**/contato?frente=*')
    page.wait_for_function('document.querySelector("[name=frente]").value==="Comex Broker"')
    for width in [1440,1024,768,375,414]:
        page.set_viewport_size({'width':width,'height':1000 if width>767 else 896})
        page.goto(ORIGIN+'/conteudos',wait_until='load')
        page.evaluate('document.fonts.ready')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        if width<768:
            page.locator('.menu-toggle').click()
            links=page.locator('#main-navigation > a.nav-link').all_inner_texts()
            assert links==['Sobre','Conteúdos','Contato']
            with page.expect_navigation(wait_until='load'):
                page.locator('#main-navigation').get_by_role('link',name='Conteúdos',exact=True).click()
            page.wait_for_function('getComputedStyle(document.querySelector(".site-header")).position==="fixed"')
        if width in [1440,375]:page.screenshot(path=str(OUT/f'conteudos-{width}.png'))
    page.set_viewport_size({'width':375,'height':896})
    for slug in slugs:
        page.goto(ORIGIN+slug,wait_until='load')
        page.evaluate('document.fonts.ready')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        styles=page.locator('.guide-body p').first.evaluate('e=>({font:getComputedStyle(e).fontSize,line:getComputedStyle(e).lineHeight,width:e.getBoundingClientRect().width})')
        assert styles['font']=='18px' and abs(float(styles['line'].rstrip('px'))-30.6)<.1
        if slug==slugs[0]:page.screenshot(path=str(OUT/'guia-375.png'))
    page.goto(ORIGIN,wait_until='load')
    page.wait_for_selector('.home-radar-notes article')
    assert page.locator('.home-radar-notes article').count()==3
    assert page.locator('.home-radar').evaluate('e=>e.nextElementSibling.classList.contains("final-cta")')
    assert not page.locator('.home-radar').get_by_text('O que muda para a sua empresa',exact=True).count()
    for slug,count in [('transporte-de-cargas',1),('comex-broker',1),('corporate',1),('wellcare',1),('construcao-e-imoveis',0)]:
        page.goto(ORIGIN+'/'+slug,wait_until='load')
        page.wait_for_selector('.vertical-page')
        assert page.locator('.front-radar .radar-note').count()==count
    results['runtimeFiltersBackForward']=True
    results['mobileMenu']=True
    results['guideTypography18Line17']=True
    results['home3AndFront4']=True
    results['pageErrors']=errors
    assert not errors,errors
    page.close()
(OUT/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
