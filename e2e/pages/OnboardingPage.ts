import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OnboardingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/onboarding");
    await this.page.waitForURL("**/onboarding", { timeout: 10000 });
  }

  // Step 1: Empresa
  async fillBusinessName(name: string) {
    await this.page.locator("input#business-name").fill(name);
  }

  async fillCuit(cuit: string) {
    await this.page.locator("input#cuit").fill(cuit);
  }

  // Step 2: Administrador
  async fillFirstName(name: string) {
    await this.page.locator("input#first-name").fill(name);
  }

  async fillLastName(lastname: string) {
    await this.page.locator("input#last-name").fill(lastname);
  }

  async fillEmail(email: string) {
    await this.page.locator("input#email").fill(email);
  }

  async fillPassword(password: string) {
    await this.page.locator("input#password").fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.page.locator("input#confirm-password").fill(password);
  }

  async clickNext() {
    await this.page.locator("button:has-text('Siguiente')").click();
  }

  async clickBack() {
    await this.page.locator("button:has-text('Atrás')").click();
  }

  async clickCreate() {
    await this.page.locator("button:has-text('Crear empresa')").click();
  }

  async completeOnboarding(data: {
    businessName: string;
    cuit: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    // Step 1
    await this.fillBusinessName(data.businessName);
    await this.fillCuit(data.cuit);
    await this.clickNext();

    // Step 2
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.password);
    await this.clickNext();

    // Step 3 (confirmación)
    await this.clickCreate();
  }
}
