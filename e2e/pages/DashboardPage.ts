import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectOnDashboard() {
    await this.page.waitForURL("**/app", { timeout: 15000 });
    await this.page.waitForSelector("text=Dashboard", { timeout: 10000 });
  }

  async expectUserNameVisible(name: string) {
    await this.page.waitForSelector(`text=${name}`, { timeout: 10000 });
  }

  async clickMenuItem(label: string) {
    await this.page.locator(`nav a:has-text("${label}"), [role="navigation"] a:has-text("${label}")`).first().click();
  }
}
