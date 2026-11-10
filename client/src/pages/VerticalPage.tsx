import { Hero } from '../components/Photography';
import { Button, Editorial } from '../components/SiteLayout';
import { acceptanceNote, type Vertical } from '../data/content';
import { FrontRadar } from '../components/Radar';

export default function VerticalPage({ vertical }: { vertical: Vertical }) {
  const bridge = vertical.bridge;
  const cta = bridge === 'comex' ? 'Falar com a Comex Broker' : bridge === 'wellcare' ? 'Falar com a WellCare' : 'Falar com um especialista';
  return <div className={`vertical-page ${bridge ? `theme-${bridge}` : ''}`}>
    <Hero image={vertical.imageKey} title={vertical.title} label={vertical.name} description={vertical.intro} className="vertical-hero" brand={bridge}><Button href={`/contato?frente=${encodeURIComponent(vertical.name)}`}>{cta}</Button></Hero>
    {vertical.audience.length > 0 && <section className="section wrap"><Editorial label="Para quem é"><ul className="audience-list">{vertical.audience.map(item => <li key={item}>{item}</li>)}</ul></Editorial></section>}
    {vertical.solutions.length > 0 && <section className="section solutions-section"><div className="wrap"><Editorial label="Soluções"><ul className="solution-list">{vertical.solutions.map(solution => <li key={solution}>{solution}</li>)}</ul></Editorial></div></section>}
    <section className="section wrap signals-section"><Editorial label="Sinais de que é hora de revisar"><ul className="signals-list">{vertical.signals.map(signal => <li key={signal}>{signal}</li>)}</ul></Editorial><p className="acceptance-note">{acceptanceNote}</p></section>
    <FrontRadar front={vertical.name} />
  </div>;
}
