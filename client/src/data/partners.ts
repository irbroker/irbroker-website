export type PartnerLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Ajuste óptico do tamanho (0.8 a 1.35): iguala o peso visual entre logos de desenhos diferentes. */
  escala?: number;
  /** Versão colorida (mesma forma e posição), mostrada ao passar o mouse (12/11). */
  cor?: string;
};

export const insurerLogos: PartnerLogo[] = [
  { src: '/media/insurer-01-r8_68442356.webp', cor: '/media/insurer-01-cor_72b9ec97.webp', alt: 'Porto', width: 320, height: 128 },
  { src: '/media/insurer-02-r8_f4e83b6b.webp', cor: '/media/insurer-02-cor_8898b08a.webp', alt: 'Bradesco Seguros', width: 320, height: 128, escala: 1.2 },
  { src: '/media/insurer-03-r8_075401db.webp', cor: '/media/insurer-03-cor_619caea0.webp', alt: 'SulAmérica', width: 320, height: 128 },
  { src: '/media/insurer-04-r8_cbd19c46.webp', cor: '/media/insurer-04-cor_d9dbe801.webp', alt: 'Zurich', width: 320, height: 128, escala: 1.1 },
  { src: '/media/insurer-05-r8_dc83f65b.webp', cor: '/media/insurer-05-cor_8ba3188d.webp', alt: 'Mapfre', width: 320, height: 128 },
  { src: '/media/insurer-06-r8_49fc56b7.webp', cor: '/media/insurer-06-cor_6badc53c.webp', alt: 'AXA', width: 320, height: 128 },
  { src: '/media/insurer-07-r8_1822692e.webp', cor: '/media/insurer-07-cor_b3fb6a8e.webp', alt: 'Chubb', width: 320, height: 128, escala: 0.85 },
  { src: '/media/insurer-08-r8_52d9867a.webp', cor: '/media/insurer-08-cor_c03a380e.webp', alt: 'AIG', width: 320, height: 128 },
  { src: '/media/insurer-09-r8_1f63a661.webp', cor: '/media/insurer-09-cor_162a096d.webp', alt: 'Sompo', width: 320, height: 128 },
  { src: '/media/insurer-10-r8_18fde0c7.webp', cor: '/media/insurer-10-cor_e86c74ae.webp', alt: 'MetLife', width: 320, height: 128 },
  { src: '/media/insurer-11-r8_f28d8791.webp', cor: '/media/insurer-11-cor_52dfa415.webp', alt: 'Icatu', width: 320, height: 128 },
  { src: '/media/insurer-12-r8_c3abea74.webp', cor: '/media/insurer-12-cor_59ca1c09.webp', alt: 'Omint', width: 320, height: 128 },
  { src: '/media/insurer-13-r8_2740a3e0.webp', cor: '/media/insurer-13-cor_145a0b86.webp', alt: 'Fator', width: 320, height: 128 },
  // TODO: logo 14 (/media/insurer-14-r8_08d1f8ae.webp, só a palavra "seguros") fora da grade até o cliente confirmar o nome.
];

export const clientLogos: PartnerLogo[] = [
  { src: '/media/client-15-r8_1939b3b1.webp', cor: '/media/client-15-cor_ee5d1d80.webp', alt: 'BTG Pactual', width: 320, height: 128 },
  { src: '/media/client-16-r8_fcbfb1a4.webp', cor: '/media/client-16-cor_d772f37a.webp', alt: 'Brookfield Properties', width: 320, height: 128 },
  { src: '/media/client-17-r8_d5d935bc.webp', cor: '/media/client-17-cor_88df366e.webp', alt: 'Kinea, uma empresa Itaú', width: 320, height: 128, escala: 1.2 },
  { src: '/media/client-18-r8_b375f071.webp', cor: '/media/client-18-cor_7d0c9ac2.webp', alt: 'Riobravo', width: 320, height: 128, escala: 1.2 },
  { src: '/media/client-19-r8_431d1eb6.webp', cor: '/media/client-19-cor_de24eaa4.webp', alt: 'Seneca Evercore', width: 320, height: 128 },
  { src: '/media/client-20-r8_498a4586.webp', cor: '/media/client-20-cor_37c6e3e2.webp', alt: 'Banco Safra', width: 320, height: 128, escala: 1.35 },
  { src: '/media/client-21-r8_dae22785.webp', cor: '/media/client-21-cor_4d782a14.webp', alt: 'Prevent Senior', width: 320, height: 128 },
  { src: '/media/client-22-r8_1d5cf973.webp', cor: '/media/client-22-cor_302f5357.webp', alt: 'O Boticário', width: 320, height: 128 },
  { src: '/media/client-23-r8_907e1cce.webp', cor: '/media/client-23-cor_86e3cf6e.webp', alt: 'Indeed', width: 320, height: 128 },
  { src: '/media/client-24-r8_032ae55f.webp', cor: '/media/client-24-cor_8d1092d7.webp', alt: 'Tractian', width: 320, height: 128, escala: 0.85 },
  { src: '/media/client-25-r8_fe2ef5b6.webp', cor: '/media/client-25-cor_99f585aa.webp', alt: 'Snap-on', width: 320, height: 128, escala: 0.85 },
  { src: '/media/client-26-r8_cf180d33.webp', cor: '/media/client-26-cor_a74eb469.webp', alt: 'Pioneer', width: 320, height: 128, escala: 0.85 },
  { src: '/media/client-27-r8_7e14b25b.webp', cor: '/media/client-27-cor_4760041d.webp', alt: 'Embelleze', width: 320, height: 128, escala: 1.25 },
  { src: '/media/client-28-r8_87308d5d.webp', cor: '/media/client-28-cor_f6ed6a80.webp', alt: 'Bemol', width: 320, height: 128 },
  { src: '/media/client-29-r8_5d600baf.webp', cor: '/media/client-29-cor_e7f9fd7b.webp', alt: 'São Carlos', width: 320, height: 128 },
  { src: '/media/client-30-r8_6dcdce09.webp', cor: '/media/client-30-cor_5856ca2c.webp', alt: 'Granja Faria', width: 320, height: 128, escala: 1.35 },
  { src: '/media/client-31-r8_8df538c6.webp', cor: '/media/client-31-cor_c770938e.webp', alt: 'Sektor Logistics', width: 320, height: 128 },
  { src: '/media/client-32-r8_fae35b7c.webp', cor: '/media/client-32-cor_823797f8.webp', alt: 'Afianci Global Networking', width: 320, height: 128 },
];
