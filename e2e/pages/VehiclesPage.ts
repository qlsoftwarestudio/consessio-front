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
    await this.page.getByRole("button", { name: /nuevo vehículo/i }).click();
  }

  async selectBrand(brand: string) {
    await this.page.getByLabel("Marca").click();
    await this.page.getByRole("option", { name: brand }).click();
  }

  async fillModel(model: string) {
    await this.page.getByLabel("Modelo").fill(model);
  }

  async fillVersion(version: string) {
    await this.page.getByLabel("Versión").fill(version);
  }

  async fillColor(color: string) {
    await this.page.getByLabel("Color").fill(color);
  }

  async fillYear(year: string) {
    await this.page.getByLabel("Año").fill(year);
  }

  async fillKm(km: string) {
    await this.page.getByLabel("Km").fill(km);
  }

  async selectCondition(condition: string) {
    await this.page.getByLabel("Condición").click();
    await this.page.getByRole("option", { name: condition }).click();
  }

  async fillPrice(price: string) {
    await this.page.getByLabel("Precio (ARS)").fill(price);
  }

  async submitForm() {
    await this.page.getByRole("button", { name: /agregar/i }).click();
  }

  async createVehicle(data: { brand: string; model: string; version?: string; color?: string; year: string; km?: string; condition?: string; price: string }) {
    await this.clickNewVehicle();
    await this.selectBrand(data.brand);
    await this.fillModel(data.model);
    if (data.version) await this.fillVersion(data.version);
    if (data.color) await this.fillColor(data.color);
    await this.fillYear(data.year);
    if (data.km) await this.fillKm(data.km);
    if (data.condition) await this.selectCondition(data.condition);
    await this.fillPrice(data.price);
    await this.submitForm();
  }

  async expectVehicleCreated() {
    await this.page.waitForURL("**/app/vehiculos", { timeout: 10000 });
    await this.page.getByRole("heading", { name: /vehículos/i }).waitFor({ state: "visible", timeout: 10000 });
  }
}
