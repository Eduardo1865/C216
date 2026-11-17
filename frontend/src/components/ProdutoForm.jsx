import { useState } from "react";

export default function ProdutoForm({ aoCadastrar }) {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");

  async function cadastrarProduto(event) {
    event.preventDefault();

    const novoProduto = {
      nome,
      data,
    };

    try {
      const response = await fetch("http://localhost:8000/produtos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoProduto),
      });

      if (!response.ok) {
        throw new Error("Não foi possível cadastrar o produto.");
      }

      await response.json();

      aoCadastrar();
      setNome("");
      setData("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={cadastrarProduto}
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-6 text-xl font-semibold text-slate-800" >Cadastrar produto</h2>

      <div className="mb-2 block text-sm font-medium text-slate-700">
        <label htmlFor="nome"
            className="mb-2 block text-sm font-medium text-slate-700"
        >
            Nome
        </label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label htmlFor="data"
        className="mb-2 block text-sm font-medium text-slate-700">Data</label>
        <input
          id="data"
          type="date"
          value={data}
          onChange={(event) => setData(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

          required
        />
      </div>

      <button type="submit" className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
>Cadastrar</button>
    </form>
  );
}