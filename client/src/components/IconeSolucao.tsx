import type { ReactElement } from 'react';
// Ícones de traço das Soluções (12/11, referência: página de saúde da Bradesco). Desenho próprio, grade 48x48,
// traço 1.5 em currentColor: a cor vem da marca da página (CSS). Decorativos: o título ao lado já diz o que é.
export type NomeIcone =
  | 'navio' | 'caminhao' | 'certificado' | 'saude' | 'dente' | 'familia' | 'previdencia' | 'refeicao'
  | 'garantia' | 'predio' | 'financeiro' | 'balanca' | 'cadeado' | 'chave';

const desenhos: Record<NomeIcone, ReactElement> = {
  navio: <><path d="M6 30h36l-5 9H11z" /><path d="M12 30v-8h24v8M18 22v-6h12v6" /><path d="M4 42c4 0 4-2 8-2s4 2 8 2 4-2 8-2 4 2 8 2 4-2 8-2" /></>,
  caminhao: <><path d="M4 14h24v18H4zM28 20h9l7 7v5H28z" /><circle cx="12" cy="35" r="3.5" /><circle cx="36" cy="35" r="3.5" /></>,
  certificado: <><path d="M10 6h20l8 8v28H10z" /><path d="M30 6v8h8M16 22h16M16 28h10" /><circle cx="31" cy="34" r="4" /><path d="M29 38l-1 6 3-2 3 2-1-6" /></>,
  saude: <><path d="M24 41S7 31 7 18a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 13-17 23-17 23z" /><path d="M24 20v10M19 25h10" /></>,
  dente: <path d="M14 8c-5 0-8 4-8 9 0 6 3 8 4 13 1 6 2 11 5 11 4 0 3-10 9-10s5 10 9 10c3 0 4-5 5-11 1-5 4-7 4-13 0-5-3-9-8-9-4 0-6 2-10 2s-6-2-10-2z" />,
  familia: <><circle cx="16" cy="13" r="5" /><circle cx="33" cy="15" r="4" /><path d="M6 40v-8a10 10 0 0 1 20 0v8M26 40v-6a7 7 0 0 1 14 0v6" /></>,
  previdencia: <><path d="M8 40h32M12 40V26M20 40V20M28 40V24M36 40V14" /><path d="M10 18l10-8 8 6 12-10" /><path d="M34 6h6v6" /></>,
  refeicao: <><circle cx="24" cy="25" r="12" /><circle cx="24" cy="25" r="6" /><path d="M6 8v10a3 3 0 0 0 6 0V8M9 18v24M42 8c-3 2-4 6-4 12h4v22" /></>,
  garantia: <><path d="M24 5l15 6v11c0 10-6 17-15 21-9-4-15-11-15-21V11z" /><path d="M17 24l5 5 9-10" /></>,
  predio: <><path d="M10 42V8h18v34M28 18h10v24M6 42h36" /><path d="M15 14h2M21 14h2M15 21h2M21 21h2M15 28h2M21 28h2M33 25h1M33 32h1M17 42v-6h4v6" /></>,
  financeiro: <><path d="M6 40h36M6 40V8" /><path d="M10 32l9-9 7 6 14-15" /><path d="M33 14h7v7" /></>,
  balanca: <><path d="M24 6v34M14 42h20M10 12h28" /><path d="M10 12l-6 14h12zM38 12l-6 14h12z" /><path d="M4 26a6 4 0 0 0 12 0M32 26a6 4 0 0 0 12 0" /></>,
  cadeado: <><rect x="10" y="21" width="28" height="21" rx="2" /><path d="M16 21v-6a8 8 0 0 1 16 0v6M24 29v6" /></>,
  chave: <><circle cx="15" cy="24" r="8" /><path d="M23 24h19M36 24v6M41 24v4" /></>,
};

export default function IconeSolucao({ nome }: { nome: NomeIcone }) {
  return <svg className="solucao-icone" viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{desenhos[nome]}</svg>;
}
