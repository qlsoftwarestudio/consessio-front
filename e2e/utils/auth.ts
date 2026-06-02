import type { Page } from "@playwright/test";
import { e2eEnv } from "./env";

export async function loginAs(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.waitForURL("**/login", { timeout: 10000 });
  await page.locator("input[type='email']").fill(email);
  await page.locator("input[type='password']").fill(password);
  await page.locator("button[type='submit']").click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
}

/** Login con credenciales de admin configuradas en .env.e2e */
export async function loginAsAdmin(page: Page) {
  if (!e2eEnv.adminEmail || !e2eEnv.adminPassword) {
    throw new Error("E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD must be set in .env.e2e");
  }
  await loginAs(page, e2eEnv.adminEmail, e2eEnv.adminPassword);
}

export async function logout(page: Page) {
  await page.goto("/login");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
