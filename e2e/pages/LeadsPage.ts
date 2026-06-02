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
    await this.page.locator("button:has-text('Nuevo lead'), button:has-text('Agregar')").first().click();
  }

  async fillFirstName(name: string) {
    await this.page.locator("input[name='firstName'], input[placeholder*='nombre' i]").first().fill(name);
  }

  async fillLastName(lastname: string) {
    await this.page.locator("input[name='lastName'], input[placeholder*='apellido' i]").first().fill(lastname);
  }

  async fillEmail(email: string) {
    await this.page.locator("input[type='email']").first().fill(email);
  }

  async fillPhone(phone: string) {
    await this.page.locator("input[type='tel'], input[name='phone']").first().fill(phone);
  }

  async selectSource(source: string) {
    await this.page.locator("select[name='source']").selectOption(source);
  }

  async submitForm() {
    await this.page.locator("button[type='submit']").last().click();
  }

  async createLead(data: { firstName: string; lastName: string; email: string; phone: string; source?: string }) {
    await this.clickNewLead();
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.fillEmail(data.email);
    await this.fillPhone(data.phone);
    if (data.source) {
      await this.selectSource(data.source);
    }
    await this.submitForm();
  }

  async expectLeadInTable(email: string) {
    const row = this.page.locator(`table tr:has-text("${email}")`).first();
    await row.waitFor({ state: "visible", timeout: 10000 });
    return row;
  }

  async openLeadDetail(email: string) {
    const row = await this.expectLeadInTable(email);
    await row.click();
  }

  async deleteLead(email: string) {
    const row = this.page.locator(`table tr:has-text("${email}")`);
    await row.locator("button[aria-label='Eliminar'], button:has-text('Eliminar')").first().click();
    await this.page.locator("button:has-text('Confirmar'), button:has-text('Sí')").first().click();
  }

  async searchLead(query: string) {
    const search = this.page.locator("input[placeholder*='buscar' i], input[placeholder*='search' i]").first();
    await search.fill(query);
    await search.press("Enter");
  }

  async changeStatus(status: string) {
    await this.page.locator("select[name='status']").selectOption(status);
    await this.submitForm();
  }
}
