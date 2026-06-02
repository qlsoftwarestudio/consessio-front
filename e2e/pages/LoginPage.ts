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

  async fillEmail(email: string) {
    await this.page.locator("input[type='email']").fill(email);
  }

  async fillPassword(password: string) {
    await this.page.locator("input[type='password']").fill(password);
  }

  async clickSubmit() {
    await this.page.locator("button[type='submit']").click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async expectOnLoginPage() {
    await this.page.waitForSelector("text=Iniciar sesión", { timeout: 10000 });
  }
}
