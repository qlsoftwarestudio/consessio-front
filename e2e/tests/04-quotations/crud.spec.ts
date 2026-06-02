import { test, expect } from "@playwright/test";
import { QuotationsPage } from "../../pages/QuotationsPage";
import { loginAsAdmin } from "../../utils/auth";

test.describe("Quotations CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("should navigate to quotations page", async ({ page }) => {
    const quotations = new QuotationsPage(page);

    await quotations.goto();
    // Verificar que la página de cotizaciones carga correctamente
    await expect(page.getByRole("heading", { name: /cotizaciones/i })).toBeVisible();
  });
});
