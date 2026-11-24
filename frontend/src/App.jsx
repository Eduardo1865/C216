import { useState } from "react";
import ProdutoForm from "./components/ProdutoForm";
import ProdutoList from "./components/ProdutoList";
import TagSidebar from "./components/TagSidebar";

export default function App() {
	const [atualizacao, setAtualizacao] = useState(0);
	const [cadastroAberto, setCadastroAberto] = useState(false);
	const [tagSelecionada, setTagSelecionada] = useState(null);

	function atualizarLista() {
		setAtualizacao((valorAtual) => valorAtual + 1);
	}

	return (
		<main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-[1600px] space-y-6">
				<div className="flex justify-end">
					<button
						type="button"
						onClick={() => setCadastroAberto(true)}
						className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
					>
						Cadastrar novo produto
					</button>
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
