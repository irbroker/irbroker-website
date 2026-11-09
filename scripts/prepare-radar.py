from pathlib import Path
import re
import json

root=Path('/home/ubuntu/irbroker')
source=(root/'assets/round7/RADAR-EDICAO-01.md').read_text()
records=[]
for segment in re.split(r'^## ',source,flags=re.M)[1:]:
    heading=segment.splitlines()[0]
    if not re.match(r'[1-4]\. ',heading):
        continue
    frente=re.sub(r'^\d+\. ','',heading).split(' (vale')[0]
    def field(key):
        match=re.search(r'^- \*\*'+re.escape(key)+r':\*\* (.*)$',segment,re.M)
        assert match,key
        return match.group(1)
    raw_sources=field('Fontes' if frente=='Transporte de cargas' else 'Fonte')
    sources=[]
    for item in raw_sources.split(' · '):
        match=re.search(r'https?://\S+',item)
        assert match,item
        name=item[:match.start()].strip().rstrip(':').rstrip('.').strip()
        sources.append({'nome':name,'url':match.group(0)})
    records.append({'frente':frente,'data':field('Data do fato'),'titulo':field('Título'),'resumo':field('Resumo'),'oQueMuda':field('O que muda para a sua empresa'),'fontes':sources,'botao':field('Botão')})
assert len(records)==4
header='''export type RadarNote = {
  frente: string;
  data: string;
  titulo: string;
  resumo: string;
  oQueMuda: string;
  fontes: { nome: string; url: string }[];
  botao: string;
};

// Only the four supplied, non-pending notes belong to the website.
export const radar: RadarNote[] = '''
footer=''';

function dateKey(data: string) {
  const exact = /^(\\d{2})\\/(\\d{2})\\/(\\d{4})$/.exec(data);
  if (exact) return `${exact[3]}-${exact[2]}-${exact[1]}`;
  // Year-only facts have no invented day or month and follow precise dates.
  return data.slice(0, 4);
}

export const orderedRadar = [...radar].sort((a, b) => dateKey(b.data).localeCompare(dateKey(a.data)));
'''
(root/'client/src/data/radar.ts').write_text(header+json.dumps(records,ensure_ascii=False,indent=2)+footer)
print('4 notas preservadas; pendente excluída; datas anuais sem dia inventado')
