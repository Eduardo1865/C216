import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProdutoList from "../../src/components/ProdutoList";

const produtos = Array.from({ length: 12 }, (_, indice) => ({
	id: indice + 1,
	nome: `Produto ${indice + 1}`,
	lote: `Lote ${indice + 1}`,
	dataFabricacao: "2025-01-01",
	dataValidade: indice < 2 ? "2000-01-01" : "2099-01-01",
	preco: 10,
	estoqueAtual: 5,
	tags: [],
}));

describe("ProdutoList", () => {
	beforeEach(() => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => produtos,
			}),
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("mostra 10 produtos por vez e filtra se tem validade vencida", async () => {
		render(
			<ProdutoList
				atualizacao={0}
				aoAtualizar={() => {}}
				tagSelecionada={null}
			/>,
		);

		await waitFor(() => {
			expect(screen.getAllByRole("row")).toHaveLength(11);
		});

		fireEvent.click(screen.getByRole("button", { name: "Próxima" }));
		expect(screen.getAllByRole("row")).toHaveLength(3);
		expect(screen.getByText("Produto 11")).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("checkbox", {
				name: "Mostrar apenas produtos vencidos",
			}),
		);

		expect(screen.getAllByRole("row")).toHaveLength(3);
		expect(screen.getByText("Produto 1")).toBeInTheDocument();
		expect(screen.getByText("Produto 2")).toBeInTheDocument();
		expect(screen.queryByText("Produto 3")).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Próxima" })).toBeNull();
	});
});
