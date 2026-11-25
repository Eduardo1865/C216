import { useRef, useState } from "react";
import ProdutoForm from "./components/ProdutoForm";
import ProdutoList from "./components/ProdutoList";
import TagSidebar from "./components/TagSidebar";
import { apiUrl } from "./config/api";

export default function App() {
	const [atualizacao, setAtualizacao] = useState(0);
	const [cadastroAberto, setCadastroAberto] = useState(false);
	const [tagSelecionada, setTagSelecionada] = useState(null);
	const [importando, setImportando] = useState(false);
	const [mensagemImportacao, setMensagemImportacao] = useState("");
	const [erroImportacao, setErroImportacao] = useState(false);
	const campoPlanilha = useRef(null);

	function atualizarLista() {
		setAtualizacao((valorAtual) => valorAtual + 1);
	}

	async function importarPlanilha(event) {
		const campo = event.currentTarget;
		const arquivo = campo.files?.[0];
		campo.value = "";
		if (!arquivo) return;

		setImportando(true);
		setMensagemImportacao("");
		setErroImportacao(false);

		const dados = new FormData();
		dados.append("planilha", arquivo);

		try {
			const response = await fetch(apiUrl("/produtos/importar"), {
				method: "POST",
				body: dados,
			});
			const resultado = await response.json();
			if (!response.ok) {
				throw new Error(
					resultado.detail || "Não foi possível importar a planilha.",
				);
			}

			setMensagemImportacao(
				`${resultado.quantidade} produtos importados com sucesso.`,
			);
			atualizarLista();
		} catch (error) {
			setMensagemImportacao(error.message);
			setErroImportacao(true);
		} finally {
			setImportando(false);
		}
	}

	return (
		<main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-[1600px] space-y-6">
				<div className="flex flex-col items-end gap-3">
					<div className="flex flex-wrap justify-end gap-3">
						<input
							ref={campoPlanilha}
							type="file"
							accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
							onChange={importarPlanilha}
							className="hidden"
							aria-label="Selecionar planilha de produtos"
						/>
						<button
							type="button"
							onClick={() => campoPlanilha.current?.click()}
							disabled={importando}
							className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
						>
							{importando ? "Importando..." : "Importar planilha"}
						</button>
						<button
							type="button"
							onClick={() => setCadastroAberto(true)}
							className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
						>
							Cadastrar novo produto
						</button>
					</div>
					{mensagemImportacao && (
						<p
							role={erroImportacao ? "alert" : "status"}
							className={`text-sm ${
								erroImportacao ? "text-red-700" : "text-green-700"
							}`}
						>
							{mensagemImportacao}
						</p>
					)}
				</div>

				{cadastroAberto && (
					<ProdutoForm
						aoCadastrar={atualizarLista}
						aoFechar={() => setCadastroAberto(false)}
					/>
				)}
				<div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
					<TagSidebar
						tagSelecionada={tagSelecionada}
						aoSelecionarTag={setTagSelecionada}
						atualizacao={atualizacao}
					/>
					<ProdutoList
						atualizacao={atualizacao}
						aoAtualizar={atualizarLista}
						tagSelecionada={tagSelecionada}
					/>
				</div>
			</div>
		</main>
	);
}
