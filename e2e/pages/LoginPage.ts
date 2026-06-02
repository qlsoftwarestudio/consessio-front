import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/login");
    await this.page.waitForURL("**/login", { timeout: 10000 });
  }

  async fillTenantCode(code: string) {
    await this.page.getByLabel("Código de empresa").fill(code);
  }

  async fillEmail(email: string) {
    await this.page.locator("input[type='email']").fill(email);
  }

  async fillPassword(password: string) {
    await this.page.locator("input[type='password']").fill(password);
  }

  async clickSubmit() {
    await this.page.locator("button[type='submit']").click();
  }

  async login(tenantCode: string, email: string, password: string) {
    await this.fillTenantCode(tenantCode);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async expectOnLoginPage() {
    await this.page.waitForSelector("text=Iniciá sesión", { timeout: 10000 });
  }
}
