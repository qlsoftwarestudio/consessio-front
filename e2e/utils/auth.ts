import type { Page } from "@playwright/test";
import { e2eEnv } from "./env";

export async function loginAs(page: Page, tenantCode: string, email: string, password: string) {
  await page.goto("/login");
  await page.waitForURL("**/login", { timeout: 10000 });
  await page.getByLabel("Código de empresa").fill(tenantCode);
  await page.locator("input[type='email']").fill(email);
  await page.locator("input[type='password']").fill(password);
  await page.locator("button[type='submit']").click();
  // FIXME: Frontend no carga organization del backend en signIn (solo en mock mode).
  // AppLayout.tsx redirige a /onboarding si !org.
  try {
    await page.waitForURL("**/dashboard", { timeout: 5000 });
  } catch {
    await page.waitForURL("**/onboarding", { timeout: 15000 });
  }
}

/** Login con credenciales de admin configuradas en .env.e2e */
export async function loginAsAdmin(page: Page) {
  if (!e2eEnv.tenantCode || !e2eEnv.adminEmail || !e2eEnv.adminPassword) {
    throw new Error("E2E_TENANT_CODE, E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD must be set in .env.e2e");
  }
  await loginAs(page, e2eEnv.tenantCode, e2eEnv.adminEmail, e2eEnv.adminPassword);
}

export async function logout(page: Page) {
  await page.goto("/login");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
