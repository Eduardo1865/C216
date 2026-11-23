import { useEffect, useState } from "react";
import ProdutoModal from "./ProdutoModal";

export default function ProdutoList({ atualizacao, aoAtualizar }) {
	const [produtos, setProdutos] = useState([]);
	const [produtoSelecionado, setProdutoSelecionado] = useState(null);

	useEffect(() => {
		async function carregarProdutos() {
			try {
				const response = await fetch(
					`http://localhost:8000/produtos/?atualizacao=${atualizacao}`,
				);

				if (!response.ok) {
					throw new Error("Não foi possível buscar os produtos.");
				}

				const dados = await response.json();
				setProdutos(dados);
			} catch (error) {
				console.error(error);
			}
		}

		carregarProdutos();
	}, [atualizacao]);

	return (
		<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<h2 className="border-b border-slate-200 px-6 py-4 text-xl font-semibold text-slate-800">
				Lista de produtos
			</h2>

			{produtos.length === 0 ? (
				<p className="px-6 py-8 text-center text-sm text-slate-500">
					Nenhum produto cadastrado.
				</p>
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
									Lote
								</th>

								<th className="px-6 py-3 text-sm font-semibold text-slate-600">
									Fabricação
								</th>

								<th className="px-6 py-3 text-sm font-semibold text-slate-600">
									Validade
								</th>

								<th className="px-6 py-3 text-sm font-semibold text-slate-600">
									Preço
								</th>

								<th className="px-6 py-3 text-sm font-semibold text-slate-600">
									Estoque
								</th>

								<th className="px-6 py-3 text-sm font-semibold text-slate-600">
									Foto
								</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-100">
							{produtos.map((produto) => (
								<tr
									key={produto.id}
									onClick={() => setProdutoSelecionado(produto)}
									className="cursor-pointer transition hover:bg-slate-50"
								>
									<td className="px-6 py-4 text-sm text-slate-500">
										{produto.id}
									</td>

									<td className="px-6 py-4 font-medium text-slate-800">
										{produto.nome}
									</td>

									<td className="px-6 py-4 text-sm text-slate-600">
										{produto.lote}
									</td>

									<td className="px-6 py-4 text-sm text-slate-600">
										{produto.dataFabricacao}
									</td>

									<td className="px-6 py-4 text-sm text-slate-600">
										{produto.dataValidade}
									</td>

									<td className="px-6 py-4 text-sm text-slate-600">
										{Number(produto.preco).toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
									</td>

									<td className="px-6 py-4 text-sm text-slate-600">
										{produto.estoqueAtual}
									</td>

									<td className="px-6 py-4">
										{produto.foto ? (
											<img
												src={produto.foto}
												alt={`Foto de ${produto.nome}`}
												className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
											/>
										) : (
											<span className="text-sm text-slate-400">Sem foto</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{produtoSelecionado && (
				<ProdutoModal
					produto={produtoSelecionado}
					aoFechar={() => setProdutoSelecionado(null)}
					aoAtualizar={aoAtualizar}
				/>
			)}
		</section>
	);
}
