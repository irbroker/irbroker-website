import { Editorial } from '../components/SiteLayout';

export default function About() {
  return <>
    <section className="typographic-hero about-hero"><div className="wrap"><p className="hero-kicker"><span className="small-rule" />Sobre</p><h1>Mais de 20 anos de mercado segurador na equipe.</h1></div></section>
    <section className="section wrap about-intro"><Editorial label="Quem somos"><p className="large-body">Uma equipe com mais de duas décadas no mercado segurador. Escritórios em São Bernardo do Campo e em São Paulo, na Faria Lima.</p></Editorial></section>
    <section className="about-values"><div className="wrap"><Editorial label="Missão"><p className="large-body">Proteger o patrimônio e a continuidade dos negócios dos nossos clientes com soluções personalizadas em gestão de riscos e seguros corporativos.</p></Editorial><Editorial label="Visão"><p className="large-body">Ser referência nacional em corretagem de seguros corporativos, reconhecida pela excelência técnica e pelo relacionamento consultivo de longo prazo.</p></Editorial></div></section>
  </>;
}
