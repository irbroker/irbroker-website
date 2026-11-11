import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { verticals } from '../data/content';
import { guides } from '../data/guides';
import { brand } from '../data/media';

export function Header({ light = true, path = '/' }: { light?: boolean; path?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const guide = path.startsWith('/conteudos/');
  const { scrollY } = useScroll();
  // Progresso de leitura do artigo do guia (decorativo: o tempo de leitura já está no texto).
  const reading = useTransform(scrollY, y => {
    const article = guide && typeof document !== 'undefined' ? document.querySelector<HTMLElement>('article.guide-reading') : null;
    if (!article) return 0;
    const top = article.getBoundingClientRect().top + y;
    const range = article.offsetHeight - window.innerHeight;
    return Math.min(1, Math.max(0, range > 0 ? (y - top) / range : 1));
  });

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    const site = header.current?.closest<HTMLElement>('.site');
    const updateScrolled = () => {
      setHeaderScrolled(window.scrollY >= 80 || (site?.scrollTop ?? 0) >= 80);
    };
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    site?.addEventListener('scroll', updateScrolled, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScrolled);
      site?.removeEventListener('scroll', updateScrolled);
    };
  }, []);

  useEffect(() => {
    const site = header.current?.closest<HTMLElement>('.site');
    const main = site?.querySelector<HTMLElement>('main');
    const footer = site?.querySelector<HTMLElement>('footer');
    const previousOverflow = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = 'hidden';
    site?.classList.toggle('site--menu-open', mobileOpen);
    if (main) main.inert = mobileOpen;
    if (footer) footer.inert = mobileOpen;
    function containFocus(event: KeyboardEvent) {
      if (!mobileOpen || event.key !== 'Tab') return;
      const elements = Array.from(header.current?.querySelectorAll<HTMLElement>('a, button') || []).filter(element => element.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', containFocus);
    return () => {
      site?.classList.remove('site--menu-open');
      document.body.style.overflow = previousOverflow;
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      document.removeEventListener('keydown', containFocus);
    };
  }, [mobileOpen, solutionsOpen]);

  useEffect(() => {
    function dismiss(event: MouseEvent) {
      if (!header.current?.contains(event.target as Node)) {
        setMobileOpen(false);
        setSolutionsOpen(false);
      }
    }
    document.addEventListener('click', dismiss);
    return () => document.removeEventListener('click', dismiss);
  }, []);

  useEffect(() => {
    if (!mobileOpen && !solutionsOpen) return;
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      // O toggle do menu só aparece no celular; no desktop o foco volta para "Soluções".
      const toggle = header.current?.querySelector<HTMLElement>('.menu-toggle');
      const target = mobileOpen && toggle && toggle.getClientRects().length > 0 ? toggle : header.current?.querySelector<HTMLElement>('.solutions-toggle');
      if (header.current?.contains(document.activeElement)) target?.focus();
      setMobileOpen(false);
      setSolutionsOpen(false);
    }
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [mobileOpen, solutionsOpen]);

  const logo = mobileOpen ? brand.light : (headerScrolled ? brand.dark : (light ? brand.light : brand.dark));
  const headerTone = headerScrolled ? 'header-dark' : (light ? 'header-light' : 'header-dark');

  return <header ref={header} className={`site-header ${headerTone} ${headerScrolled ? 'header-scrolled' : ''} ${mobileOpen ? 'menu-open' : ''}`}>
    <div className="header-inner">
      <a className="wordmark" href="/" aria-label="irbroker"><img src={logo} alt="irbroker" width="1594" height="400" /></a>
      <button className="menu-toggle" aria-label="Menu" aria-expanded={mobileOpen} aria-controls="main-navigation" onClick={() => setMobileOpen(!mobileOpen)}>
        <span /><span />
      </button>
      <nav id="main-navigation" aria-label="Navegação principal" className={mobileOpen ? 'nav-open' : ''}>
        <div className="solutions-nav" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSolutionsOpen(false); }}>
          <button className="nav-link solutions-toggle" aria-expanded={solutionsOpen} aria-controls="solutions-navigation" onClick={() => setSolutionsOpen(!solutionsOpen)}>Soluções<span className="chevron" aria-hidden="true" /></button>
          {solutionsOpen && <div id="solutions-navigation" className="solutions-dropdown">
            {verticals.map(vertical => <a key={vertical.slug} href={`/${vertical.slug}`} aria-current={path === `/${vertical.slug}` ? 'page' : undefined}>{vertical.name}</a>)}
          </div>}
        </div>
        <a className="nav-link" href="/sobre" aria-current={path === '/sobre' ? 'page' : undefined}>Sobre</a>
        <a className="nav-link" href="/conteudos" aria-current={path === '/conteudos' || path.startsWith('/conteudos/') ? 'page' : undefined}>Conteúdos</a>
        {/* Contato como link do menu: o botão grande fica só no topo/fim das páginas (sem CTA duplicado, decisão de 11/11). */}
        <a className="nav-link" href="/contato" aria-current={path === '/contato' ? 'page' : undefined}>Contato</a>
      </nav>
    </div>
    {guide && <motion.span className="reading-progress" aria-hidden="true" style={{ scaleX: reading }} />}
  </header>;
}

