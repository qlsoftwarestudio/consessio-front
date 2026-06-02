import { test, expect } from "@playwright/test";
import { TestDrivesPage } from "../../pages/TestDrivesPage";
import { loginAsAdmin } from "../../utils/auth";

test.describe("Test Drives Lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.fixme("should create, confirm and complete a test drive", async ({ page }) => {
    // FIXME: Login redirige a /onboarding en lugar de /dashboard.
    const testDrives = new TestDrivesPage(page);

    // Schedule test drive for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateTime = tomorrow.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm

    await testDrives.goto();
    await testDrives.createTestDrive({
      scheduledAt: dateTime,
    });

    // Confirm
    await testDrives.clickConfirm();
    await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 10000 });

    // Complete
    await testDrives.clickComplete();
    await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 10000 });
  });
});
