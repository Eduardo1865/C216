import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../../src/App";

describe("generator flow integration", () => {
  it("generates a CPF and adds it to local history", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Gerar CPF" }));

    expect(screen.getByText("Resultado gerado")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "CPF" })).toHaveLength(2);
    expect(screen.getByRole("button", { name: /Histórico/ })).toHaveTextContent(
      "1",
    );
  });

  it("shows complete person data in the result", () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "Gerar Pessoa completa" }),
    );

    expect(screen.getByText("nome")).toBeInTheDocument();
    expect(screen.getByText("telefone")).toBeInTheDocument();
    expect(screen.getByText("endereco")).toBeInTheDocument();
  });
});
