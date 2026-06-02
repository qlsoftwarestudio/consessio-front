import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class TestDrivesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/test-drives");
    await this.page.waitForURL("**/test-drives", { timeout: 10000 });
  }

  async clickNewTestDrive() {
    await this.page.locator("button:has-text('Nuevo test drive'), button:has-text('Agregar')").first().click();
  }

  async selectLead(leadName: string) {
    await this.page.locator("select[name='leadId']").selectOption({ label: leadName });
  }

  async selectVehicle(vehicleVin: string) {
    await this.page.locator("select[name='vehicleId']").selectOption({ label: vehicleVin });
  }

  async fillDateTime(dateTime: string) {
    await this.page.locator("input[type='datetime-local'], input[name='scheduledAt']").first().fill(dateTime);
  }

  async submitForm() {
    await this.page.locator("button[type='submit']").last().click();
  }

  async createTestDrive(data: { leadName?: string; vehicleVin?: string; scheduledAt: string }) {
    await this.clickNewTestDrive();
    if (data.leadName) {
      await this.selectLead(data.leadName);
    }
    if (data.vehicleVin) {
      await this.selectVehicle(data.vehicleVin);
    }
    await this.fillDateTime(data.scheduledAt);
    await this.submitForm();
  }

  async clickConfirm() {
    await this.page.locator("button:has-text('Confirmar')").first().click();
  }

  async clickComplete() {
    await this.page.locator("button:has-text('Completar')").first().click();
  }

  async clickCancel() {
    await this.page.locator("button:has-text('Cancelar')").first().click();
  }
}
