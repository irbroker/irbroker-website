import { insurerLogos, clientLogos } from "../data/partners";
import type { PartnerLogo } from "../data/partners";
import type { CSSProperties } from "react";
import AnimatedHeading from "./AnimatedHeading";
import { Editorial } from "./SiteLayout";

type LogoGridProps = {
  logos: PartnerLogo[];
  label: string;
  gridClass: "grid-insurers" | "grid-clients";
};

function LogoGrid({ logos, label, gridClass }: LogoGridProps) {
  return (
    <div className={`partner-logo-grid ${gridClass}`} role="list" aria-label={label}>
      {logos.map(logo => (
        <div className="partner-logo" key={logo.src} role="listitem" style={logo.escala ? { "--escala": logo.escala } as CSSProperties : undefined}>
          <img
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            /* Sem loading="lazy": 31 logos de ~3 KB; a carga preguiçosa podia deixar a grade vazia. */
            decoding="async"
          />
          {logo.cor && <img className="partner-logo-cor" src={logo.cor} alt="" aria-hidden="true" width={logo.width} height={logo.height} decoding="async" />}
        </div>
      ))}
    </div>
  );
}

export default function PartnerLogos() {
  return (
    <section className="partners-section wrap">
      <Editorial className="logo-band">
        <AnimatedHeading>
          Alternativas entre as principais seguradoras.
        </AnimatedHeading>
        <LogoGrid
          logos={insurerLogos}
          label="Seguradoras parceiras"
          gridClass="grid-insurers"
        />
      </Editorial>
      <Editorial className="logo-band">
        <AnimatedHeading>Empresas que confiam na irbroker.</AnimatedHeading>
        <LogoGrid
          logos={clientLogos}
          label="Clientes"
          gridClass="grid-clients"
        />
      </Editorial>
    </section>
  );
}
