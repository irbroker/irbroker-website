import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { areaVideos, brand, brandDimensions, media } from '../data/media';
import { verticals } from '../data/content';
import HeroTitle from './HeroTitle';
import AnimatedHeading from './AnimatedHeading';
import HeroVideo from './HeroVideo';
import { Breadcrumb } from './SiteLayout';

export function Hero({ image = 'hero', title, label, description, children, after, className = '', brand: verticalBrand }: { image?: keyof typeof media; title: string; label?: string; description?: string; children?: ReactNode; after?: ReactNode; className?: string; brand?: 'comex' | 'wellcare' }) {
  const comex = verticalBrand === 'comex';
  const home = className.includes('home-hero');
  const areaVideo = !home && !comex && image in areaVideos ? areaVideos[image as keyof typeof areaVideos] : undefined;
  // Com vídeo de área, o pôster do vídeo é a foto de base (celular e movimento reduzido).
  const photo = areaVideo ? { src: areaVideo.poster, width: areaVideo.width, height: areaVideo.height } : media[comex ? 'comexHero' : image];
  return <section className={`photo-hero photo-${image} ${className} ${home || comex || areaVideo ? 'video-hero' : ''} ${verticalBrand ? `brand-${verticalBrand}` : ''}`}>
    <img className="hero-photo" src={photo.src} alt="" aria-hidden="true" width={photo.width} height={photo.height} fetchPriority="high" />
    {(home || comex || areaVideo) && <HeroVideo kind={comex ? 'comex' : areaVideo ? 'area' : 'home'} video={areaVideo} />}
    <div className="hero-shade" aria-hidden="true" />
    <div className="wrap hero-content">
      {!home && label && <Breadcrumb className="hero-kicker" items={[{ label: 'Soluções' }, { label }]} />}
      {verticalBrand && <div className={`bridge-wordmark ${verticalBrand}`}><img className="bridge-logo" src={brand[verticalBrand]} alt={label} width={brandDimensions[verticalBrand].width} height={brandDimensions[verticalBrand].height} /><span className="group-seal">Grupo irbroker</span></div>}
      {home ? <HeroTitle title={title} /> : <h1>{title}</h1>}
      {description && <p className="hero-description">{description}</p>}
      {children && <div className="hero-actions">{children}</div>}
      {after}
    </div>
  </section>;
}

export function Verticals({ compact = false }: { compact?: boolean }) {
  const panels = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const expanded = hovered ?? focused;

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const update = () => { setDesktop(query.matches); setHovered(null); setFocused(null); };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = panels.current;
    if (!element) return;
    const update = () => {
      const items = Array.from(element.querySelectorAll<HTMLElement>('.vertical-panel'));
      const first = items[0]?.offsetLeft || 0;
      let nearest = 0;
      let distance = Infinity;
      items.forEach((item, index) => {
        const delta = Math.abs(item.offsetLeft - first - element.scrollLeft);
        if (delta < distance) { distance = delta; nearest = index; }
      });
      setActive(nearest);
    };
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => { element.removeEventListener('scroll', update); observer.disconnect(); };
  }, []);

  function showPanel(index: number) {
    const element = panels.current;
    const item = element?.querySelectorAll<HTMLElement>('.vertical-panel')[index];
    if (!item || !element) return;
    const first = element.querySelector<HTMLElement>('.vertical-panel')?.offsetLeft || 0;
    element.scrollTo({ left: item.offsetLeft - first, behavior: reduced ? 'auto' : 'smooth' });
  }

  return <section id="verticais" className={`verticals-section ${compact ? 'verticals-compact' : ''}`}>
    <div className="wrap verticals-heading"><AnimatedHeading>Um grupo, quatro especialidades.</AnimatedHeading></div>
    <div ref={panels} id="painel-verticais" className="vertical-panels" role="region" aria-label="Especialidades do Grupo irbroker" tabIndex={0} onMouseLeave={() => setHovered(null)}>
      {verticals.map((vertical, index) => <motion.a className={`vertical-panel panel-${vertical.imageKey} ${vertical.bridge ? `panel-${vertical.bridge}` : ''} ${expanded === index ? 'panel-active' : ''}`} href={`/${vertical.slug}`} key={vertical.slug} aria-label={vertical.name} initial={false} animate={desktop === null ? {} : { flexGrow: desktop ? (expanded === index ? 2.4 : 1) : 0 }} transition={{ duration: reduced ? 0 : .5, ease: 'easeOut' }} onMouseEnter={() => setHovered(index)} onFocus={() => setFocused(index)} onBlur={() => setFocused(null)}>
        <img className="panel-photo" src={media[vertical.imageKey].src} alt="" width={media[vertical.imageKey].width} height={media[vertical.imageKey].height} loading="lazy" />
        <span className="panel-shade" aria-hidden="true" />
        {vertical.bridge && <div className="panel-brand"><img className={`panel-logo ${vertical.bridge}`} src={brand[vertical.bridge]} alt={vertical.name} width={brandDimensions[vertical.bridge].width} height={brandDimensions[vertical.bridge].height} loading="lazy" /><span className="group-seal">Grupo irbroker</span></div>}
        <div className="panel-copy"><h3 className={vertical.bridge ? 'sr-only' : undefined}>{vertical.name}</h3><div className="panel-details" aria-hidden={desktop === true && expanded !== index ? true : undefined}><p>{vertical.tagline}</p><span className="panel-link">Conhecer</span></div></div>
      </motion.a>)}
    </div>
    <div className="vertical-indicator wrap" role="group" aria-label="Escolher especialidade">{verticals.map((vertical, index) => <button key={vertical.slug} type="button" aria-label={vertical.name} aria-controls="painel-verticais" aria-current={active === index ? 'true' : undefined} onClick={() => showPanel(index)}><span aria-hidden="true" /></button>)}</div>
  </section>;
}
