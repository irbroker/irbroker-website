import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function HeroTitle({ title }: { title: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [reveal, setReveal] = useState(true);
  const reduced = useReducedMotion();
  const measured = useRef(false);

  useEffect(() => {
    const element = heading.current;
    if (!element) return;
    let lastWidth = 0;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const width = element.getBoundingClientRect().width;
      if (!width || Math.abs(width - lastWidth) < .5) return;
      lastWidth = width;
      const style = getComputedStyle(element);
      const copy = document.createElement('span');
      copy.setAttribute('aria-hidden', 'true');
      Object.assign(copy.style, { position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: `${width}px`, left: '-10000px', top: '0', fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, wordSpacing: style.wordSpacing });
      const words = title.split(' ');
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        copy.append(span);
        if (index < words.length - 1) copy.append(document.createTextNode(' '));
      });
      document.body.append(copy);
      const grouped: string[][] = [];
      let previous = -Infinity;
      Array.from(copy.children).forEach((word, index) => {
        const top = word.getBoundingClientRect().top;
        if (Math.abs(top - previous) > 1) grouped.push([]);
        grouped[grouped.length - 1].push(words[index]);
        previous = top;
      });
      copy.remove();
      if (measured.current) setReveal(false);
      measured.current = true;
      setLines(grouped.map(line => line.join(' ')));
    };
    const observer = new ResizeObserver(() => { if (document.fonts.status === 'loaded') measure(); });
    observer.observe(element);
    document.fonts.ready.then(measure);
    return () => { disposed = true; observer.disconnect(); };
  }, [title]);

  return <h1 ref={heading} className="hero-title" aria-label={title}>{lines.length ? lines.map((line, index) => <span className="hero-title-mask" key={`${index}-${line}`} aria-hidden="true"><motion.span className="hero-title-line" initial={reveal && !reduced ? { y: '105%' } : false} animate={{ y: 0 }} transition={{ duration: reduced || !reveal ? 0 : .6, delay: reduced || !reveal ? 0 : index * .08, ease: 'easeOut' }}>{line}{index < lines.length - 1 ? ' ' : ''}</motion.span></span>) : title}</h1>;
}
