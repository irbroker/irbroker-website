import { Breadcrumb, Editorial } from '../components/SiteLayout';
import MethodSteps from '../components/MethodSteps';
import { media } from '../data/media';

export default function About() {
  return <>
    <section className="photo-hero vertical-hero about-hero photo-about"><img className="hero-photo" src={media.about.src} alt="" aria-hidden="true" width={media.about.width} height={media.about.height} fetchPriority="high" /><div className="hero-shade" aria-hidden="true" /><div className="wrap hero-content"><Breadcrumb className="hero-kicker" items={[{ label: 'Sobre' }]} /><h1>Corretora consultiva de seguros corporativos.</h1><p className="hero-description">Escritórios em São Bernardo do Campo e na Faria Lima, em São Paulo.</p></div></section>
    <section className="section wrap about-intro"><Editorial label="Quem somos"><p className="large-body">Uma equipe com longa experiência no mercado segurador, com escritórios em São Bernardo do Campo e em São Paulo, na Faria Lima.</p></Editorial></section>
    <section className="about-values"><div className="wrap"><Editorial label="Missão"><p className="large-body">Proteger o patrimônio e a continuidade dos negócios dos nossos clientes com soluções personalizadas em gestão de riscos e seguros corporativos.</p></Editorial><Editorial label="Visão"><p className="large-body">Ser referência nacional em corretagem de seguros corporativos, reconhecida pela excelência técnica e pelo relacionamento consultivo de longo prazo.</p></Editorial></div></section>
    <MethodSteps />
  </>;
}
