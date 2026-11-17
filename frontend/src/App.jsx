import { useState } from "react";
import ProdutoForm from "./components/ProdutoForm";
import ProdutoList from "./components/ProdutoList";

export default function App() {
  const [atualizacao, setAtualizacao] = useState(0);

  function atualizarLista() {
    setAtualizacao((valorAtual) => valorAtual + 1);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-6">
            <ProdutoForm aoCadastrar={atualizarLista} />
            <ProdutoList atualizacao={atualizacao} />
        </div>
    </main>
  );
}