export function Breadcrumb({ items, className = '' }: { items: { label: string; href?: string }[]; className?: string }) {
  return <nav className={`breadcrumb ${className}`} aria-label="Trilha de navegação"><ol>
    <li><a href="/">Início</a></li>
    {items.map((item, index) => <li key={item.label}>{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : item.href ? <a href={item.href}>{item.label}</a> : item.label}</li>)}
  </ol></nav>;
}

export function Button({ children, href = '/contato', secondary = false }: { children: ReactNode; href?: string; secondary?: boolean }) {
  return <a href={href} className={`button ${secondary ? 'button-outline' : 'button-solid'}`}>{children}</a>;
}

export function Editorial({ label, children, className = '', heading = true }: { label: string; children: ReactNode; className?: string; heading?: boolean }) {
  return <div className={`editorial ${className}`}><div className="editorial-label"><span className="small-rule" />{heading ? <h2 className="editorial-title">{label}</h2> : label}</div><div className="editorial-content">{children}</div></div>;
}

function WhatsAppIcon() {
  return <svg className="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L.08 24l6.28-1.65a11.88 11.88 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.43ZM12.09 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.86 9.86 0 0 1-1.51-5.28C2.22 6.46 6.65 2.03 12.1 2.03c2.64 0 5.12 1.03 6.98 2.9a9.84 9.84 0 0 1 2.89 7c0 5.45-4.43 9.87-9.88 9.87Zm5.42-7.4c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.03-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="currentColor" />
  </svg>;
}

