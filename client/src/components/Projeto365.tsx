import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { media } from '../data/media';

// Projeto 365 (12/11): faixa verde-floresta, frase curta em destaque e foto com zoom lento ligado à rolagem.
// Confirmado ativo em 10/11; sem número de árvores e sem falar em compensação de carbono.
export default function Projeto365() {
  const secao = useRef<HTMLElement>(null);
  const reduzido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: secao, offset: ['start end', 'end start'] });
  const escala = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  return <section ref={secao} className="project-section">
    <div className="project-photo">
      <motion.img src={media.forest.src} alt={media.forest.alt} width={media.forest.width} height={media.forest.height} loading="lazy" style={reduzido ? undefined : { scale: escala, y }} />
      <span aria-hidden="true" />
    </div>
    <div className="project-copy">
      <p className="project-label">Projeto 365</p>
      <h2>Uma apólice, uma árvore.</h2>
      <p>Para cada apólice emitida, a irbroker planta uma árvore em nome do cliente.</p>
    </div>
  </section>;
}
