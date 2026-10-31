import { useState } from "react";

function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <section className="result-card empty-result" aria-live="polite">
        <div className="result-placeholder">✦</div>
        <div>
          <h2>Seu resultado aparecerá aqui</h2>
          <p>Escolha um gerador acima para começar.</p>
        </div>
      </section>
    );
  }

  const text =
    typeof result.value === "string"
      ? result.value
      : Object.entries(result.value)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");

  async function copyResult() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="result-card" aria-live="polite">
      <div className="result-heading">
        <div>
          <p className="result-label">Resultado gerado</p>
          <h2>{result.label}</h2>
        </div>
        <button type="button" className="copy-button" onClick={copyResult}>
          {copied ? "Copiado!" : "Copiar"} <span>▣</span>
        </button>
      </div>
      {typeof result.value === "string" ? (
        <div className="result-value">{result.value}</div>
      ) : (
        <dl className="person-result">
          {Object.entries(result.value).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

export default ResultCard;
