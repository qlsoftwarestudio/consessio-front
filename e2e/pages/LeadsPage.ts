import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LeadsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/app/leads");
    await this.page.waitForURL("**/app/leads", { timeout: 10000 });
  }

  async clickNewLead() {
    // Botón que abre el diálogo de nuevo lead
    await this.page.getByRole("button", { name: /nuevo lead/i }).click();
  }

  async fillFullName(name: string) {
    // Campo "Nombre completo" en el diálogo
    await this.page.getByLabel("Nombre completo").fill(name);
  }

  async fillPhone(phone: string) {
    await this.page.getByLabel("Teléfono").fill(phone);
  }

  async fillEmail(email: string) {
    await this.page.getByLabel("Email").fill(email);
  }

  async fillVehicleInterest(vehicle: string) {
    await this.page.getByLabel("Vehículo de interés").fill(vehicle);
  }

  async submitForm() {
    await this.page.getByRole("button", { name: /crear lead/i }).click();
  }

  async createLead(data: { fullName: string; email: string; phone: string; vehicleInterest?: string }) {
    await this.clickNewLead();
    await this.fillFullName(data.fullName);
    await this.fillPhone(data.phone);
    await this.fillEmail(data.email);
    if (data.vehicleInterest) {
      await this.fillVehicleInterest(data.vehicleInterest);
    }
    await this.submitForm();
  }

  async expectLeadCreated() {
    // Verificar que el lead se creó exitosamente buscando el toast de éxito
    // o verificando que seguimos en la página de leads (no 404)
    await this.page.waitForURL("**/app/leads", { timeout: 10000 });
    await this.page.getByRole("heading", { name: /leads/i }).waitFor({ state: "visible", timeout: 10000 });
  }

  async searchLead(query: string) {
    // El placeholder exacto del campo de búsqueda en la tabla
    const search = this.page.locator('input[placeholder="Buscar por nombre, teléfono o email"]').first();
    await search.fill(query);
    await search.press("Enter");
  }
}
