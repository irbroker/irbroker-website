import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import VerticalPage from './pages/VerticalPage';
import { Header, Footer } from './components/SiteLayout';
import { verticals } from './data/content';
import Contents from './pages/Contents';
import NotFound from './pages/NotFound';
import GuidePage from './pages/GuidePage';
import { guides } from './data/guides';

export default function App({ path = '/' }: { path?: string }) {
  const [pathname, search = ''] = path.split('?', 2);
  const normalized = pathname.replace(/\/$/, '') || '/';
  const vertical = verticals.find(item => `/${item.slug}` === normalized);
  const contact = normalized === '/contato';
  const contents = normalized === '/conteudos';
  const guide = guides.find(item => item.slug === normalized);
  const notFound = !(normalized === '/' || normalized === '/sobre' || contact || contents || guide || vertical);
  return <div className={`site ${contact ? 'contact-site' : ''} ${vertical?.bridge ? `site-${vertical.bridge}` : ''}`}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <Header path={normalized} light={!contents && !guide && !notFound} />
    <main id="conteudo" tabIndex={-1}>
      {normalized === '/' ? <Home /> : normalized === '/sobre' ? <About /> : contact ? <Contact /> : contents ? <Contents search={search} /> : guide ? <GuidePage guide={guide} /> : vertical ? <VerticalPage vertical={vertical} /> : <NotFound />}
    </main>
    <Footer path={normalized} />
  </div>;
}
