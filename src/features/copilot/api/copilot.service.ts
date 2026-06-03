import { http } from "@/shared/api/http-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import type {
  ApiCopilotDailySummary,
  ApiCopilotHotLead,
  ApiCopilotAbandonedLead,
  ApiCopilotNextAction,
  ApiCopilotRankingItem,
} from "@/shared/api/types";

export const copilotService = {
  async dailySummary(): Promise<ApiCopilotDailySummary> {
    return http<ApiCopilotDailySummary>(ENDPOINTS.copilot.dailySummary, { silent: true });
  },

  async hotLeads(limit = 10): Promise<ApiCopilotHotLead[]> {
    return http<ApiCopilotHotLead[]>(ENDPOINTS.copilot.hotLeads, { query: { limit }, silent: true });
  },

  async abandonedLeads(days = 5): Promise<ApiCopilotAbandonedLead[]> {
    return http<ApiCopilotAbandonedLead[]>(ENDPOINTS.copilot.abandonedLeads, {
      query: { days },
      silent: true,
    });
  },

  async nextActions(limit = 10): Promise<ApiCopilotNextAction[]> {
    return http<ApiCopilotNextAction[]>(ENDPOINTS.copilot.nextActions, { query: { limit }, silent: true });
  },

  async myNextActions(limit = 10): Promise<ApiCopilotNextAction[]> {
    return http<ApiCopilotNextAction[]>(ENDPOINTS.copilot.myNextActions, { query: { limit }, silent: true });
  },

  async ranking(days = 30): Promise<ApiCopilotRankingItem[]> {
    return http<ApiCopilotRankingItem[]>(ENDPOINTS.copilot.ranking, { query: { days }, silent: true });
  },
};
