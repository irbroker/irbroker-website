// Rotina dos indicadores de mercado: busca as fontes abertas e grava client/public/data/indicadores.json.
// O site lê só esse cache. Se uma fonte falhar, mantém o valor anterior do JSON com a data da última coleta.
// Uso: node scripts/indicadores.mjs   (ou: corepack pnpm indicadores)
// Agendamento (no deploy): rodar 1x por dia útil, por ex. 9h e 14h (cron "0 9,14 * * 1-5"), depois publicar o JSON.
import fs from "node:fs/promises";
import path from "node:path";
import { inflateRawSync } from "node:zlib";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "client", "public", "data", "indicadores.json");
const AVISO = "Informativo; não é recomendação.";
const agora = new Date();
const hojeISO = agora.toISOString();

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const mesAno = (ano, mes) => `${MESES[Number(mes) - 1]}/${ano}`; // (2026, 9) -> "set/2026"
const br = (d) => d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
const num = (v) => {
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n)) throw new Error(`valor não numérico: ${v}`);
  return n;
};

async function get(url, tipo = "json", init = {}) {
  let r = await fetch(url, { signal: AbortSignal.timeout(60000), ...init });
  if (r.status === 429) {
    await new Promise((ok) => setTimeout(ok, 15000)); // limite de chamadas: uma nova tentativa
    r = await fetch(url, { signal: AbortSignal.timeout(60000), ...init });
  }
  if (!r.ok) throw new Error(`HTTP ${r.status} em ${url}`);
  if (tipo === "json") return r.json();
  if (tipo === "buffer") return Buffer.from(await r.arrayBuffer());
  return r.text();
}

const ind = (id, verticais, nome, valores, unidade, referencia, fonte, extra = {}) => ({
  id, verticais, nome, valores, unidade, referencia, fonte, coletadoEm: hojeISO, ...extra,
});

// ---------- BCB SGS ----------
const SGS = (c) => `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${c}/dados`;
async function sgsUltimos(codigo, n) {
  // Período em vez de /ultimos (limitado a 20); filtra datas futuras: a série 432 (meta Selic) vem preenchida até o próximo Copom.
  const fmt = (d) => d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const lista = await get(`${SGS(codigo)}?formato=json&dataInicial=${fmt(new Date(agora.getTime() - 500 * 864e5))}&dataFinal=${fmt(agora)}`);
  const ate = Number(agora.toISOString().slice(0, 10).replaceAll("-", ""));
  const chave = (d) => Number(d.split("/").reverse().join(""));
  return lista.filter((x) => chave(x.data) <= ate).sort((a, b) => chave(a.data) - chave(b.data)).slice(-n);
}

async function selic() {
  const [u] = await sgsUltimos(432, 1);
  return [ind("selic-meta", ["construcao", "corporate"], "Selic, meta definida pelo Copom", [{ rotulo: "Meta vigente", valor: num(u.valor) }], "% ao ano",
    `vigente em ${u.data}`, { nome: "Banco Central do Brasil, SGS série 432", url: `${SGS(432)}?formato=json` })];
}

async function igpm() {
  const lista = await sgsUltimos(189, 12);
  assert.equal(lista.length, 12);
  const doze = (lista.reduce((acc, x) => acc * (1 + num(x.valor) / 100), 1) - 1) * 100;
  const u = lista.at(-1);
  const [, mes, ano] = u.data.split("/");
  return [ind("igpm", ["corporate"], "IGP-M", [
    { rotulo: "No mês", valor: num(u.valor) },
    { rotulo: "Em 12 meses (calculado a partir da série mensal)", valor: Number(doze.toFixed(2)) },
  ], "%", mesAno(ano, mes), { nome: "Banco Central do Brasil, SGS série 189", url: `${SGS(189)}?formato=json` })];
}

async function jurosImobiliario() {
  const [mercado] = await sgsUltimos(20772, 1);
  const [reguladas] = await sgsUltimos(20773, 1);
  const [, mes, ano] = mercado.data.split("/");
  return [ind("juros-imobiliario", ["construcao"], "Juros médios do financiamento imobiliário (pessoa física)", [
    { rotulo: "Taxas de mercado", valor: num(mercado.valor) },
    { rotulo: "Taxas reguladas", valor: num(reguladas.valor) },
  ], "% ao ano", mesAno(ano, mes), { nome: "Banco Central do Brasil, SGS séries 20772 e 20773", url: `${SGS(20772)}?formato=json` })];
}

