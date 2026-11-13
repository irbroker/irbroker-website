import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

// [prefixo, valor, sufixo, legenda] (números confirmados pelo usuário em 11/11)
const numbers = [
  ['', 95, '%', 'taxa de renovação dos clientes'],
  ['+', 50, '', 'contratos de benefícios em vida e saúde'],
  ['+', 20, '', 'seguradoras e resseguradoras parceiras'],
  ['+', 20, '', 'anos de experiência dos profissionais'],
] as const;

// Conta até o valor sempre que a faixa entra na tela (12/11, pedido do usuário). Começa em ~60% do valor
// para nunca mostrar um número "zerado" a quem volta para reler. O HTML gerado já traz o valor final:
// sem JS ou com movimento reduzido, nada se mexe.
function Contador({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visivel = useInView(ref, { amount: 0.6 });
  const reduzido = useReducedMotion();
  const inicio = Math.round(valor * 0.6);
  const [mostrado, setMostrado] = useState(valor);
  const [armado, setArmado] = useState(false);
  useEffect(() => { if (!reduzido) setArmado(true); }, [reduzido]);
  useEffect(() => {
    if (!armado) return;
    if (!visivel) { setMostrado(inicio); return; } // fora da tela: prepara a próxima entrada
    const controle = animate(inicio, valor, { duration: 1.3, ease: [0.33, 1, 0.68, 1], onUpdate: v => setMostrado(Math.round(v)) });
    return () => controle.stop();
  }, [armado, visivel, valor, inicio]);
  return <span ref={ref}>{mostrado}</span>;
}

export default function ProofBand() {
  return <section className="proof-band proof-numbers">
    <div className="wrap">
      <div className="proof-number-row">{numbers.map(([pre, valor, suf, label]) => <div className="proof-number" key={label}>
        <strong aria-label={`${pre}${valor}${suf}`}>{pre && <span className="proof-sinal" aria-hidden="true">{pre}</span>}<span aria-hidden="true"><Contador valor={valor} /></span>{suf && <span className="proof-sinal" aria-hidden="true">{suf}</span>}</strong>
        <p>{label}</p>
      </div>)}</div>
      <p className="proof-data-note">Dados declarados pela irbroker, consolidados de todo o grupo.</p>
    </div>
  </section>;
}
