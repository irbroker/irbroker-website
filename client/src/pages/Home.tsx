import { Button, Editorial } from '../components/SiteLayout';
import { Hero, Verticals } from '../components/Photography';
import { media } from '../data/media';
import PartnerLogos from '../components/PartnerLogos';
import ProofBand from '../components/ProofBand';
import AnimatedHeading from '../components/AnimatedHeading';
import ProcessDiagram from '../components/ProcessDiagram';
import { HomeRadar } from '../components/Radar';

const triggers = [
  ['Nova rota, nova carga ou nova frota', 'Mudanças na operação podem mexer nas condições da apólice.'],
  ['Contrato ou edital que exige garantia', 'A garantia certa depende do que o contrato pede.'],
  ['Conselho ou investidor que pede D&O', 'Os gestores passam a precisar de proteção própria.'],
  ['Equipe que cresceu', 'O benefício que servia para dez pessoas pode não servir para cinquenta.'],
];
const process = [
  ['Empresa', 'A empresa mostra como a operação funciona: atividade, contratos, frota, equipe e patrimônio.'],
  ['irbroker', 'Entende a operação, compara alternativas entre seguradoras, explica cada cobertura e acompanha o cliente depois da contratação.'],
  ['Seguradoras', 'Oferecem os próprios produtos, analisam o risco e emitem a apólice.'],
];
const method = [
  ['Entender', 'Mapeamos a atividade, os contratos e as responsabilidades da empresa antes de falar em produto.'],
  ['Comparar', 'Buscamos alternativas junto às seguradoras e explicamos cada cobertura, para uma decisão informada.'],
  ['Acompanhar', 'Seguimos com o cliente na renovação, nas mudanças da operação e quando houver sinistro.'],
];

export default function Home() {
  return <>
    <Hero title="Seguros corporativos começam pela sua operação." label="Grupo irbroker" description="Corretora consultiva para empresas que precisam proteger patrimônio, operações e pessoas." className="home-hero">
      <Button>Falar com um especialista</Button><Button href="https://wa.me/5541963491818" secondary>Falar no WhatsApp</Button>
    </Hero>
    <ProofBand />
    <section className="triggers-split">
      <div className="trigger-photo-column"><div className="trigger-photo-sticky"><img src={media.triggers.src} alt={media.triggers.alt} width={media.triggers.width} height={media.triggers.height} loading="lazy" /></div></div>
      <div className="trigger-copy"><p className="section-label"><span className="small-rule" />Quando revisar</p>
        <AnimatedHeading>A operação muda.<br />A apólice nem sempre acompanha.</AnimatedHeading>
        <p className="section-intro">Estes são os momentos em que vale rever a proteção com a corretora:</p>
        <div className="trigger-list">{triggers.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>
    <section className="section process-section">
      <div className="wrap"><div className="process-heading"><p className="section-label"><span className="small-rule" />Como trabalhamos</p><AnimatedHeading>A seguradora emite a apólice.<br />A irbroker trabalha do seu lado.</AnimatedHeading></div>
        <ProcessDiagram />
        <div className="process-descriptions">{process.map(([title, text]) => <p key={title}><span className="sr-only">{title}: </span>{text}</p>)}</div>
      </div>
    </section>
    <section className="section method-section"><div className="wrap"><Editorial label="Método" heading={false}><AnimatedHeading>Entender antes de cotar.</AnimatedHeading></Editorial><div className="method-line">{method.map(([title, text]) => <div key={title}><span className="method-node" aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
    <Verticals />
    <PartnerLogos />
    <section className="project-section"><div className="project-photo"><img src={media.forest.src} alt={media.forest.alt} width={media.forest.width} height={media.forest.height} loading="lazy" /><span aria-hidden="true" /></div><div className="project-copy"><p className="section-label"><span className="small-rule" />Projeto 365</p><AnimatedHeading>Cada apólice,<br />uma nova árvore.</AnimatedHeading><p>Para cada apólice emitida, a irbroker planta uma árvore em nome do cliente.</p></div></section>
    <HomeRadar />
  </>;
}