// ---------- BCB Focus (Olinda) ----------
async function focus() {
  const base = "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais";
  const q = new URLSearchParams({
    $top: "40", $orderby: "Data desc", $format: "json", $select: "Indicador,Data,DataReferencia,Mediana",
    $filter: "(Indicador eq 'Selic' or Indicador eq 'IPCA' or Indicador eq 'Câmbio') and baseCalculo eq 0",
  }).toString().replace(/\+/g, "%20"); // o Olinda não aceita "+" como espaço
  const { value } = await get(`${base}?${q}`);
  const data = value[0].Data;
  const ano = agora.getFullYear();
  const anos = [String(ano), String(ano + 1)];
  const def = { Selic: ["focus-selic", "Selic esperada para o fim do ano", "% ao ano"], IPCA: ["focus-ipca", "IPCA esperado no ano", "%"], "Câmbio": ["focus-cambio", "Dólar esperado para o fim do ano", "R$ por US$"] };
  const fonte = { nome: "Banco Central do Brasil, Boletim Focus (mediana)", url: "https://www.bcb.gov.br/publicacoes/focus" };
  return Object.entries(def).map(([chave, [id, nome, unidade]]) => {
    const valores = anos.map((a) => {
      const linha = value.find((v) => v.Indicador === chave && v.Data === data && v.DataReferencia === a);
      if (!linha) throw new Error(`Focus sem ${chave} ${a}`);
      return { rotulo: a, valor: linha.Mediana };
    });
    return ind(id, ["todas"], nome, valores, unidade, `Focus de ${data.split("-").reverse().join("/")}`, fonte);
  });
}

// ---------- BCB PTAX (boletim de fechamento, todas as moedas) ----------
async function ptax() {
  // O yuan não está no serviço PTAX do Olinda; o CSV diário de fechamento traz todas as moedas.
  for (let i = 0; i < 8; i++) {
    const d = new Date(agora.getTime() - i * 864e5);
    const ymd = d.toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" }).replaceAll("-", "");
    const url = `https://www4.bcb.gov.br/Download/fechamento/${ymd}.csv`;
    const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!r.ok) continue;
    const linhas = (await r.text()).trim().split(/\r?\n/).map((l) => l.split(";"));
    const venda = (m) => {
      const l = linhas.find((x) => x[3] === m);
      if (!l) throw new Error(`PTAX sem ${m}`);
      return num(l[5]);
    };
    return [ind("ptax", ["comex"], "PTAX de fechamento (venda)", [
      { rotulo: "Dólar (USD)", valor: venda("USD") },
      { rotulo: "Euro (EUR)", valor: venda("EUR") },
      { rotulo: "Yuan (CNY)", valor: venda("CNY") },
    ], "R$", linhas[0][0], { nome: "Banco Central do Brasil, cotações de fechamento", url: "https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes" })];
  }
  throw new Error("nenhum boletim PTAX nos últimos 8 dias");
}

