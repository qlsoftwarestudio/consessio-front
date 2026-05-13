import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { useAppStore } from "@/shared/store/app-store";
import { fromApiDashboard, toApiLeadStatus } from "@/shared/api/mappers";
import type { ApiDashboard } from "@/shared/api/types";
import type { DashboardSnapshot } from "@/shared/api/mappers";
import { LEAD_STATUSES } from "@/shared/constants/domain";

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
    const res = await http<ApiDashboard>(ENDPOINTS.dashboard.base);
    return fromApiDashboard(res);
  },
};

export type { DashboardSnapshot };
// Helper exportado para uso en otros servicios
export { toApiLeadStatus };
