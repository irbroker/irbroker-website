const numbers = [
  ['95%', 'taxa de renovação dos clientes'],
  ['+50', 'contratos de benefícios em vida e saúde'],
  ['+20', 'seguradoras e resseguradoras parceiras'],
  ['+20', 'anos de experiência dos profissionais'],
];

export default function ProofBand() {
  return <section className="proof-band proof-numbers">
    <div className="wrap"><div className="proof-number-row">{numbers.map(([number, label], index) => <div className="proof-number" key={label}><strong className={index === 0 ? 'number-yellow' : undefined}>{number}</strong><p>{label}</p></div>)}</div><p className="proof-data-note">Dados declarados pela irbroker, consolidados de todas as áreas.</p></div>
  </section>;
}
