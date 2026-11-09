import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { brand } from '../data/media';

export default function ProcessDiagram() {
  const diagram = useRef<HTMLDivElement>(null);
  const seen = useInView(diagram, { once: true, amount: .25 });
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const visible = !mounted || reduced || seen;
  const line = (key: string) => <div className="process-connector" key={key} aria-hidden="true">
    <svg className="process-line-horizontal" viewBox="0 0 100 2" preserveAspectRatio="none"><motion.path d="M0 1H100" fill="none" stroke="currentColor" strokeWidth="1" initial={false} animate={{ pathLength: visible ? 1 : 0 }} transition={{ duration: reduced ? 0 : .6, ease: 'easeOut' }} /></svg>
    <svg className="process-line-vertical" viewBox="0 0 2 100" preserveAspectRatio="none"><motion.path d="M1 0V100" fill="none" stroke="currentColor" strokeWidth="1" initial={false} animate={{ pathLength: visible ? 1 : 0 }} transition={{ duration: reduced ? 0 : .6, ease: 'easeOut' }} /></svg>
  </div>;
  return <div ref={diagram} className="process-diagram" role="group" aria-label="Empresa, irbroker e seguradoras">
    <div className="process-node"><h3>Empresa</h3></div>{line('first')}
    <div className="process-node process-symbol"><img src={brand.symbol} alt="irbroker" width="598" height="698" loading="lazy" /></div>{line('second')}
    <div className="process-node"><h3>Seguradoras</h3></div>
  </div>;
}
