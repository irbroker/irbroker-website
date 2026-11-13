// JSON-LD de cada rota. Montado no build (client/src/ssg.tsx) e injetado no <head> por scripts/ssg.mjs,
// para usar a mesma origem do canonical e não depender da hidratação.
import { brand } from "../data/media";
import { guides } from "../data/guides";
import { routes, verticals } from "../data/content";

const PUBLISHED = "2026-11-09";

export function structuredData(path: string, origin: string, image: string) {
  const abs = (value: string) => new URL(value, `${origin}/`).href;
  const orgId = `${origin}/#organizacao`;
  const organization = {
    "@type": "InsuranceAgency",
    "@id": orgId,
    name: "irbroker",
    url: `${origin}/`,
    logo: abs(brand.dark),
    image: abs(brand.dark),
    email: "comercial@irbroker.com.br",
    areaServed: { "@type": "Country", name: "Brasil" },
    sameAs: [
      "https://www.instagram.com/irbroker_/",
      "https://www.linkedin.com/company/irbroker/",
    ],
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Rua José Versolato, 101, 12º andar, Torre A, Centro",
        addressLocality: "São Bernardo do Campo",
        addressRegion: "SP",
        postalCode: "09750-730",
        addressCountry: "BR",
      },
      {
        "@type": "PostalAddress",
        streetAddress:
          "Av. Presidente Juscelino Kubitschek, 1455, 4º andar, Faria Lima",
        addressLocality: "São Paulo",
        addressRegion: "SP",
        postalCode: "04543-011",
        addressCountry: "BR",
      },
    ],
  };
  const graph: object[] = [organization];
  if (path === "/")
    return { "@context": "https://schema.org", "@graph": graph };

  const guide = guides.find(item => item.slug === path);
  const trail = [{ name: "Início", path: "/" }];
  if (guide) trail.push({ name: "Conteúdos", path: "/conteudos" });
  trail.push({
    name: routes.find(route => route.path === path)?.title ?? path,
    path,
  });
  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: abs(item.path),
    })),
  });

  // Perguntas frequentes da especialidade: o mesmo texto que aparece na página.
  const faq = verticals.find(item => `/${item.slug}` === path)?.faq;
  if (faq)
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map(([pergunta, resposta]) => ({
        "@type": "Question",
        name: pergunta,
        acceptedAnswer: { "@type": "Answer", text: resposta },
      })),
    });

  if (guide) {
    const publisher = {
      "@type": "Organization",
      "@id": orgId,
      name: "irbroker",
      logo: abs(brand.dark),
    };
    graph.push({
      "@type": "Article",
      headline: guide.titulo,
      description: guide.seoDescription ?? guide.linhaFina,
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      inLanguage: "pt-BR",
      image: abs(image),
      author: publisher,
      publisher,
      mainEntityOfPage: abs(path),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
