import { useEffect, useState } from 'react';
import { Button } from '../components/SiteLayout';
import { Hero, Verticals } from '../components/Photography';
import { media } from '../data/media';
import PartnerLogos from '../components/PartnerLogos';
import ProofBand from '../components/ProofBand';
import AnimatedHeading from '../components/AnimatedHeading';
import { HomeRadar } from '../components/Radar';
import MethodSteps from '../components/MethodSteps';

// Cada caso: título, texto, página da área e foto que entra na coluna da esquerda (desktop).
const triggers = [
  ['Carga em uma rota nova', 'Mudanças na rota ou na mercadoria podem mexer nas condições da apólice de transporte.', '/comex-broker', 'Comex Broker', 'port'],
  ['Equipe que cresceu', 'O benefício que servia para dez pessoas pode não servir para cinquenta.', '/wellcare', 'WellCare Broker', 'wellcare'],
  ['Conselho ou investidor que pede D&O', 'O D&O protege o patrimônio pessoal de diretores e conselheiros.', '/corporate', 'Corporate', 'corporate'],
  ['Obra ou locação que exige garantia', 'O seguro garantia e a fiança locatícia substituem caução e fiador, no valor e prazo que o contrato pede.', '/real-estate', 'Real Estate', 'construction'],
] as const;

const SLIDE_MS = 5000;

export default function Home() {
  // Troca de foto só no desktop com movimento; sem JS, no celular ou com movimento reduzido fica a foto do porto.
  const [swap, setSwap] = useState(false);
  const [[active, previous], setPhotos] = useState([0, -1]);
  // A anterior fica opaca por baixo enquanto a nova entra: o fundo nunca aparece no meio da troca.
  const setActive = (index: number) => setPhotos(([current]) => index === current ? [current, -1] : [index, current]);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const update = () => { setSwap(query.matches); setPhotos([0, -1]); };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  // Slide (12/11): a cada 5 s a foto passa ao caso seguinte e o caso fica em destaque na lista.
  // Para enquanto o mouse ou o foco do teclado está no bloco; não roda no celular nem com movimento reduzido.
  const [pausado, setPausado] = useState(false);
  useEffect(() => {
    if (!swap || pausado) return;
    const id = window.setInterval(() => setPhotos(([current]) => [(current + 1) % triggers.length, current]), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [swap, pausado]);
  return <>
    <Hero title="Seguros corporativos começam pela sua operação." description="Corretora consultiva para empresas que precisam proteger patrimônio, operações e pessoas." className="home-hero">
      <Button>Falar com um especialista</Button><Button href="https://wa.me/5541963491818" secondary>Falar no WhatsApp</Button>
    </Hero>
    {/* Ordem testada em 12/11: áreas logo após o topo, Método separa as duas faixas de fotos, números + seguradoras + clientes juntos como prova. */}
    <Verticals />
    <MethodSteps />
    <section className={`triggers-split${swap && !pausado ? ' is-slide' : ''}`} style={{ '--slide-ms': `${SLIDE_MS}ms` } as React.CSSProperties} onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)} onFocus={() => setPausado(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPausado(false); }}>
      <div className="trigger-photo-column"><div className="trigger-photo-sticky"><img src={media.triggers.src} alt={swap ? '' : media.triggers.alt} width={media.triggers.width} height={media.triggers.height} loading="lazy" />
        {swap && triggers.map(([title, , , , key], index) => <img key={key} className={`trigger-photo-swap ${active === index ? 'is-active' : previous === index ? 'is-previous' : ''}`} src={media[key].src} alt="" aria-hidden="true" width={media[key].width} height={media[key].height} />)}
      </div></div>
      <div className="trigger-copy">
        <AnimatedHeading>Quando a operação muda, a apólice precisa mudar junto.</AnimatedHeading>
        <div className="trigger-list">{triggers.map(([title, text, href], index) => <article key={title} className={swap && active === index ? 'is-active' : undefined} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}>{swap && active === index && <span key={`tempo-${active}`} className="trigger-tempo" aria-hidden="true" />}<h3><a className="trigger-link" href={href}>{title}</a></h3><p>{text}</p></article>)}</div>
      </div>
    </section>
    <ProofBand />
    <PartnerLogos />
    <section className="project-section"><div className="project-photo"><img src={media.forest.src} alt={media.forest.alt} width={media.forest.width} height={media.forest.height} loading="lazy" /><span aria-hidden="true" /></div><div className="project-copy"><AnimatedHeading>Projeto 365</AnimatedHeading><p>Para cada apólice emitida, a irbroker planta uma árvore em nome do cliente.</p></div></section>
    <HomeRadar />
  </>;
}
