import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { useAppStore } from "@/shared/store/app-store";
import { fromApiTestDrive } from "@/shared/api/mappers";
import type { ApiPage, ApiTestDrive, ApiTestDriveCreatePayload } from "@/shared/api/types";
import type { TestDrive } from "@/shared/types/domain";

const orgId = () => useAppStore.getState().organization?.id ?? "org-mock";

export const testDrivesService = {
  async list() {
    if (env.useMockApi) return useAppStore.getState().testDrives;
    const res = await http<ApiPage<ApiTestDrive>>(ENDPOINTS.testDrives.base, {
      query: { page: 0, size: 100 },
    });
    return res.content.map((t) => fromApiTestDrive(t, orgId()));
  },

  async calendar(date: string) {
    if (env.useMockApi) {
      return useAppStore.getState().testDrives.filter((t) => t.scheduledAt.startsWith(date));
    }
    const res = await http<ApiTestDrive[]>(ENDPOINTS.testDrives.calendar, { query: { date } });
    return res.map((t) => fromApiTestDrive(t, orgId()));
  },

  async create(input: {
    leadId: string;
    vehicleId: string;
    sellerId?: string;
    scheduledAt: string;
    durationMin: number;
    notes?: string;
  }): Promise<TestDrive> {
    if (env.useMockApi) {
      return useAppStore.getState().addTestDrive({
        leadId: input.leadId,
        vehicleId: input.vehicleId,
        sellerId: input.sellerId ?? "",
        scheduledAt: input.scheduledAt,
        durationMin: input.durationMin,
        notes: input.notes,
      });
    }
    const payload: ApiTestDriveCreatePayload = {
      scheduledAt: input.scheduledAt,
      durationMinutes: input.durationMin,
      notes: input.notes,
      lead: { id: Number(input.leadId) },
      vehicle: { id: Number(input.vehicleId) },
    };
    const res = await http<ApiTestDrive>(ENDPOINTS.testDrives.base, { method: "POST", body: payload });
    return fromApiTestDrive(res, orgId());
  },

  async confirm(id: string) {
    if (env.useMockApi) {
      useAppStore.setState({
        testDrives: useAppStore.getState().testDrives.map((t) =>
          t.id === id ? { ...t, status: "confirmado" as const } : t,
        ),
      });
      return;
    }
    await http(ENDPOINTS.testDrives.confirm(id), { method: "PUT" });
  },

  async complete(id: string, notes?: string) {
    if (env.useMockApi) {
      useAppStore.setState({
        testDrives: useAppStore.getState().testDrives.map((t) =>
          t.id === id ? { ...t, status: "realizado" } : t,
        ),
      });
      return;
    }
    await http(ENDPOINTS.testDrives.complete(id), { method: "PUT", body: { notes } });
  },

  async cancel(id: string, reason: string) {
    if (env.useMockApi) {
      useAppStore.setState({
        testDrives: useAppStore.getState().testDrives.map((t) =>
          t.id === id ? { ...t, status: "cancelado" } : t,
        ),
      });
      return;
    }
    await http(ENDPOINTS.testDrives.cancel(id), { method: "PUT", body: { notes: reason } });
  },
};
