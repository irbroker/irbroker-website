"""Capturas visuais e dump de estilos computados para comparar antes/depois de refatorações.

Uso:
  python scripts/capturas.py _visual/antes            # capturas 1366 e 390 + estilos
  python scripts/capturas.py _visual/depois
  python scripts/capturas.py --comparar _visual/antes _visual/depois
  python scripts/capturas.py --revisao _visual/final  # páginas inteiras + 404 + método e hover (revisão de design)
Base: variável BASE_URL (padrão http://127.0.0.1:5173).
"""
import gzip
import json
import os
import sys
from pathlib import Path

BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:5173').rstrip('/')
ROUTES = ['/', '/comex-broker', '/wellcare', '/transporte-de-cargas', '/construcao-e-imoveis', '/corporate',
          '/sobre', '/contato', '/conteudos', '/conteudos/seguros-obrigatorios-do-transportador',
          '/conteudos/cif-fob-seguro-da-carga', '/conteudos/seguro-do-condominio-predio-e-terceiros',
          '/conteudos/vida-saude-odonto-beneficios']
SHOT_WIDTHS = [1366, 390]
# Larguras que cobrem todos os @media do CSS (420, 767/768, 959, 1100, 1150, 1199, 1600).
STYLE_WIDTHS = [1700, 1366, 1180, 1120, 1000, 900, 800, 600, 400, 360]

FREEZE_CSS = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'

DUMP_JS = r'''() => {
  const out = {};
  const path = el => { const p = []; while (el && el.nodeType === 1) { let i = 0, s = el; while ((s = s.previousElementSibling)) i++; p.unshift(el.tagName.toLowerCase() + ':' + i); el = el.parentElement; } return p.join('>'); };
  const ser = cs => { const r = []; for (let i = 0; i < cs.length; i++) { const k = cs[i]; if (k.startsWith('--')) continue; r.push(k + ':' + cs.getPropertyValue(k)); } return r.join(';'); };
  for (const el of document.querySelectorAll('*')) {
    const p = path(el);
    out[p] = ser(getComputedStyle(el));
    for (const pseudo of ['::before', '::after', '::placeholder', '::marker']) {
      const cs = getComputedStyle(el, pseudo);
      if (pseudo === '::marker' && cs.content === 'normal' && el.tagName !== 'LI' && el.tagName !== 'SUMMARY') continue;
      if ((pseudo === '::before' || pseudo === '::after') && cs.content === 'none') continue;
      if (pseudo === '::placeholder' && !('placeholder' in el)) continue;
      out[p + pseudo] = ser(cs);
    }
  }
  return out;
}'''


def slug(route):
    return route.strip('/').replace('/', '__') or 'home'


def settle(page):
    page.wait_for_selector('.site-header', timeout=20000)
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(700)
    page.evaluate('''() => { document.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0; });
      for (const a of document.getAnimations()) { try { a.finish(); } catch (e) { a.cancel(); } } }''')
    page.wait_for_timeout(250)


# Rola em passos para disparar loading="lazy", volta ao topo e espera toda <img> decodificar.
LOAD_IMAGES_JS = r'''async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  // Faixas com rolagem horizontal (home 390) não disparam lazy com a rolagem vertical.
  document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
  for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { window.scrollTo(0, y); await sleep(150); }
  window.scrollTo(0, 0);
  const deadline = Date.now() + 15000;
  // Só as visíveis: img lazy dentro de display:none nunca carrega e travaria a espera.
  const imgs = () => [...document.images].filter(i => { const r = i.getBoundingClientRect(); const cs = getComputedStyle(i); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; });
  while (Date.now() < deadline && imgs().some(i => !(i.complete && i.naturalWidth > 0))) await sleep(200);
  await Promise.race([Promise.all(imgs().map(i => i.decode().catch(() => {}))), sleep(5000)]);
  const visible = imgs();
  return { total: visible.length, broken: visible.filter(i => !i.naturalWidth).map(i => i.currentSrc || i.src) };
}'''


