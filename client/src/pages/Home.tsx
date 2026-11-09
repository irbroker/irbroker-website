import { Button, Editorial } from '../components/SiteLayout';
import { Hero, Verticals } from '../components/Photography';
import { media } from '../data/media';
import PartnerLogos from '../components/PartnerLogos';
import ProofBand from '../components/ProofBand';
import AnimatedHeading from '../components/AnimatedHeading';
import ProcessDiagram from '../components/ProcessDiagram';
import { HomeRadar } from '../components/Radar';
import MethodSteps from '../components/MethodSteps';

const triggers = [
  ['Nova rota, nova carga ou nova frota', 'Mudanças na operação podem mexer nas condições da apólice.'],
  ['Contrato ou edital que exige garantia', 'Seguro garantia substitui fiança e caução, no valor e prazo que o contrato pede.'],
  ['Conselho ou investidor que pede D&O', 'O D&O protege o patrimônio pessoal de diretores e conselheiros.'],
  ['Equipe que cresceu', 'O benefício que servia para dez pessoas pode não servir para cinquenta.'],
];
const process = [
  ['Empresa', 'A empresa mostra como a operação funciona: atividade, contratos, frota, equipe e patrimônio.'],
  ['irbroker', 'Leva a operação da sua empresa às seguradoras e traduz as propostas para você decidir.'],
  ['Seguradoras', 'Oferecem os próprios produtos, analisam o risco e emitem a apólice.'],
];

export default function Home() {
  return <>
    <Hero title="Seguros corporativos começam pela sua operação." description="Corretora consultiva para empresas que precisam proteger patrimônio, operações e pessoas." className="home-hero">
      <Button>Falar com um especialista</Button><Button href="https://wa.me/5541963491818" secondary>Falar no WhatsApp</Button>
    </Hero>
    <ProofBand />
    <section className="triggers-split">
      <div className="trigger-photo-column"><div className="trigger-photo-sticky"><img src={media.triggers.src} alt={media.triggers.alt} width={media.triggers.width} height={media.triggers.height} loading="lazy" /></div></div>
      <div className="trigger-copy"><p className="section-label"><span className="small-rule" />Quando revisar</p>
        <AnimatedHeading>Quando a operação muda, a apólice precisa mudar junto.</AnimatedHeading>
        <div className="trigger-list">{triggers.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>
    <section className="section process-section">
      <div className="wrap"><div className="process-heading"><p className="section-label"><span className="small-rule" />Como trabalhamos</p><AnimatedHeading>A seguradora emite a apólice.<br />A irbroker trabalha do seu lado.</AnimatedHeading></div>
        <ProcessDiagram steps={process} />
      </div>
    </section>
    <MethodSteps />
    <Verticals />
    <PartnerLogos />
    <section className="project-section"><div className="project-photo"><img src={media.forest.src} alt={media.forest.alt} width={media.forest.width} height={media.forest.height} loading="lazy" /><span aria-hidden="true" /></div><div className="project-copy"><AnimatedHeading>Projeto 365</AnimatedHeading><p>Para cada apólice emitida, a irbroker planta uma árvore em nome do cliente.</p></div></section>
    <HomeRadar />
  </>;
}
