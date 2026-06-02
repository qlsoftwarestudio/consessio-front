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
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
    });

    await leads.expectLeadInTable(lead.email);
  });

  test("should search for a lead", async ({ page }) => {
    const leads = new LeadsPage(page);
    const lead = leadFactory();

    // Create lead via UI for consistency (API requires token from login)
    await leads.createLead({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
    });
    await leads.expectLeadInTable(lead.email);

    await leads.goto();
    await leads.searchLead(lead.email);

    await expect(page.locator(`text=${lead.email}`)).toBeVisible();
  });
});
