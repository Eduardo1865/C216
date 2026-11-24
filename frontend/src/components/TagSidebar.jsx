import { useEffect, useState } from "react";
import { apiUrl } from "../config/api";

export default function TagSidebar({
	tagSelecionada,
	aoSelecionarTag,
	atualizacao,
}) {
	const [tags, setTags] = useState([]);
	const [busca, setBusca] = useState("");
	const [novaTag, setNovaTag] = useState("");
	const [criando, setCriando] = useState(false);
	const [erro, setErro] = useState("");

	async function carregarTags() {
		try {
			const response = await fetch(apiUrl(`/tags/?atualizacao=${atualizacao}`));
			if (!response.ok) {
				throw new Error("Não foi possível buscar as tags.");
			}
			setTags(await response.json());
		} catch (error) {
			setErro(error.message);
		}
	}

	useEffect(() => {
		async function carregarAoAtualizar() {
			try {
				const response = await fetch(
					apiUrl(`/tags/?atualizacao=${atualizacao}`),
				);
				if (!response.ok) {
					throw new Error("Não foi possível buscar as tags.");
				}
				setTags(await response.json());
			} catch (error) {
				setErro(error.message);
			}
		}

		carregarAoAtualizar();
	}, [atualizacao]);

	function normalizarTexto(texto) {
		return String(texto ?? "")
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLocaleLowerCase("pt-BR");
	}

	const termoBusca = normalizarTexto(busca.trim());
	const tagsFiltradas = tags.filter((tag) =>
		normalizarTexto(tag.nome).includes(termoBusca),
	);

	async function criarTag(event) {
		event.preventDefault();
		setErro("");

		try {
			const response = await fetch(apiUrl("/tags/"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ nome: novaTag.trim() }),
			});

			if (!response.ok) {
				const dados = await response.json();
				throw new Error(dados.detail || "Não foi possível criar a tag.");
			}

			setNovaTag("");
			setCriando(false);
			await carregarTags();
		} catch (error) {
			setErro(error.message);
		}
	}

	return (
		<aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-8">
			<h2 className="text-lg font-semibold text-slate-800">Tags</h2>

			<label htmlFor="buscar-tag" className="sr-only">
				Buscar tags
			</label>
			<input
				id="buscar-tag"
				type="search"
				value={busca}
				onChange={(event) => setBusca(event.target.value)}
				placeholder="Buscar tags..."
				className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
			/>

			<div className="mt-3 space-y-1">
				<button
					type="button"
					onClick={() => aoSelecionarTag(null)}
					className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 ${
						tagSelecionada === null
							? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
							: "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
					}`}
				>
					Todas
				</button>
				{tagsFiltradas.map((tag) => (
					<button
						type="button"
						key={tag.id}
						onClick={() => aoSelecionarTag(tag)}
						className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 ${
							tagSelecionada?.id === tag.id
								? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
								: "text-slate-700 hover:translate-x-1 hover:bg-blue-50 hover:text-blue-700"
						}`}
					>
						{tag.nome}
					</button>
				))}
			</div>

			{criando ? (
				<form onSubmit={criarTag} className="mt-4 space-y-2">
					<input
						type="text"
						value={novaTag}
						onChange={(event) => setNovaTag(event.target.value)}
						required
						placeholder="Nome da tag"
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
					/>
					<div className="flex gap-2">
						<button
							type="submit"
							className="flex-1 cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							Criar
						</button>
						<button
							type="button"
							onClick={() => setCriando(false)}
							className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
						>
							Cancelar
						</button>
					</div>
				</form>
			) : (
				<button
					type="button"
					onClick={() => setCriando(true)}
					className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
				>
					Criar nova tag
				</button>
			)}

			{erro && (
				<p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
					{erro}
				</p>
			)}
		</aside>
	);
}
