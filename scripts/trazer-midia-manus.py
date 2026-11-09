"""Baixa todos os arquivos /manus-storage/* usados no código (da prévia do Manus) para client/public/media/
e troca as referências por /media/<arquivo>. Também baixa as imagens ogSrc (files.manuscdn.com).
Rodar uma vez: python -I scripts/trazer-midia-manus.py <url-da-previa>"""
import re, sys, pathlib, urllib.request
BASE = sys.argv[1].rstrip('/')
RAIZ = pathlib.Path(__file__).resolve().parents[1]
DEST = RAIZ / 'client' / 'public' / 'media'; DEST.mkdir(parents=True, exist_ok=True)
arqs = [p for p in list((RAIZ/'client').rglob('*')) + list((RAIZ/'shared').rglob('*'))
        if p.is_file() and p.suffix in {'.ts','.tsx','.css','.html','.json'} and 'public' not in p.parts]
pad = re.compile(r'/manus-storage/([A-Za-z0-9._-]+)')
cdn = re.compile(r'https://files\.manuscdn\.com/[^\s\'"]+/([A-Za-z0-9]+\.(?:webp|png|jpg|jpeg|mp4|svg))')
def baixa(url, nome):
    alvo = DEST / nome
    if not alvo.exists():
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        alvo.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    return alvo.stat().st_size
total = 0; trocas = 0
for p in arqs:
    s = p.read_text(encoding='utf-8'); novo = s
    for nome in set(pad.findall(s)):
        total += baixa(f'{BASE}/manus-storage/{nome}', nome)
        novo = novo.replace(f'/manus-storage/{nome}', f'/media/{nome}'); trocas += 1
    for m in set(cdn.finditer(novo)):
        url, nome = m.group(0), 'og-' + m.group(1)
        total += baixa(url, nome); novo = novo.replace(url, f'/media/{nome}'); trocas += 1
    if novo != s: p.write_text(novo, encoding='utf-8')
restantes = [str(p) for p in arqs if 'manus-storage' in p.read_text(encoding='utf-8') or 'manuscdn' in p.read_text(encoding='utf-8')]
print('trocas:', trocas, '| arquivos em media:', len(list(DEST.iterdir())), '| MB:', round(total/1e6,1))
print('ainda com referência ao Manus:', restantes)
