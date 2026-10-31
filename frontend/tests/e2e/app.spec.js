import { expect, test } from "@playwright/test";

test("gera um CPF e exibe o resultado", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Gerar CPF" }).click();

  await expect(page.getByText("Resultado gerado")).toBeVisible();
  await expect(page.locator(".result-card h2")).toHaveText("CPF");
});

test("navega para o histórico local", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Gerar CPF" }).click();
  await page.getByRole("button", { name: /Histórico/ }).click();

  await expect(page.getByText("Histórico local")).toBeVisible();
  await expect(page.getByText("CPF")).toBeVisible();
});
