import { useEffect, useRef, useState, type FormEvent } from 'react';
import { verticals } from '../data/content';

const CONTACT_ENDPOINT = 'https://n8n.syravel.com/webhook/irb-site-contato-8b76e2cd';
const SUCCESS_MESSAGE = 'Recebemos seu contato. A equipe da irbroker vai retornar pelo telefone ou e-mail informado.';
const UNEXPECTED_ERROR_MESSAGE = 'Não foi possível enviar agora. Fale com a gente pelo WhatsApp ou pelo comercial@irbroker.com.br.';

export function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isSuccessResponse(value: unknown): value is { ok: true } {
  return typeof value === 'object' && value !== null && (value as { ok?: unknown }).ok === true;
}

function isValidationResponse(value: unknown): value is { ok: false; erros: string[] } {
  if (typeof value !== 'object' || value === null) return false;
  const response = value as { ok?: unknown; erros?: unknown };
  return response.ok === false && Array.isArray(response.erros) && response.erros.every(error => typeof error === 'string');
}

export default function Contact() {
  const [front, setFront] = useState('');
  const [phone, setPhone] = useState('');
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const pageRef = useRef('');
  const t0Ref = useRef<number | null>(null);
  const submittingRef = useRef(false);
  const successRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!pageRef.current) pageRef.current = window.location.pathname;
    if (t0Ref.current === null) t0Ref.current = Date.now();

    const requested = new URLSearchParams(window.location.search).get('frente');
    if (requested && verticals.some(item => item.name === requested)) setFront(requested);
    setReady(true);
  }, []);

  useEffect(() => {
    if (success) successRef.current?.focus();
  }, [success]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setErrors([]);

    const body = new URLSearchParams();
    const formData = new FormData(form);
    formData.forEach((value, key) => body.append(key, typeof value === 'string' ? value : value.name));
    body.set('pagina', pageRef.current);
    body.set('t0', t0Ref.current === null ? '' : String(t0Ref.current));

    let submittedSuccessfully = false;
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body,
      });
      let responseData: unknown;
      try {
        responseData = await response.json();
      } catch {
        throw new Error('Invalid response');
      }

      if (response.ok && isSuccessResponse(responseData)) {
        submittedSuccessfully = true;
        setSuccess(true);
      } else if (response.status === 400 && isValidationResponse(responseData)) {
        setErrors(responseData.erros);
      } else {
        throw new Error('Unexpected response');
      }
    } catch {
      if (!submittedSuccessfully) setErrors([UNEXPECTED_ERROR_MESSAGE]);
    } finally {
      setSubmitting(false);
      if (!submittedSuccessfully) submittingRef.current = false;
    }
  }

  return <section className="contact-page">
    <div className="contact-page__layout">
      <aside className="contact-aside">
        <div className="contact-aside__intro">
          <p className="contact-aside__label section-label"><span className="small-rule" />Contato</p>
          <h1>Vamos conversar sobre<br className="desktop-break" /> a sua empresa.</h1>
          <p className="contact-aside__lead">Conte como a sua operação funciona. Um especialista da irbroker retorna pelo telefone ou e-mail informado.</p>
        </div>

        <div className="contact-aside__block">
          <h2>Outros caminhos</h2>
          <a className="contact-aside__whatsapp" href="https://wa.me/5541963491818" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
          <p className="contact-aside__lia">No WhatsApp, o primeiro atendimento é da Lia, a assistente virtual da irbroker. Ela tira dúvidas gerais e passa o seu caso para uma consultora.</p>
          <div className="contact-aside__direct-links">
            <a href="tel:+551121497244">(11) 2149-7244</a>
            <a href="mailto:comercial@irbroker.com.br">comercial@irbroker.com.br</a>
          </div>
        </div>

        <div className="contact-aside__block contact-aside__offices">
          <h2>Escritórios</h2>
          <div className="contact-office">
            <h3>Matriz</h3>
            <p>Rua José Versolato, 101, 12º andar, Torre A, Centro, São Bernardo do Campo/SP, 09750-730</p>
            <a className="contact-map-link" href="https://www.google.com/maps/search/?api=1&query=Rua+Jos%C3%A9+Versolato+101+S%C3%A3o+Bernardo+do+Campo+SP" target="_blank" rel="noopener">Ver no mapa</a>
          </div>
          <div className="contact-office">
            <h3>Filial</h3>
            <p>Av. Presidente Juscelino Kubitschek, 1455, 4º andar, Faria Lima, São Paulo/SP, 04543-011</p>
            <a className="contact-map-link" href="https://www.google.com/maps/search/?api=1&query=Av.+Presidente+Juscelino+Kubitschek+1455+S%C3%A3o+Paulo+SP" target="_blank" rel="noopener">Ver no mapa</a>
          </div>
        </div>
      </aside>

      <div className="contact-form-column">
        {success ? <p className="contact-success" ref={successRef} role="status" aria-live="polite" tabIndex={-1}>{SUCCESS_MESSAGE}</p> : <form className="contact-form" onSubmit={handleSubmit} aria-busy={submitting}>
          <input name="site" type="text" className="contact-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }} />
          <div className="form-grid"><label>Nome<input name="nome" autoComplete="name" required maxLength={120} /></label><label>Empresa<input name="empresa" autoComplete="organization" required maxLength={180} /></label><label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={254} /></label><label>Telefone<input name="telefone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={15} pattern={'\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}'} value={phone} onChange={event => setPhone(maskPhone(event.target.value))} /></label></div>
          <fieldset className="contact-form__fieldset">
            <legend>Frente de interesse</legend>
            <div className="contact-form__options">{verticals.map(vertical => <label className={`contact-option${front === vertical.name ? ' is-selected' : ''}`} key={vertical.slug}><input type="radio" name="frente" value={vertical.name} checked={front === vertical.name} onChange={event => setFront(event.target.value)} required /><span>{vertical.name}</span></label>)}</div>
          </fieldset>
          <label className="contact-form__message">Mensagem<textarea name="mensagem" required rows={4} maxLength={4000} /></label>
          <label className="privacy-checkbox"><input name="aceite" type="checkbox" value="on" required /><span>Li e aceito a <button type="button" className="text-link" onClick={event => { event.preventDefault(); const dialog = document.getElementById('privacy-policy-dialog') as HTMLDialogElement | null; dialog?.showModal(); }}>Política de privacidade</button>.</span></label>
          <div id="contact-errors" aria-live="polite">{errors.map((error, index) => <p key={`${error}-${index}`}>{error}</p>)}</div>
          <button className="button button-solid" type="submit" disabled={submitting || !ready} aria-describedby="contact-errors">{submitting ? 'Enviando…' : 'Enviar mensagem'}</button>
          <p className="contact-form__after-note">Depois do envio: entendemos a operação, comparamos alternativas entre seguradoras e acompanhamos a sua empresa depois da contratação.</p>
        </form>}
      </div>
    </div>
  </section>;
}
