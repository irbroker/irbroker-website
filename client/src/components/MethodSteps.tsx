import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { Editorial } from "./SiteLayout";
import AnimatedHeading from "./AnimatedHeading";

const method = [
  [
    "Entender",
    "Mapeamos a atividade, os contratos e as responsabilidades da empresa antes de falar em produto.",
  ],
  [
    "Comparar",
    "Buscamos alternativas junto às seguradoras e explicamos cada cobertura, para uma decisão informada.",
  ],
  [
    "Acompanhar",
    "Seguimos com o cliente na renovação, nas mudanças da operação e quando houver sinistro.",
  ],
];

const DURACAO = 1.5; // segundos para a linha atravessar os três passos

// Momento autoral do site: quando a seção entra na tela, a linha do método se desenha uma vez
// e acende cada passo ao alcançar o seu nó. Não fixa a rolagem. Sem JS ou com movimento
// reduzido, os três passos aparecem estáticos e plenos.
export default function MethodSteps() {
  const line = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(line, { once: true, amount: 0.6 });
  const drawn = useMotionValue(0);
  // -1 = ainda não começou; 0..2 = passo alcançado; 3 = concluído (todos plenos)
  const [step, setStep] = useState(-1);
  const animated = !reduced;

  useEffect(() => {
    if (!animated || !inView) return;
    const element = line.current;
    const width = element?.offsetWidth || 1;
    const nodes = element
      ? Array.from(element.children)
          .filter(child => child.tagName === "DIV")
          .map(child => (child as HTMLElement).offsetLeft / width)
      : [0, 1 / 3, 2 / 3];
    const controls = animate(drawn, 1, {
      duration: DURACAO,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: value => setStep(nodes.filter(node => value >= node - 0.001).length - 1),
      onComplete: () => setStep(3),
    });
    return () => controls.stop();
  }, [animated, inView, drawn]);

  return (
    <section className={`section method-section${animated ? " method-animated" : ""}`}>
      <div className="wrap">
        <Editorial label="Método" heading={false}>
          <AnimatedHeading>Entender antes de cotar.</AnimatedHeading>
        </Editorial>
        <div ref={line} className="method-line">
          {animated && (
            <motion.span className="method-progress" aria-hidden="true" style={{ scaleX: drawn }} />
          )}
          {method.map(([title, text], index) => (
            <div
              key={title}
              className={
                animated
                  ? step >= 3 || index <= step
                    ? "method-step is-active"
                    : "method-step"
                  : undefined
              }
            >
              <span className="method-node" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
