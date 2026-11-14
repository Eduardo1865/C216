import { useEffect, useState } from "react";
import GeneratorCard from "./components/GeneratorCard";
import HistoryList from "./components/HistoryList";
import ResultCard from "./components/ResultCard";
import {
  generateCpf,
  generateEmail,
  generateFullPerson,
  generateName,
} from "./generator";
import { createPerson, listPeople } from "./services/people";

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

function loadHistory() {
  const storedHistory = localStorage.getItem("generator-history");
  if (!storedHistory) return [];

  try {
    return JSON.parse(storedHistory);
  } catch {
    localStorage.removeItem("generator-history");
    return [];
  }
}

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("generator-active-tab") || "geradores",
  );
  const [people, setPeople] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [peopleError, setPeopleError] = useState("");
  const [savingPerson, setSavingPerson] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    localStorage.setItem("generator-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("generator-active-tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    let active = true;
    listPeople()
      .then((loadedPeople) => {
        if (active) setPeople(loadedPeople);
      })
      .catch((error) => {
        if (active) setPeopleError(error.message);
      })
      .finally(() => {
        if (active) setPeopleLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
    setSaveMessage("");
    setSaveError("");
  }

  async function handleSavePerson(person) {
    setSavingPerson(true);
    setSaveMessage("");
    setSaveError("");
    try {
      const savedPerson = await createPerson(person);
      setPeople((current) => [savedPerson, ...current]);
      setSaveMessage("Pessoa cadastrada com sucesso.");
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setSavingPerson(false);
    }
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
            <ResultCard
              result={result}
              onSave={handleSavePerson}
              saving={savingPerson}
              saveMessage={saveMessage}
              saveError={saveError}
            />
            <section
              className="people-section"
              aria-label="Pessoas cadastradas"
            >
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Persistência na API</p>
                  <h2>Pessoas cadastradas</h2>
                </div>
                <span className="people-count">{people.length}</span>
              </div>
              {peopleLoading && (
                <p className="loading-message">Carregando pessoas...</p>
              )}
              {peopleError && (
                <p className="error-message" role="alert">
                  {peopleError}
                </p>
              )}
              {!peopleLoading && !peopleError && people.length === 0 && (
                <p className="empty-state">Nenhuma pessoa cadastrada ainda.</p>
              )}
              {!peopleLoading && people.length > 0 && (
                <ul className="people-list">
                  {people.map((person) => (
                    <li key={person.id}>
                      <strong>{person.nome}</strong>
                      <span>
                        {person.email} · {person.cpf}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : (
          <HistoryList
            history={history}
            onClear={handleClearHistory}
            onSelect={setResult}
          />
        )}

        <p className="privacy-note">
          <span>♢</span> Os dados são gerados localmente; pessoas cadastradas
          são persistidas pela API para seus testes.
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
