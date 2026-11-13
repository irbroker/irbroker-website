import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { brand } from '../data/media';

// Peças do símbolo oficial separadas pela cor (mesma tela 598x698): sobrepostas formam o símbolo idêntico.
const PECA_TEAL = '/media/simbolo-peca-teal_840b51db.webp';
const PECA_AMARELA = '/media/simbolo-peca-amarela_875f178e.webp';

// 12/11 (v2, pedido "mais perceptível"): a animação acompanha a rolagem. Conforme o diagrama sobe até o meio
// da tela, Empresa aparece, a linha se desenha, as peças vêm de longe e se encaixam, a segunda linha se desenha
// e Seguradoras aparece; rolando para cima, tudo volta. Sem JS ou com movimento reduzido, aparece pronto.
function Linha({ progresso }: { progresso: MotionValue<number> }) {
  return <div className="process-connector" aria-hidden="true">
    <svg className="process-line-horizontal" viewBox="0 0 100 2" preserveAspectRatio="none"><motion.path d="M0 1H100" fill="none" stroke="currentColor" strokeWidth="1" style={{ pathLength: progresso }} /></svg>
    <svg className="process-line-vertical" viewBox="0 0 2 100" preserveAspectRatio="none"><motion.path d="M1 0V100" fill="none" stroke="currentColor" strokeWidth="1" style={{ pathLength: progresso }} /></svg>
  </div>;
}

export default function ProcessDiagram({ steps }: { steps: string[][] }) {
  const diagram = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // No celular a página rola dentro de .site; no computador, na janela.
    const site = diagram.current?.closest<HTMLElement>('.site');
    setContainer(site && getComputedStyle(site).overflowY === 'auto' && site.scrollHeight > site.clientHeight ? site : null);
    setMounted(true);
  }, []);
  const anima = mounted && !reduced;
  const { scrollYProgress } = useScroll({ target: diagram, container: container ? { current: container } : undefined, offset: ['start 0.95', 'center 0.5'] });
  const faixa = (a: number, b: number) => useTransform(scrollYProgress, [a, b], [0, 1], { clamp: true });
  const pEmpresa = faixa(0, .18), pLinha1 = faixa(.12, .38), pPecas = faixa(.3, .72), pLinha2 = faixa(.64, .86), pFim = faixa(.8, 1);
  const tealX = useTransform(pPecas, [0, 1], [-140, 0]), tealY = useTransform(pPecas, [0, 1], [-60, 0]), tealR = useTransform(pPecas, [0, 1], [-25, 0]);
  const amarX = useTransform(pPecas, [0, 1], [140, 0]), amarY = useTransform(pPecas, [0, 1], [60, 0]), amarR = useTransform(pPecas, [0, 1], [25, 0]);
  const subida = (p: MotionValue<number>) => ({ opacity: p, y: useTransform(p, [0, 1], [16, 0]) });
  const sEmpresa = subida(pEmpresa), sFim = subida(pFim);
  const um = useTransform(scrollYProgress, () => 1);
  // No celular, .process-flow intercala nome e texto (CSS order); no desktop, diagrama e textos ficam em faixas.
  return <div ref={diagram} className="process-flow">
    <div className="process-diagram" role="group" aria-label="Empresa, irbroker e seguradoras">
    <motion.div className="process-node" style={anima ? sEmpresa : undefined}><h3>Empresa</h3></motion.div>
    <Linha progresso={anima ? pLinha1 : um} />
    <div className="process-node process-symbol">
      {anima
        ? <span className="process-symbol-pecas" role="img" aria-label="irbroker">
            <motion.img src={PECA_TEAL} alt="" width="598" height="698" style={{ x: tealX, y: tealY, rotate: tealR, opacity: pPecas }} />
            <motion.img src={PECA_AMARELA} alt="" width="598" height="698" style={{ x: amarX, y: amarY, rotate: amarR, opacity: pPecas }} />
          </span>
        : <img src={brand.symbol} alt="irbroker" width="598" height="698" loading="lazy" />}
    </div>
    <Linha progresso={anima ? pLinha2 : um} />
    <motion.div className="process-node" style={anima ? sFim : undefined}><h3>Seguradoras</h3></motion.div>
    </div>
    <motion.div className="process-descriptions" style={anima ? { opacity: pFim } : undefined}>{steps.map(([title, text]) => <p key={title}><span className="sr-only">{title}: </span>{text}</p>)}</motion.div>
  </div>;
}
