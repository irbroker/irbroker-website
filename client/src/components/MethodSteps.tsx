import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
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

// Momento autoral do site: no desktop a seção fica fixa enquanto a linha do método se desenha
// com a rolagem e cada passo ganha ênfase quando a linha chega ao seu nó. Sem JS, em telas
// menores ou com movimento reduzido, os três passos ficam estáticos e legíveis.
export default function MethodSteps() {
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const nodes = useRef<number[]>([0, 1 / 3, 2 / 3]);
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [active, setActive] = useState(0);
  const pinned = wide && !reduced;

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 1024px) and (min-height: 680px)"
    );
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = line.current;
    if (!pinned || !element) return;
    // Posição de cada nó como fração da largura da linha (a coluna começa no nó).
    const measure = () => {
      const width = element.offsetWidth || 1;
      nodes.current = Array.from(element.children)
        .filter(child => child.tagName === "DIV")
        .map(child => (child as HTMLElement).offsetLeft / width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [pinned]);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const drawn = useTransform(scrollYProgress, [0.08, 0.88], [0, 1]);
  useMotionValueEvent(drawn, "change", value => {
    const reached = nodes.current.filter(node => value >= node - 0.001).length;
    setActive(Math.max(0, reached - 1));
  });

  return (
    <section
      ref={section}
      className={`section method-section${pinned ? " method-pinned" : ""}`}
    >
      <div className="method-sticky">
        <div className="wrap">
          <Editorial label="Método" heading={false}>
            <AnimatedHeading>Entender antes de cotar.</AnimatedHeading>
          </Editorial>
          <div ref={line} className="method-line">
            {pinned && (
              <motion.span
                className="method-progress"
                aria-hidden="true"
                style={{ scaleX: drawn }}
              />
            )}
            {method.map(([title, text], index) => (
              <div
                key={title}
                className={
                  pinned
                    ? index === active
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
      </div>
    </section>
  );
}
