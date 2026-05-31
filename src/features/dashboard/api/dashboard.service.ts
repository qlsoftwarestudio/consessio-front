import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { useAppStore } from "@/shared/store/app-store";
import { toApiLeadStatus } from "@/shared/api/mappers";
import type { ApiLeadStatus } from "@/shared/api/types";
import type { DashboardSnapshot } from "@/shared/api/mappers";
import { LEAD_STATUSES } from "@/shared/constants/domain";
import type { ApiPage, ApiVehicle, ApiQuotation, ApiTestDrive } from "@/shared/api/types";

export const dashboardService = {
  async get(): Promise<DashboardSnapshot> {
    if (env.useMockApi) {
      const { leads, vehicles, quotations, testDrives } = useAppStore.getState();
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const pipeline = LEAD_STATUSES.map((status) => ({
        status,
        count: leads.filter((l) => l.status === status).length,
      }));

      const totalQuotationValue = quotations.reduce((acc, q) => acc + q.totalArs, 0);
      const won = leads.filter((l) => l.status === "won").length;
      const conversionRate = leads.length > 0 ? (won / leads.length) * 100 : 0;

      return {
        activeLeads: leads.filter((l) => l.status !== "won" && l.status !== "lost").length,
        availableVehicles: vehicles.filter((v) => v.status === "disponible").length,
        quotationsMonth: quotations.filter((q) => new Date(q.createdAt) >= monthStart).length,
        pendingTestDrives: testDrives.filter((t) => t.status === "agendado").length,
        pipeline,
        conversionRate,
        totalQuotationValue,
      };
    }

    const [leadStats, vehiclesAvailable, quotationsPage, testDrivesPage] = await Promise.all([
      http<Partial<Record<ApiLeadStatus, number>>>(ENDPOINTS.leads.statsByStatus),
      http<ApiPage<ApiVehicle>>(ENDPOINTS.vehicles.available, { query: { page: 0, size: 1 } }),
      http<ApiPage<ApiQuotation>>(ENDPOINTS.quotations.base, { query: { page: 0, size: 1 } }),
      http<ApiPage<ApiTestDrive>>(ENDPOINTS.testDrives.base, { query: { page: 0, size: 100 } }),
    ]);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const pipeline = LEAD_STATUSES.map((status) => ({
      status,
      count: leadStats[toApiLeadStatus(status) as ApiLeadStatus] ?? 0,
    }));

    const activeLeads =
      (pipeline.find((p) => p.status === "new")?.count ?? 0) +
      (pipeline.find((p) => p.status === "contacted")?.count ?? 0) +
      (pipeline.find((p) => p.status === "qualified")?.count ?? 0) +
      (pipeline.find((p) => p.status === "test-drive-agendado")?.count ?? 0) +
      (pipeline.find((p) => p.status === "test-drive-completado")?.count ?? 0) +
      (pipeline.find((p) => p.status === "quoted")?.count ?? 0) +
      (pipeline.find((p) => p.status === "negociacion")?.count ?? 0) +
      (pipeline.find((p) => p.status === "reservado")?.count ?? 0) +
      (pipeline.find((p) => p.status === "documentacion-completa")?.count ?? 0) +
      (pipeline.find((p) => p.status === "no-contesta")?.count ?? 0);

    const won = pipeline.find((p) => p.status === "won")?.count ?? 0;
    const lost = pipeline.find((p) => p.status === "lost")?.count ?? 0;
    const totalLeads = activeLeads + won + lost;
    const conversionRate = totalLeads > 0 ? (won / totalLeads) * 100 : 0;

    const pendingTestDrives = testDrivesPage.content.filter(
      (t) => t.status === "AGENDADO" || t.status === "CONFIRMADO"
    ).length;

    return {
      activeLeads,
      availableVehicles: vehiclesAvailable.totalElements,
      quotationsMonth: quotationsPage.totalElements,
      pendingTestDrives,
      pipeline,
      conversionRate,
      totalQuotationValue: 0,
    };
  },
};

export type { DashboardSnapshot };
export { toApiLeadStatus };
