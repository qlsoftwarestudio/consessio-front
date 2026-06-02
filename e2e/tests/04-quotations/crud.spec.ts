import { test, expect } from "@playwright/test";
import { QuotationsPage } from "../../pages/QuotationsPage";
import { loginAsAdmin } from "../../utils/auth";

test.describe("Quotations CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.fixme("should create a new quotation", async ({ page }) => {
    // FIXME: Frontend no carga organization del backend en signIn.
    // AppLayout.tsx redirige a /onboarding, bloqueando acceso al dashboard.
    const quotations = new QuotationsPage(page);

    await quotations.goto();
    await quotations.createQuotation({
      type: "CONTADO",
      amount: "25000000",
    });

    // Expect success toast or redirect
    await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 10000 });
  });
});
