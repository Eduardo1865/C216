import { describe, expect, it } from "vitest";
import {
  generateCpf,
  generateEmail,
  generateFullPerson,
  generateName,
} from "../../src/generator";

describe("local generators", () => {
  it("generates a formatted CPF", () => {
    expect(generateCpf()).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  });

  it("generates an example email", () => {
    expect(generateEmail()).toMatch(/^[a-z.]+\d+@exemplo\.com$/);
  });

  it("generates a name and a complete person", () => {
    expect(generateName()).toContain(" ");
    expect(generateFullPerson()).toEqual(
      expect.objectContaining({
        nome: expect.any(String),
        cpf: expect.any(String),
        email: expect.stringContaining("@exemplo.com"),
        telefone: expect.any(String),
        endereco: expect.any(String),
      }),
    );
  });
});
