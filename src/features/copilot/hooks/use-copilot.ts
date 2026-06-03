import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/auth/useAuth";
import { copilotService } from "../api/copilot.service";

export const copilotKeys = {
  dailySummary: ["copilot", "daily-summary"] as const,
  hotLeads: ["copilot", "hot-leads"] as const,
  abandonedLeads: ["copilot", "abandoned-leads"] as const,
  nextActions: ["copilot", "next-actions"] as const,
  myNextActions: ["copilot", "my-next-actions"] as const,
  ranking: ["copilot", "ranking"] as const,
};

export const useDailySummary = () =>
  useQuery({
    queryKey: copilotKeys.dailySummary,
    queryFn: () => copilotService.dailySummary(),
  });

export const useHotLeads = () =>
  useQuery({
    queryKey: copilotKeys.hotLeads,
    queryFn: () => copilotService.hotLeads(),
  });

export const useAbandonedLeads = () =>
  useQuery({
    queryKey: copilotKeys.abandonedLeads,
    queryFn: () => copilotService.abandonedLeads(),
  });

export const useNextActions = () => {
  const { role } = useAuth();
  const isManager = role === "GERENTE" || role === "SUPERVISOR";
  return useQuery({
    queryKey: isManager ? copilotKeys.nextActions : copilotKeys.myNextActions,
    queryFn: () => (isManager ? copilotService.nextActions() : copilotService.myNextActions()),
  });
};

export const useRanking = () =>
  useQuery({
    queryKey: copilotKeys.ranking,
    queryFn: () => copilotService.ranking(),
  });
