import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class QuotationsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/quotations");
    await this.page.waitForURL("**/quotations", { timeout: 10000 });
  }

  async clickNewQuotation() {
    await this.page.locator("button:has-text('Nueva cotización'), button:has-text('Agregar')").first().click();
  }

  async selectLead(leadName: string) {
    await this.page.locator("select[name='leadId']").selectOption({ label: leadName });
  }

  async selectVehicle(vehicleVin: string) {
    await this.page.locator("select[name='vehicleId']").selectOption({ label: vehicleVin });
  }

  async selectType(type: string) {
    await this.page.locator("select[name='type']").selectOption(type);
  }

  async fillAmount(amount: string) {
    await this.page.locator("input[name='amount'], input[name='totalAmount']").first().fill(amount);
  }

  async submitForm() {
    await this.page.locator("button[type='submit']").last().click();
  }

  async createQuotation(data: { leadName?: string; vehicleVin?: string; type: string; amount: string }) {
    await this.clickNewQuotation();
    if (data.leadName) {
      await this.selectLead(data.leadName);
    }
    if (data.vehicleVin) {
      await this.selectVehicle(data.vehicleVin);
    }
    await this.selectType(data.type);
    await this.fillAmount(data.amount);
    await this.submitForm();
  }
}
