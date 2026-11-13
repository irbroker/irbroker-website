import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { brand } from '../data/media';

// Peças do símbolo oficial separadas pela cor (mesma tela 598x698): sobrepostas formam o símbolo idêntico.
const PECA_TEAL = '/media/simbolo-peca-teal_840b51db.webp';
const PECA_AMARELA = '/media/simbolo-peca-amarela_875f178e.webp';
const ease = [0.16, 1, 0.3, 1] as const;

// 12/11: sequência a cada entrada na tela: Empresa > linha > o símbolo se monta (peças vindo de lados opostos)
// > linha > Seguradoras > textos. Sem JS ou com movimento reduzido, tudo aparece pronto.
export default function ProcessDiagram({ steps }: { steps: string[][] }) {
  const diagram = useRef<HTMLDivElement>(null);
  const emTela = useInView(diagram, { amount: .35 });
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const anima = mounted && !reduced;
  const on = !anima || emTela;
  const t = (atraso: number, duracao = .6) => ({ duration: anima ? duracao : 0, delay: anima && on ? atraso : 0, ease });
  const aparece = (atraso: number) => ({ initial: false as const, animate: { opacity: on ? 1 : 0, y: on ? 0 : 10 }, transition: t(atraso) });
  const line = (key: string, atraso: number) => <div className="process-connector" key={key} aria-hidden="true">
    <svg className="process-line-horizontal" viewBox="0 0 100 2" preserveAspectRatio="none"><motion.path d="M0 1H100" fill="none" stroke="currentColor" strokeWidth="1" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={t(atraso, .7)} /></svg>
    <svg className="process-line-vertical" viewBox="0 0 2 100" preserveAspectRatio="none"><motion.path d="M1 0V100" fill="none" stroke="currentColor" strokeWidth="1" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={t(atraso, .7)} /></svg>
  </div>;
  // No celular, .process-flow intercala nome e texto (CSS order); no desktop, diagrama e textos ficam em faixas.
  return <div ref={diagram} className="process-flow">
    <div className="process-diagram" role="group" aria-label="Empresa, irbroker e seguradoras">
    <motion.div className="process-node" {...aparece(0)}><h3>Empresa</h3></motion.div>{line('first', .3)}
    <div className="process-node process-symbol">
      {anima
        ? <span className="process-symbol-pecas" role="img" aria-label="irbroker">
            <motion.img src={PECA_TEAL} alt="" width="598" height="698" initial={false} animate={{ x: on ? 0 : -46, y: on ? 0 : -18, opacity: on ? 1 : 0 }} transition={t(.85, .8)} />
            <motion.img src={PECA_AMARELA} alt="" width="598" height="698" initial={false} animate={{ x: on ? 0 : 46, y: on ? 0 : 18, opacity: on ? 1 : 0 }} transition={t(.85, .8)} />
          </span>
        : <img src={brand.symbol} alt="irbroker" width="598" height="698" loading="lazy" />}
    </div>{line('second', 1.5)}
    <motion.div className="process-node" {...aparece(2.05)}><h3>Seguradoras</h3></motion.div>
    </div>
    <motion.div className="process-descriptions" {...aparece(2.3)}>{steps.map(([title, text]) => <p key={title}><span className="sr-only">{title}: </span>{text}</p>)}</motion.div>
  </div>;
}