def load_images(page, log, name):
    res = page.evaluate(LOAD_IMAGES_JS)
    page.wait_for_timeout(300)
    log.append(f"{name}: {res['total']} img visíveis, {len(res['broken'])} com naturalWidth 0 {res['broken'] or ''}")
    print(log[-1], flush=True)
    return res


def review(out_dir):
    from playwright.sync_api import sync_playwright
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    log = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for width in SHOT_WIDTHS:
            ctx = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce', device_scale_factor=1)
            page = ctx.new_page()
            for route in ROUTES + ['/rota-inexistente']:
                page.goto(BASE + route, wait_until='load')
                settle(page)
                name = f'{slug(route)}_{width}'
                load_images(page, log, name)
                page.add_style_tag(content=FREEZE_CSS)
                page.wait_for_timeout(150)
                page.screenshot(path=str(out / f'{name}.png'), full_page=True)
            ctx.close()
        # Sem movimento reduzido: método fixo com a linha desenhando e hover do vídeo do topo.
        ctx = browser.new_context(viewport={'width': 1366, 'height': 800}, device_scale_factor=1)
        page = ctx.new_page()
        page.goto(BASE + '/', wait_until='load')
        page.wait_for_selector('.method-pinned', timeout=20000)
        load_images(page, log, 'home_1366_metodo')
        top, height = page.evaluate("(() => { const s = document.querySelector('.method-section'); return [s.getBoundingClientRect().top + scrollY, s.offsetHeight - innerHeight]; })()")
        for suffix, frac in (('metodo', .5), ('metodo_fim', .92)):
            page.evaluate(f'window.scrollTo(0, {top + height * frac})')
            page.wait_for_timeout(1200)
            page.screenshot(path=str(out / f'home_1366_{suffix}.png'))
        for route in ('/', '/comex-broker'):
            page.goto(BASE + route, wait_until='load')
            page.wait_for_selector('.hero-video', timeout=20000)
            load_images(page, log, f'{slug(route)}_1366_hover')
            page.evaluate("""() => new Promise(r => { const v = document.querySelector('.hero-video');
              v.addEventListener('seeked', () => { v.pause(); r(); }, { once: true }); v.currentTime = 6; })""")
            box = page.locator('.hero-video').bounding_box()
            page.mouse.move(box['x'] + box['width'] / 2, box['y'] + min(box['height'], 800 - box['y']) / 2)
            page.wait_for_timeout(400)
            page.screenshot(path=str(out / f'{slug(route)}_1366_hover.png'))
        ctx.close()
        browser.close()
    (out / 'imagens.log').write_text('\n'.join(log) + '\n', encoding='utf-8')


