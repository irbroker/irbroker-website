import { Breadcrumb } from '../components/SiteLayout';
import AnimatedHeading from '../components/AnimatedHeading';
import ProcessDiagram from '../components/ProcessDiagram';
import { media } from '../data/media';
import { verticals } from '../data/content';

// Quem somos (11/11): o que cada área atende, conforme a direção de 11/11/2026.
const escopo: Record<string, string> = {
  'real-estate': 'Mercado imobiliário: garantias, patrimônio e responsabilidades.',
  corporate: 'Mercado corporativo: garantias, patrimônio, linhas financeiras e responsabilidade dos gestores.',
  'comex-broker': 'Seguro de transporte de cargas, internacional e nacional.',
  wellcare: 'Saúde e benefícios para empresas e pessoas.',
};

const process = [
  ['Empresa', 'A empresa mostra como a operação funciona: atividade, contratos, frota, equipe e patrimônio.'],
  ['irbroker', 'Leva a operação da sua empresa às seguradoras e traduz as propostas para você decidir.'],
  ['Seguradoras', 'Oferecem os próprios produtos, analisam o risco e emitem a apólice.'],
];

export default function About() {
  return <>
    <section className="photo-hero vertical-hero about-hero photo-about"><img className="hero-photo" src={media.about.src} alt="" aria-hidden="true" width={media.about.width} height={media.about.height} fetchPriority="high" /><div className="hero-shade" aria-hidden="true" /><p className="photo-credit">Foto: <a href="https://commons.wikimedia.org/wiki/File:Avenida_Brigadeiro_Faria_Lima6.jpg" target="_blank" rel="noopener noreferrer">Agent010</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a></p><div className="wrap hero-content"><Breadcrumb className="hero-kicker" items={[{ label: 'Sobre' }]} /><h1>Corretora consultiva de seguros e benefícios para empresas.</h1></div></section>
    <section className="section wrap about-intro">
      <h2 className="about-title">Quem somos</h2>
      <div className="about-intro-body">
        <p className="large-body">A irbroker é uma corretora de seguros para empresas, com profissionais de mais de 20 anos de mercado e mais de 20 seguradoras e resseguradoras parceiras. O Grupo irbroker reúne a irbroker, com as frentes Real Estate e Corporate, e as empresas Comex Broker e WellCare Broker:</p>
        <ul className="about-areas" aria-label="Empresas e frentes do Grupo irbroker">
          {verticals.map(v => <li key={v.slug}><a href={`/${v.slug}`}><strong>{v.name}</strong><span>{escopo[v.slug]}</span></a></li>)}
        </ul>
        <ul className="about-offices" aria-label="Escritórios">
          <li><PinIcon /><span><strong>São Bernardo do Campo</strong>Matriz</span></li>
          <li><PinIcon /><span><strong>São Paulo</strong>Faria Lima</span></li>
        </ul>
      </div>
    </section>
    {/* Missão e visão em faixa escura, frase grande, sem ícones (12/11). Texto refeito em 12/11 a partir do conteúdo do site, sem citar sinistro (pedido do usuário). */}
    <section className="about-values"><div className="wrap about-values-grid">
      <article><h2 className="about-values-label">Missão</h2><p className="about-values-text">Entender a operação de cada empresa antes de propor um seguro e acompanhá-la em todas as etapas da relação, protegendo patrimônio, operações e pessoas.</p></article>
      <article><h2 className="about-values-label">Visão</h2><p className="about-values-text">Ser a referência das empresas que buscam um especialista em cada frente: transporte de cargas, benefícios, riscos corporativos e mercado imobiliário.</p></article>
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
