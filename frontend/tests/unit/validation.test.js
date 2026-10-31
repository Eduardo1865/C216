import { describe, expect, it } from "vitest";
import { validateItem } from "../../src/validation";

describe("validateItem", () => {
  it("requires a name", () => {
    expect(validateItem({ name: "", description: "Descrição" })).toBe(
      "O nome é obrigatório.",
    );
  });

  it("requires a description", () => {
    expect(validateItem({ name: "Item", description: "" })).toBe(
      "A descrição é obrigatória.",
    );
  });

  it("accepts a complete item", () => {
    expect(validateItem({ name: "Item", description: "Descrição" })).toBe("");
  });
});
