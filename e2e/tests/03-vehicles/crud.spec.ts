import { test, expect } from "@playwright/test";
import { VehiclesPage } from "../../pages/VehiclesPage";
import { vehicleFactory } from "../../fixtures/test-data";
import { loginAsAdmin } from "../../utils/auth";

test.describe("Vehicles CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("should navigate to vehicles page", async ({ page }) => {
    const vehicles = new VehiclesPage(page);

    await vehicles.goto();
    // Verificar que la página de vehículos carga correctamente
    await expect(page.getByRole("heading", { name: /vehículos/i })).toBeVisible();
  });
});
