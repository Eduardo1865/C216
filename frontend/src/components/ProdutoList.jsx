import { useEffect, useState } from "react";
import { apiUrl } from "../config/api";
import { dataValidadeVencida } from "../utils/produtoUtils";
import ProdutoModal from "./ProdutoModal";

export default function ProdutoList({
	atualizacao,
	aoAtualizar,
	tagSelecionada,
}) {
	const [produtos, setProdutos] = useState([]);
	const [produtoSelecionado, setProdutoSelecionado] = useState(null);
	const [busca, setBusca] = useState("");
	const [somenteVencidos, setSomenteVencidos] = useState(false);
	const [paginaAtual, setPaginaAtual] = useState(1);
	const produtosPorPagina = 10;

	useEffect(() => {
		async function carregarProdutos() {
			try {
				const caminho = tagSelecionada
					? `/produtos/por-tag/${tagSelecionada.id}`
					: `/produtos/?atualizacao=${atualizacao}`;
				const response = await fetch(apiUrl(caminho));

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
	}, [atualizacao, tagSelecionada]);

	function normalizarTexto(texto) {
		return String(texto ?? "")
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLocaleLowerCase("pt-BR");
	}

	const termoBusca = normalizarTexto(busca.trim());
	const produtosFiltrados = produtos.filter(
		(produto) =>
			(!somenteVencidos || dataValidadeVencida(produto.dataValidade)) &&
			[
				produto.id,
				produto.nome,
				produto.lote,
				produto.dataFabricacao,
				produto.dataValidade,
				produto.preco,
				produto.estoqueAtual,
				...(produto.tags ?? []).map((tag) => tag.nome),
			].some((valor) => normalizarTexto(valor).includes(termoBusca)),
	);
	const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);
	const paginaExibida = Math.min(paginaAtual, Math.max(totalPaginas, 1));
	const indiceInicial = (paginaExibida - 1) * produtosPorPagina;
	const produtosDaPagina = produtosFiltrados.slice(
		indiceInicial,
		indiceInicial + produtosPorPagina,
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
						onChange={(event) => {
							setBusca(event.target.value);
							setPaginaAtual(1);
						}}
						placeholder="Pesquisar por nome, lote, data ou ID..."
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					/>
					{busca && (
						<button
							type="button"
							onClick={() => {
								setBusca("");
								setPaginaAtual(1);
							}}
							className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
						>
							Limpar
						</button>
					)}
				</div>
				<label className="mt-4 inline-flex w-fit cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
					<input
						type="checkbox"
						checked={somenteVencidos}
						onChange={(event) => {
							setSomenteVencidos(event.target.checked);
							setPaginaAtual(1);
						}}
						className="peer sr-only"
					/>
					<span className="relative h-6 w-11 rounded-full bg-slate-300 transition before:absolute before:top-0.5 before:left-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform peer-checked:bg-red-600 peer-checked:before:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red-600" />
					Mostrar apenas produtos vencidos
				</label>
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
					<table className="w-full min-w-[900px] table-fixed text-left">
						<colgroup>
							<col className="w-[5%]" />
							<col className="w-[18%]" />
							<col className="w-[12%]" />
							<col className="w-[13%]" />
							<col className="w-[14%]" />
							<col className="w-[13%]" />
							<col className="w-[10%]" />
							<col className="w-[15%]" />
						</colgroup>
						<thead className="bg-slate-50">
							<tr>
								<th className="px-4 py-3 text-sm font-semibold text-slate-600">
									ID
								</th>

								<th className="px-4 py-3 text-sm font-semibold text-slate-600">
									Nome
								</th>

								<th className="px-4 py-3 text-sm font-semibold text-slate-600">
									Lote
								</th>

								<th className="px-4 py-3 text-sm font-semibold text-slate-600">
									Fabricação
								</th>

								<th className="px-4 py-3 text-sm font-semibold text-slate-600">
									Validade
								</th>

								<th className="px-4 py-3 text-sm font-semibold text-slate-600">
									Preço
								</th>

								<th className="px-4 py-3 text-sm font-semibold text-slate-600">
									Estoque
								</th>

								<th className="px-4 py-3 text-sm font-semibold text-slate-600">
									Foto
								</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-100">
							{produtosDaPagina.map((produto) => {
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
										<td className="px-4 py-5 text-sm text-slate-500">
											{produto.id}
										</td>

										<td className="px-4 py-5 font-medium text-slate-800">
											<div className="flex flex-col items-start gap-1">
												<span>{produto.nome}</span>
												{(produto.tags ?? []).length > 0 && (
													<div className="flex flex-wrap gap-1">
														{produto.tags.map((tag) => (
															<span
																key={tag.id}
																className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white"
															>
																{tag.nome}
															</span>
														))}
													</div>
												)}
											</div>
										</td>

										<td className="px-4 py-5 text-sm text-slate-600">
											{produto.lote}
										</td>

										<td className="px-4 py-5 text-sm text-slate-600">
											{produto.dataFabricacao}
										</td>

										<td className="px-4 py-5 text-sm text-slate-600">
											<div className="flex flex-col items-start gap-1">
												<span
													className={
														vencido ? "font-semibold text-red-700" : ""
													}
												>
													{produto.dataValidade}
												</span>
												{vencido && (
													<span className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
														Validade vencida
													</span>
												)}
											</div>
										</td>

										<td className="px-4 py-5 text-sm text-slate-600">
											{Number(produto.preco).toLocaleString("pt-BR", {
												style: "currency",
												currency: "BRL",
											})}
										</td>

										<td className="px-4 py-5 text-sm text-slate-600">
											{produto.estoqueAtual}
										</td>

										<td className="px-4 py-5">
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

			{produtosFiltrados.length > 0 && (
				<div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-slate-600">
						Mostrando {indiceInicial + 1}–
						{Math.min(
							indiceInicial + produtosPorPagina,
							produtosFiltrados.length,
						)}{" "}
						de {produtosFiltrados.length} produtos
					</p>
					{totalPaginas > 1 && (
						<nav
							aria-label="Paginação dos produtos"
							className="flex items-center gap-2"
						>
							<button
								type="button"
								onClick={() => setPaginaAtual(paginaExibida - 1)}
								disabled={paginaExibida === 1}
								className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Anterior
							</button>
							<span className="px-2 text-sm text-slate-600">
								Página {paginaExibida} de {totalPaginas}
							</span>
							<button
								type="button"
								onClick={() => setPaginaAtual(paginaExibida + 1)}
								disabled={paginaExibida === totalPaginas}
								className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Próxima
							</button>
						</nav>
					)}
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
