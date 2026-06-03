import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activitiesService } from "../api/activities.service";
import type { ApiActivityType } from "@/shared/api/types";

export const activitiesKeys = {
  all: ["activities"] as const,
  byLead: (leadId: number | string) => ["activities", "lead", leadId] as const,
  timeline: (leadId: number | string) => ["activities", "timeline", leadId] as const,
  myActivities: ["activities", "my"] as const,
};

export const useActivitiesByLead = (leadId?: number | string) =>
  useQuery({
    enabled: Boolean(leadId),
    queryKey: activitiesKeys.byLead(leadId ?? ""),
    queryFn: () => activitiesService.listByLead(leadId!),
  });

export const useTimeline = (leadId?: number | string) =>
  useQuery({
    enabled: Boolean(leadId),
    queryKey: activitiesKeys.timeline(leadId ?? ""),
    queryFn: () => activitiesService.timeline(leadId!),
  });

export const useMyActivities = () =>
  useQuery({
    queryKey: activitiesKeys.myActivities,
    queryFn: () => activitiesService.myActivities(),
  });

export const useCreateActivity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      leadId?: number;
      type: ApiActivityType;
      description: string;
      metadata?: Record<string, unknown>;
    }) => activitiesService.create(payload),
    onSuccess: (_data, vars) => {
      if (vars.leadId) {
        qc.invalidateQueries({ queryKey: activitiesKeys.byLead(vars.leadId) });
        qc.invalidateQueries({ queryKey: activitiesKeys.timeline(vars.leadId) });
      }
      qc.invalidateQueries({ queryKey: activitiesKeys.all });
    },
  });
};
