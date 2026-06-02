import { test, expect } from "@playwright/test";
import { TestDrivesPage } from "../../pages/TestDrivesPage";
import { loginAsAdmin } from "../../utils/auth";

test.describe("Test Drives Lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("should navigate to test drives page", async ({ page }) => {
    const testDrives = new TestDrivesPage(page);

    await testDrives.goto();
    // Verificar que la página de test drives carga correctamente
    await expect(page.getByRole("heading", { name: /test drives/i })).toBeVisible();
  });
});
