import { useEffect, useState } from "react";
import { apiUrl } from "../config/api";
import { dataValidadeVencida } from "../utils/produtoUtils";

export default function ProdutoModal({ produto, aoFechar, aoAtualizar }) {
	const [editando, setEditando] = useState(false);
	const [erro, setErro] = useState("");
	const [formulario, setFormulario] = useState(produto);
	const [tagsDisponiveis, setTagsDisponiveis] = useState([]);

	useEffect(() => {
		setFormulario(produto);
		setEditando(false);
		setErro("");
	}, [produto]);

	useEffect(() => {
		async function carregarTags() {
			try {
				const response = await fetch(apiUrl("/tags/"));
				if (!response.ok) {
					throw new Error("Não foi possível buscar as tags.");
				}
				setTagsDisponiveis(await response.json());
			} catch (error) {
				setErro(error.message);
			}
		}

		carregarTags();
	}, []);

	useEffect(() => {
		function fecharComEscape(event) {
			if (event.key === "Escape") {
				aoFechar();
			}
		}

		document.addEventListener("keydown", fecharComEscape);
		return () => document.removeEventListener("keydown", fecharComEscape);
	}, [aoFechar]);

	function atualizarCampo(event) {
		const { name, value } = event.target;
		setFormulario((dados) => ({ ...dados, [name]: value }));
	}

	function alternarTag(tagId) {
		setFormulario((dados) => {
			const idsAtuais = (dados.tags ?? []).map((tag) => tag.id);
			const novosIds = idsAtuais.includes(tagId)
				? idsAtuais.filter((id) => id !== tagId)
				: [...idsAtuais, tagId];
			const novasTags = tagsDisponiveis.filter((tag) =>
				novosIds.includes(tag.id),
			);
			return { ...dados, tags: novasTags };
		});
	}

	function selecionarFoto(event) {
		const arquivo = event.target.files?.[0];
		if (!arquivo) return;

		if (!arquivo.type.startsWith("image/")) {
			setErro("Selecione um arquivo de imagem válido.");
			event.target.value = "";
			return;
		}

		const leitor = new FileReader();
		leitor.onload = () =>
			setFormulario((dados) => ({ ...dados, foto: String(leitor.result) }));
		leitor.onerror = () => setErro("Não foi possível ler a imagem.");
		leitor.readAsDataURL(arquivo);
	}

	async function salvarEdicao(event) {
		event.preventDefault();
		setErro("");

		try {
			const response = await fetch(apiUrl(`/produtos/${produto.id}`), {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nome: formulario.nome,
					lote: formulario.lote,
					dataFabricacao: formulario.dataFabricacao,
					dataValidade: formulario.dataValidade,
					preco: Number(formulario.preco),
					estoqueAtual: Number(formulario.estoqueAtual),
					foto: formulario.foto || null,
					tag_ids: (formulario.tags ?? []).map((tag) => tag.id),
				}),
			});

			if (!response.ok) {
				throw new Error("Não foi possível editar o produto.");
			}

			aoAtualizar();
			aoFechar();
		} catch (error) {
			setErro(error.message);
		}
	}

	async function excluirProduto() {
		if (!window.confirm(`Excluir o produto "${produto.nome}"?`)) return;

		try {
			const response = await fetch(apiUrl(`/produtos/${produto.id}`), {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Não foi possível excluir o produto.");
			}

			aoAtualizar();
			aoFechar();
		} catch (error) {
			setErro(error.message);
		}
	}

	const campos = [
		["Lote", formulario.lote],
		["Data de fabricação", formulario.dataFabricacao],
		["Data de validade", formulario.dataValidade],
		[
			"Preço",
			Number(formulario.preco).toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL",
			}),
		],
		["Estoque atual", formulario.estoqueAtual],
	];
	const vencido = dataValidadeVencida(formulario.dataValidade);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				onClick={aoFechar}
				aria-label="Fechar modal"
				className="absolute inset-0 cursor-pointer bg-slate-950/70"
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="produto-modal-title"
				className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
			>
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
					<h2
						id="produto-modal-title"
						className="text-xl font-semibold text-slate-800"
					>
						Detalhes do produto
					</h2>
					<button
						type="button"
						onClick={aoFechar}
						aria-label="Fechar modal"
						className="cursor-pointer rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
					>
						Fechar
					</button>
				</div>

				{editando ? (
					<form onSubmit={salvarEdicao} className="p-6">
						<div className="grid gap-4 md:grid-cols-2">
							<label className="text-sm font-medium text-slate-700">
								Nome
								<input
									name="nome"
									value={formulario.nome}
									onChange={atualizarCampo}
									required
									className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Lote
								<input
									name="lote"
									value={formulario.lote}
									onChange={atualizarCampo}
									required
									className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Data de fabricação
								<input
									name="dataFabricacao"
									type="date"
									value={formulario.dataFabricacao}
									onChange={atualizarCampo}
									required
									className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Data de validade
								<input
									name="dataValidade"
									type="date"
									value={formulario.dataValidade}
									onChange={atualizarCampo}
									required
									className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Preço
								<input
									name="preco"
									type="number"
									min="0"
									step="0.01"
									value={formulario.preco}
									onChange={atualizarCampo}
									required
									className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700">
								Estoque atual
								<input
									name="estoqueAtual"
									type="number"
									min="0"
									step="1"
									value={formulario.estoqueAtual}
									onChange={atualizarCampo}
									required
									className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
								/>
							</label>

							<label className="text-sm font-medium text-slate-700 md:col-span-2">
								Foto do produto (opcional)
								<input
									type="file"
									accept="image/*"
									onChange={selecionarFoto}
									className="mt-2 block w-full rounded-lg border border-slate-300 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700"
								/>
							</label>

							<fieldset className="md:col-span-2">
								<legend className="mb-2 text-sm font-medium text-slate-700">
									Tags
								</legend>
								<div className="flex flex-wrap gap-2">
									{tagsDisponiveis.map((tag) => {
										const selecionada = (formulario.tags ?? []).some(
											(item) => item.id === tag.id,
										);
										return (
											<label
												key={tag.id}
												className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
													selecionada
														? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
														: "border border-blue-200 bg-blue-50 text-blue-700 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-sm"
												}`}
											>
												<input
													type="checkbox"
													className="sr-only"
													checked={selecionada}
													onChange={() => alternarTag(tag.id)}
												/>
												{tag.nome}
											</label>
										);
									})}
								</div>
							</fieldset>
						</div>

						{erro && (
							<p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
								{erro}
							</p>
						)}

						<div className="mt-6 flex gap-3">
							<button
								type="submit"
								className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
							>
								Salvar
							</button>
							<button
								type="button"
								onClick={() => {
									setFormulario(produto);
									setEditando(false);
									setErro("");
								}}
								className="cursor-pointer rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
							>
								Cancelar
							</button>
						</div>
					</form>
				) : (
					<div className="grid gap-6 p-6 md:grid-cols-[minmax(220px,0.8fr)_1.2fr]">
						<div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
							{produto.foto ? (
								<img
									src={produto.foto}
									alt={`Foto ampliada de ${produto.nome}`}
									className="h-80 w-full object-contain"
								/>
							) : (
								<span className="text-sm text-slate-400">Sem foto</span>
							)}
						</div>

						<div>
							<p className="text-sm font-medium text-slate-500">Nome</p>
							<p className="mb-5 text-lg font-semibold text-slate-800">
								{produto.nome}
							</p>

							{(produto.tags ?? []).length > 0 && (
								<div className="mb-5 flex flex-wrap gap-1">
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

							{vencido && (
								<div
									role="alert"
									className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
								>
									Produto com validade vencida
								</div>
							)}

							<div className="grid gap-4 sm:grid-cols-2">
								{campos.map(([rotulo, valor]) => (
									<div
										key={rotulo}
										className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
									>
										<p className="text-xs font-medium text-slate-500">
											{rotulo}
										</p>
										<p className="mt-1 font-medium text-slate-800">{valor}</p>
									</div>
								))}
							</div>
						</div>

						{erro && (
							<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 md:col-span-2">
								{erro}
							</p>
						)}

						<div className="flex gap-3 md:col-span-2">
							<button
								type="button"
								onClick={() => setEditando(true)}
								className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
							>
								Editar
							</button>
							<button
								type="button"
								onClick={excluirProduto}
								className="cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
							>
								Excluir
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
