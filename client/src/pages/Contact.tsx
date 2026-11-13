import { useEffect, useRef, useState, type FormEvent } from "react";
import { frontName, verticals } from "../data/content";
import { Breadcrumb } from "../components/SiteLayout";

const CONTACT_ENDPOINT =
  "https://n8n.syravel.com/webhook/irb-site-contato-8b76e2cd";
const SUCCESS_MESSAGE =
  "Recebemos seu contato. A equipe da irbroker vai retornar pelo telefone ou e-mail informado.";
const UNEXPECTED_ERROR_MESSAGE =
  "Não foi possível enviar agora. Fale com a gente pelo WhatsApp ou pelo comercial@irbroker.com.br.";

export function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isSuccessResponse(value: unknown): value is { ok: true } {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { ok?: unknown }).ok === true
  );
}

function isValidationResponse(
  value: unknown
): value is { ok: false; erros: string[] } {
  if (typeof value !== "object" || value === null) return false;
  const response = value as { ok?: unknown; erros?: unknown };
  return (
    response.ok === false &&
    Array.isArray(response.erros) &&
    response.erros.every(error => typeof error === "string")
  );
}

// Liga cada mensagem do servidor ao campo correspondente; as que não casam ficam só na região geral.
const ERROR_FIELDS = [
  ["nome", /\bnome\b(?!.*empresa)/i],
  ["email", /e-?mail/i],
  ["telefone", /telefone|celular/i],
  ["aceite", /aceite|pol[ií]tica|privacidade|consentimento/i],
] as const;

export function errorField(error: string) {
  return ERROR_FIELDS.find(([, pattern]) => pattern.test(error))?.[0];
}

// Linha curta sob cada opção de "Com quem você quer falar" (12/11).
const RESUMO: Record<string, string> = {
  "comex-broker": "Seguro de transporte de cargas",
  wellcare: "Saúde e benefícios da equipe",
  corporate: "Riscos da empresa e dos gestores",
  "real-estate": "Mercado imobiliário",
};

