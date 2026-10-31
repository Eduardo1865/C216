import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../../src/App";

describe("App", () => {
  it("shows all local data generators", () => {
    render(<App />);

    expect(screen.getByText("Gere dados de teste")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Gerar CPF" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Pessoa completa")).toBeInTheDocument();
  });
});
