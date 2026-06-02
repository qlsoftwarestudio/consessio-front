import { test, expect } from "@playwright/test";
import { OnboardingPage } from "../../pages/OnboardingPage";
import { createUniqueBusinessName, userFactory } from "../../fixtures/test-data";

const ADMIN_PASSWORD = "Test1234!";

test.describe("Onboarding", () => {
  const businessName = createUniqueBusinessName();
  const admin = userFactory({ password: ADMIN_PASSWORD });
  const cuit = "30-12345678-9";

  test.fixme(
    "should complete onboarding and redirect to dashboard",
    async ({ page }) => {
      // FIXME: Backend bug — onboarding siempre genera tenant code '178'
      // que ya existe en la DB. Esperar fix del backend para reactivar.
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
      await page.waitForURL("**/dashboard", { timeout: 15000 });
    }
  );

  test.fixme(
    "should login with the created admin user",
    async ({ page }) => {
      // FIXME: Depende del test anterior (onboarding) que está bloqueado
      // por bug del backend.
      await page.goto("/login");
      await page.locator("input[type='email']").fill(admin.email);
      await page.locator("input[type='password']").fill(admin.password);
      await page.locator("button[type='submit']").click();
      await page.waitForURL("**/dashboard", { timeout: 15000 });
      await expect(page.locator("text=Dashboard")).toBeVisible();
    }
  );
});
