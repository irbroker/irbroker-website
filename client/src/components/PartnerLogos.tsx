import { insurerLogos, clientLogos } from "../data/partners";
import type { PartnerLogo } from "../data/partners";
import AnimatedHeading from "./AnimatedHeading";

type LogoGridProps = {
  logos: PartnerLogo[];
  label: string;
  gridClass: "grid-insurers" | "grid-clients";
};

function LogoGrid({ logos, label, gridClass }: LogoGridProps) {
  return (
    <div className={`partner-logo-grid ${gridClass}`} role="list" aria-label={label}>
      {logos.map(logo => (
        <div className="partner-logo" key={logo.src} role="listitem">
          <img
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export default function PartnerLogos() {
  return (
    <section className="partners-section wrap">
      <div className="logo-band">
        <AnimatedHeading>
          Alternativas entre as principais seguradoras.
        </AnimatedHeading>
        <LogoGrid
          logos={insurerLogos}
          label="Seguradoras parceiras"
          gridClass="grid-insurers"
        />
      </div>
      <div className="logo-band">
        <AnimatedHeading>Empresas que confiam na irbroker.</AnimatedHeading>
        <LogoGrid
          logos={clientLogos}
          label="Clientes"
          gridClass="grid-clients"
        />
      </div>
    </section>
  );
}
