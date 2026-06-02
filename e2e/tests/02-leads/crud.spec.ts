import { test, expect } from "@playwright/test";
import { LeadsPage } from "../../pages/LeadsPage";
import { leadFactory } from "../../fixtures/test-data";
import { loginAsAdmin } from "../../utils/auth";

test.describe("Leads CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("should create a new lead", async ({ page }) => {
    const leads = new LeadsPage(page);
    const lead = leadFactory();

    await leads.goto();
    await leads.createLead({
      fullName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
    });

    await leads.expectLeadCreated();
  });

  test("should search for a lead", async ({ page }) => {
    const leads = new LeadsPage(page);

    await leads.goto();
    await leads.searchLead("test");

    // Verificar que el search input de la tabla tiene el valor buscado
    await expect(page.locator('input[placeholder="Buscar por nombre, teléfono o email"]').first()).toHaveValue("test");
  });
});
