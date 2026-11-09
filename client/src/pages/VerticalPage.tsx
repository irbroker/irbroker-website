import { Hero } from '../components/Photography';
import { Editorial } from '../components/SiteLayout';
import { acceptanceNote, verticals, type Vertical } from '../data/content';
import AnimatedHeading from '../components/AnimatedHeading';
import { FrontRadar } from '../components/Radar';

export default function VerticalPage({ vertical }: { vertical: Vertical }) {
  const bridge = vertical.bridge;
  return <div className={`vertical-page ${bridge ? `theme-${bridge}` : ''}`}>
    <Hero image={vertical.imageKey} title={vertical.title} label={vertical.name} description={vertical.intro} className="vertical-hero" brand={bridge} />
    {vertical.audience.length > 0 && <section className="section wrap"><Editorial label="Para quem é"><ul className="audience-list">{vertical.audience.map(item => <li key={item}>{item}</li>)}</ul></Editorial></section>}
    {vertical.solutions.length > 0 && <section className="section solutions-section"><div className="wrap"><Editorial label="Soluções"><ul className="solution-list">{vertical.solutions.map(solution => <li key={solution}>{solution}</li>)}</ul></Editorial></div></section>}
    <section className="section wrap signals-section"><Editorial label="Sinais de que é hora de revisar"><ul className="signals-list">{vertical.signals.map(signal => <li key={signal}>{signal}</li>)}</ul></Editorial><p className="acceptance-note">{acceptanceNote}</p></section>
    <section className="other-fronts"><div className="wrap"><AnimatedHeading>Outras frentes</AnimatedHeading><nav aria-label="Outras frentes">{verticals.filter(item => item.slug !== vertical.slug).map(item => <a key={item.slug} href={`/${item.slug}`}>{item.name}</a>)}</nav></div></section>
    <FrontRadar front={vertical.name} />
  </div>;
}
