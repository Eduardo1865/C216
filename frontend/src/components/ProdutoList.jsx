import { useEffect, useState } from "react";

export default function ProdutoList({ atualizacao }) {
  const [produtos, setProdutos] = useState([]);

  async function carregarProdutos() {
    try {
      const response = await fetch("http://localhost:8000/produtos/");

      if (!response.ok) {
        throw new Error("Não foi possível buscar os produtos.");
      }

      const dados = await response.json();
      setProdutos(dados);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, [atualizacao]);

  return (
  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <h2 className="border-b border-slate-200 px-6 py-4 text-xl font-semibold text-slate-800">
        Lista de produtos
        </h2>
    
    {produtos.length === 0 ? (
      <p>Nenhum produto cadastrado.</p>
    ) : (
        <div className="overflow-x-auto">
      <table className="w-full text-left">
        
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold text-slate-600">
            ID
            </th>

            <th className="px-6 py-3 text-sm font-semibold text-slate-600">
            Nome
            </th>

            <th className="px-6 py-3 text-sm font-semibold text-slate-600">
            Data
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {produtos.map((produto) => (
            <tr key={produto.id}
            className="transition hover:bg-slate-50"
            >
                
                <td className="px-6 py-4 text-sm text-slate-500">
                    {produto.id}
                </td>

                <td className="px-6 py-4 font-medium text-slate-800">
                    {produto.nome}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                    {produto.data}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    )}
  </section>
);
}