import { useState } from "react";
import ProdutoForm from "./components/ProdutoForm";
import ProdutoList from "./components/ProdutoList";

export default function App() {
	const [atualizacao, setAtualizacao] = useState(0);
	const [cadastroAberto, setCadastroAberto] = useState(false);

	function atualizarLista() {
		setAtualizacao((valorAtual) => valorAtual + 1);
	}

	return (
		<main className="min-h-screen bg-slate-100 px-4 py-10">
			<div className="mx-auto max-w-5xl space-y-6">
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
				<ProdutoList atualizacao={atualizacao} aoAtualizar={atualizarLista} />
			</div>
		</main>
	);
}