function WhatsAppLink({ floating = false, suppressed = false }: { floating?: boolean; suppressed?: boolean }) {
  const link = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!floating || !link.current || typeof window === 'undefined') return;
    const floatingLink = link.current;
    if (suppressed) {
      floatingLink.hidden = true;
      return;
    }

    const visibility = new Map<Element, boolean>();
    const readingVisibility = new Map<Element, boolean>();
    let intersectionObserver: IntersectionObserver | undefined;
    let readingObserver: IntersectionObserver | undefined;

    const applyVisibility = () => {
      floatingLink.hidden = Array.from(visibility.values()).some(Boolean) || Array.from(readingVisibility.values()).some(Boolean);
    };

    const refreshTargets = () => {
      intersectionObserver?.disconnect();
      readingObserver?.disconnect();
      visibility.clear();
      readingVisibility.clear();
      const targets = Array.from(document.querySelectorAll<HTMLElement>('footer, .home-hero'));
      const viewportBottom = window.innerHeight || document.documentElement.clientHeight;
      targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const visible = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < viewportBottom && getComputedStyle(target).visibility !== 'hidden';
        visibility.set(target, visible);
      });
      targets.forEach(target => intersectionObserver?.observe(target));
      // Em qualquer largura, o botão some enquanto um texto passa pela faixa que ele ocupa.
      {
        const wasHidden = floatingLink.hidden;
        floatingLink.hidden = false;
        const box = floatingLink.getBoundingClientRect();
        floatingLink.hidden = wasHidden;
        const bottom = viewportBottom - box.bottom;
        const left = box.left - 8;
        const bandTop = box.top;
        const texts = Array.from(document.querySelectorAll<HTMLElement>('main p, main li, main h1, main h2, main h3'));
        readingObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => readingVisibility.set(entry.target, entry.isIntersecting && entry.boundingClientRect.right > left));
          applyVisibility();
        }, { root: null, rootMargin: `-${Math.max(0, bandTop)}px 0px -${bottom}px 0px`, threshold: 0 });
        texts.forEach(text => {
          const rect = text.getBoundingClientRect();
          readingVisibility.set(text, rect.bottom > bandTop && rect.top < viewportBottom - bottom && rect.right > left);
          readingObserver?.observe(text);
        });
      }
      applyVisibility();
    };

    intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (visibility.has(entry.target)) visibility.set(entry.target, entry.isIntersecting);
      });
      applyVisibility();
    }, { root: null, rootMargin: '0px', threshold: 0 });

    const mutationObserver = new MutationObserver(refreshTargets);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', refreshTargets, { passive: true });
    refreshTargets();

    return () => {
      intersectionObserver?.disconnect();
      readingObserver?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', refreshTargets);
      floatingLink.hidden = suppressed;
    };
  }, [floating, suppressed]);

  return <a ref={floating ? link : undefined} className={floating ? 'whatsapp-link' : 'button button-outline footer-whatsapp-link'} href="https://wa.me/5541963491818" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp (abre em nova aba)" hidden={suppressed || undefined}><WhatsAppIcon /><span className="whatsapp-label">Falar no WhatsApp</span></a>;
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="17.35" cy="6.75" r="0.85" fill="currentColor" />
  </svg>;
}

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <path d="M7.35 10.35v6.25M7.35 7.45v.02M11.15 16.6v-3.2a2.3 2.3 0 0 1 4.6 0v3.2M11.15 10.35v6.25" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function normalizeSitePath(path: string) {
  const pathname = path.split(/[?#]/, 1)[0] || '/';
  if (pathname === '/') return '/';
  return `/${pathname.replace(/^\/+|\/+$/g, '')}`;
}


export function Footer({ path = '/' }: { path?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const normalizedPath = normalizeSitePath(path);
  const contactPage = normalizedPath === '/contato';
  // Nas páginas de guia, o convite do fechamento aponta para a frente do guia.
  const guideFront = guides.find(guide => guide.slug === normalizedPath)?.frente;
  const footerVertical = verticals.find(vertical => `/${vertical.slug}` === normalizedPath || vertical.name === guideFront);
  const footerCtaLabel = footerVertical
    ? footerVertical.bridge ? `Falar com a ${footerVertical.name}` : `Falar sobre ${footerVertical.name}`
    : 'Falar com um especialista';
  const footerCtaHref = footerVertical ? `/contato?frente=${encodeURIComponent(footerVertical.name)}` : '/contato';

  return <>
    <footer className="site-footer" aria-label="Rodapé">
      <div className="wrap">
        {!contactPage && <div className="footer-editorial-closure footer-grid">
          <h2 className="footer-closure">Vamos conversar sobre a sua empresa.</h2>
          <div className="footer-closure-actions">
            <Button href={footerCtaHref}>{footerCtaLabel}</Button>
            <WhatsAppLink />
          </div>
        </div>}

        <div className="footer-cols footer-grid">
          <div className="footer-col">
            <h2 className="footer-col-title">Escritórios</h2>
            <div className="footer-editorial-address footer-office"><strong>Matriz</strong><p>Rua José Versolato, 101, 12º andar, Torre A, Centro, São Bernardo do Campo/SP, <span className="footer-nowrap">09750-730</span></p></div>
            <div className="footer-editorial-address footer-office"><strong>Filial</strong><p>Av. Presidente Juscelino Kubitschek, 1455, 4º andar, Faria Lima, São Paulo/SP, <span className="footer-nowrap">04543-011</span></p></div>
          </div>
          <nav className="footer-col" aria-labelledby="footer-frentes">
            <h2 className="footer-col-title" id="footer-frentes">Áreas</h2>
            <ul className="footer-list footer-editorial-front-links">{verticals.map(vertical => <li key={vertical.slug}><a className="footer-editorial-link" href={`/${vertical.slug}`}>{vertical.name}</a></li>)}</ul>
          </nav>
          <nav className="footer-col" aria-labelledby="footer-irbroker">
            <h2 className="footer-col-title" id="footer-irbroker">A irbroker</h2>
            <ul className="footer-list">
              <li><a className="footer-editorial-link" href="/sobre">Sobre</a></li>
              <li><a className="footer-editorial-link" href="/conteudos">Conteúdos</a></li>
              <li><a className="footer-editorial-link" href="/contato">Contato</a></li>
              <li><button className="footer-editorial-link footer-policy" type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>Política de privacidade</button></li>
            </ul>
          </nav>
          <div className="footer-col" role="group" aria-labelledby="footer-siga">
            <h2 className="footer-col-title" id="footer-siga">Siga</h2>
            <div className="footer-social">
              <a className="footer-social-link" href="https://www.instagram.com/irbroker_/" target="_blank" rel="noopener" aria-label="irbroker no Instagram (abre em nova aba)"><InstagramIcon /></a>
              <a className="footer-social-link" href="https://br.linkedin.com/company/irbroker" target="_blank" rel="noopener" aria-label="irbroker no LinkedIn (abre em nova aba)"><LinkedInIcon /></a>
            </div>
          </div>
        </div>

        <div className="footer-legal">
          <a href="/" className="footer-editorial-legal-brand" aria-label="irbroker"><img src={brand.light} alt="irbroker" width="1594" height="400" loading="lazy" /></a>
          {/* TODO: acrescentar " · Registro SUSEP <número>" quando o cliente fornecer o número. */}
          <p>© 2026 irbroker · <span className="footer-nowrap">CNPJ 54.769.677/0001-18</span></p>
        </div>
      </div>
    </footer>
    <dialog id="privacy-policy-dialog" className="privacy-dialog" data-lenis-prevent ref={dialog} aria-labelledby="privacy-policy-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className="dialog-close" autoFocus aria-label="Fechar" onClick={() => dialog.current?.close()}>×</button>
      <h2 id="privacy-policy-title">Política de privacidade</h2><p>[A PREENCHER]</p>
    </dialog>
    <WhatsAppLink floating suppressed={contactPage} />
  </>;
}

export default Footer;
