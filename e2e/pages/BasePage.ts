import type { Page, Locator } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForToast(title: string) {
    const toast = this.page.locator(`[data-sonner-toast]:has-text("${title}")`);
    await toast.waitFor({ state: "visible", timeout: 10000 });
    return toast;
  }

  async waitForLoaderToHide() {
    const loader = this.page.locator(".animate-spin, [role='progressbar']").first();
    try {
      await loader.waitFor({ state: "hidden", timeout: 5000 });
    } catch {
      // loader may not exist
    }
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  getByPlaceholder(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder);
  }

  async fillInput(label: string, value: string) {
    const input = this.page.locator(`label:has-text("${label}") + input, label:has-text("${label}") ~ input`).first();
    await input.fill(value);
  }
}
