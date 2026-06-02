import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class VehiclesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/app/vehiculos");
    await this.page.waitForURL("**/app/vehiculos", { timeout: 10000 });
  }

  async clickNewVehicle() {
    await this.page.locator("button:has-text('Nuevo vehículo'), button:has-text('Agregar')").first().click();
  }

  async fillVin(vin: string) {
    await this.page.locator("input[name='vin'], input[placeholder*='VIN' i]").first().fill(vin);
  }

  async fillBrand(brand: string) {
    await this.page.locator("input[name='brand'], input[placeholder*='marca' i]").first().fill(brand);
  }

  async fillModel(model: string) {
    await this.page.locator("input[name='model'], input[placeholder*='modelo' i]").first().fill(model);
  }

  async fillYear(year: string) {
    await this.page.locator("input[name='year'], input[type='number']").first().fill(year);
  }

  async fillPrice(price: string) {
    await this.page.locator("input[name='priceList'], input[name='price'], input[placeholder*='precio' i]").first().fill(price);
  }

  async submitForm() {
    await this.page.locator("button[type='submit']").last().click();
  }

  async createVehicle(data: { vin: string; brand: string; model: string; year: string; priceList: string }) {
    await this.clickNewVehicle();
    await this.fillVin(data.vin);
    await this.fillBrand(data.brand);
    await this.fillModel(data.model);
    await this.fillYear(data.year);
    await this.fillPrice(data.priceList);
    await this.submitForm();
  }

  async expectVehicleInTable(vin: string) {
    const row = this.page.locator(`table tr:has-text("${vin}")`).first();
    await row.waitFor({ state: "visible", timeout: 10000 });
    return row;
  }
}
