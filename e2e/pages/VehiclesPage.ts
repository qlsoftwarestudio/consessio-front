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

  // Los labels del diálogo son <div> genéricos, no <label>.
  // Usamos selectores por role dentro del diálogo.
  async selectBrand(brand: string) {
    // Primer combobox dentro del diálogo = Marca
    await this.page.locator('[role="dialog"] [role="combobox"]').first().click();
    await this.page.getByRole("option", { name: brand }).click();
  }

  async fillModel(model: string) {
    // Primer textbox dentro del diálogo = Modelo
    await this.page.locator('[role="dialog"] [role="textbox"]').first().fill(model);
  }

  async fillVersion(version: string) {
    // Segundo textbox = Versión
    await this.page.locator('[role="dialog"] [role="textbox"]').nth(1).fill(version);
  }

  async fillColor(color: string) {
    // Tercer textbox = Color
    await this.page.locator('[role="dialog"] [role="textbox"]').nth(2).fill(color);
  }

  async fillYear(year: string) {
    // Primer spinbutton = Año
    await this.page.locator('[role="dialog"] [role="spinbutton"]').first().fill(year);
  }

  async fillKm(km: string) {
    // Segundo spinbutton = Km
    await this.page.locator('[role="dialog"] [role="spinbutton"]').nth(1).fill(km);
  }

  async selectCondition(condition: string) {
    // Segundo combobox = Condición
    await this.page.locator('[role="dialog"] [role="combobox"]').nth(1).click();
    await this.page.getByRole("option", { name: condition }).click();
  }

  async fillPrice(price: string) {
    // Tercer spinbutton = Precio (ARS)
    await this.page.locator('[role="dialog"] [role="spinbutton"]').nth(2).fill(price);
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
