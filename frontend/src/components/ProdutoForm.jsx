import { useEffect, useState } from "react";
import { apiUrl } from "../config/api";

export default function ProdutoForm({ aoCadastrar, aoFechar }) {
	const [nome, setNome] = useState("");
	const [lote, setLote] = useState("");
	const [dataFabricacao, setDataFabricacao] = useState("");
	const [dataValidade, setDataValidade] = useState("");
	const [preco, setPreco] = useState("");
	const [estoqueAtual, setEstoqueAtual] = useState("");
	const [foto, setFoto] = useState("");
	const [erro, setErro] = useState("");

	useEffect(() => {
		function fecharComEscape(event) {
			if (event.key === "Escape") {
				aoFechar();
			}
		}

		document.addEventListener("keydown", fecharComEscape);
		return () => document.removeEventListener("keydown", fecharComEscape);
	}, [aoFechar]);

	function selecionarFoto(event) {
		const arquivo = event.target.files?.[0];
		setErro("");

		if (!arquivo) {
			setFoto("");
			return;
		}

		if (!arquivo.type.startsWith("image/")) {
			setErro("Selecione um arquivo de imagem válido.");
			event.target.value = "";
			setFoto("");
			return;
		}

		const leitor = new FileReader();
		leitor.onload = () => setFoto(String(leitor.result));
		leitor.onerror = () => setErro("Não foi possível ler a imagem.");
		leitor.readAsDataURL(arquivo);
	}

	async function cadastrarProduto(event) {
		event.preventDefault();
		setErro("");

		const novoProduto = {
			nome,
			lote,
			dataFabricacao,
			dataValidade,
			preco: Number(preco),
			estoqueAtual: Number(estoqueAtual),
			foto: foto || null,
		};

		try {
			const response = await fetch(apiUrl("/produtos/"), {
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
			setLote("");
			setDataFabricacao("");
			setDataValidade("");
			setPreco("");
			setEstoqueAtual("");
			setFoto("");
			event.target.reset();
			aoFechar();
		} catch (error) {
			console.error(error);
			setErro(error.message);
		}
	}

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
				aria-labelledby="cadastro-produto-title"
				className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
			>
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
					<h2
						id="cadastro-produto-title"
						className="text-xl font-semibold text-slate-800"
					>
						Cadastrar produto
					</h2>
					<button
						type="button"
						onClick={aoFechar}
						className="cursor-pointer rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
					>
						Fechar
					</button>
				</div>

				<form onSubmit={cadastrarProduto} className="p-6">
					<div className="grid gap-4 md:grid-cols-2">
				<div>
					<label
						htmlFor="nome"
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
					<label
						htmlFor="lote"
						className="mb-2 block text-sm font-medium text-slate-700"
					>
						Lote
					</label>
					<input
						id="lote"
						type="text"
						value={lote}
						onChange={(event) => setLote(event.target.value)}
						required
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					/>
				</div>

				<div>
					<label
						htmlFor="dataFabricacao"
						className="mb-2 block text-sm font-medium text-slate-700"
					>
						Data de fabricação
					</label>
					<input
						id="dataFabricacao"
						type="date"
						value={dataFabricacao}
						onChange={(event) => setDataFabricacao(event.target.value)}
						required
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					/>
				</div>

				<div>
					<label
						htmlFor="dataValidade"
						className="mb-2 block text-sm font-medium text-slate-700"
					>
						Data de validade
					</label>
					<input
						id="dataValidade"
						type="date"
						value={dataValidade}
						onChange={(event) => setDataValidade(event.target.value)}
						required
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					/>
				</div>

				<div>
					<label
						htmlFor="preco"
						className="mb-2 block text-sm font-medium text-slate-700"
					>
						Preço
					</label>
					<input
						id="preco"
						type="number"
						min="0"
						step="0.01"
						value={preco}
						onChange={(event) => setPreco(event.target.value)}
						required
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					/>
				</div>

				<div>
					<label
						htmlFor="estoqueAtual"
						className="mb-2 block text-sm font-medium text-slate-700"
					>
						Estoque atual
					</label>
					<input
						id="estoqueAtual"
						type="number"
						min="0"
						step="1"
						value={estoqueAtual}
						onChange={(event) => setEstoqueAtual(event.target.value)}
						required
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					/>
				</div>

				<div className="md:col-span-2">
					<label
						htmlFor="foto"
						className="mb-2 block text-sm font-medium text-slate-700"
					>
						Foto do produto
					</label>
					<input
						id="foto"
						type="file"
						accept="image/*"
						onChange={selecionarFoto}
						className="block w-full rounded-lg border border-slate-300 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-100"
					/>

					{foto && (
						<img
							src={foto}
							alt="Prévia do produto"
							className="mt-3 h-40 w-40 rounded-lg border border-slate-200 object-cover"
						/>
					)}
				</div>
					</div>

					{erro && (
						<p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
							{erro}
						</p>
					)}

					<div className="mt-6 flex gap-3">
						<button
							type="submit"
							className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
						>
							Cadastrar
						</button>
						<button
							type="button"
							onClick={aoFechar}
							className="cursor-pointer rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
						>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
