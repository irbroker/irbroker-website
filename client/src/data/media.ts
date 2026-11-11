export const media = {
  hero: {
    src: "/media/hero-poster-r8_81a14c67.webp",
    ogSrc: "/media/og/hero.jpg",
    alt: "Vista aérea de São Paulo ao pôr do sol.",
    width: 1920,
    height: 1080,
  },
  comexHero: {
    src: "/media/comex-poster-r8_f40739c3.webp",
    ogSrc: "/media/og/comex-hero.jpg",
    alt: "Navio de cargas em navegação ao entardecer.",
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
    src: "/media/navio-entardecer_e4c2785a.webp",
    ogSrc: "/media/og/port.jpg",
    alt: "Navio de cargas em navegação ao entardecer.",
    width: 1920,
    height: 1080,
  },
  construction: {
    src: "/media/paulista-torres_e1236a2d.webp", // Pexels 16836469 (sp-paulista), quadro de 13 s
    ogSrc: "/media/og/real-estate.jpg",
    alt: "Torres de escritórios na Avenida Paulista, em São Paulo, vistas do alto.",
    width: 1920,
    height: 1080,
  },
  corporate: {
    src: "/media/reuniao-clara_c38af6ee.webp", // Pexels 8343950, quadro de 7 s
    ogSrc: "/media/og/reuniao-clara.jpg",
    alt: "Executivas em reunião de diretoria, com um gráfico na tela ao fundo.",
    width: 1920,
    height: 1080,
  },
  wellcare: {
    src: "/media/rh-equipe_ff273a3c.webp", // Pexels 8632479, quadro de 4 s
    ogSrc: "/media/og/rh-equipe.jpg",
    alt: "Profissional de RH apresentando os benefícios para a equipe.",
    width: 1920,
    height: 1080,
  },
  forest: {
    // Unsplash CbZh3kaPxrE (Jonathan Kemper), estampa da luva atenuada; ver media/CREDITOS.md.
    src: "/media/luvas-plantio.webp",
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
    src: "/media/cidade-entardecer.webp",
    ogSrc: "/media/og/contents.jpg",
    alt: "Prédios de uma cidade ao entardecer.",
    width: 1920,
    height: 1080,
  },
  triggers: {
    src: "/media/porto-distante_24f801da.webp",
    ogSrc: "/media/og/triggers.jpg",
    alt: "Vista distante de um porto de contêineres com guindastes, montanhas e mar.",
    width: 1920,
    height: 2880,
  },
} as const;

export const heroVideo = {
  src: "/media/hero-luz-loop_94e09377.mp4",
  poster: "/media/hero-poster-r8_81a14c67.webp",
  width: 1920,
  height: 1080,
} as const;

export const comexVideo = {
  src: "/media/comex-loop_2fd8d079.mp4",
  poster: "/media/comex-poster-r8_f40739c3.webp",
  width: 1920,
  height: 1080,
} as const;

// Topo de cada área: cena própria, sem repetir a home nem a Comex (ver media/CREDITOS.md).
export const areaVideos = {
  construction: { src: "/media/real-estate-loop_5302d8e7.mp4", poster: "/media/real-estate-poster_5302d8e7.webp", width: 1920, height: 1080 },
  corporate: { src: "/media/corporate-luz-loop_356cab6a.mp4", poster: "/media/corporate-luz-poster_356cab6a.webp", width: 1920, height: 1080 },
  wellcare: { src: "/media/wellcare-luz-loop_76109537.mp4", poster: "/media/wellcare-luz-poster_76109537.webp", width: 1920, height: 1080 },
} as const;

export const brand = {
  light: "/media/irbroker-logo-branco_0c489336.webp",
  dark: "/media/irbroker-logo-escuro_e701814b.webp",
  symbol: "/media/irbroker-simbolo_bd6c0f49.webp",
  comex: "/brand/comex-broker-horizontal-mono-branco.svg",
  wellcare: "/brand/wellcare-broker-empilhada-branco.svg",
} as const;

export const brandDimensions = {
  light: { width: 1594, height: 400 },
  dark: { width: 1594, height: 400 },
  symbol: { width: 598, height: 698 },
  comex: { width: 1771, height: 440 },
  wellcare: { width: 911, height: 646 },
} as const;