// ---------- Comex Stat (MDIC) ----------
async function comexStat() {
  const api = "https://api-comexstat.mdic.gov.br";
  const { data: atual } = await get(`${api}/general/dates/updated`);
  const ano = atual.year;
  const mes = atual.monthNumber.padStart(2, "0");
  // Uma consulta por fluxo (mês a mês no ano), com pausa: a API devolve 429 ("tente novamente em 10 s").
  const consulta = async (flow) => {
    await new Promise((r) => setTimeout(r, 11000)); // limite da API: ~1 consulta a cada 10 s
    const body = { flow, monthDetail: true, period: { from: `${ano}-01`, to: `${ano}-${mes}` }, filters: [], details: [], metrics: ["metricFOB"] };
    const j = await get(`${api}/general?language=pt`, "json", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const meses = j.data.list.map((x) => ({ mes: x.monthNumber, fob: num(x.metricFOB) / 1e9 }));
    if (!meses.some((x) => x.mes === mes)) throw new Error(`Comex Stat sem ${ano}-${mes}`);
    return { noMes: meses.find((x) => x.mes === mes).fob, noAno: meses.reduce((a, x) => a + x.fob, 0) };
  };
  const fonte = { nome: "Comex Stat, Ministério do Desenvolvimento, Indústria, Comércio e Serviços", url: "https://comexstat.mdic.gov.br/" };
  const out = [];
  for (const [flow, id, nome] of [["export", "comex-exportacoes", "Exportações brasileiras (FOB)"], ["import", "comex-importacoes", "Importações brasileiras (FOB)"]]) {
    const { noMes, noAno } = await consulta(flow);
    out.push(ind(id, ["comex"], nome, [
      { rotulo: `Em ${mesAno(ano, mes)}`, valor: Number(noMes.toFixed(2)) },
      { rotulo: `Jan a ${MESES[Number(mes) - 1]}/${ano}`, valor: Number(noAno.toFixed(2)) },
    ], "US$ bilhões", mesAno(ano, mes), fonte));
  }
  return out;
}

// ---------- IBGE SIDRA ----------
async function sidra(url) {
  return get(url.replace(/\[/g, "%5B").replace(/\]/g, "%5D"));
}
async function ipca() {
  // Tabela 7060: variável 63 (mensal) e 2265 (12 meses); 315[7169] índice geral, 315[7660] Saúde e cuidados pessoais.
  const j = await sidra("https://servicodados.ibge.gov.br/api/v3/agregados/7060/periodos/-1/variaveis/63|2265?localidades=N1[all]&classificacao=315[7169,7660]");
  const pega = (variavel, cat) => {
    const res = j.find((v) => v.id === variavel).resultados.find((r) => r.classificacoes[0].categoria[cat]);
    const [[periodo, valor]] = Object.entries(res.series[0].serie);
    return { periodo, valor: num(valor) };
  };
  const fonte = { nome: "IBGE, SIDRA tabela 7060 (IPCA)", url: "https://sidra.ibge.gov.br/tabela/7060" };
  const ref = (p) => mesAno(p.slice(0, 4), p.slice(4));
  const g = pega("63", "7169");
  const s = pega("63", "7660");
  return [
    ind("ipca", ["construcao", "corporate"], "IPCA (índice geral)", [
      { rotulo: "No mês", valor: g.valor }, { rotulo: "Em 12 meses", valor: pega("2265", "7169").valor },
    ], "%", ref(g.periodo), fonte),
    ind("ipca-saude", ["wellcare"], "IPCA, grupo Saúde e cuidados pessoais", [
      { rotulo: "No mês", valor: s.valor }, { rotulo: "Em 12 meses", valor: pega("2265", "7660").valor },
    ], "%", ref(s.periodo), fonte),
  ];
}
async function sinapi() {
  // Tabela 2296 (SINAPI), Brasil: 48 custo médio m² (R$), 1198 variação em 12 meses (%).
  const j = await sidra("https://servicodados.ibge.gov.br/api/v3/agregados/2296/periodos/-1/variaveis/48|1198?localidades=N1[all]");
  const v = (id) => Object.entries(j.find((x) => x.id === id).resultados[0].series[0].serie)[0];
  const [periodo, custo] = v("48");
  return [ind("sinapi", ["construcao"], "SINAPI, custo médio da construção por m² (Brasil)", [
    { rotulo: "Custo médio", valor: num(custo), unidade: "R$/m²" },
    { rotulo: "Variação em 12 meses", valor: num(v("1198")[1]), unidade: "%" },
  ], "", mesAno(periodo.slice(0, 4), periodo.slice(4)), { nome: "IBGE, SIDRA tabela 2296 (SINAPI)", url: "https://sidra.ibge.gov.br/tabela/2296" })];
}

// ---------- ANP: diesel S10 por região (planilha semanal) ----------
// shortcut: leitor mínimo de .xlsx (zip + XML) sem dependência; serve para a planilha simples da ANP, não para xlsx genérico.
function unzip(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("zip inválido");
  const total = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = {};
  for (let i = 0; i < total; i++) {
    assert.equal(buf.readUInt32LE(p), 0x02014b50);
    const metodo = buf.readUInt16LE(p + 10), tam = buf.readUInt32LE(p + 20);
    const n = buf.readUInt16LE(p + 28), e = buf.readUInt16LE(p + 30), c = buf.readUInt16LE(p + 32);
    const nome = buf.toString("utf8", p + 46, p + 46 + n);
    const local = buf.readUInt32LE(p + 42);
    const ini = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const dados = buf.subarray(ini, ini + tam);
    files[nome] = () => (metodo === 8 ? inflateRawSync(dados) : dados).toString("utf8");
    p += 46 + n + e + c;
  }
  return files;
}
const xmlTexto = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
function planilha(files, nomeAba) {
  const strings = [...(files["xl/sharedStrings.xml"]?.() ?? "").matchAll(/<si>([\s\S]*?)<\/si>/g)]
    .map((m) => xmlTexto([...m[1].matchAll(/<t[^>]*>([^<]*)<\/t>/g)].map((t) => t[1]).join("")));
  const wb = files["xl/workbook.xml"]();
  const rid = wb.match(new RegExp(`<sheet[^>]*name="${nomeAba}"[^>]*r:id="([^"]+)"`))?.[1];
  const rels = files["xl/_rels/workbook.xml.rels"]();
  const alvo = rels.match(new RegExp(`Id="${rid}"[^>]*Target="([^"]+)"`))?.[1] ?? rels.match(new RegExp(`Target="([^"]+)"[^>]*Id="${rid}"`))?.[1];
  if (!alvo) throw new Error(`aba ${nomeAba} não encontrada`);
  const xml = files[`xl/${alvo.replace(/^\/?xl\//, "")}`]();
  return [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((row) => {
    const cel = {};
    for (const c of row[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const v = c[3]?.match(/<v>([^<]*)<\/v>/)?.[1] ?? c[3]?.match(/<t[^>]*>([^<]*)<\/t>/)?.[1];
      cel[c[1]] = v === undefined ? undefined : /t="s"/.test(c[2]) ? strings[Number(v)] : xmlTexto(v);
    }
    return cel;
  });
}
async function diesel() {
  const pagina = "https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/levantamento-de-precos-de-combustiveis-ultimas-semanas-pesquisadas";
  const html = await get(pagina, "text");
  const url = html.match(/href="([^"]*resumo_semanal_lpc_[^"]+\.xlsx)"/)?.[1];
  if (!url) throw new Error("planilha semanal da ANP não encontrada na página");
  const linhas = planilha(unzip(await get(url, "buffer")), "REGIOES").filter((l) => l.D === "OLEO DIESEL S10");
  if (linhas.length < 5) throw new Error("ANP: menos de 5 regiões com diesel S10");
  const serial = (s) => new Date(Date.UTC(1899, 11, 30) + Number(s) * 864e5).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  const nomeRegiao = { "CENTRO OESTE": "Centro-Oeste", NORDESTE: "Nordeste", NORTE: "Norte", SUDESTE: "Sudeste", SUL: "Sul" };
  return [ind("diesel-s10", ["transporte"], "Diesel S10, preço médio na bomba por região", linhas.map((l) => ({ rotulo: nomeRegiao[l.C] ?? l.C, valor: Number(num(l.G).toFixed(2)) })),
    "R$ por litro", `semana de ${serial(linhas[0].A)} a ${serial(linhas[0].B)}`, { nome: "ANP, Levantamento de Preços de Combustíveis", url: pagina })];
}

// ---------- INMET: avisos ativos e previsão ----------
const INMET_PORTAL = "https://alertas2.inmet.gov.br/";
const UF = { Acre: "AC", Alagoas: "AL", "Amapá": "AP", Amazonas: "AM", Bahia: "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES", "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS", "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR", Pernambuco: "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", "Rondônia": "RO", Roraima: "RR", "Santa Catarina": "SC", "São Paulo": "SP", Sergipe: "SE", Tocantins: "TO" };
async function inmetAvisos() {
  const j = await get("https://apiprevmet3.inmet.gov.br/avisos/ativos");
  const dia = (iso) => iso.slice(0, 10).split("-").reverse().slice(0, 2).join("/");
  // "hoje" e "futuro" repetem avisos que cruzam a meia-noite: remove as duplicatas e ordena pelo início.
  const lista = [...j.hoje, ...j.futuro].sort((a, b) => `${a.data_inicio}${a.hora_inicio}`.localeCompare(`${b.data_inicio}${b.hora_inicio}`));
  const vistos = new Set();
  const avisos = lista.map((a) => ({
    rotulo: `${a.descricao} (${a.severidade.toLowerCase()})`,
    valor: `${a.estados.split(",").map((e) => UF[e.trim()] ?? e.trim()).join(", ")}; de ${dia(a.data_inicio)} ${a.hora_inicio} a ${dia(a.data_fim)} ${a.hora_fim}`,
  })).filter((a) => !vistos.has(a.rotulo + a.valor) && vistos.add(a.rotulo + a.valor));
  return [ind("inmet-avisos", ["transporte", "construcao"], "Avisos meteorológicos ativos e previstos", avisos, "",
    `consulta de ${br(agora)}`, { nome: "INMET, avisos meteorológicos", url: INMET_PORTAL })];
}
// Cidades dos escritórios da irbroker (São Paulo e São Bernardo do Campo); códigos IBGE.
const CIDADES = [["3550308", "São Paulo"], ["3548708", "São Bernardo do Campo"]];
async function inmetPrevisao() {
  const out = [];
  for (const [geo, nome] of CIDADES) {
    const j = await get(`https://apiprevmet3.inmet.gov.br/previsao/${geo}`);
    const dias = Object.entries(j[geo]).slice(0, 3).map(([data, d]) => {
      const p = d.tarde ?? d.manha ?? d;
      const semana = (p.dia_semana ?? "").toLowerCase().replace(/^./, (c) => c.toUpperCase()); // "Terça-Feira" -> "Terça-feira"
      return { rotulo: `${semana} ${data.slice(0, 5)}`.trim(), valor: `${p.resumo}; mín. ${p.temp_min} °C, máx. ${p.temp_max} °C` };
    });
    out.push(ind(`previsao-${geo}`, ["transporte", "construcao"], `Previsão do tempo, ${nome}`, dias, "",
      `consulta de ${br(agora)}`, { nome: "INMET, previsão por município", url: "https://previsao.inmet.gov.br/" }));
  }
  return out;
}

// ---------- InfoDengue (Fiocruz) ----------
async function dengue() {
  const out = [];
  const ano = agora.getFullYear();
  for (const [geo, nome] of CIDADES) {
    const url = `https://info.dengue.mat.br/api/alertcity?geocode=${geo}&disease=dengue&format=json&ew_start=1&ew_end=53&ey_start=${ano}&ey_end=${ano}`;
    const lista = await get(url);
    const u = lista.sort((a, b) => b.SE - a.SE)[0];
    if (!u) throw new Error(`InfoDengue sem dados para ${nome}`);
    // Mostra só contagens; o "nível de alerta" do InfoDengue não é exibido (sem semáforo no site).
    out.push(ind(`dengue-${geo}`, ["wellcare"], `Dengue, ${nome}`, [
      { rotulo: "Casos notificados na semana", valor: u.casos },
      { rotulo: "Casos estimados na semana (InfoDengue)", valor: Math.round(u.casos_est) },
    ], "casos", `semana epidemiológica ${String(u.SE).slice(4)}/${String(u.SE).slice(0, 4)}`,
    { nome: "InfoDengue (Fiocruz e FGV)", url: "https://info.dengue.mat.br/" }));
  }
  return out;
}

const FONTES = { focus, ptax, comexStat, diesel, inmetAvisos, inmetPrevisao, sinapi, ipca, selic, jurosImobiliario, igpm, dengue };

function validar(doc) {
  assert.equal(typeof doc.geradoEm, "string");
  assert.equal(doc.aviso, AVISO);
  assert.ok(Array.isArray(doc.indicadores) && doc.indicadores.length > 0, "sem indicadores");
  const ids = new Set();
  for (const i of doc.indicadores) {
    assert.ok(i.id && !ids.has(i.id), `id inválido ou repetido: ${i.id}`);
    ids.add(i.id);
    assert.ok(Array.isArray(i.verticais) && i.verticais.length, `${i.id}: verticais`);
    assert.ok(i.nome && typeof i.unidade === "string" && i.referencia, `${i.id}: nome/unidade/referência`);
    assert.ok(i.fonte?.nome && /^https:\/\//.test(i.fonte.url), `${i.id}: fonte`);
    assert.ok(!Number.isNaN(Date.parse(i.coletadoEm)), `${i.id}: coletadoEm`);
    assert.ok(Array.isArray(i.valores), `${i.id}: valores`);
    for (const v of i.valores) assert.ok(typeof v.valor === "number" ? Number.isFinite(v.valor) : typeof v.valor === "string", `${i.id}: valor`);
  }
}

let anterior = { indicadores: [] };
try {
  anterior = JSON.parse(await fs.readFile(OUT, "utf8"));
} catch {
  // primeira execução: sem cache anterior
}

const indicadores = [];
const falhas = {};
for (const [nome, fn] of Object.entries(FONTES)) {
  try {
    const novos = await fn();
    indicadores.push(...novos);
    console.log(`ok     ${nome} (${novos.length})`);
  } catch (e) {
    falhas[nome] = e.message;
    // Mantém o último valor salvo desta fonte, com a data da coleta original.
    const velhos = anterior.indicadores.filter((i) => i.origem === nome);
    indicadores.push(...velhos.map((i) => ({ ...i, mantido: true, falhaEm: hojeISO })));
    console.warn(`FALHA  ${nome}: ${e.message} (mantidos ${velhos.length} do cache)`);
  }
  for (const i of indicadores) i.origem ??= nome;
}

const doc = { geradoEm: hojeISO, aviso: AVISO, falhas, indicadores };
validar(doc);
await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, JSON.stringify(doc, null, 1) + "\n", "utf8");
console.log(`${indicadores.length} indicadores gravados em ${path.relative(root, OUT)}; falhas: ${Object.keys(falhas).length}`);