export default function Contact() {
  const [front, setFront] = useState("");
  const [phone, setPhone] = useState("");
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const pageRef = useRef("");
  const t0Ref = useRef<number | null>(null);
  const submittingRef = useRef(false);
  const successRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!pageRef.current) pageRef.current = window.location.pathname;
    if (t0Ref.current === null) t0Ref.current = Date.now();

    const requested = frontName(new URLSearchParams(window.location.search).get("frente"));
    if (requested) setFront(requested);
    setReady(true);
  }, []);

  useEffect(() => {
    if (success) successRef.current?.focus();
  }, [success]);

  const errorFields = errors.map(errorField);
  function invalid(field: string) {
    const ids = errorFields.flatMap((item, index) =>
      item === field ? [`contact-error-${index}`] : []
    );
    return ids.length
      ? ({ "aria-invalid": true, "aria-describedby": ids.join(" ") } as const)
      : {};
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setErrors([]);

    const body = new URLSearchParams();
    const formData = new FormData(form);
    formData.forEach((value, key) =>
      body.append(key, typeof value === "string" ? value : value.name)
    );
    body.set("pagina", pageRef.current);
    body.set("t0", t0Ref.current === null ? "" : String(t0Ref.current));

    let submittedSuccessfully = false;
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body,
      });
      let responseData: unknown;
      try {
        responseData = await response.json();
      } catch {
        throw new Error("Invalid response");
      }

      if (response.ok && isSuccessResponse(responseData)) {
        submittedSuccessfully = true;
        setSuccess(true);
      } else if (
        response.status === 400 &&
        isValidationResponse(responseData)
      ) {
        setErrors(responseData.erros);
      } else {
        throw new Error("Unexpected response");
      }
    } catch {
      if (!submittedSuccessfully) setErrors([UNEXPECTED_ERROR_MESSAGE]);
    } finally {
      setSubmitting(false);
      if (!submittedSuccessfully) submittingRef.current = false;
    }
  }

  return (
    <>
    {/* Contato v3 (12/11): topo com foto como as outras páginas, formulário largo no centro e faixa curta no fim.
        Os endereços ficam só no rodapé (sem repetir). */}
    <section className="photo-hero vertical-hero contact-hero">
      <img className="hero-photo" src="/media/contato-sala-cidade_69546238.webp" alt="" aria-hidden="true" width="1920" height="1080" fetchPriority="high" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap hero-content">
        <Breadcrumb className="hero-kicker" items={[{ label: "Contato" }]} />
        <h1>Conte como a sua empresa opera.</h1>
        <p className="hero-description">Um especialista da irbroker retorna pelo telefone ou e-mail informado.</p>
      </div>
    </section>
    <section className="contact-page">
      <div className="wrap contact-form-wrap">
        <div className="contact-form-column">
          {success ? (
            <p
              className="contact-success"
              ref={successRef}
              role="status"
              aria-live="polite"
              tabIndex={-1}
            >
              {SUCCESS_MESSAGE}
            </p>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
              aria-busy={submitting}
            >
              <input
                name="site"
                type="text"
                className="contact-honeypot"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                defaultValue=""
                style={{
                  position: "absolute",
                  left: "-10000px",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
              />
              <p className="contact-form__required">
                Todos os campos são obrigatórios.
              </p>
              <div className="form-grid">
                <label>
                  Nome
                  <input
                    name="nome"
                    autoComplete="name"
                    required
                    maxLength={120}
                    {...invalid("nome")}
                  />
                </label>
                <label>
                  Empresa
                  <input
                    name="empresa"
                    autoComplete="organization"
                    required
                    maxLength={180}
                  />
                </label>
                <label>
                  E-mail
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    {...invalid("email")}
                  />
                </label>
                <label>
                  Telefone
                  <input
                    name="telefone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    maxLength={15}
                    pattern={"\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}"}
                    title="Formato: (11) 91234-5678"
                    {...invalid("telefone")}
                    value={phone}
                    onChange={event => setPhone(maskPhone(event.target.value))}
                  />
                </label>
              </div>
              <fieldset className="contact-form__fieldset">
                <legend>Com quem você quer falar</legend>
                <div className="contact-form__options">
                  {verticals.map(vertical => (
                    <label
                      className={`contact-option${front === vertical.name ? " is-selected" : ""}`}
                      key={vertical.slug}
                    >
                      <input
                        type="radio"
                        name="frente"
                        value={vertical.name}
                        checked={front === vertical.name}
                        onChange={event => setFront(event.target.value)}
                        required
                      />
                      <span>{vertical.name}</span>
                      <small>{RESUMO[vertical.slug]}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="contact-form__message">
                Mensagem
                <textarea name="mensagem" required rows={4} maxLength={4000} />
              </label>
              <label className="privacy-checkbox">
                <input
                  name="aceite"
                  type="checkbox"
                  value="on"
                  required
                  {...invalid("aceite")}
                />
                <span>
                  Li e aceito a{" "}
                  <button
                    type="button"
                    className="text-link"
                    onClick={event => {
                      event.preventDefault();
                      const dialog = document.getElementById(
                        "privacy-policy-dialog"
                      ) as HTMLDialogElement | null;
                      dialog?.showModal();
                    }}
                  >
                    Política de privacidade
                  </button>
                  .
                </span>
              </label>
              <div id="contact-errors" aria-live="polite">
                {errors.map((error, index) => (
                  <p key={`${error}-${index}`} id={`contact-error-${index}`}>
                    {error}
                  </p>
                ))}
              </div>
              <button
                className="button button-solid"
                type="submit"
                disabled={submitting || !ready}
                aria-describedby="contact-errors"
              >
                {submitting ? "Enviando…" : "Enviar mensagem"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
    <section className="contact-strip" aria-label="Outros caminhos">
      <div className="wrap contact-strip-grid">
        <div>
          <h2>WhatsApp</h2>
          <p>O primeiro atendimento é da Lia, a assistente virtual da irbroker, que passa o seu caso para uma consultora.</p>
          <a href="https://wa.me/5541963491818" target="_blank" rel="noopener noreferrer">Falar no WhatsApp<span className="sr-only"> (abre em nova aba)</span></a>
        </div>
        <div>
          <h2>E-mail</h2>
          <p>Para enviar documentos ou falar direto com o comercial.</p>
          <a href="mailto:comercial@irbroker.com.br">comercial@irbroker.com.br</a>
        </div>
        <div>
          <h2>Escritórios</h2>
          <p>Matriz em São Bernardo do Campo e filial na Faria Lima, em São Paulo.</p>
          <a href="https://www.google.com/maps/search/?api=1&query=Rua+Jos%C3%A9+Versolato+101+S%C3%A3o+Bernardo+do+Campo+SP" target="_blank" rel="noopener">Matriz no mapa<span className="sr-only"> (abre em nova aba)</span></a>
          {" · "}
          <a href="https://www.google.com/maps/search/?api=1&query=Av.+Presidente+Juscelino+Kubitschek+1455+S%C3%A3o+Paulo+SP" target="_blank" rel="noopener">Filial no mapa<span className="sr-only"> (abre em nova aba)</span></a>
        </div>
      </div>
    </section>
    </>
  );
}
