import { Breadcrumb } from '../components/SiteLayout';
import AnimatedHeading from '../components/AnimatedHeading';
import ProcessDiagram from '../components/ProcessDiagram';
import { media } from '../data/media';

const process = [
  ['Empresa', 'A empresa mostra como a operação funciona: atividade, contratos, frota, equipe e patrimônio.'],
  ['irbroker', 'Leva a operação da sua empresa às seguradoras e traduz as propostas para você decidir.'],
  ['Seguradoras', 'Oferecem os próprios produtos, analisam o risco e emitem a apólice.'],
];

export default function About() {
  return <>
    <section className="photo-hero vertical-hero about-hero photo-about"><img className="hero-photo" src={media.about.src} alt="" aria-hidden="true" width={media.about.width} height={media.about.height} fetchPriority="high" /><div className="hero-shade" aria-hidden="true" /><div className="wrap hero-content"><Breadcrumb className="hero-kicker" items={[{ label: 'Sobre' }]} /><h1>Corretora consultiva de seguros corporativos.</h1></div></section>
    <section className="section wrap about-intro">
      <h2 className="about-title">Quem somos</h2>
      <div className="about-intro-body">
        <p className="large-body">Uma equipe com longa experiência no mercado segurador.</p>
        <ul className="about-offices" aria-label="Escritórios">
          <li><PinIcon /><span><strong>São Bernardo do Campo</strong>Matriz</span></li>
          <li><PinIcon /><span><strong>São Paulo</strong>Faria Lima</span></li>
        </ul>
      </div>
    </section>
    <section className="about-values"><div className="wrap about-values-grid">
      <article><TargetIcon /><h2 className="about-title">Missão</h2><p className="large-body">Proteger o patrimônio e a continuidade dos negócios dos nossos clientes com soluções personalizadas em gestão de riscos e seguros corporativos.</p></article>
      <article><HorizonIcon /><h2 className="about-title">Visão</h2><p className="large-body">Ser referência nacional em corretagem de seguros corporativos, reconhecida pela excelência técnica e pelo relacionamento consultivo de longo prazo.</p></article>
    </div></section>
    <section className="section process-section">
      <div className="wrap"><div className="process-heading"><AnimatedHeading>A seguradora emite a apólice.<br />A irbroker trabalha do seu lado.</AnimatedHeading></div>
        <ProcessDiagram steps={process} />
      </div>
    </section>
  </>;
}

const iconProps = { className: 'about-icon', viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, 'aria-hidden': true, focusable: false } as const;
function PinIcon() {
  return <svg {...iconProps}><path d="M24 43s13-12.4 13-23a13 13 0 0 0-26 0c0 10.6 13 23 13 23Z" /><circle cx="24" cy="20" r="4.5" /></svg>;
}
function TargetIcon() {
  return <svg {...iconProps}><circle cx="24" cy="24" r="18" /><circle cx="24" cy="24" r="10" /><circle cx="24" cy="24" r="2.5" fill="currentColor" /></svg>;
}
function HorizonIcon() {
  return <svg {...iconProps}><path d="M5 34h38M11 34a13 13 0 0 1 26 0" /><path d="M24 9v6M10.5 15.5l4.2 4.2M37.5 15.5l-4.2 4.2" /></svg>;
}
