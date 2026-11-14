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
  await page.reload();
  await expect(page.getByText("Histórico local")).toBeVisible();
  await expect(page.getByText("CPF")).toBeVisible();
});

test("persiste uma pessoa cadastrada após recarregar a página", async ({
  page,
}) => {
  let people = [];
  await page.route("**/people", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: people });
      return;
    }

    const body = route.request().postDataJSON();
    const saved = { id: 1, ...body };
    people = [saved];
    await route.fulfill({ status: 201, json: saved });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Gerar Pessoa completa" }).click();
  await page.getByRole("button", { name: "Cadastrar pessoa" }).click();
  await expect(page.getByText("Pessoa cadastrada com sucesso.")).toBeVisible();

  const personName = await page.locator(".people-list strong").textContent();
  await page.reload();

  await expect(page.locator(".people-list strong")).toHaveText(personName);
});

test("exibe erro ao cadastrar a mesma pessoa novamente", async ({ page }) => {
  await page.route("**/people", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: [] });
      return;
    }

    await route.fulfill({
      status: 409,
      contentType: "application/json",
      body: JSON.stringify({ detail: "Já existe uma pessoa com esse nome" }),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Gerar Pessoa completa" }).click();
  await page.getByRole("button", { name: "Cadastrar pessoa" }).click();

  await expect(
    page.getByText("Já existe uma pessoa com esse nome"),
  ).toBeVisible();
});