def capture(out_dir, only_motion=False):
    from playwright.sync_api import sync_playwright
    out = Path(out_dir)
    (out / 'estilos').mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for width in ([] if only_motion else sorted(set(SHOT_WIDTHS + STYLE_WIDTHS), reverse=True)):
            ctx = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce', device_scale_factor=1)
            page = ctx.new_page()
            for route in ROUTES:
                page.goto(BASE + route, wait_until='load')
                settle(page)
                name = f'{slug(route)}_{width}'
                states = {name: page.evaluate(DUMP_JS)}
                # Estados interativos: menu móvel aberto e dropdown de soluções aberto.
                toggle = page.locator('.menu-toggle')
                if width < 768 and toggle.count() and toggle.first.is_visible():
                    toggle.first.click(); page.wait_for_timeout(200); settle(page)
                    states[name + '_menu'] = page.evaluate(DUMP_JS)
                    page.goto(BASE + route, wait_until='load'); settle(page)
                sol = page.locator('.solutions-toggle')
                if width >= 768 and sol.count() and sol.first.is_visible():
                    sol.first.click(); page.wait_for_timeout(200); settle(page)
                    states[name + '_solucoes'] = page.evaluate(DUMP_JS)
                    page.goto(BASE + route, wait_until='load'); settle(page)
                with gzip.open(out / 'estilos' / f'{name}.json.gz', 'wt', encoding='utf-8') as f:
                    json.dump(states, f)
                if width in SHOT_WIDTHS:
                    page.add_style_tag(content=FREEZE_CSS)
                    page.wait_for_timeout(150)
                    page.screenshot(path=str(out / f'{name}.png'), full_page=True)
                print('ok', name, flush=True)
            ctx.close()
        # Sem prefers-reduced-motion: só transições/animações (o CSS de movimento reduzido as zera na passada acima).
        for width in SHOT_WIDTHS:
            ctx = browser.new_context(viewport={'width': width, 'height': 900}, device_scale_factor=1)
            page = ctx.new_page()
            for route in ROUTES:
                page.goto(BASE + route, wait_until='load')
                page.wait_for_selector('.site-header', timeout=20000)
                page.wait_for_timeout(300)
                data = page.evaluate(DUMP_JS.replace("if (k.startsWith('--')) continue;", "if (!/^(transition|animation)/.test(k)) continue;"))
                with gzip.open(out / 'estilos' / f'movimento_{slug(route)}_{width}.json.gz', 'wt', encoding='utf-8') as f:
                    json.dump({f'movimento_{slug(route)}_{width}': data}, f)
                print('ok movimento', route, width, flush=True)
            ctx.close()
        browser.close()


def compare(a_dir, b_dir):
    from PIL import Image, ImageChops
    a_dir, b_dir = Path(a_dir), Path(b_dir)
    worst = 0.0
    print('== Pixels ==')
    for route in ROUTES:
        for width in SHOT_WIDTHS:
            name = f'{slug(route)}_{width}.png'
            a, b = Image.open(a_dir / name).convert('RGB'), Image.open(b_dir / name).convert('RGB')
            if a.size != b.size:
                print(f'{name}: TAMANHO DIFERENTE {a.size} x {b.size}'); worst = 100; continue
            diff = ImageChops.difference(a, b).convert('L').point(lambda v: 255 if v > 8 else 0)
            pct = 100 * sum(1 for v in diff.getdata() if v) / (a.size[0] * a.size[1])
            worst = max(worst, pct)
            print(f'{name}: {pct:.4f}% {"" if pct < .5 else "<-- INVESTIGAR"}')
    print('== Estilos computados ==')
    total = 0
    for fa in sorted((a_dir / 'estilos').glob('*.json.gz')):
        A = json.load(gzip.open(fa, 'rt', encoding='utf-8'))
        B = json.load(gzip.open(b_dir / 'estilos' / fa.name, 'rt', encoding='utf-8'))
        for state in A:
            sa, sb = A[state], B.get(state, {})
            # <head> e scripts não são renderizados; mudam de posição quando tags são removidas.
            keys = {k for k in set(sa) | set(sb) if not k.startswith('html:0>head') and not k.rsplit('>', 1)[-1].startswith(('script', 'link', 'style'))}
            for k in sorted(keys):
                if sa.get(k) == sb.get(k):
                    continue
                total += 1
                if total > 60:
                    continue
                da = dict(x.split(':', 1) for x in (sa.get(k) or '').split(';') if ':' in x)
                db = dict(x.split(':', 1) for x in (sb.get(k) or '').split(';') if ':' in x)
                d = {p: (da.get(p), db.get(p)) for p in set(da) | set(db) if da.get(p) != db.get(p)}
                print(state, k[-90:], d if (k in sa and k in sb) else ('SÓ ANTES' if k in sa else 'SÓ DEPOIS'))
    print('elementos com estilo diferente:', total)
    return worst, total


if __name__ == '__main__':
    if sys.argv[1] == '--movimento':
        capture(sys.argv[2], only_motion=True)
    elif sys.argv[1] == '--revisao':
        review(sys.argv[2])
    elif sys.argv[1] == '--comparar':
        compare(sys.argv[2], sys.argv[3])
    else:
        capture(sys.argv[1])
