import { useState } from "react";
import GeneratorCard from "./components/GeneratorCard";
import HistoryList from "./components/HistoryList";
import ResultCard from "./components/ResultCard";
import {
  generateCpf,
  generateEmail,
  generateFullPerson,
  generateName,
} from "./generator";

const generators = [
  {
    id: "cpf",
    label: "CPF",
    description: "Gere documentos válidos para seus testes",
    icon: "▣",
    color: "purple",
    generate: generateCpf,
  },
  {
    id: "email",
    label: "E-mail",
    description: "Crie endereços de e-mail descartáveis",
    icon: "@",
    color: "blue",
    generate: generateEmail,
  },
  {
    id: "name",
    label: "Nome",
    description: "Gere nomes brasileiros aleatórios",
    icon: "Aa",
    color: "green",
    generate: generateName,
  },
  {
    id: "person",
    label: "Pessoa completa",
    description: "Nome, documento, contato e endereço",
    icon: "♙",
    color: "orange",
    generate: generateFullPerson,
  },
];

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("geradores");

  function handleGenerate(generator) {
    const generated = generator.generate();
    const entry = {
      id: `${generator.id}-${Date.now()}`,
      type: generator.id,
      label: generator.label,
      value: generated,
    };

    setResult(entry);
    setHistory((current) => [entry, ...current].slice(0, 8));
  }

  function handleClearHistory() {
    setHistory([]);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Gerador home">
          <span className="brand-mark">G</span>
          <span>Gerador</span>
        </a>
        <div className="status-pill">
          <span className="status-dot" />
          Modo demonstração
        </div>
      </header>

      <main className="page-content">
        <section className="hero">
          <div>
            <p className="eyebrow">Prática 6 · dados para desenvolvimento</p>
            <h1>
              Gere dados de teste
              <br />
              <span>em poucos cliques.</span>
            </h1>
            <p className="hero-copy">
              Informações fictícias para prototipar, testar e validar suas
              aplicações com segurança.
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="art-shape art-shape-one" />
            <span className="art-shape art-shape-two" />
            <span className="art-shape art-shape-three" />
            <span className="art-spark">✦</span>
          </div>
        </section>

        <nav className="tabs" aria-label="Navegação principal">
          <button
            type="button"
            className={activeTab === "geradores" ? "tab active" : "tab"}
            onClick={() => setActiveTab("geradores")}
          >
            <span>✦</span> Geradores
          </button>
          <button
            type="button"
            className={activeTab === "historico" ? "tab active" : "tab"}
            onClick={() => setActiveTab("historico")}
          >
            <span>◷</span> Histórico{" "}
            {history.length > 0 && <b>{history.length}</b>}
          </button>
        </nav>

        {activeTab === "geradores" ? (
          <>
            <section
              className="generator-grid"
              aria-label="Geradores disponíveis"
            >
              {generators.map((generator) => (
                <GeneratorCard
                  key={generator.id}
                  generator={generator}
                  onGenerate={handleGenerate}
                />
              ))}
            </section>
            <ResultCard result={result} />
          </>
        ) : (
          <HistoryList
            history={history}
            onClear={handleClearHistory}
            onSelect={setResult}
          />
        )}

        <p className="privacy-note">
          <span>♢</span> Todos os dados são gerados localmente e não são
          enviados para nenhum servidor.
        </p>
      </main>

      <footer>
        <span>
          Gerador <strong>·</strong> Ferramentas para desenvolvimento
        </span>
        <span>
          Feito para facilitar seu trabalho{" "}
          <span className="footer-heart">♥</span>
        </span>
      </footer>
    </div>
  );
}

export default App;
