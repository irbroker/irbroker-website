import { Component, useEffect, useState, type ReactNode } from "react";

// Isola os blocos de indicadores encaixados nas páginas de área: nada no HTML do SSG (renderiza só no navegador,
// depois do "load"), e qualquer erro de render fica preso aqui (o bloco some; o resto da página segue).
class Barreira extends Component<{ children: ReactNode }, { erro: boolean }> {
  state = { erro: false };
  static getDerivedStateFromError() {
    return { erro: true };
  }
  componentDidCatch() {
    // sem log ruidoso: o bloco é opcional
  }
  render() {
    return this.state.erro ? null : this.props.children;
  }
}

export default function IndicadorSeguro({ children }: { children: ReactNode }) {
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    if (document.readyState === "complete") {
      setPronto(true);
      return;
    }
    const ok = () => setPronto(true);
    window.addEventListener("load", ok, { once: true });
    return () => window.removeEventListener("load", ok);
  }, []);
  return pronto ? <Barreira>{children}</Barreira> : null;
}
