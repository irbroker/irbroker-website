# Auditoria do site irbroker — 09/11/2026

Método: skill impeccable (audit, 5 dimensões) + detector mecânico + agentes a11y-architect e seo-specialist + build de produção. Só leitura; nenhum arquivo do site foi alterado nesta etapa.

## Nota

| # | Dimensão | Nota | Principal achado |
|---|---|---|---|
| 1 | Acessibilidade | 3/4 | Base boa (skip link, landmarks, modal nativo, menu com trap de foco); 7 falhas AA pontuais |
| 2 | Desempenho | 2/4 | JS de 402 KB (125 KB gzip) por causa do template; 13 CSS e 5 famílias de fonte bloqueando a renderização |
| 3 | Tokens / cores | 2/4 | Tokens existem, mas ~25 hex soltos e cinzas fora da paleta |
| 4 | Responsivo | 3/4 | Funciona no celular; indicador do carrossel e rolagem interna a revisar |
| 5 | Integridade | 2/4 | CSS empilhado por rodada, dois rodapés ativos, código de template sem uso, domínio de prévia no SEO |
| | **Total** | **12/20** | **Aceitável: precisa de trabalho antes de publicar** |

## P0 — bloqueia a publicação (SEO)
1. Sitemap, JSON-LD e `site-origin.ts` com o domínio de prévia do Manus. Build sem `PUBLIC_SITE_URL` gera `robots.txt` com `Disallow: /` e páginas sem canonical.
2. Imagens de compartilhamento (og:image) com caminho relativo e em .webp: não aparecem no LinkedIn/WhatsApp. Gerar JPG 1200x630 e URL absoluta.

## P1 — corrigir antes de publicar
3. Esc no menu desktop manda o foco para um botão invisível (`SiteLayout.tsx:68`).
4. Legenda do vídeo é recriada a cada cena (`HeroVideo.tsx:84`): perde o foco do teclado e o clique.
5. Pausa do vídeo invisível para quem usa mouse: não atende WCAG 2.2.2 (nível A). Decisão do usuário pendente.
6. Foco das opções de frente no contato com 2,29:1 (`contact-round8.css:229`).
7. Bordas dos campos do formulário com 2,72:1 (`contact-round8.css:168, 213`).
8. Indicador do carrossel no celular com 1,60:1 (`round3.css:63`).
9. JSON-LD sem `sameAs` (Instagram, LinkedIn), `logo`, `Article` nos guias e `BreadcrumbList`.
10. Títulos e descriptions genéricos ("irbroker | Frente", "Vamos conversar sobre a sua empresa."): sem intenção de busca nem região.
11. Script `/api/platform/config.js` e `__manus__/debug-collector.js` da plataforma Manus em produção (404).

## P2
12. 404 inexistente (rota desconhecida mostra só um link); `NotFound.tsx` não usado.
13. Erros do formulário não ligados a cada campo (`aria-invalid`/`aria-describedby`); sem aviso "todos os campos são obrigatórios".
14. ~33 logos focáveis por teclado sem função (`PartnerLogos.tsx:15`); alt "Logo Seguros" (seguradora 14 sem nome).
15. Fotos de fundo dos topos com alt descritivo (deveriam ser decorativas, `alt=""`).
16. `aria-label` em elementos sem role (Home.tsx:44, ProcessDiagram, Photography, SiteLayout:261).
17. Seções das páginas das frentes sem heading; h1 do contato dentro de `<aside>`.
18. CSS: 13 arquivos (2.464 linhas), dois rodapés completos (round6 + round8), regras sobrescritas em cascata.
19. Código morto: AIChatBox, DashboardLayout, ManusDialog, ComponentShowcase (1.437 linhas), 53 componentes ui, servidor tRPC/Drizzle/S3, framer-motion + motion.
20. "[A PREENCHER]" (SUSEP e política) visíveis.

## P3
Botão fechar do diálogo 34px; links externos sem aviso de nova aba; "Ver no mapa" repetido; dropdown não fecha ao perder foco; `.data-note` morto com 1,94:1; textos de 12px.

## O que está bem feito
Skip link, `lang="pt-BR"`, landmarks completos, um h1 por página, dropdown e menu mobile acessíveis (aria-expanded, trap, Esc), painéis que abrem no foco, formulário com fieldset/legend e honeypot correto, diálogo nativo, `prefers-reduced-motion` respeitado, SSG gerando HTML real por rota, detector sem padrões de "cara de IA" (só Montserrat, que é da marca Comex).

## Plano de correção (ordem)
1. Limpeza estrutural (distill/harden): remover template e scripts do Manus, enxugar dependências, consolidar o CSS em um sistema de tokens.
2. SEO P0/P1: domínio, robots, canonical, OG em JPG absoluto, JSON-LD completo, títulos e descriptions por intenção.
3. Acessibilidade P1/P2.
4. Tokens de cor (eliminar hex soltos).
5. Polish + verificação: desktop e celular, contraste medido sobre o vídeo, detector, revisão final pelo agente impeccable-finish-reviewer.
