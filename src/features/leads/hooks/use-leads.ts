import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadsService, type ListParams } from "../api/leads.service";
import type { Lead, LeadStatus } from "@/shared/types/domain";

export const leadsKeys = {
  all: ["leads"] as const,
  list: (p: ListParams) => ["leads", "list", p] as const,
  detail: (id: string) => ["leads", "detail", id] as const,
};

export const useLeads = (params: ListParams = {}) =>
  useQuery({
    queryKey: leadsKeys.list(params),
    queryFn: () => leadsService.list(params),
  });

export const useLead = (id?: string) =>
  useQuery({
    enabled: Boolean(id),
    queryKey: leadsKeys.detail(id ?? ""),
    queryFn: () => leadsService.get(id!),
  });

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: leadsService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadsKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useSetLeadStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      leadsService.setStatus(id, status),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: leadsKeys.detail(id) });
      const prev = qc.getQueryData<Lead>(leadsKeys.detail(id));
      if (prev) qc.setQueryData(leadsKeys.detail(id), { ...prev, status });
      return { prev };
    },
    onError: (_e, vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(leadsKeys.detail(vars.id), ctx.prev);
    },
    onSettled: (_d, _e, vars) => {
      qc.invalidateQueries({ queryKey: leadsKeys.all });
      qc.invalidateQueries({ queryKey: leadsKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useAssignLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      leadsService.assign(id, userId),
    onMutate: async ({ id, userId }) => {
      await qc.cancelQueries({ queryKey: leadsKeys.detail(id) });
      const prev = qc.getQueryData<Lead>(leadsKeys.detail(id));
      if (prev) qc.setQueryData(leadsKeys.detail(id), { ...prev, assignedTo: userId });
      return { prev };
    },
    onError: (_e, vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(leadsKeys.detail(vars.id), ctx.prev);
    },
    onSettled: (_d, _e, vars) => {
      qc.invalidateQueries({ queryKey: leadsKeys.all });
      qc.invalidateQueries({ queryKey: leadsKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
