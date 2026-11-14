import { describe, expect, it, vi } from "vitest";
import { createPerson, listPeople } from "../../src/services/people";

const person = {
  nome: "Ana Silva",
  cpf: "123.456.789-09",
  email: "ana.silva@exemplo.com",
  telefone: "(31) 99999-9999",
  endereco: "Rua das Flores, 100 - Belo Horizonte, MG",
};

describe("people service", () => {
  it("lists people from the API", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, ...person }],
    });

    await expect(listPeople()).resolves.toEqual([{ id: 1, ...person }]);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/people",
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("reports API errors when creating a duplicate person", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: "Já existe uma pessoa com esse nome" }),
    });

    await expect(createPerson(person)).rejects.toThrow(
      "Já existe uma pessoa com esse nome",
    );
  });
});
