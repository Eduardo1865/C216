import { useEffect, useState } from "react";
import ProdutoModal from "./ProdutoModal";
import { dataValidadeVencida } from "../utils/produtoUtils";

export default function ProdutoList({ atualizacao, aoAtualizar }) {
	const [produtos, setProdutos] = useState([]);
	const [produtoSelecionado, setProdutoSelecionado] = useState(null);
	const [busca, setBusca] = useState("");

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

	function normalizarTexto(texto) {
		return String(texto ?? "")
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLocaleLowerCase("pt-BR");
	}

	const termoBusca = normalizarTexto(busca.trim());
	const produtosFiltrados = produtos.filter((produto) =>
		[
			produto.id,
			produto.nome,
			produto.lote,
			produto.dataFabricacao,
			produto.dataValidade,
			produto.preco,
			produto.estoqueAtual,
		].some((valor) =>
			normalizarTexto(valor).includes(termoBusca),
		),
	);

	return (
		<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<h2 className="border-b border-slate-200 px-6 py-4 text-xl font-semibold text-slate-800">
				Lista de produtos
			</h2>

			<div className="border-b border-slate-200 px-6 py-4">
				<label htmlFor="buscar-produto" className="sr-only">
					Pesquisar produtos
				</label>
				<div className="flex gap-3">
					<input
						id="buscar-produto"
						type="search"
						value={busca}
						onChange={(event) => setBusca(event.target.value)}
						placeholder="Pesquisar por nome, lote, data ou ID..."
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					/>
					{busca && (
						<button
							type="button"
							onClick={() => setBusca("")}
							className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
						>
							Limpar
						</button>
					)}
				</div>
			</div>

			{produtos.length === 0 ? (
				<p className="px-6 py-8 text-center text-sm text-slate-500">
					Nenhum produto cadastrado.
				</p>
			) : produtosFiltrados.length === 0 ? (
				<p className="px-6 py-8 text-center text-sm text-slate-500">
					Nenhum produto encontrado.
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
							{produtosFiltrados.map((produto) => {
								const vencido = dataValidadeVencida(produto.dataValidade);

								return (
								<tr
									key={produto.id}
									onClick={() => setProdutoSelecionado(produto)}
									className={`cursor-pointer transition ${
										vencido
											? "bg-red-50 hover:bg-red-100"
											: "hover:bg-slate-50"
									}`}
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
										<div className="flex flex-col items-start gap-1">
											<span className={vencido ? "font-semibold text-red-700" : ""}>
												{produto.dataValidade}
											</span>
											{vencido && (
												<span className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
													Validade vencida
												</span>
											)}
										</div>
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
								);
							})}
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
