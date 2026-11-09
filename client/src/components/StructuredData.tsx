type StructuredDataProps = {
  origin?: string;
};

const knownPreview = 'https://8328-iycb45aoga883j1dr60g9-a539bc94.us5.manus.computer/';

const structuredData = (origin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  name: 'irbroker',
  telephone: '+55 11 2149-7244',
  email: 'comercial@irbroker.com.br',
  url: origin,
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'Rua José Versolato 101 12º andar Torre A Centro',
      addressLocality: 'São Bernardo do Campo',
      addressRegion: 'SP',
      postalCode: '09750-730',
      addressCountry: 'BR',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Presidente Juscelino Kubitschek 1455 4º andar Faria Lima',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      postalCode: '04543-011',
      addressCountry: 'BR',
    },
  ],
});

export default function StructuredData({ origin = knownPreview }: StructuredDataProps) {
  const json = JSON.stringify(structuredData(origin)).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
