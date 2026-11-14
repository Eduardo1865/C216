import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../../src/App";

describe("App", () => {
  it("shows the local data generators, including a complete person", () => {
    render(<App />);

    expect(screen.getByText("Gere dados de teste")).toBeInTheDocument();
    for (const label of ["CPF", "E-mail", "Nome", "Pessoa completa"]) {
      expect(
        screen.getByRole("button", { name: `Gerar ${label}` }),
      ).toBeInTheDocument();
    }
  });
});
