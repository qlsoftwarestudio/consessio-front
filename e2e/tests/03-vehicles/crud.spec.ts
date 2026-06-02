import { test, expect } from "@playwright/test";
import { VehiclesPage } from "../../pages/VehiclesPage";
import { vehicleFactory } from "../../fixtures/test-data";
import { loginAsAdmin } from "../../utils/auth";

test.describe("Vehicles CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.fixme("should create a new vehicle", async ({ page }) => {
    // FIXME: Ajustar selectores a UI real
    const vehicles = new VehiclesPage(page);
    const vehicle = vehicleFactory();

    await vehicles.goto();
    await vehicles.createVehicle({
      vin: vehicle.vin,
      brand: vehicle.brand,
      model: vehicle.model,
      year: String(vehicle.year),
      priceList: String(vehicle.priceList),
    });

    await vehicles.expectVehicleInTable(vehicle.vin);
  });
});
