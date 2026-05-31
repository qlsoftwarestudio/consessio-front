import { env } from "@/shared/config/env";
import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { useAppStore } from "@/shared/store/app-store";
import {
  fromApiLead,
  toApiLeadCreate,
  toApiLeadStatus,
} from "@/shared/api/mappers";
import type { ApiLead, ApiLeadStatus, ApiPage } from "@/shared/api/types";
import type { Lead, LeadSource, LeadStatus } from "@/shared/types/domain";

export interface ListParams {
  page?: number;
  size?: number;
  sort?: string;
  query?: string;
  status?: LeadStatus;
  /** Si true, usa /api/leads/my-leads (vendedor) en vez del listado completo. */
  onlyMine?: boolean;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

const orgId = () => useAppStore.getState().organization?.id ?? "org-mock";

export const leadsService = {
  async list(params: ListParams = {}): Promise<PagedResult<Lead>> {
    const page = params.page ?? 0;
    const size = params.size ?? 20;

    if (env.useMockApi) {
      const userId = useAppStore.getState().user?.id;
      const all = useAppStore.getState().leads.filter((l) => {
        if (params.onlyMine && userId && l.assignedTo !== userId) return false;
        if (params.status && l.status !== params.status) return false;
        if (params.query) {
          const t = params.query.toLowerCase();
          if (
            !l.fullName.toLowerCase().includes(t) &&
            !l.phone.includes(t) &&
            !l.email?.toLowerCase().includes(t)
          )
            return false;
        }
        return true;
      });
      const start = page * size;
      return {
        items: all.slice(start, start + size),
        total: all.length,
        page,
        size,
        totalPages: Math.max(1, Math.ceil(all.length / size)),
      };
    }

    const path = params.onlyMine
      ? ENDPOINTS.leads.myLeads
      : params.query
        ? ENDPOINTS.leads.search
        : params.status
          ? ENDPOINTS.leads.byStatus(toApiLeadStatus(params.status))
          : ENDPOINTS.leads.base;

    const res = await http<ApiPage<ApiLead>>(path, {
      query: { page, size, sort: params.sort, query: params.query },
    });
    return {
      items: res.content.map((l) => fromApiLead(l, orgId())),
      total: res.totalElements,
      page: res.number,
      size: res.size,
      totalPages: res.totalPages,
    };
  },

  async get(id: string): Promise<Lead | null> {
    if (env.useMockApi) {
      return useAppStore.getState().leads.find((l) => l.id === id) ?? null;
    }
    const res = await http<ApiLead>(ENDPOINTS.leads.byId(id));
    return fromApiLead(res, orgId());
  },

  async create(input: {
    fullName: string;
    phone?: string;
    email?: string;
    source: LeadSource;
    notes?: string;
    assignedTo?: string;
  }): Promise<Lead> {
    if (env.useMockApi) {
      return useAppStore.getState().addLead({
        fullName: input.fullName,
        phone: input.phone ?? "",
        email: input.email,
        source: input.source,
        interestNote: input.notes,
        assignedTo: input.assignedTo,
      });
    }
    const payload = toApiLeadCreate({
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      source: input.source,
      notes: input.notes,
      assignedToUserId: input.assignedTo ? Number(input.assignedTo) : undefined,
    });
    const res = await http<ApiLead>(ENDPOINTS.leads.base, { method: "POST", body: payload });
    return fromApiLead(res, orgId());
  },

  async setStatus(id: string, status: LeadStatus): Promise<void> {
    if (env.useMockApi) {
      useAppStore.getState().setLeadStatus(id, status);
      return;
    }
    await http(ENDPOINTS.leads.setStatus(id), {
      method: "PUT",
      body: toApiLeadStatus(status),
    });
  },

  async assign(id: string, userId: string): Promise<void> {
    if (env.useMockApi) {
      useAppStore.getState().updateLead(id, { assignedTo: userId });
      return;
    }
    await http(ENDPOINTS.leads.assign(id, userId), {
      method: "PUT",
    });
  },

  async statsByStatus(): Promise<Partial<Record<ApiLeadStatus, number>>> {
    if (env.useMockApi) {
      const counts: Partial<Record<ApiLeadStatus, number>> = {};
      useAppStore.getState().leads.forEach((l) => {
        const k = toApiLeadStatus(l.status);
        counts[k] = (counts[k] ?? 0) + 1;
      });
      return counts;
    }
    return http(ENDPOINTS.leads.statsByStatus);
  },
};
