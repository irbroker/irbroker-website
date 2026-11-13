export const media = {
  hero: {
    src: "/media/hero-v2-poster_85d370a2.webp",
    ogSrc: "/media/og/hero.jpg",
    alt: "Vista aérea do Parque Ibirapuera e do Obelisco, em São Paulo.",
    width: 1920,
    height: 1080,
  },
  comexHero: {
    src: "/media/comex-v2-poster_47c36159.webp",
    ogSrc: "/media/og/comex-hero.jpg",
    alt: "Navio de contêineres em alto-mar, visto do alto.",
    width: 1920,
    height: 1080,
  },
  transport: {
    src: "/media/carreta-patio.webp", // Pexels 36251074, quadro do vídeo institucional 2026
    ogSrc: "/media/og/transport.jpg",
    alt: "Carreta branca estacionada no pátio de uma transportadora.",
    width: 1920,
    height: 1080,
  },
  port: {
    src: "/media/navio-porto_9d08e456.webp", // Pexels 34043267, quadro de 24 s (v2, 12/11)
    ogSrc: "/media/og/port.jpg",
    alt: "Navio de contêineres chegando a uma cidade portuária, visto do alto.",
    width: 1920,
    height: 1080,
  },
  construction: {
    src: "/media/torres-vidro_1409d25b.webp", // Pexels 8477689, quadro de 30 s (v2, 12/11)
    ogSrc: "/media/og/real-estate.jpg",
    alt: "Torres de escritórios espelhadas vistas de baixo, com céu azul.",
    width: 1920,
    height: 1080,
  },
  corporate: {
    src: "/media/diretoria-debate_c776f516.webp", // Pexels 8141547, quadro de 4 s (v2, 12/11)
    ogSrc: "/media/og/corporate-v2.jpg",
    alt: "Diretoria de três executivos em discussão numa sala de reunião.",
    width: 1920,
    height: 1080,
  },
  wellcare: {
    src: "/media/cuidado-colaboradora_770a2105.webp", // Pexels 5252456, quadro de 8 s (v2, 12/11)
    ogSrc: "/media/og/wellcare-v2.jpg",
    alt: "Profissional de saúde conversando com uma colaboradora perto da janela.",
    width: 1920,
    height: 1080,
  },
  forest: {
    // Unsplash CbZh3kaPxrE (Jonathan Kemper), estampa da luva atenuada; ver media/CREDITOS.md.
    src: "/media/luvas-plantio_7271ced6.webp",
    ogSrc: "/media/og/forest.jpg",
    alt: "Mãos com luvas de jardinagem plantando uma muda na terra.",
    width: 1600,
    height: 1067,
  },
  about: {
    // Pexels 9476576 (torre na Av. Faria Lima, São Paulo). Não é o prédio do escritório da irbroker.
    src: "/media/faria-lima-torre.webp",
    ogSrc: "/media/og/about.jpg",
    alt: "Fachada de vidro de um edifício corporativo na Avenida Faria Lima, em São Paulo.",
    width: 1920,
    height: 1080,
  },
  contents: {
    // Quadro do clipe Pixabay 91744 (KM007_), do vídeo institucional 2026; ver media/CREDITOS.md.
    src: "/media/cidade-entardecer_3a141ea8.webp",
    ogSrc: "/media/og/contents.jpg",
    alt: "Prédios de uma cidade ao entardecer.",
    width: 1920,
    height: 1080,
  },
  triggers: {
    src: "/media/porto-distante_ba1a3e00.webp",
    ogSrc: "/media/og/triggers.jpg",
    alt: "Vista distante de um porto de contêineres com guindastes, montanhas e mar.",
    width: 1200,
    height: 1800,
  },
} as const;

export const heroVideo = {
  src: "/media/hero-v2-loop_85d370a2.mp4",
  poster: "/media/hero-v2-poster_85d370a2.webp",
  width: 1920,
  height: 1080,
} as const;

export const comexVideo = {
  src: "/media/comex-v2-loop_47c36159.mp4",
  poster: "/media/comex-v2-poster_47c36159.webp",
  width: 1920,
  height: 1080,
} as const;

// Topo de cada área: cena própria, sem repetir a home nem a Comex (ver media/CREDITOS.md).
export const areaVideos = {
  construction: { src: "/media/real-estate-v2-loop_53bc82d6.mp4", poster: "/media/real-estate-v2-poster_53bc82d6.webp", width: 1920, height: 1080 },
  corporate: { src: "/media/corporate-v2-loop_80671d50.mp4", poster: "/media/corporate-v2-poster_80671d50.webp", width: 1920, height: 1080 },
  wellcare: { src: "/media/wellcare-v2-loop_21b895ca.mp4", poster: "/media/wellcare-v2-poster_21b895ca.webp", width: 1920, height: 1080 },
} as const;

export const brand = {
  light: "/media/irbroker-logo-branco_0c489336.webp",
  dark: "/media/irbroker-logo-escuro_e701814b.webp",
  symbol: "/media/irbroker-simbolo_bd6c0f49.webp",
  comex: "/brand/comex-broker-horizontal-escuro-metal.svg",
  wellcare: "/brand/wellcare-broker-empilhada-branco.svg",
} as const;

export const brandDimensions = {
  light: { width: 1594, height: 400 },
  dark: { width: 1594, height: 400 },
  symbol: { width: 598, height: 698 },
  comex: { width: 1771, height: 440 },
  wellcare: { width: 911, height: 646 },
} as const;
