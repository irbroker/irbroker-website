import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { heroVideo, comexVideo } from '../data/media';

export const videoScenes = [
  { start: 0, end: 2.2, name: 'São Paulo', href: '/' },
  { start: 2.2, end: 4.8, name: 'Comex Broker', href: '/comex-broker' },
  { start: 4.8, end: 7.4, name: 'WellCare', href: '/wellcare' },
  { start: 7.4, end: 10, name: 'Transporte de cargas', href: '/transporte-de-cargas' },
  { start: 10, end: 12.6, name: 'Construção e imóveis', href: '/construcao-e-imoveis' },
  { start: 12.6, end: 15.2, name: 'Corporate', href: '/corporate' },
] as const;

export default function HeroVideo({ kind = 'home' }: { kind?: 'home' | 'comex' }) {
  const asset = kind === 'comex' ? comexVideo : heroVideo;
  const [eligible, setEligible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<number | null>(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const enabled = desktop.matches && !reduced.matches;
      if (!enabled) video.current?.pause();
      setEligible(enabled);
      setFailed(false);
      setPaused(false);
      setSceneIndex(0);
      progress.set(0);
    };
    update();
    desktop.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => { desktop.removeEventListener('change', update); reduced.removeEventListener('change', update); };
  }, [progress]);

  useEffect(() => {
    const element = video.current;
    if (!eligible || !element || failed) return;
    const sync = () => {
      const time = element.currentTime;
      const next = videoScenes.findIndex(scene => time >= scene.start && time < scene.end);
      setSceneIndex(next < 0 ? 0 : next);
      const scene = videoScenes[next < 0 ? 0 : next];
      const start = time >= 15.2 ? 15.2 : scene.start;
      const end = time >= 15.2 ? (Number.isFinite(element.duration) ? element.duration : 15.6) : scene.end;
      progress.set(Math.min(1, Math.max(0, (time - start) / Math.max(.01, end - start))));
    };
    const tick = () => { sync(); if (!element.paused) frame.current = requestAnimationFrame(tick); };
    const start = () => { if (frame.current !== null) cancelAnimationFrame(frame.current); tick(); };
    const stop = () => { if (frame.current !== null) cancelAnimationFrame(frame.current); frame.current = null; sync(); };
    element.addEventListener('play', start);
    element.addEventListener('pause', stop);
    element.addEventListener('timeupdate', sync);
    element.addEventListener('seeking', sync);
    element.addEventListener('seeked', sync);
    element.addEventListener('loadedmetadata', sync);
    sync();
    if (!element.paused) start();
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      element.removeEventListener('play', start); element.removeEventListener('pause', stop);
      element.removeEventListener('timeupdate', sync); element.removeEventListener('seeking', sync); element.removeEventListener('seeked', sync); element.removeEventListener('loadedmetadata', sync);
    };
  }, [eligible, failed, progress]);

  if (!eligible || failed) return null;
  const scene = videoScenes[sceneIndex];
  async function togglePlayback() {
    const element = video.current;
    if (!element) return;
    if (element.paused) { try { await element.play(); setPaused(element.paused); } catch { setPaused(true); } }
    else { element.pause(); setPaused(true); }
  }

  return <>
    <video ref={video} className="hero-video" autoPlay muted loop playsInline preload="metadata" poster={asset.poster} src={asset.src} width={asset.width} height={asset.height} aria-hidden="true" tabIndex={-1} onPause={() => setPaused(true)} onPlay={() => setPaused(false)} onError={() => setFailed(true)} />
    <button className="video-toggle sr-only" type="button" aria-label={paused ? 'Retomar vídeo' : 'Pausar vídeo'} onClick={togglePlayback}><span className={paused ? 'video-play-icon' : 'video-pause-icon'} aria-hidden="true">{!paused && <><i /><i /></>}</span></button>
    {kind === 'home' && <div className="video-caption"><p>Grupo irbroker</p>{sceneIndex !== 0 && <div className="video-caption-name"><motion.a key={scene.name} href={scene.href} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3 }}>{scene.name}</motion.a></div>}<div className="video-caption-track" aria-hidden="true"><motion.span style={{ scaleX: progress, transformOrigin: 'left' }} /></div></div>}
  </>;
}
