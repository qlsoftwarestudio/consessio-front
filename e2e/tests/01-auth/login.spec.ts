import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { e2eEnv } from "../../utils/env";

test.describe("Login", () => {
  test("should login as GERENTE and see dashboard", async ({ page }) => {
    test.skip(!e2eEnv.adminEmail || !e2eEnv.adminPassword, "E2E credentials not configured");

    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await login.goto();
    await login.login(e2eEnv.adminEmail, e2eEnv.adminPassword);
    await dashboard.expectOnDashboard();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login("wrong@example.com", "wrongpass");

    // Should stay on login page
    await login.expectOnLoginPage();
  });
});
