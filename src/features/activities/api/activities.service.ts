import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { fromApiActivity } from "@/shared/api/mappers";
import type { ApiActivity, ApiActivityType } from "@/shared/api/types";
import type { Activity } from "@/shared/types/domain";
import { useAppStore } from "@/shared/store/app-store";

const orgId = () => useAppStore.getState().organization?.id ?? "org-mock";

export const activitiesService = {
  async listByLead(leadId: number | string): Promise<Activity[]> {
    if (env.useMockApi) {
      return useAppStore
        .getState()
        .activities.filter((a) => a.leadId === String(leadId));
    }
    const res = await http<ApiActivity[]>(ENDPOINTS.activities.byLead(leadId));
    return res.map((a) => fromApiActivity(a, orgId()));
  },

  async timeline(leadId: number | string): Promise<Activity[]> {
    if (env.useMockApi) {
      return activitiesService.listByLead(leadId);
    }
    const res = await http<ApiActivity[]>(ENDPOINTS.activities.timeline(leadId));
    return res.map((a) => fromApiActivity(a, orgId()));
  },

  async byType(type: ApiActivityType): Promise<Activity[]> {
    if (env.useMockApi) {
      return useAppStore
        .getState()
        .activities.filter((a) => a.type === type.toLowerCase().replace(/_/g, "_") as Activity["type"]);
    }
    const res = await http<ApiActivity[]>(ENDPOINTS.activities.byType(type));
    return res.map((a) => fromApiActivity(a, orgId()));
  },

  async myActivities(): Promise<Activity[]> {
    if (env.useMockApi) {
      const userId = useAppStore.getState().user?.id;
      return useAppStore.getState().activities.filter((a) => a.actorId === userId);
    }
    const res = await http<ApiActivity[]>(ENDPOINTS.activities.myActivities);
    return res.map((a) => fromApiActivity(a, orgId()));
  },

  async stats(start: string, end: string): Promise<Record<string, number>> {
    if (env.useMockApi) return {};
    return http<Record<string, number>>(ENDPOINTS.activities.stats, {
      query: { start, end },
    });
  },

  async create(payload: {
    leadId?: number;
    type: ApiActivityType;
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<Activity> {
    if (env.useMockApi) {
      useAppStore.getState().pushActivity({
        leadId: payload.leadId ? String(payload.leadId) : undefined,
        type: "note",
        message: payload.description,
        actorId: useAppStore.getState().user?.id,
      });
      const last = useAppStore.getState().activities[0];
      return last ?? {
        id: "a-mock",
        organizationId: orgId(),
        type: "note",
        message: payload.description,
        createdAt: new Date().toISOString(),
      };
    }
    const res = await http<ApiActivity>(ENDPOINTS.activities.base, {
      method: "POST",
      body: payload,
    });
    return fromApiActivity(res, orgId());
  },
};
