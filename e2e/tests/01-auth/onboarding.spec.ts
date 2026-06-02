import { test, expect } from "@playwright/test";
import { OnboardingPage } from "../../pages/OnboardingPage";
import { createUniqueBusinessName, userFactory } from "../../fixtures/test-data";

const ADMIN_PASSWORD = "Test1234!";

test.describe("Onboarding", () => {
  const businessName = createUniqueBusinessName();
  const admin = userFactory({ password: ADMIN_PASSWORD });
  const cuit = "30-12345678-9";

  test("should complete onboarding and redirect to app", async ({ page }) => {
    const onboarding = new OnboardingPage(page);
    await onboarding.goto();
    await onboarding.completeOnboarding({
      businessName,
      cuit,
      firstName: admin.name,
      lastName: admin.lastname,
      email: admin.email,
      password: admin.password,
    });
    await page.waitForURL("**/app", { timeout: 15000 });
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });

  test.fixme("should login with the created admin user", async ({ page }) => {
    // FIXME: Necesitamos el tenant code generado por el backend en el onboarding anterior.
    // El backend no lo devuelve en la respuesta de onboarding. Requiere fix del backend
    // o guardar el tenant code de alguna forma.
    await page.goto("/login");
    await page.getByLabel("Código de empresa").fill("DEM"); // placeholder — usar tenant code real
    await page.locator("input[type='email']").fill(admin.email);
    await page.locator("input[type='password']").fill(admin.password);
    await page.locator("button[type='submit']").click();
    await page.waitForURL("**/app", { timeout: 15000 });
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });
});
