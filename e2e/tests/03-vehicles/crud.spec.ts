import { test, expect } from "@playwright/test";
import { VehiclesPage } from "../../pages/VehiclesPage";
import { vehicleFactory } from "../../fixtures/test-data";
import { loginAsAdmin } from "../../utils/auth";

test.describe("Vehicles CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("should create a new vehicle", async ({ page }) => {
    const vehicles = new VehiclesPage(page);
    const vehicle = vehicleFactory();

    await vehicles.goto();
    await vehicles.createVehicle({
      brand: vehicle.brand,
      model: vehicle.model,
      version: vehicle.version,
      color: vehicle.color,
      year: String(vehicle.year),
      km: vehicle.km,
      condition: vehicle.condition,
      price: vehicle.price,
    });

    await vehicles.expectVehicleCreated();
  });
});
